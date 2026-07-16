import { useEffect, useState } from 'react';
import Logo from './Logo';

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    // After 2s begin exit animation, call onComplete at 2.5s
    const exitTimer = setTimeout(() => setExiting(true), 2000);
    const doneTimer = setTimeout(() => onComplete(), 2500);
    return () => {
      clearTimeout(exitTimer);
      clearTimeout(doneTimer);
    };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[999] flex flex-col items-center justify-center bg-background ${exiting ? 'splash-exit' : ''}`}
      aria-label="Loading Lumisync"
    >
      {/* Ambient gradient blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-32 -left-32 w-80 h-80 rounded-full opacity-20 blur-3xl"
          style={{ background: 'radial-gradient(circle, rgb(79,70,229), transparent)' }}
        />
        <div
          className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full opacity-15 blur-3xl"
          style={{ background: 'radial-gradient(circle, rgb(14,165,233), transparent)' }}
        />
      </div>

      {/* Logo */}
      <div className="splash-logo relative z-10">
        <Logo size={56} variant="full" />
      </div>

      {/* Tagline */}
      <p className="splash-tagline relative z-10 mt-4 text-sm font-medium text-muted-foreground tracking-wide">
        Your campus, supercharged.
      </p>

      {/* Loading indicator */}
      <div className="absolute bottom-16 z-10 flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-primary/40"
            style={{ animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite` }}
          />
        ))}
      </div>
    </div>
  );
}
