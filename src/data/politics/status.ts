
export interface StatusDefinition {
    id: string;

    defaultSecurity: string;

    votingStrength: number; //between 0 and 1 as a multiplier.
}


export const DEFAULT_STATUS_CATALOG: Record<string, StatusDefinition> = {
    "Core": {
        id: "Core",
        defaultSecurity: "Light",
        votingStrength: 1
    },
    "Colony": {
        id: "Colony",
        defaultSecurity: "Light",
        votingStrength: 0.5
    },
    "Occupied": {
        id: "Occupied",
        defaultSecurity: "Heavy",
        votingStrength: 0
    },
    "Anarchy": {
        id: "Anarchy",
        defaultSecurity: "None",
        votingStrength: 0
    },
    "Martial": {
        id: "Martial",
        defaultSecurity: "Heavy",
        votingStrength: 0.5
    }
}
