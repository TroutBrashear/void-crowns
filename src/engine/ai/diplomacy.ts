import type { GameState, DiploRequest } from '../../types/gameState';

export function evaluateDiploRequest(currentState: GameState, orgId: number, request: DiploRequest): boolean {

    //automatic requests always return true
    if(request.type == 'war'){
        return true;
    }


    if(request.type == 'peace'){
        if(currentState.intelligence.trueStatus[orgId].militaryStrength < 0.75 * currentState.intelligence.trueStatus[request.originOrgId].militaryStrength){ //todo: base this on receiver's PERCEPTION of originOrg rather than ground truth.
            return true; //accept peace
        }
        else{
            return false;
        }
    }

    else{
        //fallback case, shouldn't ever occur
        return false;
    }
}
