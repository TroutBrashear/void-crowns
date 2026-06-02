import styles from './Button.module.css';


interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>{ }

export function Button({children, ...props}: ButtonProps){
    return(
        <button className={styles.button} {...props}>{children}</button>
    );
}


export default Button;
