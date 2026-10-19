'use client';

import React from 'react';
import { Dumbbell } from 'lucide-react';

interface EquipmentTickerProps {
  primaryColor?: string;
}

const TICKER_ITEMS = [
  'Eleiko Olympic Power Bars',
  'Commercial Rubber Hex Dumbbells to 50kg',
  'Concept2 Rowers & SkiErgs',
  'Texas Deadlift Bars & Platforms',
  'Dual 100kg Cable Crossover Stacks',
  'Chalk-Friendly Power Racks',
  'Curved Motorless Sled Treadmills',
  'Plate-Loaded Leg Press & Hack Squats',
  'Percussion Massage Recovery Lounge',
];

export function EquipmentTicker({ primaryColor = '#ccff00' }: EquipmentTickerProps) {
  return (
    <div className="relative w-full overflow-hidden border-y border-white/[0.08] bg-[#090c12] py-4 select-none">
      <div className="animate-marquee flex items-center gap-8 whitespace-nowrap">
        {/* Render twice for continuous infinite scroll */}
        {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, index) => (
          <div key={index} className="flex items-center gap-3 shrink-0">
            <span
              className="flex h-6 w-6 items-center justify-center rounded-lg bg-white/5 border border-white/10"
              style={{ color: primaryColor }}
            >
              <Dumbbell className="h-3.5 w-3.5" />
            </span>
            <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-zinc-300">
              {item}
            </span>
            <span className="h-1 w-1 rounded-full bg-zinc-600" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default EquipmentTicker;
