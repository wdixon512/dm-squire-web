'use client';

import { Box, FlexProps, Icon, Text, useToast } from '@chakra-ui/react';
import { Entity, EntityType } from '@lib/models/dm-helper/Entity';
import React, { useContext } from 'react';
import MobItem from './MobItem';
import HeroItem from './HeroItem';
import { Mob } from '@lib/models/dm-helper/Mob';
import { Hero } from '@lib/models/dm-helper/Hero';
import { useDrag, useDrop } from 'react-dnd';
import { sortEntitiesByInitiative } from '@lib/util/mobUtils';
import { FaUserEdit } from 'react-icons/fa';
import { DMHelperContext } from '../contexts/DMHelperContext';
import AllyItem from './AllyItem';
import { Ally } from '@lib/models/dm-helper/Ally';

type DraggedEntity = Entity & { index: number };

interface EntityItemProps extends FlexProps {
  entity: Entity;
  index: number;
  combatStarted: boolean;
  draggable?: boolean;
}

export const EntityItem: React.FC<EntityItemProps> = ({ entity, combatStarted, draggable, index }) => {
  const toast = useToast();
  const { entities, updateEntities } = useContext(DMHelperContext);

  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: EntityType.ENTITY,
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
      item: { index, ...entity },
    }),
    [entity]
  );

  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: EntityType.ENTITY,
      drop: (item: DraggedEntity) => {
        handleDrop(item);
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    }),
    [entity, entities]
  );

  const handleDrop = (draggedEntity: DraggedEntity) => {
    if (!draggedEntity) return;

    const reorderedEntities = Array.from(sortEntitiesByInitiative(entities));

    // Remove the dragged entity from its original position
    const [removed] = reorderedEntities.splice(draggedEntity.index, 1);

    // Insert the dragged entity into its new position
    reorderedEntities.splice(index, 0, removed);

    // validate that the entities are still in the correct order
    const sortedEntities = sortEntitiesByInitiative(reorderedEntities);
    if (JSON.stringify(sortedEntities) !== JSON.stringify(reorderedEntities)) {
      toast({
        title: 'Invalid move',
        description: (
          <Text>
            You cannot move an entity out of initiative order. To change a creature's initiative, hover over the
            creature and click {'  '}
            <Icon as={FaUserEdit} />
          </Text>
        ),
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }

    updateEntities(reorderedEntities);
  };

  return draggable ? (
    drop(
      <div>
        <Box borderTop={isOver ? '2px' : '0px'}>
          {drag(
            <div>
              <Box data-testid="entity-item">
                {entity.type === EntityType.MOB && <MobItem mob={entity as Mob} />}
                {entity.type === EntityType.HERO && combatStarted && (
                  <HeroItem hero={entity as Hero} textColor={'interactive.200'} />
                )}
                {entity.type === EntityType.ALLY && combatStarted && (
                  <AllyItem ally={entity as Ally} textColor={'interactive.200'} />
                )}
              </Box>
            </div>
          )}
        </Box>
      </div>
    )
  ) : (
    <div>
      <Box data-testid="entity-item">
        {entity.type === EntityType.MOB ? (
          <MobItem mob={entity as Mob} />
        ) : (
          combatStarted && <HeroItem hero={entity as Hero} textColor={'interactive.200'} />
        )}
      </Box>
    </div>
  );
};

export default EntityItem;
