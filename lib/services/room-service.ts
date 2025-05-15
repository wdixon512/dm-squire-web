import { Room } from '@lib/models/dm-helper/Room';
import { CombatState } from '@lib/models/dm-helper/Combat';
import { Entity } from '@lib/models/dm-helper/Entity';
import { Mob } from '@lib/models/dm-helper/Mob';
import { Hero } from '@lib/models/dm-helper/Hero';
import { Ally } from '@lib/models/dm-helper/Ally';
import { auth, rtdb } from '@services/firebase';
import { ref, get, set, update, push, onValue, orderByChild, equalTo, query } from 'firebase/database';
import { sanitizeData } from '@lib/util/firebase-utils';
import { ToastId, UseToastOptions } from '@chakra-ui/react';

export class RoomService {
  constructor(private toast: (options: UseToastOptions) => ToastId | undefined) {}

  async createRoom(room: Room): Promise<string | null> {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User is not authenticated');
    }

    let newRoomData = {
      ...room,
      ownerUID: user.uid,
      syncWithFirebase: true,
    } as Room;

    try {
      const roomRef = ref(rtdb, `rooms`);
      const newRoomRef = await push(roomRef, newRoomData);
      const newRoomId = newRoomRef.key;

      if (newRoomId) {
        newRoomData = { ...newRoomData, id: newRoomId };
        await set(newRoomRef, newRoomData);
        return newRoomId;
      }

      throw new Error('Failed to create room; no room ID generated.');
    } catch (error) {
      throw error;
    }
  }

  async joinRoom(roomId: string, onRoomUpdate: (room: Room) => void): Promise<void> {
    const roomRef = ref(rtdb, `rooms/${roomId}`);
    const roomSnapshot = await get(roomRef);

    if (!roomSnapshot.exists()) {
      throw new Error('Room not found');
    }

    const dbRoom = roomSnapshot.val() as Room;
    onRoomUpdate(dbRoom);

    // Start listening for real-time updates
    onValue(roomRef, (snapshot) => {
      if (snapshot.exists()) {
        const updatedRoom = snapshot.val() as Room;
        onRoomUpdate(updatedRoom);
      } else {
        throw new Error(`Room with ID ${roomId} no longer exists.`);
      }
    });
  }

  async updateRoom(
    room: Room,
    entities: Entity[],
    mobFavorites: Mob[],
    heroes: Hero[],
    allies: Ally[],
    combatStarted: boolean
  ): Promise<void> {
    if (!auth.currentUser) {
      throw new Error('User is not authenticated');
    }

    if (room.ownerUID !== auth.currentUser.uid) {
      throw new Error('You are not the owner of this room');
    }

    const updatedRoom: Room = {
      ...room,
      combat: {
        ...room.combat,
        entities: entities,
        combatState: combatStarted ? CombatState.IN_PROGRESS : CombatState.NOT_IN_PROGRESS,
      },
      mobFavorites: mobFavorites,
      heroes: heroes,
      allies: allies,
    };

    const sanitizedRoom = sanitizeData(updatedRoom);

    if (!sanitizedRoom.id) {
      throw new Error('No room ID found. Failed to sync room with cloud.');
    }

    const roomRef = ref(rtdb, `rooms/${sanitizedRoom.id}`);
    await update(roomRef, sanitizedRoom);
  }

  async getRoomByOwnerUID(ownerUID: string): Promise<Room | null> {
    // Create a query to find rooms with the matching ownerUID
    const roomsRef = ref(rtdb, `rooms`);
    const queryByOwnerUID = query(roomsRef, orderByChild('ownerUID'), equalTo(ownerUID));
    const snapshot = await get(queryByOwnerUID);

    if (snapshot.exists()) {
      const dbRooms = snapshot.val();
      return Object.values(dbRooms)[0] as Room;
    }

    return null;
  }

  async updateProfilePicture(roomId: string, entity: Entity, profileUrl: string): Promise<void> {
    // Fire and forget - don't await the response
    fetch('/api/scrapeProfilePages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + process.env.API_SECRET,
      },
      body: JSON.stringify({ roomId, entityId: entity.id, profileUrl }),
    })
      .then((response) => {
        if (!response.ok) {
          console.error(`Failed to update profile picture: ${response.statusText}`);
        } else {
          this.toast({
            title: 'Profile picture updated',
            description: 'Profile picture updated successfully. Refresh the page to see changes.',
            status: 'info',
            duration: 5000,
            isClosable: true,
          });
        }
      })
      .catch((error) => {
        console.error('Error updating hero profile picture:', error);
      });
  }
}
