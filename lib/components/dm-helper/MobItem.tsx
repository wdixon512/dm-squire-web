'use client';

import { Text, Flex, Input, Button, FlexProps, Tooltip, Icon, useDisclosure } from '@chakra-ui/react';
import AnimatedFlex from '@components/global/AnimatedFlex';
import { Mob } from '@lib/models/dm-helper/Mob';
import { useContext } from 'react';
import { DMHelperContext } from '../contexts/DMHelperContext';
import React from 'react';
import { FaEye, FaEyeSlash, FaUserEdit } from 'react-icons/fa';
import EntityEditModal from './modals/EntityEditModal';
import EntityDetailModal from './modals/EntityDetailModal';
import { EntityType } from '@lib/models/dm-helper/Entity';

interface MobItemProps extends FlexProps {
  mob: Mob;
  handleDrop?: (id: string | number, x: number, y: number) => void;
}

export const MobItem: React.FC<MobItemProps> = ({ mob, handleDrop, textColor, ...props }) => {
  const { entities, removeEntity, updateEntities, readOnlyRoom } = useContext(DMHelperContext);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: mobDetailIsOpen, onOpen: onMobDetailOpen, onClose: onMobDetailClose } = useDisclosure();

  const hasMultipleMobsWithSameName = (mobName: string) => {
    return entities.filter((e) => e.name === mobName && e.type === EntityType.MOB).length > 1;
  };

  const updateHealth = (mob: Mob, newHealth) => {
    updateEntities(entities.map((m) => (m.id === mob.id ? { ...m, health: newHealth } : m)));
  };

  const showEntityEditForm = (e) => {
    e.preventDefault();
    onOpen();
  };

  const handleMobDetailOpen = (e) => {
    e.preventDefault();
    if (!mob.name) return;
    onMobDetailOpen();
  };

  return (
    <AnimatedFlex
      role="group"
      align="center"
      key={props.key}
      justify="space-between"
      p={2}
      borderBottomWidth={1}
      _hover={{ bg: 'secondary.600', cursor: 'pointer' }}
      data-testid={`${mob.id}-item`}
      {...props}
    >
      <Flex w="full">
        <Flex alignItems="center" flex="1" py={'2'}>
          <Text>
            {mob.initiative && (
              <Text as="span" fontWeight="800" textColor={textColor} data-testid={`${mob.id}-initiative`}>
                ({mob.initiative})
              </Text>
            )}
            <Text as="span" fontWeight="800" textColor={textColor} data-testid={`${mob.id}-name`} color="marioRed.200">
              &nbsp;{mob.name} {hasMultipleMobsWithSameName(mob.name) ? `#${mob.number}` : ''}
            </Text>
          </Text>
        </Flex>
        {!readOnlyRoom && (
          <Flex flex="1" alignItems="center" justifyContent={'flex-end'} mr="3">
            <Text>Health:</Text>
            <Input
              type="number"
              fontWeight="800"
              value={mob.health ?? ''}
              onChange={(e) => {
                const val = e.target.value;
                updateHealth(mob, val === '' ? '' : parseInt(val, 10));
              }}
              w="90px"
              ml={2}
              data-testid={`${mob.id}-health`}
            />
          </Flex>
        )}
        {!readOnlyRoom && (
          <Button variant="redSolid" onClick={() => removeEntity(mob)} mr={2} data-testid={`${mob.id}-kill`}>
            Kill
          </Button>
        )}
        {!readOnlyRoom && (
          <>
            <Tooltip label="Update Mob" aria-label="Update Mob" hasArrow>
              <Button
                variant="primarySolid"
                onClick={(e) => showEntityEditForm(e)}
                data-testid={`${mob.id.toLowerCase()}-edit`}
              >
                <Icon as={FaUserEdit} />
              </Button>
            </Tooltip>
            {mob.isLibraryMob ? (
              <Tooltip label="View Mob Details" aria-label="View Mob Details" hasArrow>
                <Button
                  variant="primarySolid"
                  onClick={(e) => handleMobDetailOpen(e)}
                  data-testid={`view-details-${mob.id}`}
                >
                  <Icon as={FaEye} />
                </Button>
              </Tooltip>
            ) : (
              <Tooltip label="Can't find details for mob">
                <Button
                  disabled
                  variant="primarySolid"
                  _hover={{ bgColor: 'unset' }}
                  data-testid={`view-details-${mob.id}`}
                >
                  <Icon as={FaEyeSlash} />
                </Button>
              </Tooltip>
            )}
          </>
        )}
      </Flex>

      <EntityEditModal entity={mob} isOpen={isOpen} onClose={onClose} />
      <EntityDetailModal entity={mob} isOpen={mobDetailIsOpen} onClose={onMobDetailClose} />
    </AnimatedFlex>
  );
};

export default MobItem;
