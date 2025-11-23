'use client';

import { useState } from 'react';
import {
  Box,
  Flex,
  VStack,
  Button,
  Text,
  Divider,
  useBreakpointValue,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Heading,
} from '@chakra-ui/react';
import { FaDoorOpen, FaUser, FaPalette, FaUsers, FaChevronDown } from 'react-icons/fa';
import { CurrentRoomSection } from './settings/CurrentRoomSection';
import { ProfileSection } from './settings/ProfileSection';
import { DisplaySection } from './settings/DisplaySection';
import { CollaborateSection } from './settings/CollaborateSection';

type SettingsSection = 'room' | 'profile' | 'display' | 'collaborate';

const SECTIONS: Array<{ id: SettingsSection; label: string; icon: typeof FaDoorOpen }> = [
  { id: 'room', label: 'Current Room', icon: FaDoorOpen },
  { id: 'profile', label: 'Profile', icon: FaUser },
  { id: 'display', label: 'Display', icon: FaPalette },
  { id: 'collaborate', label: 'Collaborate', icon: FaUsers },
];

export const SettingsPanel: React.FC = () => {
  const [activeSection, setActiveSection] = useState<SettingsSection>('room');
  const isMobile = useBreakpointValue({ base: true, lg: false });

  const renderContent = () => {
    switch (activeSection) {
      case 'room':
        return <CurrentRoomSection />;
      case 'profile':
        return <ProfileSection />;
      case 'display':
        return <DisplaySection />;
      case 'collaborate':
        return <CollaborateSection />;
      default:
        return <CurrentRoomSection />;
    }
  };

  return (
    <Flex direction={{ base: 'column', lg: 'row' }} h="100%" w="100%" gap={{ base: 4, lg: 6 }} p={{ base: 2, lg: 4 }}>
      {/* Sidebar Navigation */}
      <Box
        w={{ base: '100%', lg: '200px' }}
        flexShrink={0}
        bg="blackAlpha.800"
        borderRadius="md"
        p={{ base: 2, lg: 4 }}
        borderWidth="1px"
        borderColor="gray.600"
      >
        {isMobile ? (
          <Menu>
            <MenuButton
              as={Button}
              rightIcon={<FaChevronDown />}
              w="100%"
              bg="blackAlpha.900"
              borderColor="gray.600"
              borderWidth="1px"
              color="white"
              _hover={{ bg: 'gray.700', borderColor: 'gray.500' }}
              _active={{ bg: 'gray.600', borderColor: 'gray.400' }}
              data-testid="settings-section-select"
            >
              {SECTIONS.find((s) => s.id === activeSection)?.label || 'Select Section'}
            </MenuButton>
            <MenuList bg="blackAlpha.900" borderColor="gray.600">
              {SECTIONS.map((section) => {
                const Icon = section.icon;
                const isActive = activeSection === section.id;
                return (
                  <MenuItem
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    bg={isActive ? 'blue.600' : 'transparent'}
                    color={isActive ? 'white' : 'gray.300'}
                    _hover={{ bg: isActive ? 'blue.600' : 'gray.700', color: 'white' }}
                    icon={<Icon />}
                    data-testid={`settings-section-${section.id}`}
                  >
                    {section.label}
                  </MenuItem>
                );
              })}
            </MenuList>
          </Menu>
        ) : (
          <VStack spacing={2} align="stretch">
            <Heading as="h2" fontSize="lg" color="white" mb={2}>
              Settings
            </Heading>
            <Divider borderColor="gray.600" />
            {SECTIONS.map((section) => {
              const Icon = section.icon;
              const isActive = activeSection === section.id;
              return (
                <Button
                  key={section.id}
                  leftIcon={<Icon />}
                  onClick={() => setActiveSection(section.id)}
                  variant={isActive ? 'solid' : 'ghost'}
                  colorScheme={isActive ? 'blue' : 'gray'}
                  justifyContent="flex-start"
                  w="100%"
                  fontSize={{ base: 'sm', lg: 'md' }}
                  size={{ base: 'sm', lg: 'md' }}
                  bg={isActive ? 'blue.600' : 'transparent'}
                  color={isActive ? 'white' : 'gray.300'}
                  _hover={{
                    bg: isActive ? 'blue.600' : 'gray.700',
                    color: 'white',
                  }}
                  data-testid={`settings-section-${section.id}`}
                >
                  {section.label}
                </Button>
              );
            })}
          </VStack>
        )}
      </Box>

      {/* Content Panel */}
      <Box
        flex="1"
        bg="blackAlpha.800"
        borderRadius="md"
        p={{ base: 4, lg: 6 }}
        borderWidth="1px"
        borderColor="gray.600"
        minH="0"
        overflowY="auto"
      >
        {renderContent()}
      </Box>
    </Flex>
  );
};
