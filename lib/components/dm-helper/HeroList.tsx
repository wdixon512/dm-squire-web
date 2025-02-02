'use client';

import { Box, List } from '@chakra-ui/react';
import { useContext } from 'react';
import { DMHelperContext } from '../contexts/DMHelperContext';
import HeroItem from './HeroItem';

export const HeroList = () => {
  const { heroes, isClient } = useContext(DMHelperContext);

  return (
    <Box p={4} bg="secondary.200" borderWidth={1} borderRadius="md" shadow="md" w={{ base: '100%', lg: '500px' }}>
      {isClient && (
        <List data-testid="hero-list">
          {heroes.map((hero, i) => (
            <HeroItem key={i} hero={hero} showInitiative={false} showRemove={true} />
          ))}
        </List>
      )}
    </Box>
  );
};
