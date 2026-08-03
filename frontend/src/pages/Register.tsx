import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from '../App.module.css';
import Header from '../components/Header';
import { INSTITUTES } from '../institutes';
import { delegateApi } from '../api';

interface ToastState {
    message: string;
    type: 'info' | 'success' | 'error';
}

interface FormData {
    name: string;
    designation: string;
    institute: string;
    email: string;
    contactNumber: string;
}

const EMPTY_FORM: FormData = { name: '', designation: '', institute: '', email: '', contactNumber: '' };

const Register = () => {
    const [formData, setFormData] = useState<FormData>(EMPTY_FORM);
    const [registeredInstitutes, setRegisteredInstitutes] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [toast, setToast] = useState<ToastState | null>(null);
    const [confirmed, setConfirmed] = useState<FormData | null>(null);

    useEffect(() => {
        delegateApi.getRegisteredInstitutes()
            .then(setRegisteredInstitutes)
            .catch(() => { /* dropdown still works without this; just won't grey out taken institutes */ });
    }, []);

    const showToast = (message: string, type: ToastState['type'] = 'info') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 4000);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!formData.name || !formData.institute || !formData.email || !formData.contactNumber) {
            showToast('Please fill in all required fields.', 'error');
            return;
        }

        setIsSubmitting(true);
        try {
            await delegateApi.register(formData);
            setConfirmed(formData);
        } catch (error: any) {
            showToast(error.message || 'An error occurred connecting to the server.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const selectedInstitute = INSTITUTES.find(i => i.code === formData.institute);

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

            <div className="w-full bg-[#101e24] px-6 md:px-[72px] py-10 md:py-14">
                <Link to="/" className="inline-flex items-center gap-2 text-[#c9d0d1] text-xs tracking-[0.1em] hover:text-white transition-colors mb-6">
                    <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                    BACK TO HOME
                </Link>
                <div className="text-[#8fa3ab] text-xs tracking-[0.2em] font-medium mb-3">REGISTRATION &middot; 49th AIPC MEET 2026</div>
                <h1 className="text-3xl md:text-4xl font-semibold text-white mb-3" style={{ fontFamily: "'Libre Caslon Text', serif" }}>
                    Register your institute's delegate
                </h1>
                <p className="text-[#c9d0d1] max-w-[560px]">
                    One delegate per institute — normally the professor-in-charge of placement. Select your IIT below and we'll email your confirmation and joining instructions.
                </p>
            </div>

            <div className="w-full flex justify-center bg-[#f7f9fd] px-6 py-12 md:py-16">
                <div className="w-full max-w-[1000px] grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-start">

                    {confirmed ? (
                        <div className="bg-white border border-[#c3c6d1] rounded-xl shadow-sm overflow-hidden animate-fadeIn">
                            <div className="bg-[#f2f4f8] h-28 w-full flex items-end justify-center relative">
                                <div className="absolute -bottom-8 w-16 h-16 bg-white rounded-2xl shadow-md border border-[#c3c6d1] flex items-center justify-center">
                                    <span className="material-symbols-outlined text-[32px] text-[#003366]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                                </div>
                            </div>
                            <div className="pt-14 pb-10 px-6 sm:px-10 text-center">
                                <h2 className="text-2xl font-semibold text-[#001e40] mb-2">You're registered</h2>
                                <p className="text-[#5c5f60] mb-6">
                                    {confirmed.name} will represent{' '}
                                    <strong className="text-[#001e40]">{INSTITUTES.find(i => i.code === confirmed.institute)?.name}</strong> at the 49th AIPC Meet. A confirmation has been sent to <strong className="text-[#001e40]">{confirmed.email}</strong>.
                                </p>
                                <Link
                                    to="/"
                                    className="inline-flex h-11 px-6 items-center justify-center gap-2 bg-[#001e40] text-white text-sm font-medium rounded hover:bg-[#003366] transition-all"
                                >
                                    Back to home
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="bg-white border border-[#c3c6d1] rounded-xl shadow-sm p-6 sm:p-10 space-y-6 animate-fadeIn">
                            <div>
                                <h2 className="text-xl font-semibold text-[#001e40] mb-1">Delegate details</h2>
                                <p className="text-sm text-[#5c5f60]">All fields are required unless marked optional.</p>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="institute" className="block text-sm font-medium text-[#43474f]">Registering on behalf of</label>
                                <div className="relative">
                                    <select
                                        id="institute"
                                        value={formData.institute}
                                        onChange={e => setFormData({ ...formData, institute: e.target.value })}
                                        disabled={isSubmitting}
                                        required
                                        className="w-full appearance-none px-4 py-3 pr-10 border border-[#c3c6d1] rounded focus:border-[#001e40] focus:ring-1 focus:ring-[#001e40] outline-none bg-white text-[#191c1f] disabled:bg-gray-100"
                                    >
                                        <option value="" disabled>Select your IIT</option>
                                        {INSTITUTES.map(institute => (
                                            <option
                                                key={institute.code}
                                                value={institute.code}
                                                disabled={registeredInstitutes.includes(institute.code)}
                                            >
                                                {institute.name}{registeredInstitutes.includes(institute.code) ? ' — already registered' : ''}
                                            </option>
                                        ))}
                                    </select>
                                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[#5c5f60] pointer-events-none">expand_more</span>
                                </div>
                                {selectedInstitute && (
                                    <div className="flex items-center gap-2 pt-1">
                                        <img src={selectedInstitute.logo} alt="" className="w-5 h-5 object-contain" />
                                        <span className="text-xs text-[#5c5f60]">{selectedInstitute.name}</span>
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label htmlFor="name" className="block text-sm font-medium text-[#43474f]">Full name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        disabled={isSubmitting}
                                        className="w-full px-4 py-3 border border-[#c3c6d1] rounded focus:border-[#001e40] focus:ring-1 focus:ring-[#001e40] outline-none disabled:bg-gray-100"
                                        placeholder="Dr. A. Sharma"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="designation" className="block text-sm font-medium text-[#43474f]">Designation <span className="text-[#5c5f60] font-normal">(optional)</span></label>
                                    <input
                                        type="text"
                                        id="designation"
                                        value={formData.designation}
                                        onChange={e => setFormData({ ...formData, designation: e.target.value })}
                                        disabled={isSubmitting}
                                        className="w-full px-4 py-3 border border-[#c3c6d1] rounded focus:border-[#001e40] focus:ring-1 focus:ring-[#001e40] outline-none disabled:bg-gray-100"
                                        placeholder="Professor-in-charge, Placement"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label htmlFor="email" className="block text-sm font-medium text-[#43474f]">Institute email</label>
                                    <input
                                        type="email"
                                        id="email"
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        disabled={isSubmitting}
                                        className="w-full px-4 py-3 border border-[#c3c6d1] rounded focus:border-[#001e40] focus:ring-1 focus:ring-[#001e40] outline-none disabled:bg-gray-100"
                                        placeholder="placement@iit____.ac.in"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="contactNumber" className="block text-sm font-medium text-[#43474f]">Contact number</label>
                                    <input
                                        type="tel"
                                        id="contactNumber"
                                        value={formData.contactNumber}
                                        onChange={e => setFormData({ ...formData, contactNumber: e.target.value })}
                                        disabled={isSubmitting}
                                        className="w-full px-4 py-3 border border-[#c3c6d1] rounded focus:border-[#001e40] focus:ring-1 focus:ring-[#001e40] outline-none disabled:bg-gray-100"
                                        placeholder="+91 98765 43210"
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full h-12 mt-2 flex items-center justify-center gap-2 bg-[#001e40] text-white text-sm font-medium rounded hover:bg-[#003366] transition-all cursor-pointer disabled:bg-[#001e40]/50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? (
                                    <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                                ) : (
                                    <>
                                        <span>Confirm registration</span>
                                        <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                                    </>
                                )}
                            </button>
                        </form>
                    )}

                    <aside className="space-y-4">
                        <div className="bg-white p-6 border border-[#c3c6d1] rounded-lg">
                            <div className="flex items-center gap-3 mb-2">
                                <span className="material-symbols-outlined text-[#001e40]">event</span>
                                <h3 className="font-semibold text-[#001e40]">The 49th meet</h3>
                            </div>
                            <p className="text-sm text-[#5c5f60]">4th September 2026, hosted by IIT Guwahati.</p>
                        </div>
                        <div className="bg-white p-6 border border-[#c3c6d1] rounded-lg">
                            <div className="flex items-center gap-3 mb-2">
                                <span className="material-symbols-outlined text-[#001e40]">group</span>
                                <h3 className="font-semibold text-[#001e40]">One delegate per institute</h3>
                            </div>
                            <p className="text-sm text-[#5c5f60]">Normally the professor-in-charge of placement. Institutes already registered are greyed out above.</p>
                        </div>
                        <div className="bg-white p-6 border border-[#c3c6d1] rounded-lg">
                            <div className="flex items-center gap-3 mb-2">
                                <span className="material-symbols-outlined text-[#001e40]">mail</span>
                                <h3 className="font-semibold text-[#001e40]">What happens next</h3>
                            </div>
                            <p className="text-sm text-[#5c5f60]">We'll email your confirmation along with room and airport transfer details before the meet.</p>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default Register;
