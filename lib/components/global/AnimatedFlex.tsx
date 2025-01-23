'use client';

import { Flex, FlexProps } from '@chakra-ui/react';
import { motion } from 'framer-motion';

export const AnimatedFlex = (props: FlexProps) => {
  return (
    <Flex
      as={motion.div}
      initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
      animate={{ opacity: 1, height: '100%' }}
      exit={{ opacity: 0, height: 0 }}
      transition="0.5s linear"
      {...props}
    >
      {props.children}
    </Flex>
  );
};

export default AnimatedFlex;
