import { useEffect, useState } from 'react';
import Logo from './Logo';

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    // After 1.7s begin exit animation, call onComplete at 2s
    const exitTimer = setTimeout(() => setExiting(true), 1700);
    const doneTimer = setTimeout(() => onComplete(), 2000);
    return () => {
      clearTimeout(exitTimer);
      clearTimeout(doneTimer);
    };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[999] flex flex-col items-center justify-between bg-background py-16 ${exiting ? 'splash-exit' : ''}`}
      aria-label="Loading Lumisync"
    >
      <div /> {/* Top Spacer */}

      {/* Logo */}
      <div className="splash-logo relative z-10 scale-110">
        <Logo size={64} variant="full" />
      </div>

      {/* Powered by Lumi */}
      <div className="flex flex-col items-center gap-3 relative z-10 opacity-70">
        <div className="flex gap-1.5 mb-2">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-primary/40"
              style={{ animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite` }}
            />
          ))}
        </div>
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
          Powered by Lumi
        </p>
      </div>
    </div>
  );
}
