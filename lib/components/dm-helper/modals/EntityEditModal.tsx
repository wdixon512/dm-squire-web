import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  FormLabel,
  Button,
  FormControl,
  useToast,
} from '@chakra-ui/react';
import { useContext, useState, useRef } from 'react';
import { EntityType, Entity } from '@lib/models/dm-helper/Entity';
import { DMHelperContext } from '../../contexts/DMHelperContext';
import { validateInitiative } from '@lib/util/dm-helper-utils';
import { capitalizeFirstLetter } from '@lib/util/js-utils';

interface EntityEditModalProps {
  entity: Entity;
  isOpen: boolean;
  showHealth?: boolean;
  showProfileUrl?: boolean;
  onClose: () => void;
}

export const EntityEditModal: React.FC<EntityEditModalProps> = ({
  entity,
  isOpen,
  showHealth = false,
  showProfileUrl = false,
  onClose,
}) => {
  const { updateEntity } = useContext(DMHelperContext);
  const [newInitiaive, setNewInitiative] = useState(entity.initiative?.toString());
  const [newHealth, setNewHealth] = useState(entity.health?.toString());
  const [newProfileUrl, setNewProfileUrl] = useState(entity.dndBeyondProfileUrl ?? '');
  const toast = useToast();

  const handleDone = (success: boolean) => {
    if (success) {
      if (entity.type === EntityType.HERO && !validateInitiative(newInitiaive)) {
        toast({
          title: 'Error',
          description: 'Initiative must be a number.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });

        return;
      }

      updateEntity({
        ...entity,
        health: newHealth ? parseInt(newHealth, 10) : 0,
        initiative: newInitiaive ? parseInt(newInitiaive, 10) : 0,
        dndBeyondProfileUrl: newProfileUrl,
      });
    }

    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={() => handleDone(true)} isCentered>
      <ModalOverlay />
      <ModalContent
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleDone(true);
          }
        }}
      >
        {entity && (
          <>
            <ModalHeader textColor="primary.400">Update {entity.name}</ModalHeader>
            <ModalBody>
              {showHealth && (
                <FormControl mb={4}>
                  <FormLabel color="blackAlpha.900">{capitalizeFirstLetter(entity.name)} Health</FormLabel>
                  <Input
                    type="text"
                    color="blackAlpha.700"
                    value={newHealth ?? ''}
                    onChange={(e) => setNewHealth(e.target.value)}
                    placeholder="Enter mob health"
                    required={false}
                    data-testid="health-edit-modal-input"
                  />
                </FormControl>
              )}
              <FormControl mb={4}>
                <FormLabel color="blackAlpha.900">{capitalizeFirstLetter(entity.name)} Initiative</FormLabel>
                <Input
                  type="number"
                  textColor="primary.400"
                  placeholder="Enter initiative"
                  value={newInitiaive ?? ''}
                  onChange={(e) => setNewInitiative(e.target.value)}
                  required={true}
                  data-testid="initiative-edit-modal-input"
                />
              </FormControl>
              {showProfileUrl && (
                <FormControl mb={4}>
                  <FormLabel color="blackAlpha.900">{capitalizeFirstLetter(entity.name)} Profile Url</FormLabel>
                  <Input
                    type="text"
                    textColor="primary.400"
                    placeholder="Enter profile URL"
                    value={newProfileUrl ?? ''}
                    onChange={(e) => setNewProfileUrl(e.target.value)}
                    data-testid="profile-url-edit-modal-input"
                  />
                </FormControl>
              )}
            </ModalBody>
            <ModalFooter justifyContent="space-between">
              <Button variant="redLink" onClick={() => handleDone(false)} data-testid="cancel-edit-modal-btn">
                Cancel
              </Button>
              <Button variant="solid" onClick={() => handleDone(true)} data-testid="done-edit-modal-btn">
                Done
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default EntityEditModal;
