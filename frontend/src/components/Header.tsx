import { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from '../App.module.css';
import ContactModal from './ContactModal';

const Header = () => {
    const [isContactOpen, setIsContactOpen] = useState(false);

    return (
        <header className={`${styles.masthead} relative z-20`}>
            <Link to="/" className={styles.aipc49} style={{ textDecoration: 'none', color: 'inherit' }}>
                INDUSTRY CONCLAVE @ 49<sup>TH</sup> ALL IITs PLACEMENT COMMITTEE Meeting 2026
            </Link>
            <div className={styles.navCta}>
                <nav className={styles.nav} aria-label="Primary">
                    <button type="button" onClick={() => setIsContactOpen(true)}>
                        <span className={styles.about}>CONTACT</span>
                    </button>
                </nav>
            </div>

            {isContactOpen && <ContactModal onClose={() => setIsContactOpen(false)} />}
        </header>
    );
};

export default Header;
