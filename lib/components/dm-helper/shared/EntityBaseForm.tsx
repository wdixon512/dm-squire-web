'use client';

import { Box, Button, FormControl, FormLabel, Input } from '@chakra-ui/react';
import React, { useState, FormEvent } from 'react';

interface EntityBaseFormProps {
  label: string;
  placeholder: string;
  addEntity: (name: string) => boolean;
  clearEntities: () => void;
  addButtonTestId?: string;
  inputTestId?: string;
}

export const EntityBaseForm: React.FC<EntityBaseFormProps> = ({
  label,
  placeholder,
  addEntity,
  clearEntities,
  addButtonTestId,
  inputTestId,
}) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (addEntity(name)) {
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
      <FormControl mb={4}>
        <FormLabel color="white">{label}</FormLabel>
        <Input
          type="text"
          value={name}
          textFillColor="whiteAlpha.800"
          onChange={(e) => setName(e.target.value)}
          placeholder={placeholder}
          required
          data-testid={inputTestId}
        />
      </FormControl>

      <Button type="submit" variant="solid" width="full" data-testid={addButtonTestId}>
        Add {label}
      </Button>

      <Button variant="redLink" width="full" onClick={clearEntities} mt="4">
        Clear All
      </Button>
    </Box>
  );
};
