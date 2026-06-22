//definitions for ships

import type { Resources } from '../types/ecoState';
import type { ShipType } from '../types/shipTypes';

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
