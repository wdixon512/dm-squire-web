'use client';

import { Box, Button, FormControl, FormLabel, Input } from '@chakra-ui/react';
import { useContext, useState } from 'react';
import { DMHelperContext } from '../contexts/DMHelperContext';

export const HeroForm = () => {
  const [name, setName] = useState('');

  const { updateEntities, addHero } = useContext(DMHelperContext);

  const clearHeroes = () => {
    updateEntities([]);
  };

  const handleAddHero = (e) => {
    e.preventDefault();

    if (addHero(name, undefined, undefined)) {
      setName('');
    }
  };

  return (
    <Box
      as="form"
      p={4}
      bg="blackAlpha.900"
      opacity=".95"
      borderWidth={1}
      borderRadius="md"
      shadow="md"
      h="fit-content"
      onSubmit={handleAddHero}
    >
      <FormControl mb={4}>
        <FormLabel color="white">Hero Name</FormLabel>
        <Input
          type="text"
          value={name}
          color="blackAlpha.700"
          textFillColor={'whiteAlpha.800'}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter hero name"
          required={true}
          data-testid="hero-name-input"
        />
      </FormControl>

      <Button type="submit" variant="solid" width="full" data-testid="add-hero-btn">
        Add Hero
      </Button>

      <Button variant="redLink" width="full" onClick={clearHeroes} mt="4">
        Clear Heroes
      </Button>
    </Box>
  );
};
