'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Search,
  User,
  ShoppingBag,
  ArrowRight,
  ChevronRight,
  ChevronLeft,
  Mail,
  Zap,
  Heart,
  Mountain,
  Droplets,
  Maximize2,
  Feather,
  RefreshCw,
  Sparkles,
  Check,
  X
} from 'lucide-react';

interface MoveShowcaseProps {
  onSwitchMode?: (mode: 'showcase' | 'operations' | 'member_portal') => void;
  onOpenAddMember?: () => void;
  hideHeader?: boolean;
}

export function MoveShowcase({ onSwitchMode, onOpenAddMember, hideHeader = true }: MoveShowcaseProps) {
  const [emailInput, setEmailInput] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [cartCount, setCartCount] = useState(2);
  const [selectedQuickView, setSelectedQuickView] = useState<string | null>(null);
  const [carouselIndex, setCarouselIndex] = useState(0);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput && emailInput.includes('@')) {
      setIsSubscribed(true);
      setTimeout(() => setIsSubscribed(false), 5000);
      setEmailInput('');
    }
  };

  const categories = [
    {
      id: 'tops',
      label: 'TOPS',
      icon: (
        <svg className="w-6 h-6 stroke-current fill-none stroke-[1.5]" viewBox="0 0 24 24">
          <path d="M7 3h10l3 5-3 3-1-1v11H8V10L7 11 4 8l3-5z" />
          <path d="M10 3a2 2 0 0 0 4 0" />
        </svg>
      )
    },
    {
      id: 'bottoms',
      label: 'BOTTOMS',
      icon: (
        <svg className="w-6 h-6 stroke-current fill-none stroke-[1.5]" viewBox="0 0 24 24">
          <path d="M6 3h12l-1 18h-4.5l-.5-9-.5 9H7L6 3z" />
        </svg>
      )
    },
    {
      id: 'jackets',
      label: 'JACKETS',
      icon: (
        <svg className="w-6 h-6 stroke-current fill-none stroke-[1.5]" viewBox="0 0 24 24">
          <path d="M4 6l4-3h8l4 3v15H4V6z" />
          <path d="M12 3v18" />
          <path d="M8 8l4 3 4-3" />
        </svg>
      )
    },
    {
      id: 'footwear',
      label: 'FOOTWEAR',
      icon: (
        <svg className="w-6 h-6 stroke-current fill-none stroke-[1.5]" viewBox="0 0 24 24">
          <path d="M2 17h20v2a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-2z" />
          <path d="M4 17l4-9h8l4 9" />
          <path d="M8 11h8" />
        </svg>
      )
    },
    {
      id: 'accessories',
      label: 'ACCESSORIES',
      icon: (
        <svg className="w-6 h-6 stroke-current fill-none stroke-[1.5]" viewBox="0 0 24 24">
          <path d="M6 8h12v12a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V8z" />
          <path d="M9 8V5a3 3 0 0 1 6 0v3" />
          <circle cx="12" cy="14" r="1.5" />
        </svg>
      )
    }
  ];

  const communityPhotos = [
    {
      id: 'com-1',
      img: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&h=750&q=80',
      tag: '@marcus_run'
    },
    {
      id: 'com-2',
      img: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&h=750&q=80',
      tag: '@elena_fit'
    },
    {
      id: 'com-3',
      img: 'https://images.unsplash.com/photo-1483721310020-03333e577078?auto=format&fit=crop&w=600&h=750&q=80',
      tag: '@tyler_stride'
    },
    {
      id: 'com-4',
      img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&h=750&q=80',
      tag: '@sarah_active'
    },
    {
      id: 'com-5',
      img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&h=750&q=80',
      tag: '@david_pulse'
    }
  ];

  return (
    <div className="w-full bg-[#0a0a0c] text-white selection:bg-[#ccff00] selection:text-black min-h-screen font-sans">
      {/* ─────────────────────────────────────────────────────────────
          1. MOVE TOP NAVIGATION (Exact Image 1)
      ───────────────────────────────────────────────────────────── */}
      {!hideHeader && (
        <header className="sticky top-0 z-50 w-full bg-[#0a0a0c]/90 backdrop-blur-md border-b border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
            {/* Brand Logo */}
            <Link href="/" className="flex items-center gap-1.5 group">
              <span className="text-[#ccff00] font-black tracking-tighter text-2xl group-hover:scale-105 transition-transform">
                ///
              </span>
              <span className="font-black text-2xl tracking-tight text-white uppercase">MOVE</span>
            </Link>

            {/* Desktop Nav Links */}
            <nav className="hidden md:flex items-center gap-8 text-xs font-bold tracking-wider uppercase text-zinc-300">
              <a href="#men" className="hover:text-white transition-colors">
                MEN
              </a>
              <a href="#women" className="hover:text-white transition-colors">
                WOMEN
              </a>
              <a href="#accessories" className="hover:text-white transition-colors">
                ACCESSORIES
              </a>
              <a href="#collections" className="hover:text-white transition-colors">
                COLLECTIONS
              </a>
              <a href="#sale" className="text-[#ccff00] hover:brightness-110 transition-colors">
                SALE
              </a>
            </nav>

            {/* Utility Icons */}
            <div className="flex items-center gap-4 text-zinc-300">
              <button
                onClick={() => alert('Search MOVE apparel collection')}
                className="p-1.5 hover:text-white transition-colors"
                title="Search"
              >
                <Search className="w-5 h-5 stroke-[1.8]" />
              </button>

              {/* Account / Admin Portal link */}
              <button
                onClick={() => {
                  if (onSwitchMode) onSwitchMode('operations');
                }}
                className="p-1.5 hover:text-[#ccff00] transition-colors relative"
                title="Open Admin Console"
              >
                <User className="w-5 h-5 stroke-[1.8]" />
              </button>

              {/* Shopping Bag with (2) Badge */}
              <button
                onClick={() => alert('Shopping Bag: 2 items active')}
                className="p-1.5 hover:text-white transition-colors relative"
                title="Cart (2)"
              >
                <ShoppingBag className="w-5 h-5 stroke-[1.8]" />
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-[#ccff00] text-black text-[10px] font-black flex items-center justify-center">
                  {cartCount}
                </span>
              </button>
            </div>
          </div>
        </header>
      )}

      {/* ─────────────────────────────────────────────────────────────
          2. HERO SECTION: "SHIFT YOUR LIMITS. ELEVATE YOUR LIFE."
      ───────────────────────────────────────────────────────────── */}
      <section className="relative w-full min-h-[580px] sm:min-h-[640px] lg:min-h-[720px] flex items-center overflow-hidden border-b border-white/5">
        {/* Background Image: Running Duo in Urban Bridge Environment */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=2000&q=85"
            alt="Athletes Running"
            className="w-full h-full object-cover object-top opacity-50 contrast-125 brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0c] via-[#0a0a0c]/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-transparent to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 w-full">
          <div className="max-w-xl">
            {/* Main Display Headline */}
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

            <p className="text-zinc-300 text-sm sm:text-base font-normal max-w-md mb-8">
              Performance apparel designed for every move.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => setSelectedQuickView('New Arrivals 2026 Collection')}
                className="inline-flex items-center gap-2 rounded-full bg-[#ccff00] text-black font-extrabold text-xs tracking-wider uppercase px-7 py-3.5 hover:bg-[#b8e600] active:scale-95 transition-all shadow-lg"
              >
                <span>SHOP NEW IN</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>

              <button
                onClick={() => {
                  const el = document.getElementById('collections');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-transparent text-white font-bold text-xs tracking-wider uppercase px-6 py-3.5 hover:bg-white/10 active:scale-95 transition-all"
              >
                <span>EXPLORE COLLECTIONS</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. CATEGORY CIRCULAR ICONS ROW: TOPS, BOTTOMS, JACKETS, ETC.
      ───────────────────────────────────────────────────────────── */}
      <section className="w-full py-10 sm:py-14 border-b border-white/5 bg-[#0e0f13]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-5 gap-3 sm:gap-6 text-center">
            {categories.map((cat) => {
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
          4. 3-CARD COLLECTION GRID: WOMEN, MEN, NEW ARRIVALS
      ───────────────────────────────────────────────────────────── */}
      <section id="collections" className="w-full py-12 sm:py-16 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: WOMEN COLLECTION */}
          <div
            id="women"
            className="group relative h-[440px] sm:h-[480px] rounded-2xl overflow-hidden bg-[#16171d] border border-white/10 flex flex-col justify-between p-6 transition-transform hover:-translate-y-1"
          >
            <img
              src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80"
              alt="Women Collection"
              className="absolute inset-0 w-full h-full object-cover object-center opacity-85 group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/60" />

            <div className="relative z-10">
              <h2 className="text-xl sm:text-2xl font-black uppercase text-white tracking-tight leading-tight">
                WOMEN
                <br />
                COLLECTION
              </h2>
              <p className="text-xs text-zinc-300 font-medium mt-1">Engineered for strength & style.</p>
            </div>

            <div className="relative z-10">
              <button
                onClick={() => setSelectedQuickView('Women High-Performance Collection')}
                className="inline-flex items-center gap-1.5 text-xs font-black tracking-wider uppercase text-white group-hover:text-[#ccff00] transition-colors"
              >
                <span>SHOP WOMEN</span>
                <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            </div>
          </div>

          {/* Card 2: MEN COLLECTION */}
          <div
            id="men"
            className="group relative h-[440px] sm:h-[480px] rounded-2xl overflow-hidden bg-[#16171d] border border-white/10 flex flex-col justify-between p-6 transition-transform hover:-translate-y-1"
          >
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80"
              alt="Men Collection"
              className="absolute inset-0 w-full h-full object-cover object-top opacity-85 group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/60" />

            <div className="relative z-10">
              <h2 className="text-xl sm:text-2xl font-black uppercase text-white tracking-tight leading-tight">
                MEN
                <br />
                COLLECTION
              </h2>
              <p className="text-xs text-zinc-300 font-medium mt-1">Built for performance. Made to move.</p>
            </div>

            <div className="relative z-10">
              <button
                onClick={() => setSelectedQuickView('Men Training & Conditioning Series')}
                className="inline-flex items-center gap-1.5 text-xs font-black tracking-wider uppercase text-white group-hover:text-[#ccff00] transition-colors"
              >
                <span>SHOP MEN</span>
                <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            </div>
          </div>

          {/* Card 3: NEW ARRIVALS */}
          <div className="group relative h-[440px] sm:h-[480px] rounded-2xl overflow-hidden bg-[#16171d] border border-white/10 flex flex-col justify-between p-6 transition-transform hover:-translate-y-1">
            <img
              src="https://images.unsplash.com/photo-1483721310020-03333e577078?auto=format&fit=crop&w=800&q=80"
              alt="New Arrivals"
              className="absolute inset-0 w-full h-full object-cover object-center opacity-85 group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/60" />

            <div className="relative z-10">
              <h2 className="text-xl sm:text-2xl font-black uppercase text-white tracking-tight leading-tight">
                NEW
                <br />
                ARRIVALS
              </h2>
              <p className="text-xs text-zinc-300 font-medium mt-1">The latest drops for your best self.</p>
            </div>

            <div className="relative z-10">
              <button
                onClick={() => setSelectedQuickView('New Arrivals Limited Drop')}
                className="inline-flex items-center gap-1.5 text-xs font-black tracking-wider uppercase text-white group-hover:text-[#ccff00] transition-colors"
              >
                <span>SHOP NEW IN</span>
                <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          5. TECHNICAL BENEFIT BADGES (4 Columns Exact Image 1)
      ───────────────────────────────────────────────────────────── */}
      <section className="w-full py-10 border-y border-white/5 bg-[#090a0d]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-left">
            {/* Feature 1 */}
            <div className="flex items-start gap-3">
              <div className="shrink-0 mt-0.5 text-[#ccff00]">
                <Droplets className="w-6 h-6 stroke-[1.8]" />
              </div>
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-white">MOISTURE WICKING</h4>
                <p className="text-[11px] text-zinc-400 mt-0.5">Stay dry. Stay focused.</p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex items-start gap-3">
              <div className="shrink-0 mt-0.5 text-[#ccff00]">
                <Maximize2 className="w-6 h-6 stroke-[1.8]" />
              </div>
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-white">4-WAY STRETCH</h4>
                <p className="text-[11px] text-zinc-400 mt-0.5">Move freely in every direction.</p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex items-start gap-3">
              <div className="shrink-0 mt-0.5 text-[#ccff00]">
                <Feather className="w-6 h-6 stroke-[1.8]" />
              </div>
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-white">LIGHTWEIGHT</h4>
                <p className="text-[11px] text-zinc-400 mt-0.5">Featherlight feel. Heavy on performance.</p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="flex items-start gap-3">
              <div className="shrink-0 mt-0.5 text-[#ccff00]">
                <RefreshCw className="w-6 h-6 stroke-[1.8]" />
              </div>
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-white">SUSTAINABLE</h4>
                <p className="text-[11px] text-zinc-400 mt-0.5">Better for you. Better for the planet.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          6. FEATURE BANNER: "TRAIN. PERFORM. REPEAT."
      ───────────────────────────────────────────────────────────── */}
      <section className="w-full py-12 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="relative rounded-2xl overflow-hidden bg-[#121319] border border-white/10 min-h-[360px] sm:min-h-[420px] flex items-center">
          {/* Background image of female athlete */}
          <img
            src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1600&q=80"
            alt="Train Perform Repeat"
            className="absolute inset-0 w-full h-full object-cover object-center opacity-45"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/40" />

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
                High-performance gear for training, running & everyday.
              </p>
              <div className="mt-6">
                <button
                  onClick={() => setSelectedQuickView('High-Performance Training Gear')}
                  className="inline-flex items-center gap-2 rounded-full bg-[#ccff00] text-black font-extrabold text-xs tracking-wider uppercase px-6 py-3.5 hover:bg-[#b8e600] active:scale-95 transition-all shadow-md"
                >
                  <span>SHOP PERFORMANCE</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </button>
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
          7. #MOVEMENTMAKERS COMMUNITY PHOTO CAROUSEL
      ───────────────────────────────────────────────────────────── */}
      <section className="w-full py-12 px-4 sm:px-6 max-w-7xl mx-auto border-t border-white/5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="shrink-0">
            <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white">#MOVEMENTMAKERS</h3>
            <p className="text-xs text-zinc-400 mt-0.5">Real people. Real movement.</p>
          </div>

          {/* 5-Photo Row with Nav Button */}
          <div className="relative flex items-center gap-3 overflow-hidden">
            <div className="flex items-center gap-3 overflow-x-auto no-scrollbar scroll-smooth">
              {communityPhotos.map((item, idx) => (
                <div
                  key={item.id}
                  className="relative w-32 h-44 sm:w-36 sm:h-52 shrink-0 rounded-xl overflow-hidden bg-zinc-800 border border-white/10 group cursor-pointer"
                  onClick={() => alert(`Showing post from ${item.tag}`)}
                >
                  <img
                    src={item.img}
                    alt={item.tag}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                  <div className="absolute bottom-1.5 left-1.5 right-1.5 text-center text-[9px] font-bold text-white bg-black/60 py-0.5 px-1 rounded backdrop-blur-sm">
                    {item.tag}
                  </div>
                </div>
              ))}
            </div>

            {/* Next arrow icon button on the right */}
            <button
              onClick={() => alert('Viewing more community photos from #MOVEMENTMAKERS')}
              className="hidden sm:flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 hover:bg-[#ccff00] hover:text-black text-white transition-colors"
              title="View next"
            >
              <ChevronRight className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          8. NEWSLETTER: "BE THE FIRST TO KNOW"
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
                <p className="text-xs text-zinc-400 mt-0.5">New drops. Exclusive offers. Training tips.</p>
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
              ✓ Thanks for subscribing! Welcome to the MOVE club.
            </p>
          )}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          9. MOVE FOOTER (Exact Image 1)
      ───────────────────────────────────────────────────────────── */}
      <footer className="w-full py-12 border-t border-white/5 bg-[#07080a] text-zinc-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 pb-10">
            {/* Logo Column */}
            <div className="col-span-2 md:col-span-1">
              <Link href="/" className="flex items-center gap-1.5 group mb-4">
                <span className="text-[#ccff00] font-black tracking-tighter text-2xl">///</span>
                <span className="font-black text-2xl tracking-tight text-white uppercase">MOVE</span>
              </Link>
              <p className="text-[11px] text-zinc-500 leading-relaxed">
                Engineered for maximum athletic performance, recovery, and daily movement.
              </p>
            </div>

            {/* SHOP */}
            <div>
              <h5 className="text-white font-extrabold uppercase tracking-wider mb-3 text-[11px]">SHOP</h5>
              <ul className="space-y-2 text-[11px]">
                <li>
                  <a href="#men" className="hover:text-white transition-colors">
                    Men
                  </a>
                </li>
                <li>
                  <a href="#women" className="hover:text-white transition-colors">
                    Women
                  </a>
                </li>
                <li>
                  <a href="#accessories" className="hover:text-white transition-colors">
                    Accessories
                  </a>
                </li>
                <li>
                  <a href="#sale" className="hover:text-[#ccff00] transition-colors">
                    Sale
                  </a>
                </li>
              </ul>
            </div>

            {/* HELP */}
            <div>
              <h5 className="text-white font-extrabold uppercase tracking-wider mb-3 text-[11px]">HELP</h5>
              <ul className="space-y-2 text-[11px]">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    FAQs
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Shipping
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Returns
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Size Guide
                  </a>
                </li>
              </ul>
            </div>

            {/* ABOUT */}
            <div>
              <h5 className="text-white font-extrabold uppercase tracking-wider mb-3 text-[11px]">ABOUT</h5>
              <ul className="space-y-2 text-[11px]">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Our Story
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Sustainability
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            {/* FOLLOW US */}
            <div>
              <h5 className="text-white font-extrabold uppercase tracking-wider mb-3 text-[11px]">FOLLOW US</h5>
              <div className="flex items-center gap-3 text-zinc-300">
                <a
                  href="#"
                  className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:text-[#ccff00] hover:border-[#ccff00] transition-colors"
                >
                  <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:text-[#ccff00] hover:border-[#ccff00] transition-colors"
                >
                  <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
                    <path d="M9 8h-3v4h3v12h5V12h3.642l.358-4h-4V6.333C14 5.374 14.5 5 15.5 5H18V0h-3.8c-3.658 0-5.2 1.838-5.2 4.9V8z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:text-[#ccff00] hover:border-[#ccff00] transition-colors"
                >
                  <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:text-[#ccff00] hover:border-[#ccff00] transition-colors"
                >
                  <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.98-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 2.89 3.46 2.72 1.07-.05 2.06-.63 2.62-1.55.43-.66.6-1.46.6-2.25V.02z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-500">
            <p>© 2026 MOVE. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <a href="#" className="hover:text-zinc-300 transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-zinc-300 transition-colors">
                Terms & Conditions
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
              <span>Collection Preview</span>
            </div>
            <h3 className="text-xl font-black text-white uppercase">{selectedQuickView}</h3>
            <p className="text-xs text-zinc-300 mt-2">
              Designed with 4-way stretch fabrics, dynamic ventilation zones, and ergonomic anti-chafe stitching.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <button
                onClick={() => {
                  setCartCount((c) => c + 1);
                  setSelectedQuickView(null);
                  alert(`Added ${selectedQuickView} to your bag!`);
                }}
                className="flex-1 py-3 rounded-full bg-[#ccff00] text-black font-extrabold text-xs uppercase tracking-wider hover:bg-[#b8e600] transition-colors"
              >
                Add to Bag
              </button>
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
