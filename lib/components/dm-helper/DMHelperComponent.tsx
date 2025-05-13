'use client';

import { Tabs } from '@chakra-ui/react';
import { DMHelperContext } from '@lib/components/contexts/DMHelperContext';
import { useContext } from 'react';
import DMHelperTabList from './DMHelperTabList';
import DMHelperTabPanels from './DMHelperTabPanels';

export const DMHelperComponent = () => {
  const { combatStarted, readOnlyRoom } = useContext(DMHelperContext);

  return (
    <>
      <Tabs display="flex" flexDir="column" alignContent={'center'}>
        <DMHelperTabList readOnlyRoom={readOnlyRoom} />
        <DMHelperTabPanels readOnlyRoom={readOnlyRoom} combatStarted={combatStarted} />
      </Tabs>
    </>
  );
};
