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
        py={{ base: "1", lg: "2" }}
        px={{ base: 1, lg: 0 }}
        w="100%"
        bgColor="blackAlpha.900"
        borderBottom="2px solid"
        borderColor="marioRed.500"
        opacity={0.95}
        clipPath={{ base: "none", lg: "polygon(3% 0%, 100% 0%, 97% 100%, 0% 100%)" }}
        flexWrap={{ base: "wrap", lg: "nowrap" }}
        gap={{ base: 1, lg: 0 }}
        overflowX={{ base: "auto", lg: "visible" }}
      >
        {/* Combat Tab*/}
        <Tab
          _selected={{ color: 'white', bg: 'primary.200' }}
          borderRadius="lg"
          fontWeight="bold"
          data-testid="combat-panel"
          fontSize={{ base: "xs", lg: "md" }}
          px={{ base: 2, lg: 4 }}
          py={{ base: 1, lg: 2 }}
        >
          <Image src="/static/images/sword.png" alt="sword-icon" w={{ base: "16px", lg: "20px" }} h={{ base: "16px", lg: "20px" }} mr={{ base: "0.5", lg: "1" }} />
          <Text as="span" lineHeight={{ base: "16px", lg: "24px" }}>
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
              fontSize={{ base: "xs", lg: "md" }}
              px={{ base: 2, lg: 4 }}
              py={{ base: 1, lg: 2 }}
            >
              <Image src="/static/images/knight.png" alt="knight" w={{ base: "16px", lg: "20px" }} h={{ base: "16px", lg: "20px" }} mr={{ base: "0.5", lg: "1" }} />
              <Text as="span" lineHeight={{ base: "16px", lg: "24px" }}>
                Characters
              </Text>
            </Tab>

            {/* Invite Others Tab */}
            <Tab
              _selected={{ color: 'white', bg: 'primary.200' }}
              borderRadius="lg"
              fontWeight="bold"
              data-testid="invite-others-panel"
              fontSize={{ base: "xs", lg: "md" }}
              px={{ base: 2, lg: 4 }}
              py={{ base: 1, lg: 2 }}
            >
              <Image src="/static/images/join-party.png" alt="knight" w={{ base: "16px", lg: "20px" }} h={{ base: "16px", lg: "20px" }} mr={{ base: "0.5", lg: "1" }} />
              <Text as="span" lineHeight={{ base: "16px", lg: "24px" }}>
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
          fontSize={{ base: "xs", lg: "md" }}
          px={{ base: 2, lg: 4 }}
          py={{ base: 1, lg: 2 }}
        >
          <Icon as={FaUserCog} w={{ base: 4, lg: 6 }} h={{ base: 4, lg: 6 }} mr={{ base: 1, lg: 2 }} />
          <Text as="span" lineHeight={{ base: "16px", lg: "24px" }}>
            Manage
          </Text>
        </Tab>
      </TabList>
    </>
  );
}
