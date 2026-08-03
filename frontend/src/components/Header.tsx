import { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from '../App.module.css';
import ContactModal from './ContactModal';

const Header = () => {
    const [isContactOpen, setIsContactOpen] = useState(false);

    return (
        <header className={`${styles.masthead} relative z-20`}>
            <Link to="/" className="flex items-center gap-3" style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="flex flex-col items-center gap-1">
                    <img
                        src={`${import.meta.env.BASE_URL}iitg.png`}
                        alt="IIT Guwahati"
                        className="h-10 w-10 object-contain flex-shrink-0"
                    />
                    <span className="text-[10px] tracking-[0.15em] text-[#8fa3ab] font-medium whitespace-nowrap">
                        HOSTED AT IIT GUWAHATI
                    </span>
                </div>
                <span className="w-px h-9 bg-[#8fa3ab]/40 flex-shrink-0" />
                <div className="flex flex-col leading-tight">
                    <span className={styles.aipc49}>INDUSTRY CONCLAVE @ 49<sup>TH</sup> ALL IITs PLACEMENT COMMITTEE Meeting 2026</span>
                    <span className="text-[10px] tracking-[0.15em] text-[#8fa3ab] font-medium"></span>
                </div>
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
