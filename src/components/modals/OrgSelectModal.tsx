import { useUiStore } from '../../state/uiStore';
import { useGameStore } from '../../state/gameStore';
import styles from './Modal.module.css';


function OrgSelectModal() {
	const selection = useUiStore(state => state.selection);
	const closeModal = useUiStore(state => state.closeModal);
	const backModal = useUiStore(state => state.backModal);



	const getOrgById = useGameStore(state => state.getOrgById);

	//diplo actions
	const sendDiploRequest = useGameStore(state => state.sendDiploRequest);

	const orgToShow = useGameStore(state => 
    	(selection?.type === 'org')
    	? state.orgs.entities[selection.id] // Go directly to the data
    	: null
  	);

     if (!orgToShow) {
    	return null; 
 	 }


    const orgRelations = orgToShow.diplomacy.relations;


    //if this is the player org, no need to render diplo options
	if(orgToShow.id === 1){
		return (
			<div className={styles.modal}>
				<h2>{orgToShow.flavor.name}</h2>
				<h3>International Relations:</h3>
				<ul>
					{orgRelations.map(relation => {

						const targetOrg = getOrgById(relation.targetOrgId);

						if(!targetOrg){
							return null;
						}
						return(
							<li key={relation.targetOrgId}>
								{relation.status} with {targetOrg.flavor.name} ({relation.opinion})
							</li>);
					})}
				</ul>

				<button onClick={backModal}>Back</button>
				<button onClick={closeModal}>Close</button>
			</div>
		);
	}

	//now, for foreign orgs

	const relationsToPlayer = orgRelations.find(rel => rel.targetOrgId === 1);
	const currentStatus = relationsToPlayer?.status || 'peace'; 


	return (
		<div className={styles.modal}>
			<h2>{orgToShow.flavor.name}</h2>
			<h3>Your current status: {currentStatus}</h3>
			{currentStatus === 'war' ? <button onClick={() => sendDiploRequest({targetOrgId: orgToShow.id, originOrgId: 1, requestType: 'peace' })}>Offer Peace</button>
				: <button onClick={() => sendDiploRequest({targetOrgId: orgToShow.id, originOrgId: 1, requestType: 'war' })}>Declare War</button>}
			<h3>International Relations:</h3>
			<ul>
				{orgRelations.map(relation => {

					const targetOrg = getOrgById(relation.targetOrgId);

					if(!targetOrg){
						return null;
					}
					return(
						<li key={relation.targetOrgId}>
							{relation.status} with {targetOrg.flavor.name} ({relation.opinion})
						</li>);
				})}
			</ul>


			<button onClick={backModal}>Back</button>
			<button onClick={closeModal}>Close</button>
		</div>
	);

}

export default OrgSelectModal;
