'use client';

import React from 'react';

export interface GymProMarkProps {
  className?: string;
  color?: string;
}

/**
 * Minimalist Athletic Logomark for GymPRO
 * Clean, modern kinetic power slashes replacing generic AI-template dumbbell boxes.
 */
export function GymProMark({ className = 'h-6 w-6', color = '#ccff00' }: GymProMarkProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} shrink-0`}
      aria-hidden="true"
    >
      {/* Precision kinetic power slashes */}
      <path d="M3.5 19L9.5 5H12.5L6.5 19H3.5Z" fill="currentColor" />
      <path d="M11 19L17 5H20L14 19H11Z" fill={color} />
    </svg>
  );
}

export interface GymProLogoProps {
  className?: string;
  markClassName?: string;
  primaryColor?: string;
  gymName?: string;
  showBranch?: boolean;
}

export function GymProLogo({
  className = '',
  markClassName = 'h-6 w-6',
  primaryColor = '#ccff00',
  gymName,
  showBranch = true
}: GymProLogoProps) {
  return (
    <div className={`flex items-center gap-2.5 group focus:outline-none ${className}`}>
      <GymProMark
        className={`${markClassName} text-white group-hover:scale-105 transition-transform`}
        color={primaryColor}
      />
      <div className="flex items-center gap-1.5 leading-none">
        <span className="font-extrabold text-xl tracking-tight text-white font-sans">
          Gym<span style={{ color: primaryColor }}>PRO</span>
        </span>
        {showBranch && gymName && (
          <>
            <span className="text-zinc-600 font-light mx-1 hidden sm:inline">/</span>
            <span className="text-xs font-semibold text-zinc-400 hidden sm:inline max-w-[150px] md:max-w-[200px] truncate">
              {gymName}
            </span>
          </>
        )}
      </div>
    </div>
  );
}

export default GymProLogo;
