'use client';

import { Box, List } from '@chakra-ui/react';
import { useContext, useMemo } from 'react';
import { DMHelperContext } from '../contexts/DMHelperContext';
import MobItem from './MobItem';
import { EntityType } from '@lib/models/dm-helper/Entity';
import { Mob } from '@lib/models/dm-helper/Mob';

export const MobList = () => {
  const { entities, isClient } = useContext(DMHelperContext);
  const mobs = useMemo(() => entities.filter((entity) => entity.type === EntityType.MOB), [entities]) as Mob[];

  return (
    <Box
      p={4}
      bg="blackAlpha.900"
      borderWidth={1}
      borderRadius="md"
      shadow="md"
      opacity=".95"
      flex="1"
      h="100%"
      overflowY="auto"
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
        <List data-testid="mob-list">
          {mobs.map((mob, i) => (
            <MobItem key={i} mob={mob} textColor="marioRed.200" />
          ))}
        </List>
      )}
    </Box>
  );
};
