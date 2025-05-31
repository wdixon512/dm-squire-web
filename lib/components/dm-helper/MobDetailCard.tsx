'use client';

import { Box, Img, Heading, Text, Divider, Flex, List, ListItem, Badge } from '@chakra-ui/react';
import { DetailedMob } from '@lib/models/dnd5eapi/DetailedMob';
import { getLibraryProfilePictureUrl } from '@lib/util/dm-helper-utils';
import { toKebabCase } from '@lib/util/js-utils';

interface MobDetailCardProps {
  mob?: DetailedMob;
}

export const MobDetailCard: React.FC<MobDetailCardProps> = ({ mob }) => {
  const calculateModifier = (score: string): number => Math.floor((parseInt(score) - 10) / 2);

  // Helper to render arrays as badges, or null if empty
  const renderBadges = (items?: string[]) => {
    if (!items || items.length === 0) return null;
    return (
      <List spacing={1} mb={3}>
        {items.map((item, idx) => (
          <ListItem key={idx} display="inline" mr={2}>
            <Badge colorScheme="purple">{item}</Badge>
          </ListItem>
        ))}
      </List>
    );
  };

  return (
    mob && (
      <Box
        borderWidth="1px"
        borderRadius="lg"
        overflow="hidden"
        p={5}
        bg="gray.50"
        data-testid={`detail-card-${toKebabCase(mob?.name.toLowerCase())}`}
      >
        <Img src={getLibraryProfilePictureUrl(mob.name)} alt={mob.name} mb={3} mx="auto" display="block" />
        <Heading size="lg" mb={3} textAlign="center" variant="dark">
          {mob.name}
        </Heading>
        <Text variant="dark" fontSize="md" textAlign="center" color="gray.600" mb={3}>
          {mob.size} {mob.type}, {mob.alignment}
        </Text>

        <Divider my={3} />

        <Flex justifyContent="space-between" mb={3}>
          <Box>
            <Text variant="dark">
              <strong>Armor Class:</strong> {mob.ac}
            </Text>
            <Text variant="dark">
              <strong>Hit Points:</strong> {mob.hp}
            </Text>
            <Text variant="dark">
              <strong>Speed:</strong> {mob.speed}
            </Text>
          </Box>
          <Box>
            <Text variant="dark">
              <strong>Challenge:</strong> {mob.cr}
            </Text>
          </Box>
        </Flex>

        <Divider my={3} />

        <Flex justifyContent="space-around" textAlign="center" mb={3}>
          <Box>
            <Text variant="dark">
              <strong>STR:</strong> {mob.str} ({calculateModifier(mob.str)})
            </Text>
            <Text variant="dark">
              <strong>DEX:</strong> {mob.dex} ({calculateModifier(mob.dex)})
            </Text>
            <Text variant="dark">
              <strong>CON:</strong> {mob.con} ({calculateModifier(mob.con)})
            </Text>
          </Box>
          <Box>
            <Text variant="dark">
              <strong>INT:</strong> {mob.int} ({calculateModifier(mob.int)})
            </Text>
            <Text variant="dark">
              <strong>WIS:</strong> {mob.wis} ({calculateModifier(mob.wis)})
            </Text>
            <Text variant="dark">
              <strong>CHA:</strong> {mob.cha} ({calculateModifier(mob.cha)})
            </Text>
          </Box>
        </Flex>

        <Divider my={3} />

        <Box mb={3}>
          <Text variant="dark" fontSize="lg" fontWeight="bold" mb={1}>
            Skills & Senses
          </Text>
          <List spacing={2}>
            {mob.skill &&
              mob.skill.map((skill, index) => (
                <ListItem key={index}>
                  <Badge colorScheme="teal" mr={2}>
                    {skill}
                  </Badge>
                </ListItem>
              ))}
            <ListItem>
              <Text variant="dark">
                <strong>Senses:</strong> {mob.senses}
              </Text>
            </ListItem>
            <ListItem>
              <Text variant="dark">
                <strong>Passive Perception:</strong> {mob.passive}
              </Text>
            </ListItem>
          </List>
        </Box>

        <Divider my={3} />

        {/* Traits section */}
        <Box>
          <Text variant="dark" fontSize="lg" fontWeight="bold" mb={1}>
            Traits
          </Text>
          <List spacing={2}>
            {mob.trait &&
              mob.trait.map((trait, index) => (
                <ListItem key={index}>
                  <Text variant="dark" fontWeight="bold">
                    {trait.name}:
                  </Text>
                  <Text variant="dark">{trait.text.join(' ')}</Text>
                </ListItem>
              ))}
          </List>
        </Box>

        {/* New Resistances / Vulnerabilities / Immunities */}
        {(mob.resist?.length || mob.vulnerable?.length || mob.immune?.length || mob.conditionImmune?.length) > 0 && (
          <>
            <Divider my={3} />
            <Box>
              <Text variant="dark" fontSize="lg" fontWeight="bold" mb={2}>
                Damage & Condition Immunities
              </Text>

              {mob.resist && mob.resist.length > 0 && (
                <>
                  <Text variant="dark" fontWeight="semibold" mb={1}>
                    Damage Resistances:
                  </Text>
                  {renderBadges(mob.resist)}
                </>
              )}

              {mob.vulnerable && mob.vulnerable.length > 0 && (
                <>
                  <Text variant="dark" fontWeight="semibold" mb={1}>
                    Damage Vulnerabilities:
                  </Text>
                  {renderBadges(mob.vulnerable)}
                </>
              )}

              {mob.immune && mob.immune.length > 0 && (
                <>
                  <Text variant="dark" fontWeight="semibold" mb={1}>
                    Damage Immunities:
                  </Text>
                  {renderBadges(mob.immune)}
                </>
              )}

              {mob.conditionImmune && mob.conditionImmune.length > 0 && (
                <>
                  <Text variant="dark" fontWeight="semibold" mb={1}>
                    Condition Immunities:
                  </Text>
                  {renderBadges(mob.conditionImmune)}
                </>
              )}
            </Box>
          </>
        )}

        {/* Actions section */}
        <Divider my={3} />
        <Box>
          <Text variant="dark" fontSize="lg" fontWeight="bold" mb={1}>
            Actions
          </Text>
          <List spacing={2}>
            {mob.action &&
              mob.action.map((action, index) => (
                <ListItem key={index}>
                  <Text variant="dark" fontWeight="bold">
                    {action.name}:
                  </Text>
                  <Text variant="dark">{action.text.join(' ')}</Text>
                </ListItem>
              ))}
          </List>
        </Box>

        {/* Legendary Actions */}
        {mob.legendary && mob.legendary.length > 0 && (
          <>
            <Divider my={3} />
            <Box>
              <Text variant="dark" fontSize="lg" fontWeight="bold" mb={1}>
                Legendary Actions
              </Text>
              <List spacing={2}>
                {mob.legendary.map((legendary, index) => (
                  <ListItem key={index}>
                    <Text variant="dark" fontWeight="bold">
                      {legendary.name}:
                    </Text>
                    <Text variant="dark">{legendary.text.join(' ')}</Text>
                  </ListItem>
                ))}
              </List>
            </Box>
          </>
        )}
      </Box>
    )
  );
};
