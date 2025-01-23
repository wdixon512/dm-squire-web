'use client';

import {
  Flex,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Text,
  Button,
  useDisclosure,
  Heading,
  Icon,
  Image,
  Box,
} from '@chakra-ui/react';
import { MobForm } from '@lib/components/dm-helper/MobForm';
import { HeroForm } from '@lib/components/dm-helper/HeroForm';
import { DMHelperContext } from '@lib/components/contexts/DMHelperContext';
import { EntityList } from '@lib/components/dm-helper/EntityList';
import { MobQuickAdd } from '@lib/components/dm-helper/MobQuickAdd';
import { HeroList } from '@lib/components/dm-helper/HeroList';
import { useContext } from 'react';
import { InitiativeModal } from '@lib/components/dm-helper/modals/InititativeModal';
import EndCombatConfirmationModal from './modals/EndCombatConfirmationModal';
import { InviteOthersForm } from './InviteOthersForm';
import { UserRoomSettingsComponent } from './UserRoomSettingsComponent';
import { FaUserCog } from 'react-icons/fa';

export const DMHelperComponent = () => {
  const { combatStarted, updateCombatStarted, heroes, resetHeroInitiatives, readOnlyRoom } =
    useContext(DMHelperContext);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: endCombatIsOpen, onOpen: onEndCombatModalOpen, onClose: onEndCombatModalClose } = useDisclosure();

  const startCombat = () => {
    if (heroes.length > 0) {
      resetHeroInitiatives();
      onOpen();
    }
    updateCombatStarted(true);
  };

  const endCombat = () => {
    onEndCombatModalOpen();

    if (!combatStarted) {
      resetHeroInitiatives();
      updateCombatStarted(false);
    }
  };

  return (
    <>
      <Tabs display="flex" flexDir="column" alignContent={'center'}>
        <>
          <TabList
            alignSelf="center"
            border="2px solid"
            justifyContent="center"
            mb="4"
            p={2}
            w="fit-content"
            bgColor="secondary.500"
          >
            <Tab
              _selected={{ color: 'white', bg: 'primary.200' }}
              borderRadius="lg"
              fontWeight="bold"
              data-testid="combat-panel"
            >
              <Image src="/static/images/sword.png" alt="sword-icon" w="20px" h="20px" mr="1" />
              <Text as="span" lineHeight="24px">
                Combat
              </Text>
            </Tab>
            {!readOnlyRoom && (
              <>
                <Tab
                  _selected={{ color: 'white', bg: 'primary.200' }}
                  borderRadius="lg"
                  fontWeight="bold"
                  data-testid="heroes-panel"
                >
                  <Image src="/static/images/knight.png" alt="knight" w="20px" h="20px" mr="1" />
                  <Text as="span" lineHeight="24px">
                    Heroes
                  </Text>
                </Tab>
                <Tab
                  _selected={{ color: 'white', bg: 'primary.200' }}
                  borderRadius="lg"
                  fontWeight="bold"
                  data-testid="invite-others-panel"
                >
                  <Image src="/static/images/join-party.png" alt="knight" w="20px" h="20px" mr="1" />
                  <Text as="span" lineHeight="24px">
                    Invite Others
                  </Text>
                </Tab>
              </>
            )}
            <Tab
              _selected={{ color: 'white', bg: 'primary.200' }}
              borderRadius="lg"
              fontWeight="bold"
              data-testid="user-room-settings-panel"
            >
              <Icon as={FaUserCog} w={6} h={6} mr={2} />
              <Text as="span" lineHeight="24px">
                Manage
              </Text>
            </Tab>
          </TabList>
        </>

        <TabPanels>
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
                {!readOnlyRoom ? (
                  <>
                    {combatStarted ? (
                      <Button
                        variant="redSolid"
                        onClick={() => endCombat()}
                        data-testid="end-combat-btn"
                        px="8"
                        alignSelf="center"
                      >
                        End Combat
                      </Button>
                    ) : (
                      <Button onClick={() => startCombat()} data-testid="start-combat-button" px="8" alignSelf="center">
                        Start Combat
                      </Button>
                    )}
                  </>
                ) : (
                  <Box>
                    {combatStarted && (
                      <Heading variant="redSolid" data-testid="combat-started-heading" textAlign="center">
                        Combat has started...
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
          </TabPanel>

          {!readOnlyRoom && (
            <TabPanel>
              <Flex gap="4" justifyContent="center">
                <HeroForm />
                <HeroList />
              </Flex>
            </TabPanel>
          )}
          {!readOnlyRoom && (
            <TabPanel>
              <Flex gap="4" justifyContent="center">
                <InviteOthersForm />
              </Flex>
            </TabPanel>
          )}
          <TabPanel>
            <UserRoomSettingsComponent />
          </TabPanel>
        </TabPanels>
      </Tabs>

      <InitiativeModal isOpen={isOpen} heroes={heroes} onClose={onClose} />
      <EndCombatConfirmationModal
        isOpen={endCombatIsOpen}
        updateCombatStarted={updateCombatStarted}
        onClose={onEndCombatModalClose}
      />
    </>
  );
};
