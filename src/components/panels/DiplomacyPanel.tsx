import { useUiStore } from '../../state/uiStore';
import { useGameStore } from '../../state/gameStore';
import styles from './Panel.module.css';

function DiplomacyPanel() {

    const closePanel = useUiStore(state => state.closePanel);

    const getOrgById = useGameStore(state => state.getOrgById);
    const processPlayerDiplo = useGameStore(state => state.processPlayerDiplo);

    const playerOrg = getOrgById(1);

    //something is seriously wrong in this case...
    if(!playerOrg){
        return null;
    }

    const incomingRequests = playerOrg.diplomacy.incomingRequests;

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
        </div>
    );

}

export default DiplomacyPanel;
