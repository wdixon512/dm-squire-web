import { Box } from '@chakra-ui/react';
import { motion } from 'framer-motion';

export const fadeVariant = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.2 },
};

export const slideVariant = {
  initial: { opacity: 0, x: -32 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -32 },
  transition: { duration: 0.2 },
};

export const MotionBox = motion(Box);
