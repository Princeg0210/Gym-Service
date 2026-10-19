'use client';

import React, { useState } from 'react';
import {
  Member,
  WorkoutRoutine,
  Exercise,
  DietPlan
} from '@/types';
import {
  QrCode,
  Apple,
  CheckCircle2,
  ChevronRight,
  Flame,
  Info
} from 'lucide-react';
import { INITIAL_MEMBERS, INITIAL_DIET_PLANS } from '@/lib/mockData';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

interface MemberPortalProps {
  members: Member[];
  routines?: WorkoutRoutine[];
  exercises?: Exercise[];
  onUpdateRoutines?: (routines: WorkoutRoutine[]) => void;
  gymName?: string;
}

export function MemberPortal({
  members,
  gymName
}: MemberPortalProps) {
  const [selectedMemberId, setSelectedMemberId] = useState<string>(members[0]?.id || 'mem-101');
  const [activePortalTab, setActivePortalTab] = useState<'pass' | 'diet'>('pass');

  // Diet Plan State
  const currentMember =
    members.find((m) => m.id === selectedMemberId) ||
    members[0] ||
    INITIAL_MEMBERS[0];
  const [dietPref, setDietPref] = useState<'vegetarian' | 'eggetarian' | 'non_veg'>(
    currentMember?.dietaryPreference || 'vegetarian'
  );

  const dietPlan: DietPlan = INITIAL_DIET_PLANS[dietPref] || INITIAL_DIET_PLANS.vegetarian;

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 space-y-6">
      {/* Member Selector Strip & Membership Validity Card */}
      <Card className="border-[#222738] bg-[#0c0f16]">
        <CardContent className="p-4 sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Athlete Profile:</span>
                <select
                  value={selectedMemberId}
                  onChange={(e) => setSelectedMemberId(e.target.value)}
                  className="rounded-xl border border-[#262c3e] bg-[#121622] px-3 py-1.5 text-xs font-bold text-white outline-none focus:border-[#ccff00] transition-colors cursor-pointer"
                >
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.fullName} (+91 {m.phone}) — {m.status.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>
              <p className="mt-2 text-xs text-zinc-400">
                Active Tier: <strong className="text-white font-bold">{currentMember.planName}</strong> • Access Valid till{' '}
                <span className="font-mono font-bold text-emerald-400">{currentMember.endDate}</span>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Badge
                variant={currentMember.status === 'active' ? 'success' : 'destructive'}
              >
                {currentMember.status} Pass
              </Badge>
              {currentMember.pendingDueInr > 0 && (
                <Badge variant="destructive" className="font-mono font-bold">
                  ₹{currentMember.pendingDueInr.toLocaleString('en-IN')} Due
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>


      {/* Member Portal Nav Tabs */}
      <TabsList className="w-full sm:w-auto grid grid-cols-2 sm:flex h-auto p-1 bg-[#0b0e14] border-[#1e2330]">
        <TabsTrigger
          value="pass"
          onClick={() => setActivePortalTab('pass')}
          className={cn(
            "flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-bold text-xs transition-all",
            activePortalTab === 'pass' && "bg-[#121724] text-[#ccff00] border border-[#293246] shadow-xs"
          )}
        >
          <QrCode className="h-4 w-4" />
          <span className="hidden sm:inline">Digital QR Gym Pass</span>
          <span className="sm:hidden">Pass</span>
        </TabsTrigger>

        <TabsTrigger
          value="diet"
          onClick={() => setActivePortalTab('diet')}
          className={cn(
            "flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-bold text-xs transition-all",
            activePortalTab === 'diet' && "bg-[#121724] text-[#ccff00] border border-[#293246] shadow-xs"
          )}
        >
          <Apple className="h-4 w-4" />
          <span className="hidden sm:inline">Indian Nutrition & Diet</span>
          <span className="sm:hidden">Diet</span>
        </TabsTrigger>
      </TabsList>

      {/* TAB 2: INDIAN DIET & NUTRITION */}
      {activePortalTab === 'diet' && (
        <div className="space-y-6">
          {/* Diet Preference Switcher */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-[#222738] bg-[#0c0f16] p-5 shadow-md">
            <div>
              <h3 className="font-black text-base text-white">
                {dietPlan.title}
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Tailored for Indian kitchens with high-protein staples (Soya chunks, Paneer, Dal, Eggs)
              </p>
            </div>

            <div className="flex rounded-xl border border-[#262c3e] bg-[#121622] p-1">
              <button
                onClick={() => setDietPref('vegetarian')}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
                  dietPref === 'vegetarian'
                    ? 'bg-[#ccff00] text-black shadow-xs'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Vegetarian
              </button>
              <button
                onClick={() => setDietPref('eggetarian')}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
                  dietPref === 'eggetarian'
                    ? 'bg-[#ccff00] text-black shadow-xs'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Eggetarian
              </button>
              <button
                onClick={() => setDietPref('non_veg')}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
                  dietPref === 'non_veg'
                    ? 'bg-[#ccff00] text-black shadow-xs'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Non-Veg
              </button>
            </div>
          </div>

          {/* Macro Breakdown Ribbon */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-2xl border border-[#222738] bg-[#0c0f16] p-4 shadow-md">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Daily Calories</span>
              <div className="mt-1 font-mono text-2xl font-black text-white">
                {dietPlan.dailyCalories} kcal
              </div>
            </div>

            <div className="rounded-2xl border border-[#ccff00]/40 bg-[#ccff00]/10 p-4 shadow-md">
              <span className="text-xs font-black uppercase tracking-wider text-[#ccff00]">Target Protein</span>
              <div className="mt-1 font-mono text-2xl font-black text-[#ccff00]">
                {dietPlan.proteinGrams}g
              </div>
            </div>

            <div className="rounded-2xl border border-[#222738] bg-[#0c0f16] p-4 shadow-md">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Carbohydrates</span>
              <div className="mt-1 font-mono text-2xl font-black text-white">
                {dietPlan.carbsGrams}g
              </div>
            </div>

            <div className="rounded-2xl border border-[#222738] bg-[#0c0f16] p-4 shadow-md">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Healthy Fats</span>
              <div className="mt-1 font-mono text-2xl font-black text-white">
                {dietPlan.fatsGrams}g
              </div>
            </div>
          </div>

          {/* Meal Timeline */}
          <div className="space-y-3">
            {dietPlan.meals.map((meal, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-[#222738] bg-[#0c0f16] p-5 shadow-md"
              >
                <div className="flex items-center justify-between border-b border-[#1f2434] pb-3">
                  <div className="flex items-center gap-2">
                    <Flame className="h-4 w-4 text-orange-400" />
                    <h5 className="font-black text-sm text-white">
                      {meal.mealName}
                    </h5>
                  </div>
                  <span className="font-mono text-xs font-bold text-[#ccff00]">
                    ~{meal.approxProteinGrams}g Protein • {meal.approxCalories} kcal
                  </span>
                </div>

                <ul className="mt-3 space-y-1.5 text-xs text-zinc-300">
                  {meal.items.map((it, iIdx) => (
                    <li key={iIdx} className="flex items-center gap-2">
                      <ChevronRight className="h-3.5 w-3.5 text-[#ccff00] shrink-0" />
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Practical Indian Nutrition Advice */}
          <div className="rounded-2xl border border-[#262f44] bg-[#0d121c] p-5 text-xs text-zinc-300">
            <div className="flex items-center gap-2 font-black text-sm text-white mb-2">
              <Info className="h-4 w-4 text-[#ccff00]" />
              <span>Coach&apos;s Indian Nutrition Advisory</span>
            </div>
            <ul className="list-disc pl-5 space-y-1.5 text-zinc-300">
              {dietPlan.tips.map((t, tidx) => (
                <li key={tidx}>{t}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* TAB 3: DIGITAL QR GYM PASS */}
      {activePortalTab === 'pass' && (
        <div className="flex flex-col items-center justify-center py-6">
          <div className="w-full max-w-sm rounded-3xl apple-glass-card p-7 shadow-2xl text-center">
            <div className="mb-4">
              <span className="text-xs font-black uppercase tracking-widest text-[#ccff00]">
                {gymName ? `${gymName} Access Pass` : 'GymPRO Access Pass'}
              </span>
              <h3 className="text-2xl font-black text-white mt-1 apple-headline tracking-[-0.02em]">
                {currentMember.fullName}
              </h3>
              <p className="font-mono text-xs text-zinc-400">+91 {currentMember.phone}</p>
            </div>

            {/* Simulated QR Code Canvas */}
            <div className="mx-auto my-5 flex h-48 w-48 items-center justify-center rounded-2xl border border-dashed border-[#31394f] bg-[#121622] p-4">
              <QrCode className="h-40 w-40 text-[#ccff00]" />
            </div>

            <div className="rounded-xl border border-[#222738] bg-[#121622] p-3.5 text-xs">
              <div className="flex justify-between py-1">
                <span className="text-zinc-400">Membership Tier:</span>
                <span className="font-bold text-white">{currentMember.planName}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-zinc-400">Access Validity:</span>
                <span className="font-mono font-bold text-emerald-400">
                  Till {currentMember.endDate}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-zinc-400">Check-in PIN:</span>
                <span className="font-mono font-black text-[#ccff00]">
                  {currentMember.phone.slice(-4)}
                </span>
              </div>
            </div>

            <p className="mt-4 text-xs text-zinc-400">
              Scan this pass on the entrance webcam or provide your 4-digit PIN at the reception desk.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
