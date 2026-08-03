import { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from '../App.module.css';
import Header from '../components/Header';
import DelegateRegistrationForm from '../components/DelegateRegistrationForm';
import CompanyRegistrationForm from '../components/CompanyRegistrationForm';
import { useDocumentMeta } from '../hooks/useDocumentMeta';

interface ToastState {
    message: string;
    type: 'info' | 'success' | 'error';
}

type Tab = 'delegate' | 'company';

const Register = () => {
    useDocumentMeta({
        path: '/register',
        title: 'Register | 49th AIPC Meet 2026',
        description: 'Register your IIT\'s delegate or your company for the 49th AIPC Meet, 4th September 2026 at IIT Guwahati.'
    });

    const [tab, setTab] = useState<Tab>('delegate');
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

            <main>
            <div className="w-full bg-[#101e24] px-6 md:px-[72px] py-10 md:py-14">
                <Link to="/" className="inline-flex items-center gap-2 text-[#c9d0d1] text-xs tracking-[0.1em] hover:text-white transition-colors mb-6">
                    <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                    BACK TO HOME
                </Link>
                <p className="text-[#8fa3ab] text-xs tracking-[0.2em] font-medium mb-3">REGISTRATION &middot; 49th AIPC MEET 2026</p>
                <h1 className="text-3xl md:text-4xl font-semibold text-white mb-3" style={{ fontFamily: "'Libre Caslon Text', serif" }}>
                    Register for the 49th AIPC Meet
                </h1>
                <p className="text-[#c9d0d1] max-w-[560px]">
                    We'll email a verification code to confirm your registration.
                </p>
            </div>

            <div className="w-full flex justify-center bg-[#f7f9fd] px-6 py-12 md:py-16">
                <div className="w-full max-w-[1000px] grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-start">

                    <div>
                        <div className="inline-flex p-1 mb-6 bg-[#e6e8ec] rounded-lg" role="tablist" aria-label="Registration type">
                            <button
                                type="button"
                                role="tab"
                                aria-selected={tab === 'delegate'}
                                onClick={() => setTab('delegate')}
                                className={`px-5 py-2 text-sm font-medium rounded-md transition-all ${tab === 'delegate' ? 'bg-white text-[#001e40] shadow-sm' : 'text-[#5c5f60] hover:text-[#001e40]'}`}
                            >
                                Institute Delegate
                            </button>
                            <button
                                type="button"
                                role="tab"
                                aria-selected={tab === 'company'}
                                onClick={() => setTab('company')}
                                className={`px-5 py-2 text-sm font-medium rounded-md transition-all ${tab === 'company' ? 'bg-white text-[#001e40] shadow-sm' : 'text-[#5c5f60] hover:text-[#001e40]'}`}
                            >
                                Company
                            </button>
                        </div>

                        {tab === 'delegate' ? (
                            <DelegateRegistrationForm showToast={showToast} />
                        ) : (
                            <CompanyRegistrationForm showToast={showToast} />
                        )}
                    </div>

                    <aside className="space-y-4">
                        <div className="bg-white p-6 border border-[#c3c6d1] rounded-lg">
                            <div className="flex items-center gap-3 mb-2">
                                <span className="material-symbols-outlined text-[#001e40]">event</span>
                                <h3 className="font-semibold text-[#001e40]">The 49th meet</h3>
                            </div>
                            <p className="text-sm text-[#5c5f60]">4th September 2026, hosted by IIT Guwahati.</p>
                        </div>
                        {tab === 'delegate' ? (
                            <div className="bg-white p-6 border border-[#c3c6d1] rounded-lg">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="material-symbols-outlined text-[#001e40]">group</span>
                                    <h3 className="font-semibold text-[#001e40]">One delegate per institute</h3>
                                </div>
                                <p className="text-sm text-[#5c5f60]">Normally the professor-in-charge of placement. Institutes already registered are greyed out in the form.</p>
                            </div>
                        ) : (
                            <div className="bg-white p-6 border border-[#c3c6d1] rounded-lg">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="material-symbols-outlined text-[#001e40]">domain</span>
                                    <h3 className="font-semibold text-[#001e40]">Brought by an institute</h3>
                                </div>
                                <p className="text-sm text-[#5c5f60]">Each IIT can bring multiple companies — just select which institute is bringing yours.</p>
                            </div>
                        )}
                        <div className="bg-white p-6 border border-[#c3c6d1] rounded-lg">
                            <div className="flex items-center gap-3 mb-2">
                                <span className="material-symbols-outlined text-[#001e40]">mail</span>
                                <h3 className="font-semibold text-[#001e40]">What happens next</h3>
                            </div>
                            <p className="text-sm text-[#5c5f60]">Once verified, we'll follow up by email with further details closer to the meet.</p>
                        </div>
                    </aside>
                </div>
            </div>
            </main>
        </div>
    );
};

export default Register;
