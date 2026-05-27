export function Logo({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      {/* Balance of justice */}
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="32" y1="10" x2="32" y2="54" />
        <line x1="22" y1="54" x2="42" y2="54" />
        <line x1="14" y1="18" x2="50" y2="18" />
        <line x1="32" y1="10" x2="32" y2="18" />
        <path d="M14 18 L8 32 L20 32 Z" fill="currentColor" fillOpacity="0.15" />
        <path d="M50 18 L44 32 L56 32 Z" fill="currentColor" fillOpacity="0.15" />
        <ellipse cx="32" cy="10" rx="2.5" ry="2.5" fill="currentColor" />
      </g>
    </svg>
  );
}
