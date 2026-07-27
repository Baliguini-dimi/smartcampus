type LogoProps = {
  className?: string;
};

/** Marque seule (icone), utilisee dans le favicon, la sidebar reduite, etc. */
export function LogoMark({ className }: LogoProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Skyline simplifiee */}
      <rect x="14" y="16" width="7" height="16" rx="1.5" fill="currentColor" className="text-navy" />
      <rect x="24" y="10" width="7" height="22" rx="1.5" fill="currentColor" className="text-navy" />
      <rect x="34" y="18" width="7" height="14" rx="1.5" fill="currentColor" className="text-navy" />
      {/* Arc accent */}
      <path
        d="M10 34 Q32 22 54 34"
        stroke="#FFB347"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />
      {/* Ruban en S, version epuree */}
      <path
        d="M40 40 C40 34 26 38 26 32 C26 26 40 30 40 24"
        stroke="currentColor"
        className="text-navy"
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

/** Logo complet (icone + wordmark), utilise dans le header. */
export function Logo({ className }: LogoProps) {
  return (
    <div className={`flex items-center gap-2 ${className ?? ""}`}>
      <LogoMark className="h-8 w-8" />
      <span className="font-heading text-lg font-bold text-navy">
        Smart<span className="font-semibold text-neutral-900">Campus</span>
      </span>
    </div>
  );
}
