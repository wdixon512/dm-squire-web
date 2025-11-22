'use client';

import { Container, ContainerProps } from '@chakra-ui/react';
import { useContext } from 'react';
import { BackgroundImageContext } from '../contexts/BackgroundImageContext';

export const AppWrapper = (props: ContainerProps) => {
  const { backgroundImageUrl } = useContext(BackgroundImageContext);
  return (
    <Container
      width="100vw"
      maxW="100vw"
      px="0"
      mx="0"
      height={{ base: 'auto', lg: '100vh' }}
      minH={{ base: '100vh', lg: '100vh' }}
      overflow={{ base: 'visible', lg: 'hidden' }}
      bgImage={backgroundImageUrl || '/static/images/backgrounds/demon-in-hell.jpg'}
      bgSize="cover"
      display="flex"
      flexDirection="column"
    >
      {props.children}
    </Container>
  );
};

export default AppWrapper;
