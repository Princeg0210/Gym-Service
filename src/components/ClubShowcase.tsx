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
  Play,
  X,
  Clock,
  Utensils,
  Award
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ClubShowcaseProps {
  onSwitchMode: (mode: 'showcase' | 'operations' | 'member_portal') => void;
  onOpenAddMember?: () => void;
  activeMembersCount?: number;
  todayCheckInsCount: number;
  unpaidDuesCount?: number;
}

export function ClubShowcase({
  onSwitchMode,
  onOpenAddMember,
  todayCheckInsCount
}: ClubShowcaseProps) {
  // Interactive Why Train With Us active feature index
  const [activeFeatureIndex, setActiveFeatureIndex] = useState<number>(1); // Default to Modern Equipment (like IronPulse reference)

  // Program Filter
  const [selectedProgramCategory, setSelectedProgramCategory] = useState<string>('all');

  // Billing Toggle (Monthly vs Yearly)
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  // Floating Alfirza Card state
  const [isAlfirzaCardDismissed, setIsAlfirzaCardDismissed] = useState<boolean>(false);

  // Booking / Lead success toast
  const [bookingToast, setBookingToast] = useState<string | null>(null);

  const features = [
    {
      title: 'Certified Trainers',
      desc: 'Our expert coaches design science-backed programs tailored to your personal biomechanics and metabolic goals.',
      icon: Award
    },
    {
      title: 'Modern Equipment',
      desc: 'Train with world-class bio-mechanical machines, dual-pulley towers, and advanced peak-hour load tracking.',
      icon: Zap
    },
    {
      title: 'Personalized Nutrition',
      desc: 'Custom high-protein Indian diets (Soya chunks, Paneer, Dal, Eggs) engineered for complete essential amino acid profiles.',
      icon: Utensils
    },
    {
      title: 'Motivating Community',
      desc: 'Surround yourself with disciplined athletes and coaches who push you to exceed your limits every single session.',
      icon: Users
    }
  ];

  const programs = [
    {
      id: 'weight',
      title: 'Weight Training',
      category: 'strength',
      desc: 'Build raw muscular power and dense hypertrophy with periodized barbell and dumbbell progressions.',
      intensity: 'High Intensity',
      duration: '45-60 min'
    },
    {
      id: 'cardio',
      title: 'Cardio & Fat Loss',
      category: 'conditioning',
      desc: 'Accelerate fat oxidation with interval sprints, rowing ladders, and metabolic functional circuits.',
      intensity: 'Peak Heart Rate',
      duration: '35-45 min'
    },
    {
      id: 'coaching',
      title: 'Personal Coaching',
      category: 'personal',
      desc: 'One-on-one kinematic analysis, form correction, and custom progressive overload architecture.',
      intensity: 'Precision Focus',
      duration: '60 min'
    },
    {
      id: 'calisthenics',
      title: 'Group Functional',
      category: 'conditioning',
      desc: 'Dynamic bodyweight mastery, plyometric bounding, and anaerobic stamina conditioning.',
      intensity: 'High Energy',
      duration: '50 min'
    },
    {
      id: 'yoga',
      title: 'Yoga & Flexibility',
      category: 'mobility',
      desc: 'Joint longevity, hip and thoracic mobility, posterior chain decompression, and active recovery.',
      intensity: 'Restorative',
      duration: '45 min'
    }
  ];

  const trainers = [
    {
      name: 'Vikram Singh',
      role: 'Head Strength Coach',
      spec: 'Biomechanics & Powerlifting',
      exp: '6 Years Exp.',
      rating: '4.95'
    },
    {
      name: 'Rajesh Sharma',
      role: 'Senior Hypertrophy Coach',
      spec: 'Bodybuilding & Injury Rehab',
      exp: '8 Years Exp.',
      rating: '4.98'
    },
    {
      name: 'Priya Nair',
      role: 'Functional & Dietetics Coach',
      spec: 'Indian Macro Planning & Mobility',
      exp: '5 Years Exp.',
      rating: '4.92'
    }
  ];

  const filteredPrograms = selectedProgramCategory === 'all'
    ? programs
    : programs.filter((p) => p.category === selectedProgramCategory);

  const handleBookTrainer = (name: string) => {
    setBookingToast(`Trial session requested with Coach ${name}! Front desk notified.`);
    setTimeout(() => setBookingToast(null), 4000);
  };

  return (
    <div className="relative overflow-hidden bg-[#060709] text-zinc-100">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {bookingToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-6 z-50 flex items-center gap-2 rounded-xl border border-[#ccff00] bg-[#0c0f16] px-4 py-3 text-xs font-bold text-white shadow-xl"
          >
            <CheckCircle2 className="h-4 w-4 text-[#ccff00]" />
            <span>{bookingToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 1: HERO (IRONPULSE STYLE WITH CUTOUT & STAT BADGE)
          ───────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[85vh] border-b border-[#1c212e] py-12 lg:py-20 flex items-center">
        {/* Ambient background lighting */}
        <div className="pointer-events-none absolute top-10 left-1/4 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-emerald-500/5 blur-[120px]" />
        <div className="pointer-events-none absolute bottom-10 right-1/4 h-[400px] w-[400px] rounded-full bg-[#ccff00]/5 blur-[100px]" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 w-full">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              {/* Giant Bold Headline (IronPulse reference signature) */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-5xl font-black uppercase tracking-tight text-white sm:text-7xl lg:text-8xl leading-[0.95]"
              >
                NO EXCUSES.{' '}
                <span className="text-[#ccff00] block mt-1">
                  ONLY RESULTS.
                </span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="max-w-xl text-base leading-relaxed text-zinc-300 sm:text-lg font-normal"
              >
                Join a results-driven fitness community with certified trainers, modern bio-mechanical equipment, and personalized nutrition designed to transform your physique and performance.
              </motion.p>

              {/* Interactive CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-wrap items-center gap-4 pt-2"
              >
                <Button
                  size="lg"
                  variant="volt"
                  onClick={() => onOpenAddMember ? onOpenAddMember() : onSwitchMode('operations')}
                  className="rounded-full px-7 text-xs sm:text-sm font-extrabold uppercase tracking-wider"
                >
                  <span>Start Free Trial</span>
                  <ArrowUpRight className="h-4 w-4" />
                </Button>

                <Button
                  size="lg"
                  variant="secondary"
                  onClick={() => {
                    const el = document.getElementById('programs-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="rounded-full px-7 text-xs sm:text-sm font-extrabold uppercase tracking-wider"
                >
                  <span>Explore Programs</span>
                  <ArrowUpRight className="h-4 w-4 text-zinc-400" />
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => onSwitchMode('operations')}
                  className="rounded-full px-5 text-xs font-bold uppercase tracking-wider border-[#ccff00]/40 text-[#ccff00] hover:bg-[#ccff00] hover:text-black hover:border-[#ccff00]"
                >
                  <ShieldCheck className="h-4 w-4" />
                  <span>Admin Portal</span>
                  <Badge variant="default" className="text-[10px] py-0 px-1.5 font-mono">/admin</Badge>
                </Button>

                <Button
                  size="lg"
                  variant="secondary"
                  onClick={() => onSwitchMode('member_portal')}
                  className="rounded-full px-5 text-xs font-bold uppercase tracking-wider"
                >
                  <Users className="h-4 w-4 text-[#ccff00]" />
                  <span>Member Portal</span>
                  <Badge variant="secondary" className="text-[10px] py-0 px-1.5 font-mono text-zinc-400">/member</Badge>
                </Button>
              </motion.div>

              {/* Feature Checkpoints */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex flex-wrap items-center gap-5 pt-4 text-xs font-medium text-zinc-400"
              >
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-[#ccff00]" />
                  1-Tap WhatsApp Receipts
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-[#ccff00]" />
                  Peak-Hour Machine Swap
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-[#ccff00]" />
                  High-Protein Indian Macro Plan
                </span>
              </motion.div>
            </div>

            {/* Right Showcase: Real Athlete Visual & Floating Stat Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.25 }}
              className="lg:col-span-5 relative"
            >
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Hero Athlete Image Card */}
                <div className="relative aspect-4/5 overflow-hidden rounded-3xl border border-[#262c3e] bg-[#0c0f16] shadow-2xl">
                  <Image
                    src="/images/gym_hero_athlete.jpg"
                    alt="Athlete training with dumbbells"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority
                    className="object-cover object-center filter brightness-95"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#060709] via-transparent to-transparent opacity-80" />

                  {/* Corner Badge */}
                  <div className="absolute top-4 left-4 rounded-full border border-[#ccff00]/40 bg-[#060709]/80 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#ccff00] backdrop-blur-md">
                    IronPulse Performance
                  </div>
                </div>

                {/* Floating Member Stat Badge (IronPulse reference signature element - flattened hierarchy) */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45 }}
                  className="absolute -bottom-6 -left-6 sm:left-4 rounded-2xl border border-[#2e374e] bg-[#0d111a]/95 p-4 shadow-2xl backdrop-blur-lg w-72"
                >
                  <div className="flex items-center justify-between border-b border-[#222838] pb-2.5">
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-2 overflow-hidden">
                        <div className="inline-block h-7 w-7 rounded-full ring-2 ring-[#0c0f16] bg-[#ccff00] flex items-center justify-center text-xs font-black text-black">
                          RS
                        </div>
                        <div className="inline-block h-7 w-7 rounded-full ring-2 ring-[#0c0f16] bg-emerald-400 flex items-center justify-center text-xs font-black text-black">
                          AK
                        </div>
                        <div className="inline-block h-7 w-7 rounded-full ring-2 ring-[#0c0f16] bg-cyan-400 flex items-center justify-center text-xs font-black text-black">
                          VN
                        </div>
                      </div>
                      <span className="text-xs font-bold text-white">10,000+ Lifters</span>
                    </div>
                    <span className="flex items-center gap-1 text-xs font-bold text-[#ccff00]">
                      <Star className="h-3.5 w-3.5 fill-[#ccff00]" />
                      4.9
                    </span>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-xs px-1">
                    <div>
                      <span className="text-zinc-400">Experience: </span>
                      <span className="font-extrabold text-white">8+ Years</span>
                    </div>
                    <div>
                      <span className="text-zinc-400">Today: </span>
                      <span className="font-extrabold text-[#ccff00]">{todayCheckInsCount} In-Gym</span>
                    </div>
                  </div>
                </motion.div>

              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 2: WHY TRAIN WITH US? (BENTO MACHINES & HIGHLIGHTED CARDS)
          ───────────────────────────────────────────────────────────── */}
      <section className="relative border-b border-[#1c212e] py-16 sm:py-24 bg-[#090b10]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-10 text-center sm:text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-[#ccff00]">
              The GymPRO Difference
            </span>
            <h2 className="mt-1 text-3xl font-black uppercase tracking-tight text-white sm:text-5xl">
              Why Train With Us?
            </h2>
          </div>

          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
            
            {/* Left: Luxury Equipment Machinery Visual */}
            <div className="lg:col-span-6">
              <div className="relative aspect-4/3 overflow-hidden rounded-3xl border border-[#262c3e] bg-[#0c0f16] shadow-xl">
                <Image
                  src="/images/gym_equipment_modern.jpg"
                  alt="Modern bio-mechanical fitness machines"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover object-center filter brightness-95"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#060709] via-transparent to-transparent opacity-60" />

                <div className="absolute bottom-4 left-4 right-4 rounded-xl border border-[#2a3246] bg-[#07090e]/90 p-3 backdrop-blur-md">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-bold text-white">Bio-Mechanical Cable & Free-Weight Arena</h3>
                      <p className="text-xs text-zinc-400">Main Facility • Sector 15 Branch</p>
                    </div>
                    <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs font-bold text-emerald-400">
                      Tier A Standard
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Bento Feature Stack (with Neon Volt active highlight like reference) */}
            <div className="lg:col-span-6 space-y-3">
              {features.map((feature, idx) => {
                const isActive = activeFeatureIndex === idx;
                const IconComponent = feature.icon;

                return (
                  <button
                    key={feature.title}
                    onClick={() => setActiveFeatureIndex(idx)}
                    className={`w-full text-left rounded-2xl p-4 sm:p-5 transition-all duration-300 border ${
                      isActive
                        ? 'bg-[#ccff00] text-black border-[#ccff00] shadow-lg transform scale-[1.02]'
                        : 'bg-[#0f131c] text-white border-[#222736] hover:border-zinc-600 hover:bg-[#141925]'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl font-bold ${
                          isActive
                            ? 'bg-black text-[#ccff00]'
                            : 'bg-[#1b2233] text-zinc-300'
                        }`}
                      >
                        <IconComponent className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className={`text-base sm:text-lg font-black uppercase tracking-tight ${
                          isActive ? 'text-black' : 'text-white'
                        }`}>
                          {feature.title}
                        </h3>
                        <p className={`mt-1 text-xs sm:text-sm font-medium leading-relaxed ${
                          isActive ? 'text-zinc-900' : 'text-zinc-400'
                        }`}>
                          {feature.desc}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 3: OUR TRAINING PROGRAMS (INTERACTIVE BENTO GRID)
          ───────────────────────────────────────────────────────────── */}
      <section id="programs-section" className="relative border-b border-[#1c212e] py-16 sm:py-24 bg-[#060709]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#ccff00]">
                Curated Periodization
              </span>
              <h2 className="mt-1 text-3xl font-black uppercase tracking-tight text-white sm:text-5xl">
                Our Training Programs
              </h2>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center gap-2">
              {[
                { id: 'all', label: 'All Programs' },
                { id: 'strength', label: 'Weight Training' },
                { id: 'conditioning', label: 'Cardio & Fat Loss' },
                { id: 'personal', label: '1-on-1 Coaching' },
                { id: 'mobility', label: 'Yoga & Recovery' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedProgramCategory(tab.id)}
                  className={`rounded-full px-4 py-2 text-xs font-bold transition-all ${
                    selectedProgramCategory === tab.id
                      ? 'bg-[#ccff00] text-black shadow-sm'
                      : 'border border-[#262c3e] bg-[#0d1017] text-zinc-400 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Program Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPrograms.map((program) => (
              <div
                key={program.id}
                className="group relative overflow-hidden rounded-3xl border border-[#222738] bg-[#0c0f16] p-6 transition-all duration-300 hover:border-[#ccff00]/60 hover:bg-[#10141f]"
              >
                <div className="flex items-center justify-between border-b border-[#1f2434] pb-4">
                  <span className="rounded-full bg-[#ccff00]/10 px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-[#ccff00] border border-[#ccff00]/20">
                    {program.intensity}
                  </span>
                  <span className="flex items-center gap-1 text-xs font-mono text-zinc-400">
                    <Clock className="h-3.5 w-3.5" />
                    {program.duration}
                  </span>
                </div>

                <div className="mt-5">
                  <h3 className="text-xl font-black uppercase tracking-tight text-white group-hover:text-[#ccff00] transition-colors">
                    {program.title}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-zinc-400 leading-relaxed font-normal">
                    {program.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#1f2434] flex items-center justify-between">
                  <button
                    onClick={() => onSwitchMode('member_portal')}
                    className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#ccff00] group-hover:underline"
                  >
                    <span>Launch in Member Arena</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </button>

                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1b2130] text-zinc-300 group-hover:bg-[#ccff00] group-hover:text-black transition-colors">
                    <Play className="h-3.5 w-3.5 fill-current ml-0.5" />
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 4: MEET OUR EXPERT TRAINERS (COACHES + BOOKING)
          ───────────────────────────────────────────────────────────── */}
      <section className="relative border-b border-[#1c212e] py-16 sm:py-24 bg-[#090b10]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#ccff00]">
                Master Coaches
              </span>
              <h2 className="mt-1 text-3xl font-black uppercase tracking-tight text-white sm:text-5xl">
                Meet Our Expert Trainers
              </h2>
            </div>
            
            <p className="max-w-md text-xs sm:text-sm text-zinc-400">
              Certified exercise physiologists and Indian nutrition specialists dedicated to your progressive overload.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {trainers.map((trainer) => (
              <div
                key={trainer.name}
                className="rounded-3xl border border-[#222738] bg-[#0c0f16] p-6 transition-all hover:border-[#ccff00]/40"
              >
                <div className="flex items-center justify-between pb-4 border-b border-[#1e2332]">
                  <div>
                    <h3 className="text-lg font-black uppercase tracking-tight text-white">
                      {trainer.name}
                    </h3>
                    <p className="text-xs text-[#ccff00] font-bold">{trainer.role}</p>
                  </div>
                  <span className="flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-bold text-amber-400 border border-amber-500/20">
                    <Star className="h-3 w-3 fill-amber-400" />
                    {trainer.rating}
                  </span>
                </div>

                <div className="mt-4 space-y-2 text-xs text-zinc-300">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Specialty:</span>
                    <span className="font-semibold">{trainer.spec}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Experience:</span>
                    <span className="font-mono font-semibold text-emerald-400">{trainer.exp}</span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-[#1e2332]">
                  <button
                    onClick={() => handleBookTrainer(trainer.name)}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#ccff00] py-2.5 text-xs font-extrabold uppercase tracking-wider text-black hover:bg-[#b5e600] transition-colors"
                  >
                    <span>Book A Session</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 5: CHOOSE YOUR PLAN (PRICING WITH PRO HIGHLIGHT)
          ───────────────────────────────────────────────────────────── */}
      <section className="relative border-b border-[#1c212e] py-16 sm:py-24 bg-[#060709]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-[#ccff00]">
              Transparent Investment
            </span>
            <h2 className="mt-1 text-3xl font-black uppercase tracking-tight text-white sm:text-5xl">
              Choose Your Plan
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-zinc-400">
              Clear fees with zero hidden charges. Instant UPI confirmation and direct WhatsApp receipts.
            </p>

            {/* Monthly / Yearly Toggle */}
            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-[#222738] bg-[#0c0f16] p-1.5">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`rounded-full px-5 py-2 text-xs font-bold transition-all ${
                  billingCycle === 'monthly'
                    ? 'bg-[#ccff00] text-black shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('yearly')}
                className={`flex items-center gap-1.5 rounded-full px-5 py-2 text-xs font-bold transition-all ${
                  billingCycle === 'yearly'
                    ? 'bg-[#ccff00] text-black shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <span>Annual Elite</span>
                <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs font-bold text-emerald-400">
                  -25%
                </span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            
            {/* Plan 1: Basic */}
            <div className="flex flex-col justify-between rounded-3xl border border-[#222738] bg-[#0c0f16] p-7 transition-all">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Basic Tier</span>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-4xl font-black text-white">₹{billingCycle === 'monthly' ? '1,499' : '14,999'}</span>
                  <span className="text-xs text-zinc-400 font-mono">/{billingCycle === 'monthly' ? 'month' : 'year'}</span>
                </div>
                <p className="mt-3 text-xs text-zinc-400">
                  Ideal for self-directed athletes requiring standard gym access.
                </p>

                <ul className="mt-6 space-y-3 text-xs text-zinc-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>Gym Arena Access</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>Full Equipment Access</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>2 Group Classes</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>Standard Day Locker</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8 pt-4 border-t border-[#1f2434]">
                <button
                  onClick={() => onOpenAddMember ? onOpenAddMember() : onSwitchMode('operations')}
                  className="w-full rounded-xl border border-zinc-700 bg-[#161b26] py-3 text-xs font-extrabold uppercase tracking-wider text-white hover:border-[#ccff00] transition-colors"
                >
                  Get Started
                </button>
              </div>
            </div>

            {/* Plan 2: Pro (HIGHLIGHTED IN VOLT ACCENT LIKE IRONPULSE REFERENCE) */}
            <div className="relative flex flex-col justify-between rounded-3xl border-2 border-[#ccff00] bg-[#0f141f] p-7 shadow-2xl transform lg:-translate-y-2">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-[#ccff00] px-4 py-1 text-xs font-black uppercase tracking-wider text-black">
                Most Popular
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#ccff00]">Pro Tier</span>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-4xl font-black text-white">₹{billingCycle === 'monthly' ? '3,999' : '36,000'}</span>
                  <span className="text-xs text-zinc-400 font-mono">/{billingCycle === 'monthly' ? 'quarter' : 'year'}</span>
                </div>
                <p className="mt-3 text-xs text-zinc-300">
                  Complete hybrid package with personalized guidance and WhatsApp invoices.
                </p>

                <ul className="mt-6 space-y-3 text-xs text-zinc-200">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#ccff00] shrink-0" />
                    <span className="font-semibold text-white">Unlimited All-Branch Access</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#ccff00] shrink-0" />
                    <span>1 Personal Trainer Session / mo</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#ccff00] shrink-0" />
                    <span>Indian Macro Diet Consultation</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#ccff00] shrink-0" />
                    <span>Instant WhatsApp Fee Receipts</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#ccff00] shrink-0" />
                    <span>Peak-Hour Equipment Swap Engine</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8 pt-4 border-t border-[#262c3e]">
                <button
                  onClick={() => onOpenAddMember ? onOpenAddMember() : onSwitchMode('operations')}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#ccff00] py-3.5 text-xs font-black uppercase tracking-wider text-black hover:bg-[#b5e600] transition-all shadow-md"
                >
                  <span>Join Pro Now</span>
                  <ArrowUpRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Plan 3: Elite */}
            <div className="flex flex-col justify-between rounded-3xl border border-[#222738] bg-[#0c0f16] p-7 transition-all">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Elite Tier</span>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-4xl font-black text-white">₹{billingCycle === 'monthly' ? '9,999' : '99,000'}</span>
                  <span className="text-xs text-zinc-400 font-mono">/{billingCycle === 'monthly' ? '6-mo' : 'year'}</span>
                </div>
                <p className="mt-3 text-xs text-zinc-400">
                  Full concierge VIP experience with dedicated master coaching.
                </p>

                <ul className="mt-6 space-y-3 text-xs text-zinc-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>Everything in Pro</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>8 Personal Training Sessions</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>Custom Vegetarian / Non-Veg Macros</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>Priority Support & Dedicated Locker</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8 pt-4 border-t border-[#1f2434]">
                <button
                  onClick={() => onOpenAddMember ? onOpenAddMember() : onSwitchMode('operations')}
                  className="w-full rounded-xl border border-zinc-700 bg-[#161b26] py-3 text-xs font-extrabold uppercase tracking-wider text-white hover:border-[#ccff00] transition-colors"
                >
                  Contact Concierge
                </button>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 6: REAL RESULTS. REAL PEOPLE. (TRANSFORMATIONS)
          ───────────────────────────────────────────────────────────── */}
      <section className="relative border-b border-[#1c212e] py-16 sm:py-24 bg-[#090b10]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          
          <div className="mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-[#ccff00]">
              Proven Evidence
            </span>
            <h2 className="mt-1 text-3xl font-black uppercase tracking-tight text-white sm:text-5xl">
              Real Results. Real People.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Transformation 1 with animated sparkline curve */}
            <div className="rounded-3xl border border-[#222738] bg-[#0c0f16] p-6">
              <div className="flex items-center justify-between pb-3 border-b border-[#1f2434]">
                <div>
                  <h3 className="text-base font-black text-white">Rahul M.</h3>
                  <p className="text-xs text-zinc-400">Software Architect • Bengaluru</p>
                </div>
                <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/20">
                  -15 kg Body Fat
                </span>
              </div>

              <p className="mt-4 text-xs sm:text-sm text-zinc-300 italic leading-relaxed">
                &ldquo;Joining GymPRO transformed my routine. The high-protein Indian diet plan with soya & paneer fit seamlessly into my lifestyle. Lost 15kg in 6 months.&rdquo;
              </p>

              {/* Progress Sparkline SVG (IronPulse visual signature - flattened) */}
              <div className="mt-6 pt-4 border-t border-[#1f2434]">
                <div className="flex items-center justify-between text-xs text-zinc-400 mb-2">
                  <span>Weight Progression</span>
                  <span className="font-mono font-bold text-[#ccff00]">88kg → 73kg</span>
                </div>
                <svg className="w-full h-16 stroke-[#ccff00]" viewBox="0 0 200 60" fill="none">
                  <path
                    d="M 10,15 Q 60,25 100,35 T 190,52"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  <circle cx="10" cy="15" r="4" fill="#ccff00" />
                  <circle cx="100" cy="35" r="4" fill="#ccff00" />
                  <circle cx="190" cy="52" r="4" fill="#ccff00" />
                </svg>
              </div>
            </div>

            {/* Transformation 2 */}
            <div className="rounded-3xl border border-[#222738] bg-[#0c0f16] p-6">
              <div className="flex items-center justify-between pb-3 border-b border-[#1f2434]">
                <div>
                  <h3 className="text-base font-black text-white">Ananya K.</h3>
                  <p className="text-xs text-zinc-400">Management Consultant • Gurgaon</p>
                </div>
                <span className="rounded-full bg-[#ccff00]/10 px-2.5 py-1 text-xs font-bold text-[#ccff00] border border-[#ccff00]/20">
                  +40kg Deadlift
                </span>
              </div>

              <p className="mt-4 text-xs sm:text-sm text-zinc-300 italic leading-relaxed">
                &ldquo;Coach Vikram dialled in my posterior chain biomechanics. Deadlift shot from 45kg to 125kg without lower back pain.&rdquo;
              </p>

              <div className="mt-6 pt-4 border-t border-[#1f2434]">
                <div className="flex items-center justify-between text-xs text-zinc-400 mb-2">
                  <span>Strength PR Curve</span>
                  <span className="font-mono font-bold text-[#ccff00]">45kg → 125kg</span>
                </div>
                <svg className="w-full h-16 stroke-[#ccff00]" viewBox="0 0 200 60" fill="none">
                  <path
                    d="M 10,50 Q 70,40 110,25 T 190,10"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  <circle cx="10" cy="50" r="4" fill="#ccff00" />
                  <circle cx="110" cy="25" r="4" fill="#ccff00" />
                  <circle cx="190" cy="10" r="4" fill="#ccff00" />
                </svg>
              </div>
            </div>

            {/* Transformation 3 */}
            <div className="rounded-3xl border border-[#222738] bg-[#0c0f16] p-6">
              <div className="flex items-center justify-between pb-3 border-b border-[#1f2434]">
                <div>
                  <h3 className="text-base font-black text-white">Sameer D.</h3>
                  <p className="text-xs text-zinc-400">Tech Founder • Delhi</p>
                </div>
                <span className="rounded-full bg-cyan-500/10 px-2.5 py-1 text-xs font-bold text-cyan-400 border border-cyan-500/20">
                  Consistent Attendance
                </span>
              </div>

              <p className="mt-4 text-xs sm:text-sm text-zinc-300 italic leading-relaxed">
                &ldquo;The peak-hour machine swap button is a game-changer. When the bench press is occupied at 7:30 PM, it immediately swaps to heavy dumbbell press.&rdquo;
              </p>

              <div className="mt-6 pt-4 border-t border-[#1f2434]">
                <div className="flex items-center justify-between text-xs text-zinc-400 mb-2">
                  <span>Monthly Sessions</span>
                  <span className="font-mono font-bold text-cyan-400">22 Days / Mo</span>
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
          FLOATING ALFIRZA-STYLE GLASS NOTIFICATION (REFERENCE IMAGE 1)
          ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {!isAlfirzaCardDismissed && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-40 max-w-sm rounded-2xl border border-[#2a3144] bg-[#0e121bf0] p-4 shadow-2xl backdrop-blur-xl"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#ccff00] text-black font-black text-xs">
                  GP
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white leading-tight">
                    Let&apos;s power your next gym milestone.
                  </h3>
                  <p className="text-xs text-zinc-400 font-mono">Sector 15 Live Telemetry</p>
                </div>
              </div>

              <button
                onClick={() => setIsAlfirzaCardDismissed(true)}
                className="text-zinc-400 hover:text-white"
                title="Dismiss"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="mt-2 text-xs text-zinc-300 leading-relaxed">
              Count on us for instant QR check-ins, zero dues slippage, and real-time machine swaps during peak hours.
            </p>

            <div className="mt-3 flex items-center justify-between border-t border-[#1f2434] pt-2.5">
              <button
                onClick={() => onSwitchMode('operations')}
                className="flex items-center gap-1.5 text-xs font-bold text-[#ccff00] hover:underline"
              >
                <span>Launch Admin Portal</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </button>

              <button
                onClick={() => onSwitchMode('member_portal')}
                className="flex items-center gap-1 text-xs font-medium text-zinc-400 hover:text-white"
              >
                <span>Workout Arena →</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
