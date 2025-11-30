'use client';

import { useContext } from 'react';
import { Flex, Heading, Text, Button, Input, useToast, Box, VStack } from '@chakra-ui/react';
import { DMHelperContext } from '../contexts/DMHelperContext';
import { useFirebaseGoogleAuth } from '../contexts/FirebaseGoogleAuthContext';
import { auth } from '@lib/services/firebase';
import { FaGoogle } from 'react-icons/fa';

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
      <Flex
        direction="column"
        bgColor="blackAlpha.900"
        p={{ base: 4, lg: 8 }}
        borderRadius="xl"
        w={{ base: '100%', lg: 'fit-content' }}
        maxW={{ base: '100%', lg: 'none' }}
        justifySelf="center"
        mx={{ base: 2, lg: 0 }}
      >
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
          <Flex direction="column" gap={4}>
            <Box>
              <Text fontSize={{ base: 'xs', lg: 'sm' }} color="gray.400" mb={2}>
                Join Room Link
              </Text>
              <Input value={joinRoomLink ?? ''} isReadOnly bg="blackAlpha.800" borderColor="gray.600" />
              <Button onClick={copyToClipboard} data-testid="copy-join-room-link-btn" w="fit-content" mt={2} size="sm">
                Copy Link
              </Button>
            </Box>
            <Box>
              <Text fontSize={{ base: 'xs', lg: 'sm' }} color="gray.400" mb={2}>
                Room ID
              </Text>
              <Input value={room.id ?? ''} isReadOnly bg="blackAlpha.800" borderColor="gray.600" fontFamily="mono" />
              <Button
                onClick={() => {
                  if (room.id) {
                    navigator.clipboard.writeText(room.id);
                    toast({
                      title: 'Room ID Copied',
                      description: 'Room ID has been copied to clipboard.',
                      status: 'success',
                      duration: 3000,
                      isClosable: true,
                    });
                  }
                }}
                w="fit-content"
                mt={2}
                size="sm"
                variant="outline"
              >
                Copy Room ID
              </Button>
            </Box>
            <Box
              bg="blackAlpha.800"
              p={4}
              borderRadius="md"
              borderWidth="1px"
              borderColor="gray.600"
              fontSize={{ base: 'xs', lg: 'sm' }}
            >
              <Text fontWeight="bold" mb={2} color="gray.300">
                How to share:
              </Text>
              <VStack align="stretch" spacing={2}>
                <Text color="gray.400">
                  <Text as="span" fontWeight="bold">
                    Option 1:
                  </Text>{' '}
                  Share the full link above (copy/paste the URL)
                </Text>
                <Text color="gray.400">
                  <Text as="span" fontWeight="bold">
                    Option 2:
                  </Text>{' '}
                  Share just the Room ID. Others can paste it in the "Current Room" section to join.
                </Text>
              </VStack>
            </Box>
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
          <Button
            onClick={signInWithGoogle}
            data-testid="invite-others-sign-in-btn"
            leftIcon={<FaGoogle />}
            w="fit-content"
          >
            Sign In with Google
          </Button>
        )}
      </Flex>
    )
  );
};
