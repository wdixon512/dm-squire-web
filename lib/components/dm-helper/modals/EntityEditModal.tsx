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
  onClose: () => void;
}

export const EntityEditModal: React.FC<EntityEditModalProps> = ({ entity, isOpen, showHealth = false, onClose }) => {
  const { updateEntities } = useContext(DMHelperContext);
  const [newInitiaive, setNewInitiative] = useState(entity.initiative?.toString());
  const [newName, setNewName] = useState<string>(entity.name);
  const [newHealth, setNewHealth] = useState(entity.health?.toString());
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

      updateEntities((prevEntities) =>
        prevEntities.map((e) => {
          if (e.id === entity.id) {
            if (showHealth) {
              const sameName = newName === entity.name;
              const mobsWithSameName = prevEntities.filter((m) => m.name === newName);
              const newNumber = sameName ? entity.number : mobsWithSameName.length + 1;

              return {
                ...e,
                name: newName,
                health: newHealth ? parseInt(newHealth, 10) : 0,
                initiative: newInitiaive ? parseInt(newInitiaive, 10) : 0,
                number: newNumber,
                id: `${newName.toLowerCase()}-${newNumber}`,
              };
            }

            return { ...e, initiative: newInitiaive ? parseInt(newInitiaive, 10) : 0 };
          }
          return e;
        })
      );
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
