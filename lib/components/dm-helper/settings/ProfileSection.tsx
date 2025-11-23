'use client';

import { Box, Flex, Heading, Image, Text, VStack, Divider } from '@chakra-ui/react';
import { auth } from '@lib/services/firebase';
import { FaUser } from 'react-icons/fa';

export const ProfileSection: React.FC = () => {
  return (
    <VStack spacing={4} align="stretch">
      <Flex alignItems="center" gap={2}>
        <FaUser color="white" />
        <Heading as="h3" fontSize={{ base: 'md', lg: 'lg' }} color="white">
          Profile
        </Heading>
      </Flex>
      <Divider borderColor="gray.600" />

      {auth.currentUser ? (
        <VStack spacing={4} align="stretch">
          {auth.currentUser.photoURL && (
            <Box>
              <Text fontSize={{ base: 'xs', lg: 'sm' }} color="gray.400" mb={2}>
                Profile Picture
              </Text>
              <Image
                src={auth.currentUser.photoURL}
                w={{ base: '64px', lg: '96px' }}
                h={{ base: '64px', lg: '96px' }}
                borderRadius="full"
                borderWidth="2px"
                borderColor="gray.600"
              />
            </Box>
          )}
          <Box>
            <Text fontSize={{ base: 'xs', lg: 'sm' }} color="gray.400" mb={1}>
              Display Name
            </Text>
            <Text fontSize={{ base: 'sm', lg: 'md' }} color="white" fontWeight="600">
              {auth.currentUser.displayName || 'Not set'}
            </Text>
          </Box>
          <Box>
            <Text fontSize={{ base: 'xs', lg: 'sm' }} color="gray.400" mb={1}>
              Email
            </Text>
            <Text fontSize={{ base: 'sm', lg: 'md' }} color="white" fontWeight="600">
              {auth.currentUser.email}
            </Text>
          </Box>
        </VStack>
      ) : (
        <Box>
          <Text fontSize={{ base: 'sm', lg: 'md' }} color="gray.400">
            You are not signed in to your Google account.
          </Text>
          <Text fontSize={{ base: 'xs', lg: 'sm' }} color="gray.500" mt={2}>
            Sign in from the Current Room section to view your profile.
          </Text>
        </Box>
      )}
    </VStack>
  );
};

