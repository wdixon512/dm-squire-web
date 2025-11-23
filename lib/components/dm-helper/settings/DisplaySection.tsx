'use client';

import { Box, Flex, Heading, Text, VStack, Divider } from '@chakra-ui/react';
import { FaPalette } from 'react-icons/fa';
import BackgroundSelector from '../../global/BackgroundSelector';

export const DisplaySection: React.FC = () => {
  return (
    <VStack spacing={4} align="stretch">
      <Flex alignItems="center" gap={2}>
        <FaPalette color="white" />
        <Heading as="h3" fontSize={{ base: 'md', lg: 'lg' }} color="white">
          Display
        </Heading>
      </Flex>
      <Divider borderColor="gray.600" />

      <Box>
        <Text fontSize={{ base: 'xs', lg: 'sm' }} color="gray.400" mb={3}>
          Customize the background image for your room
        </Text>
        <BackgroundSelector />
      </Box>
    </VStack>
  );
};

