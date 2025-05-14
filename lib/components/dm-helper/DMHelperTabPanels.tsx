import { TabPanels, TabPanel, Flex, Box, Heading, Image, TabPanelProps } from '@chakra-ui/react';
import React from 'react';
import CombatManagementBar from './CombatManagementBar';
import { EntityList } from './EntityList';
import { HeroForm } from './HeroForm';
import { HeroList } from './HeroList';
import { InviteOthersForm } from './InviteOthersForm';
import { MobQuickAdd } from './MobQuickAdd';
import UserRoomSettingsComponent from './UserRoomSettingsComponent';
import { AllyList } from './AllyList';
import MobForm from './MobForm';
import AllyForm from './AllyForm';

export default function DMHelperTabPanels(props: { readOnlyRoom: boolean; combatStarted: boolean }) {
  const { readOnlyRoom, combatStarted } = props;

  return (
    <TabPanels maxH="100%">
      {/* Combat Tab Panel*/}
      <DMHelperTabPanel justifyItems={'center'} h="100%">
        <Flex
          direction={{ base: 'column', lg: 'row' }}
          justifyContent="center"
          gap="12"
          w={readOnlyRoom ? { base: '100%', lg: '65%' } : '100%'}
          h="100%"
        >
          {!readOnlyRoom && (
            <Flex direction="column" gap="4" w={{ base: '100%', lg: '35%' }}>
              <MobForm />
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
            {!readOnlyRoom && <CombatManagementBar />}
          </Flex>
        </Flex>
      </DMHelperTabPanel>

      {/* Heroes Tab Panel*/}
      {!readOnlyRoom && (
        <DMHelperTabPanel>
          <Flex gap="4" justifyContent="center" flexDir={'column'} w="100%">
            <Flex gap="4" w="100%">
              <HeroForm />
              <HeroList />
            </Flex>
            <Flex gap="4">
              <AllyForm />
              <AllyList />
            </Flex>
          </Flex>
        </DMHelperTabPanel>
      )}

      {/* Invite Others Tab Panel*/}
      {!readOnlyRoom && (
        <DMHelperTabPanel>
          <Flex gap="4" justifyContent="center">
            <InviteOthersForm />
          </Flex>
        </DMHelperTabPanel>
      )}

      {/* "Manage" Tab Panel */}
      <DMHelperTabPanel>
        <UserRoomSettingsComponent />
      </DMHelperTabPanel>
    </TabPanels>
  );
}

function DMHelperTabPanel(props: TabPanelProps) {
  const { children, ...rest } = props;
  return (
    <TabPanel maxH="100%" px="0" {...rest}>
      {children}
    </TabPanel>
  );
}
