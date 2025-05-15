'use client';
import React from 'react';
import { Text, Box, Button, useDisclosure, Flex, Tooltip } from '@chakra-ui/react';
import { FaImage } from 'react-icons/fa';
import BackgroundSelectorModal from './BackgroundSelectorModal';

export default function BackgroundSelector() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Box p="4">
        <Tooltip label="Select a background image" placement="right" hasArrow>
          <Button gap="2" onClick={onOpen} bgColor="blackAlpha.900" border="1px solid gold">
            <Flex alignContent="center" flexDir="column" w="full">
              <Text color="marioRed.100" fontSize="12px" fontWeight="bold">
                New!
              </Text>
              <Flex justifyContent={'center'}>
                <FaImage />
              </Flex>
            </Flex>
          </Button>
        </Tooltip>
      </Box>
      <BackgroundSelectorModal isOpen={isOpen} onClose={onClose} />
    </>
  );
}
