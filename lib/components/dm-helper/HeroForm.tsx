'use client';

import React, { useState } from 'react';
import { DMHelperContext } from '../contexts/DMHelperContext';
import { EntityBaseForm } from './shared/EntityBaseForm';
import { VStack, FormControl, FormLabel, Input } from '@chakra-ui/react';

export const HeroForm = () => {
  const { addHero } = React.useContext(DMHelperContext);
  const [heroName, setHeroName] = useState('');
  const [health, setHealth] = useState('');
  const [initiative, setInitiative] = useState('');

  const handleAddHero = () => {
    if (heroName) {
      addHero(heroName, health ? parseInt(health, 10) : undefined, initiative ? parseInt(initiative, 10) : undefined);
      setHeroName('');
      setHealth('');
      setInitiative('');
    }
  };

  return (
    <EntityBaseForm onSubmit={handleAddHero} label="Hero">
      <FormControl>
        <FormLabel color="white">Hero Name</FormLabel>
        <Input
          type="text"
          value={heroName}
          onChange={(e) => setHeroName(e.target.value)}
          color="white"
          textFillColor={'whiteAlpha.800'}
          placeholder="Enter hero name"
          required
          data-testid="hero-name-input"
        />
      </FormControl>
    </EntityBaseForm>
  );
};
