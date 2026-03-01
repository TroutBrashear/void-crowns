
import styles from './ProgressBar.module.css';


function ProgressBar({fill, full}: {fill: number, full: number}) {


    return(
      <div className={styles.fullBar}>
        <div className={styles.fillBar}>
        </div>
      </div>
    );
}

export default ProgressBar;
