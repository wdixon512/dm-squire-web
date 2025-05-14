import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from '@chakra-ui/react';
import { useState, useEffect, useRef, useCallback } from 'react';
import { MobDetailCard } from '@lib/components/dm-helper/MobDetailCard';
import useDndApi from '@lib/services/dnd5eapi-service';
import { DetailedMob } from '@lib/models/dnd5eapi/DetailedMob';

interface EntityDetailModalProps {
  characterSheetId: string;
  isOpen: boolean;
  onClose: () => void;
}

export const EntityDetailModal: React.FC<EntityDetailModalProps> = ({ characterSheetId, isOpen, onClose }) => {
  const { getMobById } = useDndApi();
  const [detailedMob, setDetailedMob] = useState<DetailedMob>();

  const handleDone = () => {
    onClose();
  };

  // On component mount, fetch the detailed mob data
  useEffect(() => {
    getMobById(characterSheetId).then((mob) => {
      if (mob) {
        setDetailedMob(mob);
      }
    });
  }, [characterSheetId]);

  return (
    <Modal isOpen={isOpen} onClose={() => handleDone()} isCentered>
      <ModalOverlay />
      <ModalContent maxW="1000px" maxH="90vh" overflowX="hidden">
        <ModalBody>
          <MobDetailCard mob={detailedMob} />
        </ModalBody>
        <ModalFooter justifyContent="space-between">
          <Button variant="solid" onClick={() => handleDone()} data-testid="done-edit-modal-btn">
            Done
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EntityDetailModal;
