import { TabPanels } from '@chakra-ui/react';
import React from 'react';
import { InviteOthersForm } from './InviteOthersForm';
import UserRoomSettingsComponent from './UserRoomSettingsComponent';
import CombatPanel from './panels/CombatPanel';
import DMHelperTabPanel from './panels/DMHelperTabPanel';
import CharactersPanel from './panels/CharactersPanel';
import { fadeVariant, MotionBox } from './shared/MotionBox';

export default function DMHelperTabPanels(props: { readOnlyRoom: boolean; combatStarted: boolean; tabIndex: number }) {
  const { readOnlyRoom, combatStarted, tabIndex } = props;

  return (
    <TabPanels flex="1" minH="0" overflow={{ base: 'visible', lg: 'hidden' }}>
      <DMHelperTabPanel current={0} index={tabIndex} display="flex" justifyContent="center" key={1} h={{ base: 'auto', lg: '100%' }}>
        <MotionBox {...fadeVariant} flex="1" h={{ base: 'auto', lg: '100%' }} minH="0" overflow={{ base: 'visible', lg: 'hidden' }}>
          <CombatPanel readOnlyRoom={readOnlyRoom} combatStarted={combatStarted} />
        </MotionBox>
      </DMHelperTabPanel>

      {!readOnlyRoom && (
        <DMHelperTabPanel current={1} index={tabIndex} h={{ base: 'auto', lg: '100%' }}>
          <MotionBox {...fadeVariant} flex="1" h={{ base: 'auto', lg: '100%' }} minH="0" overflow={{ base: 'visible', lg: 'hidden' }}>
            <CharactersPanel />
          </MotionBox>
        </DMHelperTabPanel>
      )}

      {/* Invite Others Tab Panel */}
      {!readOnlyRoom && (
        <DMHelperTabPanel current={2} index={tabIndex} h={{ base: 'auto', lg: '100%' }}>
          <MotionBox {...fadeVariant} flex="1" h={{ base: 'auto', lg: '100%' }} display="flex" justifyContent="center" alignItems="flex-start" w="100%" px={{ base: 2, lg: 0 }} minH="0" overflow={{ base: 'visible', lg: 'hidden' }}>
            <InviteOthersForm />
          </MotionBox>
        </DMHelperTabPanel>
      )}

      {/* Settings Tab Panel */}
      <DMHelperTabPanel current={readOnlyRoom ? 1 : 3} index={tabIndex} h={{ base: 'auto', lg: '100%' }}>
        <MotionBox {...fadeVariant} flex="1" h={{ base: 'auto', lg: '100%' }} display="flex" justifyContent="center" alignItems="flex-start" w="100%" px={{ base: 2, lg: 0 }} minH="0" overflow={{ base: 'visible', lg: 'hidden' }}>
          <UserRoomSettingsComponent />
        </MotionBox>
      </DMHelperTabPanel>
    </TabPanels>
  );
}
