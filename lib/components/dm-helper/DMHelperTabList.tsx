import { TabList, Tab, Icon, Image, Text } from '@chakra-ui/react';
import React from 'react';
import { FaUserCog } from 'react-icons/fa';

export default function DMHelperTabList(props: { readOnlyRoom: boolean }) {
  const { readOnlyRoom } = props;

  return (
    <>
      <TabList
        alignSelf="center"
        justifyContent="center"
        display="flex"
        py="2"
        w="100%"
        bgColor="blackAlpha.900"
        borderBottom="2px solid"
        borderColor="marioRed.500"
        opacity={0.95}
        clipPath="polygon(3% 0%, 100% 0%, 97% 100%, 0% 100%)"
      >
        {/* Combat Tab*/}
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
            {/* Heroes Tab*/}
            <Tab
              _selected={{ color: 'white', bg: 'primary.200' }}
              borderRadius="lg"
              fontWeight="bold"
              data-testid="characters-panel"
            >
              <Image src="/static/images/knight.png" alt="knight" w="20px" h="20px" mr="1" />
              <Text as="span" lineHeight="24px">
                Characters
              </Text>
            </Tab>

            {/* Invite Others Tab */}
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

        {/* Manage Tab */}
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
  );
}
