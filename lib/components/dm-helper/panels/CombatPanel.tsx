import { Flex, Box, Heading, Image } from '@chakra-ui/react';
import React from 'react';
import CombatManagementBar from '../CombatManagementBar';
import { EntityList } from '../EntityList';
import { MobQuickAdd } from '../MobQuickAdd';

export default function CombatPanel(props: { readOnlyRoom: boolean; combatStarted: boolean }) {
  const { readOnlyRoom, combatStarted } = props;
  return (
    <Flex
      width="100%"
      h={{ base: 'auto', lg: '100%' }}
      direction="column"
      gap="4"
      px={{ base: 2, lg: 0 }}
      minH="0"
      overflow={{ base: 'visible', lg: 'hidden' }}
    >
      {!readOnlyRoom && (
        <Flex direction="row" gap="4" flexShrink={0} flexWrap="wrap" alignItems="center">
          <CombatManagementBar />
          <MobQuickAdd />
        </Flex>
      )}
      {readOnlyRoom && (
        <Box
          w="100%"
          p={{ base: 2, lg: 4 }}
          bg="blackAlpha.900"
          opacity=".95"
          borderWidth="1px"
          borderRadius="md"
          shadow="md"
          flexShrink={0}
        >
          {combatStarted && (
            <Heading
              variant="redSolid"
              data-testid="combat-started-heading"
              textAlign="center"
              fontSize={{ base: 'md', lg: 'lg' }}
            >
              <Box
                display="inline-flex"
                gap={{ base: 2, lg: 4 }}
                flexWrap={{ base: 'wrap', lg: 'nowrap' }}
                justifyContent="center"
                alignItems="center"
                fontStyle="italic"
              >
                Combat has started...
              </Box>
            </Heading>
          )}
          {!combatStarted && (
            <Heading data-testid="combat-ended-heading" textAlign="center" fontSize={{ base: 'md', lg: 'lg' }}>
              Combat has NOT started.
            </Heading>
          )}
        </Box>
      )}

      <Box flex="1" minH="0" h={{ base: 'auto', lg: '100%' }} overflow={{ base: 'visible', lg: 'hidden' }}>
        <EntityList />
      </Box>
    </Flex>
  );
}
