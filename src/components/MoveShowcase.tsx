'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  ChevronRight,
  Droplets,
  Flame,
  Dumbbell,
  ShieldCheck,
  Award,
  Zap,
  Heart,
  Mountain,
  Mail,
  Check,
  X,
  Sparkles,
  ArrowUpRight,
  Clock,
  Activity,
  Users
} from 'lucide-react';
import { FacilityArchitectureDiagram } from './FacilityArchitectureDiagram';

interface MoveShowcaseProps {
  onSwitchMode?: (mode: 'showcase' | 'operations' | 'member_portal') => void;
  onOpenAddMember?: () => void;
  hideHeader?: boolean;
}

export function MoveShowcase({ onSwitchMode, onOpenAddMember, hideHeader = true }: MoveShowcaseProps) {
  const [emailInput, setEmailInput] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedQuickView, setSelectedQuickView] = useState<string | null>(null);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput && emailInput.includes('@')) {
      setIsSubscribed(true);
      setTimeout(() => setIsSubscribed(false), 5000);
      setEmailInput('');
    }
  };

  // 5 Training Pillars using circular outline design element
  const trainingPillars = [
    {
      id: 'free-weights',
      label: 'FREE WEIGHTS',
      icon: <Dumbbell className="w-6 h-6 stroke-[1.8]" />
    },
    {
      id: 'power-rigs',
      label: 'POWER RIGS',
      icon: (
        <svg className="w-6 h-6 stroke-current fill-none stroke-[1.8]" viewBox="0 0 24 24">
          <rect x="4" y="3" width="16" height="18" rx="2" />
          <line x1="4" y1="9" x2="20" y2="9" />
          <line x1="4" y1="15" x2="20" y2="15" />
          <line x1="12" y1="3" x2="12" y2="21" />
        </svg>
      )
    },
    {
      id: 'cardio',
      label: 'CARDIO & METCON',
      icon: <Flame className="w-6 h-6 stroke-[1.8]" />
    },
    {
      id: 'coaching',
      label: '1-ON-1 COACHING',
      icon: <Award className="w-6 h-6 stroke-[1.8]" />
    },
    {
      id: 'recovery',
      label: 'RECOVERY SUITE',
      icon: <Droplets className="w-6 h-6 stroke-[1.8]" />
    }
  ];

  // Authentic community training photos
  const communityPhotos = [
    {
      id: 'com-1',
      img: '/images/gym_hero_athlete.jpg',
      tag: '@vikram_heavy_squats'
    },
    {
      id: 'com-2',
      img: '/images/gym_equipment_modern.jpg',
      tag: '@ironpulse_floor'
    },
    {
      id: 'com-3',
      img: '/images/gym_trainers_group.jpg',
      tag: '@coaching_cadre'
    },
    {
      id: 'com-4',
      img: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&h=750&q=80',
      tag: '@priya_conditioning'
    },
    {
      id: 'com-5',
      img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&h=750&q=80',
      tag: '@strength_protocol'
    }
  ];

  return (
    <div className="w-full bg-[#0a0a0c] text-white selection:bg-[#ccff00] selection:text-black min-h-screen font-sans">
      {/* ─────────────────────────────────────────────────────────────
          1. HERO SECTION: "SHIFT YOUR LIMITS. ELEVATE YOUR LIFE."
      ───────────────────────────────────────────────────────────── */}
      <section className="relative w-full min-h-[580px] sm:min-h-[640px] lg:min-h-[720px] flex items-center overflow-hidden border-b border-white/5">
        {/* Background Image: Authentic Gym Lifter Arena */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/gym_hero_athlete.jpg"
            alt="GymPRO Strength Athlete"
            className="w-full h-full object-cover object-top opacity-40 contrast-125 brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0c] via-[#0a0a0c]/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-transparent to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 w-full">
          <div className="max-w-xl">
            {/* Main Display Headline (Exact 4-line typography rhythm) */}
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black uppercase tracking-tight text-white leading-[0.92]">
              SHIFT
              <br />
              YOUR LIMITS.
              <br />
              ELEVATE
              <br />
              YOUR LIFE.
            </h1>

            {/* Neon lime accent dash */}
            <div className="w-12 h-1 bg-[#ccff00] mt-4 mb-4" />

            <p className="text-zinc-300 text-sm sm:text-base font-normal max-w-md mb-8 leading-relaxed">
              Competition Olympic barbells, calibrated steel plates, heavy dumbbells up to 50kg, certified coaches, and custom nutrition plans.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4">
              <a
                href="#pricing"
                className="inline-flex items-center gap-2 rounded-full bg-[#ccff00] text-black font-extrabold text-xs tracking-wider uppercase px-7 py-3.5 hover:bg-[#b8e600] active:scale-95 transition-all shadow-lg"
              >
                <span>CLAIM 1-DAY PASS</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </a>

              <a
                href="#facilities"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-transparent text-white font-bold text-xs tracking-wider uppercase px-6 py-3.5 hover:bg-white/10 active:scale-95 transition-all"
              >
                <span>EXPLORE FACILITIES</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          2. TRAINING PILLARS CIRCULAR ICONS (Element Reference from Image 1)
      ───────────────────────────────────────────────────────────── */}
      <section className="w-full py-10 sm:py-14 border-b border-white/5 bg-[#0e0f13]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-5 gap-3 sm:gap-6 text-center">
            {trainingPillars.map((cat) => {
              const isSelected = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(isSelected ? 'all' : cat.id)}
                  className="flex flex-col items-center gap-3 group focus:outline-none"
                >
                  <div
                    className={`w-14 h-14 sm:w-18 sm:h-18 md:w-20 md:h-20 rounded-full flex items-center justify-center border transition-all ${
                      isSelected
                        ? 'border-[#ccff00] bg-[#ccff00]/10 text-[#ccff00] scale-105'
                        : 'border-white/15 bg-white/5 text-zinc-300 group-hover:border-white/40 group-hover:text-white'
                    }`}
                  >
                    {cat.icon}
                  </div>
                  <span
                    className={`text-[10px] sm:text-xs font-extrabold tracking-wider uppercase transition-colors ${
                      isSelected ? 'text-[#ccff00]' : 'text-zinc-400 group-hover:text-white'
                    }`}
                  >
                    {cat.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. 3-CARD SHOWCASE GRID (Element Reference from Image 1)
      ───────────────────────────────────────────────────────────── */}
      <section id="facilities" className="w-full py-12 sm:py-16 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: FREE WEIGHTS & POWER RACKS */}
          <div className="group relative h-[440px] sm:h-[480px] rounded-2xl overflow-hidden bg-[#16171d] border border-white/10 flex flex-col justify-between p-6 transition-transform hover:-translate-y-1">
            <img
              src="/images/gym_equipment_modern.jpg"
              alt="Free Weights & Power Racks"
              className="absolute inset-0 w-full h-full object-cover object-center opacity-75 group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/60" />

            <div className="relative z-10">
              <h2 className="text-xl sm:text-2xl font-black uppercase text-white tracking-tight leading-tight">
                FREE WEIGHTS
                <br />
                & POWER RACKS
              </h2>
              <p className="text-xs text-zinc-300 font-medium mt-1">
                Eleiko competition barbells, calibrated steel plates, heavy dumbbells up to 50kg.
              </p>
            </div>

            <div className="relative z-10">
              <button
                onClick={() => setSelectedQuickView('Free Weights & Power Lifting Rig')}
                className="inline-flex items-center gap-1.5 text-xs font-black tracking-wider uppercase text-white group-hover:text-[#ccff00] transition-colors"
              >
                <span>EXPLORE ARENA</span>
                <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            </div>
          </div>

          {/* Card 2: CARDIO & CONDITIONING */}
          <div className="group relative h-[440px] sm:h-[480px] rounded-2xl overflow-hidden bg-[#16171d] border border-white/10 flex flex-col justify-between p-6 transition-transform hover:-translate-y-1">
            <img
              src="/images/gym_hero_athlete.jpg"
              alt="Cardio & Conditioning"
              className="absolute inset-0 w-full h-full object-cover object-top opacity-75 group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/60" />

            <div className="relative z-10">
              <h2 className="text-xl sm:text-2xl font-black uppercase text-white tracking-tight leading-tight">
                CARDIO &
                <br />
                METCON ZONES
              </h2>
              <p className="text-xs text-zinc-300 font-medium mt-1">
                Concept2 rowers, assault resistance bikes, and shock-absorbent sprint turf.
              </p>
            </div>

            <div className="relative z-10">
              <button
                onClick={() => setSelectedQuickView('Cardio & High-Output MetCon Arena')}
                className="inline-flex items-center gap-1.5 text-xs font-black tracking-wider uppercase text-white group-hover:text-[#ccff00] transition-colors"
              >
                <span>VIEW MACHINES</span>
                <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            </div>
          </div>

          {/* Card 3: 1-ON-1 COACHING & RECOVERY */}
          <div className="group relative h-[440px] sm:h-[480px] rounded-2xl overflow-hidden bg-[#16171d] border border-white/10 flex flex-col justify-between p-6 transition-transform hover:-translate-y-1">
            <img
              src="/images/gym_trainers_group.jpg"
              alt="Coaches & Recovery Suite"
              className="absolute inset-0 w-full h-full object-cover object-center opacity-75 group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/60" />

            <div className="relative z-10">
              <h2 className="text-xl sm:text-2xl font-black uppercase text-white tracking-tight leading-tight">
                1-ON-1 COACHES
                <br />
                & RECOVERY SUITE
              </h2>
              <p className="text-xs text-zinc-300 font-medium mt-1">
                Biomechanical form audits, Indian nutrition plans, and deep tissue recovery.
              </p>
            </div>

            <div className="relative z-10">
              <button
                onClick={() => setSelectedQuickView('Certified Coaching Cadre & Recovery Suite')}
                className="inline-flex items-center gap-1.5 text-xs font-black tracking-wider uppercase text-white group-hover:text-[#ccff00] transition-colors"
              >
                <span>MEET COACHES</span>
                <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          4. TECHNICAL STANDARDS STRIP (Element Reference from Image 1)
      ───────────────────────────────────────────────────────────── */}
      <section className="w-full py-10 border-y border-white/5 bg-[#090a0d]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-left">
            {/* Feature 1 */}
            <div className="flex items-start gap-3">
              <div className="shrink-0 mt-0.5 text-[#ccff00]">
                <Dumbbell className="w-6 h-6 stroke-[1.8]" />
              </div>
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-white">OLYMPIC SPEC</h4>
                <p className="text-[11px] text-zinc-400 mt-0.5">Eleiko steel plates & calibrated bars.</p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex items-start gap-3">
              <div className="shrink-0 mt-0.5 text-[#ccff00]">
                <ShieldCheck className="w-6 h-6 stroke-[1.8]" />
              </div>
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-white">CERTIFIED COACHES</h4>
                <p className="text-[11px] text-zinc-400 mt-0.5">CSCS & national powerlifting coaches.</p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex items-start gap-3">
              <div className="shrink-0 mt-0.5 text-[#ccff00]">
                <Activity className="w-6 h-6 stroke-[1.8]" />
              </div>
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-white">BIOMETRIC QR PASS</h4>
                <p className="text-[11px] text-zinc-400 mt-0.5">1-second contact-free reception check-in.</p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="flex items-start gap-3">
              <div className="shrink-0 mt-0.5 text-[#ccff00]">
                <Droplets className="w-6 h-6 stroke-[1.8]" />
              </div>
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-white">RECOVERY SUITE</h4>
                <p className="text-[11px] text-zinc-400 mt-0.5">Sauna, ice bath & spine decompression.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          5. FEATURE BANNER: "TRAIN. PERFORM. REPEAT."
      ───────────────────────────────────────────────────────────── */}
      <section className="w-full py-12 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="relative rounded-2xl overflow-hidden bg-[#121319] border border-white/10 min-h-[360px] sm:min-h-[420px] flex items-center">
          {/* Authentic Gym Lifter Banner Background */}
          <img
            src="/images/gym_hero_athlete.jpg"
            alt="Train Perform Repeat"
            className="absolute inset-0 w-full h-full object-cover object-center opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/80 to-black/50" />

          <div className="relative z-10 w-full p-8 sm:p-12 lg:p-16 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="max-w-lg">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white leading-tight">
                TRAIN.
                <br />
                PERFORM.
                <br />
                REPEAT.
              </h2>
              <p className="text-xs sm:text-sm text-zinc-300 mt-3 max-w-sm">
                Premier strength and conditioning arena built for dedicated lifters and daily transformations.
              </p>
              <div className="mt-6">
                <a
                  href="#pricing"
                  className="inline-flex items-center gap-2 rounded-full bg-[#ccff00] text-black font-extrabold text-xs tracking-wider uppercase px-6 py-3.5 hover:bg-[#b8e600] active:scale-95 transition-all shadow-md"
                >
                  <span>CLAIM FREE TRIAL PASS</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </a>
              </div>
            </div>

            {/* Right Side Badges */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Zap className="w-5 h-5 text-[#ccff00]" />
                <span className="text-xs font-black uppercase tracking-wider text-white">ENERGY UNLEASHED</span>
              </div>
              <div className="flex items-center gap-3">
                <Heart className="w-5 h-5 text-[#ccff00]" />
                <span className="text-xs font-black uppercase tracking-wider text-white">FOCUS ELEVATED</span>
              </div>
              <div className="flex items-center gap-3">
                <Mountain className="w-5 h-5 text-[#ccff00]" />
                <span className="text-xs font-black uppercase tracking-wider text-white">LIMITS LEFT BEHIND</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          6. #IRONPULSEATHLETES COMMUNITY ATHLETES ROW
      ───────────────────────────────────────────────────────────── */}
      <section className="w-full py-12 px-4 sm:px-6 max-w-7xl mx-auto border-t border-white/5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="shrink-0">
            <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white">#IRONPULSEATHLETES</h3>
            <p className="text-xs text-zinc-400 mt-0.5">Real lifters. Real transformations.</p>
          </div>

          {/* Authentic Gym Community Frames */}
          <div className="relative flex items-center gap-3 overflow-hidden">
            <div className="flex items-center gap-3 overflow-x-auto no-scrollbar scroll-smooth">
              {communityPhotos.map((item) => (
                <div
                  key={item.id}
                  className="relative w-32 h-44 sm:w-36 sm:h-52 shrink-0 rounded-xl overflow-hidden bg-zinc-800 border border-white/10 group cursor-pointer"
                  onClick={() => alert(`Showing training profile from ${item.tag}`)}
                >
                  <img
                    src={item.img}
                    alt={item.tag}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-transparent transition-colors" />
                  <div className="absolute bottom-1.5 left-1.5 right-1.5 text-center text-[9px] font-bold text-white bg-black/60 py-0.5 px-1 rounded backdrop-blur-sm truncate">
                    {item.tag}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => alert('Viewing more athlete transformations')}
              className="hidden sm:flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 hover:bg-[#ccff00] hover:text-black text-white transition-colors"
              title="View next"
            >
              <ChevronRight className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          EDITORIAL DIAGRAM-DESIGN: FACILITY ARCHITECTURE & ATHLETE FSM
      ───────────────────────────────────────────────────────────── */}
      <FacilityArchitectureDiagram />

      {/* ─────────────────────────────────────────────────────────────
          7. NEWSLETTER & VIP PASS REGISTRATION
      ───────────────────────────────────────────────────────────── */}
      <section className="w-full py-10 border-t border-white/5 bg-[#0a0a0c]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 rounded-2xl bg-[#121319] border border-white/10">
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="h-11 w-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-[#ccff00]">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-black uppercase tracking-wider text-white">BE THE FIRST TO KNOW</h4>
                <p className="text-xs text-zinc-400 mt-0.5">New equipment drops. Exclusive VIP passes. Training blueprints.</p>
              </div>
            </div>

            <form onSubmit={handleSubscribe} className="flex items-center gap-2 w-full md:max-w-md">
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 h-11 px-4 rounded-xl border border-white/15 bg-black text-xs text-white placeholder-zinc-500 outline-none focus:border-[#ccff00] transition-colors"
                required
              />
              <button
                type="submit"
                className="h-11 px-5 rounded-xl bg-[#ccff00] text-black font-extrabold hover:bg-[#b8e600] active:scale-95 transition-all flex items-center justify-center shrink-0"
              >
                {isSubscribed ? <Check className="w-4 h-4" /> : <ArrowRight className="w-4 h-4 stroke-[2.5]" />}
              </button>
            </form>
          </div>
          {isSubscribed && (
            <p className="text-xs text-[#ccff00] font-bold mt-2 text-center md:text-right">
              ✓ Thanks for subscribing! Welcome to GymPRO.
            </p>
          )}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          8. GYMPRO FOOTER
      ───────────────────────────────────────────────────────────── */}
      <footer className="w-full py-12 border-t border-white/5 bg-[#07080a] text-zinc-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 pb-10">
            {/* Logo Column */}
            <div className="col-span-2 md:col-span-1">
              <Link href="/" className="flex items-center gap-2 group mb-4">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#ccff00] text-black font-black">
                  <Dumbbell className="h-4 w-4" />
                </div>
                <span className="font-black text-xl tracking-tight text-white uppercase">
                  Gym<span className="text-[#ccff00]">PRO</span>
                </span>
              </Link>
              <p className="text-[11px] text-zinc-500 leading-relaxed">
                Operating multi-tenant commercial strength arenas, Olympic power rigs, and automated reception desks across India.
              </p>
            </div>

            {/* FACILITIES */}
            <div>
              <h5 className="text-white font-extrabold uppercase tracking-wider mb-3 text-[11px]">FACILITIES</h5>
              <ul className="space-y-2 text-[11px]">
                <li>
                  <a href="#facilities" className="hover:text-white transition-colors">
                    Olympic Power Racks
                  </a>
                </li>
                <li>
                  <a href="#facilities" className="hover:text-white transition-colors">
                    Free Weights Arena
                  </a>
                </li>
                <li>
                  <a href="#facilities" className="hover:text-white transition-colors">
                    MetCon Sprint Turf
                  </a>
                </li>
                <li>
                  <a href="#facilities" className="hover:text-[#ccff00] transition-colors">
                    Recovery Suite
                  </a>
                </li>
              </ul>
            </div>

            {/* PROGRAMS */}
            <div>
              <h5 className="text-white font-extrabold uppercase tracking-wider mb-3 text-[11px]">PROGRAMS</h5>
              <ul className="space-y-2 text-[11px]">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Strength & Hypertrophy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Cardio Fat Oxidation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    1-on-1 Personal Trainer
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Indian Nutrition Plans
                  </a>
                </li>
              </ul>
            </div>

            {/* GYM MANAGEMENT */}
            <div>
              <h5 className="text-white font-extrabold uppercase tracking-wider mb-3 text-[11px]">ADMIN PORTAL</h5>
              <ul className="space-y-2 text-[11px]">
                <li>
                  <Link href="/admin" className="hover:text-[#ccff00] transition-colors font-semibold">
                    Invoices & Accounts Desk
                  </Link>
                </li>
                <li>
                  <Link href="/admin" className="hover:text-white transition-colors">
                    Member Check-In Scanner
                  </Link>
                </li>
                <li>
                  <Link href="/admin" className="hover:text-white transition-colors">
                    WhatsApp Fee Reminders
                  </Link>
                </li>
                <li>
                  <Link href="/admin" className="hover:text-white transition-colors">
                    Equipment AMC Logs
                  </Link>
                </li>
              </ul>
            </div>

            {/* COMMUNITY */}
            <div>
              <h5 className="text-white font-extrabold uppercase tracking-wider mb-3 text-[11px]">HOURS & ACCESS</h5>
              <p className="text-[11px] text-zinc-400 mb-2 font-mono">
                Mon - Sat: 5:30 AM - 10:30 PM
                <br />
                Sun: 7:00 AM - 8:00 PM
              </p>
              <div className="flex items-center gap-2 mt-4 text-[#ccff00] text-[11px] font-bold">
                <Clock className="w-3.5 h-3.5" />
                <span>24/7 Biometric QR Enabled</span>
              </div>
            </div>
          </div>

          <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-500">
            <p>© 2026 GymPRO India. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <a href="#" className="hover:text-zinc-300 transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-zinc-300 transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Quick View Item Modal */}
      {selectedQuickView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md rounded-2xl border border-white/15 bg-[#12131a] p-6 shadow-2xl">
            <button
              onClick={() => setSelectedQuickView(null)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 text-[#ccff00] text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Facility Overview</span>
            </div>
            <h3 className="text-xl font-black text-white uppercase">{selectedQuickView}</h3>
            <p className="text-xs text-zinc-300 mt-2">
              Equipped with tournament-grade steel weights, certified spotters, and biomechanically calibrated motion paths.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <a
                href="#pricing"
                onClick={() => setSelectedQuickView(null)}
                className="flex-1 py-3 text-center rounded-full bg-[#ccff00] text-black font-extrabold text-xs uppercase tracking-wider hover:bg-[#b8e600] transition-colors"
              >
                Claim 1-Day Trial Pass
              </a>
              <button
                onClick={() => setSelectedQuickView(null)}
                className="py-3 px-5 rounded-full border border-white/20 text-white font-bold text-xs uppercase hover:bg-white/10"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
