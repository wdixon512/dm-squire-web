'use client';

import { auth } from '@lib/services/firebase';
import { Box, BoxProps, Flex, Heading, Image, Text } from '@chakra-ui/react';

interface UserInfoProps extends BoxProps {}

export const UserInfo: React.FC<UserInfoProps> = ({ ...props }) => {
  return (
    <Box {...props}>
      <Heading as="h3" color="white" fontSize={{ base: "md", lg: "lg" }}>
        User Info
      </Heading>
      <hr />
      {auth.currentUser ? (
        <Flex gap={{ base: 2, lg: 4 }} mt="4" direction={{ base: "column", lg: "row" }} alignItems={{ base: "flex-start", lg: "center" }}>
          {auth.currentUser.photoURL && <Image src={auth.currentUser.photoURL} w={{ base: "48px", lg: "64px" }} h={{ base: "48px", lg: "64px" }} borderRadius="full" />}
          <Flex direction="column" minW="0">
            <Text color="white" fontSize={{ base: "sm", lg: "md" }} isTruncated>
              <b>User Name:</b> {auth.currentUser.displayName}
            </Text>
            <Text color="white" fontSize={{ base: "sm", lg: "md" }} isTruncated>
              <b>Email: </b>
              {auth.currentUser.email}
            </Text>
          </Flex>
        </Flex>
      ) : (
        <>
          <Text fontSize={{ base: "sm", lg: "md" }}>You are not signed in to your Google account.</Text>
        </>
      )}
    </Box>
  );
};

export default UserInfo;
