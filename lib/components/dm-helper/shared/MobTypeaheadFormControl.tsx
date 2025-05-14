import { FormControl, FormLabel, Input } from '@chakra-ui/react';
import { useRef, useState, useCallback } from 'react';
import { DetailedMob, SummaryMob } from '@lib/models/dnd5eapi/DetailedMob';
import { MobTypeahead } from '../MobTypeahead';
import useDndApi from '@lib/services/dnd5eapi-service';
import { debounce } from '@lib/util/js-utils';

interface MobTypeaheadFormControlProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onSelect: (mob: DetailedMob) => void;
  selectedMob: DetailedMob | null;
  showSelectedLabel?: boolean;
  selectedLabelText?: string;
  inputDataTestId: string;
}

export const MobTypeaheadFormControl: React.FC<MobTypeaheadFormControlProps> = ({
  label = 'Mob Name',
  placeholder = 'Search for a mob...',
  value,
  onChange,
  onSelect,
  selectedMob,
  showSelectedLabel = true,
  selectedLabelText = 'You have selected:',
  inputDataTestId: dataTestId,
}) => {
  const [typeaheadMobs, setTypeaheadMobs] = useState<SummaryMob[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const typeaheadRef = useRef<HTMLUListElement | null>(null);
  const { getAllMobsAsync, getMobByName } = useDndApi();

  const fetchTypeaheadMobs = async (userInput: string) => {
    if (userInput === '') {
      setTypeaheadMobs([]);
      return;
    }

    const filteredMobs = (await getAllMobsAsync()).filter((mob) =>
      mob.name.toLowerCase().includes(userInput.toLowerCase())
    );

    setTypeaheadMobs(filteredMobs);
  };

  const debouncedFetchTypeaheadMobs = useCallback(
    debounce((userInput: string) => {
      fetchTypeaheadMobs(userInput);
    }, 200),
    []
  );

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const userInput = e.target.value;
    onChange(userInput);
    debouncedFetchTypeaheadMobs(userInput);
    setHighlightedIndex(-1);
  };

  const handleTypeaheadSelect = (summaryMob: SummaryMob) => {
    onChange(summaryMob.name);

    getMobByName(summaryMob.name).then((detailedMob) => {
      if (detailedMob) {
        onSelect(detailedMob);
      }
    });

    setTypeaheadMobs([]);
    setHighlightedIndex(-1);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setTimeout(() => setIsFocused(false), 100);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (typeaheadMobs.length > 0 && isFocused) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setHighlightedIndex((prevIndex) => (prevIndex + 1) % typeaheadMobs.length);
        typeaheadRef.current?.scrollTo(0, (highlightedIndex + 1) * 40);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setHighlightedIndex((prevIndex) => (prevIndex - 1 + typeaheadMobs.length) % typeaheadMobs.length);
        typeaheadRef.current?.scrollTo(0, (highlightedIndex - 1) * 40);
      } else if (e.key === 'Enter' && highlightedIndex >= 0) {
        e.preventDefault();
        handleTypeaheadSelect(typeaheadMobs[highlightedIndex]);
      }
    }
  };

  return (
    <FormControl position="relative">
      <FormLabel color="white">{label}</FormLabel>
      <Input
        type="text"
        value={value}
        color="white"
        textFillColor={'whiteAlpha.800'}
        placeholder={placeholder}
        onChange={handleInputChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        data-testid={dataTestId}
      />
      <MobTypeahead
        ref={typeaheadRef}
        typeaheadMobs={typeaheadMobs}
        highlightedIndex={highlightedIndex}
        isFocused={isFocused}
        searchTerm={value}
        handleTypeaheadClick={handleTypeaheadSelect}
      />
      {showSelectedLabel && selectedMob && (
        <FormLabel
          fontSize="xs"
          fontStyle="italic"
          color="whiteAlpha.700"
          mt="1"
          data-testid="selected-mob-typeahead-label"
        >
          {selectedLabelText} <b>{selectedMob.name}</b>
        </FormLabel>
      )}
    </FormControl>
  );
};
