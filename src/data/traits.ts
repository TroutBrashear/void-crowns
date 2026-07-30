//definitions for character traits

import type { SkillName } from "../types/charState";



export interface TraitDefinition {
    name: string;
    desc: string;
    SkillDelta: Record<SkillName, number>;
    ElectionBonus: number;
    excludes?: string[]; //incompatible traits
}
