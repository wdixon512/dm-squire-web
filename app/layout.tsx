'use client';
import { ChakraProvider, Container } from '@chakra-ui/react';
import Fonts from '@lib/components/global/Fonts';
import theme from '../styles/theme';
import '@fontsource/rhodium-libre';
import '../styles/global.css';
import Head from 'next/head';
import { FirebaseGoogleAuthProvider } from '@lib/components/contexts/FirebaseGoogleAuthContext';
import { CacheProvider } from '@lib/components/contexts/CacheContext';
import { BackgroundImageContextProvider } from '@lib/components/contexts/BackgroundImageContext';

export default function MyApp({ children }) {
  return (
    <html>
      <body style={{ overflowX: 'hidden' }}>
        <ChakraProvider theme={theme}>
          <Head>
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="icon" href="/favicon.ico" sizes="any" />
          </Head>
          <Fonts />
          <CacheProvider>
            <FirebaseGoogleAuthProvider>
              <BackgroundImageContextProvider>
                <Container
                  width="100vw"
                  maxW="100vw"
                  px="0"
                  mx="0"
                  pb="20"
                  minHeight="100vh"
                  bgImage="static/images/backgrounds/demon-in-hell.jpg"
                  bgSize="cover"
                >
                  {children}
                </Container>
              </BackgroundImageContextProvider>
            </FirebaseGoogleAuthProvider>
          </CacheProvider>
        </ChakraProvider>
      </body>
    </html>
  );
}
