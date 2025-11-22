import {
  Text,
  Flex,
  Button,
  FlexProps,
  Icon,
  Tooltip,
  Input,
  Image,
  Circle,
  Img,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
} from '@chakra-ui/react';
import { FaUserEdit, FaEye, FaEyeSlash, FaArrowUp } from 'react-icons/fa';
import { BsThreeDotsVertical } from 'react-icons/bs';
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

  // Build menu items for mobile
  const menuItems: React.ReactElement[] = [];

  if (showKill && !readOnly && onRemove) {
    menuItems.push(
      <MenuItem key="kill" onClick={onRemove} color="red.300" data-testid={removeButtonTestId ?? `${entity.id}-kill`}>
        Kill
      </MenuItem>
    );
  }

  if (showRemove && onRemove) {
    menuItems.push(
      <MenuItem
        key="remove"
        onClick={onRemove}
        color="red.300"
        data-testid={removeButtonTestId ?? `${entity.id}-remove`}
      >
        Remove
      </MenuItem>
    );
  }

  if (!readOnly && onEdit) {
    menuItems.push(
      <MenuItem key="edit" onClick={onEdit} data-testid={editButtonTestId ?? `${entity.id}-edit`}>
        <Icon as={FaUserEdit} mr={2} />
        {editTooltipLabel}
      </MenuItem>
    );
  }

  if (showDetails) {
    if (canViewDetails && onDetailsOpen) {
      menuItems.push(
        <MenuItem
          key="details"
          onClick={onDetailsOpen}
          data-testid={detailsButtonTestId ?? `view-details-${entity.id}`}
        >
          <Icon as={FaEye} mr={2} />
          View Details
        </MenuItem>
      );
    } else {
      menuItems.push(
        <MenuItem key="details" isDisabled data-testid={detailsButtonTestId ?? `view-details-${entity.id}`}>
          <Icon as={FaEyeSlash} mr={2} />
          Can't find details
        </MenuItem>
      );
    }
  }

  if (showBench) {
    if (!entity.skipInCombat) {
      menuItems.push(
        <MenuItem
          key="bench"
          onClick={onBench}
          isDisabled={entity.type === EntityType.MOB}
          data-testid={removeButtonTestId ?? `${entity.id}-unbench`}
        >
          <Icon as={SiBlockbench} mr={2} />
          {entity.type === EntityType.MOB ? 'Cannot bench enemies.' : 'Bench'}
        </MenuItem>
      );
    } else {
      menuItems.push(
        <MenuItem key="unbench" onClick={onUnbench} data-testid={removeButtonTestId ?? `${entity.id}-unbench`}>
          <Icon as={FaArrowUp} mr={2} />
          Unbench
        </MenuItem>
      );
    }
  }

  return (
    <AnimatedFlex
      align="center"
      justify="space-between"
      p={{ base: 1, lg: 2 }}
      borderBottomWidth={1}
      _hover={{ bg: 'secondary.600', cursor: 'pointer' }}
      className="group"
      data-testid={`${entity.id}-item`}
      flexWrap={{ base: 'nowrap', lg: 'nowrap' }}
      {...props}
    >
      {/* Mobile Layout: Menu, Initiative, Image, Name, HP Input */}
      <Flex w="full" minW="0" alignItems="center" gap={2} display={{ base: 'flex', lg: 'none' }}>
        {/* Three-dots Menu - Far Left */}
        {menuItems.length > 0 && (
          <Menu>
            <MenuButton
              as={IconButton}
              icon={<BsThreeDotsVertical />}
              variant="ghost"
              size="sm"
              aria-label="Entity actions"
              flexShrink={0}
              color="white"
              _hover={{ bg: 'whiteAlpha.200' }}
            />
            <MenuList bg="blackAlpha.900" borderColor="gray.600">
              {menuItems}
            </MenuList>
          </Menu>
        )}

        {/* Initiative */}
        {showInitiative && entity.initiative && (
          <Text as="span" fontWeight="800" data-testid={`${entity.id}-initiative`} w="8" fontSize="xs" flexShrink={0}>
            {entity.initiative < 10 && <span>&nbsp;</span>}
            {`(${entity.initiative})`}
          </Text>
        )}

        {/* Profile Picture */}
        {entity.profilePictureUrl ? (
          <Circle size="32px" overflow="hidden" flexShrink={0}>
            <Image src={entity.profilePictureUrl} alt={`${entity.name} profile pic`} />
          </Circle>
        ) : (
          <Circle size="32px" overflow="hidden" flexShrink={0}>
            <Img
              src={`/static/images/unknown-profile-pic.png`}
              alt="Unknown profile pic"
              mx="auto"
              objectPosition="center top"
            />
          </Circle>
        )}

        {/* Entity Name with Color */}
        <Text
          as="span"
          fontWeight="800"
          textColor={props.textColor}
          data-testid={`${entity.id}-name`}
          fontSize="sm"
          isTruncated
          flex="1"
          minW="0"
        >
          {entityName}
        </Text>

        {/* HP Input */}
        {showHealth && !readOnly && (
          <Flex alignItems="center" gap={1} flexShrink={0}>
            <Text fontSize="xs" whiteSpace="nowrap">
              HP:
            </Text>
            <Input
              type="number"
              textColor="white"
              fontWeight="800"
              value={entity.health ?? ''}
              onChange={(e) => onHealthChange?.(e.target.value)}
              w="70px"
              fontSize="xs"
              size="sm"
              data-testid={healthTestId ?? `${entity.id}-health`}
            />
          </Flex>
        )}
      </Flex>

      {/* Desktop Layout: Original design */}
      <Flex w="full" minW="0" flex="1" display={{ base: 'none', lg: 'flex' }}>
        <Flex alignItems="center" flex="1" gap={2} py={2} minW="0">
          {/* Initiative */}
          {showInitiative && entity.initiative && (
            <Text as="span" fontWeight="800" data-testid={`${entity.id}-initiative`} w={10} fontSize="sm">
              {entity.initiative < 10 && <span>&nbsp;</span>}
              {`(${entity.initiative})`}
            </Text>
          )}

          {/* Profile Picture */}
          {entity.profilePictureUrl ? (
            <Circle size="32px" overflow="hidden" flexShrink={0}>
              <Image src={entity.profilePictureUrl} alt={`${entity.name} profile pic`} />
            </Circle>
          ) : (
            <Circle size="32px" overflow="hidden" flexShrink={0}>
              <Img
                src={`/static/images/unknown-profile-pic.png`}
                alt="Unknown profile pic"
                mx="auto"
                objectPosition="center top"
              />
            </Circle>
          )}
          <Text
            as="span"
            fontWeight="800"
            textColor={props.textColor}
            data-testid={`${entity.id}-name`}
            fontSize="md"
            isTruncated
          >
            &nbsp;{entityName}
          </Text>
        </Flex>
        {showHealth && !readOnly && (
          <Flex flex="1" alignItems="center" justifyContent={'flex-end'} mr={3}>
            <Text fontSize="sm">HP:</Text>
            <Input
              type="number"
              textColor="white"
              fontWeight="800"
              value={entity.health ?? ''}
              onChange={(e) => onHealthChange?.(e.target.value)}
              w="90px"
              ml={2}
              fontSize="sm"
              data-testid={healthTestId ?? `${entity.id}-health`}
            />
          </Flex>
        )}
      </Flex>
      <Flex gap={2} flexShrink={0} display={{ base: 'none', lg: 'flex' }}>
        {showKill && !readOnly && (
          <Button
            variant="redSolid"
            onClick={onRemove}
            data-testid={removeButtonTestId ?? `${entity.id}-kill`}
            size="md"
          >
            Kill
          </Button>
        )}
        {showRemove && onRemove && (
          <Button
            variant="redSolid"
            onClick={onRemove}
            data-testid={removeButtonTestId ?? `${entity.id}-remove`}
            size="md"
          >
            Remove
          </Button>
        )}

        {!readOnly && onEdit && (
          <Tooltip label={editTooltipLabel} aria-label={editTooltipLabel} hasArrow>
            <Button
              variant="primarySolid"
              onClick={onEdit}
              data-testid={editButtonTestId ?? `${entity.id}-edit`}
              size="md"
            >
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
                size="md"
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
                size="md"
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
              size="md"
            >
              <SiBlockbench />
            </Button>
          </Tooltip>
        )}
        {showBench && entity.skipInCombat && (
          <Tooltip label="Unbench" aria-label="Unbench" hasArrow placement="right">
            <Button
              variant="outline"
              onClick={onUnbench}
              data-testid={removeButtonTestId ?? `${entity.id}-unbench`}
              size="md"
            >
              <FaArrowUp />
            </Button>
          </Tooltip>
        )}
      </Flex>
    </AnimatedFlex>
  );
};
