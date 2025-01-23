export interface DetailedMob {
  name: string; // The monster's name
  size: string; // Size (e.g., "S" for Small)
  type: string; // Type and subtype (e.g., "humanoid (goblinoid), monster manual")
  alignment: string; // Alignment (e.g., "neutral evil")
  ac: string; // Armor Class (e.g., "15 (leather armor, shield)")
  hp: string; // Hit Points (e.g., "7 (2d6)")
  speed: string; // Speed (e.g., "30 ft.")
  str: string; // Strength ability score
  dex: string; // Dexterity ability score
  con: string; // Constitution ability score
  int: string; // Intelligence ability score
  wis: string; // Wisdom ability score
  cha: string; // Charisma ability score
  skill: string[]; // Skills (e.g., ["Stealth +6"])
  senses: string; // Senses (e.g., "darkvision 60 ft.")
  passive: string; // Passive Perception (e.g., "9")
  languages: string; // Languages (e.g., "Common, Goblin")
  cr: string; // Challenge Rating (e.g., "1/4")
  trait: Array<{
    name: string; // Trait name
    text: string[]; // Trait description as an array of strings
  }>; // Traits (special abilities)
  action: Array<{
    name: string; // Action name
    text: string[]; // Action description as an array of strings
    attack?: string[]; // Attack information (e.g., ["|4|1d6+2"])
  }>; // Actions
  save: string[]; // Saving Throws (e.g., [])
  resist: string[]; // Damage Resistances (e.g., [])
  vulnerable: string[]; // Damage Vulnerabilities (e.g., [])
  immune: string[]; // Damage Immunities (e.g., [])
  conditionImmune: string[]; // Condition Immunities (e.g., [])
  spells: string[]; // Spells (e.g., [])
  slots: string[]; // Spell Slots (e.g., [])
  legendary: Array<{
    name: string; // Legendary action name
    text: string[]; // Description of the legendary action
  }>; // Legendary Actions
  description: string[]; // Additional descriptions (e.g., [])
  reaction: Array<{
    name: string; // Reaction name
    text: string[]; // Reaction description
  }>; // Reactions
}

export interface SummaryMob {
  name: string; // The monster's name
}
