import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, Grid, GridItem, Box, Img } from '@chakra-ui/react';
import React, { useContext } from 'react';
import { BackgroundImageContext } from '../contexts/BackgroundImageContext';

interface BackgroundSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BackgroundSelectorModal({ isOpen, onClose }: BackgroundSelectorModalProps) {
  const backgroundImageFileNames = [
    // list all the image URLs from the public/static/images/backgrounds directory
    'demon-in-hell.jpg',
    'flume-knight.webp',
    'knight-with-flaming-sword.jpg',
    'medieval-fantasy.jpg',
    'swamp-knight.jpg',
    'swamp-knight-2.jpg',
    'dark-fantasy-bb.jpg',
  ];

  const { setBackgroundImageUrl, backgroundImageUrl } = useContext(BackgroundImageContext);
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl" isCentered>
      <ModalOverlay />
      <ModalContent
        overflowY="hidden"
        height="fit-content"
        maxH={{ base: '100%', md: '90%' }}
        py="8"
        bgColor="primary.700"
      >
        <ModalHeader color="white">Choose a background</ModalHeader>
        <ModalBody>
          <Grid templateColumns="repeat(2, 1fr)" gap={4}>
            {backgroundImageFileNames.map((fileName, i) => (
              <GridItem key={fileName}>
                <Box
                  cursor="pointer"
                  borderRadius="md"
                  onClick={() => {
                    setBackgroundImageUrl(`/static/images/backgrounds/${fileName}`);
                    onClose();
                  }}
                  border="2px solid"
                  borderColor={backgroundImageUrl.includes(fileName) ? 'interactive.500' : 'transparent'}
                  _hover={{
                    border: '2px solid white',
                  }}
                >
                  <Img height="150px" width="100%" objectFit={'cover'} src={`static/images/backgrounds/${fileName}`} />
                </Box>
              </GridItem>
            ))}
          </Grid>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
