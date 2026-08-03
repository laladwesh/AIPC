import { Link } from 'react-router-dom';
import styles from '../App.module.css';

const Header = () => {
    return (
        <div className={styles.masthead}>
            <Link to="/" className={styles.aipc49} style={{ textDecoration: 'none', color: 'inherit' }}>
                ALL IITs PLACEMENT COMMITTEE
            </Link>
            <div className={styles.navCta}>
                <div className={styles.nav}>
                    <div className={styles.about}>ABOUT</div>
                    <div className={styles.about}>PROGRAMME</div>
                    <div className={styles.about}>TRAVEL</div>
                    <div className={styles.about}>OFFICERS</div>
                    <a href="https://iitg.ac.in/ccd/contact_us.html" target="_blank" rel="noopener noreferrer">
                        <div className={styles.about}>CONTACT</div>
                    </a>
                </div>
                <Link to="/register">
                    <div className={styles.registerCta}>
                        <div className={styles.register}>REGISTER</div>
                    </div>
                </Link>
            </div>
        </div>
    );
};

export default Header;
