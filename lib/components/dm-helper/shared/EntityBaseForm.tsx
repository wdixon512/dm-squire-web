'use client';

import React from 'react';
import { Box, Button, FormControl, FormLabel, Input, Flex, VStack } from '@chakra-ui/react';

export interface EntityBaseFormProps {
  children: React.ReactNode;
  onSubmit?: () => void;
  label?: string;
  placeholder?: string;
  addEntity?: (name: string) => boolean;
  clearEntities?: () => void;
  addButtonTestId?: string;
  inputTestId?: string;
  showClearButton?: boolean;
}

export const EntityBaseForm: React.FC<EntityBaseFormProps> = ({
  children,
  onSubmit,
  label,
  placeholder,
  addEntity,
  clearEntities,
  addButtonTestId,
  inputTestId,
  showClearButton = true,
}) => {
  const [name, setName] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit();
    }
    if (addEntity) {
      addEntity(name);
      setName('');
    }
  };

  return (
    <Box
      as="form"
      p={4}
      bg="blackAlpha.900"
      opacity=".95"
      borderWidth={1}
      borderRadius="md"
      shadow="md"
      h="fit-content"
      onSubmit={handleSubmit}
    >
      <VStack spacing={4} align="stretch">
        {children}
        <Button type="submit" colorScheme="blue" data-testid={addButtonTestId}>
          Add {label}
        </Button>
        {showClearButton && clearEntities && (
          <Button onClick={clearEntities} colorScheme="red">
            Clear All
          </Button>
        )}
      </VStack>
    </Box>
  );
};
