import { _CharacterCamps } from "./_character-camps";
import { _DamageElements } from "./_damage-elements";
import { _DamageTypes } from "./_damage-types";
import { _DescIcons } from "./_desc-icons";
import { _MaterialClasses } from "./_material-classes";
import { _Rarities } from "./_rarities";
import { _Stats } from "./_stats";
import { Agents } from "./agents";
import { Bangboos } from "./bangboos";
import { BangbooSkills } from "./bangboo-skills";
import { BangbooTalents } from "./bangboo-talents";
import { DiskDrives } from "./disk-drives";
import { DiskDriveSets } from "./disk-drive-sets";
import { Materials } from "./materials";
import { Skills } from "./skills";
import { Talents } from "./talents";
import { WEngines } from "./w-engines";

export const CustomCollections = [
  Agents,
  Bangboos,
  WEngines,
  DiskDriveSets,
  DiskDrives,
  BangbooSkills,
  BangbooTalents,
  Materials,
  Skills,
  Talents,
  _CharacterCamps,
  _DamageElements,
  _DamageTypes,
  _DescIcons,
  _MaterialClasses,
  _Rarities,
  _Stats,
];

export const CustomSearchCollections = [
  "agents",
  "bangboos",
  "w-engines",
  "disk-drive-sets",
  "materials",
];

export const CustomDefaultPriorities = {
  agents: 90,
  bangboos: 70,
  "w-engines": 60,
  "disk-drive-sets": 50,
  materials: 30,
};
