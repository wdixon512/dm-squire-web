'use client';

import React, { useState } from 'react';
import { FormControl, FormLabel, Input, VStack } from '@chakra-ui/react';
import { DMHelperContext } from '../contexts/DMHelperContext';
import { EntityBaseForm } from './shared/EntityBaseForm';
import { MobTypeaheadFormControl } from './shared/MobTypeaheadFormControl';
import { DetailedMob } from '@lib/models/dnd5eapi/DetailedMob';
import { sanitizeMonsterName } from '@lib/util/mobUtils';

const AllyForm: React.FC = () => {
  const { addAlly } = React.useContext(DMHelperContext);
  const [allyName, setAllyName] = useState('');
  const [allyCharacterSheetId, setAllyCharacterSheetId] = useState('');
  const [allyCharacterSheetDisplayName, setAllyCharacterSheetDisplayName] = useState('');

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
    <EntityBaseForm onFormSubmit={handleAddAlly} addButtonTestId="add-ally-button" flex="1">
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
      <MobTypeaheadFormControl
        value={allyCharacterSheetDisplayName}
        onChange={setAllyCharacterSheetDisplayName}
        onSelect={handleCharacterSheetSelect}
        selectedMob={selectedMob}
        label="Character Sheet"
        placeholder="Search the library..."
        selectedLabelText="Selected character sheet:"
        inputDataTestId="ally-character-sheet-input"
      />
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
    </EntityBaseForm>
  );
};

export default AllyForm;
