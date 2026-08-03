import { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from '../App.module.css';
import ContactModal from './ContactModal';

const Header = () => {
    const [isContactOpen, setIsContactOpen] = useState(false);

    return (
        <header className={`${styles.masthead} relative z-20`}>
            <Link to="/" className="flex flex-col leading-snug py-2" style={{ textDecoration: 'none', color: 'inherit' }}>
                <span className="font-display text-2xl md:text-3xl font-bold text-white">
                    49<sup>TH</sup> All IITs Placement Committee (AIPC) Meet 2026
                </span>
                <span className="text-sm text-[#c9d0d1] mt-1">Industry conclave &middot; 4th September 2026</span>
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
