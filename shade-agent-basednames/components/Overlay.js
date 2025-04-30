import styles from '../styles/Home.module.css';

export default function Overlay({ message }) {
    if (!message) return [];

    return (
        <div className={styles.overlay}>
            <div className={styles.message}>{message}</div>
        </div>
    );
}
