import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from '@chakra-ui/react';
import { useState, useEffect, useRef, useCallback } from 'react';
import { MobDetailCard } from '@lib/components/dm-helper/MobDetailCard';
import useDndApi from '@lib/services/dnd5eapi-service';
import { DetailedMob } from '@lib/models/dnd5eapi/DetailedMob';

interface EntityDetailModalProps {
  characterSheetId?: string;
  profileUrl?: string;
  isOpen: boolean;
  onClose: () => void;
}

export const EntityDetailModal: React.FC<EntityDetailModalProps> = ({
  characterSheetId,
  profileUrl,
  isOpen,
  onClose,
}) => {
  const { getMobById } = useDndApi();
  const [detailedMob, setDetailedMob] = useState<DetailedMob>();
  const initialFocusRef = useRef<HTMLDivElement>(null);

  const handleDone = () => {
    onClose();
  };

  // On component mount, fetch the detailed mob data
  useEffect(() => {
    if (!characterSheetId) {
      return;
    }
    getMobById(characterSheetId).then((mob) => {
      if (mob) {
        setDetailedMob(mob);
      }
    });
  }, [characterSheetId]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => handleDone()}
      isCentered
      size={profileUrl ? 'full' : '2xl'}
      initialFocusRef={initialFocusRef}
    >
      <ModalOverlay />
      {profileUrl ? (
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
      ) : (
        <ModalContent maxW="1000px" maxH="90vh" overflowX="hidden">
          <ModalBody>
            <MobDetailCard mob={detailedMob} ref={initialFocusRef} />
          </ModalBody>
          <ModalFooter justifyContent="space-between">
            <Button variant="solid" onClick={() => handleDone()} data-testid="done-edit-modal-btn">
              Done
            </Button>
          </ModalFooter>
        </ModalContent>
      )}
    </Modal>
  );
};

export default EntityDetailModal;
