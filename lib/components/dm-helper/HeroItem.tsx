'use client';

import { FlexProps, useDisclosure } from '@chakra-ui/react';
import { useContext } from 'react';
import { DMHelperContext } from '../contexts/DMHelperContext';
import React from 'react';
import { Hero } from '@lib/models/dm-helper/Hero';
import EntityEditModal from './modals/EntityEditModal';
import { EntityItemBase } from './shared/EntityItemBase';
import EntityDetailModal from './modals/EntityDetailModal';
import HeroDetailModal from './modals/HeroDetailModal';

interface HeroItemProps extends FlexProps {
  hero: Hero;
  showInitiative?: boolean;
  showRemove?: boolean;
  showBench?: boolean;
}

export const HeroItem: React.FC<HeroItemProps> = ({
  hero,
  showInitiative = true,
  showRemove = false,
  showBench = true,
  textColor,
}) => {
  const { removeEntity, readOnlyRoom } = useContext(DMHelperContext);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: heroDetailIsOpen, onOpen: onHeroDetailOpen, onClose: onHeroDetailClose } = useDisclosure();

  return (
    <>
      <EntityItemBase
        entity={hero}
        showInitiative={showInitiative}
        showRemove={showRemove}
        showDetails={true}
        showBench={showBench}
        onRemove={() => removeEntity(hero)}
        onEdit={onOpen}
        onDetailsOpen={onHeroDetailOpen}
        textColor={textColor ?? 'interactive.200'}
        readOnly={readOnlyRoom}
        canViewDetails={!!hero.dndBeyondProfileUrl}
        editTooltipLabel="Update Hero Initiative"
      />
      <EntityEditModal entity={hero} isOpen={isOpen} onClose={onClose} showProfileUrl={true} />

      {!!hero.dndBeyondProfileUrl && (
        <HeroDetailModal profileUrl={hero.dndBeyondProfileUrl} isOpen={heroDetailIsOpen} onClose={onHeroDetailClose} />
      )}
    </>
  );
};

export default HeroItem;
