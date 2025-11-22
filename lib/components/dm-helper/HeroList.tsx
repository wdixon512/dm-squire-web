'use client';

import { Box, List } from '@chakra-ui/react';
import { useContext } from 'react';
import { DMHelperContext } from '../contexts/DMHelperContext';
import HeroItem from './HeroItem';

export const HeroList = () => {
  const { heroes, isClient } = useContext(DMHelperContext);

  return (
    <Box
      p={{ base: 2, lg: 4 }}
      bg="blackAlpha.900"
      borderWidth={1}
      borderRadius="md"
      shadow="md"
      w={{ base: '100%', lg: '500px' }}
      opacity=".95"
      flex="1"
      minW="0"
      overflowY="auto"
      h="100%"
      sx={{
        '&::-webkit-scrollbar': {
          width: '8px',
        },
        '&::-webkit-scrollbar-track': {
          width: '8px',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: 'gray.500',
          borderRadius: '4px',
        },
      }}
    >
      {isClient && (
        <List data-testid="hero-list">
          {heroes.length === 0 ? (
            <Box textAlign="left" color="white" fontStyle="italic">
              No heroes added yet.
            </Box>
          ) : (
            heroes.map((hero, i) => (
              <HeroItem key={i} hero={hero} showInitiative={false} showRemove={true} showBench={false} />
            ))
          )}
        </List>
      )}
    </Box>
  );
};
