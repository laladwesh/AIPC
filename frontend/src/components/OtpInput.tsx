import React, { useRef } from 'react';

interface OtpInputProps {
    value: string[];
    onChange: (value: string[]) => void;
    disabled?: boolean;
}

const OtpInput = ({ value, onChange, disabled }: OtpInputProps) => {
    const refs = useRef<(HTMLInputElement | null)[]>([]);

    const handleChange = (index: number, digit: string) => {
        const val = digit.replace(/[^0-9]/g, '');
        const next = [...value];
        next[index] = val;
        onChange(next);
        if (val && index < value.length - 1) refs.current[index + 1]?.focus();
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !value[index] && index > 0) refs.current[index - 1]?.focus();
        else if (e.key === 'ArrowLeft' && index > 0) refs.current[index - 1]?.focus();
        else if (e.key === 'ArrowRight' && index < value.length - 1) refs.current[index + 1]?.focus();
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').split('');
        if (pasted.length === 0) return;
        const next = [...value];
        pasted.forEach((char, i) => { if (i < value.length) next[i] = char; });
        onChange(next);
        refs.current[Math.min(pasted.length - 1, value.length - 1)]?.focus();
    };

    return (
        <div className="flex justify-center gap-2 sm:gap-3" onPaste={handlePaste}>
            {value.map((digit, index) => (
                <input
                    key={index}
                    ref={(el) => { refs.current[index] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    disabled={disabled}
                    onChange={e => handleChange(index, e.target.value)}
                    onKeyDown={e => handleKeyDown(index, e)}
                    required
                    className="w-10 sm:w-12 h-12 sm:h-14 text-center text-xl sm:text-2xl font-bold border-2 border-[#c3c6d1] rounded focus:border-[#001e40] focus:ring-2 focus:ring-[#001e40] outline-none bg-[#f2f4f8] disabled:opacity-50"
                />
            ))}
        </div>
    );
};

export default OtpInput;
