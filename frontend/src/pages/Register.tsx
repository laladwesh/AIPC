import { useState } from 'react';
import styles from '../App.module.css';
import Header from '../components/Header';
import CompanyRegistrationForm from '../components/CompanyRegistrationForm';
import InstituteCarousel from '../components/InstituteCarousel';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { INSTITUTES } from '../institutes';

interface ToastState {
    message: string;
    type: 'info' | 'success' | 'error';
}

const Register = () => {
    useDocumentMeta({
        path: '/',
        title: 'Register Your Company | 49th AIPC Meet 2026',
        description: "Register your company for the 49th AIPC Meet, 4th September 2026 at IIT Guwahati. Enter your company details and the IIT bringing you, verify by email, and you're done."
    });

    const [toast, setToast] = useState<ToastState | null>(null);

    const showToast = (message: string, type: ToastState['type'] = 'info') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 4000);
    };

    return (
        <div className={styles.app}>
            <Header />

            {toast && (
                <div className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 text-sm text-white transition-opacity duration-300 ${
                    toast.type === 'error' ? 'bg-red-800' : toast.type === 'success' ? 'bg-emerald-800' : 'bg-[#001e40]'
                }`}>
                    <span className="material-symbols-outlined text-[20px]">
                        {toast.type === 'error' ? 'error' : toast.type === 'success' ? 'check_circle' : 'info'}
                    </span>
                    <span>{toast.message}</span>
                </div>
            )}

            <div className="w-full bg-[#101e24] px-6 md:px-[56px] py-6 md:py-8">
                {/* <p className="text-[#8fa3ab] text-xs tracking-[0.2em] font-medium mb-2">REGISTRATION &middot; 49th AIPC MEET 2026</p> */}
                <h1 className="font-display text-2xl md:text-3xl font-bold text-white mb-2">
                    Register your company
                </h1>
                <p className="text-[#c9d0d1] max-w-[480px] text-sm">
                    Enter your company details and the IIT bringing you. We'll email a verification code to confirm.
                </p>
            </div>

            <section className={styles.membershipBand} aria-labelledby="members-title">
                <h2 id="members-title" className={styles.the23Member}>THE 23 MEMBER INSTITUTES</h2>
                <div className={styles.emblemGrid}>
                    {INSTITUTES.map((institute, index) => (
                        <a
                            key={institute.code}
                            href={institute.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.iitBhilai}
                        >
                            <img
                                src={institute.logo}
                                alt={institute.name}
                                title={institute.shortName}
                                className={styles.emblemRingIcon}
                                width={84}
                                height={84}
                                loading={index < 8 ? 'eager' : 'lazy'}
                            />
                        </a>
                    ))}
                </div>
            </section>

            <div className="w-full flex flex-col lg:flex-row">
                <main className="w-full lg:w-[60%] bg-[#f7f9fd] px-6 md:px-[56px] py-12 md:py-16">
                    <div className="grid grid-cols-1 sm:grid-cols-[1fr_260px] gap-6">
                        <div>
                            <h2 className="font-display text-xl md:text-2xl font-bold text-[#001e40] mb-2">Registration Form</h2>
                            <p className="flex items-start gap-2 text-sm text-[#5c5f60] bg-[#fff8e1] border border-[#e6d9a6] rounded-lg px-4 py-3 mb-4">
                                <span className="material-symbols-outlined text-[18px] text-[#9c7a00]">info</span>
                                <span>This registration is only for companies that have been invited by a participating IIT. Please register only if an IIT has invited you.</span>
                            </p>
                            <CompanyRegistrationForm showToast={showToast} />
                        </div>

                        {/* <aside className="space-y-4">
                            <div className="bg-white p-5 border border-[#c3c6d1] rounded-lg">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="material-symbols-outlined text-[#001e40]">event</span>
                                    <h3 className="font-semibold text-[#001e40]">The 49th meet</h3>
                                </div>
                                <p className="text-sm text-[#5c5f60]">4th September 2026, hosted by IIT Guwahati.</p>
                            </div>
                            <div className="bg-white p-5 border border-[#c3c6d1] rounded-lg">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="material-symbols-outlined text-[#001e40]">domain</span>
                                    <h3 className="font-semibold text-[#001e40]">Brought by an institute</h3>
                                </div>
                                <p className="text-sm text-[#5c5f60]">Each IIT can bring multiple companies — just select which institute is bringing yours.</p>
                            </div>
                            <div className="bg-white p-5 border border-[#c3c6d1] rounded-lg">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="material-symbols-outlined text-[#001e40]">mail</span>
                                    <h3 className="font-semibold text-[#001e40]">What happens next</h3>
                                </div>
                                <p className="text-sm text-[#5c5f60]">Once verified, we'll follow up by email with further details closer to the meet.</p>
                            </div>
                        </aside> */}
                    </div>
                </main>

                <div className="hidden lg:block lg:w-[40%]">
                    <InstituteCarousel />
                </div>
            </div>
        </div>
    );
};

export default Register;
