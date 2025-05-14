'use client';

import { Tabs } from '@chakra-ui/react';
import { DMHelperContext } from '@lib/components/contexts/DMHelperContext';
import { useContext, useState } from 'react';
import DMHelperTabList from './DMHelperTabList';
import DMHelperTabPanels from './DMHelperTabPanels';

export const DMHelperComponent = () => {
  const { combatStarted, readOnlyRoom } = useContext(DMHelperContext);
  const [tabIndex, setTabIndex] = useState(0);

  return (
    <>
      <Tabs
        display="grid"
        gridTemplateRows="10% 90%"
        alignContent={'center'}
        height="100%"
        overflowY={'hidden'}
        w="100%"
        index={tabIndex}
        onChange={setTabIndex}
      >
        <DMHelperTabList readOnlyRoom={readOnlyRoom} />
        <DMHelperTabPanels readOnlyRoom={readOnlyRoom} combatStarted={combatStarted} tabIndex={tabIndex} />
      </Tabs>
    </>
  );
};
