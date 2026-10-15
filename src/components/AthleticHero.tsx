'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Dumbbell, ArrowUpRight, ShieldCheck, Flame, Users, Zap, CheckCircle2 } from 'lucide-react';

interface AthleticHeroProps {
  currentMode: 'operations' | 'member_portal';
  onModeChange: (mode: 'operations' | 'member_portal') => void;
  activeMembersCount: number;
  todayCheckInsCount: number;
}

export function AthleticHero({
  currentMode,
  onModeChange,
  activeMembersCount,
  todayCheckInsCount
}: AthleticHeroProps) {
  return (
    <div className="relative overflow-hidden border-b border-[#222736] bg-[#080a0f] py-10 sm:py-14">
      {/* Ambient background neon glow */}
      <div className="pointer-events-none absolute -top-24 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-[#ccff00]/10 blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 right-10 h-72 w-72 rounded-full bg-emerald-500/5 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
          
          {/* Left Column: Athletic Typography & CTAs */}
          <div className="lg:col-span-7 space-y-6">
            {/* Pill Tag */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 rounded-full border border-[#ccff00]/30 bg-[#ccff00]/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#ccff00] shadow-sm"
            >
              <Zap className="h-3.5 w-3.5 fill-[#ccff00]" />
              <span>Next-Gen Indian Gym Operating Engine</span>
            </motion.div>

            {/* Giant Bold Headline (Like IronPulse Reference) */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl font-black uppercase tracking-tight text-white sm:text-6xl sm:leading-[1.05]"
            >
              NO EXCUSES.{' '}
              <span className="text-[#ccff00] glow-text-volt block sm:inline">
                ONLY RESULTS.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="max-w-xl text-sm leading-relaxed text-zinc-400 sm:text-base font-medium"
            >
              The unified SaaS ecosystem for Indian gym owners and athletes. Automated UPI dues recovery, 1-tap WhatsApp passes, peak-hour machine swap logic, and high-protein Indian nutrition plans.
            </motion.p>

            {/* Interactive Mode CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap items-center gap-3 pt-2"
            >
              <button
                onClick={() => onModeChange('member_portal')}
                className={`group flex items-center gap-2 rounded-full px-6 py-3 text-xs sm:text-sm font-extrabold uppercase tracking-wider transition-all duration-300 shadow-md ${
                  currentMode === 'member_portal'
                    ? 'bg-[#ccff00] text-black glow-volt hover:bg-[#b8e600] scale-102'
                    : 'border border-[#ccff00]/40 bg-[#0e1219] text-[#ccff00] hover:bg-[#ccff00]/10'
                }`}
              >
                <Dumbbell className="h-4 w-4" />
                <span>Launch Member Arena</span>
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>

              <button
                onClick={() => onModeChange('operations')}
                className={`group flex items-center gap-2 rounded-full px-6 py-3 text-xs sm:text-sm font-extrabold uppercase tracking-wider transition-all duration-300 ${
                  currentMode === 'operations'
                    ? 'bg-[#ccff00] text-black glow-volt hover:bg-[#b8e600] scale-102'
                    : 'border border-zinc-700 bg-zinc-900/80 text-zinc-200 hover:border-zinc-500 hover:bg-zinc-800'
                }`}
              >
                <ShieldCheck className="h-4 w-4" />
                <span>Front-Desk Command Center</span>
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
            </motion.div>

            {/* Feature Badges */}
            <div className="flex flex-wrap items-center gap-4 pt-4 text-xs text-zinc-400">
              <span className="flex items-center gap-1.5 font-semibold">
                <CheckCircle2 className="h-4 w-4 text-[#ccff00]" />
                Zero Unpaid Dues Slippage
              </span>
              <span className="flex items-center gap-1.5 font-semibold">
                <CheckCircle2 className="h-4 w-4 text-[#ccff00]" />
                100% Offline-Safe Workouts
              </span>
              <span className="flex items-center gap-1.5 font-semibold">
                <CheckCircle2 className="h-4 w-4 text-[#ccff00]" />
                Direct WhatsApp Invoicing
              </span>
            </div>
          </div>

          {/* Right Column: Floating Athletic Card (Alfirza & IronPulse Glass Card Reference) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.25 }}
            className="lg:col-span-5"
          >
            <div className="relative rounded-3xl border border-[#262c3d] bg-gradient-to-b from-[#131722]/90 to-[#0c0f16]/95 p-6 shadow-2xl backdrop-blur-md">
              {/* Top Accent Strip */}
              <div className="flex items-center justify-between border-b border-[#222738] pb-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#ccff00] text-black font-black">
                    GP
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Live Gym Telemetry</h3>
                    <p className="text-[11px] text-zinc-400 font-mono">Sector 15 Main Facility</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/20">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  <span>Real-time Active</span>
                </div>
              </div>

              {/* Card Metrics Grid */}
              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-[#222738] bg-[#0b0e14] p-3.5">
                  <div className="flex items-center justify-between text-zinc-400 text-xs font-medium">
                    <span>Active Lifters</span>
                    <Users className="h-4 w-4 text-[#ccff00]" />
                  </div>
                  <div className="mt-2 font-mono text-2xl font-black text-white">
                    {activeMembersCount}
                  </div>
                  <span className="text-[11px] text-emerald-400 font-medium">Enrolled & Valid</span>
                </div>

                <div className="rounded-2xl border border-[#222738] bg-[#0b0e14] p-3.5">
                  <div className="flex items-center justify-between text-zinc-400 text-xs font-medium">
                    <span>Today&apos;s Check-Ins</span>
                    <Flame className="h-4 w-4 text-orange-400" />
                  </div>
                  <div className="mt-2 font-mono text-2xl font-black text-[#ccff00]">
                    {todayCheckInsCount}
                  </div>
                  <span className="text-[11px] text-zinc-400 font-medium">Peak Hour Rush</span>
                </div>
              </div>

              {/* Athletic Callout Banner inside Card */}
              <div className="mt-4 rounded-2xl border border-[#ccff00]/20 bg-[#ccff00]/5 p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#ccff00]">
                      Indian Diet & Soya/Paneer Engine
                    </span>
                    <p className="mt-1 text-xs text-zinc-300">
                      Auto-computes complete amino-acid profiles for Indian lacto-vegetarians and eggetarians.
                    </p>
                  </div>
                  <div className="rounded-lg bg-[#ccff00] p-1.5 text-black">
                    <Zap className="h-4 w-4 fill-black" />
                  </div>
                </div>
              </div>

              {/* Quick Switch Button */}
              <div className="mt-5 pt-2">
                <button
                  onClick={() =>
                    onModeChange(currentMode === 'operations' ? 'member_portal' : 'operations')
                  }
                  className="w-full flex items-center justify-center gap-2 rounded-xl border border-[#262c3d] bg-[#161a25] py-2.5 text-xs font-bold text-zinc-200 hover:border-[#ccff00]/50 hover:text-white transition-all shadow-xs"
                >
                  <span>Toggle to {currentMode === 'operations' ? 'Member Training Arena' : 'Front-Desk Operations'}</span>
                  <ArrowUpRight className="h-3.5 w-3.5 text-[#ccff00]" />
                </button>
              </div>

            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
