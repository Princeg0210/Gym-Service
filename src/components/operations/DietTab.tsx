'use client';

import React, { useState } from 'react';
import { Member, DietPlan } from '@/types';
import {
  Utensils,
  Droplets,
  Plus,
  Info
} from 'lucide-react';
import { INITIAL_DIET_PLANS } from '@/lib/mockData';
import { sounds } from '@/lib/audio';

interface DietTabProps {
  members: Member[];
}

export function DietTab({ members }: DietTabProps) {
  const [selectedMemberId, setSelectedMemberId] = useState<string>(members[0]?.id || 'mem-101');
  const currentMember = members.find((m) => m.id === selectedMemberId) || members[0];

  const [dietPref, setDietPref] = useState<'vegetarian' | 'eggetarian' | 'non_veg'>(
    currentMember?.dietaryPreference || 'vegetarian'
  );

  const [waterMl, setWaterMl] = useState<number>(3250);

  const dietPlan: DietPlan = INITIAL_DIET_PLANS[dietPref] || INITIAL_DIET_PLANS.vegetarian;

  const handleAddWater = (ml: number) => {
    setWaterMl((prev) => Math.min(5000, prev + ml));
    sounds.playSuccess();
  };

  return (
    <div className="space-y-6">
      {/* ── TOP ATHLETE & DIET SELECTOR STRIP ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-2xl border border-[#1e2638] bg-[#0c1017] p-4 shadow-md">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ccff00] text-black shadow-md">
            <Utensils className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Athlete:
              </span>
              <select
                value={selectedMemberId}
                onChange={(e) => {
                  setSelectedMemberId(e.target.value);
                  const mem = members.find((m) => m.id === e.target.value);
                  if (mem) setDietPref(mem.dietaryPreference || 'vegetarian');
                }}
                className="rounded-xl border border-[#262c3e] bg-[#121622] px-3 py-1.5 text-xs font-bold text-white outline-none focus:border-[#ccff00] transition-colors"
              >
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.fullName} (+91 {m.phone}) - {m.status.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
            <p className="mt-1 text-xs text-zinc-400">
              Active Plan: <strong className="text-white">{currentMember?.planName}</strong> • Daily Calorie Target: <strong className="text-[#ccff00]">{dietPlan.dailyCalories} kcal</strong>
            </p>
          </div>
        </div>

        {/* Dietary Preference Switcher */}
        <div className="flex items-center rounded-xl border border-[#202738] bg-[#101522] p-1">
          <button
            onClick={() => setDietPref('vegetarian')}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
              dietPref === 'vegetarian'
                ? 'bg-[#ccff00] text-black shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Vegetarian
          </button>
          <button
            onClick={() => setDietPref('eggetarian')}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
              dietPref === 'eggetarian'
                ? 'bg-[#ccff00] text-black shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Eggetarian
          </button>
          <button
            onClick={() => setDietPref('non_veg')}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
              dietPref === 'non_veg'
                ? 'bg-[#ccff00] text-black shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Non-Veg
          </button>
        </div>
      </div>

      {/* ── SIDE-BY-SIDE GRID ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ════════════════════════════════════════════════════════
            LEFT COLUMN (col-span-7): Daily Indian Meal Schedule
        ════════════════════════════════════════════════════════ */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">
              {dietPlan.title}
            </h3>
            <span className="text-xs text-[#ccff00] font-mono font-bold">
              5 Balanced Meals / Day
            </span>
          </div>

          <div className="space-y-3">
            {dietPlan.meals.map((meal, mIdx) => (
              <div
                key={mIdx}
                className="rounded-2xl border border-[#1e2638] bg-[#0c1017] p-4 hover:border-zinc-600 transition-colors"
              >
                <div className="flex items-center justify-between border-b border-[#182030] pb-2.5 mb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#182030] text-xs font-mono font-black text-white">
                      M{mIdx + 1}
                    </span>
                    <h4 className="text-xs font-bold text-white">
                      {meal.mealName}
                    </h4>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="rounded bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 text-xs font-mono font-bold text-emerald-400">
                      {meal.approxProteinGrams}g Protein
                    </span>
                    <span className="text-xs font-mono text-zinc-400">
                      {meal.approxCalories} kcal
                    </span>
                  </div>
                </div>

                {/* Items List */}
                <ul className="space-y-1.5 text-xs text-zinc-300">
                  {meal.items.map((it, iIdx) => (
                    <li key={iIdx} className="flex items-start gap-2">
                      <span className="text-[#ccff00] mt-0.5">•</span>
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Coaching Diet Tips Box */}
          {dietPlan.tips && dietPlan.tips.length > 0 && (
            <div className="rounded-2xl border border-[#1e2638] bg-[#0a0e16] p-4 text-xs space-y-2">
              <div className="flex items-center gap-2 text-zinc-300 font-bold">
                <Info className="h-4 w-4 text-[#ccff00]" />
                <span>Indian Gym Nutrition Guidelines:</span>
              </div>
              <ul className="space-y-1 text-zinc-400 pl-6 list-disc">
                {dietPlan.tips.map((t, idx) => (
                  <li key={idx}>{t}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* ════════════════════════════════════════════════════════
            RIGHT COLUMN (col-span-5): Live Macro Gauges & Indian Staples Reference
        ════════════════════════════════════════════════════════ */}
        <div className="lg:col-span-5 space-y-5">
          {/* Macro Nutrient Breakdown Card */}
          <div className="rounded-2xl border border-[#1e2638] bg-[#0c1017] p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-white">Daily Macro Target Breakdown</h3>
              <span className="font-mono text-xs font-bold text-[#ccff00]">
                {dietPlan.dailyCalories} kcal
              </span>
            </div>

            {/* Protein Meter */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-emerald-400">Protein</span>
                <span className="font-mono text-zinc-300 font-bold">
                  {dietPlan.proteinGrams}g <span className="text-zinc-400 font-normal">/ day</span>
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-[#182030]">
                <div className="h-full rounded-full bg-emerald-400 w-[85%]" />
              </div>
              <p className="text-xs text-zinc-400">
                Essential for muscle protein synthesis & recovery
              </p>
            </div>

            {/* Carbs Meter */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-amber-400">Complex Carbohydrates</span>
                <span className="font-mono text-zinc-300 font-bold">
                  {dietPlan.carbsGrams}g <span className="text-zinc-400 font-normal">/ day</span>
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-[#182030]">
                <div className="h-full rounded-full bg-amber-400 w-[70%]" />
              </div>
              <p className="text-xs text-zinc-400">
                Glycogen replenishment from oats, roti, and brown rice
              </p>
            </div>

            {/* Fats Meter */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-blue-400">Essential Healthy Fats</span>
                <span className="font-mono text-zinc-300 font-bold">
                  {dietPlan.fatsGrams}g <span className="text-zinc-400 font-normal">/ day</span>
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-[#182030]">
                <div className="h-full rounded-full bg-blue-400 w-[60%]" />
              </div>
              <p className="text-xs text-zinc-400">
                Hormonal optimization from almonds, walnuts, and cow ghee
              </p>
            </div>
          </div>

          {/* High-Protein Indian Staples Reference Box */}
          <div className="rounded-2xl border border-[#1e2638] bg-[#0c1017] p-5 shadow-lg space-y-3">
            <h3 className="text-xs font-bold text-white">
              Top Indian Protein Density Reference
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between py-1.5 border-b border-[#182030]">
                <span className="text-zinc-300 font-medium">Soya Chunks (Dry)</span>
                <span className="font-mono font-bold text-[#ccff00]">52g / 100g</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-[#182030]">
                <span className="text-zinc-300 font-medium">Chicken Breast (Raw)</span>
                <span className="font-mono font-bold text-[#ccff00]">31g / 100g</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-[#182030]">
                <span className="text-zinc-300 font-medium">Raw Moong Dal</span>
                <span className="font-mono font-bold text-zinc-300">24g / 100g</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-[#182030]">
                <span className="text-zinc-300 font-medium">Fresh Paneer</span>
                <span className="font-mono font-bold text-zinc-300">18g / 100g</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-[#182030]">
                <span className="text-zinc-300 font-medium">Whole Boiled Egg</span>
                <span className="font-mono font-bold text-zinc-300">6g / egg</span>
              </div>
              <div className="flex items-center justify-between py-1.5">
                <span className="text-zinc-300 font-medium">Roasted Chana</span>
                <span className="font-mono font-bold text-zinc-300">19g / 100g</span>
              </div>
            </div>
          </div>

          {/* Water & Hydration Tracker */}
          <div className="rounded-2xl border border-[#1e2638] bg-[#0c1017] p-5 shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Droplets className="h-4 w-4 text-sky-400" />
                <h3 className="text-xs font-bold text-white">Hydration Tracker</h3>
              </div>
              <span className="font-mono text-xs font-bold text-sky-400">
                {(waterMl / 1000).toFixed(2)}L / 4.0L Target
              </span>
            </div>

            <div className="h-2 w-full overflow-hidden rounded-full bg-[#182030]">
              <div
                className="h-full rounded-full bg-sky-400 transition-all duration-300"
                style={{ width: `${Math.min(100, (waterMl / 4000) * 100)}%` }}
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-zinc-400">
                Stay hydrated during heavy training
              </span>
              <button
                onClick={() => handleAddWater(250)}
                className="flex items-center gap-1 rounded-lg border border-sky-500/30 bg-sky-950/20 px-2.5 py-1 text-xs font-bold text-sky-400 hover:bg-sky-950/40 transition-colors"
              >
                <Plus className="h-3 w-3" />
                <span>+250ml Glass</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
