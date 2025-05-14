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
    <TabPanels maxH="100%">
      <DMHelperTabPanel current={0} index={tabIndex} display="flex" justifyContent="center" key={1}>
        <MotionBox {...fadeVariant} flex="1" h="100%">
          <CombatPanel readOnlyRoom={readOnlyRoom} combatStarted={combatStarted} />
        </MotionBox>
      </DMHelperTabPanel>

      {!readOnlyRoom && (
        <DMHelperTabPanel current={1} index={tabIndex}>
          <MotionBox {...fadeVariant} flex="1" h="100%">
            <CharactersPanel />
          </MotionBox>
        </DMHelperTabPanel>
      )}

      {/* Invite Others Tab Panel */}
      {!readOnlyRoom && (
        <DMHelperTabPanel current={2} index={tabIndex}>
          <MotionBox {...fadeVariant} flex="1">
            <InviteOthersForm />
          </MotionBox>
        </DMHelperTabPanel>
      )}

      {/* Manage Tab Panel */}
      <DMHelperTabPanel current={3} index={tabIndex}>
        <MotionBox {...fadeVariant} flex="1">
          <UserRoomSettingsComponent />
        </MotionBox>
      </DMHelperTabPanel>
    </TabPanels>
  );
}
