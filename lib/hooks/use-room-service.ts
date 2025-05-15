import { useMemo } from 'react';
import { RoomService } from '@lib/services/room-service';

let roomServiceInstance: RoomService | null = null;

export function useRoomService() {
  return useMemo(() => {
    if (!roomServiceInstance) {
      roomServiceInstance = new RoomService();
    }
    return roomServiceInstance;
  }, []);
}
