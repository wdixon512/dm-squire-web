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
import { ProfileUpdateRequestBody } from '@lib/models/dtos/ProfileUpdateResponse';
import { isRoomOwner, isRoomAdmin } from '@lib/util/room-permissions';

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

    if (!isRoomOwner(room) && !isRoomAdmin(room)) {
      throw new Error('You do not have permission to update this room');
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

  async getRoomByOwnerUID(ownerUID: string, onRoomUpdate?: (room: Room) => void): Promise<Room | null> {
    const roomsRef = ref(rtdb, `rooms`);
    const queryByOwnerUID = query(roomsRef, orderByChild('ownerUID'), equalTo(ownerUID));
    const snapshot = await get(queryByOwnerUID);

    if (snapshot.exists()) {
      const dbRooms = snapshot.val();
      const room = Object.values(dbRooms)[0] as Room;

      if (onRoomUpdate && room.id) {
        const roomRef = ref(rtdb, `rooms/${room.id}`);
        onValue(roomRef, (snapshot) => {
          if (snapshot.exists()) {
            const updatedRoom = snapshot.val() as Room;
            onRoomUpdate(updatedRoom);
          }
        });
      }

      return room;
    }

    return null;
  }

  async updateProfilePictureFromDndBeyond(roomId: string, entity: Entity, profileUrl: string): Promise<void> {
    // Fire and forget - don't await the response
    fetch('/api/updateProfiles', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + process.env.API_SECRET,
      },
      body: JSON.stringify({
        roomId,
        entityId: entity.id,
        profileUrl,
        method: 'dndbeyond',
      } as ProfileUpdateRequestBody),
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

  /**
   * Add an admin email to a room
   * Only the room owner can add admins
   */
  async addAdminEmail(roomId: string, email: string): Promise<void> {
    if (!auth.currentUser) {
      throw new Error('User is not authenticated');
    }

    const roomRef = ref(rtdb, `rooms/${roomId}`);
    const roomSnapshot = await get(roomRef);

    if (!roomSnapshot.exists()) {
      throw new Error('Room not found');
    }

    const room = roomSnapshot.val() as Room;

    if (!isRoomOwner(room)) {
      throw new Error('Only the room owner can add admins');
    }

    const adminEmails = room.adminEmails || [];
    const normalizedEmail = email.toLowerCase().trim();

    // Check if email is already an admin
    if (adminEmails.some((e) => e.toLowerCase() === normalizedEmail)) {
      throw new Error('This email is already an admin');
    }

    // Don't allow adding the owner's email as admin
    if (normalizedEmail === auth.currentUser.email?.toLowerCase()) {
      throw new Error('You are already the room owner');
    }

    const updatedAdminEmails = [...adminEmails, normalizedEmail];
    await update(roomRef, { adminEmails: updatedAdminEmails });
  }

  /**
   * Remove an admin email from a room
   * Only the room owner can remove admins
   */
  async removeAdminEmail(roomId: string, email: string): Promise<void> {
    if (!auth.currentUser) {
      throw new Error('User is not authenticated');
    }

    const roomRef = ref(rtdb, `rooms/${roomId}`);
    const roomSnapshot = await get(roomRef);

    if (!roomSnapshot.exists()) {
      throw new Error('Room not found');
    }

    const room = roomSnapshot.val() as Room;

    if (!isRoomOwner(room)) {
      throw new Error('Only the room owner can remove admins');
    }

    const adminEmails = room.adminEmails || [];
    const normalizedEmail = email.toLowerCase().trim();

    const updatedAdminEmails = adminEmails.filter((e) => e.toLowerCase() !== normalizedEmail);
    await update(roomRef, { adminEmails: updatedAdminEmails });
  }
}
