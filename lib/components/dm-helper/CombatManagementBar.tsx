import { Box, Button, Flex, useDisclosure } from '@chakra-ui/react';
import React, { useContext, useMemo } from 'react';
import ClearMobsModal from './modals/ClearMobsModal';
import { DMHelperContext } from '../contexts/DMHelperContext';
import EndCombatConfirmationModal from './modals/EndCombatConfirmationModal';
import InitiativeModal from './modals/InititativeModal';
import { EntityType } from '@lib/models/dm-helper/Entity';

export default function CombatManagementBar() {
  const { isOpen: isClearMonstersOpen, onOpen: onClearMonstersOpen, onClose: onClearMonstersClose } = useDisclosure();
  const { isOpen: endCombatIsOpen, onOpen: onEndCombatModalOpen, onClose: onEndCombatModalClose } = useDisclosure();
  const {
    isOpen: isInitiativeModalOpen,
    onOpen: onInitiativeModalOpen,
    onClose: onInitiativeModalClose,
  } = useDisclosure();

  const { combatStarted, updateCombatStarted, entities, resetHeroInitiatives } = useContext(DMHelperContext);
  const heroesAndAllies = useMemo(
    () => entities.filter((entity) => entity.type === EntityType.HERO || entity.type === EntityType.ALLY),
    [entities]
  );

  const startCombat = () => {
    if (heroesAndAllies.length > 0) {
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
      <InitiativeModal isOpen={isInitiativeModalOpen} entities={heroesAndAllies} onClose={onInitiativeModalClose} />
    </Box>
  );
}
