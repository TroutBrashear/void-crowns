//definitions for planet types

export interface planetType  {
    type: string;
    popGrowthModifier: number;
    defaultValue: number;
}

export const PLANET_ENVIRONMENTS: Record<string, planetType> = {
        barren: {
            type: "barren",
            popGrowthModifier: 0.1,
            defaultValue: 0,
        },
        desert: {
            type: "desert",
            popGrowthModifier: 0.5,
            defaultValue: 10,
        },
        outback: {
            type: "outback",
            popGrowthModifier: 0.7,
            defaultValue: 35,
        },
        ocean: {
            type: "ocean",
            popGrowthModifier: 0.5,
            defaultValue: 15,
        },
        temperate: {
            type: "temperate",
            popGrowthModifier: 1,
            defaultValue: 50,
        },
        humid: {
            type: "humid",
            popGrowthModifier: 0.8,
            defaultValue: 40,
        },
        taiga: {
            type: "taiga",
            popGrowthModifier: 0.7,
            defaultValue: 35,
        },
        tundra: {
            type: "tundra",
            popGrowthModifier: 0.6,
            defaultValue: 30
        },
        gaseous: {
            type: "gaseous",
            popGrowthModifier: 0.1,
            defaultValue: 10
        },
        molten: {
            type: "molten",
            popGrowthModifier: 0.1,
            defaultValue: 0
        }
}
