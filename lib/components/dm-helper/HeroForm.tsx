'use client';

import { useContext } from 'react';
import { DMHelperContext } from '../contexts/DMHelperContext';
import { EntityBaseForm } from './shared/EntityBaseForm';

export const HeroForm = () => {
  const { updateEntities, addHero } = useContext(DMHelperContext);

  return (
    <EntityBaseForm
      label="Hero"
      placeholder="Enter hero name"
      addEntity={(name) => addHero(name, undefined, undefined)}
      clearEntities={() => updateEntities([])}
      addButtonTestId="add-hero-btn"
      inputTestId="hero-name-input"
    />
  );
};
