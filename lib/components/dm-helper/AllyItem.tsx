import React from 'react';
import { EntityItemBase } from './shared/EntityItemBase';
import { Ally } from '@lib/models/dm-helper/Ally';

interface AllyItemProps {
  ally: Ally;
  textColor?: string;
  showInitiative?: boolean;
  showRemove?: boolean;
  onRemove?: () => void;
}

const AllyItem: React.FC<AllyItemProps> = ({ ally, textColor, showInitiative, showRemove, onRemove }) => {
  return (
    <EntityItemBase
      entity={ally}
      textColor={textColor}
      showInitiative={showInitiative}
      showRemove={showRemove}
      onRemove={onRemove}
      readOnly={true}
    />
  );
};

export default AllyItem;
