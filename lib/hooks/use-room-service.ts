import { useMemo } from 'react';
import { RoomService } from '@lib/services/room-service';
import { useToast } from '@chakra-ui/react';

let roomServiceInstance: RoomService | null = null;

export function useRoomService() {
  const toast = useToast();

  return useMemo(() => {
    if (!roomServiceInstance) {
      roomServiceInstance = new RoomService(toast);
    }
    return roomServiceInstance;
  }, []);
}
