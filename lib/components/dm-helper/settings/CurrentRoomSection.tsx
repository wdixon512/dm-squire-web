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
  Image,
  Avatar,
  Input,
  FormControl,
  FormLabel,
  useToast,
} from '@chakra-ui/react';
import { auth } from '@lib/services/firebase';
import { useFirebaseGoogleAuth } from '../../contexts/FirebaseGoogleAuthContext';
import { FaDoorOpen, FaGoogle, FaSignInAlt } from 'react-icons/fa';
import { isRoomOwner } from '@lib/util/room-permissions';
import { useState } from 'react';

export const CurrentRoomSection: React.FC = () => {
  const { room, readOnlyRoom, leaveRoom, joinedRoomId, joinRoom } = useContext(DMHelperContext);
  const { signInWithGoogle, signOutOfGoogle } = useFirebaseGoogleAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isJoinModalOpen, onOpen: onJoinModalOpen, onClose: onJoinModalClose } = useDisclosure();
  const [roomIdInput, setRoomIdInput] = useState('');
  const isOwner = isRoomOwner(room);
  const toast = useToast();

  const handleLeaveRoom = () => {
    onOpen();
  };

  const handleJoinRoom = async () => {
    if (!roomIdInput.trim()) {
      return;
    }

    // Extract room ID from URL if full URL is pasted
    let roomId = roomIdInput.trim();
    const urlMatch = roomId.match(/\/join\/([^\/\s]+)/);
    if (urlMatch) {
      roomId = urlMatch[1];
    }

    // Check if user is already in this room
    if (room?.id === roomId || joinedRoomId === roomId) {
      toast({
        title: 'Already in Room',
        description: "You're already in that room!",
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      setRoomIdInput('');
      return;
    }

    try {
      await joinRoom(roomId);
      setRoomIdInput('');
      onJoinModalClose();
    } catch (error) {
      // Error is handled by joinRoom toast
    }
  };

  // Show owner info if viewing someone else's room
  // Show if we have either ownerEmail or ownerPhotoURL
  const showOwnerInfo = joinedRoomId && !isOwner && (room?.ownerEmail || room?.ownerPhotoURL);

  return (
    <VStack spacing={4} align="stretch">
      <Flex alignItems="center" gap={2}>
        <FaDoorOpen color="white" />
        <Heading as="h3" fontSize={{ base: 'md', lg: 'lg' }} color="white">
          Current Room
        </Heading>
      </Flex>
      <Divider borderColor="gray.600" />

      {showOwnerInfo && (
        <Box>
          <Text fontSize={{ base: 'xs', lg: 'sm' }} color="gray.400" mb={2}>
            Room Owner
          </Text>
          <Flex alignItems="center" gap={3}>
            <Image
              src={room.ownerPhotoURL || undefined}
              alt={room.ownerEmail || 'Room Owner'}
              borderWidth="2px"
              borderColor="blue.400"
            />
            <Box>
              <Text fontSize={{ base: 'sm', lg: 'md' }} color="white" fontWeight="600">
                {room.ownerEmail || 'Unknown'}
              </Text>
            </Box>
          </Flex>
        </Box>
      )}

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
          <Button
            onClick={signInWithGoogle}
            colorScheme="blue"
            size={{ base: 'sm', lg: 'md' }}
            data-testid="sign-in-btn"
            leftIcon={<FaGoogle />}
            w="fit-content"
          >
            Sign In with Google
          </Button>
        ) : (
          <Button
            variant="redSolid"
            onClick={signOutOfGoogle}
            size={{ base: 'sm', lg: 'md' }}
            data-testid="sign-out-btn"
            w="fit-content"
          >
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
            You are viewing this room as a visitor. Your email ({auth.currentUser.email}) is not listed as an admin for
            this room.
          </Text>
        )}
      </VStack>

      <VStack spacing={3} align="stretch">
        <Divider borderColor="gray.600" />
        <Button
          onClick={onJoinModalOpen}
          colorScheme="blue"
          size={{ base: 'sm', lg: 'md' }}
          w="fit-content"
          leftIcon={<FaSignInAlt />}
          data-testid="join-room-btn"
        >
          Join Another Room
        </Button>

        {joinedRoomId && (
          <Button
            variant="redSolid"
            onClick={handleLeaveRoom}
            size={{ base: 'sm', lg: 'md' }}
            w="fit-content"
            data-testid="leave-room-btn"
          >
            Leave Room
          </Button>
        )}

        <Modal isOpen={isJoinModalOpen} onClose={onJoinModalClose} isCentered>
          <ModalOverlay />
          <ModalContent bg="blackAlpha.900" borderColor="gray.600" borderWidth="1px" color="white">
            <ModalHeader color="white" borderBottomWidth="1px" borderColor="gray.600" pb={3}>
              Join Room
            </ModalHeader>
            <Box p={6}>
              <FormControl>
                <FormLabel color="gray.300" mb={2}>
                  Room ID or Join Link
                </FormLabel>
                <Input
                  value={roomIdInput}
                  onChange={(e) => setRoomIdInput(e.target.value)}
                  placeholder="Enter room ID or full join link"
                  bg="blackAlpha.800"
                  borderColor="gray.600"
                  color="white"
                  _placeholder={{ color: 'gray.500' }}
                  _focus={{ borderColor: 'blue.400', boxShadow: '0 0 0 1px var(--chakra-colors-blue-400)' }}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleJoinRoom();
                    }
                  }}
                  data-testid="join-room-input"
                />
                <Text fontSize="xs" color="gray.400" mt={2}>
                  You can paste either the full join link or just the room ID
                </Text>
              </FormControl>
            </Box>
            <ModalFooter justifyContent="flex-end" gap={3} borderTopWidth="1px" borderColor="gray.600" pt={4}>
              <Button
                variant="ghost"
                onClick={onJoinModalClose}
                color="gray.300"
                _hover={{ bg: 'gray.700' }}
                data-testid="join-room-cancel-btn"
              >
                Cancel
              </Button>
              <Button
                colorScheme="blue"
                onClick={handleJoinRoom}
                isDisabled={!roomIdInput.trim()}
                data-testid="join-room-submit-btn"
              >
                Join
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        <Modal isOpen={isOpen} onClose={onClose} isCentered>
          <ModalOverlay />
          <ModalContent bg="white" borderColor="gray.600" borderWidth="1px">
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
    </VStack>
  );
};
