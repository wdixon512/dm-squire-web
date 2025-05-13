'use client';
import React, { useContext } from 'react';
import { BackgroundImageContext } from '../contexts/BackgroundImageContext';
import { Box, Button, useDisclosure } from '@chakra-ui/react';
import { FaImage } from 'react-icons/fa';
import BackgroundSelectorModal from './BackgroundSelectorModal';

export default function BackgroundSelector() {
  const { setBackgroundImageUrl } = useContext(BackgroundImageContext);
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Box p="4">
        <Button display="inline-flex" gap="2" onClick={onOpen}>
          <FaImage />
          Choose
        </Button>
      </Box>
      <BackgroundSelectorModal isOpen={isOpen} onClose={onClose} />
    </>
  );
}
