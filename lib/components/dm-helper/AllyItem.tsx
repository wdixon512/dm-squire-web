import React, { useContext } from 'react';
import { EntityItemBase } from './shared/EntityItemBase';
import { Ally } from '@lib/models/dm-helper/Ally';
import { DMHelperContext } from '../contexts/DMHelperContext';
import { useDisclosure } from '@chakra-ui/react';
import EntityEditModal from './modals/EntityEditModal';

interface AllyItemProps {
  ally: Ally;
  textColor?: string;
  showInitiative?: boolean;
  showRemove?: boolean;
  onRemove?: () => void;
}

const AllyItem: React.FC<AllyItemProps> = ({ ally, textColor, showInitiative, showRemove, onRemove }) => {
  const { removeEntity, readOnlyRoom } = useContext(DMHelperContext);
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <EntityItemBase
        entity={ally}
        textColor={textColor}
        showInitiative={showInitiative}
        showRemove={showRemove}
        readOnly={readOnlyRoom}
        onEdit={onOpen}
        onRemove={() => removeEntity(ally)}
      />
      <EntityEditModal entity={ally} isOpen={isOpen} onClose={onClose} />
    </>
  );
};

export default AllyItem;
