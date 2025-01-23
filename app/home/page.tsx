import { Container } from '@chakra-ui/react';
import { DMHelperContextProvider } from '@lib/components/contexts/DMHelperContext';
import { DMHelperComponent } from '@lib/components/dm-helper/DMHelperComponent';

export default function Home() {
  return (
    <DMHelperContextProvider>
      <Container maxW={{ xl: '1200px' }} pt="12" justifyContent={'center'}>
        <DMHelperComponent />
      </Container>
    </DMHelperContextProvider>
  );
}
