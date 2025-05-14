import { Text, Flex, Button, FlexProps, Icon, Tooltip, Input } from '@chakra-ui/react';
import { FaUserEdit, FaEye, FaEyeSlash } from 'react-icons/fa';
import AnimatedFlex from '@components/global/AnimatedFlex';
import React from 'react';
import { Entity } from '@lib/models/dm-helper/Entity';

interface EntityItemBaseProps extends FlexProps {
  entity: Entity;
  entityName?: string;
  showInitiative?: boolean;
  showRemove?: boolean;
  showHealth?: boolean;
  showKill?: boolean;
  showDetails?: boolean;
  onRemove?: () => void;
  onEdit?: () => void;
  onHealthChange?: (value: string) => void;
  onDetailsOpen?: () => void;
  readOnly?: boolean;
  editTooltipLabel?: string;
  removeButtonTestId?: string;
  editButtonTestId?: string;
  detailsButtonTestId?: string;
  healthTestId?: string;
  canViewDetails?: boolean;
}

export const EntityItemBase: React.FC<EntityItemBaseProps> = ({
  entity,
  entityName = entity.name,
  showInitiative = true,
  showRemove = false,
  showHealth = false,
  showKill = false,
  showDetails = false,
  onRemove,
  onEdit,
  onHealthChange,
  onDetailsOpen,
  readOnly = false,
  editTooltipLabel = 'Edit Entity',
  removeButtonTestId,
  editButtonTestId,
  detailsButtonTestId,
  healthTestId,
  canViewDetails = false,
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
              &nbsp;{entityName}
            </Text>
          </Text>
        </Flex>
        {showHealth && !readOnly && (
          <Flex flex="1" alignItems="center" justifyContent={'flex-end'} mr="3">
            <Text>Health:</Text>
            <Input
              type="number"
              textColor="white"
              fontWeight="800"
              value={entity.health ?? ''}
              onChange={(e) => onHealthChange?.(e.target.value)}
              w="90px"
              ml={2}
              data-testid={healthTestId ?? `${entity.id}-health`}
            />
          </Flex>
        )}
      </Flex>
      <Flex gap={2}>
        {showKill && !readOnly && (
          <Button variant="redSolid" onClick={onRemove} data-testid={removeButtonTestId ?? `${entity.id}-kill`}>
            Kill
          </Button>
        )}
        {showRemove && onRemove && (
          <Button variant="redSolid" onClick={onRemove} data-testid={removeButtonTestId ?? `${entity.id}-remove`}>
            Remove
          </Button>
        )}
        {!readOnly && onEdit && (
          <Tooltip label={editTooltipLabel} aria-label={editTooltipLabel} hasArrow>
            <Button variant="primarySolid" onClick={onEdit} data-testid={editButtonTestId ?? `${entity.id}-edit`}>
              <Icon as={FaUserEdit} />
            </Button>
          </Tooltip>
        )}
        {showDetails &&
          (canViewDetails ? (
            <Tooltip label="View Details" aria-label="View Details" hasArrow>
              <Button
                variant="primarySolid"
                onClick={onDetailsOpen}
                data-testid={detailsButtonTestId ?? `view-details-${entity.id}`}
              >
                <Icon as={FaEye} />
              </Button>
            </Tooltip>
          ) : (
            <Tooltip label="Can't find details">
              <Button
                disabled
                variant="primarySolid"
                _hover={{ bgColor: 'unset' }}
                data-testid={detailsButtonTestId ?? `view-details-${entity.id}`}
              >
                <Icon as={FaEyeSlash} />
              </Button>
            </Tooltip>
          ))}
      </Flex>
    </AnimatedFlex>
  );
};
