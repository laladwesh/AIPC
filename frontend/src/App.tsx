import React, { useState, useRef, useEffect } from 'react';
import styles from './App.module.css';

interface ToastState {
    message: string;
    type: 'info' | 'success' | 'error' | string;
}

// --- API Service ---
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? (
    typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
        ? 'http://localhost:5000/api/v1'
        : '/api/v1'
);

const api = {
    registerCompany: async (data: { companyName: string; email: string; contactNumber: string }) => {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include', // Crucial for secure HttpOnly cookie handling
            body: JSON.stringify(data)
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(result.error || result.message || 'Registration failed.');
        return result;
    },
    requestLoginOtp: async (email: string) => {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ email })
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(result.error || result.message || 'Login request failed.');
        return result;
    },
    verifyOtp: async (email: string, otp: string) => {
        const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ email, otp })
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(result.error || result.message || 'Verification failed. Please check your code.');
        return result;
    }
};

const RegistrationWidget = () => {
    const [step, setStep] = useState<number>(1);
    const [isLoginMode] = useState<boolean>(false);
    const [formData, setFormData] = useState({ companyName: '', email: '', contactNumber: '' });
    const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
    
    // Security / Loading States
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [isVerifying, setIsVerifying] = useState<boolean>(false);
    const [resendCooldown, setResendCooldown] = useState<number>(0);
    const [toast, setToast] = useState<ToastState | null>(null);
    const [companyStatus, setCompanyStatus] = useState<string>('PENDING_APPROVAL');
    
    // Explicitly typed ref array for the HTML Input Elements
    const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

    // Inject required fonts for the widget if they don't exist
    useEffect(() => {
        if (!document.getElementById('aipc-fonts')) {
            const fonts = document.createElement('link');
            fonts.id = 'aipc-fonts';
            fonts.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap';
            fonts.rel = 'stylesheet';
            document.head.appendChild(fonts);
        }
    }, []);

    // Cooldown timer for OTP Resend
    useEffect(() => {
        let timer: ReturnType<typeof setTimeout>;
        if (resendCooldown > 0) {
            timer = setTimeout(() => setResendCooldown(c => c - 1), 1000);
        }
        return () => clearTimeout(timer);
    }, [resendCooldown]);

    const showToast = (message: string, type: 'info' | 'success' | 'error' = 'info') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 4000);
    };

    const handleContactSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if (!isLoginMode && (!formData.companyName || !formData.contactNumber)) {
            showToast('Please fill in all fields.', 'error');
            return;
        }
        if (!formData.email) {
            showToast('Email is required.', 'error');
            return;
        }

        setIsSubmitting(true);
        try {
            if (isLoginMode) {
                await api.requestLoginOtp(formData.email);
            } else {
                await api.registerCompany(formData);
            }
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
            if (isLoginMode) {
                await api.requestLoginOtp(formData.email);
            } else {
                await api.registerCompany(formData);
            }
            showToast('A new verification code has been sent!', 'success');
            setResendCooldown(60);
        } catch (error: any) {
            showToast(error.message || 'Failed to resend code.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleOtpChange = (index: number, value: string) => {
        const val = value.replace(/[^0-9]/g, ''); // Strict sanitization
        const newOtp = [...otp];
        newOtp[index] = val;
        setOtp(newOtp);

        if (val && index < 5) {
            otpRefs.current[index + 1]?.focus();
        }
    };

    const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            otpRefs.current[index - 1]?.focus();
        } else if (e.key === 'ArrowLeft' && index > 0) {
            otpRefs.current[index - 1]?.focus();
        } else if (e.key === 'ArrowRight' && index < 5) {
            otpRefs.current[index + 1]?.focus();
        }
    };

    const handleOtpPaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
        e.preventDefault();
        const pasteData = e.clipboardData.getData('text').replace(/\D/g, '').split('');
        if (pasteData.length > 0) {
            const newOtp = [...otp];
            pasteData.forEach((char, i) => {
                if (i < 6) newOtp[i] = char;
            });
            setOtp(newOtp);
            otpRefs.current[Math.min(pasteData.length - 1, 5)]?.focus();
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
            const result = await api.verifyOtp(formData.email, code);
            
            if (result.company && result.company.status) {
                setCompanyStatus(result.company.status);
            }

            showToast('Verification successful!', 'success');
            setTimeout(() => {
                setStep(3);
                setIsVerifying(false);
            }, 800);
        } catch (error: any) {
            showToast(error.message || 'Incorrect code.', 'error');
            setOtp(['', '', '', '', '', '']); // Clear invalid OTP
            otpRefs.current[0]?.focus();
            setIsVerifying(false);
        }
    };

    return (
        <div className="w-full text-[#191c1f] font-sans bg-[#f7f9fd] relative rounded-xl border border-[#c3c6d1] overflow-hidden my-8" style={{ fontFamily: "'Inter', sans-serif" }}>
            
            {/* Toast Notification */}
            {toast && (
                <div className={`absolute top-5 right-5 z-50 px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 text-sm text-white transition-opacity duration-300 ${
                    toast.type === 'error' ? 'bg-red-800' : toast.type === 'success' ? 'bg-emerald-800' : 'bg-[#001e40]'
                }`}>
                    <span className="material-symbols-outlined text-[20px]">
                        {toast.type === 'error' ? 'error' : toast.type === 'success' ? 'check_circle' : 'info'}
                    </span>
                    <span>{toast.message}</span>
                </div>
            )}

            <main className="flex flex-col items-center justify-center p-6 md:p-[48px] min-h-[500px]">
                
                {/* VIEW 1: CONTACT INFO */}
                {step === 1 && (
                    <section className="w-full max-w-[640px] flex flex-col animate-fadeIn">
                        <div className="w-full bg-[#ffffff] border border-[#c3c6d1] rounded-lg shadow-sm p-6 sm:p-10">
                            <div className="mb-8 text-left">
                                <h2 className="text-2xl sm:text-3xl font-semibold text-[#001e40] mb-2">
                                    {isLoginMode ? 'Log In to AIPC' : 'Create Company Profile'}
                                </h2>
                                <p className="text-[#5c5f60] text-sm sm:text-base">
                                    {isLoginMode 
                                        ? 'Enter your corporate email to receive a login verification code.'
                                        : 'Enter your primary corporate contact details to establish your profile.'}
                                </p>
                            </div>
                            
                            <form onSubmit={handleContactSubmit} className="space-y-6">
                                {!isLoginMode && (
                                    <div className="space-y-2">
                                        <label htmlFor="companyName" className="block text-sm font-medium text-[#43474f]">Company Name</label>
                                        <input 
                                            type="text" 
                                            id="companyName"
                                            value={formData.companyName}
                                            onChange={e => setFormData({...formData, companyName: e.target.value})}
                                            disabled={isSubmitting}
                                            className="w-full px-4 py-3 border border-[#c3c6d1] rounded focus:border-[#001e40] focus:ring-1 focus:ring-[#001e40] outline-none disabled:bg-gray-100 disabled:text-gray-500" 
                                            placeholder="e.g., Acme Corp" 
                                            required={!isLoginMode}
                                        />
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <label htmlFor="email" className="block text-sm font-medium text-[#43474f]">Corporate Email</label>
                                    <input 
                                        type="email" 
                                        id="email"
                                        value={formData.email}
                                        onChange={e => setFormData({...formData, email: e.target.value})}
                                        disabled={isSubmitting}
                                        className="w-full px-4 py-3 border border-[#c3c6d1] rounded focus:border-[#001e40] focus:ring-1 focus:ring-[#001e40] outline-none disabled:bg-gray-100 disabled:text-gray-500" 
                                        placeholder="hr@acmecorp.com" 
                                        required 
                                    />
                                    {/* <div className="flex justify-between items-center pt-1 text-xs">
                                        <span className="text-[#5c5f60]">{isLoginMode ? 'Need to create an account?' : 'New to AIPC?'}</span>
                                        <button type="button" onClick={toggleAuthMode} disabled={isSubmitting} className="text-[#001e40] font-medium hover:underline focus:outline-none disabled:opacity-50">
                                            {isLoginMode ? 'Register Company Profile' : 'Log in with Email + OTP instead'}
                                        </button>
                                    </div> */}
                                </div>

                                {!isLoginMode && (
                                    <div className="space-y-2">
                                        <label htmlFor="contactNumber" className="block text-sm font-medium text-[#43474f]">Contact Number</label>
                                        <input 
                                            type="tel" 
                                            id="contactNumber"
                                            value={formData.contactNumber}
                                            onChange={e => setFormData({...formData, contactNumber: e.target.value})}
                                            disabled={isSubmitting}
                                            className="w-full px-4 py-3 border border-[#c3c6d1] rounded focus:border-[#001e40] focus:ring-1 focus:ring-[#001e40] outline-none bg-[#ffffff] text-[#191c1f] disabled:bg-gray-100 disabled:text-gray-500" 
                                            placeholder="+91 98765 43210"
                                            required={!isLoginMode}
                                        />
                                    </div>
                                )}

                                <button 
                                    type="submit" 
                                    disabled={isSubmitting}
                                    className="w-full h-12 mt-4 flex items-center justify-center gap-2 bg-[#001e40] text-white text-sm font-medium rounded hover:bg-[#003366] transition-all cursor-pointer disabled:bg-[#001e40]/50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? (
                                        <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                                    ) : (
                                        <>
                                            <span>{isLoginMode ? 'Send Login Code' : 'Send Verification Code'}</span>
                                            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </section>
                )}

                {/* VIEW 2: OTP VERIFICATION */}
                {step === 2 && (
                    <section className="w-full max-w-[640px] flex flex-col animate-fadeIn">
                        <div className="w-full bg-[#ffffff] border border-[#c3c6d1] rounded-lg shadow-sm p-6 sm:p-10 text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#d5e3ff] rounded-2xl mb-6">
                                <span className="material-symbols-outlined text-[#001e40] text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>mark_email_read</span>
                            </div>
                            <h2 className="text-2xl sm:text-3xl font-semibold text-[#001e40] mb-2">Verify Your Email</h2>
                            <p className="text-[#5c5f60] mb-8 text-sm sm:text-base">We've sent a 6-digit verification code to <strong className="text-[#001e40]">{formData.email}</strong>.</p>
                            
                            <form onSubmit={handleOtpSubmit} className="space-y-8">
                                <div className="flex justify-center gap-2 sm:gap-3" onPaste={handleOtpPaste}>
                                    {otp.map((digit, index) => (
                                        <input 
                                            key={index}
                                            ref={(el) => {
                                                otpRefs.current[index] = el;
                                            }}
                                            type="text" 
                                            inputMode="numeric" 
                                            maxLength={1} 
                                            value={digit}
                                            disabled={isVerifying}
                                            onChange={e => handleOtpChange(index, e.target.value)}
                                            onKeyDown={e => handleOtpKeyDown(index, e)}
                                            required 
                                            className="w-10 sm:w-12 h-12 sm:h-14 text-center text-xl sm:text-2xl font-bold border-2 border-[#c3c6d1] rounded focus:border-[#001e40] focus:ring-2 focus:ring-[#001e40] outline-none bg-[#f2f4f8] disabled:opacity-50"
                                        />
                                    ))}
                                </div>
                                <div className="space-y-4">
                                    <button 
                                        type="submit" 
                                        disabled={isVerifying}
                                        className={`w-full h-12 text-white text-sm font-medium rounded transition-all flex justify-center items-center gap-3 ${isVerifying ? 'bg-green-600' : 'bg-[#001e40] hover:bg-[#003366] cursor-pointer'}`}
                                    >
                                        {isVerifying ? (
                                            <><span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span> Verifying...</>
                                        ) : (
                                            'Verify & Proceed'
                                        )}
                                    </button>
                                    <div>
                                        <button 
                                            type="button" 
                                            disabled={resendCooldown > 0 || isSubmitting}
                                            onClick={handleResendOtp}
                                            className={`text-sm font-medium transition-colors focus:outline-none ${resendCooldown > 0 || isSubmitting ? 'text-[#5c5f60] cursor-not-allowed' : 'text-[#003366] hover:text-[#001e40] cursor-pointer'}`}
                                        >
                                            {isSubmitting ? 'Sending...' : resendCooldown > 0 ? `Resend Code in ${resendCooldown}s` : 'Resend Code'}
                                        </button>
                                    </div>
                                    <div>
                                        <button type="button" onClick={() => setStep(1)} disabled={isVerifying} className="text-xs text-[#5c5f60] hover:underline mt-2 disabled:opacity-50">
                                            &larr; Back to email
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </section>
                )}

                {/* VIEW 3: PENDING APPROVAL */}
                {step === 3 && (
                    <section className="w-full max-w-[640px] flex flex-col animate-fadeIn">
                        <div className="w-full bg-[#ffffff] border border-[#c3c6d1] rounded-lg shadow-sm overflow-hidden">
                            <div className="bg-[#f2f4f8] h-32 w-full flex items-end justify-center relative">
                                <div className="absolute -bottom-10 w-20 h-20 bg-[#ffffff] rounded-xl shadow-md border border-[#c3c6d1] flex items-center justify-center animate-pulse">
                                    <span className="material-symbols-outlined text-[40px] text-[#003366]" style={{ fontVariationSettings: "'FILL' 1" }}>
                                        {companyStatus === 'APPROVED' ? 'verified' : companyStatus === 'REJECTED' ? 'gpp_bad' : 'pending_actions'}
                                    </span>
                                </div>
                            </div>
                            <div className="pt-16 pb-[48px] px-6 sm:px-[48px] flex flex-col items-center text-center">
                                <h2 className="text-2xl sm:text-3xl font-semibold text-[#001e40] mb-4">
                                    {companyStatus === 'APPROVED' ? 'Registration Approved' : companyStatus === 'REJECTED' ? 'Registration Declined' : 'Registration Pending'}
                                </h2>
                                <p className="text-[#5c5f60] mb-8 max-w-[480px] text-sm sm:text-base">
                                    {companyStatus === 'APPROVED' 
                                        ? 'Congratulations! Your profile has been fully verified and approved. You can now access all portal features.' 
                                        : companyStatus === 'REJECTED'
                                        ? 'We were unable to verify your company. Please contact support.'
                                        : 'Thank you for registering. Our team is currently reviewing your company profile. You will receive an email once your account is approved.'}
                                </p>
                            </div>
                        </div>
                        
                        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
                            <div className="bg-[#ffffff] p-6 border border-[#c3c6d1] rounded-lg">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="material-symbols-outlined text-[#001e40]">schedule</span>
                                    <h3 className="font-semibold text-[#001e40]">Next Steps</h3>
                                </div>
                                <p className="text-sm text-[#5c5f60]">Verification typically takes 24-48 business hours. We'll notify you via email.</p>
                            </div>
                            <div className="bg-[#ffffff] p-6 border border-[#c3c6d1] rounded-lg">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="material-symbols-outlined text-[#001e40]">task_alt</span>
                                    <h3 className="font-semibold text-[#001e40]">Data Status</h3>
                                </div>
                                <p className="text-sm text-[#5c5f60]">Your contact credentials have been queued for review.</p>
                            </div>
                        </div>
                    </section>
                )}
            </main>
        </div>
    );
};

const App: React.FC = () => {
    return (
        <div className={styles.app}>
            <div className={styles.masthead}>
                <div className={styles.aipc49}>ALL IITs PLACEMENT COMMITTEE</div>
                <div className={styles.navCta}>
                    <div className={styles.nav}>
                        <div className={styles.about}>ABOUT</div>
                        <div className={styles.about}>PROGRAMME</div>
                        <div className={styles.about}>TRAVEL</div>
                        <div className={styles.about}>OFFICERS</div>
                        <a href="https://iitg.ac.in/ccd/contact_us.html" target='_blank'><div className={styles.about}>CONTACT</div></a>
                    </div>
                    <a href='#register'>
                      <div className={styles.registerCta}>
                          <div className={styles.register}>REGISTER</div>
                      </div>
                    </a>
                </div>
            </div>
            <div className={styles.hero}>
                <div className={styles.ruleDevice}>
                    <div className={styles.rectangle} />
                    <div className={styles.rectangle2} />
                    <div className={styles.rectangle3} />
                </div>
                <div className={styles.allIitsPlacement}>Industry Conclave at 49th AIPC </div>
                    <div className={styles.thAipcMeet}>49th AIPC Meet 2026</div>
                    <div className={styles.registerToConfirm}>Register to confirm your place. We’ll arrange your room and your airport transfer — there’s nothing else to book.</div>
                        <div className={styles.factRow}>
                            <div className={styles.fact}>
                                <div className={styles.allIitsPlacement}>DATES</div>
                                <div className={styles.iitGuwahati}>4th September 2026</div>
                            </div>
                            <div className={styles.fact}>
                                <div className={styles.allIitsPlacement}>VENUE</div>
                                <div className={styles.iitGuwahati}>IIT Guwahati</div>
                            </div>
                            <div className={styles.fact}>
                                <div className={styles.allIitsPlacement}>REGISTRATION</div>
                                <div className={styles.iitGuwahati}>Open now</div>
                            </div>
                        </div>
                    </div>
                    <div className={styles.membershipBand}>
                        <div className={styles.the23Member}>THE 23 MEMBER INSTITUTES</div>
                        <div className={styles.emblemGrid}>
            <a href="https://www.iitkgp.ac.in/" target="_blank" rel="noopener noreferrer" className={styles.iitBhilai}>
                <img src="logos/kharagpur.svg" alt="IIT Kharagpur" title="Kharagpur" className={styles.emblemRingIcon} />
            </a>
            <a href="https://www.iitb.ac.in/" target="_blank" rel="noopener noreferrer" className={styles.iitBhilai}>
                <img src="logos/bombay.svg" alt="IIT Bombay" title="Bombay" className={styles.emblemRingIcon} />
            </a>
            <a href="https://www.iitm.ac.in/" target="_blank" rel="noopener noreferrer" className={styles.iitBhilai}>
                <img src="logos/madras.svg" alt="IIT Madras" title="Madras" className={styles.emblemRingIcon} />
            </a>
            <a href="https://www.iitk.ac.in/" target="_blank" rel="noopener noreferrer" className={styles.iitBhilai}>
                <img src="logos/kanpur.png" alt="IIT Kanpur" title="Kanpur" className={styles.emblemRingIcon} />
            </a>
            <a href="https://home.iitd.ac.in/" target="_blank" rel="noopener noreferrer" className={styles.iitBhilai}>
                <img src="logos/delhi.svg" alt="IIT Delhi" title="Delhi" className={styles.emblemRingIcon} />
            </a>
            <a href="https://www.iitg.ac.in/" target="_blank" rel="noopener noreferrer" className={styles.iitBhilai}>
                <img src="logos/guwahati.webp" alt="IIT Guwahati" title="Guwahati" className={styles.emblemRingIcon} />
            </a>
            <a href="https://www.iitr.ac.in/" target="_blank" rel="noopener noreferrer" className={styles.iitBhilai}>
                <img src="logos/roorkee.svg" alt="IIT Roorkee" title="Roorkee" className={styles.emblemRingIcon} />
            </a>
            <a href="https://www.iitrpr.ac.in/" target="_blank" rel="noopener noreferrer" className={styles.iitBhilai}>
                <img src="logos/ropar.svg" alt="IIT Ropar" title="Ropar" className={styles.emblemRingIcon} />
            </a>
            <a href="https://www.iitbbs.ac.in/" target="_blank" rel="noopener noreferrer" className={styles.iitBhilai}>
                <img src="logos/bhubaneswar.svg" alt="IIT Bhubaneswar" title="Bhubaneswar" className={styles.emblemRingIcon} />
            </a>
            <a href="https://www.iitgn.ac.in/" target="_blank" rel="noopener noreferrer" className={styles.iitBhilai}>
                <img src="logos/gandhinagar.svg" alt="IIT Gandhinagar" title="Gandhinagar" className={styles.emblemRingIcon} />
            </a>
            <a href="https://www.iith.ac.in/" target="_blank" rel="noopener noreferrer" className={styles.iitBhilai}>
                <img src="logos/hyderabad.svg" alt="IIT Hyderabad" title="Hyderabad" className={styles.emblemRingIcon} />
            </a>
            <a href="https://iitj.ac.in/" target="_blank" rel="noopener noreferrer" className={styles.iitBhilai}>
                <img src="logos/jodhpur.svg" alt="IIT Jodhpur" title="Jodhpur" className={styles.emblemRingIcon} />
            </a>
            <a href="https://www.iitp.ac.in/" target="_blank" rel="noopener noreferrer" className={styles.iitBhilai}>
                <img src="logos/patna.jpg" alt="IIT Patna" title="Patna" className={styles.emblemRingIcon} />
            </a>
            <a href="https://www.iiti.ac.in/" target="_blank" rel="noopener noreferrer" className={styles.iitBhilai}>
                <img src="logos/indore.webp" alt="IIT Indore" title="Indore" className={styles.emblemRingIcon} />
            </a>
            <a href="https://www.iitmandi.ac.in/" target="_blank" rel="noopener noreferrer" className={styles.iitBhilai}>
                <img src="logos/mandi.svg" alt="IIT Mandi" title="Mandi" className={styles.emblemRingIcon} />
            </a>
            <a href="https://iitbhu.ac.in/" target="_blank" rel="noopener noreferrer" className={styles.iitBhilai}>
                <img src="logos/varanasi.webp" alt="IIT Varanasi" title="Varanasi" className={styles.emblemRingIcon} />
            </a>
            <a href="https://iitpkd.ac.in/" target="_blank" rel="noopener noreferrer" className={styles.iitBhilai}>
                <img src="logos/palakkad.jpg" alt="IIT Palakkad" title="Palakkad" className={styles.emblemRingIcon} />
            </a>
            <a href="https://iittp.ac.in/" target="_blank" rel="noopener noreferrer" className={styles.iitBhilai}>
                <img src="logos/tirupati.svg" alt="IIT Tirupati" title="Tirupati" className={styles.emblemRingIcon} />
            </a>
            <a href="https://www.iitism.ac.in/" target="_blank" rel="noopener noreferrer" className={styles.iitBhilai}>
                <img src="logos/dhanbad.svg" alt="IIT Dhanbad" title="Dhanbad" className={styles.emblemRingIcon} />
            </a>
            <a href="https://www.iitbhilai.ac.in/" target="_blank" rel="noopener noreferrer" className={styles.iitBhilai}>
                <img src="logos/bhilai.svg" alt="IIT Bhilai" title="Bhilai" className={styles.emblemRingIcon} />
            </a>
            <a href="https://www.iitdh.ac.in/" target="_blank" rel="noopener noreferrer" className={styles.iitBhilai}>
                <img src="logos/dharwad.svg" alt="IIT Dharwad" title="Dharwad" className={styles.emblemRingIcon} />
            </a>
            <a href="https://www.iitjammu.ac.in/" target="_blank" rel="noopener noreferrer" className={styles.iitBhilai}>
                <img src="logos/jammu.svg" alt="IIT Jammu" title="Jammu" className={styles.emblemRingIcon} />
            </a>
            <a href="https://iitgoa.ac.in/" target="_blank" rel="noopener noreferrer" className={styles.iitBhilai}>
                <img src="logos/goa.svg" alt="IIT Goa" title="Goa" className={styles.emblemRingIcon} />
            </a>
        </div>
                    </div>
                    <div className={styles.registration2}>
                        <div className={styles.twoColumns}>
                            <div className={styles.colCommittee}>
                                <div className={styles.thisEdition}>REGISTRATION</div>
                                <div className={styles.confirmYourAttendance}>Confirm your attendance</div>
                                <div className={styles.eachInstituteSends}>Each institute sends one delegate, normally the professor-in-charge of placement.</div>
                                <div className={styles.onceYouRegister}>Once you register, we’ll email your confirmation and joining instructions.</div>
                            </div>
                            <div className={styles.colThisMeeting}>
                                <div className={styles.thisEdition}>THIS EDITION</div>
                                <div className={styles.the49thMeet}>The 49th meet</div>
                                <div className={styles.iitGuwahatiHosts}>IIT Guwahati hosts the committee for three days in September 2026.</div>
                                <div className={styles.figuresRule} />
                                <div className={styles.figures}>
                                    <div className={styles.figure}>
                                        <div className={styles.div}>23</div>
                                        <div className={styles.participatingIits}>PARTICIPATING IITs</div>
                                    </div>
                                    <div className={styles.figure}>
                                        <div className={styles.div}>50+</div>
                                        <div className={styles.participatingIits}>POLICY SESSIONS</div>
                                    </div>
                                    <div className={styles.figure}>
                                        <div className={styles.div}>500+</div>
                                        <div className={styles.participatingIits}>CORPORATE DELEGATES</div>
                                    </div>
                                    <div className={styles.figure}>
                                        <div className={styles.div}>25k+</div>
                                        <div className={styles.participatingIits}>STUDENTS REPRESENTED</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={styles.riverRule} id="register">
                      <RegistrationWidget />
                    </div>
                    <div className={styles.programme2}>
                        <div className={styles.allIitsPlacement}>PROGRAMME</div>
                        <div className={styles.confirmYourAttendance}>Industry Conclave as 49th AIPC</div>
                        <div className={styles.iitGuwahatiHosts}>Sessions run across all three days. We’ll email you the detailed programme once it’s confirmed, and publish it here.</div>
                        <div className={styles.dayCards}>
                            <div className={styles.day01}>
                                <div className={styles.cardTopRule} />
                                <div className={styles.spacer} />
                                <div className={styles.sectionIndex}>
                                    <div className={styles.register}>Industry Conclave</div>
                                    <div className={styles.programme4}></div>
                                    <div className={styles.rule} />
                                </div>
                                <div className={styles.spacer2} />
                                <div className={styles.september}>4th September</div>
                                <div className={styles.monday}>FRIDAY</div>
                                <div className={styles.spacer2} />
                                {/* <div className={styles.toBeConfirmed}>To be confirmed.</div> */}
                            </div>
                        </div>
                    </div>
                    <div className={styles.travelAndStay}>
                        <div className={styles.twoColumns2}>
                            <div className={styles.colHostInstitution}>
                                <div className={styles.allIitsPlacement}>THE CAMPUS</div>
                                <div className={styles.confirmYourAttendance}>On the north bank of the Brahmaputra</div>
                                <div className={styles.bracketedStatement}>
                                    <div className={styles.sevenHundredAcres}>Seven hundred acres on the north bank of the Brahmaputra, in North Guwahati.</div>
                                    <div className={styles.bracketArm} />
                                    <div className={styles.bracketArm2} />
                                    <div className={styles.bracketArm3} />
                                    <div className={styles.bracketArm4} />
                                </div>
                                <div className={styles.campusPhotograph}>
                                    <div className={styles.campusPhotograph2}>CAMPUS PHOTOGRAPH</div>
                                </div>
                            </div>
                            <div className={styles.colArrivingAndStaying}>
                                <div className={styles.gettingThere}>GETTING THERE</div>
                                <div className={styles.item}>
                                    <div className={styles.dash} />
                                    <div className={styles.t}>
                                        <div className={styles.everySessionTakes}>Every session takes place on campus.</div>
                                    </div>
                                </div>
                                <div className={styles.item}>
                                    <div className={styles.dash} />
                                    <div className={styles.t}>
                                        <div className={styles.everySessionTakes}>You’ll stay on campus. Nothing to book.</div>
                                    </div>
                                </div>
                                <div className={styles.item}>
                                    <div className={styles.dash} />
                                    <div className={styles.t}>
                                        <div className={styles.everySessionTakes}>Fly into Lokpriya Gopinath Bordoloi International Airport. We’ll collect you and bring you to campus.</div>
                                    </div>
                                </div>
                                <div className={styles.wellSendYour}>We’ll send your room details, transfer time and a campus map before you travel.</div>
                            </div>
                        </div>
                        {/* <img className={styles.travelAndStayChild} alt="" /> */}
                    </div>
                    <div className={styles.footer}>
                        <div className={styles.ruleDevice2}>
                            <div className={styles.rectangle4} />
                            <div className={styles.rectangle5} />
                            <div className={styles.rectangle6} />
                        </div>
                        <div className={styles.footerColumns}>
                            <div className={styles.col}>
                                <div className={styles.thAipcMeet2}>49th AIPC Meet 2026</div>
                                <div className={styles.everySessionTakes}>4th September 2026</div>
                                <div className={styles.everySessionTakes}>Indian Institute of Technology Guwahati</div>
                            </div>
                            <div className={styles.col2}>
                                <div className={styles.registrationQueries}>Registration queries</div>
                                <div className={styles.writeToThe}>Write to the organising committee at IIT Guwahati. Address published shortly.</div>
                            </div>
                            <div className={styles.col2}>
                                <div className={styles.registrationQueries}>For recruiters</div>
                                <div className={styles.writeToThe}>AIPC guidelines and 2026–27 season dates, published closer to the meet.</div>
                            </div>
                        </div>
                        <div className={styles.legalRule} />
                        <div className={styles.hostedByIit}>HOSTED BY IIT GUWAHATI ON BEHALF OF THE ALL IITs' PLACEMENT COMMITTEE</div>
                        </div>
                    </div>
    );
};

export default App;