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
      height="100vh"
      overflowX="hidden"
      bgImage={backgroundImageUrl || '/static/images/backgrounds/demon-in-hell.jpg'}
      bgSize="cover"
      display="grid"
      gridTemplateRows={'7% 93%'}
    >
      {props.children}
    </Container>
  );
};

export default AppWrapper;
