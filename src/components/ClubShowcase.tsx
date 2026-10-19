'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowUpRight,
  ShieldCheck,
  Users,
  Zap,
  CheckCircle2,
  Star,
  X,
  Clock,
  Utensils,
  Award,
  MapPin,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Activity,
  Flame,
  Dumbbell,
  Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GymProfile } from '@/types';
import { sounds } from '@/lib/audio';
import Pricing02 from '@/components/Pricing02';

interface ClubShowcaseProps {
  onSwitchMode: (mode: 'showcase' | 'operations' | 'member_portal') => void;
  onOpenAddMember?: () => void;
  activeMembersCount?: number;
  todayCheckInsCount: number;
  unpaidDuesCount?: number;
  gymProfile?: GymProfile;
}

export function ClubShowcase({
  onSwitchMode,
  onOpenAddMember,
  todayCheckInsCount,
  gymProfile
}: ClubShowcaseProps) {
  const primaryColor = gymProfile?.primaryColor || '#ccff00';
  const gymName = gymProfile?.gymName || 'IronPulse Commercial Gym';
  const heroHeadline = gymProfile?.heroHeadline || 'NO SHORTCUTS.';
  const heroHighlight = gymProfile?.heroHighlight || 'ONLY RESULTS.';
  const heroSubtitle =
    gymProfile?.heroSubtitle ||
    'Train in an elite strength facility equipped with competition Olympic barbells, heavy dumbbells up to 50kg, certified coaches, and customized Indian nutrition plans built for real transformations.';
  const heroImg = gymProfile?.heroImageUrl || '/images/gym_hero_athlete.jpg';

  // Interactive 1-Day Trial Pass Modal State
  const [isTrialModalOpen, setIsTrialModalOpen] = useState(false);
  const [trialName, setTrialName] = useState('');
  const [trialPhone, setTrialPhone] = useState('');
  const [trialSlot, setTrialSlot] = useState('Morning (6:00 AM - 10:00 AM)');
  const [trialGoal, setTrialGoal] = useState('Muscle Building & Hypertrophy');
  const [isTrialClaimed, setIsTrialClaimed] = useState(false);

  // Program Filter State
  const [selectedProgramCategory, setSelectedProgramCategory] = useState<string>('all');

  // FAQ Accordion State
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Floating notification dismiss
  const [isFloatingDismissed, setIsFloatingDismissed] = useState(false);

  // Handle Trial Pass Submission
  const handleClaimTrial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trialName.trim() || trialPhone.trim().length < 10) {
      alert('Please enter a valid full name and 10-digit phone number.');
      return;
    }
    sounds.playSuccess();
    setIsTrialClaimed(true);
  };

  const programs = [
    {
      id: 'strength',
      title: 'Heavy Strength & Hypertrophy',
      category: 'strength',
      desc: 'Progressive barbell squats, deadlifts, bench press, and dumbbell volume designed to add lean contractile muscle.',
      intensity: 'High Intensity',
      duration: '60 min',
      coach: 'Coach Vikram'
    },
    {
      id: 'fatloss',
      title: 'High-Output Cardio & Fat Loss',
      category: 'conditioning',
      desc: 'Targeted fat oxidation combining Concept2 rower sprints, air bike intervals, kettlebell complexes, and core circuits.',
      intensity: 'Peak Heart Rate',
      duration: '45 min',
      coach: 'Coach Amit'
    },
    {
      id: 'coaching',
      title: '1-on-1 Personal Transformation',
      category: 'coaching',
      desc: 'Dedicated biomechanical form audits, progressive overload logs, and weekly body composition check-ins.',
      intensity: 'Personalized',
      duration: '60 min',
      coach: 'Coach Rajesh'
    },
    {
      id: 'mobility',
      title: 'Athletic Mobility & Core Rehab',
      category: 'mobility',
      desc: 'Hip opener sequences, thoracic spine mobility, shoulder cuff prep, and postural decompression to prevent injury.',
      intensity: 'Active Recovery',
      duration: '35 min',
      coach: 'Coach Priya'
    }
  ];

  const filteredPrograms =
    selectedProgramCategory === 'all'
      ? programs
      : programs.filter((p) => p.category === selectedProgramCategory);

  const coaches = [
    {
      name: 'Vikram Singh',
      role: 'Head Strength Coach',
      spec: 'Powerlifting & Barbell Training',
      exp: '6 Years Exp.',
      rating: '4.95',
      achievements: 'State Gold Medalist • IPF Certified',
      bio: 'Specializes in safe compound barbell progression, fixing squat mechanics, and adding 30-50kg to client total lifts.'
    },
    {
      name: 'Rajesh Sharma',
      role: 'Senior Hypertrophy Coach',
      spec: 'Biomechanics & Body Recomp',
      exp: '8 Years Exp.',
      rating: '4.92',
      achievements: 'K11 Master Trainer • 200+ Transformations',
      bio: 'Expert in hypertrophy stimulus-to-fatigue ratios, cable mechanics, and structured progressive overload.'
    },
    {
      name: 'Priya Nair',
      role: 'Dietetics & Athletic Mobility',
      spec: 'Indian High-Protein Nutrition',
      exp: '5 Years Exp.',
      rating: '4.98',
      achievements: 'Registered Clinical Sports Dietitian',
      bio: 'Creates delicious high-protein Indian meal plans (paneer, soya, eggs, chicken, lentils) that fit your daily schedule.'
    },
    {
      name: 'Amit Verma',
      role: 'Conditioning & MetCon Coach',
      spec: 'HIIT & Fat Loss Circuits',
      exp: '4 Years Exp.',
      rating: '4.89',
      achievements: 'CrossFit L2 • Endurance Athlete',
      bio: 'Passionate about athletic stamina, metabolic conditioning, kettlebell circuits, and sustainable fat loss.'
    }
  ];

  const faqs = [
    {
      q: 'Can I freeze or pause my gym membership if I travel?',
      a: 'Yes! All Quarterly Pro and Annual VIP memberships include up to 30 days of complimentary membership freeze per year with zero penalty. Simply inform the front desk or send a WhatsApp message.'
    },
    {
      q: 'Are personal trainers included with my membership?',
      a: 'Every new member receives a complimentary 1-on-1 fitness assessment and workout orientation. Quarterly Pro plans include 1 personal trainer session per month, and Annual VIP includes 8 dedicated sessions. Additional 1-on-1 personal coaching packages are also available.'
    },
    {
      q: 'What are your peak hours and locker room amenities?',
      a: 'Morning peak is 7:00 AM – 9:00 AM, and evening peak is 6:30 PM – 8:30 PM. Our facility includes secure electronic day lockers, hot showers, filtered drinking water stations, charging stations, and high-speed Wi-Fi.'
    },
    {
      q: 'Do you provide vegetarian or Indian high-protein diet plans?',
      a: 'Yes, absolutely. Coach Priya specializes in practical Indian nutrition plans built around paneer, soya chunks, Greek yogurt, lentils, sprouts, eggs, and whey protein so you hit your macro goals without forcing western diets.'
    },
    {
      q: 'Can I bring a guest or workout partner with me?',
      a: 'Quarterly Pro and Annual VIP members receive 2 guest passes each month. First-time visitors can also claim our 1-Day Free VIP Pass anytime using the button above!'
    }
  ];

  return (
    <div className="relative text-zinc-100 selection:bg-[#ccff00] selection:text-black">

      {/* ─────────────────────────────────────────────────────────────
          HERO SECTION (OLED DARK MODE + ATHLETIC ACCENTS)
          ───────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[85vh] border-b border-[#1c212e] py-12 lg:py-20 flex items-center bg-[#060709] overflow-hidden">
        {/* Subtle Ambient Radial Backlight Glow */}
        <div
          className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[350px] rounded-full blur-[140px] pointer-events-none opacity-20"
          style={{ backgroundColor: primaryColor }}
        />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Headlines & High-Converting CTAs */}
            <div className="lg:col-span-7 space-y-6">
              

              {/* Headline */}
              <div className="space-y-1">
                <h1 className="text-4xl sm:text-6xl xl:text-7xl font-black uppercase tracking-[-0.03em] text-white leading-none">
                  {heroHeadline}{' '}
                  <span
                    className="block mt-1 drop-shadow-sm"
                    style={{ color: primaryColor }}
                  >
                    {heroHighlight}
                  </span>
                </h1>
              </div>

              {/* Subtitle */}
              <p className="text-sm sm:text-base text-zinc-300 max-w-xl leading-relaxed">
                {heroSubtitle}
              </p>

              {/* Action Buttons: Primary & Secondary */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
                <button
                  onClick={() => setIsTrialModalOpen(true)}
                  className="inline-flex items-center justify-center gap-2 rounded-xl px-7 py-3.5 text-xs sm:text-sm font-black uppercase tracking-wider text-black shadow-lg transition-all hover:brightness-110 active:scale-95 apple-press whitespace-nowrap"
                  style={{ backgroundColor: primaryColor }}
                >
                  <span>Claim 1-Day Free Pass</span>
                  <ArrowUpRight className="h-4 w-4" />
                </button>

                <a
                  href="#pricing"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3.5 text-xs sm:text-sm font-bold text-zinc-200 hover:bg-white/10 hover:border-white/20 hover:text-white transition-all apple-press whitespace-nowrap"
                >
                  <span>Explore Plans & Amenities</span>
                </a>
              </div>

              {/* Live Metric Badges Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-[#1a202e]">
                <div className="rounded-xl border border-[#1b2333] bg-[#0c1017]/80 p-3">
                  <span className="text-lg sm:text-xl font-black text-white block">50+</span>
                  <span className="text-[10px] sm:text-xs text-zinc-400 font-medium">Barbell Stations</span>
                </div>
                <div className="rounded-xl border border-[#1b2333] bg-[#0c1017]/80 p-3">
                  <span className="text-lg sm:text-xl font-black text-white block">2,400+</span>
                  <span className="text-[10px] sm:text-xs text-zinc-400 font-medium">Monthly Workouts</span>
                </div>
                <div className="rounded-xl border border-[#1b2333] bg-[#0c1017]/80 p-3">
                  <span className="text-lg sm:text-xl font-black text-white block">100%</span>
                  <span className="text-[10px] sm:text-xs text-zinc-400 font-medium">Certified Coaches</span>
                </div>
                <div className="rounded-xl border border-[#1b2333] bg-[#0c1017]/80 p-3">
                  <span className="text-lg sm:text-xl font-black text-[#ccff00] block">{todayCheckInsCount}</span>
                  <span className="text-[10px] sm:text-xs text-zinc-400 font-medium">Today&apos;s Check-ins</span>
                </div>
              </div>

            </div>

            {/* Right Column: Hero High-Res Athlete Image Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative aspect-4/5 overflow-hidden rounded-3xl border border-[#22283a] bg-[#0c0f16] shadow-2xl group">
                <Image
                  src={heroImg}
                  alt={`${gymName} athlete training`}
                  fill
                  className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                
                {/* Dark Vignette Overlay for OLED Contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#060709] via-transparent to-transparent opacity-90" />

              </div>
            </div>

          </div>
        </div>
      </section>


      {/* ─────────────────────────────────────────────────────────────
          SECTION 2: BENTO GRID FACILITY & EQUIPMENT SHOWCASE
          ───────────────────────────────────────────────────────────── */}
      <section id="facilities" className="relative border-b border-[#1c212e] py-16 sm:py-24 bg-[#080a0f]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-[#ccff00]">
              Facility & Equipment Showcase
            </span>
            <h2 className="mt-1 text-3xl font-black uppercase tracking-[-0.03em] text-white sm:text-5xl">
              Built for Heavy Progress.
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-zinc-400">
              No waiting in lines. No flimsy home-grade setups. Engineered for athletes who value their time and results.
            </p>
          </div>

          {/* Bento Grid Architecture */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Bento Card 1 (Wide 2-Columns) */}
            <div className="md:col-span-2 rounded-3xl border border-[#22283a] bg-[#0e121a] p-8 relative overflow-hidden group hover:border-[#ccff00]/40 transition-colors">
              <div className="relative z-10 max-w-md space-y-3">
                <span className="text-[10px] font-mono font-black uppercase tracking-wider text-[#ccff00] px-2.5 py-1 rounded bg-[#ccff00]/10 border border-[#ccff00]/20">
                  FLAGSHIP ARENA
                </span>
                <h3 className="text-2xl font-black text-white">
                  Heavy Free Weights & Power Cages
                </h3>
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                  Calibrated steel plates, Texas & Eleiko power bars, deadlift lifting platforms, and commercial dumbbells up to 50kg. Chalk-friendly environment with zero anti-grunt policies.
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  <span className="rounded-lg bg-[#161d2d] px-2.5 py-1 text-xs font-semibold text-zinc-300">Dumbbells 2.5kg - 50kg</span>
                  <span className="rounded-lg bg-[#161d2d] px-2.5 py-1 text-xs font-semibold text-zinc-300">4 Olympic Power Racks</span>
                  <span className="rounded-lg bg-[#161d2d] px-2.5 py-1 text-xs font-semibold text-zinc-300">Drop Deadlift Mats</span>
                </div>
              </div>
            </div>

            {/* Bento Card 2: Dual Cable Crossover & Functional Rig */}
            <div className="rounded-3xl border border-[#22283a] bg-[#0e121a] p-8 relative overflow-hidden group hover:border-[#ccff00]/40 transition-colors flex flex-col justify-between">
              <div className="space-y-3">
                <div className="h-10 w-10 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center">
                  <Zap className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-black text-white">
                  Dual Cable Towers & Rigs
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Smooth dual 100kg weight stacks, multi-grip pull-up crossbars, resistance bands, and suspension rigs for complete isolation training.
                </p>
              </div>
              <div className="pt-4 border-t border-[#1b2333] flex items-center justify-between text-xs text-zinc-400">
                <span>Stack Capacity</span>
                <span className="font-mono font-bold text-white">100kg / Tower</span>
              </div>
            </div>

            {/* Bento Card 3: Cardio Arena */}
            <div className="rounded-3xl border border-[#22283a] bg-[#0e121a] p-8 relative overflow-hidden group hover:border-[#ccff00]/40 transition-colors flex flex-col justify-between">
              <div className="space-y-3">
                <div className="h-10 w-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
                  <Activity className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-black text-white">
                  High-Output Cardio Arena
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Concept2 rowers, ski ergs, air assault bikes, and curved self-powered motorless treadmills that demand real leg drive.
                </p>
              </div>
              <div className="pt-4 border-t border-[#1b2333] flex items-center justify-between text-xs text-zinc-400">
                <span>Machines</span>
                <span className="font-mono font-bold text-white">Concept2 & AirBikes</span>
              </div>
            </div>

            {/* Bento Card 4: Post-Workout Recovery Zone */}
            <div className="rounded-3xl border border-[#22283a] bg-[#0e121a] p-8 relative overflow-hidden group hover:border-[#ccff00]/40 transition-colors flex flex-col justify-between">
              <div className="space-y-3">
                <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Flame className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-black text-white">
                  Mobility & Recovery Lounge
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Percussion therapy massage guns, high-density foam rollers, mobility bands, and dedicated warm-up/cool-down turf.
                </p>
              </div>
              <div className="pt-4 border-t border-[#1b2333] flex items-center justify-between text-xs text-zinc-400">
                <span>Recovery</span>
                <span className="font-mono font-bold text-emerald-400">Included in All Plans</span>
              </div>
            </div>

            {/* Bento Card 5: Real-time Floor Telemetry */}
            <div className="rounded-3xl border border-[#22283a] bg-[#0e121a] p-8 relative overflow-hidden group hover:border-[#ccff00]/40 transition-colors flex flex-col justify-between">
              <div className="space-y-3">
                <div className="h-10 w-10 rounded-xl bg-[#ccff00]/10 border border-[#ccff00]/20 text-[#ccff00] flex items-center justify-center">
                  <Users className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-black text-white">
                  Live Floor Availability
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Check live crowd telemetry from your phone before heading out. Never arrive to an overcrowded floor again.
                </p>
              </div>
              <div className="pt-4 border-t border-[#1b2333] flex items-center justify-between text-xs">
                <span className="text-zinc-400">Current Load</span>
                <span className="font-mono font-bold text-[#ccff00]">Optimal Flow • No Wait</span>
              </div>
            </div>

          </div>

        </div>
      </section>


      {/* ─────────────────────────────────────────────────────────────
          SECTION 3: TRAINING PROGRAMS
          ───────────────────────────────────────────────────────────── */}
      <section id="programs" className="relative border-b border-[#1c212e] py-16 sm:py-24 bg-[#060709]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#ccff00]">
                Curated Workouts
              </span>
              <h2 className="mt-1 text-3xl font-black uppercase tracking-[-0.03em] text-white sm:text-5xl">
                Training Programs
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-zinc-400 max-w-xl">
                Structured regimens engineered for muscle growth, fat reduction, and athletic durability.
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'all', label: 'All Regimens' },
                { id: 'strength', label: 'Strength' },
                { id: 'conditioning', label: 'Fat Loss' },
                { id: 'coaching', label: '1-on-1 PT' },
                { id: 'mobility', label: 'Mobility' }
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedProgramCategory(cat.id)}
                  className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all apple-press ${
                    selectedProgramCategory === cat.id
                      ? 'bg-[#ccff00] text-black shadow-md'
                      : 'bg-[#10141e] border border-[#22283a] text-zinc-400 hover:text-white'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredPrograms.map((prog) => (
              <div
                key={prog.id}
                className="flex flex-col justify-between rounded-3xl border border-[#22283a] bg-[#0c1017] p-6 hover:border-[#ccff00]/40 transition-colors"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
                    <span className="text-[#ccff00] font-bold">{prog.intensity}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {prog.duration}
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-white leading-tight">
                    {prog.title}
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {prog.desc}
                  </p>
                </div>

                <div className="pt-4 mt-6 border-t border-[#1b2333] flex items-center justify-between">
                  <span className="text-[11px] font-medium text-zinc-400">Lead: {prog.coach}</span>
                  <button
                    onClick={() => setIsTrialModalOpen(true)}
                    className="text-xs font-bold text-[#ccff00] hover:underline flex items-center gap-1"
                  >
                    <span>Try Class</span>
                    <ArrowUpRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>


      {/* ─────────────────────────────────────────────────────────────
          SECTION 4: CERTIFIED COACHES & TRAINERS ROSTER
          ───────────────────────────────────────────────────────────── */}
      <section id="trainers" className="relative border-b border-[#1c212e] py-16 sm:py-24 bg-[#080a0f]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-[#ccff00]">
              Coaching & Mentorship
            </span>
            <h2 className="mt-1 text-3xl font-black uppercase tracking-[-0.03em] text-white sm:text-5xl">
              Meet Your Floor Coaches
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-zinc-400">
              Our coaches don&apos;t sit on their phones. They assess your posture, refine your bar path, and keep you accountable every week.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {coaches.map((c, idx) => (
              <div
                key={idx}
                className="rounded-3xl border border-[#22283a] bg-[#0c1017] p-6 flex flex-col justify-between hover:border-zinc-500 transition-colors group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-12 w-12 rounded-2xl bg-[#141b29] border border-[#252f44] text-[#ccff00] flex items-center justify-center font-black text-sm">
                      {c.name.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <div className="flex items-center gap-1 text-xs font-bold text-amber-400">
                      <Star className="h-3.5 w-3.5 fill-current" />
                      <span>{c.rating}</span>
                    </div>
                  </div>

                  <h3 className="text-lg font-black text-white">{c.name}</h3>
                  <p className="text-xs font-bold text-[#ccff00] mt-0.5">{c.role}</p>
                  
                  <div className="mt-3 flex items-center gap-2 text-[11px] font-mono text-zinc-400">
                    <span>{c.exp}</span>
                    <span>•</span>
                    <span className="truncate">{c.spec}</span>
                  </div>

                  <p className="mt-3 text-xs text-zinc-300 leading-relaxed">
                    {c.bio}
                  </p>
                </div>

                <div className="pt-4 mt-6 border-t border-[#1b2333]">
                  <button
                    onClick={() => setIsTrialModalOpen(true)}
                    className="w-full rounded-xl border border-[#222738] bg-[#121724] py-2.5 text-xs font-bold text-zinc-200 hover:text-black hover:bg-[#ccff00] hover:border-[#ccff00] transition-all"
                  >
                    Book Session
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>


      {/* ─────────────────────────────────────────────────────────────
          SECTION 5: REAL RESULTS. REAL PEOPLE. (TRANSFORMATIONS)
          ───────────────────────────────────────────────────────────── */}
      <section id="results" className="relative border-b border-[#1c212e] py-16 sm:py-24 bg-[#060709]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          
          <div className="mb-12 text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-[#ccff00]">
              Proven Evidence
            </span>
            <h2 className="mt-1 text-3xl font-black uppercase tracking-[-0.03em] text-white sm:text-5xl">
              Real Results. Real People.
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-zinc-400">
              No sponsored models. Verified metrics and physical transformations from genuine members.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Transformation 1 */}
            <div className="rounded-3xl border border-[#22283a] bg-[#0c1017] p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-[#1f2434]">
                  <div>
                    <h3 className="text-base font-black text-white">Rahul M.</h3>
                    <p className="text-xs text-zinc-400">Software Architect • 31 Yrs</p>
                  </div>
                  <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/20">
                    -15 kg Body Fat
                  </span>
                </div>

                <p className="mt-4 text-xs sm:text-sm text-zinc-300 italic leading-relaxed">
                  &ldquo;Coach Priya customized a high-protein Indian diet with paneer, sprouts, and soya that fit my 10-hour desk job. Dropped from 88kg to 73kg in 6 months.&rdquo;
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#1f2434]">
                <div className="flex items-center justify-between text-xs text-zinc-400 mb-2 font-mono">
                  <span>Weight Progression</span>
                  <span className="font-bold text-[#ccff00]">88kg → 73kg</span>
                </div>
                <svg className="w-full h-14 stroke-[#ccff00]" viewBox="0 0 200 60" fill="none">
                  <path d="M 10,15 Q 60,25 100,35 T 190,52" strokeWidth="3" strokeLinecap="round" />
                  <circle cx="10" cy="15" r="4" fill="#ccff00" />
                  <circle cx="100" cy="35" r="4" fill="#ccff00" />
                  <circle cx="190" cy="52" r="4" fill="#ccff00" />
                </svg>
              </div>
            </div>

            {/* Transformation 2 */}
            <div className="rounded-3xl border border-[#22283a] bg-[#0c1017] p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-[#1f2434]">
                  <div>
                    <h3 className="text-base font-black text-white">Ananya K.</h3>
                    <p className="text-xs text-zinc-400">Consultant • 27 Yrs</p>
                  </div>
                  <span className="rounded-full bg-[#ccff00]/10 px-2.5 py-1 text-xs font-bold text-[#ccff00] border border-[#ccff00]/20">
                    +40kg Deadlift PR
                  </span>
                </div>

                <p className="mt-4 text-xs sm:text-sm text-zinc-300 italic leading-relaxed">
                  &ldquo;I was afraid of heavy deadlifts due to chronic back pain. Coach Vikram taught me proper bracing and lat engagement. Lifted 125kg completely pain-free.&rdquo;
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#1f2434]">
                <div className="flex items-center justify-between text-xs text-zinc-400 mb-2 font-mono">
                  <span>Strength PR Curve</span>
                  <span className="font-bold text-[#ccff00]">45kg → 125kg</span>
                </div>
                <svg className="w-full h-14 stroke-[#ccff00]" viewBox="0 0 200 60" fill="none">
                  <path d="M 10,50 Q 70,40 110,25 T 190,10" strokeWidth="3" strokeLinecap="round" />
                  <circle cx="10" cy="50" r="4" fill="#ccff00" />
                  <circle cx="110" cy="25" r="4" fill="#ccff00" />
                  <circle cx="190" cy="10" r="4" fill="#ccff00" />
                </svg>
              </div>
            </div>

            {/* Transformation 3 */}
            <div className="rounded-3xl border border-[#22283a] bg-[#0c1017] p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-[#1f2434]">
                  <div>
                    <h3 className="text-base font-black text-white">Sameer D.</h3>
                    <p className="text-xs text-zinc-400">Tech Founder • 35 Yrs</p>
                  </div>
                  <span className="rounded-full bg-cyan-500/10 px-2.5 py-1 text-xs font-bold text-cyan-400 border border-cyan-500/20">
                    22 Sessions / Mo
                  </span>
                </div>

                <p className="mt-4 text-xs sm:text-sm text-zinc-300 italic leading-relaxed">
                  &ldquo;The QR scanner check-in and quick machine swap logic makes workouts effortless. Resting heart rate dropped from 78 to 58 bpm in 90 days.&rdquo;
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#1f2434]">
                <div className="flex items-center justify-between text-xs text-zinc-400 mb-2 font-mono">
                  <span>Attendance Consistency</span>
                  <span className="font-bold text-cyan-400">92% Streak</span>
                </div>
                <div className="flex items-center justify-between gap-1 pt-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
                    <div
                      key={i}
                      className={`h-7 w-full rounded-sm ${
                        i % 5 === 0 ? 'bg-zinc-800' : 'bg-[#ccff00]'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>


      {/* ─────────────────────────────────────────────────────────────
          SECTION 6: TRANSPARENT PRICING PLANS (ORIGINKIT PRICING-02)
          ───────────────────────────────────────────────────────────── */}
      <Pricing02
        heading="Unlock Your Peak Athletic Potential With Transparent Membership Plans"
        subheading="Clear Indian Rupee pricing with zero surprise charges. Instant UPI confirmation, certified coaches, and flexible billing cycles."
        badgeLabel="Pricing plans"
        currencySymbol="₹"
        onSelectPlan={(plan) => {
          if (plan.monthlyPrice === null) {
            setIsTrialModalOpen(true);
          } else if (onOpenAddMember) {
            onOpenAddMember();
          } else {
            onSwitchMode('operations');
          }
        }}
      />


      {/* ─────────────────────────────────────────────────────────────
          SECTION 7: TRUST, LOCATION & EXPANDABLE FAQ ACCORDION
          ───────────────────────────────────────────────────────────── */}
      <section id="faq" className="relative border-b border-[#1c212e] py-16 sm:py-24 bg-[#060709]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left: Location & Contact Card */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#ccff00]">
                  Facility Coordinates
                </span>
                <h2 className="mt-1 text-3xl font-black uppercase tracking-[-0.03em] text-white">
                  Visit {gymName}
                </h2>
                <p className="mt-2 text-xs sm:text-sm text-zinc-400">
                  Centrally located with dedicated parking, bike stands, and direct elevator access.
                </p>
              </div>

              <div className="rounded-3xl border border-[#22283a] bg-[#0c1017] p-6 space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-[#ccff00] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">Address</h4>
                    <p className="text-xs text-zinc-300 mt-0.5 leading-relaxed">
                      {gymProfile?.address || 'Plot 42, 27th Main, Sector 1, HSR Layout, Bengaluru, Karnataka 560102'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 border-t border-[#1a2130] pt-4">
                  <Clock className="h-5 w-5 text-[#ccff00] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">Operating Timings</h4>
                    <p className="text-xs text-zinc-300 mt-0.5">
                      {gymProfile?.operatingHours || 'Mon - Sat: 5:30 AM - 10:30 PM | Sun: 6:00 AM - 1:00 PM'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 border-t border-[#1a2130] pt-4">
                  <MessageSquare className="h-5 w-5 text-[#25d366] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">Front Desk WhatsApp</h4>
                    <p className="text-xs text-zinc-300 mt-0.5">
                      +{gymProfile?.whatsappNumber || '919876543210'} (Instant query response)
                    </p>
                  </div>
                </div>

                <div className="pt-2">
                  <a
                    href={`https://wa.me/${gymProfile?.whatsappNumber || '919876543210'}?text=Hi%20${encodeURIComponent(gymName)},%20I%20want%20to%20know%20more%20about%20gym%20membership!`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#25d366] py-3 text-xs font-black uppercase tracking-wider text-black hover:bg-[#20b858] transition-colors"
                  >
                    <MessageSquare className="h-4 w-4" />
                    <span>Chat on WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Right: Expandable FAQs Accordion */}
            <div className="lg:col-span-7 space-y-4">
              <div className="mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#ccff00]">
                  Transparency & Assurance
                </span>
                <h3 className="text-2xl font-black uppercase text-white mt-1">
                  Frequently Asked Questions
                </h3>
              </div>

              <div className="space-y-3">
                {faqs.map((faq, idx) => {
                  const isOpen = openFaqIndex === idx;
                  return (
                    <div
                      key={idx}
                      className="rounded-2xl border border-[#22283a] bg-[#0c1017] overflow-hidden transition-colors"
                    >
                      <button
                        onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                        className="w-full flex items-center justify-between p-5 text-left text-xs sm:text-sm font-bold text-white hover:text-[#ccff00] transition-colors"
                      >
                        <span>{faq.q}</span>
                        {isOpen ? (
                          <ChevronUp className="h-4 w-4 text-[#ccff00] shrink-0 ml-3" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-zinc-400 shrink-0 ml-3" />
                        )}
                      </button>

                      {isOpen && (
                        <div className="px-5 pb-5 pt-0 text-xs text-zinc-300 leading-relaxed border-t border-[#1a2130]">
                          <p className="pt-3">{faq.a}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

        </div>
      </section>


      {/* ─────────────────────────────────────────────────────────────
          INTERACTIVE 1-DAY FREE PASS MODAL
          ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isTrialModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md rounded-3xl border border-[#263044] bg-[#0c1017] p-7 shadow-2xl"
            >
              <button
                onClick={() => {
                  setIsTrialModalOpen(false);
                  setIsTrialClaimed(false);
                }}
                className="absolute top-5 right-5 text-zinc-400 hover:text-white p-1 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>

              {!isTrialClaimed ? (
                <div>
                  <div className="flex items-center gap-2 text-[#ccff00] text-xs font-black uppercase tracking-wider mb-1">
                    <Dumbbell className="h-4 w-4" />
                    <span>Free Pass Invitation</span>
                  </div>
                  <h3 className="text-2xl font-black text-white">
                    Claim 1-Day VIP Pass
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1 mb-5">
                    Experience our heavy free weights, cardio arena, and certified coaches with zero commitment.
                  </p>

                  <form onSubmit={handleClaimTrial} className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-zinc-300 block mb-1">Full Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Rohit Sharma"
                        value={trialName}
                        onChange={(e) => setTrialName(e.target.value)}
                        className="w-full rounded-xl border border-[#22283a] bg-[#121724] px-3.5 py-2.5 text-xs font-semibold text-white outline-none focus:border-[#ccff00]"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-zinc-300 block mb-1">WhatsApp Number</label>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        placeholder="10-digit mobile number"
                        value={trialPhone}
                        onChange={(e) => setTrialPhone(e.target.value.replace(/\D/g, ''))}
                        className="w-full rounded-xl border border-[#22283a] bg-[#121724] px-3.5 py-2.5 text-xs font-semibold text-white outline-none focus:border-[#ccff00]"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-zinc-300 block mb-1">Preferred Slot</label>
                      <select
                        value={trialSlot}
                        onChange={(e) => setTrialSlot(e.target.value)}
                        className="w-full rounded-xl border border-[#22283a] bg-[#121724] px-3.5 py-2.5 text-xs font-semibold text-white outline-none focus:border-[#ccff00]"
                      >
                        <option>Morning (6:00 AM - 10:00 AM)</option>
                        <option>Afternoon (12:00 PM - 4:00 PM)</option>
                        <option>Evening (5:00 PM - 9:00 PM)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-zinc-300 block mb-1">Primary Fitness Goal</label>
                      <select
                        value={trialGoal}
                        onChange={(e) => setTrialGoal(e.target.value)}
                        className="w-full rounded-xl border border-[#22283a] bg-[#121724] px-3.5 py-2.5 text-xs font-semibold text-white outline-none focus:border-[#ccff00]"
                      >
                        <option>Muscle Building & Hypertrophy</option>
                        <option>Fat Loss & Metabolic Conditioning</option>
                        <option>Strength & Powerlifting (Squat/Bench/Deadlift)</option>
                        <option>General Health & Posture Fix</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      className="w-full inline-flex items-center justify-center gap-2 rounded-xl py-3.5 text-xs font-black uppercase tracking-wider text-black shadow-lg transition-all hover:brightness-110 active:scale-[0.98] mt-2 apple-press"
                      style={{ backgroundColor: primaryColor }}
                    >
                      <span>Claim Free VIP Pass</span>
                      <ArrowUpRight className="h-4 w-4" />
                    </button>
                  </form>
                </div>
              ) : (
                <div className="text-center py-4 space-y-4">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#ccff00]/20 text-[#ccff00] border border-[#ccff00]/40">
                    <Check className="h-7 w-7" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-white">VIP Pass Confirmed!</h3>
                    <p className="text-xs text-zinc-400 mt-1">
                      Welcome, <span className="text-white font-bold">{trialName}</span>! Your pass is active for {trialSlot}.
                    </p>
                  </div>

                  <div className="rounded-2xl border-2 border-dashed border-[#ccff00]/50 bg-[#121724] p-4 text-left font-mono text-xs space-y-1.5">
                    <div className="flex justify-between text-zinc-400">
                      <span>PASS ID:</span>
                      <span className="text-[#ccff00] font-bold">VIP-{Math.floor(100000 + Math.random() * 900000)}</span>
                    </div>
                    <div className="flex justify-between text-zinc-400">
                      <span>FACILITY:</span>
                      <span className="text-white font-bold">{gymName}</span>
                    </div>
                    <div className="flex justify-between text-zinc-400">
                      <span>GOAL:</span>
                      <span className="text-white font-bold truncate max-w-[170px]">{trialGoal}</span>
                    </div>
                  </div>

                  <a
                    href={`https://wa.me/${gymProfile?.whatsappNumber || '919876543210'}?text=Hi%20${encodeURIComponent(gymName)},%20I%20just%20claimed%20my%201-Day%20VIP%20Pass%20for%20${encodeURIComponent(trialName)}%20(${trialPhone})!`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#25d366] py-3.5 text-xs font-black uppercase tracking-wider text-black hover:bg-[#20b858] transition-colors"
                  >
                    <MessageSquare className="h-4 w-4" />
                    <span>Send Pass to My WhatsApp</span>
                  </a>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>


      {/* ─────────────────────────────────────────────────────────────
          FLOATING QUICK-PORTAL NOTIFICATION PILL
          ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {!isFloatingDismissed && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: 'spring', damping: 22, stiffness: 300 }}
            className="fixed bottom-6 right-6 z-40 max-w-sm rounded-2xl apple-glass-card p-4 shadow-2xl"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#ccff00] text-black font-black text-xs">
                  GP
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white leading-tight">
                    {gymName}
                  </h3>
                  <p className="text-[10px] text-zinc-400 font-mono">
                    {gymProfile?.city || 'Bengaluru'} Live Arena
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsFloatingDismissed(true)}
                className="text-zinc-400 hover:text-white p-1 rounded-md apple-press"
                title="Dismiss"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="mt-2 text-xs text-zinc-300 leading-relaxed">
              Experience Olympic barbells, heavy dumbbells, and certified coach guidance today.
            </p>

            <div className="mt-3 flex items-center justify-between border-t border-[#1f2434] pt-2.5">
              <button
                onClick={() => setIsTrialModalOpen(true)}
                className="flex items-center gap-1.5 text-xs font-bold text-[#ccff00] hover:underline"
              >
                <span>Get Free Pass</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </button>

              <button
                onClick={() => onSwitchMode('operations')}
                className="flex items-center gap-1 text-xs font-medium text-zinc-400 hover:text-white"
              >
                <span>Admin Console →</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
