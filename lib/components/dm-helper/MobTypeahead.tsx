'use client';

import { List, ListItem, ListProps, Text } from '@chakra-ui/react';
import { SummaryMob } from '@lib/models/dnd5eapi/DetailedMob';
import { toKebabCase } from '@lib/util/js-utils';
import React from 'react';

interface MobTypeaheadProps extends ListProps {
  typeaheadMobs: SummaryMob[];
  highlightedIndex: number;
  isFocused: boolean;
  searchTerm: string;
  handleTypeaheadClick: (summaryMob: SummaryMob) => void;
}

export const MobTypeahead = React.forwardRef<HTMLUListElement, MobTypeaheadProps>(
  ({ typeaheadMobs, highlightedIndex, isFocused, searchTerm, handleTypeaheadClick }, ref) => {
    return (
      typeaheadMobs.length > 0 &&
      isFocused &&
      searchTerm.length > 0 && (
        <List
          ref={ref}
          position="absolute"
          top="100%"
          left={0}
          right={0}
          bg="white"
          border="1px solid"
          borderColor="gray.200"
          borderRadius="md"
          zIndex={1}
          mt={1}
          maxH="150px"
          overflowY="auto"
        >
          {typeaheadMobs.map((mob, i) => (
            <ListItem
              key={mob.name}
              p={2}
              _hover={{ bg: 'gray.100', cursor: 'pointer' }}
              bg={i === highlightedIndex ? 'gray.100' : 'white'}
              border={i === highlightedIndex ? '1px solid' : 'none'}
              borderColor="primary.200"
              onClick={() => handleTypeaheadClick(mob)}
              data-testid={`typeahead-mob-${toKebabCase(mob.name)}`}
            >
              <Text color={'primary.200'} fontWeight={'bold'}>
                {mob.name}
              </Text>
            </ListItem>
          ))}
        </List>
      )
    );
  }
);

MobTypeahead.displayName = 'MobTypeahead';
