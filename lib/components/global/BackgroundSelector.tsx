'use client';
import React from 'react';
import { Text, Box, Button, useDisclosure, Flex, Tooltip, Icon } from '@chakra-ui/react';
import { FaImage } from 'react-icons/fa';
import BackgroundSelectorModal from './BackgroundSelectorModal';

export default function BackgroundSelector() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Box p={{ base: 2, lg: 4 }} position={{ base: "relative", lg: "absolute" }} top={{ base: 0, lg: 4 }} left={{ base: 0, lg: 4 }} zIndex={10}>
        <Tooltip label="Select a background image" placement="right" hasArrow>
          <Button gap="2" onClick={onOpen} bgColor="blackAlpha.900" border="1px solid gold" size={{ base: "sm", lg: "md" }}>
            <Flex alignContent="center" flexDir="column" w="full">
              <Text color="marioRed.100" fontSize={{ base: "10px", lg: "12px" }} fontWeight="bold">
                New!
              </Text>
              <Flex justifyContent={'center'}>
                <Icon as={FaImage} fontSize={{ base: "12px", lg: "16px" }} />
              </Flex>
            </Flex>
          </Button>
        </Tooltip>
      </Box>
      <BackgroundSelectorModal isOpen={isOpen} onClose={onClose} />
    </>
  );
}
