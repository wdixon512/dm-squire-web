'use client';

import React, { useState } from 'react';
import { Box, FormControl, FormLabel, Heading, Input, Text, Tooltip } from '@chakra-ui/react';
import { DMHelperContext } from '../contexts/DMHelperContext';
import { EntityBaseForm } from './shared/EntityBaseForm';
import { MobTypeaheadFormControl } from './shared/MobTypeaheadFormControl';
import { DetailedMob } from '@lib/models/dnd5eapi/DetailedMob';
import { sanitizeMonsterName } from '@lib/util/mobUtils';
import { FaQuestion, FaQuestionCircle } from 'react-icons/fa';

const AllyForm: React.FC = () => {
  const { addAlly } = React.useContext(DMHelperContext);
  const [allyName, setAllyName] = useState('');
  const [allyCharacterSheetId, setAllyCharacterSheetId] = useState('');
  const [allyCharacterSheetDisplayName, setAllyCharacterSheetDisplayName] = useState('');
  const [profileUrl, setProfileUrl] = useState('');

  const [health, setHealth] = useState('');
  const [initiative, setInitiative] = useState('');
  const [selectedMob, setSelectedMob] = useState<DetailedMob | null>(null);

  const handleAddAlly = () => {
    if (allyName) {
      addAlly(
        allyName,
        health ? parseInt(health, 10) : undefined,
        initiative ? parseInt(initiative, 10) : undefined,
        allyCharacterSheetId
      );
      setAllyName('');
      setHealth('');
      setInitiative('');
      setSelectedMob(null);
    }
  };

  const handleCharacterSheetSelect = (mob: DetailedMob) => {
    setAllyCharacterSheetId(sanitizeMonsterName(mob.name));
  };

  return (
    <EntityBaseForm onFormSubmit={handleAddAlly} addButtonTestId="add-ally-button" flex=".5">
      <Heading as="h3" size="md" color="white" mb="0" borderBottom={'2px dotted'}>
        Add an{' '}
        <Box as="span" color="yellow.200">
          Ally
        </Box>
      </Heading>
      <FormControl>
        <FormLabel color="white">Ally Name</FormLabel>
        <Input
          type="text"
          value={allyName}
          onChange={(e) => setAllyName(e.target.value)}
          color="white"
          textFillColor={'whiteAlpha.800'}
          placeholder="Enter ally name"
          required
          data-testid="ally-name-input"
        />
      </FormControl>
      <FormControl>
        <FormLabel color="white">Ally Health</FormLabel>
        <Input
          type="number"
          value={health}
          onChange={(e) => setHealth(e.target.value)}
          color="white"
          textFillColor={'whiteAlpha.800'}
          placeholder="Enter health"
        />
      </FormControl>
      <MobTypeaheadFormControl
        value={allyCharacterSheetDisplayName}
        onChange={setAllyCharacterSheetDisplayName}
        onSelect={handleCharacterSheetSelect}
        selectedMob={selectedMob}
        label={
          <Text display="inline-flex" gap="2">
            Character Sheet{' '}
            <Tooltip
              label="Allies tend to have character sheets. Select one from the library for this Ally."
              hasArrow
              placement="right"
            >
              <FaQuestionCircle />
            </Tooltip>
          </Text>
        }
        placeholder="Search the library..."
        selectedLabelText="Selected character sheet:"
        inputDataTestId="ally-character-sheet-input"
      />
      <FormControl>
        <FormLabel display="inline-flex" color="white" gap="2">
          Profile URL
          <Tooltip
            label="Enter this hero's D&D Beyond profile URL. Set your character's privacy setting to `Public` to allow DMSquire more access."
            placement="top"
            hasArrow
          >
            <FaQuestionCircle />
          </Tooltip>
        </FormLabel>
        <Input
          type="text"
          value={profileUrl}
          onChange={(e) => setProfileUrl(e.target.value)}
          color="white"
          textFillColor={'whiteAlpha.800'}
          placeholder="Enter Profile URL"
          data-testid="profile-input"
        />
      </FormControl>
    </EntityBaseForm>
  );
};

export default AllyForm;
