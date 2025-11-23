'use client';

import React from 'react';
import { Box, BoxProps, Button, Heading, VStack } from '@chakra-ui/react';

export interface EntityBaseFormProps extends BoxProps {
  children: React.ReactNode;
  onFormSubmit?: () => void;
  label?: string;
  placeholder?: string;
  addEntity?: (name: string) => boolean;
  clearEntities?: () => void;
  addButtonTestId: string;
  inputTestId?: string;
  showClearButton?: boolean;
}

export const EntityBaseForm: React.FC<EntityBaseFormProps> = ({
  children,
  onFormSubmit,
  label,
  addEntity,
  clearEntities,
  addButtonTestId,
  showClearButton = true,
  ...boxProps
}) => {
  const [name, setName] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onFormSubmit) {
      onFormSubmit();
    }
    if (addEntity) {
      addEntity(name);
      setName('');
    }
  };

  return (
    <Box
      as="form"
      p={{ base: 2, lg: 4 }}
      bg="blackAlpha.900"
      opacity=".95"
      borderWidth={1}
      borderRadius="md"
      shadow="md"
      h="fit-content"
      onSubmit={handleSubmit}
      {...boxProps}
    >
      <VStack spacing={{ base: 2, lg: 4 }} align="stretch">
        {children}
        <Button type="submit" colorScheme="blue" size={{ base: 'sm', lg: 'md' }} data-testid={addButtonTestId}>
          Add {label}
        </Button>
        {showClearButton && clearEntities && (
          <Button onClick={clearEntities} colorScheme="red" size={{ base: 'sm', lg: 'md' }}>
            Clear All
          </Button>
        )}
      </VStack>
    </Box>
  );
};
