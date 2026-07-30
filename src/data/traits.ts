//definitions for character traits

import type { SkillName } from "../types/charState";



export interface TraitDefinition {
    id: string;
    name: string;
    desc: string;
    SkillDelta: Partial<Record<SkillName, number>>;
    ElectionBonus?: number;
    excludes?: string[]; //incompatible traits
}


export const CHARACTER_TRAITS: Record<string, TraitDefinition> = {
    "studious": {
        id: "studious",
        name: "Studious",
        desc: "This character is dedicated to their studies.",
        SkillDelta: { 'academics': 1 },
        excludes: ["lazy"]
    },
    "lazy": {
        id: "lazy",
        name: "Lazy",
        desc: "This character does their best to get out of work.",
        SkillDelta: { 'academics': -2, 'administration': -1, "exploration": -1 },
        excludes: ["studious"]
    },
    "curious": {
        id: "curious",
        name: "Curious",
        desc: "This character is inquisitive and investigates as much as they can.",
        SkillDelta: { 'exploration': 2 }
    },
    "aggressive": {
        id: "aggressive",
        name: "Aggressive",
        desc: "This character usually tries solving problems with force",
        SkillDelta: { 'navalCombat': 1 }
    }
}
