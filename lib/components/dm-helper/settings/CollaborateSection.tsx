'use client';

import { useContext } from 'react';
import { DMHelperContext } from '../../contexts/DMHelperContext';
import { Box, Flex, Heading, Text, VStack, Divider } from '@chakra-ui/react';
import { FaUsers } from 'react-icons/fa';
import { AdminManagement } from '../AdminManagement';
import { isRoomOwner } from '@lib/util/room-permissions';

export const CollaborateSection: React.FC = () => {
  const { room } = useContext(DMHelperContext);
  const isOwner = isRoomOwner(room);

  return (
    <VStack spacing={4} align="stretch">
      <Flex alignItems="center" gap={2}>
        <FaUsers color="white" />
        <Heading as="h3" fontSize={{ base: 'md', lg: 'lg' }} color="white">
          Collaborate
        </Heading>
      </Flex>
      <Divider borderColor="gray.600" />

      {isOwner ? (
        <AdminManagement />
      ) : (
        <Box>
          <Text fontSize={{ base: 'sm', lg: 'md' }} color="gray.400">
            Only room owners can manage admin access.
          </Text>
          <Text fontSize={{ base: 'xs', lg: 'sm' }} color="gray.500" mt={2}>
            If you own this room, make sure you're signed in with the account that created it.
          </Text>
        </Box>
      )}
    </VStack>
  );
};

