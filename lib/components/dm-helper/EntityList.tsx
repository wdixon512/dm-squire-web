'use client';
import { Box, Heading, List, Spinner, Text } from '@chakra-ui/react';
import { useContext, useMemo } from 'react';
import { DMHelperContext } from '../contexts/DMHelperContext';
import { sortEntitiesByInitiative } from '@lib/util/mobUtils';
import { Entity } from '@lib/models/dm-helper/Entity';
import { DndProvider } from 'react-dnd';
import EntityItem from './EntityItem';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { SiBlockbench } from 'react-icons/si';

export const EntityList = () => {
  const { entities, combatStarted, isClient, loadingFirebaseRoom, readOnlyRoom } = useContext(DMHelperContext);

  const { activeEntities, benchedEntities } = useMemo(() => {
    return entities.reduce(
      (acc, entity) => {
        if (entity.skipInCombat) {
          acc.benchedEntities.push(entity);
        } else {
          acc.activeEntities.push(entity);
        }
        return acc;
      },
      { activeEntities: [] as Entity[], benchedEntities: [] as Entity[] }
    );
  }, [entities]);

  return (
    <DndProvider backend={HTML5Backend}>
      <Box
        p={4}
        bg="blackAlpha.900"
        borderWidth={1}
        borderRadius="md"
        shadow="md"
        w="100%"
        opacity=".95"
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
        {isClient &&
          (loadingFirebaseRoom ? (
            <Spinner size="lg" label="Loading entities..." />
          ) : !readOnlyRoom ? (
            <Box>
              <List data-testid="entity-list">
                {/* Empty Entities */}
                {activeEntities.length === 0 && (
                  <Box textAlign="left" color="white" fontStyle="italic">
                    No characters added yet.
                  </Box>
                )}

                {/* Active Entities */}
                {sortEntitiesByInitiative(activeEntities).map((entity: Entity, i) => (
                  <EntityItem entity={entity} index={i} key={i} combatStarted={combatStarted} draggable={true} />
                ))}

                {/* Benched Entities */}
                {benchedEntities.length > 0 && (
                  <Box>
                    <Heading
                      as="h4"
                      fontSize="2xl"
                      display="inline-flex"
                      fontStyle="italic"
                      color="white"
                      mt={4}
                      p="4"
                      w="full"
                      gap="2"
                      alignItems="center"
                      justifyContent="center"
                      bgColor="secondary.500"
                    >
                      <SiBlockbench />
                      Bench
                      <SiBlockbench />
                    </Heading>

                    {benchedEntities.map((entity: Entity, i) => (
                      <EntityItem entity={entity} index={i} key={i} combatStarted={combatStarted} draggable={false} />
                    ))}
                  </Box>
                )}
              </List>
            </Box>
          ) : combatStarted ? (
            <List data-testid="entity-list">
              {sortEntitiesByInitiative(activeEntities).map((entity: Entity, i) => (
                <EntityItem
                  entity={entity}
                  index={i}
                  key={i}
                  combatStarted={combatStarted}
                  draggable={false}
                  showBench={false}
                />
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
