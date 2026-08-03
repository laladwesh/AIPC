import { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from '../App.module.css';
import Header from '../components/Header';
import CompanyRegistrationForm from '../components/CompanyRegistrationForm';
import InstituteCarousel from '../components/InstituteCarousel';
import { useDocumentMeta } from '../hooks/useDocumentMeta';

interface ToastState {
    message: string;
    type: 'info' | 'success' | 'error';
}

const Register = () => {
    useDocumentMeta({
        path: '/register',
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
                <Link to="/" className="inline-flex items-center gap-2 text-[#c9d0d1] text-xs tracking-[0.1em] hover:text-white transition-colors mb-4">
                    <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                    BACK TO HOME
                </Link>
                <p className="text-[#8fa3ab] text-xs tracking-[0.2em] font-medium mb-2">REGISTRATION &middot; 49th AIPC MEET 2026</p>
                <h1 className="font-display text-2xl md:text-3xl font-bold text-white mb-2">
                    Register your company
                </h1>
                <p className="text-[#c9d0d1] max-w-[480px] text-sm">
                    Enter your company details and the IIT bringing you. We'll email a verification code to confirm.
                </p>
            </div>

            <div className="w-full flex flex-col lg:flex-row">
                <main className="w-full lg:w-[58%] bg-[#f7f9fd] px-6 md:px-[56px] py-12 md:py-16">
                    <div className="grid grid-cols-1 sm:grid-cols-[1fr_260px] gap-6">
                        <CompanyRegistrationForm showToast={showToast} />

                        <aside className="space-y-4">
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
                        </aside>
                    </div>
                </main>

                <div className="hidden lg:block lg:w-[42%]">
                    <InstituteCarousel />
                </div>
            </div>
        </div>
    );
};

export default Register;
