import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from '@chakra-ui/react';

interface EndCombatConfirmationModalProps {
  isOpen: boolean;
  updateCombatStarted: (value: boolean) => void;
  onClose: () => void;
}

export const EndCombatConfirmationModal: React.FC<EndCombatConfirmationModalProps> = ({
  isOpen,
  updateCombatStarted,
  onClose,
}) => {
  const handleDone = (success: boolean) => {
    if (success) {
      updateCombatStarted(false);
    }

    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textColor="primary.400">Are you sure you want to end combat?</ModalHeader>
        <ModalFooter justifyContent="center">
          <Button variant="redLink" onClick={() => handleDone(false)} data-testid="end-combat-no-btn">
            No
          </Button>
          <Button variant="solid" onClick={() => handleDone(true)} data-testid="end-combat-yes-btn">
            Yes
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EndCombatConfirmationModal;
