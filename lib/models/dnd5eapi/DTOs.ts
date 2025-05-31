export interface DamageTypeDTO {
  index: string;
  name: string;
  url: string;
}

export interface ConditionImmunityDTO {
  index: string;
  name: string;
  url: string;
}

export interface ProficiencyDTO {
  value: number;
  proficiency: {
    index: string;
    name: string;
    url: string;
  };
}

export interface ArmorClassDTO {
  type?: string;
  value: number;
}

export interface SpeedDTO {
  walk?: string;
  [key: string]: string | undefined; // other speed types like fly, swim, etc.
}

export interface DCTypeDTO {
  index: string;
  name: string;
  url: string;
}

export interface DCDTO {
  dc_type: DCTypeDTO;
  dc_value: number;
  success_type: string;
}

export interface DamageDTO {
  damage_type: DamageTypeDTO;
  damage_dice: string;
}

export interface ActionDTO {
  name: string;
  desc: string;
  attack_bonus?: number;
  damage: DamageDTO[];
  actions?: ActionDTO[]; // nested actions, e.g., multiattack
  dc?: DCDTO;
  multiattack_type?: string;
}

export interface MonsterDTO {
  index: string;
  name: string;
  size: string;
  type: string;
  alignment: string;
  armor_class: ArmorClassDTO[];
  hit_points: number;
  hit_dice: string;
  hit_points_roll: string;
  speed: SpeedDTO;
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
  proficiencies: ProficiencyDTO[];
  damage_vulnerabilities: string[];
  damage_resistances: string[];
  damage_immunities: string[];
  condition_immunities: ConditionImmunityDTO[];
  senses: {
    darkvision?: string;
    passive_perception: number;
    [key: string]: any; // in case of other senses
  };
  languages: string;
  challenge_rating: number;
  proficiency_bonus: number;
  xp?: number;
  actions: ActionDTO[];
  url: string;
  updated_at?: string;
  image?: string;
  forms: any[]; // empty array, unknown structure
  legendary_actions: ActionDTO[];
  reactions: ActionDTO[];
  special_abilities: ActionDTO[];
}
