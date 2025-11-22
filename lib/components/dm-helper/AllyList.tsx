'use client';

import { Box, List } from '@chakra-ui/react';
import { useContext } from 'react';
import { DMHelperContext } from '../contexts/DMHelperContext';
import AllyItem from './AllyItem';
export const AllyList = () => {
  const { allies, isClient } = useContext(DMHelperContext);

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
      minH="0"
      overflowY={{ base: 'visible', lg: 'auto' }}
      overflowX="hidden"
      h={{ base: 'auto', lg: '100%' }}
      maxH={{ base: 'none', lg: '100%' }}
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
        <List data-testid="ally-list">
          {allies.length === 0 ? (
            <Box textAlign="left" color="white" fontStyle="italic">
              No allies added yet.
            </Box>
          ) : (
            allies.map((ally, i) => (
              <AllyItem
                key={i}
                ally={ally}
                showInitiative={false}
                showHealth={true}
                showKill={true}
                showDetails={true}
                showBench={false}
              />
            ))
          )}
        </List>
      )}
    </Box>
  );
};
