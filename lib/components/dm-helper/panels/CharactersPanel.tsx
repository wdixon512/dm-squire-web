import { Tabs, TabList, TabPanels, Flex, Box, TabProps, Tab } from '@chakra-ui/react';
import React, { useState } from 'react';
import AllyForm from '../AllyForm';
import { AllyList } from '../AllyList';
import { HeroForm } from '../HeroForm';
import { HeroList } from '../HeroList';
import MobForm from '../MobForm';
import { MobList } from '../MobList';
import { MobQuickAdd } from '../MobQuickAdd';
import DMHelperTabPanel from './DMHelperTabPanel';
import { slideVariant, MotionBox } from '../shared/MotionBox';

export default function CharactersPanel() {
  const [tabIndex, setTabIndex] = useState(0);

  return (
    <Tabs
      index={tabIndex}
      onChange={setTabIndex}
      variant="enclosed-colored"
      colorScheme="primary"
      display="grid"
      height="100%"
      gridTemplateRows="10% 90%"
      overflowY="hidden"
    >
      <TabList mb="4">
        <CharacterSheetTab
          _selected={{
            color: 'marioRed.200',
            borderColor: 'marioRed.200',
          }}
        >
          Enemies
        </CharacterSheetTab>
        <CharacterSheetTab
          _selected={{
            color: 'interactive.200',
            borderColor: 'interactive.200',
          }}
        >
          Heroes
        </CharacterSheetTab>
        <CharacterSheetTab
          _selected={{
            color: 'yellow.200',
            borderColor: 'yellow.200',
          }}
        >
          Allies
        </CharacterSheetTab>
      </TabList>
      <TabPanels h="100%">
        <DMHelperTabPanel index={tabIndex} current={0}>
          <MotionBox h="100%" {...slideVariant}>
            <Flex gap="4" w="100%" h="100%">
              <Box flex=".5" gap="2" display="flex" flexDirection="column">
                <MobForm />
                <MobQuickAdd />
              </Box>
              <MobList />
            </Flex>
          </MotionBox>
        </DMHelperTabPanel>
        <DMHelperTabPanel index={tabIndex} current={1}>
          <MotionBox h="100%" {...slideVariant}>
            <Flex gap="4" w="100%">
              <HeroForm />
              <HeroList />
            </Flex>
          </MotionBox>
        </DMHelperTabPanel>
        <DMHelperTabPanel index={tabIndex} current={2}>
          <MotionBox h="100%" {...slideVariant}>
            <Flex gap="4" w="100%">
              <AllyForm />
              <AllyList />
            </Flex>
          </MotionBox>
        </DMHelperTabPanel>
      </TabPanels>
    </Tabs>
  );
}

function CharacterSheetTab(props: TabProps) {
  const { children, ...rest } = props;
  return (
    <Tab bgColor="blackAlpha.900" color="white" opacity=".95" borderWidth="2px" py="2" h="fit-content" {...rest}>
      {children}
    </Tab>
  );
}
