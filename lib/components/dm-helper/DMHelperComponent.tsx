'use client';

import { Tabs, Box } from '@chakra-ui/react';
import { DMHelperContext } from '@lib/components/contexts/DMHelperContext';
import { useContext, useState } from 'react';
import DMHelperTabList from './DMHelperTabList';
import DMHelperTabPanels from './DMHelperTabPanels';
import { RoomIndicator } from './shared/RoomIndicator';

export const DMHelperComponent = () => {
  const { combatStarted, readOnlyRoom } = useContext(DMHelperContext);
  const [tabIndex, setTabIndex] = useState(0);

  return (
    <>
      <Tabs
        display="flex"
        flexDirection="column"
        height={{ base: 'auto', lg: '100%' }}
        minH={{ base: '100vh', lg: '100%' }}
        overflow={{ base: 'visible', lg: 'hidden' }}
        w="100%"
        index={tabIndex}
        onChange={setTabIndex}
      >
        <Box px={{ base: 2, lg: 4 }} pt={{ base: 2, lg: 4 }}>
          <RoomIndicator />
        </Box>
        <DMHelperTabList readOnlyRoom={readOnlyRoom} />
        <DMHelperTabPanels readOnlyRoom={readOnlyRoom} combatStarted={combatStarted} tabIndex={tabIndex} />
      </Tabs>
    </>
  );
};
