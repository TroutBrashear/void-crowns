import type { GameState } from '../types/gameState';
import { processAiFleetMoves, processAiShipMoves } from './ai/movement';
import { processAiConstruction } from './ai/construction';
import { processAiBuildPlanning, processAiCharacterManagement } from './ai/planning';

export function processAiTurn(currentState: GameState, orgId: number): GameState {

  let nextState = processAiBuildPlanning(currentState, orgId);


  nextState = processAiCharacterManagement(nextState, orgId);

  nextState = processAiFleetMoves(nextState, orgId);

  nextState = processAiShipMoves(nextState, orgId);

  nextState = processAiConstruction(nextState, orgId);

  return nextState;
}
