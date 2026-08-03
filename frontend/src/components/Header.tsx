import { Link } from 'react-router-dom';
import styles from '../App.module.css';

const Header = () => {
    return (
        <header className={`${styles.masthead} relative z-20`}>
            <Link to="/" className={styles.aipc49} style={{ textDecoration: 'none', color: 'inherit' }}>
                ALL IITs PLACEMENT COMMITTEE
            </Link>
            <div className={styles.navCta}>
                <nav className={styles.nav} aria-label="Primary">
                    <span className={styles.about}>ABOUT</span>
                    <span className={styles.about}>PROGRAMME</span>
                    <span className={styles.about}>TRAVEL</span>
                    <span className={styles.about}>OFFICERS</span>
                    <a href="https://iitg.ac.in/ccd/contact_us.html" target="_blank" rel="noopener noreferrer">
                        <span className={styles.about}>CONTACT</span>
                    </a>
                </nav>
                <Link to="/register" aria-label="Register your institute's delegate">
                    <span className={styles.registerCta}>
                        <span className={styles.register}>REGISTER</span>
                    </span>
                </Link>
            </div>
        </header>
    );
};

export default Header;
