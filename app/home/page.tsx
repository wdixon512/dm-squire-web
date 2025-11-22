import { Container } from '@chakra-ui/react';
import { DMHelperContextProvider } from '@lib/components/contexts/DMHelperContext';
import { DMHelperComponent } from '@lib/components/dm-helper/DMHelperComponent';

export default function Home() {
  return (
    <>
      <DMHelperContextProvider>
        <Container
          maxW={{ base: '100%', lg: '1200px' }}
          px={{ base: 2, lg: 0 }}
          h={{ base: 'auto', lg: '100%' }}
          display="flex"
          flexDirection="column"
          flex={{ base: 'none', lg: '1' }}
          minH={{ base: '100vh', lg: '0' }}
        >
          <DMHelperComponent />
        </Container>
      </DMHelperContextProvider>
    </>
  );
}
