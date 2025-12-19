import { useUiStore } from '../state/uiStore';
import styles from './Notification.module.css';

function Notification() {
	const notification = useUiStore((state) => state.notification);
	const hideNotification = useUiStore((state) => state.hideNotification);


	if(!notification.isOpen || !notification.notificationType)
	{
		return null;
	}

	const notificationClassName = `${styles.notification} ${styles[notification.notificationType]}`;
	return(
		<div className={notificationClassName}>
			<p>{notification.notificationMessage}</p>
			<button onClick={hideNotification}>X</button>
		</div>
	);
}

export default Notification;