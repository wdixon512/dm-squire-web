'use client';
import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useToast } from '@chakra-ui/react';
import { cypressIsTesting } from '@lib/util/cypress-utils';
import { auth } from '@lib/services/firebase';

interface FirebaseGoogleAuthContextProps {
  signInWithGoogle: () => Promise<void>;
  signOutOfGoogle: () => Promise<void>;
}

const FirebaseGoogleAuthContext = createContext<FirebaseGoogleAuthContextProps | undefined>(undefined);

export const FirebaseGoogleAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const toast = useToast();

  useEffect(() => {
    const signedOut = window.localStorage.getItem('signedOut');

    if (signedOut && signedOut === 'true') {
      window.localStorage.removeItem('signedOut');
      toast({
        title: 'Signed Out',
        description: 'You have successfully signed out.',
        status: 'success',
      });
    }
  }, []);
  const signInWithGoogle = async (): Promise<void> => {
    if (cypressIsTesting()) {
      console.log('Cypress is testing, skipping sign in with Google, but will delay for 1 second.');
      return await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    if (!auth.currentUser) {
      const provider = new GoogleAuthProvider();
      try {
        await signInWithPopup(auth, provider);

        toast({
          title: 'Sign-in Successful',
          description: 'You have successfully signed in.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      } catch (e) {
        const error = e as Error;
        toast({
          title: 'Sign-in Error',
          description: error.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } else {
      toast({
        title: 'Sign-in Error',
        description: 'You are already signed in.',
        status: 'info',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const signOutOfGoogle = async (): Promise<void> => {
    if (auth.currentUser) {
      try {
        await auth.signOut();

        // save a local storage variable that the user has signed out
        window.localStorage.setItem('signedOut', 'true');
        window.location.reload();
      } catch (e) {
        const error = e as Error;
        toast({
          title: 'Sign-out Error',
          description: error.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };

  return (
    <FirebaseGoogleAuthContext.Provider value={{ signInWithGoogle, signOutOfGoogle }}>
      {children}
    </FirebaseGoogleAuthContext.Provider>
  );
};

// Custom hook for easy access to the context
export const useFirebaseGoogleAuth = (): FirebaseGoogleAuthContextProps => {
  const context = useContext(FirebaseGoogleAuthContext);
  if (!context) {
    throw new Error('useGoogleAuth must be used within a GoogleAuthProviderWrapper');
  }
  return context;
};
