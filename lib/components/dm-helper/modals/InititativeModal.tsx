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
  ModalProps,
} from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { useContext, useState, useRef } from 'react';
import { Hero } from '@lib/models/dm-helper/Hero';
import { EntityType, Entity } from '@lib/models/dm-helper/Entity';
import { DMHelperContext } from '../../contexts/DMHelperContext';

interface InitiativeModalProps {
  isOpen: boolean;
  heroes: Hero[];
  onClose: () => void;
}

export const InitiativeModal: React.FC<InitiativeModalProps> = ({ isOpen, heroes, onClose }) => {
  const { updateEntities } = useContext(DMHelperContext);
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const [initiativeRolls, setInitiativeRolls] = useState<number[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();

  const handleNextHero = () => {
    const initiativeValue = inputRef.current?.value;

    if (!initiativeValue || initiativeValue === '') {
      toast({
        title: 'Warning',
        description: 'Please enter a valid initiative value.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (currentHeroIndex < heroes.length - 1) {
      setCurrentHeroIndex(currentHeroIndex + 1);
    }
  };

  const handlePreviousHero = () => {
    if (currentHeroIndex > 0) {
      setCurrentHeroIndex(currentHeroIndex - 1);
    }
  };

  const handleInitiativeChange = () => {
    const updatedRolls = [...initiativeRolls];
    const initiativeValue = inputRef.current?.value || '0';
    updatedRolls[currentHeroIndex] = Number(initiativeValue);
    setInitiativeRolls(updatedRolls);
  };

  const handleDone = (aborted = false) => {
    const initiativeValue = inputRef.current?.value;

    if (initiativeValue === '') {
      toast({
        title: 'Warning',
        description: 'Please enter a valid initiative value.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (aborted || initiativeRolls.some((roll) => roll === undefined || roll === null)) {
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

    const updatedHeroes = heroes.map((hero, index) => ({
      ...hero,
      initiative: initiativeRolls[index],
    }));

    updateEntities((prevEntities: Entity[]) =>
      prevEntities.map((entity) =>
        entity.type === EntityType.HERO ? updatedHeroes.find((h) => h.id === entity.id) || entity : entity
      )
    );

    setInitiativeRolls([]);
    setCurrentHeroIndex(0);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={() => handleDone(true)} isCentered>
      <ModalOverlay />
      <ModalContent>
        {heroes && heroes.length > 0 ? (
          <>
            <ModalHeader textColor="primary.400">
              What did {heroes[currentHeroIndex]?.name} roll for initiative?
            </ModalHeader>
            <ModalBody>
              <Input
                ref={inputRef} // Attach ref to the input
                type="number"
                textColor="primary.400"
                placeholder="Enter initiative"
                value={initiativeRolls[currentHeroIndex] || ''}
                onChange={handleInitiativeChange}
                required={true}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    if (currentHeroIndex === heroes.length - 1) {
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
              {currentHeroIndex > 0 && (
                <Button
                  leftIcon={<ChevronLeftIcon />}
                  lineHeight={5}
                  onClick={handlePreviousHero}
                  data-testid="init-modal-back-btn"
                >
                  Back ({heroes[currentHeroIndex - 1]?.name})
                </Button>
              )}
              {currentHeroIndex < heroes.length - 1 ? (
                <Button
                  rightIcon={<ChevronRightIcon />}
                  lineHeight={5}
                  onClick={handleNextHero}
                  data-testid="init-modal-next-btn"
                >
                  Next ({heroes[currentHeroIndex + 1]?.name})
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
