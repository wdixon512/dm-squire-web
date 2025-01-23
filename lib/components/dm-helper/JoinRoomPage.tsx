'use client';
import { useEffect, useContext } from 'react';
import { Box, Spinner, Text } from '@chakra-ui/react';
import { DMHelperContext } from '@lib/components/contexts/DMHelperContext';
import { useRouter } from 'next/navigation';

export default function JoinRoomPage({ roomId }: { roomId: string }) {
  const router = useRouter();

  const { joinRoom, room, loadingFirebaseRoom } = useContext(DMHelperContext);

  useEffect(() => {
    if (roomId) {
      joinRoom(roomId as string).then((_) => {
        router.push('/');
      });
    }
  }, [roomId]);

  if (loadingFirebaseRoom) {
    return (
      <Box textAlign="center" p={4}>
        <Spinner size="lg" />
        <Text>Loading room...</Text>
      </Box>
    );
  }

  if (!room) {
    return (
      <Box textAlign="center" p={4}>
        <Text>Room not found or you do not have access to this room.</Text>
      </Box>
    );
  }

  return (
    <Box p={4}>
      <Text>Welcome to Room ID: {roomId}</Text>
      {/* Render room details or a component for the room */}
    </Box>
  );
}
