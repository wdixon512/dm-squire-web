import { TabPanels, TabPanel, Flex, Box, Heading, Image } from '@chakra-ui/react';
import React from 'react';
import CombatManagementBar from './CombatManagementBar';
import { EntityList } from './EntityList';
import { HeroForm } from './HeroForm';
import { HeroList } from './HeroList';
import { InviteOthersForm } from './InviteOthersForm';
import { MobForm } from './MobForm';
import { MobQuickAdd } from './MobQuickAdd';
import UserRoomSettingsComponent from './UserRoomSettingsComponent';
import { AllyList } from './AllyList';
import { AllyForm } from './AllyForm';

export default function DMHelperTabPanels(props: { readOnlyRoom: boolean; combatStarted: boolean }) {
  const { readOnlyRoom, combatStarted } = props;

  return (
    <TabPanels>
      {/* Combat Tab Panel*/}
      <TabPanel justifyItems={'center'}>
        <Flex
          direction={{ base: 'column', lg: 'row' }}
          justifyContent="center"
          gap="12"
          w={readOnlyRoom ? { base: '100%', lg: '65%' } : '100%'}
        >
          {!readOnlyRoom && (
            <Flex direction="column" gap="4" w={{ base: '100%', lg: '35%' }}>
              <MobForm />
              <MobQuickAdd />
            </Flex>
          )}
          <Flex direction="column" gap="4" flex="1">
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
            {!readOnlyRoom && <CombatManagementBar />}
          </Flex>
        </Flex>
      </TabPanel>

      {/* Heroes Tab Panel*/}
      {!readOnlyRoom && (
        <TabPanel>
          <Flex gap="4" justifyContent="center" flexDir={'column'}>
            <Flex gap="4">
              <HeroForm />
              <HeroList />
            </Flex>
            <Flex gap="4">
              <AllyForm />
              <AllyList />
            </Flex>
          </Flex>
        </TabPanel>
      )}

      {/* Invite Others Tab Panel*/}
      {!readOnlyRoom && (
        <TabPanel>
          <Flex gap="4" justifyContent="center">
            <InviteOthersForm />
          </Flex>
        </TabPanel>
      )}

      {/* "Manage" Tab Panel */}
      <TabPanel>
        <UserRoomSettingsComponent />
      </TabPanel>
    </TabPanels>
  );
}
