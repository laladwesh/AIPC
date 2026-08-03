import { useEffect, useState } from 'react';
import { INSTITUTES } from '../institutes';

const SLIDE_DURATION = 2800;
const FALLBACK_IMAGE = `${import.meta.env.BASE_URL}campus.png`;

const InstituteCarousel = () => {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex(i => (i + 1) % INSTITUTES.length);
        }, SLIDE_DURATION);
        return () => clearInterval(timer);
    }, []);
    useEffect(() => {
        INSTITUTES.forEach(institute => {
            const scene = new Image();
            scene.src = institute.sceneImage;
            const logo = new Image();
            logo.src = institute.logo;
        });
    }, []);

    const current = INSTITUTES[index];

    return (
        <div className="relative w-full h-full overflow-hidden bg-[#101e24]">
            <img
                key={current.code}
                src={current.sceneImage}
                onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = FALLBACK_IMAGE; }}
                alt=""
                className="absolute inset-0 w-full h-full object-cover opacity-40 animate-fadeIn"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#101e24]/60 via-[#101e24]/45 to-[#101e24]/70" />

            <div className="relative h-full flex flex-col items-center justify-center px-10 text-center">
                <div key={current.code} className="flex flex-col items-center animate-fadeIn">
                    <div className="w-28 h-28 rounded-2xl bg-white/95 flex items-center justify-center shadow-xl mb-6 p-5">
                        <img src={current.logo} alt={current.name} className="w-full h-full object-contain" />
                    </div>
                    <p className="text-white/50 text-xs tracking-[0.2em] font-medium mb-3">
                        {String(index + 1).padStart(2, '0')} / {INSTITUTES.length}
                    </p>
                    <p className="font-display text-white text-2xl font-bold leading-snug">{current.name}</p>
                </div>
            </div>

            <div className="absolute bottom-10 left-0 right-0 flex justify-center gap-1.5 flex-wrap px-10">
                {INSTITUTES.map((institute, i) => (
                    <button
                        key={institute.code}
                        type="button"
                        aria-label={`Show ${institute.name}`}
                        aria-current={i === index}
                        onClick={() => setIndex(i)}
                        className={`h-1.5 rounded-full transition-all ${i === index ? 'w-5 bg-white' : 'w-1.5 bg-white/35 hover:bg-white/60'}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default InstituteCarousel;
