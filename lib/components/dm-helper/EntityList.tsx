'use client';
import { Box, List, Spinner, Text, useToast } from '@chakra-ui/react';
import { useContext } from 'react';
import { DMHelperContext } from '../contexts/DMHelperContext';
import { sortEntitiesByInitiative } from '@lib/util/mobUtils';
import { Entity } from '@lib/models/dm-helper/Entity';
import { DndProvider } from 'react-dnd';
import EntityItem from './EntityItem';
import { HTML5Backend } from 'react-dnd-html5-backend';

export const EntityList = () => {
  const { entities, combatStarted, isClient, loadingFirebaseRoom, readOnlyRoom } = useContext(DMHelperContext);
  const toast = useToast();

  return (
    <DndProvider backend={HTML5Backend}>
      <Box p={4} bg="secondary.200" borderWidth={1} borderRadius="md" shadow="md" w="100%">
        {isClient &&
          (loadingFirebaseRoom ? (
            <Spinner size="lg" label="Loading entities..." />
          ) : !readOnlyRoom ? (
            <Box>
              <List data-testid="entity-list">
                {sortEntitiesByInitiative(entities).map((entity: Entity, i) => (
                  <EntityItem entity={entity} index={i} key={i} combatStarted={combatStarted} draggable={true} />
                ))}
              </List>
            </Box>
          ) : combatStarted ? (
            <List data-testid="entity-list">
              {sortEntitiesByInitiative(entities).map((entity: Entity, i) => (
                <EntityItem entity={entity} index={i} key={i} combatStarted={combatStarted} draggable={false} />
              ))}
            </List>
          ) : (
            <>
              <Text fontStyle="italic">When combat starts, intiative order will be shown here.</Text>
            </>
          ))}
      </Box>
    </DndProvider>
  );
};
