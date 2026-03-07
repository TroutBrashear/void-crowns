//definitions for ships

import type { ShipType, Resources } from '../types/gameState';

export interface ShipDefinition {
    type: ShipType;
    cost: Resources;
}

export const SHIP_CATALOG: Record<ShipType, ShipDefinition> = {
    colony_ship: {
        type: 'colony_ship',
        cost: { credits: 15000, rocks: 0, consumerGoods: 0 }
    },

    survey_ship: {
        type: 'survey_ship',
        cost: { credits: 4000, rocks: 0, consumerGoods: 0 }
    }
}
