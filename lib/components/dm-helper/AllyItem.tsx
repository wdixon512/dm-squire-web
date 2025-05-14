import React, { useContext } from 'react';
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
  onRemove,
}) => {
  const { removeEntity, readOnlyRoom, updateEntities } = useContext(DMHelperContext);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: detailIsOpen, onOpen: onDetailOpen, onClose: onDetailClose } = useDisclosure();

  const updateHealth = (ally: Ally, newHealth) => {
    updateEntities((entities) => entities.map((a) => (a.id === ally.id ? { ...a, health: newHealth } : a)));
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
        readOnly={readOnlyRoom}
        onEdit={onOpen}
        onRemove={onRemove || (() => removeEntity(ally))}
        onHealthChange={(value) => updateHealth(ally, value === '' ? '' : parseInt(value, 10))}
        onDetailsOpen={onDetailOpen}
        canViewDetails={!!ally.characterSheetId}
        editTooltipLabel="Update Ally"
      />
      <EntityEditModal entity={ally} isOpen={isOpen} onClose={onClose} showHealth={showHealth} />
      <EntityDetailModal entity={ally} isOpen={detailIsOpen} onClose={onDetailClose} />
    </>
  );
};

export default AllyItem;
