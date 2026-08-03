import React, { useEffect, useState } from 'react';
import { INSTITUTES } from '../institutes';
import { eventCompanyApi } from '../api';
import OtpInput from './OtpInput';

interface FormData {
    companyName: string;
    email: string;
    designation: string;
    institute: string;
    phoneNumber: string;
}

const EMPTY_FORM: FormData = { companyName: '', email: '', designation: '', institute: '', phoneNumber: '' };

interface Props {
    showToast: (message: string, type?: 'info' | 'success' | 'error') => void;
}

const CompanyRegistrationForm = ({ showToast }: Props) => {
    const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
    const [formData, setFormData] = useState<FormData>(EMPTY_FORM);
    const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [isCompleting, setIsCompleting] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(0);

    useEffect(() => {
        if (resendCooldown <= 0) return;
        const timer = setTimeout(() => setResendCooldown(c => c - 1), 1000);
        return () => clearTimeout(timer);
    }, [resendCooldown]);

    const handleDetailsSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!formData.companyName || !formData.email) {
            showToast('Please fill in all required fields.', 'error');
            return;
        }

        setIsSubmitting(true);
        try {
            await eventCompanyApi.register({ companyName: formData.companyName, email: formData.email });
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
            await eventCompanyApi.register({ companyName: formData.companyName, email: formData.email });
            showToast('A new verification code has been sent!', 'success');
            setResendCooldown(60);
        } catch (error: any) {
            showToast(error.message || 'Failed to resend code.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRegisterAnother = () => {
        setFormData(EMPTY_FORM);
        setOtp(['', '', '', '', '', '']);
        setStep(1);
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
            await eventCompanyApi.verifyOtp(formData.email, code);
            setStep(3);
        } catch (error: any) {
            showToast(error.message || 'Incorrect code.', 'error');
            setOtp(['', '', '', '', '', '']);
        } finally {
            setIsVerifying(false);
        }
    };

    const handleDetailsCompleteSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!formData.designation || !formData.institute || !formData.phoneNumber) {
            showToast('Please fill in all required fields.', 'error');
            return;
        }

        setIsCompleting(true);
        try {
            await eventCompanyApi.complete({
                email: formData.email,
                designation: formData.designation,
                institute: formData.institute,
                phoneNumber: formData.phoneNumber
            });
            setStep(4);
        } catch (error: any) {
            showToast(error.message || 'Could not complete registration.', 'error');
        } finally {
            setIsCompleting(false);
        }
    };

    const selectedInstitute = INSTITUTES.find(i => i.code === formData.institute);

    if (step === 4) {
        return (
            <div className="bg-white border border-[#c3c6d1] rounded-xl shadow-sm overflow-hidden animate-fadeIn">
                <div className="bg-[#f2f4f8] h-28 w-full flex items-end justify-center relative">
                    <div className="absolute -bottom-8 w-16 h-16 bg-white rounded-2xl shadow-md border border-[#c3c6d1] flex items-center justify-center">
                        <span className="material-symbols-outlined text-[32px] text-[#003366]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    </div>
                </div>
                <div className="pt-14 pb-10 px-6 sm:px-10 text-center">
                    <h2 className="text-2xl font-semibold text-[#001e40] mb-2">Thank you for showing interest</h2>
                    <p className="text-[#5c5f60] mb-6">
                        We'll let you know the further process if needed.
                    </p>
                    <button
                        type="button"
                        onClick={handleRegisterAnother}
                        className="inline-flex h-11 px-6 items-center justify-center gap-2 bg-[#001e40] text-white text-sm font-medium rounded hover:bg-[#003366] transition-all"
                    >
                        Register another
                    </button>
                </div>
            </div>
        );
    }

    if (step === 3) {
        return (
            <form onSubmit={handleDetailsCompleteSubmit} className="bg-white border border-[#c3c6d1] rounded-xl shadow-sm p-6 sm:p-10 space-y-6 animate-fadeIn">
                <div>
                    <h2 className="text-xl font-semibold text-[#001e40] mb-1">A few more details</h2>
                    <p className="text-sm text-[#5c5f60]">Just to complete your registration.</p>
                </div>

                <div className="space-y-2">
                    <label htmlFor="designation" className="block text-sm font-medium text-[#43474f]">Designation</label>
                    <input
                        type="text"
                        id="designation"
                        value={formData.designation}
                        onChange={e => setFormData({ ...formData, designation: e.target.value })}
                        disabled={isCompleting}
                        className="w-full px-4 py-3 border border-[#c3c6d1] rounded focus:border-[#001e40] focus:ring-1 focus:ring-[#001e40] outline-none disabled:bg-gray-100"
                        placeholder="e.g., HR Manager"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="companyInstitute" className="block text-sm font-medium text-[#43474f]">Name of the IIT invited you</label>
                    <div className="relative">
                        <select
                            id="companyInstitute"
                            value={formData.institute}
                            onChange={e => setFormData({ ...formData, institute: e.target.value })}
                            disabled={isCompleting}
                            required
                            className="w-full appearance-none px-4 py-3 pr-10 border border-[#c3c6d1] rounded focus:border-[#001e40] focus:ring-1 focus:ring-[#001e40] outline-none bg-white text-[#191c1f] disabled:bg-gray-100"
                        >
                            <option value="" disabled>Select the IIT</option>
                            {INSTITUTES.map(institute => (
                                <option key={institute.code} value={institute.code}>{institute.name}</option>
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

                <div className="space-y-2">
                    <label htmlFor="companyPhone" className="block text-sm font-medium text-[#43474f]">Phone number</label>
                    <input
                        type="tel"
                        id="companyPhone"
                        value={formData.phoneNumber}
                        onChange={e => setFormData({ ...formData, phoneNumber: e.target.value })}
                        disabled={isCompleting}
                        className="w-full px-4 py-3 border border-[#c3c6d1] rounded focus:border-[#001e40] focus:ring-1 focus:ring-[#001e40] outline-none disabled:bg-gray-100"
                        placeholder="+91 98765 43210"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={isCompleting}
                    className="w-full h-12 flex items-center justify-center gap-2 bg-[#001e40] text-white text-sm font-medium rounded hover:bg-[#003366] transition-all cursor-pointer disabled:bg-[#001e40]/50 disabled:cursor-not-allowed"
                >
                    {isCompleting ? (
                        <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                    ) : (
                        <>
                            <span>Complete registration</span>
                            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                        </>
                    )}
                </button>
            </form>
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
                    ) : 'Verify email'}
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
                <h2 className="text-xl font-semibold text-[#001e40] mb-1">One Time registration</h2>
            </div>

            <div className="space-y-2">
                <label htmlFor="companyName" className="block text-sm font-medium text-[#43474f]">Company name</label>
                <input
                    type="text"
                    id="companyName"
                    value={formData.companyName}
                    onChange={e => setFormData({ ...formData, companyName: e.target.value })}
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 border border-[#c3c6d1] rounded focus:border-[#001e40] focus:ring-1 focus:ring-[#001e40] outline-none disabled:bg-gray-100"
                    placeholder="e.g., Acme Corp"
                    required
                />
            </div>

            <div className="space-y-2">
                <label htmlFor="companyEmail" className="block text-sm font-medium text-[#43474f]">Your email</label>
                <input
                    type="email"
                    id="companyEmail"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 border border-[#c3c6d1] rounded focus:border-[#001e40] focus:ring-1 focus:ring-[#001e40] outline-none disabled:bg-gray-100"
                    placeholder="hr@acmecorp.com"
                    required
                />
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

export default CompanyRegistrationForm;
