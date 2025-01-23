'use client';

import { Text, Flex, Button, FlexProps, Icon, useDisclosure, Tooltip } from '@chakra-ui/react';
import AnimatedFlex from '@components/global/AnimatedFlex';
import { useContext } from 'react';
import { DMHelperContext } from '../contexts/DMHelperContext';
import React from 'react';
import { Hero } from '@lib/models/dm-helper/Hero';
import { FaUserEdit } from 'react-icons/fa';
import EntityEditModal from './modals/EntityEditModal';

interface HeroItemProps extends FlexProps {
  hero: Hero;
  showInitiative?: boolean;
  showRemove?: boolean;
}

export const HeroItem: React.FC<HeroItemProps> = ({
  hero,
  showInitiative = true,
  showRemove = false,
  textColor,
  ...props
}) => {
  const { removeEntity, readOnlyRoom } = useContext(DMHelperContext);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const showEntityEditForm = () => {
    onOpen();
  };

  return (
    <AnimatedFlex
      align="center"
      key={props.key}
      justify="space-between"
      p={2}
      borderBottomWidth={1}
      _hover={{ bg: 'secondary.600', cursor: 'pointer' }}
      className="group"
      data-testid={`${hero.id}-item`}
      {...props}
    >
      <Flex w="full">
        <Flex alignItems="center" flex="1" py={2}>
          <Text>
            {showInitiative && hero.initiative && (
              <Text as="span" fontWeight="800" data-testid={`${hero.id}-initiative`}>
                ({hero.initiative})
              </Text>
            )}
            <Text as="span" fontWeight="800" textColor={textColor} data-testid={`${hero.id}-name`}>
              &nbsp;{hero.name}
            </Text>
          </Text>
        </Flex>
        <Flex flex="1" alignItems="center"></Flex>
      </Flex>
      {showRemove && (
        <Button variant="redSolid" onClick={() => removeEntity(hero)} data-testid={`${hero.id.toLowerCase()}-remove`}>
          Remove
        </Button>
      )}
      {showInitiative && !readOnlyRoom && (
        <Tooltip label="Update Hero Initiative" aria-label="Update Hero Initiative" hasArrow>
          <Button
            variant="primarySolid"
            onClick={() => showEntityEditForm()}
            data-testid={`${hero.id.toLowerCase()}-edit`}
          >
            <Icon as={FaUserEdit} />
          </Button>
        </Tooltip>
      )}

      <EntityEditModal entity={hero} isOpen={isOpen} onClose={onClose} />
    </AnimatedFlex>
  );
};

export default HeroItem;
