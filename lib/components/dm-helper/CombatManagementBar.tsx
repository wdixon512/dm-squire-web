import { Box, Button, Flex, useDisclosure } from '@chakra-ui/react';
import React, { useContext } from 'react';
import ClearMobsModal from './modals/ClearMobsModal';
import { DMHelperContext } from '../contexts/DMHelperContext';
import EndCombatConfirmationModal from './modals/EndCombatConfirmationModal';
import InitiativeModal from './modals/InititativeModal';

export default function CombatManagementBar() {
  const { isOpen: isClearMonstersOpen, onOpen: onClearMonstersOpen, onClose: onClearMonstersClose } = useDisclosure();
  const { isOpen: endCombatIsOpen, onOpen: onEndCombatModalOpen, onClose: onEndCombatModalClose } = useDisclosure();
  const {
    isOpen: isInitiativeModalOpen,
    onOpen: onInitiativeModalOpen,
    onClose: onInitiativeModalClose,
  } = useDisclosure();

  const { combatStarted, updateCombatStarted, heroes, resetHeroInitiatives } = useContext(DMHelperContext);

  const startCombat = () => {
    if (heroes.length > 0) {
      resetHeroInitiatives();
      onInitiativeModalOpen();
    }
    updateCombatStarted(true);
  };

  const endCombat = () => {
    onEndCombatModalOpen();

    if (!combatStarted) {
      resetHeroInitiatives();
      updateCombatStarted(false);
    }
  };

  const showClearMobForm = (e) => {
    e.preventDefault();
    onClearMonstersOpen();
  };
  return (
    <Box bgColor="blackAlpha.800" p={4} borderWidth="1px" borderRadius="md" shadow="md">
      <Flex alignItems="center" gap="4">
        {combatStarted ? (
          <Button variant="redSolid" onClick={() => endCombat()} data-testid="end-combat-btn" px="8">
            End Combat
          </Button>
        ) : (
          <Button onClick={() => startCombat()} data-testid="start-combat-button" px="8">
            Start Combat
          </Button>
        )}
        <Button
          variant="redSolid"
          width="fit-content"
          onClick={(e) => showClearMobForm(e)}
          data-testid="clear-mobs-button"
        >
          Clear Enemies
        </Button>
      </Flex>

      {/* Modals */}
      <ClearMobsModal isOpen={isClearMonstersOpen} onClose={onClearMonstersClose} />
      <EndCombatConfirmationModal
        isOpen={endCombatIsOpen}
        updateCombatStarted={updateCombatStarted}
        onClose={onEndCombatModalClose}
      />
      <InitiativeModal isOpen={isInitiativeModalOpen} heroes={heroes} onClose={onInitiativeModalClose} />
    </Box>
  );
}
