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
      display="flex"
      flexDirection="column"
      height={{ base: 'auto', lg: '100%' }}
      minH={{ base: 'auto', lg: '100%' }}
      overflow={{ base: 'visible', lg: 'hidden' }}
    >
      <TabList mb="4" flexShrink={0}>
        <CharacterSheetTab _selected={{ color: 'marioRed.200', borderColor: 'marioRed.200' }}>
          Enemies
        </CharacterSheetTab>
        <CharacterSheetTab _selected={{ color: 'interactive.200', borderColor: 'interactive.200' }}>
          Heroes
        </CharacterSheetTab>
        <CharacterSheetTab _selected={{ color: 'yellow.200', borderColor: 'yellow.200' }}>Allies</CharacterSheetTab>
      </TabList>
      <TabPanels flex="1" minH="0" overflow={{ base: 'visible', lg: 'hidden' }}>
        <DMHelperTabPanel index={tabIndex} current={0} h={{ base: 'auto', lg: '100%' }}>
          <MotionBox
            h={{ base: 'auto', lg: '100%' }}
            minH="0"
            overflow={{ base: 'visible', lg: 'hidden' }}
            {...slideVariant}
          >
            <Flex
              gap={{ base: 2, lg: 4 }}
              w="100%"
              h={{ base: 'auto', lg: '100%' }}
              direction={{ base: 'column', lg: 'row' }}
              px={{ base: 2, lg: 0 }}
              minH="0"
              overflow={{ base: 'visible', lg: 'hidden' }}
            >
              <Box
                flex={{ base: '1', lg: '.5' }}
                gap="2"
                display="flex"
                flexDirection="column"
                minW={{ base: '100%', lg: 'auto' }}
                flexShrink={0}
                overflowY="auto"
                sx={{
                  '&::-webkit-scrollbar': { width: '8px' },
                  '&::-webkit-scrollbar-track': { width: '8px' },
                  '&::-webkit-scrollbar-thumb': { backgroundColor: 'gray.500', borderRadius: '4px' },
                }}
              >
                <MobForm />
                <MobQuickAdd />
              </Box>
              <MobList />
            </Flex>
          </MotionBox>
        </DMHelperTabPanel>
        <DMHelperTabPanel index={tabIndex} current={1} h={{ base: 'auto', lg: '100%' }}>
          <MotionBox
            h={{ base: 'auto', lg: '100%' }}
            minH="0"
            overflow={{ base: 'visible', lg: 'hidden' }}
            {...slideVariant}
          >
            <Flex
              gap={{ base: 2, lg: 4 }}
              w="100%"
              h={{ base: 'auto', lg: '100%' }}
              direction={{ base: 'column', lg: 'row' }}
              px={{ base: 2, lg: 0 }}
              minH="0"
              overflow={{ base: 'visible', lg: 'hidden' }}
            >
              <HeroForm />
              <HeroList />
            </Flex>
          </MotionBox>
        </DMHelperTabPanel>
        <DMHelperTabPanel index={tabIndex} current={2} h={{ base: 'auto', lg: '100%' }}>
          <MotionBox
            h={{ base: 'auto', lg: '100%' }}
            minH="0"
            overflow={{ base: 'visible', lg: 'hidden' }}
            {...slideVariant}
          >
            <Flex
              gap={{ base: 2, lg: 4 }}
              w="100%"
              h={{ base: 'auto', lg: '100%' }}
              direction={{ base: 'column', lg: 'row' }}
              px={{ base: 2, lg: 0 }}
              minH="0"
              overflow={{ base: 'visible', lg: 'hidden' }}
            >
              <Box
                flex={{ base: '1', lg: '.5' }}
                gap="2"
                display="flex"
                flexDirection="column"
                minW={{ base: '100%', lg: 'auto' }}
                flexShrink={0}
                overflowY={{ base: 'visible', lg: 'auto' }}
                h={{ base: 'auto', lg: '100%' }}
                sx={{
                  '&::-webkit-scrollbar': { width: '8px' },
                  '&::-webkit-scrollbar-track': { width: '8px' },
                  '&::-webkit-scrollbar-thumb': { backgroundColor: 'gray.500', borderRadius: '4px' },
                }}
              >
                <AllyForm />
              </Box>
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
