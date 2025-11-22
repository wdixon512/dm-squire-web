'use client';
import React from 'react';
import { Text, Box, Button, useDisclosure, Flex, Tooltip, Icon } from '@chakra-ui/react';
import { FaImage } from 'react-icons/fa';
import BackgroundSelectorModal from './BackgroundSelectorModal';

export default function BackgroundSelector() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Box pb={{ base: 2, lg: 4 }} position="relative" zIndex={10}>
        <Tooltip label="Select a background image" placement="right" hasArrow>
          <Button
            gap="2"
            onClick={onOpen}
            bgColor="blackAlpha.900"
            border="1px solid"
            borderColor="gray.600"
            size={{ base: 'sm', lg: 'md' }}
          >
            <Icon as={FaImage} fontSize={{ base: '14px', lg: '18px' }} />
            <Text fontSize={{ base: 'sm', lg: 'md' }} fontWeight="bold">
              Background
            </Text>
          </Button>
        </Tooltip>
      </Box>
      <BackgroundSelectorModal isOpen={isOpen} onClose={onClose} />
    </>
  );
}
