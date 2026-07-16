interface LogoProps {
  size?: number;
  variant?: 'full' | 'icon';
  className?: string;
}

export default function Logo({ size = 32, variant = 'full', className = '' }: LogoProps) {
  const iconSize = size;
  const textSize = size * 0.65;

  const icon = (
    <svg
      width={iconSize}
      height={iconSize}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Outer ring with gradient */}
      <defs>
        <linearGradient id="logo-grad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="rgb(79,70,229)" />
          <stop offset="100%" stopColor="rgb(14,165,233)" />
        </linearGradient>
        <linearGradient id="logo-grad-light" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="rgba(79,70,229,0.15)" />
          <stop offset="100%" stopColor="rgba(14,165,233,0.15)" />
        </linearGradient>
      </defs>
      {/* Background circle */}
      <circle cx="20" cy="20" r="20" fill="url(#logo-grad-light)" />
      {/* Sync arc — left */}
      <path
        d="M10 20 A10 10 0 0 1 20 10"
        stroke="url(#logo-grad)"
        strokeWidth="2.8"
        strokeLinecap="round"
        fill="none"
      />
      {/* Sync arc — right */}
      <path
        d="M30 20 A10 10 0 0 1 20 30"
        stroke="url(#logo-grad)"
        strokeWidth="2.8"
        strokeLinecap="round"
        fill="none"
      />
      {/* Lumi spark — center star */}
      <circle cx="20" cy="20" r="4.5" fill="url(#logo-grad)" />
      {/* Spark lines */}
      <line x1="20" y1="6" x2="20" y2="11" stroke="url(#logo-grad)" strokeWidth="2" strokeLinecap="round" />
      <line x1="20" y1="29" x2="20" y2="34" stroke="url(#logo-grad)" strokeWidth="2" strokeLinecap="round" />
      <line x1="6" y1="20" x2="11" y2="20" stroke="url(#logo-grad)" strokeWidth="2" strokeLinecap="round" />
      <line x1="29" y1="20" x2="34" y2="20" stroke="url(#logo-grad)" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );

  if (variant === 'icon') return <span className={className}>{icon}</span>;

  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      {icon}
      <span
        style={{ fontSize: textSize, lineHeight: 1, fontFamily: 'Outfit, sans-serif', fontWeight: 700, letterSpacing: '-0.02em' }}
        className="lumi-gradient-text select-none"
      >
        Lumisync
      </span>
    </span>
  );
}
