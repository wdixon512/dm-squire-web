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
      pb="20"
      minHeight="100vh"
      bgImage={backgroundImageUrl || '/static/images/backgrounds/demon-in-hell.jpg'}
      bgSize="cover"
    >
      {props.children}
    </Container>
  );
};

export default AppWrapper;
