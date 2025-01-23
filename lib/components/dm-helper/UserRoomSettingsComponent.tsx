'use client';

import { useContext } from 'react';
import { DMHelperContext } from '../contexts/DMHelperContext';
import {
  Button,
  Card,
  Flex,
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { auth } from '@lib/services/firebase';
import { useFirebaseGoogleAuth } from '../contexts/FirebaseGoogleAuthContext';
import UserInfo from './UserInfo';

export const UserRoomSettingsComponent: React.FC = () => {
  const { room, readOnlyRoom, leaveRoom, isClient } = useContext(DMHelperContext);
  const { signInWithGoogle, signOutOfGoogle } = useFirebaseGoogleAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleLeaveRoom = () => {
    onOpen();
  };

  return (
    isClient && (
      <Card bgColor={'secondary.200'} p={'4'}>
        <UserInfo mb="8" />
        <Flex direction={'column'} alignSelf="flex-start">
          {room?.id && <Text>Current Room Id: {room.id}</Text>}
          {!readOnlyRoom ? (
            <Flex gap={4}>
              {!auth.currentUser && (
                <Button onClick={signInWithGoogle} data-testid="sign-in-btn">
                  Sign In
                </Button>
              )}
              {auth.currentUser && (
                <Button variant="redSolid" onClick={signOutOfGoogle} data-testid="sign-out-btn">
                  Sign Out
                </Button>
              )}
            </Flex>
          ) : (
            <>
              <Button variant="redSolid" onClick={handleLeaveRoom} data-testid="leave-room-btn" w="fit-content">
                Leave Room
              </Button>

              <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                  <ModalHeader textColor="primary.400">Are you sure you want to leave the room?</ModalHeader>
                  <ModalFooter justifyContent="center">
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
            </>
          )}
        </Flex>
      </Card>
    )
  );
};

export default UserRoomSettingsComponent;
