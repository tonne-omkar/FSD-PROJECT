import React from 'react';

/**
 * PlacementPulse Logo — Heartbeat / ECG pulse line icon + wordmark.
 *
 * Props:
 *   size      — 'sm' | 'md' | 'lg' (default 'md')
 *   theme     — 'dark' | 'light'   (default 'light')
 *   showText  — boolean            (default true)
 *   className — string
 */
export default function Logo({
  size = 'md',
  theme = 'light',
  showText = true,
  className = '',
}) {
  const sizes = {
    sm: {
      box: 'w-8 h-8 rounded-lg',
      iconSize: 18,
      strokeWidth: 2.4,
      text: 'text-[15px]',
      gap: 'gap-2.5',
    },
    md: {
      box: 'w-9 h-9 rounded-xl',
      iconSize: 21,
      strokeWidth: 2.3,
      text: 'text-[17px]',
      gap: 'gap-2.5',
    },
    lg: {
      box: 'w-11 h-11 rounded-2xl',
      iconSize: 25,
      strokeWidth: 2.2,
      text: 'text-[22px]',
      gap: 'gap-3',
    },
  };

  const s = sizes[size] || sizes.md;
  const isDark = theme === 'dark';

  return (
    <div className={`inline-flex items-center ${s.gap} ${className}`}>
      {/* Pulse rounded container with cyan/teal heartbeat wave */}
      <div
        className={`${s.box} flex items-center justify-center shrink-0 transition-all ${
          isDark
            ? 'bg-white/10 border border-white/15 text-accent-400 shadow-sm'
            : 'bg-navy-900 text-accent-400 shadow-sm'
        }`}
      >
        <svg
          width={s.iconSize}
          height={s.iconSize}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="shrink-0"
        >
          {/* Authentic heartbeat pulse rhythm (baseline -> P wave -> Q dip -> high sharp R peak -> deep S valley -> T recovery -> baseline) */}
          <path
            d="M2 12h3l2-4 2.5 8 3-13 3 18 2.5-12 1.5 3h2.5"
            stroke="currentColor"
            strokeWidth={s.strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {showText && (
        <span
          className={`${s.text} font-bold tracking-tight select-none ${
            isDark ? 'text-white' : 'text-navy-900'
          }`}
        >
          Placement<span className={isDark ? 'text-accent-400' : 'text-accent-500'}>Pulse</span>
        </span>
      )}
    </div>
  );
}

/**
 * Standalone Heartbeat Pulse Icon for use anywhere
 */
export function HeartbeatIcon({
  size = 20,
  strokeWidth = 2.2,
  className = 'w-5 h-5 text-accent-400',
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M2 12h3l2-4 2.5 8 3-13 3 18 2.5-12 1.5 3h2.5"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
