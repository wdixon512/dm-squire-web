import { Text, Flex, Button, FlexProps, Icon, Tooltip, Input, Image, Circle } from '@chakra-ui/react';
import { FaUserEdit, FaEye, FaEyeSlash, FaArrowUp } from 'react-icons/fa';
import { SiBlockbench } from 'react-icons/si';
import AnimatedFlex from '@components/global/AnimatedFlex';
import React, { useContext } from 'react';
import { Entity, EntityType } from '@lib/models/dm-helper/Entity';
import { DMHelperContext } from '@lib/components/contexts/DMHelperContext';

interface EntityItemBaseProps extends FlexProps {
  entity: Entity;
  entityName?: string;
  showInitiative?: boolean;
  showRemove?: boolean;
  showHealth?: boolean;
  showKill?: boolean;
  showDetails?: boolean;
  showBench?: boolean;
  onRemove?: () => void;
  onEdit?: () => void;
  onUnbench?: () => void;
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
  showBench,
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
  const { updateEntity } = useContext(DMHelperContext);

  const onUnbench = () => {
    updateEntity({ ...entity, skipInCombat: false });
  };

  const onBench = () => {
    updateEntity({ ...entity, skipInCombat: true });
  };

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
        <Flex alignItems="center" flex="1" gap="2" py={2}>
          {showInitiative && entity.initiative && (
            <Text as="span" fontWeight="800" data-testid={`${entity.id}-initiative`}>
              ({entity.initiative})
            </Text>
          )}
          {entity.profilePictureUrl && (
            <Circle size="32px" overflow="hidden">
              <Image src={entity.profilePictureUrl} alt={`${entity.name} profile pic`} />
            </Circle>
          )}
          <Text as="span" fontWeight="800" textColor={props.textColor} data-testid={`${entity.id}-name`}>
            &nbsp;{entityName}
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
        {showBench && !entity.skipInCombat && (
          <Tooltip
            label={entity.type === EntityType.MOB ? 'Cannot bench enemies.' : 'Bench'}
            aria-label="Bench"
            hasArrow
            placement="right"
          >
            <Button
              variant="outline"
              onClick={onBench}
              data-testid={removeButtonTestId ?? `${entity.id}-unbench`}
              disabled={entity.type === EntityType.MOB}
            >
              <SiBlockbench />
            </Button>
          </Tooltip>
        )}
        {showBench && entity.skipInCombat && (
          <Tooltip label="Unbench" aria-label="Unbench" hasArrow placement="right">
            <Button variant="outline" onClick={onUnbench} data-testid={removeButtonTestId ?? `${entity.id}-unbench`}>
              <FaArrowUp />
            </Button>
          </Tooltip>
        )}
      </Flex>
    </AnimatedFlex>
  );
};
