import { create } from 'zustand';
import type { System, Fleet, Org } from '../types/gameState';
import { normalize } from '../utils/normalize';

import { initialOrgs, initialSystems, initialFleets } from '../data/scenarios/demo';

interface EntitiesState<T> {
  entities: { [id: number]: T };
  ids: number[];
}

interface GameState {
  systems: EntitiesState<System>;
  fleets: EntitiesState<Fleet>;
  orgs: EntitiesState<Org>;
}

export const useGameStore = create<GameState>((_set, _get) => ({
  systems: normalize(initialSystems),
  fleets: normalize(initialFleets),
  orgs: normalize(initialOrgs),
}));