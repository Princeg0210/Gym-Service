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
import { GymProfile } from '@/types';
import { sounds } from '@/lib/audio';
import Pricing02, { PricingPlan } from '@/components/Pricing02';
import ScrollProgress from '@/components/ScrollProgress';
import EquipmentTicker from '@/components/EquipmentTicker';
import BackToTop from '@/components/BackToTop';
import ParticleDrift from '@/components/ParticleDrift';

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
  gymProfile
}: ClubShowcaseProps) {
  const primaryColor = gymProfile?.primaryColor || '#ccff00';
  const gymName = gymProfile?.gymName || 'IronPulse Commercial Gym';
  const heroHeadline = gymProfile?.heroHeadline || 'STRENGTH & CONDITIONING';
  const heroHighlight = gymProfile?.heroHighlight || 'BUILT FOR REAL ATHLETES.';
  const heroSubtitle =
    gymProfile?.heroSubtitle ||
    `Train with competition Olympic barbells, heavy dumbbells up to 50kg, certified coaches, and custom nutrition plans at our ${gymProfile?.city || 'local'} facility.`;
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
      intensity: 'Restorative',
      duration: '45 min',
      coach: 'Coach Priya'
    }
  ];

  const filteredPrograms =
    selectedProgramCategory === 'all'
      ? programs
      : programs.filter((p) => p.category === selectedProgramCategory);

  const coaches = [
    {
      name: 'Rajesh Nair',
      role: 'Head Strength Coach',
      spec: 'Competitive Powerlifting & Squat Mechanics',
      exp: '11 Years Exp.',
      rating: '4.99',
      achievements: 'State Gold Medalist • CSCS Certified',
      bio: 'Mentors competitive lifters and dedicated trainees on bar path optimization, breathing bracing, and safe progressive overload.'
    },
    {
      name: 'Vikram Singh',
      role: 'Senior Hypertrophy Coach',
      spec: 'Bodybuilding & Structural Hypertrophy',
      exp: '8 Years Exp.',
      rating: '4.95',
      achievements: 'National Bodybuilding Finalist',
      bio: 'Expert in high-intensity tension sets, drop mechanics, and injury-free muscle hypertrophy for working professionals.'
    },
    {
      name: 'Priya Sharma',
      role: 'Lead Nutritionist & Mobility Specialist',
      spec: 'Sports Nutrition & Spine Decompression',
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
      a: 'Yes, absolutely. Our nutrition coach specializes in practical Indian nutrition plans built around paneer, soya chunks, Greek yogurt, lentils, sprouts, eggs, and whey protein so you hit your macro goals without forcing western diets.'
    },
    {
      q: 'Can I bring a guest or workout partner with me?',
      a: 'Quarterly Pro and Annual VIP members receive 2 guest passes each month. First-time visitors can also claim our 1-Day Free VIP Pass anytime using the button above!'
    }
  ];

  // Resolve multi-tenant dynamic membership plans for Pricing02
  const tenantPricingPlans: PricingPlan[] = (gymProfile?.membershipPlans && gymProfile.membershipPlans.length > 0)
    ? gymProfile.membershipPlans.map((plan) => ({
        name: plan.name,
        description: plan.badge || (plan.durationMonths === 1 ? 'Monthly membership pass' : plan.durationMonths === 12 ? 'Annual VIP membership pass' : 'Quarterly membership package'),
        monthlyPrice: plan.durationMonths === 1 ? plan.feeInr : Math.round(plan.feeInr / (plan.durationMonths || 1)),
        yearlyPrice: plan.durationMonths === 12 ? plan.feeInr : Math.round(plan.feeInr * 10),
        buttonLabel: plan.isPopular ? 'Accelerate Growth' : 'Get Started',
        isPopular: plan.isPopular,
        features: plan.features || []
      }))
    : [
        {
          name: 'Starter Plan',
          description: 'Full gym floor and weights arena access for self-directed athletes.',
          monthlyPrice: 1999,
          yearlyPrice: 17999,
          buttonLabel: 'Get Started',
          features: [
            'Full Gym Floor & Free Weights Arena',
            'Olympic Power Racks & Plate-Loaded Rigs',
            'Locker Room & High-Pressure Showers',
            'Mobile QR Check-in & Workout Tracker',
          ],
        },
        {
          name: 'Growth & Pro Plan',
          description: 'Accelerate your physique transformations with personal coach guidance and diet blueprint.',
          monthlyPrice: 4999,
          yearlyPrice: 45000,
          buttonLabel: 'Accelerate Growth',
          isPopular: true,
          features: [
            'Unlimited All-Branch Arena Access',
            '1-on-1 Personal Trainer Coaching Sessions',
            'Custom High-Protein Indian Diet Blueprint',
            'Instant WhatsApp Invoices & Receipts',
            '30 Days Free Membership Freeze Allowance',
          ],
        },
        {
          name: 'Elite VIP Plan',
          description: 'For dedicated athletes demanding bespoke master coaching, recovery, and concierge access.',
          monthlyPrice: null,
          yearlyPrice: null,
          buttonLabel: 'Request Custom Quote',
          features: [
            'Dedicated Master Coach & Bi-Weekly Reviews',
            'Comprehensive Biomarker & Body Fat Scans',
            'Dedicated VIP Locker & Laundry Care',
            'Unlimited Complimentary Guest Passes',
          ],
        },
      ];

  // Resolve facilities from multi-tenant gym profile with clean default fallback
  const facilities = gymProfile?.facilities && gymProfile.facilities.length > 0
    ? gymProfile.facilities
    : [
        {
          id: 'fac-1',
          category: 'free-weights' as const,
          title: 'Free Weights & Power Racks',
          desc: 'Competition-grade lifting stations featuring calibrated steel plates, Olympic power barbells, heavy-duty power racks with safety spotter arms, and rubber hex dumbbells up to 50kg.',
          specs: [
            'Eleiko & Texas Power Bars',
            'Rubber Hex Dumbbells (2.5kg - 50kg)',
            'Olympic Lifting Platforms',
            'Competition Calibrated Steel Plates'
          ],
          imageUrl: '/images/gym_equipment_modern.jpg'
        },
        {
          id: 'fac-2',
          category: 'cables-machines' as const,
          title: 'Cable & Strength Machines',
          desc: 'Dual adjustable pulley cable towers, plate-loaded leg presses, lat pulldowns, and chest-supported row stations engineered for controlled biomechanical isolation.',
          specs: [
            'Dual 100kg Precision Weight Stacks',
            'Plate-Loaded 45° Leg Press & Hack Squat',
            'Multi-Angle Cable Crossover Towers',
            'ISO-Lateral Chest & Row Stations'
          ],
          imageUrl: '/images/gym_equipment_modern.jpg'
        },
        {
          id: 'fac-3',
          category: 'cardio' as const,
          title: 'Cardio & Conditioning',
          desc: 'Low-impact conditioning stations including wind-resistance air assault bikes, Concept2 rowers, and curved self-powered treadmills for cardiovascular endurance and metabolic pacing.',
          specs: [
            'Concept2 RowErgs & SkiErgs',
            'Air Assault Resistance Bikes',
            'Curved Manual Self-Powered Treadmills',
            'Interval Conditioning Timers'
          ],
          imageUrl: '/images/gym_hero_athlete.jpg'
        },
        {
          id: 'fac-4',
          category: 'mobility' as const,
          title: 'Mobility & Recovery',
          desc: 'Dedicated recovery area with high-density foam rollers, resistance mobility bands, and high-traction athletic turf for warm-ups, cool-downs, and myofascial release.',
          specs: [
            'High-Density EVA Foam Rollers',
            'Progressive Resistance Mobility Bands',
            'Shock-Absorbent Sprint & Sled Turf',
            'Targeted Percussion Recovery Tools'
          ],
          imageUrl: '/images/gym_trainers_group.jpg'
        }
      ];

  const freeWeights = facilities.find(f => f.category === 'free-weights') || facilities[0];
  const cables = facilities.find(f => f.category === 'cables-machines') || facilities[1];
  const cardio = facilities.find(f => f.category === 'cardio') || facilities[2];
  const mobility = facilities.find(f => f.category === 'mobility') || facilities[3];

  return (
    <div className="relative text-zinc-100 selection:bg-[#ccff00] selection:text-black">
      {/* OriginKit Interactive Particle Drift (Scroll velocity reactive + constellation links) */}
      <ParticleDrift color={primaryColor} />

      {/* Top Scroll Reading Progress Indicator (Linear / Apple style) */}
      <ScrollProgress color={primaryColor} />

      {/* ─────────────────────────────────────────────────────────────
          SECTION 1: HERO SECTION
          ───────────────────────────────────────────────────────────── */}
      <section className="relative border-b border-[#1c212e] py-14 lg:py-24 flex items-center bg-[#060709] overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            {/* Left Column: Headlines & Actions */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="space-y-2">
                <h1 className="text-4xl sm:text-6xl xl:text-7xl font-black uppercase tracking-tight text-white leading-none">
                  {heroHeadline}{' '}
                  <span
                    className="block mt-2"
                    style={{ color: primaryColor }}
                  >
                    {heroHighlight}
                  </span>
                </h1>
              </div>

              {/* Concise, gym-specific content */}
              <p className="text-sm sm:text-base text-zinc-300 max-w-xl leading-relaxed">
                {heroSubtitle}
              </p>

              {/* Action Buttons: 1 Primary + 1 Secondary CTA */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
                <button
                  onClick={() => setIsTrialModalOpen(true)}
                  className="inline-flex items-center justify-center gap-2 rounded-xl px-7 py-3.5 text-xs sm:text-sm font-black uppercase tracking-wider text-black shadow-md transition-all hover:brightness-110 active:scale-95 apple-press whitespace-nowrap"
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

            </div>

            {/* Right Column: Authentic Gym Photography */}
            <div className="lg:col-span-5 relative">
              <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-white/10 bg-[#0c0f16] shadow-xl">
                <Image
                  src={heroImg}
                  alt={`${gymName} athlete training`}
                  fill
                  className="object-cover object-center"
                  priority
                  sizes="(max-width: 768px) 100vw, 45vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#060709] via-transparent to-transparent opacity-80 pointer-events-none" />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Infinite Equipment Standards Ticker Marquee (Equinox / Alo / Nike style) */}
      <EquipmentTicker primaryColor={primaryColor} />


      {/* ─────────────────────────────────────────────────────────────
          SECTION 2: FACILITY & EQUIPMENT SHOWCASE
          ───────────────────────────────────────────────────────────── */}
      <section id="facilities" className="relative border-b border-[#1c212e] py-16 sm:py-24 bg-[#080a0f]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.55, ease: [0.25, 1, 0.5, 1] }}
          className="mx-auto max-w-7xl px-4 sm:px-6"
        >
          
          {/* Section Header */}
          <div className="max-w-2xl mx-auto text-center mb-12 sm:mb-16">
            <span
              className="text-xs font-bold uppercase tracking-wider"
              style={{ color: primaryColor }}
            >
              Facility & Equipment
            </span>
            <h2 className="mt-2 text-3xl font-black uppercase tracking-tight text-white sm:text-5xl">
              EXPLORE OUR FACILITIES
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-zinc-400">
              Verified commercial-grade equipment and specialized training zones engineered for strength, performance, and recovery.
            </p>
          </div>

          {/* Asymmetrical Image-Led Showcase */}
          <div className="space-y-6 sm:space-y-8">
            
            {/* Row 1: Asymmetrical Split (Free Weights 7 cols + Cable & Strength 5 cols) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              
              {/* Arena 1: Free Weights & Power Racks (7 Cols) */}
              <div className="lg:col-span-7 flex flex-col rounded-2xl border border-white/10 bg-[#0e121a] overflow-hidden transition-colors hover:border-white/20">
                <div className="relative aspect-[16/9] sm:aspect-[21/10] w-full bg-[#121622] overflow-hidden">
                  <Image
                    src={freeWeights.imageUrl || '/images/gym_equipment_modern.jpg'}
                    alt={freeWeights.title}
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 1024px) 100vw, 60vw"
                  />
                  <div className="absolute top-3 left-3 rounded-md bg-black/85 px-2.5 py-1 text-[11px] font-mono font-bold uppercase tracking-wider text-white border border-white/10">
                    Free Weights Arena
                  </div>
                </div>

                <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                      {freeWeights.title}
                    </h3>
                    <p className="mt-2 text-xs sm:text-sm text-zinc-300 leading-relaxed">
                      {freeWeights.desc}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-white/5">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-500 block mb-2">
                      Verified Floor Specifications
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono text-zinc-300">
                      {freeWeights.specs.map((spec, sIdx) => (
                        <div
                          key={sIdx}
                          className="flex items-center gap-2 rounded-lg border border-white/5 bg-[#141924] px-3 py-2"
                        >
                          <span
                            className="h-1.5 w-1.5 rounded-full flex-shrink-0"
                            style={{ backgroundColor: primaryColor }}
                          />
                          <span className="truncate">{spec}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Arena 2: Cable & Strength Machines (5 Cols) */}
              <div className="lg:col-span-5 flex flex-col rounded-2xl border border-white/10 bg-[#0e121a] overflow-hidden transition-colors hover:border-white/20">
                <div className="relative aspect-[16/9] sm:aspect-[16/10] w-full bg-[#121622] overflow-hidden">
                  <Image
                    src={cables.imageUrl || '/images/gym_equipment_modern.jpg'}
                    alt={cables.title}
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 1024px) 100vw, 40vw"
                  />
                  <div className="absolute top-3 left-3 rounded-md bg-black/85 px-2.5 py-1 text-[11px] font-mono font-bold uppercase tracking-wider text-white border border-white/10">
                    Resistance Arena
                  </div>
                </div>

                <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                      {cables.title}
                    </h3>
                    <p className="mt-2 text-xs sm:text-sm text-zinc-300 leading-relaxed">
                      {cables.desc}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-white/5">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-500 block mb-2">
                      Verified Specifications
                    </span>
                    <div className="flex flex-col gap-2 text-xs font-mono text-zinc-300">
                      {cables.specs.map((spec, sIdx) => (
                        <div
                          key={sIdx}
                          className="flex items-center gap-2 rounded-lg border border-white/5 bg-[#141924] px-3 py-2"
                        >
                          <span
                            className="h-1.5 w-1.5 rounded-full flex-shrink-0"
                            style={{ backgroundColor: primaryColor }}
                          />
                          <span className="truncate">{spec}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Row 2: Asymmetrical Inversion (Cardio 5 cols + Mobility 7 cols) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              
              {/* Arena 3: Cardio & Conditioning (5 Cols) */}
              <div className="lg:col-span-5 flex flex-col rounded-2xl border border-white/10 bg-[#0e121a] overflow-hidden transition-colors hover:border-white/20">
                <div className="relative aspect-[16/9] sm:aspect-[16/10] w-full bg-[#121622] overflow-hidden">
                  <Image
                    src={cardio.imageUrl || '/images/gym_hero_athlete.jpg'}
                    alt={cardio.title}
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 1024px) 100vw, 40vw"
                  />
                  <div className="absolute top-3 left-3 rounded-md bg-black/85 px-2.5 py-1 text-[11px] font-mono font-bold uppercase tracking-wider text-white border border-white/10">
                    Conditioning Deck
                  </div>
                </div>

                <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                      {cardio.title}
                    </h3>
                    <p className="mt-2 text-xs sm:text-sm text-zinc-300 leading-relaxed">
                      {cardio.desc}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-white/5">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-500 block mb-2">
                      Verified Conditioning Gear
                    </span>
                    <div className="flex flex-col gap-2 text-xs font-mono text-zinc-300">
                      {cardio.specs.map((spec, sIdx) => (
                        <div
                          key={sIdx}
                          className="flex items-center gap-2 rounded-lg border border-white/5 bg-[#141924] px-3 py-2"
                        >
                          <span
                            className="h-1.5 w-1.5 rounded-full flex-shrink-0"
                            style={{ backgroundColor: primaryColor }}
                          />
                          <span className="truncate">{spec}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Arena 4: Mobility & Recovery (7 Cols) */}
              <div className="lg:col-span-7 flex flex-col rounded-2xl border border-white/10 bg-[#0e121a] overflow-hidden transition-colors hover:border-white/20">
                <div className="relative aspect-[16/9] sm:aspect-[21/10] w-full bg-[#121622] overflow-hidden">
                  <Image
                    src={mobility.imageUrl || '/images/gym_trainers_group.jpg'}
                    alt={mobility.title}
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 1024px) 100vw, 60vw"
                  />
                  <div className="absolute top-3 left-3 rounded-md bg-black/85 px-2.5 py-1 text-[11px] font-mono font-bold uppercase tracking-wider text-white border border-white/10">
                    Mobility & Recovery Turf
                  </div>
                </div>

                <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                      {mobility.title}
                    </h3>
                    <p className="mt-2 text-xs sm:text-sm text-zinc-300 leading-relaxed">
                      {mobility.desc}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-white/5">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-500 block mb-2">
                      Verified Recovery Equipment
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono text-zinc-300">
                      {mobility.specs.map((spec, sIdx) => (
                        <div
                          key={sIdx}
                          className="flex items-center gap-2 rounded-lg border border-white/5 bg-[#141924] px-3 py-2"
                        >
                          <span
                            className="h-1.5 w-1.5 rounded-full flex-shrink-0"
                            style={{ backgroundColor: primaryColor }}
                          />
                          <span className="truncate">{spec}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* Bottom Technical Note & Free Trial Action Bar */}
          <div className="mt-10 rounded-xl border border-white/10 bg-[#0c1017] p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-zinc-400 text-center sm:text-left">
              <span className="font-bold text-white">Daily Equipment Maintenance:</span> All barbell sleeves, cable pulleys, and benches pass morning torque and safety inspections.
            </div>
            <button
              onClick={() => {
                sounds.playClick();
                setIsTrialModalOpen(true);
              }}
              className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-black transition-all hover:brightness-110 active:scale-[0.98] whitespace-nowrap"
              style={{ backgroundColor: primaryColor }}
            >
              <span>Book a Free Trial</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          </div>

        </motion.div>
      </section>


      {/* ─────────────────────────────────────────────────────────────
          SECTION 3: TRAINING PROGRAMS
          ───────────────────────────────────────────────────────────── */}
      <section id="programs" className="relative border-b border-[#1c212e] py-16 sm:py-24 bg-[#060709]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.55, ease: [0.25, 1, 0.5, 1] }}
          className="mx-auto max-w-7xl px-4 sm:px-6"
        >
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: primaryColor }}>
                Programs
              </span>
              <h2 className="mt-1 text-3xl font-black uppercase tracking-tight text-white sm:text-5xl">
                Structured Training Regimens
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-zinc-400 max-w-xl">
                Engineered for muscle growth, fat reduction, and athletic durability with coach oversight.
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border border-white/10 bg-[#0e121a] p-1.5 rounded-xl">
              {[
                { id: 'all', label: 'All Programs' },
                { id: 'strength', label: 'Strength' },
                { id: 'conditioning', label: 'Conditioning' },
                { id: 'coaching', label: '1-on-1' },
                { id: 'mobility', label: 'Mobility' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedProgramCategory(tab.id)}
                  className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all whitespace-nowrap ${
                    selectedProgramCategory === tab.id
                      ? 'bg-white/15 text-white shadow-sm'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredPrograms.map((prog) => (
              <div
                key={prog.id}
                className="rounded-2xl border border-white/10 bg-[#0e121a] p-6 flex flex-col justify-between hover:border-white/20 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 mb-3">
                    <span className="uppercase">{prog.duration}</span>
                    <span className="font-bold text-emerald-400">{prog.intensity}</span>
                  </div>

                  <h3 className="text-lg font-black text-white leading-snug">
                    {prog.title}
                  </h3>

                  <p className="mt-3 text-xs text-zinc-400 leading-relaxed">
                    {prog.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                  <span className="text-xs font-medium text-zinc-400">{prog.coach}</span>
                  <button
                    onClick={() => setIsTrialModalOpen(true)}
                    className="text-xs font-bold text-white hover:underline flex items-center gap-1"
                  >
                    <span>Trial</span>
                    <ArrowUpRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>

        </motion.div>
      </section>


      {/* ─────────────────────────────────────────────────────────────
          SECTION 4: FLOOR COACHES
          ───────────────────────────────────────────────────────────── */}
      <section id="trainers" className="relative border-b border-[#1c212e] py-16 sm:py-24 bg-[#080a0f]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.55, ease: [0.25, 1, 0.5, 1] }}
          className="mx-auto max-w-7xl px-4 sm:px-6"
        >
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: primaryColor }}>
              Coaches
            </span>
            <h2 className="mt-1 text-3xl font-black uppercase tracking-tight text-white sm:text-5xl">
              Certified Floor Mentors
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-zinc-400">
              Our coaches actively assist with form audits, bar path checks, and progressive overload on the gym floor.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {coaches.map((c, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-white/10 bg-[#0e121a] p-6 flex flex-col justify-between hover:border-white/20 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-11 w-11 rounded-xl bg-white/5 border border-white/10 text-[#ccff00] flex items-center justify-center font-black text-sm">
                      {c.name.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <div className="flex items-center gap-1 text-xs font-bold text-amber-400">
                      <Star className="h-3.5 w-3.5 fill-current" />
                      <span>{c.rating}</span>
                    </div>
                  </div>

                  <h3 className="text-lg font-black text-white">{c.name}</h3>
                  <p className="text-xs font-bold text-[#ccff00] mt-0.5">{c.role}</p>
                  
                  <div className="mt-2 text-[11px] font-mono text-zinc-400">
                    <span>{c.exp}</span> • <span>{c.spec}</span>
                  </div>

                  <p className="mt-3 text-xs text-zinc-400 leading-relaxed">
                    {c.bio}
                  </p>
                </div>

                <div className="pt-4 mt-6 border-t border-white/5">
                  <button
                    onClick={() => setIsTrialModalOpen(true)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 text-xs font-bold text-zinc-200 hover:bg-white/10 transition-all apple-press"
                  >
                    Consult Coach
                  </button>
                </div>
              </div>
            ))}
          </div>

        </motion.div>
      </section>


      {/* ─────────────────────────────────────────────────────────────
          SECTION 5: MEMBER PROGRESS
          ───────────────────────────────────────────────────────────── */}
      <section id="results" className="relative border-b border-[#1c212e] py-16 sm:py-24 bg-[#060709]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.55, ease: [0.25, 1, 0.5, 1] }}
          className="mx-auto max-w-7xl px-4 sm:px-6"
        >
          
          <div className="mb-12 text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: primaryColor }}>
              Member Transformations
            </span>
            <h2 className="mt-1 text-3xl font-black uppercase tracking-tight text-white sm:text-5xl">
              Authentic Member Outcomes
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-zinc-400">
              Verified outcomes and feedback from athletes training consistently at our facility.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Transformation 1 */}
            <div className="rounded-2xl border border-white/10 bg-[#0e121a] p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-white/5">
                  <div>
                    <h3 className="text-base font-black text-white">Rahul M.</h3>
                    <p className="text-xs text-zinc-400">Software Architect • 31 Yrs</p>
                  </div>
                  <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/20">
                    -15 kg Body Fat
                  </span>
                </div>

                <p className="mt-4 text-xs sm:text-sm text-zinc-300 leading-relaxed">
                  &ldquo;Coach Priya customized a high-protein Indian diet with paneer, sprouts, and soya that fit my 10-hour desk schedule. Dropped from 88kg to 73kg in 6 months.&rdquo;
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-zinc-400 font-mono">
                <span>Timeline: 6 Months</span>
                <span className="font-bold text-white">88kg → 73kg</span>
              </div>
            </div>

            {/* Transformation 2 */}
            <div className="rounded-2xl border border-white/10 bg-[#0e121a] p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-white/5">
                  <div>
                    <h3 className="text-base font-black text-white">Ananya K.</h3>
                    <p className="text-xs text-zinc-400">Consultant • 27 Yrs</p>
                  </div>
                  <span className="rounded-full bg-[#ccff00]/10 px-2.5 py-1 text-xs font-bold text-[#ccff00] border border-[#ccff00]/20">
                    +40kg Deadlift PR
                  </span>
                </div>

                <p className="mt-4 text-xs sm:text-sm text-zinc-300 leading-relaxed">
                  &ldquo;I was hesitant with heavy deadlifts due to back pain. Coach Vikram taught me proper breathing, lat engagement, and hip hinge. Lifted 125kg pain-free.&rdquo;
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-zinc-400 font-mono">
                <span>Timeline: 4 Months</span>
                <span className="font-bold text-white">45kg → 125kg</span>
              </div>
            </div>

            {/* Transformation 3 */}
            <div className="rounded-2xl border border-white/10 bg-[#0e121a] p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-white/5">
                  <div>
                    <h3 className="text-base font-black text-white">Sameer D.</h3>
                    <p className="text-xs text-zinc-400">Founder • 35 Yrs</p>
                  </div>
                  <span className="rounded-full bg-cyan-500/10 px-2.5 py-1 text-xs font-bold text-cyan-400 border border-cyan-500/20">
                    22 Sessions / Mo
                  </span>
                </div>

                <p className="mt-4 text-xs sm:text-sm text-zinc-300 leading-relaxed">
                  &ldquo;The QR check-in and uncrowded free weight stations make early morning training completely frictionless. Resting heart rate reduced by 20 bpm.&rdquo;
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-zinc-400 font-mono">
                <span>Attendance Streak</span>
                <span className="font-bold text-white">92% Consistency</span>
              </div>
            </div>

          </div>

        </motion.div>
      </section>


      {/* ─────────────────────────────────────────────────────────────
          SECTION 6: TRANSPARENT PRICING PLANS (ORIGINKIT PRICING-02)
          ───────────────────────────────────────────────────────────── */}
      <Pricing02
        heading={`Membership Plans at ${gymName}`}
        subheading="Clear Indian Rupee pricing with zero surprise charges. Instant UPI confirmation, certified coaching, and flexible billing cycles."
        badgeLabel="Pricing plans"
        plans={tenantPricingPlans}
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
          SECTION 7: FACILITY DETAILS & FAQ ACCORDION
          ───────────────────────────────────────────────────────────── */}
      <section id="faq" className="relative border-b border-[#1c212e] py-16 sm:py-24 bg-[#060709]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.55, ease: [0.25, 1, 0.5, 1] }}
          className="mx-auto max-w-7xl px-4 sm:px-6"
        >
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left: Location & Contact Card */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider" style={{ color: primaryColor }}>
                  Location & Hours
                </span>
                <h2 className="mt-1 text-3xl font-black uppercase tracking-tight text-white">
                  Visit {gymName}
                </h2>
                <p className="mt-2 text-xs sm:text-sm text-zinc-400">
                  Centrally located with designated vehicle parking and clean locker room facilities.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#0e121a] p-6 space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-[#ccff00] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">Address</h4>
                    <p className="text-xs text-zinc-300 mt-0.5 leading-relaxed">
                      {gymProfile?.address || 'Plot 42, 27th Main, Sector 1, HSR Layout, Bengaluru, Karnataka 560102'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 border-t border-white/5 pt-4">
                  <Clock className="h-5 w-5 text-[#ccff00] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">Operating Timings</h4>
                    <p className="text-xs text-zinc-300 mt-0.5">
                      {gymProfile?.operatingHours || 'Mon - Sat: 5:30 AM - 10:30 PM | Sun: 6:00 AM - 1:00 PM'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 border-t border-white/5 pt-4">
                  <MessageSquare className="h-5 w-5 text-[#25d366] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">Front Desk WhatsApp</h4>
                    <p className="text-xs text-zinc-300 mt-0.5">
                      +{gymProfile?.whatsappNumber || '919876543210'}
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
                <span className="text-xs font-bold uppercase tracking-wider" style={{ color: primaryColor }}>
                  Assurance
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
                      className="rounded-xl border border-white/10 bg-[#0e121a] overflow-hidden transition-colors"
                    >
                      <button
                        onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                        className="w-full flex items-center justify-between p-4 sm:p-5 text-left text-xs sm:text-sm font-bold text-white hover:text-zinc-200 transition-colors"
                      >
                        <span>{faq.q}</span>
                        {isOpen ? (
                          <ChevronUp className="h-4 w-4 text-[#ccff00] shrink-0 ml-3" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-zinc-400 shrink-0 ml-3" />
                        )}
                      </button>

                      {isOpen && (
                        <div className="px-5 pb-5 pt-0 text-xs text-zinc-400 leading-relaxed border-t border-white/5">
                          <p className="pt-3">{faq.a}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

        </motion.div>
      </section>


      {/* ─────────────────────────────────────────────────────────────
          INTERACTIVE 1-DAY FREE PASS MODAL
          ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isTrialModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#0c1017] p-6 sm:p-7 shadow-2xl"
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
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider mb-1" style={{ color: primaryColor }}>
                    <Dumbbell className="h-4 w-4" />
                    <span>Free Pass Invitation</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white">
                    Claim 1-Day Trial Pass
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
                        className="w-full rounded-xl border border-white/10 bg-[#121724] px-3.5 py-2.5 text-xs font-semibold text-white outline-none focus:border-white/30"
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
                        className="w-full rounded-xl border border-white/10 bg-[#121724] px-3.5 py-2.5 text-xs font-semibold text-white outline-none focus:border-white/30"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-zinc-300 block mb-1">Preferred Slot</label>
                      <select
                        value={trialSlot}
                        onChange={(e) => setTrialSlot(e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-[#121724] px-3.5 py-2.5 text-xs font-semibold text-white outline-none focus:border-white/30"
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
                        className="w-full rounded-xl border border-white/10 bg-[#121724] px-3.5 py-2.5 text-xs font-semibold text-white outline-none focus:border-white/30"
                      >
                        <option>Muscle Building & Hypertrophy</option>
                        <option>Fat Loss & Metabolic Conditioning</option>
                        <option>Strength & Powerlifting (Squat/Bench/Deadlift)</option>
                        <option>General Health & Posture Fix</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      className="w-full inline-flex items-center justify-center gap-2 rounded-xl py-3.5 text-xs font-black uppercase tracking-wider text-black shadow-md transition-all hover:brightness-110 active:scale-[0.98] mt-2 apple-press"
                      style={{ backgroundColor: primaryColor }}
                    >
                      <span>Claim Free Pass</span>
                      <ArrowUpRight className="h-4 w-4" />
                    </button>
                  </form>
                </div>
              ) : (
                <div className="text-center py-4 space-y-4">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <Check className="h-7 w-7" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-white">Pass Confirmed!</h3>
                    <p className="text-xs text-zinc-400 mt-1">
                      Welcome, <span className="text-white font-bold">{trialName}</span>! Your pass is active for {trialSlot}.
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-[#121724] p-4 text-left font-mono text-xs space-y-1.5">
                    <div className="flex justify-between text-zinc-400">
                      <span>PASS ID:</span>
                      <span className="text-white font-bold">VIP-{Math.floor(100000 + Math.random() * 900000)}</span>
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
                    href={`https://wa.me/${gymProfile?.whatsappNumber || '919876543210'}?text=Hi%20${encodeURIComponent(gymName)},%20I%20just%20claimed%20my%201-Day%20Free%20Pass%20for%20${encodeURIComponent(trialName)}%20(${trialPhone})!`}
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

      {/* Floating Tactile Back-To-Top Button (Apple / Equinox style) */}
      <BackToTop primaryColor={primaryColor} />

    </div>
  );
}

export default ClubShowcase;
