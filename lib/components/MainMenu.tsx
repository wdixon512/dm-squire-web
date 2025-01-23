'use client';

import { ChakraProps, Flex, Heading, Text } from '@chakra-ui/react';

export type MainMenuProps = ChakraProps;

export const MainMenu = (props: MainMenuProps) => {
  return (
    <Flex
      className="typewriter"
      direction="column"
      bgImage="/static/images/Mario.gif"
      justify="start"
      align="center"
      textAlign="center"
      height={'100vh'}
      pt="12"
      bgSize="contain"
    >
      <Flex direction="column" w="fit-content">
        <Heading as="h1" color="white" fontFamily="Pixel">
          Welcome
        </Heading>
        <Text pt="4" color="white" fontFamily="Pixel">
          Press any button to continue...
        </Text>
      </Flex>
    </Flex>
  );
};
