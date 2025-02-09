'use client';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, Button } from '@chakra-ui/react';
import { useContext } from 'react';
import { DMHelperContext } from '../../contexts/DMHelperContext';

interface ClearMobsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ClearMobsModal: React.FC<ClearMobsModalProps> = ({ isOpen, onClose }) => {
  const { clearMobs } = useContext(DMHelperContext);

  const handleDone = (success: boolean) => {
    if (success) {
      clearMobs();
    }

    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleDone(true);
          }
        }}
        data-testid="clear-mobs-modal"
      >
        <>
          <ModalHeader textColor="primary.400">Are you sure you want to Clear Mobs?</ModalHeader>
          <ModalFooter justifyContent="space-between">
            <Button variant="redLink" onClick={() => handleDone(false)} data-testid="cancel-edit-modal-btn">
              Cancel
            </Button>
            <Button variant="solid" onClick={() => handleDone(true)} data-testid="done-edit-modal-btn">
              Yes
            </Button>
          </ModalFooter>
        </>
      </ModalContent>
    </Modal>
  );
};

export default ClearMobsModal;
