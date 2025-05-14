import { Flex, Box, Heading, Image } from '@chakra-ui/react';
import React from 'react';
import CombatManagementBar from '../CombatManagementBar';
import { EntityList } from '../EntityList';
import { MobQuickAdd } from '../MobQuickAdd';

export default function CombatPanel(props: { readOnlyRoom: boolean; combatStarted: boolean }) {
  const { readOnlyRoom, combatStarted } = props;
  return (
    <Flex width="100%" h="100%" justifyContent="center">
      <Flex
        direction={{ base: 'column', lg: 'row' }}
        justifyContent="center"
        gap="12"
        w={readOnlyRoom ? { base: '100%', lg: '65%' } : '100%'}
        h="100%"
      >
        {!readOnlyRoom && (
          <Flex flexDir="column" gap="4" justifyContent={'start'} flex=".5">
            <CombatManagementBar />
            <MobQuickAdd />
          </Flex>
        )}
        <Flex direction="column" gap="4" flex="1" h="100%">
          {readOnlyRoom && (
            <Box w="100%" p={4} bg="blackAlpha.900" opacity=".95" borderWidth="1px" borderRadius="md" shadow="md">
              {combatStarted && (
                <Heading variant="redSolid" data-testid="combat-started-heading" textAlign="center">
                  <Box display="inline-flex" gap="4">
                    <Image src="/static/images/sword.png" alt="sword-icon" w="2.25rem" h="2.25rem" mr="1" />
                    Combat has started...
                  </Box>
                </Heading>
              )}
              {!combatStarted && (
                <Heading data-testid="combat-ended-heading" textAlign="center">
                  Combat has NOT started.
                </Heading>
              )}
            </Box>
          )}

          <EntityList />
        </Flex>
      </Flex>
    </Flex>
  );
}
