import styles from './MenuLayout.module.css';

interface MenuLayoutProps {
    children: React.ReactNode;
}

export function MenuLayout({ children }: MenuLayoutProps) {
    return <div className={styles.menuContainer}>{children}</div>;
}
