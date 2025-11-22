import { Button, Flex, useDisclosure } from '@chakra-ui/react';
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

  const { combatStarted, updateCombatStarted, entities, resetCombat } = useContext(DMHelperContext);
  const heroesAndAllies = useMemo(
    () => entities.filter((entity) => entity.type === EntityType.HERO || entity.type === EntityType.ALLY),
    [entities]
  );

  const startCombat = () => {
    if (heroesAndAllies.length > 0) {
      resetCombat();
      onInitiativeModalOpen();
    }

    updateCombatStarted(true);
  };

  const endCombat = () => {
    onEndCombatModalOpen();

    if (!combatStarted) {
      resetCombat();
      updateCombatStarted(false);
    }
  };

  const showClearMobForm = (e) => {
    e.preventDefault();
    onClearMonstersOpen();
  };
  return (
    <>
      <Flex direction="row" gap="4" flexShrink={0} flexWrap="wrap">
        {combatStarted ? (
          <Button
            variant="redSolid"
            onClick={() => endCombat()}
            data-testid="end-combat-btn"
            fontSize={{ base: 'sm', lg: 'md' }}
          >
            End Combat
          </Button>
        ) : (
          <Button onClick={() => startCombat()} data-testid="start-combat-button" fontSize={{ base: 'sm', lg: 'md' }}>
            Start Combat
          </Button>
        )}
        <Button
          variant="redSolid"
          onClick={(e) => showClearMobForm(e)}
          data-testid="clear-mobs-button"
          fontSize={{ base: 'sm', lg: 'md' }}
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
    </>
  );
}
