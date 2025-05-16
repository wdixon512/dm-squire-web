'use client';

import { createContext, useEffect, useState, useMemo } from 'react';
import { useToast } from '@chakra-ui/react';
import { CombatState } from '@lib/models/dm-helper/Combat';
import { DEFAULT_ROOM, Room } from '@lib/models/dm-helper/Room';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { Entity, EntityType } from '@lib/models/dm-helper/Entity';
import { Hero } from '@lib/models/dm-helper/Hero';
import { Mob } from '@lib/models/dm-helper/Mob';
import { Ally } from '@lib/models/dm-helper/Ally';
import useLocalStorage from '@lib/hooks/useLocalStorage';
import { DMHelperContextType } from './DMHelperContextTypes';
import { useRoomService } from '@lib/hooks/use-room-service';
import { useEntityService } from '@lib/hooks/use-entity-service';

/**
 * This file defines the DMHelperContext and DMHelperContextProvider components.
 * The DMHelperContext provides a way to share state and functions related to the DM Helper component across the application.
 * The DMHelperContextProvider component manages the state and provides functions to create, join, and leave rooms,
 * as well as manage entities, combat state, and mob favorites.
 */
export const DMHelperContext = createContext<DMHelperContextType>({} as DMHelperContextType);

export const DMHelperContextProvider = ({ children }) => {
  const [room, setRoom] = useState<Room>(DEFAULT_ROOM);
  const [entities, setEntities] = useState<Entity[]>([]);
  const [mobFavorites, setMobFavorites] = useState<Mob[]>([]);
  const [combatStarted, setCombatStarted] = useState<boolean>(false);
  const [isClient, setIsClient] = useState(false);
  const [commitPending, setCommitPending] = useState(false);
  const [joinRoomLink, setJoinRoomLink] = useState<string>();
  const [loadingFirebaseRoom, setloadingFirebaseRoom] = useState(true);
  const [joinedRoomId, setJoinedRoomId] = useLocalStorage<string | undefined | null>('joinedRoomId', null);

  const toast = useToast();
  const roomService = useRoomService();
  const entityService = useEntityService();

  const heroes = useMemo(() => entities.filter((entity) => entity.type === EntityType.HERO) as Hero[], [entities]);
  const allies = useMemo(() => entities.filter((entity) => entity.type === EntityType.ALLY) as Ally[], [entities]);

  const readOnlyRoom = useMemo(() => isClient && joinedRoomId !== null, [isClient, joinedRoomId]);

  // Utilities to update Room context state & Realtime Database
  const scheduleCommitRoomChanges = () => setCommitPending(true);

  // On component mount, fetch the room from Realtime Database
  useEffect(() => {
    setIsClient(true);

    // If localstorage is indicating that we've joined a room, join it
    if (joinedRoomId) {
      joinRoom(joinedRoomId);
      return;
    }

    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          setloadingFirebaseRoom(true);
          // Get room for firebase, and set our context state
          roomService.getRoomByOwnerUID(user.uid).then((dbRoom) => {
            if (dbRoom) {
              syncContextWithRoom(dbRoom);
            } else {
              setRoom({
                ...room,
                ownerUID: user.uid,
                combat: {
                  entities: entities,
                  combatState: combatStarted ? CombatState.IN_PROGRESS : CombatState.NOT_IN_PROGRESS,
                },
                mobFavorites: mobFavorites,
                heroes: heroes,
                allies: allies,
              });
            }
          });
        } catch (error) {
          console.warn('Error fetching room:', error, 'Creating new room...');
          // If we fail to retrieve the room, create a new one
          setRoom({
            ...room,
            ownerUID: user.uid,
            combat: {
              entities: entities,
              combatState: combatStarted ? CombatState.IN_PROGRESS : CombatState.NOT_IN_PROGRESS,
            },
            mobFavorites: mobFavorites,
            heroes: heroes,
            allies: allies,
          });
        }
      }

      setloadingFirebaseRoom(false);
    });

    return () => unsubscribe();
  }, [joinedRoomId]);

  // Commit changes to the room to Realtime Database
  useEffect(() => {
    if (!commitPending || joinedRoomId) return;

    try {
      roomService.updateRoom(room, entities, mobFavorites, heroes, allies, combatStarted).catch((error) => {
        toast({
          title: 'Error Updating Room',
          description: error.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      });
    } catch (e) {
      console.error(e);
      toast({
        title: 'Error Updating Room',
        description: e.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }

    setCommitPending(false);
  }, [commitPending, entities, mobFavorites, heroes, allies, combatStarted, room]);

  const createRoom = async (): Promise<string | undefined | null> => {
    try {
      const roomId = await roomService.createRoom(room);
      if (roomId) {
        const roomLink = `${window.location.origin}/join/${roomId}`;
        setJoinRoomLink(roomLink);
        return roomLink;
      }
      return null;
    } catch (error) {
      toast({
        title: 'Error Creating Room',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return null;
    }
  };

  const joinRoom = async (roomId: string): Promise<void> => {
    try {
      setloadingFirebaseRoom(true);
      await roomService.joinRoom(roomId, syncContextWithRoom);
      setJoinedRoomId(roomId);
    } catch (error) {
      toast({
        title: 'Error joining room',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
    setloadingFirebaseRoom(false);
  };

  const leaveRoom = async (): Promise<void> => {
    setJoinedRoomId(null);
    window.location.reload();
  };

  const syncContextWithRoom = async (dbRoom: Room) => {
    setRoom(dbRoom);
    setEntities(dbRoom.combat?.entities || []);
    setMobFavorites(dbRoom.mobFavorites || []);
    setCombatStarted(dbRoom.combat?.combatState === CombatState.IN_PROGRESS);
    setJoinRoomLink(`${window.location.origin}/join/${dbRoom.id}`);
  };

  const addMob = (
    name: string,
    health: number | undefined,
    initiative: number | undefined,
    isLibraryMob?: boolean
  ): boolean => {
    const mob = entityService.addMob(name, health, initiative, isLibraryMob, entities);
    if (!mob) return false;

    updateProfileFromLibrary(mob);

    const updatedEntities = [...entities, mob];
    setEntities(updatedEntities);

    if (!mobFavorites.some((m) => m.name === mob.name)) {
      setMobFavorites([...mobFavorites, mob]);
    }

    scheduleCommitRoomChanges();
    return true;
  };

  const addHero = (
    name: string,
    health: number | undefined,
    initiative: number | undefined,
    profileUrl: string | undefined
  ): boolean => {
    const hero = entityService.addHero(name, health, initiative, profileUrl, entities);
    if (!hero) return false;

    updateProfileFromDndBeyond(hero, profileUrl);
    setEntities([...entities, hero]);
    scheduleCommitRoomChanges();
    return true;
  };

  const addAlly = (
    name: string,
    health: number | undefined,
    initiative: number | undefined,
    mobLibraryId?: string,
    profileUrl?: string
  ): boolean => {
    const ally = entityService.addAlly(name, health, initiative, mobLibraryId, profileUrl, entities);
    if (!ally) return false;

    updateProfileFromDndBeyond(ally, profileUrl);
    setEntities([...entities, ally]);
    scheduleCommitRoomChanges();
    return true;
  };

  const updateEntity = (entity: Entity): void => {
    const { updatedEntities, fieldsUpdated } = entityService.updateEntity(entities, entity);
    console.log('Updated entity:', updatedEntities, fieldsUpdated);
    if (fieldsUpdated?.includes('dndBeyondProfileUrl') && entity.dndBeyondProfileUrl && room.id) {
      roomService.updateProfilePictureFromDndBeyond(room.id, entity, entity.dndBeyondProfileUrl);
    }

    setEntities(updatedEntities);
    scheduleCommitRoomChanges();
  };

  const updateEntities = (entities: React.SetStateAction<Entity[]>) => {
    setEntities(entities);
    scheduleCommitRoomChanges();
  };

  const updateMobFavorites = (mobs: Mob[]): void => {
    setMobFavorites(mobs);
    scheduleCommitRoomChanges();
  };

  const updateCombatStarted = (started: boolean): void => {
    setCombatStarted(started);
    scheduleCommitRoomChanges();
  };

  const resetCombat = (): void => {
    setEntities(entityService.resetCombat(entities));
    scheduleCommitRoomChanges();
  };

  const removeEntity = (entity: Entity): void => {
    setEntities(entityService.removeEntity(entities, entity));
    scheduleCommitRoomChanges();
  };

  const clearMobs = (): void => {
    setEntities(entityService.clearMobs(entities));
    scheduleCommitRoomChanges();
  };

  const clearMobFavorites = (): void => {
    updateMobFavorites([]);
    scheduleCommitRoomChanges();
  };

  const updateProfileFromDndBeyond = (entity: Entity, profileUrl?: string): void => {
    if (profileUrl && room.id && entity) {
      roomService.updateProfilePictureFromDndBeyond(room.id, entity, profileUrl);
    }
  };

  const updateProfileFromLibrary = (entity: Entity): void => {
    if (room.id && entity) {
      roomService.updateProfilePictureFromLibrary(room.id, entity);
    }
  };

  return (
    <DMHelperContext.Provider
      value={{
        room,
        setRoom,
        createRoom,
        joinRoom,
        leaveRoom,
        joinRoomLink,
        entities,
        updateEntity,
        updateEntities,
        removeEntity,
        addMob,
        addHero,
        addAlly,
        resetCombat,
        mobFavorites,
        updateMobFavorites,
        isClient,
        heroes,
        allies,
        combatStarted,
        updateCombatStarted,
        clearMobs,
        clearMobFavorites,
        loadingFirebaseRoom,
        readOnlyRoom,
      }}
    >
      {children}
    </DMHelperContext.Provider>
  );
};
