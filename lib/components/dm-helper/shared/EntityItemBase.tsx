import { Text, Flex, Button, FlexProps, Icon, Tooltip } from '@chakra-ui/react';
import { FaUserEdit } from 'react-icons/fa';
import AnimatedFlex from '@components/global/AnimatedFlex';
import React from 'react';
import { Entity } from '@lib/models/dm-helper/Entity';

interface EntityItemBaseProps extends FlexProps {
  entity: Entity;
  showInitiative?: boolean;
  showRemove?: boolean;
  onRemove?: () => void;
  onEdit?: () => void;
  readOnly?: boolean;
  editTooltipLabel?: string;
  removeButtonTestId?: string;
  editButtonTestId?: string;
}

export const EntityItemBase: React.FC<EntityItemBaseProps> = ({
  entity,
  showInitiative = true,
  showRemove = false,
  onRemove,
  onEdit,
  readOnly = false,
  editTooltipLabel = 'Edit Entity',
  removeButtonTestId,
  editButtonTestId,
  ...props
}) => {
  return (
    <AnimatedFlex
      align="center"
      justify="space-between"
      p={2}
      borderBottomWidth={1}
      _hover={{ bg: 'secondary.600', cursor: 'pointer' }}
      className="group"
      data-testid={`${entity.id}-item`}
      {...props}
    >
      <Flex w="full">
        <Flex alignItems="center" flex="1" py={2}>
          <Text>
            {showInitiative && entity.initiative && (
              <Text as="span" fontWeight="800" data-testid={`${entity.id}-initiative`}>
                ({entity.initiative})
              </Text>
            )}
            <Text as="span" fontWeight="800" textColor={props.textColor} data-testid={`${entity.id}-name`}>
              &nbsp;{entity.name}
            </Text>
          </Text>
        </Flex>
        <Flex flex="1" alignItems="center"></Flex>
      </Flex>
      {showRemove && onRemove && (
        <Button variant="redSolid" onClick={onRemove} data-testid={removeButtonTestId ?? `${entity.id}-remove`}>
          Remove
        </Button>
      )}
      {showInitiative && !readOnly && onEdit && (
        <Tooltip label={editTooltipLabel} aria-label={editTooltipLabel} hasArrow>
          <Button variant="primarySolid" onClick={onEdit} data-testid={editButtonTestId ?? `${entity.id}-edit`}>
            <Icon as={FaUserEdit} />
          </Button>
        </Tooltip>
      )}
    </AnimatedFlex>
  );
};
