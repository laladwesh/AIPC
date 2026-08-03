import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { INSTITUTES } from '../institutes';
import { delegateApi } from '../api';
import OtpInput from './OtpInput';

interface FormData {
    name: string;
    designation: string;
    institute: string;
    email: string;
    contactNumber: string;
}

const EMPTY_FORM: FormData = { name: '', designation: '', institute: '', email: '', contactNumber: '' };

interface Props {
    showToast: (message: string, type?: 'info' | 'success' | 'error') => void;
}

const DelegateRegistrationForm = ({ showToast }: Props) => {
    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [formData, setFormData] = useState<FormData>(EMPTY_FORM);
    const [registeredInstitutes, setRegisteredInstitutes] = useState<string[]>([]);
    const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(0);

    useEffect(() => {
        delegateApi.getRegisteredInstitutes()
            .then(setRegisteredInstitutes)
            .catch(() => { /* dropdown still works without this; just won't grey out taken institutes */ });
    }, []);

    useEffect(() => {
        if (resendCooldown <= 0) return;
        const timer = setTimeout(() => setResendCooldown(c => c - 1), 1000);
        return () => clearTimeout(timer);
    }, [resendCooldown]);

    const handleDetailsSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!formData.name || !formData.institute || !formData.email || !formData.contactNumber) {
            showToast('Please fill in all required fields.', 'error');
            return;
        }

        setIsSubmitting(true);
        try {
            await delegateApi.register(formData);
            showToast(`Code sent to ${formData.email}`, 'success');
            setStep(2);
            setResendCooldown(60);
        } catch (error: any) {
            showToast(error.message || 'An error occurred connecting to the server.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleResendOtp = async () => {
        if (resendCooldown > 0 || isSubmitting) return;
        setIsSubmitting(true);
        try {
            await delegateApi.register(formData);
            showToast('A new verification code has been sent!', 'success');
            setResendCooldown(60);
        } catch (error: any) {
            showToast(error.message || 'Failed to resend code.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleOtpSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const code = otp.join('');
        if (code.length < 6) {
            showToast('Please enter all 6 digits.', 'error');
            return;
        }

        setIsVerifying(true);
        try {
            await delegateApi.verifyOtp(formData.email, code);
            setStep(3);
        } catch (error: any) {
            showToast(error.message || 'Incorrect code.', 'error');
            setOtp(['', '', '', '', '', '']);
        } finally {
            setIsVerifying(false);
        }
    };

    const selectedInstitute = INSTITUTES.find(i => i.code === formData.institute);

    if (step === 3) {
        return (
            <div className="bg-white border border-[#c3c6d1] rounded-xl shadow-sm overflow-hidden animate-fadeIn">
                <div className="bg-[#f2f4f8] h-28 w-full flex items-end justify-center relative">
                    <div className="absolute -bottom-8 w-16 h-16 bg-white rounded-2xl shadow-md border border-[#c3c6d1] flex items-center justify-center">
                        <span className="material-symbols-outlined text-[32px] text-[#003366]" style={{ fontVariationSettings: "'FILL' 1" }}>pending_actions</span>
                    </div>
                </div>
                <div className="pt-14 pb-10 px-6 sm:px-10 text-center">
                    <h2 className="text-2xl font-semibold text-[#001e40] mb-2">Registration request received</h2>
                    <p className="text-[#5c5f60] mb-6">
                        Your request for {formData.name} to represent{' '}
                        <strong className="text-[#001e40]">{selectedInstitute?.name}</strong> is pending approval. Further details will be communicated to <strong className="text-[#001e40]">{formData.email}</strong> closer to the meet.
                    </p>
                    <Link
                        to="/"
                        className="inline-flex h-11 px-6 items-center justify-center gap-2 bg-[#001e40] text-white text-sm font-medium rounded hover:bg-[#003366] transition-all"
                    >
                        Back to home
                    </Link>
                </div>
            </div>
        );
    }

    if (step === 2) {
        return (
            <form onSubmit={handleOtpSubmit} className="bg-white border border-[#c3c6d1] rounded-xl shadow-sm p-6 sm:p-10 text-center animate-fadeIn">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-[#d5e3ff] rounded-2xl mb-6">
                    <span className="material-symbols-outlined text-[#001e40] text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>mark_email_read</span>
                </div>
                <h2 className="text-2xl font-semibold text-[#001e40] mb-2">Verify your email</h2>
                <p className="text-[#5c5f60] mb-8">We've sent a 6-digit verification code to <strong className="text-[#001e40]">{formData.email}</strong>.</p>

                <div className="mb-8">
                    <OtpInput value={otp} onChange={setOtp} disabled={isVerifying} />
                </div>

                <button
                    type="submit"
                    disabled={isVerifying}
                    className="w-full h-12 flex items-center justify-center gap-2 bg-[#001e40] text-white text-sm font-medium rounded hover:bg-[#003366] transition-all cursor-pointer disabled:bg-[#001e40]/50 disabled:cursor-not-allowed mb-4"
                >
                    {isVerifying ? (
                        <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                    ) : 'Verify & submit request'}
                </button>
                <div className="mb-2">
                    <button
                        type="button"
                        disabled={resendCooldown > 0 || isSubmitting}
                        onClick={handleResendOtp}
                        className={`text-sm font-medium transition-colors focus:outline-none ${resendCooldown > 0 || isSubmitting ? 'text-[#5c5f60] cursor-not-allowed' : 'text-[#003366] hover:text-[#001e40] cursor-pointer'}`}
                    >
                        {isSubmitting ? 'Sending...' : resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : 'Resend code'}
                    </button>
                </div>
                <button type="button" onClick={() => setStep(1)} disabled={isVerifying} className="text-xs text-[#5c5f60] hover:underline disabled:opacity-50">
                    &larr; Back to details
                </button>
            </form>
        );
    }

    return (
        <form onSubmit={handleDetailsSubmit} className="bg-white border border-[#c3c6d1] rounded-xl shadow-sm p-6 sm:p-10 space-y-6 animate-fadeIn">
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
                        <span>Send verification code</span>
                        <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                    </>
                )}
            </button>
        </form>
    );
};

export default DelegateRegistrationForm;
