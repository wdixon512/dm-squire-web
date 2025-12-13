'use client';

import { useContext, useState } from 'react';
import { DMHelperContext } from '@lib/components/contexts/DMHelperContext';
import {
  Box,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Button,
  Badge,
  Tooltip,
  Collapse,
  IconButton,
  Flex,
} from '@chakra-ui/react';
import { FaDoorOpen, FaChevronDown, FaChevronUp, FaTimes } from 'react-icons/fa';
import { isRoomOwner } from '@lib/util/room-permissions';

/**
 * Component that displays an indicator when the user is in someone else's room
 */
export const RoomIndicator: React.FC = () => {
  const { room, joinedRoomId, leaveRoom } = useContext(DMHelperContext);
  const [isExpanded, setIsExpanded] = useState(true);
  const [isClosed, setIsClosed] = useState(false);

  const isInAnotherPersonsRoom = joinedRoomId !== null && !isRoomOwner(room);

  if (!isInAnotherPersonsRoom || isClosed) {
    return null;
  }

  return (
    <Alert
      status="info"
      variant="subtle"
      bg="blue.900"
      color="white"
      borderRadius="md"
      mb={4}
      borderWidth="1px"
      borderColor="blue.600"
      flexDirection="column"
      alignItems="stretch"
    >
      <Flex alignItems="center" w="100%">
        <AlertIcon color="blue.300" />
        <Box flex="1">
          <AlertTitle fontSize={{ base: 'sm', lg: 'md' }}>You are viewing someone else's room</AlertTitle>
        </Box>
        <Flex gap={2} alignItems="center">
          <Button
            size={{ base: 'xs', lg: 'sm' }}
            colorScheme="blue"
            variant="outline"
            onClick={leaveRoom}
            borderColor="blue.400"
            color="white"
            _hover={{ bg: 'blue.800', borderColor: 'blue.300' }}
          >
            Leave Room
          </Button>
          <IconButton
            aria-label={isExpanded ? 'Collapse banner' : 'Expand banner'}
            icon={isExpanded ? <FaChevronUp /> : <FaChevronDown />}
            size={{ base: 'xs', lg: 'sm' }}
            variant="ghost"
            color="white"
            _hover={{ bg: 'blue.800' }}
            onClick={() => setIsExpanded(!isExpanded)}
          />
          <IconButton
            aria-label="Close banner"
            icon={<FaTimes />}
            size={{ base: 'xs', lg: 'sm' }}
            variant="ghost"
            color="white"
            _hover={{ bg: 'blue.800' }}
            onClick={() => setIsClosed(true)}
          />
        </Flex>
      </Flex>
      <Collapse in={isExpanded} animateOpacity>
        <Box mt={2} pl={6}>
          <AlertDescription fontSize={{ base: 'xs', lg: 'sm' }}>
            You are currently viewing a room that belongs to another user. Some features may be limited.
          </AlertDescription>
        </Box>
      </Collapse>
    </Alert>
  );
};

/**
 * Badge component for the Settings tab to indicate when in another person's room
 */
export const RoomIndicatorBadge: React.FC = () => {
  const { room, joinedRoomId } = useContext(DMHelperContext);

  const isInAnotherPersonsRoom = joinedRoomId !== null && !isRoomOwner(room);

  if (!isInAnotherPersonsRoom) {
    return null;
  }

  return (
    <Badge colorScheme="blue" ml={2} fontSize={{ base: 'xx-small', lg: 'xs' }} px={1.5} py={0.5} borderRadius="md">
      Guest
    </Badge>
  );
};

/**
 * Corner indicator that appears in the top-right corner when viewing someone else's room
 */
export const RoomCornerIndicator: React.FC = () => {
  const { room, joinedRoomId } = useContext(DMHelperContext);

  const isInAnotherPersonsRoom = joinedRoomId !== null && !isRoomOwner(room);

  if (!isInAnotherPersonsRoom) {
    return null;
  }

  return (
    <Tooltip label="You are viewing someone else's room" placement="left" hasArrow>
      <Box
        position="fixed"
        top={{ base: 2, lg: 4 }}
        right={{ base: 2, lg: 4 }}
        zIndex={1000}
        bg="blue.600"
        color="white"
        px={3}
        py={2}
        borderRadius="md"
        boxShadow="lg"
        borderWidth="2px"
        borderColor="blue.400"
        display="flex"
        alignItems="center"
        gap={2}
        fontSize={{ base: 'xs', lg: 'sm' }}
        fontWeight="bold"
        _hover={{ bg: 'blue.700', cursor: 'pointer' }}
      >
        <FaDoorOpen />
        <Box as="span" display={{ base: 'none', md: 'block' }}>
          Guest Room
        </Box>
      </Box>
    </Tooltip>
  );
};
