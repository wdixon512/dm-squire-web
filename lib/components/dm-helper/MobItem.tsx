'use client';

import { FlexProps, useDisclosure } from '@chakra-ui/react';
import { useContext, useMemo } from 'react';
import { DMHelperContext } from '../contexts/DMHelperContext';
import React from 'react';
import { Mob } from '@lib/models/dm-helper/Mob';
import EntityEditModal from './modals/EntityEditModal';
import EntityDetailModal from './modals/EntityDetailModal';
import { EntityItemBase } from './shared/EntityItemBase';
import { EntityType } from '@lib/models/dm-helper/Entity';
import { sanitizeMonsterName } from '@lib/util/mobUtils';

interface MobItemProps extends FlexProps {
  mob: Mob;
  handleDrop?: (id: string | number, x: number, y: number) => void;
  showBench?: boolean;
}

export const MobItem: React.FC<MobItemProps> = ({ mob, handleDrop, textColor, showBench = true, ...props }) => {
  const { entities, removeEntity, updateEntity, readOnlyRoom } = useContext(DMHelperContext);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: mobDetailIsOpen, onOpen: onMobDetailOpen, onClose: onMobDetailClose } = useDisclosure();
  const characterSheetId = useMemo(() => sanitizeMonsterName(mob.name), [mob.name]);

  const hasMultipleMobsWithSameName = (mobName: string) => {
    return entities.filter((e) => e.name === mobName && e.type === EntityType.MOB).length > 1;
  };

  const updateHealth = (mob: Mob, newHealth) => {
    updateEntity({ ...mob, health: newHealth });
  };

  return (
    <>
      <EntityItemBase
        entity={mob}
        entityName={hasMultipleMobsWithSameName(mob.name) ? `${mob.name} #${mob.number}` : mob.name}
        textColor={textColor}
        showInitiative={true}
        showHealth={!readOnlyRoom}
        showKill={!readOnlyRoom}
        showDetails={!readOnlyRoom}
        showBench={showBench}
        readOnly={readOnlyRoom}
        onEdit={onOpen}
        onRemove={() => removeEntity(mob)}
        onHealthChange={(value) => updateHealth(mob, value === '' ? '' : parseInt(value, 10))}
        onDetailsOpen={onMobDetailOpen}
        canViewDetails={mob.isLibraryMob}
        editTooltipLabel="Update Mob"
        {...props}
      />
      <EntityEditModal entity={mob} isOpen={isOpen} onClose={onClose} showHealth={true} />

      {!readOnlyRoom && mob.isLibraryMob && characterSheetId && (
        <EntityDetailModal characterSheetId={characterSheetId} isOpen={mobDetailIsOpen} onClose={onMobDetailClose} />
      )}
    </>
  );
};

export default MobItem;
