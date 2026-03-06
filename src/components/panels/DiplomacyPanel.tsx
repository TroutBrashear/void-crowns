import { useUiStore } from '../../state/uiStore';
import { useGameStore } from '../../state/gameStore';
import styles from './Panel.module.css';

function DiplomacyPanel() {

    const changeModal = useUiStore(state => state.changeModal);
    const closePanel = useUiStore(state => state.closePanel);

    const getOrgById = useGameStore(state => state.getOrgById);
    const processPlayerDiplo = useGameStore(state => state.processPlayerDiplo);

    const playerOrg = getOrgById(1);

    //something is seriously wrong in this case...
    if(!playerOrg){
        return null;
    }

    const incomingRequests = playerOrg.diplomacy.incomingRequests;

    const orgRelations = playerOrg.diplomacy.relations;

    return (
        <div className={styles.panel}>
            <h1>Diplomacy</h1>
            <button onClick={() => closePanel()}>Close</button>

            <h3>Incoming requests:</h3>
            {incomingRequests.map(request => {
                let originOrg = getOrgById(request.originOrgId);
                if(!originOrg){
                    return null;
                }
                return(
                    <div key={request.id}>
                        <p>{originOrg.flavor.name} is requesting {request.type}</p>
                        <button onClick = {() => processPlayerDiplo({requestId: request.id, accepted: true})} >Accept</button>
                        <button onClick = {() => processPlayerDiplo({requestId: request.id, accepted: false})}>Decline</button>
                    </div>
                )
            })}

            <h3>Ongoing Relations:</h3>
            <ul>
            {orgRelations.map(relation => {

                const targetOrg = getOrgById(relation.targetOrgId);

                if(!targetOrg){
                    return null;
                }
                else if(targetOrg.category !== 'nationState'){
                    return null;
                }
                return(
                    <li key={relation.targetOrgId}>
                        <button onClick={() => {changeModal('org_modal', {type: 'org', id: relation.targetOrgId}); }}>{targetOrg.flavor.name}</button>
                        <p>Current Relations: {relation.status}</p>
                    </li>);
            })}
            </ul>
        </div>
    );

}

export default DiplomacyPanel;
