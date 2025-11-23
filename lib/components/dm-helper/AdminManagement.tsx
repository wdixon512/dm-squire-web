'use client';

import { useContext, useState } from 'react';
import { DMHelperContext } from '../contexts/DMHelperContext';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Text,
  VStack,
  HStack,
  IconButton,
  useToast,
  Divider,
} from '@chakra-ui/react';
import { FaTrash, FaUserShield } from 'react-icons/fa';
import { isRoomOwner } from '@lib/util/room-permissions';
import { auth } from '@services/firebase';

export const AdminManagement: React.FC = () => {
  const { room, addAdminEmail, removeAdminEmail } = useContext(DMHelperContext);
  const [emailInput, setEmailInput] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const toast = useToast();

  const isOwner = isRoomOwner(room);
  const adminEmails = room?.adminEmails || [];

  // Only show to room owners
  if (!isOwner) {
    return null;
  }

  const handleAddAdmin = async () => {
    const email = emailInput.trim();
    if (!email) {
      toast({
        title: 'Email required',
        description: 'Please enter an email address',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: 'Invalid email',
        description: 'Please enter a valid email address',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsAdding(true);
    try {
      await addAdminEmail(email);
      setEmailInput('');
    } catch (error) {
      // Error toast is handled in the context
    } finally {
      setIsAdding(false);
    }
  };

  const handleRemoveAdmin = async (email: string) => {
    try {
      await removeAdminEmail(email);
    } catch (error) {
      // Error toast is handled in the context
    }
  };

  return (
    <Box w="100%" mt={4}>
      <Flex alignItems="center" gap={2} mb={4}>
        <FaUserShield color="white" />
        <Text fontSize={{ base: 'md', lg: 'lg' }} fontWeight="bold" color="white">
          Room Admins
        </Text>
      </Flex>
      <Text fontSize={{ base: 'xs', lg: 'sm' }} color="gray.400" mb={4}>
        Grant admin access to other users. Admins can manage all entities in this room when signed in with a matching email.
      </Text>

      <VStack spacing={4} align="stretch">
        {/* Add Admin Form */}
        <FormControl>
          <FormLabel color="white" fontSize={{ base: 'sm', lg: 'md' }}>
            Add Admin Email
          </FormLabel>
          <HStack>
            <Input
              type="email"
              placeholder="admin@example.com"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !isAdding) {
                  handleAddAdmin();
                }
              }}
              color="white"
              bg="blackAlpha.700"
              borderColor="gray.600"
              _hover={{ borderColor: 'gray.500' }}
              _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px blue.500' }}
              size={{ base: 'sm', lg: 'md' }}
              data-testid="admin-email-input"
            />
            <Button
              onClick={handleAddAdmin}
              isLoading={isAdding}
              colorScheme="blue"
              size={{ base: 'sm', lg: 'md' }}
              data-testid="add-admin-button"
            >
              Add
            </Button>
          </HStack>
        </FormControl>

        {/* Admin List */}
        {adminEmails.length > 0 && (
          <>
            <Divider borderColor="gray.600" />
            <VStack spacing={2} align="stretch">
              <Text fontSize={{ base: 'sm', lg: 'md' }} fontWeight="600" color="white">
                Current Admins ({adminEmails.length})
              </Text>
              {adminEmails.map((email, index) => (
                <Flex
                  key={index}
                  alignItems="center"
                  justifyContent="space-between"
                  p={2}
                  bg="blackAlpha.700"
                  borderRadius="md"
                  borderWidth="1px"
                  borderColor="gray.600"
                >
                  <Text fontSize={{ base: 'xs', lg: 'sm' }} color="white" isTruncated flex="1" mr={2}>
                    {email}
                  </Text>
                  <IconButton
                    icon={<FaTrash />}
                    aria-label={`Remove ${email} as admin`}
                    onClick={() => handleRemoveAdmin(email)}
                    size="sm"
                    colorScheme="red"
                    variant="ghost"
                    data-testid={`remove-admin-${index}`}
                  />
                </Flex>
              ))}
            </VStack>
          </>
        )}

        {adminEmails.length === 0 && (
          <Text fontSize={{ base: 'xs', lg: 'sm' }} color="gray.500" fontStyle="italic">
            No admins added yet. Add an email above to grant admin access.
          </Text>
        )}
      </VStack>
    </Box>
  );
};

