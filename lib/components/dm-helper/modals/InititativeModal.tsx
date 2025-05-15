import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Button,
  useToast,
  FormLabel,
  Checkbox,
  Flex,
  Tooltip,
} from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { useContext, useState, useRef } from 'react';
import { EntityType, Entity } from '@lib/models/dm-helper/Entity';
import { DMHelperContext } from '../../contexts/DMHelperContext';
import { FaQuestion, FaQuestionCircle } from 'react-icons/fa';

interface InitiativeModalProps {
  isOpen: boolean;
  entities: Entity[];
  onClose: () => void;
}

export const InitiativeModal: React.FC<InitiativeModalProps> = ({ isOpen, entities, onClose }) => {
  const { updateEntities } = useContext(DMHelperContext);
  const [currentEntityIndex, setCurrentEntityIndex] = useState(0);
  const [initiativeRolls, setInitiativeRolls] = useState<number[]>([]);
  const [benchedEntities, setBenchedEntities] = useState<boolean[]>(entities.map(() => false));
  const initiativeInputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();

  const handleNextHero = () => {
    if (benchedEntities[currentEntityIndex]) {
      goToNextHero();
      return;
    }

    if (!validateCurrentInitiative()) {
      return;
    }

    goToNextHero();
  };

  const goToNextHero = () => {
    if (currentEntityIndex < entities.length - 1) {
      setCurrentEntityIndex(currentEntityIndex + 1);
    }
  };

  const handlePreviousHero = () => {
    if (currentEntityIndex > 0) {
      setCurrentEntityIndex(currentEntityIndex - 1);
    }
  };

  const handleInitiativeChange = () => {
    const updatedRolls = [...initiativeRolls];
    const initiativeValue = initiativeInputRef.current?.value || '0';
    updatedRolls[currentEntityIndex] = Number(initiativeValue);
    setInitiativeRolls(updatedRolls);
  };

  const handleSkipEntityChange = (skip: boolean) => {
    const updatedBenchedEntities = [...benchedEntities];
    updatedBenchedEntities[currentEntityIndex] = skip;
    setBenchedEntities(updatedBenchedEntities);
  };

  const handleDone = (aborted = false) => {
    if (aborted) {
      toast({
        title: 'Warning',
        description: 'Initiative setting was aborted. Please set all initiatives before closing.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      onClose();
      return;
    }
    // if we're NOT benching the last entity, validate inititive
    if (!benchedEntities[currentEntityIndex]) {
      if (!validateCurrentInitiative()) {
        return;
      }
    }

    const updatedEntities = entities.map((entity, index) => ({
      ...entity,
      initiative: initiativeRolls[index],
      skipInCombat: benchedEntities[index] || false,
    }));

    updateEntities((prevEntities: Entity[]) =>
      prevEntities.map((entity) =>
        entity.type === EntityType.HERO || entity.type === EntityType.ALLY
          ? updatedEntities.find((h) => h.id === entity.id) || entity
          : entity
      )
    );

    setInitiativeRolls([]);
    setCurrentEntityIndex(0);
    onClose();
  };

  const validateCurrentInitiative = (): boolean => {
    const initiativeValue = initiativeInputRef.current?.value;

    if (initiativeValue === '') {
      toast({
        title: 'Warning',
        description: 'Please enter a valid initiative value.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return false;
    }

    return true;
  };

  return (
    <Modal isOpen={isOpen} onClose={() => handleDone(true)} isCentered>
      <ModalOverlay />
      <ModalContent>
        {entities && entities.length > 0 ? (
          <>
            <ModalHeader textColor="primary.400">
              What did {entities[currentEntityIndex]?.name} roll for initiative?
            </ModalHeader>

            <ModalBody pt="0">
              <Flex alignItems="flex-start" gap="2">
                <Checkbox
                  isChecked={benchedEntities[currentEntityIndex]}
                  onChange={(e) => handleSkipEntityChange(e.target.checked)}
                />

                <FormLabel display="inline-flex" gap="2" textColor="primary.400">
                  Bench {entities[currentEntityIndex]?.name}
                  <Tooltip
                    label="If you bench an entity, it will not be included in the combat initiative order."
                    placement="top"
                  >
                    <FaQuestionCircle />
                  </Tooltip>
                </FormLabel>
              </Flex>
              <Input
                ref={initiativeInputRef} // Attach ref to the input
                type="number"
                textColor="primary.400"
                placeholder="Enter initiative"
                value={initiativeRolls[currentEntityIndex] ?? ''}
                onChange={handleInitiativeChange}
                required={true}
                disabled={benchedEntities[currentEntityIndex]}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    if (currentEntityIndex === entities.length - 1) {
                      handleDone();
                    } else {
                      handleNextHero();
                    }
                  }
                }}
                data-testid="initiative-input"
              />
            </ModalBody>
            <ModalFooter justifyContent="space-between">
              {currentEntityIndex > 0 && (
                <Button
                  leftIcon={<ChevronLeftIcon />}
                  lineHeight={5}
                  onClick={handlePreviousHero}
                  data-testid="init-modal-back-btn"
                >
                  Back ({entities[currentEntityIndex - 1]?.name})
                </Button>
              )}
              {currentEntityIndex < entities.length - 1 ? (
                <Button
                  rightIcon={<ChevronRightIcon />}
                  lineHeight={5}
                  onClick={handleNextHero}
                  data-testid="init-modal-next-btn"
                >
                  Next ({entities[currentEntityIndex + 1]?.name})
                </Button>
              ) : (
                <Button colorScheme="green" onClick={() => handleDone()} data-testid="init-modal-done-btn">
                  Done
                </Button>
              )}
            </ModalFooter>
          </>
        ) : (
          <ModalHeader>No heroes available</ModalHeader>
        )}
      </ModalContent>
    </Modal>
  );
};

export default InitiativeModal;
