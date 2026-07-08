import type { AiIntent } from './aiState';
import type { DiploRequest } from './gameState';
import type { Resources } from './ecoState';

//state for Governance, politicking, etc


//-----------ORGS (NATIONS, CORPORATIONS, FACTIONS, ETC)------------------
export type OrgCategory = 'nationState' | 'corporation';

export interface OrgRelation {
    targetOrgId: number;
    status: 'peace' | 'war';
    opinion: number;
}


export interface Org {
    readonly id: number;
    category: OrgCategory;

    flavor:{
        name: string;
        color: string;
        nameList: string;
    }
    government: {
        succession: string;
        leaderTermDuration: number;
        presentTermEnd: number;
        homeSystem: number; //a System.id
    }


    resources: Resources;

    research: {
        researched: string[];
        researchBonuses: {
            depositSurvey: number;
            fleetCombat: number;
        }
    }
    characters: {
        characterPool: number[]; //ids in a pool for character recruitment

        leaderId: number | null; //id for leader character
    }

    parentId: number | null;
    childIds: number[];

    diplomacy: {
        relations: Record<number, OrgRelation>;
        incomingRequests: DiploRequest[];
        residentDiplomats: number[];
    }

    contextHistory: {
        previousIncome: Resources;
        buildPlan: AiIntent[];
        targetSystems: number[];
    }
}

export type Ideology = 'monarchist' | 'authoritarian' | 'republican' | 'corporate';

export type CellType = 'rebel' | 'criminal' | 'corporate';
export type CellAssignmentType = 'idle' | 'assassinateGovernor' | 'gatherStrength';

export interface Cell {
    readonly id: number;
    type: CellType;

    strength: number;

    locationId: number; //a planetoidId with the Cell's location'

    leader: number; //a Character's id

    assignment: {
        type: CellAssignmentType;
        target: number; //the id of a Planetoid or Cell targeted by the assignment
        progress: number;
    }
}

export interface Movement {
    readonly id: number;
    ideology: Ideology;

    originLocation: number; //a planetoidId

    fervor: number; //a number from 0-10
}
