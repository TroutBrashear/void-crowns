
import styles from './ProgressBar.module.css';


function ProgressBar({fill, full}: {fill: number, full: number}) {

    const percentage = (fill / full) * 100;

    return(
      <div className={styles.fullBar}>
        <div className={styles.fillBar} style={{ width: `${percentage}%` }}>
        </div>
      </div>
    );
}

export default ProgressBar;
