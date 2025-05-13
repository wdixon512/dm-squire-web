'use client';

import { FlexProps, useDisclosure } from '@chakra-ui/react';
import { useContext } from 'react';
import { DMHelperContext } from '../contexts/DMHelperContext';
import React from 'react';
import { Hero } from '@lib/models/dm-helper/Hero';
import EntityEditModal from './modals/EntityEditModal';
import { EntityItemBase } from './shared/EntityItemBase';

interface HeroItemProps extends FlexProps {
  hero: Hero;
  showInitiative?: boolean;
  showRemove?: boolean;
}

export const HeroItem: React.FC<HeroItemProps> = ({ hero, showInitiative = true, showRemove = false, textColor }) => {
  const { removeEntity, readOnlyRoom } = useContext(DMHelperContext);
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <EntityItemBase
        entity={hero}
        showInitiative={showInitiative}
        showRemove={showRemove}
        onRemove={() => removeEntity(hero)}
        onEdit={onOpen}
        textColor={textColor}
        readOnly={readOnlyRoom}
        editTooltipLabel="Update Hero Initiative"
      />
      <EntityEditModal entity={hero} isOpen={isOpen} onClose={onClose} />
    </>
  );
};

export default HeroItem;
