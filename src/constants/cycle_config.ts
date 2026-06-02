//presently, just intervals for evaluating each subject area every x ticks

export const CYCLE_CONFIG = {
    SURVEY: {
         SURVEY_INTERVAL: 20,
    },
    LANES: {
        LANESHIFT_INTERVAL: 50,
    },
    ECONOMY: {
        ECONOMY_INTERVAL: 10,
        POP_PROGRESS_GOAL: 10,
        DEFAULT_POP_TAX: 500,
        GOVERNOR_TAX_BONUS: 100,
    },
    DIPLOMACY: {
        DIPLOMAT_INTERVAL: 10,
        DIPLO_MISSION_DURATION: 50,
    },
    CHARACTER: {
        AGING_INTERVAL: 50,
        ACADEMY_SPAWN_FLOOR: 6,
        ACADEMY_SPAWN_CHANCE: 5,
    },
    ECOLOGY: {
        LANE_FADE_CHANCE: 2,
        LANE_STABLE_CHANCE: 5,
    }
};
