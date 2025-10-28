import type { GameState } from '../types/GameState';
import { processAiFleetMoves } from './ai/movement';

export function processAiTurn(currentState: GameState, orgId: number): GameState {

  const nextState = processAiFleetMoves(currentState, orgId);

  return nextState;
}