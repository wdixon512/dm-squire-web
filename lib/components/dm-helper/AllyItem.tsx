import React, { useContext, useMemo } from 'react';
import { EntityItemBase } from './shared/EntityItemBase';
import { Ally } from '@lib/models/dm-helper/Ally';
import { DMHelperContext } from '../contexts/DMHelperContext';
import { useDisclosure } from '@chakra-ui/react';
import EntityEditModal from './modals/EntityEditModal';
import EntityDetailModal from './modals/EntityDetailModal';

interface AllyItemProps {
  ally: Ally;
  textColor?: string;
  showInitiative?: boolean;
  showRemove?: boolean;
  showHealth?: boolean;
  showKill?: boolean;
  showDetails?: boolean;
  showBench?: boolean;
  onRemove?: () => void;
}

const AllyItem: React.FC<AllyItemProps> = ({
  ally,
  textColor,
  showInitiative,
  showRemove,
  showHealth = false,
  showKill = false,
  showDetails = false,
  showBench = true,
  onRemove,
}) => {
  const { removeEntity, readOnlyRoom, updateEntity } = useContext(DMHelperContext);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: detailIsOpen, onOpen: onDetailOpen, onClose: onDetailClose } = useDisclosure();

  const updateHealth = (ally: Ally, newHealth) => {
    updateEntity({ ...ally, health: newHealth });
  };

  return (
    <>
      <EntityItemBase
        entity={ally}
        textColor={textColor ?? 'yellow.200'}
        showInitiative={showInitiative}
        showRemove={showRemove}
        showHealth={showHealth}
        showKill={showKill}
        showDetails={showDetails ?? true}
        showBench={showBench}
        readOnly={readOnlyRoom}
        onEdit={onOpen}
        onRemove={onRemove || (() => removeEntity(ally))}
        onHealthChange={(value) => updateHealth(ally, value === '' ? '' : parseInt(value, 10))}
        onDetailsOpen={onDetailOpen}
        canViewDetails={!!ally.mobLibraryId}
        editTooltipLabel="Update Ally"
      />
      <EntityEditModal entity={ally} isOpen={isOpen} onClose={onClose} showHealth={showHealth} />
      {ally.mobLibraryId && (
        <EntityDetailModal characterSheetId={ally.mobLibraryId} isOpen={detailIsOpen} onClose={onDetailClose} />
      )}
    </>
  );
};

export default AllyItem;
