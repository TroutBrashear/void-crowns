//definitions for ships

import type { Resources } from '../types/ecoState';
import type { ShipType, MilShipStats, MilShipStatus } from '../types/shipTypes';

export interface ShipDefinition {
    type: ShipType;
    cost: Partial<Resources>;
}

export const SHIP_CATALOG: Record<ShipType, ShipDefinition> = {
    colony_ship: {
        type: 'colony_ship',
        cost: { credits: 15000 }
    },

    survey_ship: {
        type: 'survey_ship',
        cost: { credits: 4000 }
    },

    construction_ship: {
        type: 'construction_ship',
        cost: { credits: 10000 }
    }
}


export interface ShipTrait {
    id: number;
    name: string;
    applyCat: MilShipStatus[];
    desc: string;
    statDelta: Partial<MilShipStats>;
}

export const SHIP_TRAITS: Record<number, ShipTrait> = {
    1: {
        id: 1,
        name: "Bat Infested",
        applyCat: ["wreck"],
        desc: "This ship has been infested with space bats",
        statDelta: {
            strength: -1
        }
    }
}
