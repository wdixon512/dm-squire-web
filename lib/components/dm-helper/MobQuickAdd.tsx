'use client';

import {
  Box,
  Button,
  Flex,
  FlexProps,
  useDisclosure,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Icon,
} from '@chakra-ui/react';
import { useContext } from 'react';
import { DMHelperContext } from '../contexts/DMHelperContext';
import { Mob } from '@lib/models/dm-helper/Mob';
import ClearQuickAddModal from './modals/ClearQuickAddModal';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { FaBolt } from 'react-icons/fa';

export const MobQuickAdd = (props: FlexProps) => {
  const { ...rest } = props;
  const { mobFavorites, addMob, updateMobFavorites, isClient, readOnlyRoom } = useContext(DMHelperContext);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleAddMob = (mob: Mob) => {
    addMob(mob.name, mob.health, mob.initiative, mob.profilePictureUrl, mob.isLibraryMob);
  };

  const handleRemoveFavorite = (mob: Mob) => {
    updateMobFavorites(mobFavorites.filter((m) => m !== mob));
  };

  const showClearQuickAddForm = (e) => {
    e.preventDefault();
    onOpen();
  };

  return (
    !readOnlyRoom && (
      <>
        {isClient && (
          <Box {...rest}>
            <Menu placement="bottom-end" closeOnSelect={false}>
              <MenuButton
                as={Button}
                leftIcon={<Icon as={FaBolt} color="yellow.400" />}
                rightIcon={<ChevronDownIcon />}
                variant="outline"
                size={{ base: 'sm', lg: 'md' }}
                color="white"
                bg="blackAlpha.900"
                borderColor="gray.600"
                _hover={{ bg: 'gray.700', borderColor: 'gray.500' }}
                _active={{ bg: 'gray.600', borderColor: 'gray.400' }}
                _focus={{ bg: 'gray.700', borderColor: 'gray.500' }}
                justifyContent="space-between"
                fontWeight="bold"
                fontSize={{ base: 'xs', lg: 'sm' }}
              >
                Quick Add {mobFavorites.length > 0 && `(${mobFavorites.length})`}
              </MenuButton>
              <MenuList
                bgColor="blackAlpha.900"
                borderColor="gray.600"
                maxH="60vh"
                overflowY="auto"
                minW={{ base: '180px', lg: '250px' }}
                w={{ base: '100%', lg: 'auto' }}
                fontSize={{ base: 'sm', lg: 'md' }}
              >
                {mobFavorites.length === 0 ? (
                  <MenuItem isDisabled bg="blackAlpha.600" fontSize={{ base: 'xs', lg: 'sm' }}>
                    No enemies in Quick Add
                  </MenuItem>
                ) : (
                  <>
                    {mobFavorites.map((mob, i) => (
                      <MenuItem
                        key={i}
                        onClick={() => handleAddMob(mob)}
                        bg="blackAlpha.600"
                        fontSize={{ base: 'xs', lg: 'sm' }}
                        _hover={{ bg: 'gray.700', color: 'white' }}
                        _focus={{
                          bg: 'gray.700',
                          color: 'white',
                          outline: '2px solid',
                          outlineColor: 'yellow.400',
                          outlineOffset: '-2px',
                        }}
                        transition="all 0.2s"
                        data-testid={`${mob.id.toLowerCase()}-quickadd-btn`}
                      >
                        <Flex w="100%" justifyContent="space-between" alignItems="center">
                          <Box flex="1">{mob.name}</Box>
                          <Box
                            as="span"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveFavorite(mob);
                            }}
                            cursor="pointer"
                            color="red.300"
                            _hover={{ color: 'red.100' }}
                            fontSize={{ base: 'xs', lg: 'sm' }}
                            fontWeight="bold"
                            px={2}
                            data-testid={`${mob.id.toLowerCase()}-quickadd-remove-btn`}
                          >
                            X
                          </Box>
                        </Flex>
                      </MenuItem>
                    ))}
                    <MenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        showClearQuickAddForm(e);
                      }}
                      bg="blackAlpha.600"
                      color="marioRed.700"
                      fontSize={{ base: 'xs', lg: 'sm' }}
                      _hover={{ bg: 'red.900', color: 'red.100' }}
                      _focus={{
                        bg: 'red.900',
                        color: 'red.100',
                        outline: '2px solid',
                        outlineColor: 'red.400',
                        outlineOffset: '-2px',
                      }}
                      transition="all 0.2s"
                      data-testid="quickadd-clear-btn"
                    >
                      Clear Quick Add
                    </MenuItem>
                  </>
                )}
              </MenuList>
            </Menu>
          </Box>
        )}
        <ClearQuickAddModal isOpen={isOpen} onClose={onClose} />
      </>
    )
  );
};
