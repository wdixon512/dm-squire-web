'use client';

import { Box, Flex, IconButton, useDisclosure, VStack, Link } from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import { PRIMARY_NAV_ITEMS } from '@data/primary-nav-data';

const HamburgerMenu = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Flex justifyContent={'end'} direction="column" display={{ base: 'flex', md: 'none' }}>
      <IconButton
        size="md"
        icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
        aria-label="Open Menu"
        display={{ md: 'none' }}
        onClick={isOpen ? onClose : onOpen}
      />

      <Box
        display={{ base: isOpen ? 'flex' : 'none', md: 'none' }}
        flexBasis={{ base: '100%', md: 'auto' }}
        bgColor="primary.500"
        position="absolute"
        w="100vw"
        top="100%"
        left="0"
        py="8"
        zIndex="1000"
        borderRadius="4"
      >
        <VStack
          spacing={8}
          align="center"
          justify={['center', 'space-between', 'flex-end', 'flex-end']}
          direction={['column', 'row', 'row', 'row']}
          px="4"
          w="100%"
        >
          {PRIMARY_NAV_ITEMS.map((item, index) => (
            <Box key={index} p="4" bgColor="secondary.500" w="100%" borderRadius={'4'}>
              <Link href={item.href} fontFamily="Pixel">
                {item.label}
              </Link>
            </Box>
          ))}
        </VStack>
      </Box>
    </Flex>
  );
};

export default HamburgerMenu;
