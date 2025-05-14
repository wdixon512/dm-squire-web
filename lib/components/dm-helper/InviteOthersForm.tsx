'use client';

import { useContext } from 'react';
import { Flex, Heading, Text, Button, Input, useToast } from '@chakra-ui/react';
import { DMHelperContext } from '../contexts/DMHelperContext';
import { useFirebaseGoogleAuth } from '../contexts/FirebaseGoogleAuthContext';
import { auth } from '@lib/services/firebase';

export const InviteOthersForm = () => {
  const { room, joinRoomLink, createRoom, isClient, loadingFirebaseRoom } = useContext(DMHelperContext);
  const { signInWithGoogle } = useFirebaseGoogleAuth();
  const toast = useToast();

  const handleCreateRoom = async () => {
    if (!auth.currentUser) {
      await signInWithGoogle();
    }
    await createRoom();
  };

  const copyToClipboard = () => {
    if (joinRoomLink) {
      navigator.clipboard.writeText(joinRoomLink).then(() => {
        toast({
          title: 'Link Copied',
          description: 'Join room link has been copied to clipboard.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      });
    }
  };

  return (
    isClient && (
      <Flex direction="column" bgColor="blackAlpha.900" p="8" borderRadius="xl" w="fit-content" justifySelf="center">
        {/* User is not signed in */}
        {!auth.currentUser ? (
          <Heading>Sign in to create a room</Heading>
        ) : // User is signed in and not in a room
        auth.currentUser && !room.syncWithFirebase && !loadingFirebaseRoom ? (
          <>
            <Heading>Looking to share with others?</Heading>
            <Text as="p">You can now give others readonly access to your combat!</Text>
            <Text as="p">Readonly users will NOT see enemy health.</Text>
          </>
        ) : (
          <Heading>You are already in a room!</Heading>
        )}

        {/* User is signed in and in a room */}
        {joinRoomLink || room.syncWithFirebase ? (
          <Flex direction="column" alignItems="center">
            <Input value={joinRoomLink ?? ''} isReadOnly />
            <Button onClick={copyToClipboard} data-testid="copy-join-room-link-btn" mt="4" w="fit-content">
              Copy Join Room Link
            </Button>
          </Flex>
        ) : auth.currentUser ? (
          !room.syncWithFirebase && (
            // User is signed in and not in a room
            <Button onClick={handleCreateRoom} data-testid="create-room-button">
              Create Room
            </Button>
          )
        ) : (
          // User is not signed in
          <Button onClick={signInWithGoogle} data-testid="invite-others-sign-in-btn">
            Sign In
          </Button>
        )}
      </Flex>
    )
  );
};
