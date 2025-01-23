'use client';

import { auth } from '@lib/services/firebase';
import { Box, BoxProps, Flex, Heading, Image, Text } from '@chakra-ui/react';

interface UserInfoProps extends BoxProps {}

export const UserInfo: React.FC<UserInfoProps> = ({ ...props }) => {
  return (
    <Box {...props}>
      <Heading as="h3" color="white">
        User Info
      </Heading>
      <hr />
      {auth.currentUser ? (
        <Flex gap="4" mt="4">
          {auth.currentUser.photoURL && <Image src={auth.currentUser.photoURL} />}
          <Flex direction="column">
            <Text color="white">
              <b>User Name:</b> {auth.currentUser.displayName}
            </Text>
            <Text color="white">
              <b>Email: </b>
              {auth.currentUser.email}
            </Text>
          </Flex>
        </Flex>
      ) : (
        <>
          <Text>You are not signed in to your Google account.</Text>
        </>
      )}
    </Box>
  );
};

export default UserInfo;
