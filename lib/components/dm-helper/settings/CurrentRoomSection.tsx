'use client';

import { useContext } from 'react';
import { DMHelperContext } from '../../contexts/DMHelperContext';
import {
  Box,
  Button,
  Flex,
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
  useDisclosure,
  Heading,
  Divider,
} from '@chakra-ui/react';
import { auth } from '@lib/services/firebase';
import { useFirebaseGoogleAuth } from '../../contexts/FirebaseGoogleAuthContext';
import { FaDoorOpen } from 'react-icons/fa';

export const CurrentRoomSection: React.FC = () => {
  const { room, readOnlyRoom, leaveRoom } = useContext(DMHelperContext);
  const { signInWithGoogle, signOutOfGoogle } = useFirebaseGoogleAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleLeaveRoom = () => {
    onOpen();
  };

  return (
    <VStack spacing={4} align="stretch">
      <Flex alignItems="center" gap={2}>
        <FaDoorOpen color="white" />
        <Heading as="h3" fontSize={{ base: 'md', lg: 'lg' }} color="white">
          Current Room
        </Heading>
      </Flex>
      <Divider borderColor="gray.600" />

      {room?.id && (
        <Box>
          <Text fontSize={{ base: 'xs', lg: 'sm' }} color="gray.400" mb={1}>
            Room ID
          </Text>
          <Text fontSize={{ base: 'sm', lg: 'md' }} color="white" fontWeight="600" fontFamily="mono">
            {room.id}
          </Text>
        </Box>
      )}

      <VStack spacing={3} align="stretch">
        <Text fontSize={{ base: 'xs', lg: 'sm' }} color="gray.400">
          Authentication
        </Text>
        {!auth.currentUser ? (
          <Button onClick={signInWithGoogle} colorScheme="blue" size={{ base: 'sm', lg: 'md' }} data-testid="sign-in-btn">
            Sign In with Google
          </Button>
        ) : (
          <Button variant="redSolid" onClick={signOutOfGoogle} size={{ base: 'sm', lg: 'md' }} data-testid="sign-out-btn">
            Sign Out
          </Button>
        )}
        {readOnlyRoom && !auth.currentUser && (
          <Text fontSize={{ base: 'xs', lg: 'sm' }} color="gray.500" fontStyle="italic" mt={2}>
            Sign in with an admin email to get edit access to this room.
          </Text>
        )}
        {readOnlyRoom && auth.currentUser && (
          <Text fontSize={{ base: 'xs', lg: 'sm' }} color="gray.500" fontStyle="italic" mt={2}>
            You are viewing this room as a visitor. Your email ({auth.currentUser.email}) is not listed as an admin for this room.
          </Text>
        )}
      </VStack>

      {readOnlyRoom && (
        <VStack spacing={3} align="stretch">
          <Divider borderColor="gray.600" />
          <Button
            variant="redSolid"
            onClick={handleLeaveRoom}
            size={{ base: 'sm', lg: 'md' }}
            w="fit-content"
            data-testid="leave-room-btn"
          >
            Leave Room
          </Button>

          <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent bg="blackAlpha.900" borderColor="gray.600" borderWidth="1px">
              <ModalHeader textColor="primary.400">Are you sure you want to leave the room?</ModalHeader>
              <ModalFooter justifyContent="center" gap={2}>
                <Button variant="redLink" onClick={onClose} data-testid="leave-room-no-btn">
                  No
                </Button>
                <Button
                  variant="solid"
                  onClick={() => {
                    leaveRoom();
                    onClose();
                  }}
                  data-testid="leave-room-yes-btn"
                >
                  Yes
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </VStack>
      )}
    </VStack>
  );
};

