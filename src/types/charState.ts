import type { Ideology } from "./govState";

//state for characters

export type CharacterAssignment = 'leader' | 'admiral' | 'governor' | 'surveyor' | 'scientist' | 'academyPresident' | 'diplomat';


//a helper that holds information about what a character is currently doing
export interface charAssignment {
    type: CharacterAssignment;
    id: number;
    duration?: number; //turn that the character's assignment will end - used for Mission-based Assignments
}

export type SkillName = 'navalCombat' | 'administration' | 'exploration' | 'academics' | 'diplomacy';

export type CharacterStatus = 'alive' | 'dead';

export interface Character {
    readonly id: number;

    status: CharacterStatus;

    name: {
        firstName: string;
        lastName: string;
    }
    age: number;
    traits: string[];
    skills: Record<SkillName, number>;
    assignment: charAssignment | null;

    citizenOrg: number | null; //refers to the Org this character is a part of

    politics: {
        leaning: Ideology;
    }

    history: {
        events: string[];
        parentId?: number;
        childrenIds: number[];
    }
}
