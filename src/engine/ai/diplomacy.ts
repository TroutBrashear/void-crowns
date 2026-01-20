import type { GameState, DiploRequest } from '../../types/gameState';

export function evaluateDiploRequest(currentState: GameState, orgId: number, request: DiploRequest): boolean {

    //automatic requests always return true
    if(request.type == 'war'){
        return true;
    }

    const evaluatingOrg = currentState.orgs.entities[orgId];
    const originOrg = currentState.orgs.entities[request.originOrgId];

    if(!evaluatingOrg || ! originOrg){
        return false;
    }


    if(request.type == 'peace'){
        return true; //todo: consult actual logic
    }

    else{
        //fallback case, shouldn't ever occur
        return false;
    }
}
