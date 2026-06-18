import type { IconName } from '../types';

type SvgProps = { className?: string };

/* ---- UI icons ---------------------------------------------------------- */

export function ChevronDown({ className }: SvgProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
      <path
        d="M3.5 6 8 10.5 12.5 6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Minus({ className }: SvgProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
      <path d="M3.5 8h9" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function Plus({ className }: SvgProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
      <path d="M8 3.5v9M3.5 8h9" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function Check({ className }: SvgProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
      <path
        d="m3.5 8.5 3 3 6-7"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ---- Step / product icons --------------------------------------------- *
 * Simple line illustrations used as placeholders for product photography.  */

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

const PRODUCT_ICONS: Record<IconName, React.ReactNode> = {
  camera: (
    <>
      <rect x="6" y="9" width="12" height="11" rx="3" {...stroke} />
      <circle cx="12" cy="14.5" r="2.6" {...stroke} />
      <path d="M9 9V7a3 3 0 0 1 6 0v2" {...stroke} />
    </>
  ),
  'pan-camera': (
    <>
      <rect x="6" y="8" width="12" height="9" rx="3" {...stroke} />
      <circle cx="12" cy="12.5" r="2.4" {...stroke} />
      <path d="M8 20h8M12 17v3" {...stroke} />
    </>
  ),
  floodlight: (
    <>
      <rect x="4" y="5" width="6" height="3.4" rx="1.4" {...stroke} />
      <rect x="14" y="5" width="6" height="3.4" rx="1.4" {...stroke} />
      <path d="M12 8.4V12" {...stroke} />
      <rect x="9" y="12" width="6" height="6" rx="2.4" {...stroke} />
      <circle cx="12" cy="15" r="1.5" {...stroke} />
    </>
  ),
  doorbell: (
    <>
      <rect x="8" y="4" width="8" height="16" rx="3" {...stroke} />
      <circle cx="12" cy="10" r="2.2" {...stroke} />
      <circle cx="12" cy="16" r="0.9" fill="currentColor" />
    </>
  ),
  'battery-cam': (
    <>
      <rect x="6" y="8" width="12" height="9" rx="4.5" {...stroke} />
      <circle cx="12" cy="12.5" r="2.4" {...stroke} />
      <path d="M10 20h4" {...stroke} />
    </>
  ),
  motion: (
    <>
      <rect x="7" y="6" width="10" height="12" rx="3" {...stroke} />
      <path d="M9.5 13.5q2.5 2 5 0M10 16q2 1.4 4 0" {...stroke} />
      <circle cx="12" cy="10" r="1.4" {...stroke} />
    </>
  ),
  hub: (
    <>
      <rect x="4" y="13" width="16" height="6" rx="3" {...stroke} />
      <path d="M8 13V9a4 4 0 0 1 8 0v4" {...stroke} />
      <circle cx="12" cy="16" r="0.9" fill="currentColor" />
    </>
  ),
  entry: (
    <>
      <rect x="6" y="5" width="7" height="14" rx="1.4" {...stroke} />
      <rect x="14" y="7" width="4" height="10" rx="1.2" {...stroke} />
      <circle cx="11" cy="12" r="0.9" fill="currentColor" />
    </>
  ),
  sdcard: (
    <>
      <path d="M8 4h6l4 4v12a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Z" {...stroke} />
      <path d="M10 5v3M12.5 5v3M15 6v2" {...stroke} />
    </>
  ),
  solar: (
    <>
      <rect x="4" y="6" width="16" height="9" rx="1.4" {...stroke} />
      <path d="M8 6v9M12 6v9M16 6v9M4 9.5h16M4 12.5h16M12 15v4M9 19h6" {...stroke} />
    </>
  ),
  plan: (
    <>
      <path d="M12 3 5 6v5c0 4.4 3 7.6 7 9 4-1.4 7-4.6 7-9V6l-7-3Z" {...stroke} />
      <path d="m9 11.5 2 2 4-4.5" {...stroke} />
    </>
  ),
  shield: (
    <>
      <path d="M12 3 5 6v5c0 4.4 3 7.6 7 9 4-1.4 7-4.6 7-9V6l-7-3Z" {...stroke} />
    </>
  ),
  sensor: (
    <>
      <rect x="7" y="5" width="10" height="13" rx="3" {...stroke} />
      <path d="M9.5 12.5q2.5 2 5 0" {...stroke} />
      <circle cx="12" cy="9.5" r="1.3" {...stroke} />
    </>
  ),
  grid: (
    <>
      <circle cx="8" cy="8" r="1.3" {...stroke} />
      <circle cx="12" cy="8" r="1.3" {...stroke} />
      <circle cx="16" cy="8" r="1.3" {...stroke} />
      <circle cx="8" cy="12" r="1.3" {...stroke} />
      <circle cx="12" cy="12" r="1.3" {...stroke} />
      <circle cx="16" cy="12" r="1.3" {...stroke} />
      <circle cx="8" cy="16" r="1.3" {...stroke} />
      <circle cx="12" cy="16" r="1.3" {...stroke} />
      <circle cx="16" cy="16" r="1.3" {...stroke} />
    </>
  ),
  truck: (
    <>
      <rect x="3" y="8" width="11" height="8" rx="1.4" {...stroke} />
      <path d="M14 11h4l3 3v2h-7" {...stroke} />
      <circle cx="8" cy="18" r="1.6" {...stroke} />
      <circle cx="17" cy="18" r="1.6" {...stroke} />
    </>
  ),
};

export function ProductIcon({ name, className }: { name: IconName; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
      {PRODUCT_ICONS[name]}
    </svg>
  );
}
