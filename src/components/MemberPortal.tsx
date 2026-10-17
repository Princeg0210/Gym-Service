'use client';

import React, { useState, useEffect } from 'react';
import {
  Member,
  WorkoutRoutine,
  Exercise,
  DietPlan
} from '@/types';
import {
  QrCode,
  Dumbbell,
  Apple,
  RefreshCw,
  Timer,
  Sliders,
  CheckCircle2,
  ChevronRight,
  Flame,
  Info
} from 'lucide-react';
import { sounds } from '@/lib/audio';
import { INITIAL_MEMBERS, INITIAL_DIET_PLANS } from '@/lib/mockData';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

interface MemberPortalProps {
  members: Member[];
  routines: WorkoutRoutine[];
  exercises: Exercise[];
  onUpdateRoutines: (routines: WorkoutRoutine[]) => void;
  gymName?: string;
}

export function MemberPortal({
  members,
  routines,
  exercises,
  onUpdateRoutines,
  gymName
}: MemberPortalProps) {
  const [selectedMemberId, setSelectedMemberId] = useState<string>(members[0]?.id || 'mem-101');
  const [activePortalTab, setActivePortalTab] = useState<'workout' | 'diet' | 'pass'>('workout');

  // Workout Tracker State
  const [selectedRoutineIndex, setSelectedRoutineIndex] = useState<number>(0);
  const [activeRoutines, setActiveRoutines] = useState<WorkoutRoutine[]>(routines);
  const [prevRoutines, setPrevRoutines] = useState<WorkoutRoutine[]>(routines);

  if (routines !== prevRoutines) {
    setPrevRoutines(routines);
    setActiveRoutines(routines);
  }

  // Rest Timer State
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  // Diet Plan State
  const currentMember =
    members.find((m) => m.id === selectedMemberId) ||
    members[0] ||
    INITIAL_MEMBERS[0];
  const [dietPref, setDietPref] = useState<'vegetarian' | 'eggetarian' | 'non_veg'>(
    currentMember?.dietaryPreference || 'vegetarian'
  );

  // Routine Generator Form
  const [genGoal, setGenGoal] = useState<'muscle_gain' | 'fat_loss' | 'general_fitness'>('muscle_gain');
  const [genLevel, setGenLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [genTier, setGenTier] = useState<'tier_a' | 'tier_b'>('tier_a');
  const [generatedSuccessNotice, setGeneratedSuccessNotice] = useState<string | null>(null);

  // Rest Timer Countdown Effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            sounds.playTimerDone();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, timerSeconds]);

  const startRestTimer = (seconds: number) => {
    setTimerSeconds(seconds);
    setIsTimerRunning(true);
  };

  const currentRoutine = activeRoutines[selectedRoutineIndex] || activeRoutines[0];

  // Set / Rep Steppers & Completion Handler
  const handleUpdateSetWeight = (exIndex: number, setIndex: number, delta: number) => {
    const updated = [...activeRoutines];
    const targetSet = updated[selectedRoutineIndex].exercises[exIndex].sets[setIndex];
    targetSet.weightKg = Math.max(0, targetSet.weightKg + delta);
    setActiveRoutines(updated);
    onUpdateRoutines(updated);
  };

  const handleUpdateSetReps = (exIndex: number, setIndex: number, delta: number) => {
    const updated = [...activeRoutines];
    const targetSet = updated[selectedRoutineIndex].exercises[exIndex].sets[setIndex];
    const currentReps = targetSet.completedReps ?? targetSet.targetReps;
    targetSet.completedReps = Math.max(1, currentReps + delta);
    setActiveRoutines(updated);
    onUpdateRoutines(updated);
  };

  const handleToggleSetComplete = (exIndex: number, setIndex: number, restSeconds: number) => {
    const updated = [...activeRoutines];
    const targetSet = updated[selectedRoutineIndex].exercises[exIndex].sets[setIndex];
    const willBeComplete = !targetSet.completed;
    targetSet.completed = willBeComplete;

    if (willBeComplete) {
      if (targetSet.completedReps === undefined) {
        targetSet.completedReps = targetSet.targetReps;
      }
      sounds.playSuccess();
      startRestTimer(restSeconds);
    }

    setActiveRoutines(updated);
    onUpdateRoutines(updated);
  };

  // Busy Machine Swap Handler
  const handleSwapExercise = (exIndex: number) => {
    const exerciseItem = currentRoutine.exercises[exIndex];
    const currentEx = exerciseItem.exercise;

    if (!currentEx.alternativeExerciseId) {
      alert('No direct alternative defined for this exercise yet.');
      return;
    }

    const altEx = exercises.find((e) => e.id === currentEx.alternativeExerciseId);
    if (!altEx) return;

    const updated = [...activeRoutines];
    updated[selectedRoutineIndex].exercises[exIndex] = {
      ...exerciseItem,
      exerciseId: altEx.id,
      exercise: altEx
    };

    setActiveRoutines(updated);
    onUpdateRoutines(updated);
    sounds.playSuccess();
  };

  // Deterministic Offline-Safe Routine Generator
  const handleGeneratePlan = (e: React.FormEvent) => {
    e.preventDefault();

    let selectedExList: Exercise[] = [];

    if (genGoal === 'fat_loss') {
      selectedExList = [
        exercises.find((e) => e.id === 'ex-9') || exercises[0], // Squat
        exercises.find((e) => e.id === 'ex-2') || exercises[1], // Flat DB Press
        exercises.find((e) => e.id === 'ex-5') || exercises[4], // Lat Pulldown
        exercises.find((e) => e.id === 'ex-11') || exercises[10], // DB RDL
        exercises.find((e) => e.id === 'ex-20') || exercises[19] // Hanging Leg Raise
      ];
    } else {
      selectedExList = [
        exercises.find((e) => e.id === 'ex-1') || exercises[0], // Bench Press
        exercises.find((e) => e.id === 'ex-3') || exercises[2], // Incline DB
        exercises.find((e) => e.id === 'ex-14') || exercises[13], // Lateral Raise
        exercises.find((e) => e.id === 'ex-18') || exercises[17] // Triceps Rope
      ];
    }

    const newRoutine: WorkoutRoutine = {
      id: `custom-routine-${Date.now()}`,
      title: `${genGoal === 'fat_loss' ? 'Fat Loss & Conditioning' : 'Lean Hypertrophy'} (${genLevel.toUpperCase()})`,
      splitType: genGoal === 'fat_loss' ? 'full_body' : 'push',
      goal: genGoal,
      experienceLevel: genLevel,
      isAiGenerated: true,
      exercises: selectedExList.map((ex) => ({
        exerciseId: ex.id,
        exercise: ex,
        sets: [
          { setNumber: 1, weightKg: 20, targetReps: 12, completed: false },
          { setNumber: 2, weightKg: 25, targetReps: 10, completed: false },
          { setNumber: 3, weightKg: 25, targetReps: 10, completed: false }
        ],
        restSeconds: genGoal === 'fat_loss' ? 60 : 90
      }))
    };

    const updated = [newRoutine, ...activeRoutines];
    setActiveRoutines(updated);
    onUpdateRoutines(updated);
    setSelectedRoutineIndex(0);
    setGeneratedSuccessNotice(
      `Plan generated via Deterministic Rule Engine matching ${genGoal.replace('_', ' ')} & ${genTier.replace('_', ' ').toUpperCase()} equipment.`
    );
    setTimeout(() => setGeneratedSuccessNotice(null), 5000);
    sounds.playSuccess();
  };

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

      {/* Floating Rest Timer Bar if active */}
      {isTimerRunning && (
        <div className="sticky top-20 z-30 flex items-center justify-between rounded-2xl apple-glass px-5 py-3.5 text-white shadow-2xl border-[#ccff00]/40 animate-pulse-border">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ccff00] text-black">
              <Timer className="h-5 w-5" />
            </div>
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-[#ccff00]">Rest Timer Active</span>
              <p className="text-xs text-zinc-300">Bio-mechanical recovery interval</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-mono text-2xl font-black tracking-widest tabular-nums text-[#ccff00]">
              00:{timerSeconds < 10 ? `0${timerSeconds}` : timerSeconds}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsTimerRunning(false)}
              className="apple-press"
            >
              Skip
            </Button>
          </div>
        </div>
      )}

      {/* Member Portal Nav Tabs */}
      <TabsList className="w-full sm:w-auto grid grid-cols-3 sm:flex h-auto p-1 bg-[#0b0e14] border-[#1e2330]">
        <TabsTrigger
          value="workout"
          onClick={() => setActivePortalTab('workout')}
          className={cn(
            "flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-bold text-xs transition-all",
            activePortalTab === 'workout' && "bg-[#121724] text-[#ccff00] border border-[#293246] shadow-xs"
          )}
        >
          <Dumbbell className="h-4 w-4" />
          <span className="hidden sm:inline">Today&apos;s Workout Routine</span>
          <span className="sm:hidden">Workout</span>
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
      </TabsList>

      {/* TAB 1: WORKOUT LOGGER */}
      {activePortalTab === 'workout' && (
        <div className="space-y-6">
          {/* Routine Selector Bar */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2">
              {activeRoutines.map((r, idx) => (
                <button
                  key={r.id}
                  onClick={() => setSelectedRoutineIndex(idx)}
                  className={`rounded-xl px-4 py-2 text-xs font-extrabold transition-all ${
                    selectedRoutineIndex === idx
                      ? 'bg-[#ccff00] text-black shadow-md'
                      : 'border border-[#222738] bg-[#0c0f16] text-zinc-300 hover:border-zinc-600 hover:text-white'
                  }`}
                >
                  {r.title}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <span className="font-bold">{currentRoutine.exercises.length} Exercises Planned</span>
            </div>
          </div>

          {/* Exercise List & Set Logger */}
          <div className="space-y-4">
            {currentRoutine.exercises.map((item, exIdx) => {
              const ex = item.exercise;
              const hasAlternative = !!ex.alternativeExerciseId;

              return (
                <div
                  key={`${item.exerciseId}-${exIdx}`}
                  className="rounded-2xl border border-[#222738] bg-[#0c0f16] p-5 shadow-md"
                >
                  {/* Exercise Header */}
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between border-b border-[#1f2434] pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="rounded-md bg-[#161c28] border border-[#262f44] px-2.5 py-0.5 text-xs font-black text-[#ccff00] uppercase">
                          #{exIdx + 1}
                        </span>
                        <h4 className="font-black text-base text-white">
                          {ex.name}
                        </h4>
                        <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs font-bold text-emerald-400 capitalize border border-emerald-500/30">
                          {ex.targetMuscle}
                        </span>
                        <span className="rounded-full border border-zinc-700 px-2.5 py-0.5 font-mono text-xs text-zinc-400">
                          {ex.equipmentTier.toUpperCase()}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-zinc-400">
                        Equipment: <span className="font-semibold text-zinc-200">{ex.equipmentRequired}</span>
                      </p>
                    </div>

                    {/* Peak Hour Machine Swap Button */}
                    {hasAlternative && (
                      <button
                        onClick={() => handleSwapExercise(exIdx)}
                        className="flex items-center gap-1.5 self-start rounded-xl border border-[#ccff00]/40 bg-[#ccff00]/10 px-3 py-1.5 text-xs font-bold text-[#ccff00] hover:bg-[#ccff00]/20 transition-all shadow-xs"
                        title="Crowded gym peak-hour swap"
                      >
                        <RefreshCw className="h-3.5 w-3.5" />
                        <span>Swap Busy Machine</span>
                      </button>
                    )}
                  </div>

                  {/* Form Cues */}
                  <div className="my-3 rounded-xl bg-[#121622] border border-[#1f2536] px-3.5 py-2.5 text-xs text-zinc-300">
                    <span className="font-bold text-[#ccff00]">Form Checklist:</span>{' '}
                    {ex.cues.join(' • ')}
                  </div>

                  {/* Set Rows (Large Touch Targets for Sweaty Mobile Lifters) */}
                  <div className="space-y-2 pt-1">
                    <div className="grid grid-cols-12 text-xs font-bold text-zinc-400 px-2">
                      <span className="col-span-2">SET</span>
                      <span className="col-span-4">WEIGHT (KG)</span>
                      <span className="col-span-3">REPS</span>
                      <span className="col-span-3 text-right">ACTION</span>
                    </div>

                    {item.sets.map((set, setIdx) => {
                      const repsToDisplay = set.completedReps ?? set.targetReps;

                      return (
                        <div
                          key={set.setNumber}
                          className={`grid grid-cols-12 items-center rounded-xl border p-2.5 transition-all ${
                            set.completed
                              ? 'border-emerald-500/40 bg-emerald-950/20 text-emerald-300'
                              : 'border-[#222738] bg-[#121622] text-zinc-200'
                          }`}
                        >
                          <div className="col-span-2 font-mono font-bold text-xs text-white">
                            Set {set.setNumber}
                          </div>

                          {/* Weight Steppers */}
                          <div className="col-span-4 flex items-center gap-1.5">
                            <button
                              onClick={() => handleUpdateSetWeight(exIdx, setIdx, -2.5)}
                              className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#2e374e] bg-[#181d2a] text-xs font-bold text-white hover:border-[#ccff00] transition-colors"
                            >
                              -
                            </button>
                            <span className="min-w-[48px] text-center font-mono font-black text-sm tabular-nums text-white">
                              {set.weightKg}kg
                            </span>
                            <button
                              onClick={() => handleUpdateSetWeight(exIdx, setIdx, 2.5)}
                              className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#2e374e] bg-[#181d2a] text-xs font-bold text-white hover:border-[#ccff00] transition-colors"
                            >
                              +
                            </button>
                          </div>

                          {/* Rep Steppers */}
                          <div className="col-span-3 flex items-center gap-1.5">
                            <button
                              onClick={() => handleUpdateSetReps(exIdx, setIdx, -1)}
                              className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#2e374e] bg-[#181d2a] text-xs font-bold text-white hover:border-[#ccff00] transition-colors"
                            >
                              -
                            </button>
                            <span className="min-w-[32px] text-center font-mono font-black text-sm tabular-nums text-white">
                              {repsToDisplay}
                            </span>
                            <button
                              onClick={() => handleUpdateSetReps(exIdx, setIdx, 1)}
                              className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#2e374e] bg-[#181d2a] text-xs font-bold text-white hover:border-[#ccff00] transition-colors"
                            >
                              +
                            </button>
                          </div>

                          {/* Mark Complete Button */}
                          <div className="col-span-3 text-right">
                            <button
                              onClick={() => handleToggleSetComplete(exIdx, setIdx, item.restSeconds)}
                              className={`rounded-xl px-3.5 py-1.5 text-xs font-extrabold uppercase tracking-wider transition-all shadow-xs ${
                                set.completed
                                  ? 'bg-emerald-500 text-black'
                                  : 'border border-[#ccff00]/40 bg-[#ccff00]/10 text-[#ccff00] hover:bg-[#ccff00] hover:text-black'
                              }`}
                            >
                              {set.completed ? '✓ Done' : 'Log Set'}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Adaptive Custom Routine Generator Section */}
          <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900">
                  <Sliders className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                    Adaptive Routine Generator
                  </h4>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400">
                    Calculates volume and movement patterns based on your goals and gym equipment tier
                  </p>
                </div>
              </div>

              <span className="flex items-center gap-1 rounded bg-zinc-100 px-2 py-0.5 text-xs font-semibold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                Deterministic Engine
              </span>
            </div>

            {generatedSuccessNotice && (
              <div className="mb-4 rounded-lg bg-emerald-50 p-2.5 text-xs text-emerald-900 dark:bg-emerald-950 dark:text-emerald-100 font-medium">
                {generatedSuccessNotice}
              </div>
            )}

            <form onSubmit={handleGeneratePlan} className="grid grid-cols-1 gap-3 sm:grid-cols-4 text-xs">
              <div>
                <label className="mb-1 block font-semibold text-zinc-700 dark:text-zinc-300">Target Goal</label>
                <select
                  value={genGoal}
                  onChange={(e) => setGenGoal(e.target.value as 'muscle_gain' | 'fat_loss' | 'general_fitness')}
                  className="w-full rounded-md border border-zinc-200 bg-white p-2 text-zinc-900 outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
                >
                  <option value="muscle_gain">Hypertrophy (Muscle Gain)</option>
                  <option value="fat_loss">Fat Loss & Conditioning</option>
                  <option value="general_fitness">General Health</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block font-semibold text-zinc-700 dark:text-zinc-300">Experience</label>
                <select
                  value={genLevel}
                  onChange={(e) => setGenLevel(e.target.value as 'beginner' | 'intermediate' | 'advanced')}
                  className="w-full rounded-md border border-zinc-200 bg-white p-2 text-zinc-900 outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
                >
                  <option value="beginner">Beginner (&lt; 1 Year)</option>
                  <option value="intermediate">Intermediate (1-3 Yrs)</option>
                  <option value="advanced">Advanced (3+ Yrs)</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block font-semibold text-zinc-700 dark:text-zinc-300">Gym Equipment</label>
                <select
                  value={genTier}
                  onChange={(e) => setGenTier(e.target.value as 'tier_a' | 'tier_b')}
                  className="w-full rounded-md border border-zinc-200 bg-white p-2 text-zinc-900 outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
                >
                  <option value="tier_a">Tier A (Free Weights Only)</option>
                  <option value="tier_b">Tier B (Standard Commercial)</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full rounded-md bg-zinc-900 py-2 font-semibold text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 shadow-xs transition-colors"
                >
                  Generate Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
