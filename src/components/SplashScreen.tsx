import { useEffect, useState } from 'react';
import Logo from './Logo';

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [phase, setPhase] = useState<'enter' | 'hold' | 'exit'>('enter');

  useEffect(() => {
    const holdTimer = setTimeout(() => setPhase('hold'), 400);
    const exitTimer = setTimeout(() => setPhase('exit'), 1800);
    const doneTimer = setTimeout(() => onComplete(), 2200);
    return () => {
      clearTimeout(holdTimer);
      clearTimeout(exitTimer);
      clearTimeout(doneTimer);
    };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[999] flex flex-col items-center justify-between bg-black py-16 transition-opacity duration-500 ease-out ${phase === 'exit' ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
      style={{ backgroundColor: '#000000' }}
      aria-label="Loading Lumisync"
      role="status"
    >
      {/* Top spacer */}
      <div />

      {/* Center: Logo + wordmark */}
      <div
        className={`flex flex-col items-center gap-0 transition-all duration-500 ease-out ${phase === 'enter' ? 'opacity-0 scale-95 translate-y-2' : 'opacity-100 scale-100 translate-y-0'}`}
      >
        <Logo size={56} variant="full" light={true} />
      </div>

      {/* Bottom: Loading indicator + "Powered by Lumi" */}
      <div
        className={`flex flex-col items-center gap-5 transition-all duration-500 ease-out delay-200 ${phase === 'enter' ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}
      >
        {/* Linear progress bar in TTU Red */}
        <div className="w-[140px] h-[2px] bg-white/10 rounded-full overflow-hidden relative">
          <div
            className="absolute left-0 top-0 h-full bg-[#CC0000] rounded-full transition-all duration-500 ease-out"
            style={{
              width: phase === 'enter' ? '0%' : phase === 'hold' ? '70%' : '100%',
            }}
          />
        </div>
        <p className="text-[10px] font-bold text-stone-500 uppercase tracking-[0.25em]">
          Powered by Lumi
        </p>
      </div>
    </div>
  );
}


