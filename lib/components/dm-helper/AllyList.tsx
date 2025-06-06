'use client';

import { Box, List } from '@chakra-ui/react';
import { useContext } from 'react';
import { DMHelperContext } from '../contexts/DMHelperContext';
import AllyItem from './AllyItem';
export const AllyList = () => {
  const { allies, isClient } = useContext(DMHelperContext);

  return (
    <Box
      p={4}
      bg="blackAlpha.900"
      borderWidth={1}
      borderRadius="md"
      shadow="md"
      w={{ base: '100%', lg: '500px' }}
      opacity=".95"
      flex="1"
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
