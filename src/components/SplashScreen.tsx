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
      className={`fixed inset-0 z-[999] flex flex-col items-center justify-between bg-background py-16 transition-opacity duration-400 ease-out ${phase === 'exit' ? 'opacity-0' : 'opacity-100'}`}
      aria-label="Loading Lumisync"
      role="status"
    >
      {/* Top spacer */}
      <div />

      {/* Center: Logo + wordmark */}
      <div
        className={`flex flex-col items-center gap-0 transition-all duration-500 ease-out ${phase === 'enter' ? 'opacity-0 scale-95 translate-y-2' : 'opacity-100 scale-100 translate-y-0'}`}
      >
        <Logo size={56} variant="full" />
      </div>

      {/* Bottom: Loading indicator + "Powered by Lumi" */}
      <div
        className={`flex flex-col items-center gap-4 transition-all duration-500 ease-out delay-300 ${phase === 'enter' ? 'opacity-0 translate-y-1' : 'opacity-100 translate-y-0'}`}
      >
        {/* 3-dot loading */}
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40"
              style={{ animation: `splash-dot 1.4s ease-in-out ${i * 0.16}s infinite` }}
            />
          ))}
        </div>
        <p className="text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-[0.25em]">
          Powered by Lumi
        </p>
      </div>

      {/* Dot animation keyframes via inline style */}
      <style>{`
        @keyframes splash-dot {
          0%, 80%, 100% { opacity: 0.3; transform: scale(0.9); }
          40% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
}


