'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Member,
  WorkoutRoutine,
  Exercise,
  DietPlan
} from '@/types';
import {
  QrCode,
  Apple,
  Dumbbell,
  ExternalLink,
  CheckCircle2,
  ChevronRight,
  Flame,
  Info,
  Play,
  Pause,
  RotateCcw,
  Plus,
  Minus,
  Search,
  ArrowLeftRight,
  Clock,
  Trophy,
  Filter,
  Check,
  X
} from 'lucide-react';
import { INITIAL_MEMBERS, INITIAL_DIET_PLANS, INITIAL_ROUTINES, INITIAL_EXERCISES } from '@/lib/mockData';
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

const WEEKDAYS = [
  { day: 'Mon', full: 'Monday', split: 'Push Day A', tag: 'Chest • Delts • Triceps', routineId: 'routine-push-hypertrophy' },
  { day: 'Tue', full: 'Tuesday', split: 'Pull Day A', tag: 'Lats • Upper Back • Biceps', routineId: 'routine-pull-hypertrophy' },
  { day: 'Wed', full: 'Wednesday', split: 'Legs Day A', tag: 'Quads • Hamstrings • Calves', routineId: 'routine-legs-hypertrophy' },
  { day: 'Thu', full: 'Thursday', split: 'Active Recovery', tag: 'Mobility • Core • Cardio', routineId: 'routine-push-hypertrophy' },
  { day: 'Fri', full: 'Friday', split: 'Upper Body', tag: 'Chest • Back • Arms Power', routineId: 'routine-upper-hypertrophy' },
  { day: 'Sat', full: 'Saturday', split: 'Lower & Posterior', tag: 'Glutes • Hamstrings • Core', routineId: 'routine-lower-hypertrophy' },
  { day: 'Sun', full: 'Sunday', split: 'Rest & Recovery', tag: 'Rest • Hydration • Stretch', routineId: 'routine-push-hypertrophy' }
];

export function MemberPortal({
  members,
  routines = INITIAL_ROUTINES,
  exercises = INITIAL_EXERCISES,
  gymName
}: MemberPortalProps) {
  const [selectedMemberId, setSelectedMemberId] = useState<string>(members[0]?.id || 'mem-101');
  const [activePortalTab, setActivePortalTab] = useState<'training' | 'pass' | 'diet'>('training');

  // Active athlete profile
  const currentMember =
    members.find((m) => m.id === selectedMemberId) ||
    members[0] ||
    INITIAL_MEMBERS[0];

  // Weekday selection
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(() => {
    const today = new Date().getDay(); // 0 is Sunday, 1 is Monday...
    return today === 0 ? 6 : today - 1;
  });

  // Routines & workout state
  const [userRoutines, setUserRoutines] = useState<WorkoutRoutine[]>(() => {
    return routines && routines.length > 0 ? JSON.parse(JSON.stringify(routines)) : JSON.parse(JSON.stringify(INITIAL_ROUTINES));
  });

  const activeWeekday = WEEKDAYS[selectedDayIndex];
  const activeRoutine =
    userRoutines.find((r) => r.id === activeWeekday.routineId) ||
    userRoutines[0] ||
    INITIAL_ROUTINES[0];

  // Workout live tracker states
  const [activeExerciseList, setActiveExerciseList] = useState(activeRoutine.exercises);

  useEffect(() => {
    const match = userRoutines.find((r) => r.id === activeWeekday.routineId) || userRoutines[0];
    if (match) {
      setActiveExerciseList(match.exercises);
    }
  }, [selectedDayIndex, activeWeekday.routineId, userRoutines]);

  // Session timer
  const [sessionSeconds, setSessionSeconds] = useState<number>(1420); // starting at ~23m
  const [isSessionActive, setIsSessionActive] = useState<boolean>(true);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isSessionActive) {
      interval = setInterval(() => {
        setSessionSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isSessionActive]);

  // Rest Timer State
  const [restSecondsRemaining, setRestSecondsRemaining] = useState<number>(0);
  const [restTotalSeconds, setRestTotalSeconds] = useState<number>(60);
  const [isRestTimerRunning, setIsRestTimerRunning] = useState<boolean>(false);
  const restTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRestTimerRunning && restSecondsRemaining > 0) {
      restTimerRef.current = setInterval(() => {
        setRestSecondsRemaining((prev) => {
          if (prev <= 1) {
            setIsRestTimerRunning(false);
            playBeep();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (restTimerRef.current) clearInterval(restTimerRef.current);
    }
    return () => {
      if (restTimerRef.current) clearInterval(restTimerRef.current);
    };
  }, [isRestTimerRunning, restSecondsRemaining]);

  const playBeep = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
        osc.start();
        osc.stop(ctx.currentTime + 0.4);
      }
    } catch {
      // Audio might be constrained by browser policy; safe fallback
    }
  };

  const startRestTimer = (seconds: number) => {
    setRestTotalSeconds(seconds);
    setRestSecondsRemaining(seconds);
    setIsRestTimerRunning(true);
  };

  const handleAdjustRest = (delta: number) => {
    setRestSecondsRemaining((prev) => Math.max(0, prev + delta));
  };

  // Workout Set Handlers
  const handleUpdateWeight = (exIdx: number, setIdx: number, delta: number) => {
    setActiveExerciseList((prev) => {
      const copy = [...prev];
      const item = { ...copy[exIdx] };
      const sets = [...item.sets];
      const s = { ...sets[setIdx] };
      s.weightKg = Math.max(0, Math.round((s.weightKg + delta) * 10) / 10);
      sets[setIdx] = s;
      item.sets = sets;
      copy[exIdx] = item;
      return copy;
    });
  };

  const handleUpdateReps = (exIdx: number, setIdx: number, delta: number) => {
    setActiveExerciseList((prev) => {
      const copy = [...prev];
      const item = { ...copy[exIdx] };
      const sets = [...item.sets];
      const s = { ...sets[setIdx] };
      const curr = s.completedReps ?? s.targetReps;
      s.completedReps = Math.max(1, curr + delta);
      sets[setIdx] = s;
      item.sets = sets;
      copy[exIdx] = item;
      return copy;
    });
  };

  const handleToggleSetComplete = (exIdx: number, setIdx: number, restSec: number) => {
    setActiveExerciseList((prev) => {
      const copy = [...prev];
      const item = { ...copy[exIdx] };
      const sets = [...item.sets];
      const s = { ...sets[setIdx] };
      s.completed = !s.completed;
      if (s.completed && s.completedReps === undefined) {
        s.completedReps = s.targetReps;
      }
      sets[setIdx] = s;
      item.sets = sets;
      copy[exIdx] = item;
      return copy;
    });

    const isNowDone = !activeExerciseList[exIdx]?.sets[setIdx]?.completed;
    if (isNowDone) {
      startRestTimer(restSec || 60);
    }
  };

  const handleAddSet = (exIdx: number) => {
    setActiveExerciseList((prev) => {
      const copy = [...prev];
      const item = { ...copy[exIdx] };
      const lastSet = item.sets[item.sets.length - 1];
      const newSet = {
        setNumber: item.sets.length + 1,
        weightKg: lastSet ? lastSet.weightKg : 20,
        targetReps: lastSet ? lastSet.targetReps : 10,
        completed: false
      };
      item.sets = [...item.sets, newSet];
      copy[exIdx] = item;
      return copy;
    });
  };

  const handleSwapExercise = (exIdx: number) => {
    const currentItem = activeExerciseList[exIdx];
    if (!currentItem) return;
    const altId = currentItem.exercise.alternativeExerciseId;
    if (!altId) return;

    const replacement = exercises.find((e) => e.id === altId);
    if (!replacement) return;

    setActiveExerciseList((prev) => {
      const copy = [...prev];
      copy[exIdx] = {
        ...copy[exIdx],
        exerciseId: replacement.id,
        exercise: replacement
      };
      return copy;
    });
  };

  // Exercise Library Browser Modal / Drawer State
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [selectedMuscleFilter, setSelectedMuscleFilter] = useState<string>('all');
  const [exerciseSearch, setExerciseSearch] = useState<string>('');

  const filteredExercises = exercises.filter((ex) => {
    const matchMuscle = selectedMuscleFilter === 'all' || ex.targetMuscle.toLowerCase() === selectedMuscleFilter.toLowerCase();
    const matchSearch =
      ex.name.toLowerCase().includes(exerciseSearch.toLowerCase()) ||
      ex.targetMuscle.toLowerCase().includes(exerciseSearch.toLowerCase()) ||
      ex.equipmentRequired.toLowerCase().includes(exerciseSearch.toLowerCase());
    return matchMuscle && matchSearch;
  });

  const handleAddExerciseFromLibrary = (exercise: Exercise) => {
    setActiveExerciseList((prev) => [
      ...prev,
      {
        exerciseId: exercise.id,
        exercise,
        sets: [
          { setNumber: 1, weightKg: 20, targetReps: 10, completed: false },
          { setNumber: 2, weightKg: 20, targetReps: 10, completed: false },
          { setNumber: 3, weightKg: 20, targetReps: 10, completed: false }
        ],
        restSeconds: 60
      }
    ]);
    setIsLibraryOpen(false);
  };

  // Workout Summary Stats
  const totalSets = activeExerciseList.reduce((acc, item) => acc + item.sets.length, 0);
  const completedSets = activeExerciseList.reduce(
    (acc, item) => acc + item.sets.filter((s) => s.completed).length,
    0
  );
  const totalVolumeKg = activeExerciseList.reduce((acc, item) => {
    return (
      acc +
      item.sets
        .filter((s) => s.completed)
        .reduce((sAcc, s) => sAcc + s.weightKg * (s.completedReps ?? s.targetReps), 0)
    );
  }, 0);

  // Diet Plan State
  const [dietPref, setDietPref] = useState<'vegetarian' | 'eggetarian' | 'non_veg'>(
    currentMember?.dietaryPreference || 'vegetarian'
  );
  const dietPlan: DietPlan = INITIAL_DIET_PLANS[dietPref] || INITIAL_DIET_PLANS.vegetarian;

  const formatTimer = (totalSec: number) => {
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 space-y-6">
      {/* Athlete Profile & Membership Validity Card */}
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
              <Badge variant={currentMember.status === 'active' ? 'success' : 'destructive'}>
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
      <TabsList className="w-full sm:w-auto grid grid-cols-3 sm:flex h-auto p-1 bg-[#0b0e14] border-[#1e2330]">
        <TabsTrigger
          value="training"
          onClick={() => setActivePortalTab('training')}
          className={cn(
            "flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-bold text-xs transition-all",
            activePortalTab === 'training' && "bg-[#121724] text-[#ccff00] border border-[#293246] shadow-xs"
          )}
        >
          <Dumbbell className="h-4 w-4" />
          <span className="hidden sm:inline">Training & Workout</span>
          <span className="sm:hidden">Workout</span>
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

      {/* TAB 1: NATIVE TRAINING & WORKOUT SUITE */}
      {activePortalTab === 'training' && (
        <div className="space-y-6">
          {/* Header Action Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-[#222738] bg-[#0c0f16] p-4 sm:p-5 shadow-md">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#ccff00] text-black shadow-md shrink-0">
                <Dumbbell className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-black text-sm sm:text-base text-white">
                  {activeWeekday.split} — {activeWeekday.full}
                </h3>
                <p className="text-xs text-zinc-400 font-medium">
                  {activeWeekday.tag} • Routine tailored for {currentMember.fitnessGoal.replace('_', ' ')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 self-start sm:self-auto">
              <button
                onClick={() => setIsLibraryOpen(true)}
                className="flex items-center gap-1.5 rounded-xl border border-[#262c3e] bg-[#121622] px-3.5 py-2 text-xs font-bold text-zinc-200 hover:border-[#ccff00] hover:text-[#ccff00] transition-all shadow-xs"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Exercise</span>
              </button>

              <a
                href="/opengym/index.html"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-xl border border-[#262c3e] bg-[#121622] px-3.5 py-2 text-xs font-bold text-zinc-300 hover:text-white transition-all shadow-xs"
                title="Launch standalone openGym app with 5,600+ animated exercises"
              >
                <ExternalLink className="h-3.5 w-3.5 text-[#ccff00]" />
                <span className="hidden sm:inline">openGym PWA</span>
              </a>
            </div>
          </div>

          {/* Weekday Split Pills Strip */}
          <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
            {WEEKDAYS.map((w, idx) => {
              const isSelected = selectedDayIndex === idx;
              return (
                <button
                  key={w.day}
                  onClick={() => setSelectedDayIndex(idx)}
                  className={cn(
                    "flex flex-col items-center justify-center py-2.5 px-1 rounded-xl border transition-all text-center",
                    isSelected
                      ? "border-[#ccff00] bg-[#ccff00]/10 text-white shadow-sm"
                      : "border-[#1e2330] bg-[#0c0f16] text-zinc-400 hover:border-[#2f384c] hover:text-zinc-200"
                  )}
                >
                  <span className={cn("text-[11px] font-bold uppercase", isSelected ? "text-[#ccff00]" : "text-zinc-500")}>
                    {w.day}
                  </span>
                  <span className="text-xs font-extrabold truncate max-w-full px-0.5 mt-0.5 hidden md:block">
                    {w.split.replace(' Day A', '').replace(' Day', '')}
                  </span>
                  {isSelected && (
                    <span className="h-1 w-1 rounded-full bg-[#ccff00] mt-1" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Active Workout Session Metrics Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-2xl border border-[#222738] bg-[#0c0f16] p-3.5 shadow-md flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Workout Time</span>
                <div className="mt-0.5 font-mono text-xl font-black text-white flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-[#ccff00]" />
                  <span>{formatTimer(sessionSeconds)}</span>
                </div>
              </div>
              <button
                onClick={() => setIsSessionActive((prev) => !prev)}
                className="h-7 w-7 rounded-lg border border-[#2a3244] bg-[#121622] flex items-center justify-center text-zinc-300 hover:text-white"
                title={isSessionActive ? "Pause workout timer" : "Resume workout timer"}
              >
                {isSessionActive ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5 text-[#ccff00]" />}
              </button>
            </div>

            <div className="rounded-2xl border border-[#222738] bg-[#0c0f16] p-3.5 shadow-md">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Sets Completed</span>
              <div className="mt-0.5 font-mono text-xl font-black text-white">
                <span className="text-[#ccff00]">{completedSets}</span> / {totalSets}
              </div>
            </div>

            <div className="rounded-2xl border border-[#222738] bg-[#0c0f16] p-3.5 shadow-md">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Volume Lifted</span>
              <div className="mt-0.5 font-mono text-xl font-black text-white">
                {totalVolumeKg.toLocaleString('en-IN')} <span className="text-xs text-zinc-400 font-sans font-normal">kg</span>
              </div>
            </div>

            <div className="rounded-2xl border border-[#222738] bg-[#0c0f16] p-3.5 shadow-md">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Weekly Streak</span>
              <div className="mt-0.5 font-mono text-xl font-black text-emerald-400 flex items-center gap-1">
                <Flame className="h-4 w-4 text-orange-400 fill-orange-400" />
                <span>4 Sessions</span>
              </div>
            </div>
          </div>

          {/* Live Rest Timer Banner (Floats / displays whenever active) */}
          {restSecondsRemaining > 0 && (
            <div className="rounded-2xl border border-[#ccff00]/40 bg-[#121820] p-4 shadow-lg animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ccff00] text-black font-mono font-black text-sm">
                    {restSecondsRemaining}s
                  </div>
                  <div>
                    <h4 className="font-black text-sm text-white">Rest Interval Countdown</h4>
                    <p className="text-xs text-zinc-400">Recover breathing and hydrate before the next set</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleAdjustRest(-15)}
                    className="rounded-lg border border-[#2e374e] bg-[#181f2d] px-2.5 py-1 text-xs font-bold text-zinc-300 hover:text-white"
                  >
                    -15s
                  </button>
                  <button
                    onClick={() => handleAdjustRest(15)}
                    className="rounded-lg border border-[#2e374e] bg-[#181f2d] px-2.5 py-1 text-xs font-bold text-zinc-300 hover:text-white"
                  >
                    +15s
                  </button>
                  <button
                    onClick={() => {
                      setIsRestTimerRunning(false);
                      setRestSecondsRemaining(0);
                    }}
                    className="rounded-lg border border-[#2e374e] bg-[#181f2d] px-3 py-1 text-xs font-bold text-zinc-300 hover:text-red-400"
                  >
                    Skip Rest
                  </button>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-[#1e2536]">
                <div
                  className="h-full bg-[#ccff00] transition-all duration-1000 ease-linear rounded-full"
                  style={{ width: `${Math.min(100, (restSecondsRemaining / restTotalSeconds) * 100)}%` }}
                />
              </div>
            </div>
          )}

          {/* Exercise Cards Stack */}
          <div className="space-y-4">
            {activeExerciseList.map((item, exIdx) => {
              const hasAlternative = !!item.exercise.alternativeExerciseId;
              const completedCount = item.sets.filter((s) => s.completed).length;

              return (
                <div
                  key={`${item.exerciseId}-${exIdx}`}
                  className="rounded-2xl border border-[#222738] bg-[#0c0f16] p-4 sm:p-5 shadow-md space-y-4"
                >
                  {/* Exercise Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1b202c] pb-3.5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#181f2c] border border-[#252e42] text-xs font-mono font-black text-[#ccff00]">
                        #{exIdx + 1}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-black text-sm sm:text-base text-white">
                            {item.exercise.name}
                          </h4>
                          <span className="rounded-full border border-[#283248] bg-[#121722] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#ccff00]">
                            {item.exercise.targetMuscle}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-400 mt-0.5">
                          Equipment: <span className="text-zinc-200">{item.exercise.equipmentRequired}</span> • Rest: {item.restSeconds}s
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      {hasAlternative && (
                        <button
                          onClick={() => handleSwapExercise(exIdx)}
                          className="flex items-center gap-1 rounded-lg border border-[#273042] bg-[#121622] px-2.5 py-1 text-xs font-bold text-zinc-300 hover:border-[#ccff00] hover:text-[#ccff00] transition-colors"
                          title="Busy station? Swap with equivalent movement pattern"
                        >
                          <ArrowLeftRight className="h-3 w-3" />
                          <span>Swap Machine</span>
                        </button>
                      )}
                      <span className="font-mono text-xs font-bold text-zinc-400">
                        {completedCount}/{item.sets.length} Done
                      </span>
                    </div>
                  </div>

                  {/* Form Cues Preview */}
                  {item.exercise.cues && item.exercise.cues.length > 0 && (
                    <div className="rounded-xl border border-[#1e2536] bg-[#0a0d14] px-3 py-2 text-[11px] text-zinc-400 flex items-start gap-2">
                      <Info className="h-3.5 w-3.5 text-[#ccff00] shrink-0 mt-0.5" />
                      <div className="space-x-2">
                        <strong className="text-zinc-200 font-bold">Coach Cues:</strong>
                        <span>{item.exercise.cues.join(' • ')}</span>
                      </div>
                    </div>
                  )}

                  {/* Sets Table */}
                  <div className="space-y-2">
                    <div className="grid grid-cols-12 gap-2 text-[10px] font-bold uppercase tracking-wider text-zinc-500 px-2">
                      <div className="col-span-2">Set</div>
                      <div className="col-span-4">Weight (kg)</div>
                      <div className="col-span-3">Reps</div>
                      <div className="col-span-3 text-right">Status</div>
                    </div>

                    {item.sets.map((set, setIdx) => {
                      const repsToDisplay = set.completedReps ?? set.targetReps;

                      return (
                        <div
                          key={set.setNumber || setIdx}
                          className={cn(
                            "grid grid-cols-12 gap-2 items-center rounded-xl p-2.5 border transition-all",
                            set.completed
                              ? "border-emerald-500/30 bg-emerald-950/10"
                              : "border-[#1d2332] bg-[#10141e] hover:border-[#283248]"
                          )}
                        >
                          {/* Set Number */}
                          <div className="col-span-2 flex items-center gap-1.5 font-mono text-xs font-bold text-zinc-300">
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#1b2230] text-[11px]">
                              {set.setNumber}
                            </span>
                          </div>

                          {/* Weight Steppers */}
                          <div className="col-span-4 flex items-center gap-1">
                            <button
                              onClick={() => handleUpdateWeight(exIdx, setIdx, -2.5)}
                              className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#2b3346] bg-[#161c28] text-xs font-bold text-zinc-300 hover:border-[#ccff00] hover:text-white transition-colors"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="min-w-[44px] text-center font-mono font-black text-xs sm:text-sm text-white">
                              {set.weightKg}kg
                            </span>
                            <button
                              onClick={() => handleUpdateWeight(exIdx, setIdx, 2.5)}
                              className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#2b3346] bg-[#161c28] text-xs font-bold text-zinc-300 hover:border-[#ccff00] hover:text-white transition-colors"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>

                          {/* Reps Steppers */}
                          <div className="col-span-3 flex items-center gap-1">
                            <button
                              onClick={() => handleUpdateReps(exIdx, setIdx, -1)}
                              className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#2b3346] bg-[#161c28] text-xs font-bold text-zinc-300 hover:border-[#ccff00] hover:text-white transition-colors"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="min-w-[28px] text-center font-mono font-black text-xs sm:text-sm text-white">
                              {repsToDisplay}
                            </span>
                            <button
                              onClick={() => handleUpdateReps(exIdx, setIdx, 1)}
                              className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#2b3346] bg-[#161c28] text-xs font-bold text-zinc-300 hover:border-[#ccff00] hover:text-white transition-colors"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>

                          {/* Complete Checkoff */}
                          <div className="col-span-3 text-right">
                            <button
                              onClick={() => handleToggleSetComplete(exIdx, setIdx, item.restSeconds)}
                              className={cn(
                                "rounded-xl px-3 py-1.5 text-xs font-extrabold uppercase tracking-wider transition-all inline-flex items-center gap-1",
                                set.completed
                                  ? "bg-emerald-500 text-black font-black"
                                  : "border border-[#ccff00]/40 bg-[#ccff00]/10 text-[#ccff00] hover:bg-[#ccff00] hover:text-black"
                              )}
                            >
                              {set.completed ? (
                                <>
                                  <Check className="h-3.5 w-3.5 stroke-[3]" />
                                  <span>Done</span>
                                </>
                              ) : (
                                <span>Log Set</span>
                              )}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Add Set Button */}
                  <button
                    onClick={() => handleAddSet(exIdx)}
                    className="flex items-center gap-1.5 text-xs font-bold text-zinc-400 hover:text-[#ccff00] transition-colors py-1 px-2 rounded-lg border border-dashed border-[#232a3c] hover:border-[#ccff00]/50"
                  >
                    <Plus className="h-3 w-3" />
                    <span>Add Set</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* EXERCISE LIBRARY MODAL */}
      {isLibraryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-2xl rounded-3xl border border-[#2b344a] bg-[#0c1017] p-5 sm:p-6 shadow-2xl space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-[#1e2638] pb-4">
              <div>
                <h3 className="text-lg font-black text-white">Exercise Directory</h3>
                <p className="text-xs text-zinc-400">Search and add movements to your current workout routine</p>
              </div>
              <button
                onClick={() => setIsLibraryOpen(false)}
                className="h-8 w-8 rounded-full border border-[#2b344a] bg-[#121622] flex items-center justify-center text-zinc-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-zinc-500" />
              <input
                type="text"
                value={exerciseSearch}
                onChange={(e) => setExerciseSearch(e.target.value)}
                placeholder="Search exercise name, muscle (chest, back), or equipment..."
                className="w-full rounded-xl border border-[#222a3c] bg-[#111622] py-2.5 pl-10 pr-4 text-xs font-medium text-white placeholder-zinc-500 outline-none focus:border-[#ccff00]"
              />
            </div>

            {/* Muscle Group Filters */}
            <div className="flex flex-wrap gap-1.5">
              {['all', 'chest', 'back', 'quads', 'hamstrings', 'deltoids', 'biceps', 'triceps', 'core'].map((m) => (
                <button
                  key={m}
                  onClick={() => setSelectedMuscleFilter(m)}
                  className={cn(
                    "rounded-lg px-2.5 py-1 text-xs font-bold uppercase tracking-wider transition-colors",
                    selectedMuscleFilter === m
                      ? "bg-[#ccff00] text-black"
                      : "border border-[#222a3c] bg-[#111622] text-zinc-400 hover:text-white"
                  )}
                >
                  {m}
                </button>
              ))}
            </div>

            {/* Exercise List */}
            <div className="overflow-y-auto space-y-2 pr-1 flex-1">
              {filteredExercises.map((ex) => (
                <div
                  key={ex.id}
                  className="flex items-center justify-between rounded-xl border border-[#1e2638] bg-[#111622] p-3 hover:border-[#2f3b54] transition-colors"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-white">{ex.name}</span>
                      <span className="rounded-full border border-[#273248] bg-[#0c1017] px-2 py-0.5 text-[9px] font-bold uppercase text-[#ccff00]">
                        {ex.targetMuscle}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400 mt-0.5">
                      {ex.equipmentRequired} • {ex.movementPattern.replace('_', ' ')}
                    </p>
                  </div>

                  <button
                    onClick={() => handleAddExerciseFromLibrary(ex)}
                    className="flex items-center gap-1 rounded-xl bg-[#ccff00] px-3 py-1.5 text-xs font-bold text-black hover:bg-[#d8ff33] transition-colors shrink-0"
                  >
                    <Plus className="h-3.5 w-3.5 stroke-[3]" />
                    <span>Add</span>
                  </button>
                </div>
              ))}
            </div>
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
