import { Link } from 'react-router-dom';
import styles from '../App.module.css';

const Header = () => {
    return (
        <header className={`${styles.masthead} relative z-20`}>
            <Link to="/" className="flex items-center gap-3" style={{ textDecoration: 'none', color: 'inherit' }}>
                <img
                    src={`${import.meta.env.BASE_URL}iitg.png`}
                    alt="IIT Guwahati"
                    className="h-10 w-10 object-contain flex-shrink-0"
                />
                <span className="text-[10px] tracking-[0.15em] text-[#8fa3ab] font-medium">
                    ORGANISING IIT
                </span>
                <span className="w-px h-9 bg-[#8fa3ab]/40 flex-shrink-0" />
                <span className={styles.aipc49}>49TH ALL IITs PLACEMENT COMMITTEE</span>
            </Link>
            <div className={styles.navCta}>
                <nav className={styles.nav} aria-label="Primary">
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
