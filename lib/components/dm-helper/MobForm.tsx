'use client';

import React, { useState } from 'react';
import { FormControl, FormLabel, Input, Flex } from '@chakra-ui/react';
import { DMHelperContext } from '../contexts/DMHelperContext';
import { EntityBaseForm } from './shared/EntityBaseForm';
import { MobTypeaheadFormControl } from './shared/MobTypeaheadFormControl';
import { DetailedMob } from '@lib/models/dnd5eapi/DetailedMob';
import { DiceRoller } from './DiceRoller';
import { RollType } from '@lib/models/dm-helper/RollType';
import useDndApi from '@lib/services/dnd5eapi-service';

const MobForm: React.FC = () => {
  const { addMob } = React.useContext(DMHelperContext);
  const { rollDice, getMobHitPoints } = useDndApi();
  const [mobName, setMobName] = useState('');
  const [health, setHealth] = useState('');
  const [initiative, setInitiative] = useState('');
  const [selectedMob, setSelectedMob] = useState<DetailedMob | null>(null);

  const handleAddMob = () => {
    const parsedHealth = health ? parseInt(health, 10) : undefined;
    const parsedInitiative = initiative ? parseInt(initiative, 10) : undefined;

    if (mobName) {
      addMob(mobName, parsedHealth, parsedInitiative, !!selectedMob);
      setMobName('');
      setHealth('');
      setInitiative('');
      setSelectedMob(null);
    }
  };

  const handleMobSelect = (mob: DetailedMob) => {
    setSelectedMob(mob);
    // Auto-roll initiative and health when a mob is selected
    const initRoll = rollDice(mob, RollType.Initiative);
    const defaultHp = getMobHitPoints(mob);
    setInitiative(initRoll.toString());
    setHealth(defaultHp.toString());
  };

  return (
    <EntityBaseForm onSubmit={handleAddMob} addButtonTestId="add-mob-button">
      <MobTypeaheadFormControl
        value={mobName}
        onChange={setMobName}
        onSelect={handleMobSelect}
        selectedMob={selectedMob}
        label="Mob Name"
        placeholder="Search for a mob..."
        inputDataTestId="mob-name-input"
      />
      <FormControl>
        <FormLabel color="white">Health</FormLabel>
        <Flex gap={2}>
          <Input
            type="number"
            value={health}
            onChange={(e) => setHealth(e.target.value)}
            color="white"
            textFillColor={'whiteAlpha.800'}
            placeholder="Enter health"
            data-testid="mob-health-input"
          />
          <DiceRoller
            mob={selectedMob}
            rollType={RollType.HitPoints}
            afterRoll={(roll) => setHealth(roll.toString())}
          />
        </Flex>
      </FormControl>
      <FormControl>
        <FormLabel color="white">Initiative</FormLabel>
        <Flex gap={2}>
          <Input
            type="number"
            value={initiative}
            onChange={(e) => setInitiative(e.target.value)}
            color="white"
            textFillColor={'whiteAlpha.800'}
            placeholder="Enter initiative"
            data-testid="mob-initiative-input"
          />
          <DiceRoller
            mob={selectedMob}
            rollType={RollType.Initiative}
            afterRoll={(roll) => setInitiative(roll.toString())}
          />
        </Flex>
      </FormControl>
    </EntityBaseForm>
  );
};

export default MobForm;
