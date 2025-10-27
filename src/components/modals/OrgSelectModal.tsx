import { useUiStore } from '../../state/uiStore';
import { useGameStore } from '../../state/gameStore';
import styles from './Modal.module.css';


function OrgSelectModal() {
	const selection = useUiStore(state => state.selection);
	const closeModal = useUiStore(state => state.closeModal);

	const getOrgById = useGameStore(state => state.getOrgById);

	const orgToShow = 
    (selection?.type === 'org') 
    ? getOrgById(selection.id) 
    : null;

     if (!orgToShow) {
    	return null; 
 	 }


    const orgRelations = orgToShow.relations;

	return (
		<div className={styles.modal}>
			<h2>{orgToShow.name}</h2>
			<h3>International Relations:</h3>
			<ul>
				{orgRelations.map(relation => {

					const targetOrg = getOrgById(relation.targetOrgId);

					if(!targetOrg){
						return null;
					}
					return(
						<li key={relation.targetOrgId}>
							{relation.status} with {targetOrg.name} ({relation.opinion})
						</li>);
				})}
			</ul>

			<button onClick={closeModal}>Close</button>
		</div>
	);

}

export default OrgSelectModal;