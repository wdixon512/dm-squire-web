'use client';
import { Button, Flex, Stack, Link } from '@chakra-ui/react';
import { PRIMARY_NAV_ITEMS } from '@data/primary-nav-data';
import HamburgerMenu from './HamburgerMenu';

type NavigationBarProps = {};

export const NavigationBar = (props: NavigationBarProps) => {
  const handleContactClick = () => {
    alert('Contact form coming soon!');
  };
  return (
    <>
      <Flex
        w="full"
        maxH="24"
        bg="secondary.500"
        px="6"
        py="4"
        gap="12"
        alignItems="center"
        justifyContent={'space-between'}
        position="relative"
      >
        {/* <Circle flex="1" overflow="hidden" maxW="16" maxH="16" position="relative">
          <Link href="/home">
            <Image
              src="/static/images/agios-nikolaos.jpg"
              alt="My Fiance and I in Agios Nikolaos, Crete"
              width="128"
              height="234"
              style={{ objectFit: 'cover' }}
            />
          </Link>
        </Circle> */}

        <Stack
          display={{ base: 'none', md: 'flex' }}
          direction="row"
          flex="1"
          align="center"
          aria-label="primary-nav"
          gap="12"
        >
          {PRIMARY_NAV_ITEMS.map((item, index) => (
            <Link key={index} href={item.href} fontFamily="Pixel">
              {item.label}
            </Link>
          ))}
        </Stack>
        <Flex display={{ base: 'none', md: 'flex' }}>
          <Flex w="full" justify="flex-end" flex="1" gap="6" align="center">
            <Button bg="marioRed.500" color="white" fontFamily="Pixel" onClick={handleContactClick}>
              Report
            </Button>
          </Flex>
        </Flex>
        <HamburgerMenu />
      </Flex>
    </>
  );
};

export default NavigationBar;
