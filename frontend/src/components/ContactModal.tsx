import { useEffect } from 'react';

interface ContactModalProps {
    onClose: () => void;
}

const CONTACTS = [
    {
        role: 'Convenor, AIPC',
        name: 'Dr. John Jose (Head, Center for Career Development)',
        email: 'alliitpc@gmail.com',
        phone: '+91 90486 65842'
    },
    {
        role: 'Registration help',
        name: 'CCD Tech Support',
        email: 'ccd.techsupport@iitg.ac.in',
        phone: null
    },
    {
        role: 'Logistics',
        name: 'Akangshita Goswami (Career Development Officer, IITG)',
        email: 'cdo.ccd@iitg.ac.in',
        phone: '+91 91014 67789'
    }
];

const ContactModal = ({ onClose }: ContactModalProps) => {
    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
    }, [onClose]);

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-6 animate-fadeIn"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-modal-title"
        >
            <div
                className="w-full max-w-[420px] bg-white rounded-xl shadow-xl overflow-hidden"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex items-center justify-between px-6 py-5 border-b border-[#c3c6d1]">
                    <h2 id="contact-modal-title" className="text-lg font-semibold text-[#001e40]">Contact</h2>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close"
                        className="text-[#5c5f60] hover:text-[#001e40] transition-colors"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <div className="px-6 py-5 space-y-5">
                    {CONTACTS.map(contact => (
                        <div key={contact.role} className="flex items-start gap-3">
                            <span className="material-symbols-outlined text-[#001e40] mt-0.5">person</span>
                            <div>
                                <p className="text-xs tracking-[0.1em] text-[#5c5f60] font-medium uppercase">{contact.role}</p>
                                <p className="text-sm font-semibold text-[#191c1f]">{contact.name}</p>
                                {contact.email && (
                                    <a
                                        href={`mailto:${contact.email}`}
                                        className="block text-sm text-[#003366] hover:text-[#001e40] hover:underline"
                                    >
                                        {contact.email}
                                    </a>
                                )}
                                {contact.phone && (
                                    <a
                                        href={`tel:${contact.phone.replace(/\s+/g, '')}`}
                                        className="block text-sm text-[#003366] hover:text-[#001e40] hover:underline"
                                    >
                                        {contact.phone}
                                    </a>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ContactModal;
