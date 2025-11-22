import { Flex, Box, Heading, Image } from '@chakra-ui/react';
import React from 'react';
import CombatManagementBar from '../CombatManagementBar';
import { EntityList } from '../EntityList';
import { MobQuickAdd } from '../MobQuickAdd';

export default function CombatPanel(props: { readOnlyRoom: boolean; combatStarted: boolean }) {
  const { readOnlyRoom, combatStarted } = props;
  return (
    <Flex width="100%" h="100%" justifyContent="center" px={{ base: 2, lg: 0 }}>
      <Flex
        direction={{ base: 'column', lg: 'row' }}
        justifyContent="center"
        gap={{ base: 4, lg: 12 }}
        w={readOnlyRoom ? { base: '100%', lg: '65%' } : '100%'}
        h="100%"
      >
        {!readOnlyRoom && (
          <Flex flexDir="column" gap="4" justifyContent={'start'} flex={{ base: "1", lg: ".5" }} minW={{ base: "100%", lg: "auto" }}>
            <CombatManagementBar />
            <MobQuickAdd />
          </Flex>
        )}
        <Flex direction="column" gap="4" flex="1" h="100%" minW="0">
          {readOnlyRoom && (
            <Box w="100%" p={{ base: 2, lg: 4 }} bg="blackAlpha.900" opacity=".95" borderWidth="1px" borderRadius="md" shadow="md">
              {combatStarted && (
                <Heading variant="redSolid" data-testid="combat-started-heading" textAlign="center" fontSize={{ base: "md", lg: "lg" }}>
                  <Box display="inline-flex" gap={{ base: 2, lg: 4 }} flexWrap={{ base: "wrap", lg: "nowrap" }} justifyContent="center">
                    <Image src="/static/images/sword.png" alt="sword-icon" w={{ base: "1.5rem", lg: "2.25rem" }} h={{ base: "1.5rem", lg: "2.25rem" }} mr="1" />
                    Combat has started...
                  </Box>
                </Heading>
              )}
              {!combatStarted && (
                <Heading data-testid="combat-ended-heading" textAlign="center" fontSize={{ base: "md", lg: "lg" }}>
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
