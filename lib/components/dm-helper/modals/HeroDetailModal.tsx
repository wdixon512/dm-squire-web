import { Modal, ModalOverlay, ModalContent, ModalBody, ModalFooter, Button } from '@chakra-ui/react';
import React from 'react';

export default function HeroDetailModal({
  profileUrl,
  isOpen,
  onClose,
}: {
  profileUrl: string;
  isOpen: boolean;
  onClose: () => void;
}) {
  const handleDone = () => {
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={() => handleDone()} isCentered size="full">
      <ModalOverlay />
      <ModalContent h="100%" overflowX="hidden">
        <ModalBody>
          <iframe src={profileUrl} width="100%" height="100%"></iframe>
        </ModalBody>
        <ModalFooter justifyContent="space-between">
          <Button variant="solid" onClick={() => handleDone()} data-testid="done-edit-modal-btn">
            Done
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
