//definitions for tags applied to systems and planetoids


export interface PlanetoidGenerationProcess {
    size?: number;
}


export interface TagDefinition {
    name: string;
    playerVisible: boolean;
    description: string;
    generationEffects?: PlanetoidGenerationProcess;
}


export const PLANETOID_TAGS: Record<string, TagDefinition> = {
    "unusually_large": {
        name: "Unusually Large",
        playerVisible: true,
        description: "This body is unusually large for one of its class.",
        generationEffects: {
            size: 4,
        }
    },

    "unusually_small": {
        name: "Unusually Small",
        playerVisible: true,
        description: "This body is unusually small for one of its class.",
        generationEffects: {
            size: -4,
        }
    },
}
