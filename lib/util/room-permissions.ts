import { Room } from '@lib/models/dm-helper/Room';
import { auth } from '@services/firebase';

/**
 * Check if the current user is the owner of the room
 */
export const isRoomOwner = (room: Room | null | undefined): boolean => {
  if (!room || !auth.currentUser) {
    return false;
  }
  return room.ownerUID === auth.currentUser.uid;
};

/**
 * Check if the current user is an admin of the room
 * Admins are determined by matching email addresses
 */
export const isRoomAdmin = (room: Room | null | undefined): boolean => {
  if (!room || !auth.currentUser || !auth.currentUser.email) {
    return false;
  }
  const adminEmails = room.adminEmails || [];
  return adminEmails.some((email) => email.toLowerCase() === auth.currentUser?.email?.toLowerCase());
};

/**
 * Check if the current user has admin privileges (owner or admin)
 */
export const hasAdminPrivileges = (room: Room | null | undefined): boolean => {
  return isRoomOwner(room) || isRoomAdmin(room);
};

