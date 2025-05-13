import { Container } from '@chakra-ui/react';
import { DMHelperContextProvider } from '@lib/components/contexts/DMHelperContext';
import { DMHelperComponent } from '@lib/components/dm-helper/DMHelperComponent';
import BackgroundSelector from '@lib/components/global/BackgroundSelector';

export default function Home() {
  return (
    <>
      <BackgroundSelector />
      <DMHelperContextProvider>
        <Container maxW={{ xl: '1200px' }} justifyContent={'center'}>
          <DMHelperComponent />
        </Container>
      </DMHelperContextProvider>
    </>
  );
}
