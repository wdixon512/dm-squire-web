'use client';

import { Box, Button, Circle, Flex, FlexProps, Heading, useDisclosure } from '@chakra-ui/react';
import { useContext } from 'react';
import { DMHelperContext } from '../contexts/DMHelperContext';
import { Mob } from '@lib/models/dm-helper/Mob';
import { AnimatePresence } from 'framer-motion';
import AnimatedFlex from '../global/AnimatedFlex';
import ClearQuickAddModal from './modals/ClearQuickAddModal';

export const MobQuickAdd = (props: FlexProps) => {
  const { ...rest } = props;
  const { mobFavorites, addMob, updateMobFavorites, isClient, readOnlyRoom } = useContext(DMHelperContext);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleAddMob = (mob: Mob) => {
    addMob(mob.name, mob.health, mob.initiative, mob.isLibraryMob);
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
        <AnimatePresence initial={false}>
          {isClient && (
            <AnimatedFlex
              direction="column"
              gap="4"
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
              {...rest}
            >
              <Flex
                direction="column"
                p={4}
                bg="blackAlpha.900"
                opacity=".95"
                borderWidth={1}
                borderRadius="md"
                shadow="md"
                gap={2}
              >
                <Heading size="md" textAlign="center" textColor="white" borderBottom={'2px solid'}>
                  Quick Add
                </Heading>
                <Flex gap="4" justifyContent={'center'} flexWrap="wrap" data-testid="mob-favorites-list" pt="2">
                  {mobFavorites.length === 0 && (
                    <Heading size="sm" textAlign="center" textColor="white" fontStyle="italic" fontWeight="normal">
                      No Mobs in Quick Add
                    </Heading>
                  )}
                  {mobFavorites.map((mob, i) => (
                    <Box position="relative" key={i}>
                      <Button
                        variant="outline"
                        width="fit"
                        onClick={() => handleAddMob(mob)}
                        data-testid={`${mob.id.toLowerCase()}-quickadd-btn`}
                      >
                        {mob.name}
                      </Button>
                      <Circle
                        size="4"
                        bg="marioRed.500"
                        color="white"
                        position="absolute"
                        top="0"
                        right="0"
                        transform="translate(40%, -40%)"
                        p="0"
                      >
                        <Button
                          onClick={() => handleRemoveFavorite(mob)}
                          size="sm"
                          borderRadius="full"
                          w="100%"
                          h="100%"
                          bg="transparent"
                          color="white"
                          fontSize={8}
                          lineHeight={8}
                          p="0"
                          mt="2px"
                          _hover={{ bg: 'transparent' }}
                          _focus={{ boxShadow: 'none' }}
                          data-testid={`${mob.id.toLowerCase()}-quickadd-remove-btn`}
                        >
                          X
                        </Button>
                      </Circle>
                    </Box>
                  ))}
                </Flex>
                <Flex justifyContent={'center'} mt="4">
                  <Button
                    color="marioRed.700"
                    variant="redLink"
                    onClick={(e) => showClearQuickAddForm(e)}
                    data-testid={`quickadd-clear-btn`}
                  >
                    Clear Quick Add
                  </Button>
                </Flex>
              </Flex>
            </AnimatedFlex>
          )}
        </AnimatePresence>
        <ClearQuickAddModal isOpen={isOpen} onClose={onClose} />
      </>
    )
  );
};
