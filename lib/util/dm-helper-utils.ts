import { ToastId, UseToastOptions } from '@chakra-ui/react';
import { Entity } from '@lib/models/dm-helper/Entity';
import { v4 as uuidv4 } from 'uuid';

// Generates a unique room code using UUID
export function generateRoomCode(): string {
  return uuidv4();
}

export const getNextEntityNumber = (entities: Entity[], name: string) => {
  let number = 1;
  if (entities.some((m) => m.name === name)) {
    number = Math.max(...entities.filter((m) => m.name === name).map((m) => m.number ?? 0)) + 1;
  }
  return number;
};

// Validation functions
export const validateName = (name: string, toast: (options: UseToastOptions) => ToastId | undefined): boolean => {
  if (name.trim() === '') {
    toast({
      title: 'Error',
      description: 'Name cannot be empty.',
      status: 'error',
      duration: 3000,
      isClosable: true,
    });
    return false;
  }
  return true;
};

export const validateMobHealth = (
  health: number | undefined | null,
  toast: (options: UseToastOptions) => ToastId | undefined
): boolean => {
  if (health && health <= 0) {
    toast({
      title: 'Error',
      description: 'Health must be a positive number.',
      status: 'error',
      duration: 3000,
      isClosable: true,
    });
    return false;
  }
  return true;
};

export const validateInitiative = (initiative: string | undefined) => {
  if (!initiative || initiative?.trim() === '') {
    return false;
  }

  const initNum = parseInt(initiative, 10);

  if (isNaN(initNum)) {
    return false;
  }

  return true;
};
