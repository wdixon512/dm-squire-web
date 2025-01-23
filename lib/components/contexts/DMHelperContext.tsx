'use client';

import { createContext, useEffect, useState, useMemo } from 'react';
import { useToast } from '@chakra-ui/react';
import { CombatState, Combat } from '@lib/models/dm-helper/Combat';
import { DEFAULT_ROOM, Room } from '@lib/models/dm-helper/Room';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { Entity, EntityType } from '@lib/models/dm-helper/Entity';
import { Hero } from '@lib/models/dm-helper/Hero';
import { Mob } from '@lib/models/dm-helper/Mob';
import { getNextEntityNumber, validateMobHealth, validateName } from '@lib/util/dm-helper-utils';
import { sanitizeData } from '@lib/util/firebase-utils';
import { auth, rtdb } from '@services/firebase';
import { ref, get, set, update, push, onValue } from 'firebase/database';
import useLocalStorage from '@lib/hooks/useLocalStorage';
import { getRoomByOwnerUID } from '@lib/services/dm-helper-firebase-service';
import { toKebabCase } from '@lib/util/js-utils';

export const DMHelperContext = createContext({
  room: {} as Room,
  setRoom: (() => null) as React.Dispatch<React.SetStateAction<Room | null>>,
  createRoom: async (): Promise<string | undefined | null> => null,
  joinRoom: async (roomId: string): Promise<void> => {},
  leaveRoom: async (): Promise<void> => {},
  joinRoomLink: undefined as string | undefined,
  entities: [] as Entity[],
  updateEntities: (() => null) as React.Dispatch<React.SetStateAction<Entity[]>>,
  removeEntity: (entity: Entity): void => {},
  addMob: (name: string, health: number | undefined, initiative: number | undefined): boolean => false,
  addHero: (name: string, health: number | undefined, initiative: number | undefined): boolean => false,
  resetHeroInitiatives: (): void => {},
  mobFavorites: [] as Mob[],
  updateMobFavorites: (mobs: Mob[]): void => {},
  isClient: false,
  heroes: [] as Hero[],
  combatStarted: false,
  updateCombatStarted: (started: boolean): void => {},
  clearMobs: (): void => {},
  loadingFirebaseRoom: false,
  readOnlyRoom: false,
});

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

  const heroes = useMemo(() => entities.filter((entity) => entity.type === EntityType.HERO) as Hero[], [entities]);
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
          getRoomByOwnerUID(user.uid).then((dbRoom) => {
            if (dbRoom) {
              syncContextWithRoom(dbRoom);
            } else {
              setRoom({
                ...room,
                ownerUID: user.uid,
                combat: {
                  entities: entities,
                  combatState: combatStarted ? CombatState.IN_PROGRESS : CombatState.NOT_IN_PROGRESS,
                } as Combat,
                mobFavorites: mobFavorites,
                heroes: heroes,
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
            } as Combat,
            mobFavorites: mobFavorites,
            heroes: heroes,
          });
        }
      }

      setloadingFirebaseRoom(false);
    });

    return () => unsubscribe();
  }, []);

  // Commit changes to the room to Realtime Database
  useEffect(() => {
    if (!commitPending || joinedRoomId) return;

    let syncChangesWithFirebase = room?.syncWithFirebase;

    const updatedRoom: Room = {
      ...room,
      combat: {
        ...room?.combat,
        entities: entities,
        combatState: combatStarted ? CombatState.IN_PROGRESS : CombatState.NOT_IN_PROGRESS,
      },
      mobFavorites: mobFavorites,
      heroes: heroes,
    };

    // Firebase doesn't like `undefined` values, so we sanitize the data before updating Realtime Database
    const sanitizedRoom = sanitizeData(updatedRoom);
    setRoom(sanitizedRoom);

    if (!auth.currentUser) {
      // If user isn't authenticated, and the room they're in is set to sync with Firebase, we can't update the room
      if (updatedRoom.syncWithFirebase) {
        toast({
          title: 'Authentication Error',
          description: 'User is not authenticated',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }

      syncChangesWithFirebase = false;
    }

    // If the user is authenticated, but they are not the owner of the room, we can't update the room
    if (auth.currentUser && updatedRoom.ownerUID !== auth.currentUser.uid) {
      toast({
        title: 'Authorization Error',
        description: 'You are not the owner of this room. You cannot make updates to it.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });

      syncChangesWithFirebase = false;
    }

    // Update the room in Realtime Database
    if (syncChangesWithFirebase) {
      try {
        if (!sanitizedRoom.id) {
          throw new Error('No room ID found. Failed to sync room with cloud.');
        }
        const roomRef = ref(rtdb, `rooms/${sanitizedRoom.id}`);
        update(roomRef, sanitizedRoom).catch((error) => {
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
    }

    setCommitPending(false);
  }, [commitPending, entities, mobFavorites, heroes, combatStarted, room]);

  const createRoom = async (): Promise<string | undefined | null> => {
    const user = auth.currentUser;

    if (!user) {
      toast({
        title: 'Authentication Error',
        description: 'User is not authenticated',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    let newRoomData = {
      ...room,
      ownerUID: user.uid,
      syncWithFirebase: true,
    } as Room;

    try {
      const roomRef = ref(rtdb, `rooms`);
      const newRoomRef = await push(roomRef, newRoomData); // generates a unique ID for the room
      const newRoomId = newRoomRef.key;

      if (newRoomId) {
        newRoomData = { ...newRoomData, id: newRoomId };
        setRoom(newRoomData);
        await set(newRoomRef, newRoomData);
        toast({
          title: 'Room Created',
          description: 'Your room has been created!',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });

        const roomLink = `${window.location.origin}/join/${newRoomId}`;
        setJoinRoomLink(roomLink);

        return roomLink;
      }

      throw new Error('Failed to create room; no room ID generated.');
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
      const roomRef = ref(rtdb, `rooms/${roomId}`);
      const roomSnapshot = await get(roomRef);

      if (roomSnapshot.exists()) {
        const dbRoom = roomSnapshot.val() as Room;
        syncContextWithRoom(dbRoom);

        // Only show the toast if we've joined a new room
        if (joinedRoomId !== dbRoom.id) {
          toast({
            title: 'Room Joined',
            description: `You have successfully joined the room with ID: ${roomId}`,
            status: 'success',
            duration: 5000,
            isClosable: true,
          });
        }
        setJoinedRoomId(dbRoom.id);

        // Start listening for real-time updates
        onValue(roomRef, (snapshot) => {
          if (snapshot.exists()) {
            const updatedRoom = snapshot.val() as Room;
            syncContextWithRoom(updatedRoom); // Update context state with new data
          } else {
            console.warn(`Room with ID ${roomId} no longer exists.`);
            toast({
              title: 'Room Removed',
              description: 'The room you joined has been deleted.',
              status: 'warning',
              duration: 5000,
              isClosable: true,
            });
          }
        });
      } else {
        toast({
          title: 'Room not found',
          description: 'The room you are trying to join does not exist.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error joining room:', error);
      toast({
        title: 'Error joining room',
        description: 'An error occurred while trying to join the room.',
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

  const addMob = (name: string, health: number | undefined, initiative: number | undefined): boolean => {
    if (!validateName(name, toast) || !validateMobHealth(health, toast)) return false;

    const mob: Mob = {
      id: `${toKebabCase(name.toLowerCase())}-${getNextEntityNumber(entities, name)}`,
      name,
      health,
      number: getNextEntityNumber(entities, name),
      initiative,
      type: EntityType.MOB,
    };

    const addMobFavorite = (mob: Mob) => {
      if (!mobFavorites.some((m) => m.name === mob.name)) {
        const updatedFavorites = [...mobFavorites, mob];
        setMobFavorites(updatedFavorites);
      }
    };

    const updatedEntities = [...entities, mob];
    setEntities(updatedEntities);
    addMobFavorite(mob);
    scheduleCommitRoomChanges();

    return true;
  };

  const addHero = (name: string, health: number | undefined, initiative: number | undefined): boolean => {
    if (!validateName(name, toast)) return false;

    const hero: Hero = {
      id: `${toKebabCase(name.toLowerCase())}-${getNextEntityNumber(entities, name)}`,
      name,
      health,
      number: getNextEntityNumber(entities, name),
      initiative,
      type: EntityType.HERO,
    };

    const updatedEntities = [...entities, hero];
    setEntities(updatedEntities);
    scheduleCommitRoomChanges();

    return true;
  };

  const updateEntities = (entities: Entity[]) => {
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

  const resetHeroInitiatives = (): void => {
    const updatedEntities = entities.map((entity) =>
      entity.type === EntityType.HERO ? { ...entity, initiative: undefined } : entity
    );
    setEntities(updatedEntities);
    scheduleCommitRoomChanges();
  };

  const removeEntity = (entity: Entity): void => {
    const updatedEntities = entities.filter((e) => e.id !== entity.id);
    setEntities(updatedEntities);
    scheduleCommitRoomChanges();
  };

  const clearMobs = (): void => {
    const updatedEntities = entities.filter((entity) => entity.type !== EntityType.MOB);
    setEntities(updatedEntities);
    scheduleCommitRoomChanges();
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
        updateEntities,
        removeEntity,
        addMob,
        addHero,
        resetHeroInitiatives,
        mobFavorites,
        updateMobFavorites,
        isClient,
        heroes,
        combatStarted,
        updateCombatStarted,
        clearMobs,
        loadingFirebaseRoom,
        readOnlyRoom,
      }}
    >
      {children}
    </DMHelperContext.Provider>
  );
};
