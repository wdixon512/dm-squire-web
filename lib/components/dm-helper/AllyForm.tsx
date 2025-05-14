'use client';

import { useContext } from 'react';
import { DMHelperContext } from '../contexts/DMHelperContext';

import { EntityType } from '@lib/models/dm-helper/Entity';
import { EntityBaseForm } from './shared/EntityBaseForm';

export const AllyForm = () => {
  const { updateEntities, addAlly } = useContext(DMHelperContext);

  return (
    <EntityBaseForm
      label="Ally"
      placeholder="Enter ally name"
      addEntity={(name) => addAlly(name, undefined, undefined)}
      clearEntities={() => updateEntities([])}
      addButtonTestId="add-ally-btn"
      inputTestId="ally-name-input"
    />
  );
};
