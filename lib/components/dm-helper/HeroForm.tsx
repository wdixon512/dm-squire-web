'use client';

import React, { useState } from 'react';
import { DMHelperContext } from '../contexts/DMHelperContext';
import { EntityBaseForm } from './shared/EntityBaseForm';
import { Box, FormControl, FormLabel, Heading, Input } from '@chakra-ui/react';

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
    <EntityBaseForm onFormSubmit={handleAddHero} label="Hero" addButtonTestId="add-hero-button" flex=".5">
      <Heading as="h3" size="md" color="white" mb="0" borderBottom={'2px dotted'}>
        Add a{' '}
        <Box as="span" color="interactive.200">
          Hero
        </Box>
      </Heading>
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
