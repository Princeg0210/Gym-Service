'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Dumbbell,
  Play,
  Pause,
  RotateCcw,
  Check,
  CheckCircle2,
  Plus,
  Minus,
  Trash2,
  Search,
  Filter,
  Calendar,
  TrendingUp,
  Flame,
  Trophy,
  Clock,
  Calculator,
  Volume2,
  Sparkles,
  ChevronRight,
  ChevronDown,
  Info,
  X,
  Layers,
  ArrowRight,
  Scale
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Member } from '@/types';

export interface ExerciseItem {
  id: string;
  n: string; // name
  bp: string; // bodyPart
  eq: string; // equipment
  tg: string; // target
  mg?: string; // main muscle group
  sm?: string[]; // secondary muscles
  img?: string; // still image filename e.g. "0001.webp"
  gif?: string; // motion clip filename e.g. "0001.mp4"
  cat?: string; // category
}

export interface WorkoutSetData {
  id: string;
  setNumber: number;
  weightKg: number;
  reps: number;
  completed: boolean;
  rpe?: number;
}

export interface SessionExercise {
  exerciseId: string;
  exerciseName: string;
  targetMuscle: string;
  equipment: string;
  sets: WorkoutSetData[];
  restSeconds: number;
}

export interface RoutinePreset {
  id: string;
  name: string;
  description: string;
  dayCount: number;
  schedule: { dayIndex: number; dayName: string; routineTitle: string; exerciseIds: string[] }[];
}

// Curated instant starter exercises to guarantee 0ms instant render while 5,600+ database loads
const CURATED_EXERCISES: ExerciseItem[] = [
  { id: '0025', n: 'barbell bench press', bp: 'chest', eq: 'barbell', tg: 'pectorals', sm: ['triceps', 'front deltoids'], img: '0025.webp', gif: '0025.mp4' },
  { id: '0047', n: 'barbell incline bench press', bp: 'chest', eq: 'barbell', tg: 'pectorals', sm: ['upper chest', 'front deltoids'], img: '0047.webp', gif: '0047.mp4' },
  { id: '0043', n: 'barbell full squat', bp: 'upper legs', eq: 'barbell', tg: 'quads', sm: ['glutes', 'hamstrings'], img: '0043.webp', gif: '0043.mp4' },
  { id: '0085', n: 'romanian deadlift', bp: 'upper legs', eq: 'barbell', tg: 'hamstrings', sm: ['glutes', 'lower back'], img: '0085.webp', gif: '0085.mp4' },
  { id: '2330', n: 'lat pulldown', bp: 'back', eq: 'cable', tg: 'lats', sm: ['biceps', 'rhomboids'], img: '2330.webp', gif: '2330.mp4' },
  { id: '0027', n: 'barbell bent over row', bp: 'back', eq: 'barbell', tg: 'upper back', sm: ['lats', 'biceps'], img: '0027.webp', gif: '0027.mp4' },
  { id: '1323', n: 'seated cable row', bp: 'back', eq: 'cable', tg: 'lats', sm: ['rhomboids', 'biceps'], img: '1323.webp', gif: '1323.mp4' },
  { id: '0426', n: 'dumbbell shoulder press', bp: 'shoulders', eq: 'dumbbell', tg: 'delts', sm: ['triceps', 'trapezius'], img: '0426.webp', gif: '0426.mp4' },
  { id: '0334', n: 'dumbbell lateral raise', bp: 'shoulders', eq: 'dumbbell', tg: 'lateral deltoids', sm: ['trapezius'], img: '0334.webp', gif: '0334.mp4' },
  { id: '0241', n: 'dumbbell hammer curl', bp: 'upper arms', eq: 'dumbbell', tg: 'biceps', sm: ['brachialis', 'forearms'], img: '0241.webp', gif: '0241.mp4' },
  { id: '0031', n: 'barbell curl', bp: 'upper arms', eq: 'barbell', tg: 'biceps', sm: ['forearms'], img: '0031.webp', gif: '0031.mp4' },
  { id: '0313', n: 'cable rope pushdown', bp: 'upper arms', eq: 'cable', tg: 'triceps', sm: ['forearms'], img: '0313.webp', gif: '0313.mp4' },
  { id: '0251', n: 'barbell lying triceps extension', bp: 'upper arms', eq: 'barbell', tg: 'triceps', sm: ['forearms'], img: '0251.webp', gif: '0251.mp4' },
  { id: '0739', n: 'leg press', bp: 'upper legs', eq: 'leverage machine', tg: 'quads', sm: ['glutes', 'calves'], img: '0739.webp', gif: '0739.mp4' },
  { id: '0585', n: 'leg extension', bp: 'upper legs', eq: 'leverage machine', tg: 'quads', sm: [], img: '0585.webp', gif: '0585.mp4' },
  { id: '0586', n: 'seated leg curl', bp: 'upper legs', eq: 'leverage machine', tg: 'hamstrings', sm: ['calves'], img: '0586.webp', gif: '0586.mp4' },
  { id: '0605', n: 'standing calf raise', bp: 'lower legs', eq: 'barbell', tg: 'calves', sm: ['soleus'], img: '0605.webp', gif: '0605.mp4' },
  { id: '0001', n: '3/4 sit-up', bp: 'waist', eq: 'body weight', tg: 'abs', sm: ['hip flexors'], img: '0001.webp', gif: '0001.mp4' },
  { id: '0652', n: 'push up', bp: 'chest', eq: 'body weight', tg: 'pectorals', sm: ['triceps', 'deltoids'], img: '0652.webp', gif: '0652.mp4' },
  { id: '0300', n: 'pull up', bp: 'back', eq: 'body weight', tg: 'lats', sm: ['biceps'], img: '0300.webp', gif: '0300.mp4' }
];

const PRESET_SPLITS: RoutinePreset[] = [
  {
    id: 'ppl',
    name: 'Push / Pull / Legs (PPL)',
    description: 'Gold standard 3-day split for muscle hypertrophy & balanced recovery',
    dayCount: 3,
    schedule: [
      { dayIndex: 1, dayName: 'Monday', routineTitle: 'Push Day (Chest, Shoulders, Triceps)', exerciseIds: ['0025', '0047', '0426', '0334', '0313', '0251'] },
      { dayIndex: 3, dayName: 'Wednesday', routineTitle: 'Pull Day (Back, Lats, Biceps)', exerciseIds: ['2330', '0027', '1323', '0031', '0241'] },
      { dayIndex: 5, dayName: 'Friday', routineTitle: 'Leg Day (Quads, Hamstrings, Calves)', exerciseIds: ['0043', '0085', '0739', '0585', '0586', '0605'] }
    ]
  },
  {
    id: 'upper-lower',
    name: 'Upper / Lower Split',
    description: 'High-frequency 4-day athletic strength split for compound progression',
    dayCount: 4,
    schedule: [
      { dayIndex: 1, dayName: 'Monday', routineTitle: 'Upper Body A (Power Focus)', exerciseIds: ['0025', '2330', '0047', '1323', '0334'] },
      { dayIndex: 2, dayName: 'Tuesday', routineTitle: 'Lower Body A (Squat Focus)', exerciseIds: ['0043', '0085', '0739', '0605'] },
      { dayIndex: 4, dayName: 'Thursday', routineTitle: 'Upper Body B (Hypertrophy)', exerciseIds: ['0047', '0027', '0426', '0241', '0313'] },
      { dayIndex: 5, dayName: 'Friday', routineTitle: 'Lower Body B (Deadlift Focus)', exerciseIds: ['0085', '0739', '0585', '0586'] }
    ]
  },
  {
    id: '5x5',
    name: 'StrongLifts 5×5 Strength',
    description: 'Proven linear progression on compound barbell lifts for raw power',
    dayCount: 3,
    schedule: [
      { dayIndex: 1, dayName: 'Monday', routineTitle: '5×5 Workout A (Squat, Bench, Row)', exerciseIds: ['0043', '0025', '0027'] },
      { dayIndex: 3, dayName: 'Wednesday', routineTitle: '5×5 Workout B (Squat, OHP, Deadlift)', exerciseIds: ['0043', '0426', '0085'] },
      { dayIndex: 5, dayName: 'Friday', routineTitle: '5×5 Workout C (Squat, Incline, Pulldown)', exerciseIds: ['0043', '0047', '2330'] }
    ]
  }
];

function playTimerChime() {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
    osc.start();
    osc.stop(ctx.currentTime + 0.5);
  } catch {
    // Audio context not allowed without prior interaction or unsupported
  }
}

interface MemberTrainingHubProps {
  currentMember?: Member;
  gymName?: string;
}

export function MemberTrainingHub({ currentMember }: MemberTrainingHubProps) {
  const [subTab, setSubTab] = useState<'session' | 'planner' | 'library' | 'analytics'>('session');

  // Exercise Database state
  const [allExercises, setAllExercises] = useState<ExerciseItem[]>(CURATED_EXERCISES);
  const [instructionsMap, setInstructionsMap] = useState<Record<string, string[]>>({});
  const [isLoadingExercises, setIsLoadingExercises] = useState<boolean>(false);

  // Active Workout Session State
  const [activeRoutineTitle, setActiveRoutineTitle] = useState<string>('Push Day (Chest, Shoulders, Triceps)');
  const [sessionExercises, setSessionExercises] = useState<SessionExercise[]>([
    {
      exerciseId: '0025',
      exerciseName: 'Barbell Bench Press',
      targetMuscle: 'Pectorals',
      equipment: 'Barbell',
      restSeconds: 90,
      sets: [
        { id: 's1', setNumber: 1, weightKg: 60, reps: 10, completed: true, rpe: 7 },
        { id: 's2', setNumber: 2, weightKg: 70, reps: 8, completed: true, rpe: 8 },
        { id: 's3', setNumber: 3, weightKg: 75, reps: 6, completed: false, rpe: 8.5 },
        { id: 's4', setNumber: 4, weightKg: 75, reps: 6, completed: false, rpe: 9 }
      ]
    },
    {
      exerciseId: '0047',
      exerciseName: 'Barbell Incline Bench Press',
      targetMuscle: 'Upper Chest',
      equipment: 'Barbell',
      restSeconds: 90,
      sets: [
        { id: 's5', setNumber: 1, weightKg: 50, reps: 10, completed: false, rpe: 8 },
        { id: 's6', setNumber: 2, weightKg: 55, reps: 8, completed: false, rpe: 8.5 },
        { id: 's7', setNumber: 3, weightKg: 55, reps: 8, completed: false, rpe: 9 }
      ]
    },
    {
      exerciseId: '0426',
      exerciseName: 'Dumbbell Shoulder Press',
      targetMuscle: 'Deltoids',
      equipment: 'Dumbbell',
      restSeconds: 60,
      sets: [
        { id: 's8', setNumber: 1, weightKg: 18, reps: 10, completed: false },
        { id: 's9', setNumber: 2, weightKg: 20, reps: 8, completed: false },
        { id: 's10', setNumber: 3, weightKg: 20, reps: 8, completed: false }
      ]
    },
    {
      exerciseId: '0334',
      exerciseName: 'Dumbbell Lateral Raise',
      targetMuscle: 'Lateral Deltoids',
      equipment: 'Dumbbell',
      restSeconds: 45,
      sets: [
        { id: 's11', setNumber: 1, weightKg: 10, reps: 12, completed: false },
        { id: 's12', setNumber: 2, weightKg: 10, reps: 12, completed: false },
        { id: 's13', setNumber: 3, weightKg: 10, reps: 12, completed: false }
      ]
    }
  ]);

  // Session timer (clock)
  const [sessionSeconds, setSessionSeconds] = useState<number>(1420); // starts ~23 mins into workout
  const [isSessionActive, setIsSessionActive] = useState<boolean>(true);

  // Rest Timer State
  const [restTimerSeconds, setRestTimerSeconds] = useState<number>(0);
  const [restTimerTotal, setRestTimerTotal] = useState<number>(60);
  const [isRestRunning, setIsRestRunning] = useState<boolean>(false);

  // Plate Calculator Modal
  const [plateCalcWeight, setPlateCalcWeight] = useState<number>(80);
  const [showPlateModal, setShowPlateModal] = useState<boolean>(false);

  // Form Guide / Demo Modal
  const [inspectExercise, setInspectExercise] = useState<ExerciseItem | null>(null);

  // Finish Workout Modal
  const [showFinishModal, setShowFinishModal] = useState<boolean>(false);
  const [workoutFinishedStats, setWorkoutFinishedStats] = useState<{ volumeKg: number; setsCount: number; durationMin: number } | null>(null);

  // Routine Planner State
  const [activeSplitId, setActiveSplitId] = useState<string>('ppl');

  // Exercise Library Filters
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedMuscleFilter, setSelectedMuscleFilter] = useState<string>('all');
  const [selectedEquipFilter, setSelectedEquipFilter] = useState<string>('all');

  // Athlete Bodyweight Logger State
  const [currentWeight, setCurrentWeight] = useState<number>(74.5);
  const [targetWeight] = useState<number>(72.0);
  const [weightLogs, setWeightLogs] = useState<{ date: string; weight: number }[]>([
    { date: '12 Oct', weight: 75.8 },
    { date: '14 Oct', weight: 75.4 },
    { date: '16 Oct', weight: 75.0 },
    { date: '18 Oct', weight: 74.8 },
    { date: '20 Oct', weight: 74.5 }
  ]);
  const [newWeightInput, setNewWeightInput] = useState<string>('');

  // Load 5,632+ full exercise catalog asynchronously in background
  useEffect(() => {
    let isMounted = true;
    async function loadCatalog() {
      setIsLoadingExercises(true);
      try {
        const res = await fetch('/data/exercises.json');
        if (res.ok) {
          const data: ExerciseItem[] = await res.json();
          if (isMounted && Array.isArray(data) && data.length > 0) {
            setAllExercises(data);
          }
        }
      } catch {
        // Fallback to curated exercises
      } finally {
        if (isMounted) setIsLoadingExercises(false);
      }
    }
    loadCatalog();
    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch instructions when inspecting an exercise
  useEffect(() => {
    if (!inspectExercise) return;
    if (instructionsMap[inspectExercise.id]) return;

    async function loadInstructions() {
      try {
        const res = await fetch('/data/instructions.json');
        if (res.ok) {
          const map = await res.json();
          setInstructionsMap(map);
        }
      } catch {
        // Ignore fallback
      }
    }
    loadInstructions();
  }, [inspectExercise, instructionsMap]);

  // Session elapsed timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isSessionActive) {
      interval = setInterval(() => {
        setSessionSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isSessionActive]);

  // Rest Timer interval
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRestRunning && restTimerSeconds > 0) {
      interval = setInterval(() => {
        setRestTimerSeconds((prev) => {
          if (prev <= 1) {
            setIsRestRunning(false);
            playTimerChime();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRestRunning, restTimerSeconds]);

  // Trigger Rest Timer
  const startRestTimer = (seconds: number) => {
    setRestTimerTotal(seconds);
    setRestTimerSeconds(seconds);
    setIsRestRunning(true);
  };

  // Toggle set completion
  const handleToggleSet = (exIndex: number, setIndex: number) => {
    setSessionExercises((prev) => {
      const updated = [...prev];
      const ex = { ...updated[exIndex] };
      const sets = [...ex.sets];
      const targetSet = { ...sets[setIndex] };
      const nextCompleted = !targetSet.completed;
      targetSet.completed = nextCompleted;
      sets[setIndex] = targetSet;
      ex.sets = sets;
      updated[exIndex] = ex;

      // If user checked off a set, automatically trigger the exercise's rest timer
      if (nextCompleted) {
        startRestTimer(ex.restSeconds || 60);
      }
      return updated;
    });
  };

  // Adjust Set Weight
  const handleAdjustWeight = (exIndex: number, setIndex: number, delta: number) => {
    setSessionExercises((prev) => {
      const updated = [...prev];
      const sets = [...updated[exIndex].sets];
      const current = sets[setIndex].weightKg;
      sets[setIndex] = { ...sets[setIndex], weightKg: Math.max(0, Number((current + delta).toFixed(1))) };
      updated[exIndex] = { ...updated[exIndex], sets };
      return updated;
    });
  };

  // Adjust Set Reps
  const handleAdjustReps = (exIndex: number, setIndex: number, delta: number) => {
    setSessionExercises((prev) => {
      const updated = [...prev];
      const sets = [...updated[exIndex].sets];
      const current = sets[setIndex].reps;
      sets[setIndex] = { ...sets[setIndex], reps: Math.max(1, current + delta) };
      updated[exIndex] = { ...updated[exIndex], sets };
      return updated;
    });
  };

  // Add a set to an exercise
  const handleAddSet = (exIndex: number) => {
    setSessionExercises((prev) => {
      const updated = [...prev];
      const ex = updated[exIndex];
      const lastSet = ex.sets[ex.sets.length - 1];
      const newSet: WorkoutSetData = {
        id: `s-${Date.now()}-${Math.random()}`,
        setNumber: ex.sets.length + 1,
        weightKg: lastSet ? lastSet.weightKg : 20,
        reps: lastSet ? lastSet.reps : 10,
        completed: false
      };
      updated[exIndex] = { ...ex, sets: [...ex.sets, newSet] };
      return updated;
    });
  };

  // Remove a set from an exercise
  const handleRemoveSet = (exIndex: number, setIndex: number) => {
    setSessionExercises((prev) => {
      const updated = [...prev];
      const ex = updated[exIndex];
      if (ex.sets.length <= 1) return prev; // keep at least 1
      const filtered = ex.sets.filter((_, idx) => idx !== setIndex).map((s, idx) => ({ ...s, setNumber: idx + 1 }));
      updated[exIndex] = { ...ex, sets: filtered };
      return updated;
    });
  };

  // Add exercise to active session
  const handleAddExerciseToSession = (ex: ExerciseItem) => {
    const existing = sessionExercises.find((s) => s.exerciseId === ex.id);
    if (existing) {
      alert(`"${ex.n}" is already in your current workout.`);
      return;
    }
    const newEx: SessionExercise = {
      exerciseId: ex.id,
      exerciseName: ex.n.replace(/\b\w/g, (l) => l.toUpperCase()),
      targetMuscle: ex.tg.toUpperCase(),
      equipment: ex.eq.toUpperCase(),
      restSeconds: 60,
      sets: [
        { id: `s-${Date.now()}-1`, setNumber: 1, weightKg: 20, reps: 10, completed: false },
        { id: `s-${Date.now()}-2`, setNumber: 2, weightKg: 25, reps: 10, completed: false },
        { id: `s-${Date.now()}-3`, setNumber: 3, weightKg: 25, reps: 8, completed: false }
      ]
    };
    setSessionExercises((prev) => [...prev, newEx]);
    setSubTab('session');
  };

  // Remove exercise from active session
  const handleRemoveExerciseFromSession = (exIndex: number) => {
    setSessionExercises((prev) => prev.filter((_, idx) => idx !== exIndex));
  };

  // Finish Workout
  const handleFinishWorkout = () => {
    let totalVolume = 0;
    let completedSets = 0;
    sessionExercises.forEach((ex) => {
      ex.sets.forEach((set) => {
        if (set.completed) {
          totalVolume += set.weightKg * set.reps;
          completedSets += 1;
        }
      });
    });

    setWorkoutFinishedStats({
      volumeKg: totalVolume,
      setsCount: completedSets,
      durationMin: Math.max(1, Math.round(sessionSeconds / 60))
    });
    setShowFinishModal(true);
    setIsSessionActive(false);
  };

  // Plates Calculation Breakdown
  const plateBreakdown = useMemo(() => {
    const barWeight = 20; // 20kg Olympic Bar
    const remaining = Math.max(0, plateCalcWeight - barWeight);
    const perSide = remaining / 2;

    const availablePlates = [25, 20, 15, 10, 5, 2.5, 1.25];
    let weightLeft = perSide;
    const platesUsed: { plate: number; count: number }[] = [];

    availablePlates.forEach((plate) => {
      if (weightLeft >= plate) {
        const count = Math.floor(weightLeft / plate);
        platesUsed.push({ plate, count });
        weightLeft = Number((weightLeft % plate).toFixed(2));
      }
    });

    return { perSide, platesUsed, barWeight };
  }, [plateCalcWeight]);

  // Exercise Library Filtering
  const filteredExercises = useMemo(() => {
    let list = allExercises;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((e) => e.n.toLowerCase().includes(q) || e.tg.toLowerCase().includes(q) || e.bp.toLowerCase().includes(q));
    }

    if (selectedMuscleFilter !== 'all') {
      list = list.filter((e) => e.bp.toLowerCase().includes(selectedMuscleFilter) || e.tg.toLowerCase().includes(selectedMuscleFilter));
    }

    if (selectedEquipFilter !== 'all') {
      list = list.filter((e) => e.eq.toLowerCase().includes(selectedEquipFilter));
    }

    return list.slice(0, 120); // Render 120 items at a time for buttery smooth performance
  }, [allExercises, searchQuery, selectedMuscleFilter, selectedEquipFilter]);

  // Format seconds to mm:ss
  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${rem.toString().padStart(2, '0')}`;
  };

  const currentRoutinePreset = PRESET_SPLITS.find((p) => p.id === activeSplitId) || PRESET_SPLITS[0];

  return (
    <div className="space-y-6">
      {/* Sub Navigation Strip */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-[#1e2330] pb-4">
        <div className="flex items-center gap-1.5 overflow-x-auto p-1 rounded-xl bg-[#0b0e14] border border-[#1e2330] scrollbar-none">
          <button
            onClick={() => setSubTab('session')}
            className={cn(
              'flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer',
              subTab === 'session'
                ? 'bg-[#182032] text-[#ccff00] border border-[#2a3754] shadow-xs'
                : 'text-zinc-400 hover:text-white'
            )}
          >
            <Dumbbell className="h-4 w-4" />
            <span>Active Workout</span>
            {isSessionActive && (
              <span className="flex h-2 w-2 rounded-full bg-[#ccff00] animate-pulse" />
            )}
          </button>

          <button
            onClick={() => setSubTab('planner')}
            className={cn(
              'flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer',
              subTab === 'planner'
                ? 'bg-[#182032] text-[#ccff00] border border-[#2a3754] shadow-xs'
                : 'text-zinc-400 hover:text-white'
            )}
          >
            <Calendar className="h-4 w-4" />
            <span>Routines & Splits</span>
          </button>

          <button
            onClick={() => setSubTab('library')}
            className={cn(
              'flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer',
              subTab === 'library'
                ? 'bg-[#182032] text-[#ccff00] border border-[#2a3754] shadow-xs'
                : 'text-zinc-400 hover:text-white'
            )}
          >
            <Sparkles className="h-4 w-4" />
            <span>5,600+ Exercise Library</span>
          </button>

          <button
            onClick={() => setSubTab('analytics')}
            className={cn(
              'flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer',
              subTab === 'analytics'
                ? 'bg-[#182032] text-[#ccff00] border border-[#2a3754] shadow-xs'
                : 'text-zinc-400 hover:text-white'
            )}
          >
            <TrendingUp className="h-4 w-4" />
            <span>Progress & Analytics</span>
          </button>
        </div>

        {/* Global Workout Status Bar */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <div className="flex items-center gap-2 rounded-xl border border-[#232b3d] bg-[#0c1018] px-3 py-1.5 text-xs">
            <Clock className="h-3.5 w-3.5 text-zinc-400" />
            <span className="text-zinc-400">Duration:</span>
            <span className="font-mono font-bold text-white">{formatTimer(sessionSeconds)}</span>
          </div>

          <button
            onClick={() => setShowPlateModal(true)}
            className="flex items-center gap-1.5 rounded-xl border border-[#232b3d] bg-[#121622] px-3 py-1.5 text-xs font-bold text-zinc-300 hover:text-[#ccff00] hover:border-[#ccff00]/40 transition-colors cursor-pointer"
            title="Barbell Plate Calculator"
          >
            <Calculator className="h-3.5 w-3.5" />
            <span className="hidden md:inline">Plates</span>
          </button>
        </div>
      </div>

      {/* FLOATING REST TIMER NOTIFIER (when rest timer is active) */}
      {restTimerSeconds > 0 && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl border border-[#ccff00]/50 bg-[#0d121c]/95 p-3.5 shadow-2xl backdrop-blur-xl animate-in slide-in-from-bottom-5">
          <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-[#ccff00]/15 text-[#ccff00]">
            <Clock className="h-5 w-5 animate-spin" style={{ animationDuration: '4s' }} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Rest Timer</span>
              <Badge variant="outline" className="border-[#ccff00]/40 text-[#ccff00] text-[10px] py-0">
                {isRestRunning ? 'Counting Down' : 'Paused'}
              </Badge>
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="font-mono text-xl font-black text-white">{formatTimer(restTimerSeconds)}</span>
              <button
                onClick={() => setIsRestRunning(!isRestRunning)}
                className="rounded-lg p-1 text-zinc-300 hover:bg-[#1f283d] hover:text-white"
              >
                {isRestRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </button>
              <button
                onClick={() => setRestTimerSeconds((prev) => prev + 30)}
                className="rounded-lg bg-[#182030] px-2 py-0.5 text-[10px] font-bold text-[#ccff00] hover:bg-[#202b40]"
              >
                +30s
              </button>
              <button
                onClick={() => setRestTimerSeconds(0)}
                className="rounded-lg p-1 text-zinc-500 hover:text-zinc-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 1: ACTIVE WORKOUT SESSION TRACKER */}
      {/* ========================================================================= */}
      {subTab === 'session' && (
        <div className="space-y-6">
          {/* Workout Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-[#222738] bg-gradient-to-r from-[#0c0f16] to-[#121724] p-5 shadow-lg">
            <div>
              <div className="flex items-center gap-2">
                <span className="flex h-2.5 w-2.5 rounded-full bg-[#ccff00] animate-ping" />
                <span className="text-xs font-bold uppercase tracking-widest text-[#ccff00]">Live Workout Tracker</span>
              </div>
              <h2 className="mt-1 text-xl font-black text-white">{activeRoutineTitle}</h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Target: High hypertrophy tension • Log sets, weights & RPE with automatic rest countdowns
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setSubTab('library')}
                className="flex items-center gap-1.5 rounded-xl border border-[#273044] bg-[#121622] px-3.5 py-2 text-xs font-bold text-zinc-200 hover:text-white hover:border-zinc-500 transition-colors cursor-pointer"
              >
                <Plus className="h-4 w-4 text-[#ccff00]" />
                <span>Add Exercise</span>
              </button>

              <button
                onClick={handleFinishWorkout}
                className="flex items-center gap-1.5 rounded-xl bg-[#ccff00] px-4 py-2 text-xs font-black text-black hover:bg-[#d8ff33] transition-all shadow-md shadow-[#ccff00]/15 cursor-pointer"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>Finish Session</span>
              </button>
            </div>
          </div>

          {/* Quick Rest Presets Bar */}
          <div className="flex items-center justify-between gap-2 rounded-xl border border-[#1e2330] bg-[#090c12] px-4 py-2.5">
            <div className="flex items-center gap-2 text-xs text-zinc-400 font-medium">
              <Volume2 className="h-3.5 w-3.5 text-[#ccff00]" />
              <span>Quick Rest Timer:</span>
            </div>
            <div className="flex items-center gap-1.5">
              {[30, 60, 90, 120].map((sec) => (
                <button
                  key={sec}
                  onClick={() => startRestTimer(sec)}
                  className="rounded-lg border border-[#222a3b] bg-[#10141f] px-2.5 py-1 text-xs font-mono font-bold text-zinc-300 hover:border-[#ccff00]/60 hover:text-[#ccff00] transition-colors cursor-pointer"
                >
                  {sec}s
                </button>
              ))}
            </div>
          </div>

          {/* Exercises List */}
          <div className="space-y-5">
            {sessionExercises.map((ex, exIndex) => {
              const completedCount = ex.sets.filter((s) => s.completed).length;
              return (
                <Card key={ex.exerciseId + exIndex} className="border-[#222738] bg-[#0c0f16] overflow-hidden shadow-md">
                  {/* Exercise Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1b202e] bg-[#0e121b] p-4">
                    <div className="flex items-center gap-3">
                      {/* Exercise Media Thumbnail */}
                      <button
                        onClick={() => {
                          const matched = allExercises.find((item) => item.id === ex.exerciseId) || {
                            id: ex.exerciseId,
                            n: ex.exerciseName.toLowerCase(),
                            bp: ex.targetMuscle.toLowerCase(),
                            eq: ex.equipment.toLowerCase(),
                            tg: ex.targetMuscle.toLowerCase(),
                            img: `${ex.exerciseId}.webp`,
                            gif: `${ex.exerciseId}.mp4`
                          };
                          setInspectExercise(matched);
                        }}
                        className="group relative h-12 w-12 rounded-xl overflow-hidden border border-[#283248] bg-black shrink-0 hover:border-[#ccff00] transition-all cursor-pointer"
                        title="Click to view full HD motion guide"
                      >
                        <img
                          src={`/opengym/exercise-media/still/${ex.exerciseId}.webp`}
                          alt={ex.exerciseName}
                          className="h-full w-full object-cover group-hover:scale-110 transition-transform"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = '/logo.png';
                          }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Play className="h-4 w-4 text-[#ccff00] fill-[#ccff00]" />
                        </div>
                      </button>

                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-black text-sm text-white">{ex.exerciseName}</h3>
                          <Badge variant="outline" className="border-[#262e40] text-[10px] text-zinc-400 py-0">
                            {ex.equipment}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-zinc-400 mt-0.5">
                          <span>Target: <strong className="text-zinc-200">{ex.targetMuscle}</strong></span>
                          <span>•</span>
                          <span className="font-mono text-emerald-400">{completedCount} of {ex.sets.length} sets done</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <button
                        onClick={() => {
                          const matched = allExercises.find((item) => item.id === ex.exerciseId) || {
                            id: ex.exerciseId,
                            n: ex.exerciseName.toLowerCase(),
                            bp: ex.targetMuscle.toLowerCase(),
                            eq: ex.equipment.toLowerCase(),
                            tg: ex.targetMuscle.toLowerCase(),
                            img: `${ex.exerciseId}.webp`,
                            gif: `${ex.exerciseId}.mp4`
                          };
                          setInspectExercise(matched);
                        }}
                        className="flex items-center gap-1 rounded-lg border border-[#222a3b] bg-[#121724] px-2.5 py-1.5 text-xs font-bold text-zinc-300 hover:text-[#ccff00] hover:border-[#ccff00]/40 transition-colors cursor-pointer"
                      >
                        <Info className="h-3.5 w-3.5" />
                        <span>Form Guide</span>
                      </button>

                      <button
                        onClick={() => handleRemoveExerciseFromSession(exIndex)}
                        className="rounded-lg p-1.5 text-zinc-500 hover:bg-rose-950/40 hover:text-rose-400 transition-colors"
                        title="Remove from workout"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Sets Table */}
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-[#1b202e] text-[11px] font-bold uppercase tracking-wider text-zinc-400 bg-[#090c12]">
                            <th className="py-2.5 px-4 w-12 text-center">Set</th>
                            <th className="py-2.5 px-4">Weight (kg)</th>
                            <th className="py-2.5 px-4">Reps</th>
                            <th className="py-2.5 px-4 hidden sm:table-cell">Intensity / RPE</th>
                            <th className="py-2.5 px-4 text-right">Log Complete</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#171c28]">
                          {ex.sets.map((set, setIndex) => (
                            <tr
                              key={set.id}
                              className={cn(
                                'transition-colors',
                                set.completed ? 'bg-[#0f1710]/40' : 'hover:bg-[#10141f]/50'
                              )}
                            >
                              {/* Set Number */}
                              <td className="py-3 px-4 text-center font-mono font-bold text-zinc-400">
                                {set.setNumber}
                              </td>

                              {/* Weight Stepper */}
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-1.5">
                                  <button
                                    onClick={() => handleAdjustWeight(exIndex, setIndex, -2.5)}
                                    className="h-7 w-7 rounded-lg border border-[#232b3d] bg-[#121622] text-zinc-400 hover:text-white hover:border-zinc-500 flex items-center justify-center font-bold"
                                  >
                                    -
                                  </button>
                                  <input
                                    type="number"
                                    step="0.5"
                                    value={set.weightKg}
                                    onChange={(e) => {
                                      const val = parseFloat(e.target.value) || 0;
                                      setSessionExercises((prev) => {
                                        const updated = [...prev];
                                        updated[exIndex].sets[setIndex].weightKg = val;
                                        return updated;
                                      });
                                    }}
                                    className="w-16 rounded-lg border border-[#232b3d] bg-[#0c1018] py-1 text-center font-mono font-bold text-white focus:border-[#ccff00] outline-none"
                                  />
                                  <button
                                    onClick={() => handleAdjustWeight(exIndex, setIndex, 2.5)}
                                    className="h-7 w-7 rounded-lg border border-[#232b3d] bg-[#121622] text-zinc-400 hover:text-white hover:border-zinc-500 flex items-center justify-center font-bold"
                                  >
                                    +
                                  </button>
                                  <span className="text-[11px] text-zinc-400 font-mono hidden sm:inline">kg</span>
                                </div>
                              </td>

                              {/* Reps Stepper */}
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-1.5">
                                  <button
                                    onClick={() => handleAdjustReps(exIndex, setIndex, -1)}
                                    className="h-7 w-7 rounded-lg border border-[#232b3d] bg-[#121622] text-zinc-400 hover:text-white hover:border-zinc-500 flex items-center justify-center font-bold"
                                  >
                                    -
                                  </button>
                                  <input
                                    type="number"
                                    value={set.reps}
                                    onChange={(e) => {
                                      const val = parseInt(e.target.value) || 1;
                                      setSessionExercises((prev) => {
                                        const updated = [...prev];
                                        updated[exIndex].sets[setIndex].reps = val;
                                        return updated;
                                      });
                                    }}
                                    className="w-14 rounded-lg border border-[#232b3d] bg-[#0c1018] py-1 text-center font-mono font-bold text-white focus:border-[#ccff00] outline-none"
                                  />
                                  <button
                                    onClick={() => handleAdjustReps(exIndex, setIndex, 1)}
                                    className="h-7 w-7 rounded-lg border border-[#232b3d] bg-[#121622] text-zinc-400 hover:text-white hover:border-zinc-500 flex items-center justify-center font-bold"
                                  >
                                    +
                                  </button>
                                </div>
                              </td>

                              {/* RPE Selector */}
                              <td className="py-3 px-4 hidden sm:table-cell">
                                <select
                                  value={set.rpe || 8}
                                  onChange={(e) => {
                                    const val = parseFloat(e.target.value);
                                    setSessionExercises((prev) => {
                                      const updated = [...prev];
                                      updated[exIndex].sets[setIndex].rpe = val;
                                      return updated;
                                    });
                                  }}
                                  className="rounded-lg border border-[#222a3b] bg-[#121622] px-2 py-1 font-mono text-[11px] text-zinc-300 outline-none"
                                >
                                  <option value={6}>RPE 6 (Warmup / Easy)</option>
                                  <option value={7}>RPE 7 (3 reps in tank)</option>
                                  <option value={8}>RPE 8 (2 reps in tank)</option>
                                  <option value={8.5}>RPE 8.5 (1-2 reps)</option>
                                  <option value={9}>RPE 9 (1 rep in tank)</option>
                                  <option value={9.5}>RPE 9.5 (Hard)</option>
                                  <option value={10}>RPE 10 (Failure / Max)</option>
                                </select>
                              </td>

                              {/* Complete Button */}
                              <td className="py-3 px-4 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <button
                                    onClick={() => handleToggleSet(exIndex, setIndex)}
                                    className={cn(
                                      'flex items-center justify-center h-8 w-8 rounded-xl font-bold transition-all cursor-pointer',
                                      set.completed
                                        ? 'bg-[#ccff00] text-black shadow-md shadow-[#ccff00]/20'
                                        : 'border border-[#2e374d] bg-[#141926] text-zinc-400 hover:border-[#ccff00]/60 hover:text-white'
                                    )}
                                  >
                                    <Check className="h-4 w-4 stroke-[3]" />
                                  </button>
                                  {ex.sets.length > 1 && (
                                    <button
                                      onClick={() => handleRemoveSet(exIndex, setIndex)}
                                      className="text-zinc-600 hover:text-zinc-400 p-1"
                                    >
                                      <X className="h-3 w-3" />
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Add Set Footer Bar */}
                    <div className="flex items-center justify-between border-t border-[#1b202e] bg-[#090c12]/80 px-4 py-2.5">
                      <button
                        onClick={() => handleAddSet(exIndex)}
                        className="flex items-center gap-1.5 text-xs font-bold text-[#ccff00] hover:underline cursor-pointer"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        <span>Add Another Set</span>
                      </button>

                      <div className="flex items-center gap-2 text-xs text-zinc-400">
                        <span>Rest Target:</span>
                        <select
                          value={ex.restSeconds}
                          onChange={(e) => {
                            const val = parseInt(e.target.value) || 60;
                            setSessionExercises((prev) => {
                              const updated = [...prev];
                              updated[exIndex].restSeconds = val;
                              return updated;
                            });
                          }}
                          className="rounded border border-[#232b3d] bg-[#121622] px-2 py-0.5 text-xs font-mono font-bold text-white outline-none"
                        >
                          <option value={30}>30s</option>
                          <option value={45}>45s</option>
                          <option value={60}>60s</option>
                          <option value={90}>90s</option>
                          <option value={120}>120s</option>
                        </select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 2: ROUTINES & SPLITS PLANNER */}
      {/* ========================================================================= */}
      {subTab === 'planner' && (
        <div className="space-y-6">
          {/* Preset Splits Picker */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-[#222738] bg-[#0c0f16] p-5 shadow-md">
            <div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-[#ccff00]" />
                <h3 className="font-black text-sm text-white">Weekly Training Splits & Routines</h3>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Select your preferred training frequency and structure your weekday muscle targets.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {PRESET_SPLITS.map((split) => (
                <button
                  key={split.id}
                  onClick={() => setActiveSplitId(split.id)}
                  className={cn(
                    'rounded-xl px-3.5 py-2 text-xs font-bold transition-all cursor-pointer',
                    activeSplitId === split.id
                      ? 'bg-[#ccff00] text-black shadow-md shadow-[#ccff00]/20 font-black'
                      : 'border border-[#242c3e] bg-[#121622] text-zinc-300 hover:text-white hover:border-zinc-500'
                  )}
                >
                  {split.name}
                </button>
              ))}
            </div>
          </div>

          {/* Current Split Schedule Days */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {currentRoutinePreset.schedule.map((item, idx) => (
              <Card key={item.dayIndex + idx} className="border-[#222738] bg-[#0c0f16] flex flex-col justify-between">
                <div>
                  <div className="border-b border-[#1c2230] bg-[#0e121b] p-4 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#ccff00]">
                        {item.dayName}
                      </span>
                      <h4 className="font-black text-sm text-white mt-0.5">{item.routineTitle}</h4>
                    </div>
                    <Badge variant="outline" className="border-[#273044] text-[10px] text-zinc-400">
                      {item.exerciseIds.length} Lifts
                    </Badge>
                  </div>

                  <div className="p-4 space-y-2.5">
                    {item.exerciseIds.map((exId) => {
                      const ex = allExercises.find((e) => e.id === exId) || CURATED_EXERCISES.find((e) => e.id === exId);
                      return (
                        <div
                          key={exId}
                          onClick={() => {
                            if (ex) setInspectExercise(ex);
                          }}
                          className="flex items-center justify-between rounded-xl border border-[#1b212f] bg-[#0f131d] p-2.5 hover:border-[#ccff00]/40 transition-colors cursor-pointer group"
                        >
                          <div className="flex items-center gap-2.5">
                            <img
                              src={`/opengym/exercise-media/still/${exId}.webp`}
                              alt={ex?.n || 'Exercise'}
                              className="h-9 w-9 rounded-lg object-cover border border-[#232b3d] bg-black"
                              onError={(e) => {
                                (e.currentTarget as HTMLImageElement).src = '/logo.png';
                              }}
                            />
                            <div>
                              <p className="text-xs font-bold text-zinc-200 group-hover:text-white capitalize">
                                {ex?.n || `Exercise #${exId}`}
                              </p>
                              <p className="text-[10px] text-zinc-400 capitalize">
                                {ex?.tg || 'Target muscle'} • {ex?.eq || 'Equipment'}
                              </p>
                            </div>
                          </div>
                          <ChevronRight className="h-4 w-4 text-zinc-600 group-hover:text-[#ccff00]" />
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="p-4 border-t border-[#1c2230] bg-[#0a0d14]">
                  <button
                    onClick={() => {
                      setActiveRoutineTitle(item.routineTitle);
                      // Load exercises for this day
                      const mappedExercises: SessionExercise[] = item.exerciseIds.map((id) => {
                        const ex = allExercises.find((e) => e.id === id) || CURATED_EXERCISES.find((e) => e.id === id);
                        return {
                          exerciseId: id,
                          exerciseName: ex ? ex.n.replace(/\b\w/g, (l) => l.toUpperCase()) : `Exercise #${id}`,
                          targetMuscle: ex ? ex.tg.toUpperCase() : 'TARGET',
                          equipment: ex ? ex.eq.toUpperCase() : 'EQUIPMENT',
                          restSeconds: 90,
                          sets: [
                            { id: `s-${Date.now()}-${id}-1`, setNumber: 1, weightKg: 40, reps: 10, completed: false },
                            { id: `s-${Date.now()}-${id}-2`, setNumber: 2, weightKg: 50, reps: 8, completed: false },
                            { id: `s-${Date.now()}-${id}-3`, setNumber: 3, weightKg: 50, reps: 8, completed: false }
                          ]
                        };
                      });
                      setSessionExercises(mappedExercises);
                      setSubTab('session');
                    }}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#131826] border border-[#28334a] py-2 text-xs font-bold text-zinc-200 hover:bg-[#ccff00] hover:text-black hover:border-[#ccff00] transition-all cursor-pointer"
                  >
                    <Play className="h-3.5 w-3.5" />
                    <span>Start This Workout Now</span>
                  </button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 3: 5,600+ EXERCISE LIBRARY & MOTION DEMOS */}
      {/* ========================================================================= */}
      {subTab === 'library' && (
        <div className="space-y-6">
          {/* Search & Filter Header */}
          <div className="rounded-2xl border border-[#222738] bg-[#0c0f16] p-5 shadow-md space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-black text-sm text-white">Comprehensive Exercise Catalogue</h3>
                  <Badge variant="outline" className="border-[#ccff00]/40 text-[#ccff00] bg-[#ccff00]/10 text-[10px] py-0">
                    5,600+ Exercises
                  </Badge>
                  {isLoadingExercises && (
                    <span className="text-[10px] text-zinc-400 animate-pulse">Syncing catalog...</span>
                  )}
                </div>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Search any exercise to view animated HD motion loops, target muscles & execution cues.
                </p>
              </div>

              {/* Search Bar */}
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Search bench, squat, bicep..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-[#273044] bg-[#121622] py-2 pl-10 pr-4 text-xs font-medium text-white placeholder-zinc-500 outline-none focus:border-[#ccff00] transition-colors"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Muscle Group Chips */}
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Muscle Target:</span>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {[
                  { id: 'all', label: 'All Muscles' },
                  { id: 'chest', label: 'Chest' },
                  { id: 'back', label: 'Back & Lats' },
                  { id: 'upper legs', label: 'Quads & Legs' },
                  { id: 'shoulders', label: 'Shoulders' },
                  { id: 'upper arms', label: 'Arms (Biceps & Triceps)' },
                  { id: 'waist', label: 'Abs & Core' },
                  { id: 'lower legs', label: 'Calves' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedMuscleFilter(item.id)}
                    className={cn(
                      'rounded-lg px-2.5 py-1 text-xs font-bold transition-all cursor-pointer',
                      selectedMuscleFilter === item.id
                        ? 'bg-[#ccff00] text-black font-black shadow-xs'
                        : 'border border-[#222a3b] bg-[#10141f] text-zinc-400 hover:text-white'
                    )}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Equipment Filter Chips */}
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Equipment:</span>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {[
                  { id: 'all', label: 'All Equipment' },
                  { id: 'barbell', label: 'Barbell' },
                  { id: 'dumbbell', label: 'Dumbbell' },
                  { id: 'cable', label: 'Cable Station' },
                  { id: 'body weight', label: 'Bodyweight' },
                  { id: 'leverage machine', label: 'Leverage Machine' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedEquipFilter(item.id)}
                    className={cn(
                      'rounded-lg px-2.5 py-1 text-xs font-bold transition-all cursor-pointer',
                      selectedEquipFilter === item.id
                        ? 'bg-[#ccff00] text-black font-black shadow-xs'
                        : 'border border-[#222a3b] bg-[#10141f] text-zinc-400 hover:text-white'
                    )}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Exercise Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredExercises.map((ex) => (
              <Card
                key={ex.id}
                className="group border-[#222738] bg-[#0c0f16] overflow-hidden hover:border-[#ccff00]/60 transition-all shadow-md flex flex-col justify-between"
              >
                <div>
                  {/* Media Preview Container */}
                  <div
                    onClick={() => setInspectExercise(ex)}
                    className="relative aspect-square w-full bg-black overflow-hidden cursor-pointer"
                  >
                    <img
                      src={`/opengym/exercise-media/still/${ex.id}.webp`}
                      alt={ex.n}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = '/logo.png';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
                      <div className="flex items-center gap-1.5">
                        <Badge variant="outline" className="border-black/60 bg-black/60 backdrop-blur-md text-white text-[10px] capitalize py-0.5">
                          {ex.tg}
                        </Badge>
                        <Badge variant="outline" className="border-black/60 bg-black/60 backdrop-blur-md text-[#ccff00] text-[10px] capitalize py-0.5">
                          {ex.eq}
                        </Badge>
                      </div>
                    </div>
                    <div className="absolute top-2 right-2 rounded-full bg-black/60 p-1.5 text-white/80 group-hover:text-[#ccff00] group-hover:bg-black transition-colors">
                      <Play className="h-3.5 w-3.5 fill-current" />
                    </div>
                  </div>

                  {/* Title & Metadata */}
                  <div className="p-3.5">
                    <h4 className="font-bold text-sm text-white capitalize line-clamp-1 group-hover:text-[#ccff00] transition-colors">
                      {ex.n}
                    </h4>
                    <p className="text-[11px] text-zinc-400 capitalize mt-0.5">
                      {ex.bp} • {ex.tg}
                    </p>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="p-3.5 pt-0 flex items-center gap-2">
                  <button
                    onClick={() => setInspectExercise(ex)}
                    className="flex-1 rounded-xl border border-[#242c3e] bg-[#121622] py-2 text-xs font-bold text-zinc-300 hover:text-white hover:border-zinc-400 transition-colors cursor-pointer text-center"
                  >
                    Form Guide
                  </button>

                  <button
                    onClick={() => handleAddExerciseToSession(ex)}
                    className="rounded-xl bg-[#ccff00]/15 border border-[#ccff00]/30 p-2 text-[#ccff00] hover:bg-[#ccff00] hover:text-black transition-all cursor-pointer"
                    title="Add to today's workout"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 4: PROGRESS & ATHLETE ANALYTICS */}
      {/* ========================================================================= */}
      {subTab === 'analytics' && (
        <div className="space-y-6">
          {/* Recovery Heat Map & Readiness */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Card className="border-[#222738] bg-[#0c0f16] p-5 shadow-md">
              <div className="flex items-center justify-between border-b border-[#1d2332] pb-3">
                <div className="flex items-center gap-2">
                  <Flame className="h-4 w-4 text-[#ccff00]" />
                  <h3 className="font-black text-sm text-white">Muscle Group Readiness</h3>
                </div>
                <Badge variant="outline" className="border-emerald-500/40 text-emerald-400 text-[10px]">
                  Prime for Growth
                </Badge>
              </div>

              <div className="mt-4 space-y-3">
                {[
                  { muscle: 'Chest / Pectorals', recovery: 100, status: 'Ready for Heavy Load' },
                  { muscle: 'Back & Lats', recovery: 85, status: 'Active Recovery' },
                  { muscle: 'Quads & Hamstrings', recovery: 95, status: 'Fully Recovered' },
                  { muscle: 'Shoulders & Deltoids', recovery: 100, status: 'Ready for Heavy Load' },
                  { muscle: 'Arms (Biceps & Triceps)', recovery: 90, status: 'Ready' },
                  { muscle: 'Core & Waist', recovery: 100, status: 'Ready' }
                ].map((item) => (
                  <div key={item.muscle}>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-zinc-200">{item.muscle}</span>
                      <span className="font-mono text-[#ccff00]">{item.recovery}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-[#141926] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-[#ccff00]"
                        style={{ width: `${item.recovery}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Weekly Sets Volume Target */}
            <Card className="border-[#222738] bg-[#0c0f16] p-5 shadow-md">
              <div className="flex items-center justify-between border-b border-[#1d2332] pb-3">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-[#ccff00]" />
                  <h3 className="font-black text-sm text-white">Weekly Hypertrophy Volume (Sets)</h3>
                </div>
                <span className="text-xs text-zinc-400 font-mono">Target: 12-16 sets/wk</span>
              </div>

              <div className="mt-4 space-y-3">
                {[
                  { group: 'Chest', completed: 14, target: 16 },
                  { group: 'Back', completed: 12, target: 16 },
                  { group: 'Quads / Legs', completed: 10, target: 14 },
                  { group: 'Shoulders', completed: 12, target: 12 },
                  { group: 'Triceps & Biceps', completed: 10, target: 12 }
                ].map((vol) => {
                  const pct = Math.min(100, Math.round((vol.completed / vol.target) * 100));
                  return (
                    <div key={vol.group}>
                      <div className="flex justify-between text-xs font-bold mb-1">
                        <span className="text-zinc-200">{vol.group}</span>
                        <span className="font-mono text-zinc-400">
                          <strong className="text-white">{vol.completed}</strong> / {vol.target} sets
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-[#141926] overflow-hidden">
                        <div
                          className="h-full rounded-full bg-[#ccff00]"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* Personal Records (PRs) & 1RM Estimator */}
          <Card className="border-[#222738] bg-[#0c0f16] p-5 shadow-md">
            <div className="flex items-center gap-2 border-b border-[#1d2332] pb-3">
              <Trophy className="h-4 w-4 text-[#ccff00]" />
              <h3 className="font-black text-sm text-white">Compound Lift Personal Records (PRs)</h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
              {[
                { lift: 'Barbell Bench Press', pr: '85 kg', date: '14 Oct', formula1RM: '98 kg' },
                { lift: 'Barbell Squat', pr: '110 kg', date: '08 Oct', formula1RM: '126 kg' },
                { lift: 'Romanian Deadlift', pr: '120 kg', date: '11 Oct', formula1RM: '138 kg' },
                { lift: 'Overhead Press', pr: '55 kg', date: '15 Oct', formula1RM: '63 kg' }
              ].map((record) => (
                <div key={record.lift} className="rounded-xl border border-[#212738] bg-[#0f131e] p-3.5">
                  <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">{record.lift}</span>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="font-mono text-xl font-black text-white">{record.pr}</span>
                    <span className="text-[10px] text-zinc-500 font-mono">1RM ~{record.formula1RM}</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-bold block mt-1">Set on {record.date}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Bodyweight & Weigh-in Logger */}
          <Card className="border-[#222738] bg-[#0c0f16] p-5 shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1d2332] pb-3">
              <div className="flex items-center gap-2">
                <Scale className="h-4 w-4 text-[#ccff00]" />
                <h3 className="font-black text-sm text-white">Bodyweight & Weigh-in Tracker</h3>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span>Current: <strong className="text-white font-mono">{currentWeight} kg</strong></span>
                <span>•</span>
                <span>Goal: <strong className="text-emerald-400 font-mono">{targetWeight} kg</strong></span>
              </div>
            </div>

            <div className="mt-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <input
                  type="number"
                  step="0.1"
                  placeholder="e.g. 74.2"
                  value={newWeightInput}
                  onChange={(e) => setNewWeightInput(e.target.value)}
                  className="rounded-xl border border-[#262f42] bg-[#121622] px-3.5 py-2 text-xs font-mono font-bold text-white placeholder-zinc-500 outline-none focus:border-[#ccff00]"
                />
                <button
                  onClick={() => {
                    const val = parseFloat(newWeightInput);
                    if (val > 30 && val < 250) {
                      setCurrentWeight(val);
                      setWeightLogs((prev) => [...prev, { date: 'Today', weight: val }]);
                      setNewWeightInput('');
                    }
                  }}
                  className="rounded-xl bg-[#ccff00] px-4 py-2 text-xs font-bold text-black hover:bg-[#d8ff33] transition-colors cursor-pointer"
                >
                  Log Weigh-in
                </button>
              </div>

              {/* Recent Weights Strip */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {weightLogs.map((log, idx) => (
                  <div key={idx} className="rounded-lg border border-[#1f2638] bg-[#101420] px-3 py-1.5 text-center shrink-0">
                    <span className="text-[10px] text-zinc-400 block">{log.date}</span>
                    <span className="font-mono text-xs font-black text-white">{log.weight} kg</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: EXERCISE FORM GUIDE & MOTION DEMO (openGym Player) */}
      {/* ========================================================================= */}
      {inspectExercise && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-2xl rounded-2xl border border-[#262d40] bg-[#0c0f16] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#1f2536] bg-[#0e121b] p-4">
              <div>
                <h3 className="font-black text-base text-white capitalize">{inspectExercise.n}</h3>
                <p className="text-xs text-zinc-400 capitalize">
                  {inspectExercise.bp} • Target: <span className="text-[#ccff00] font-bold">{inspectExercise.tg}</span>
                </p>
              </div>
              <button
                onClick={() => setInspectExercise(null)}
                className="rounded-xl border border-[#242c3e] bg-[#141926] p-2 text-zinc-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto space-y-4">
              {/* Animated Motion Video Clip */}
              <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-[#242c3e] bg-black">
                <video
                  src={`/opengym/exercise-media/clip/${inspectExercise.id}.mp4`}
                  poster={`/opengym/exercise-media/still/${inspectExercise.id}.webp`}
                  autoPlay
                  loop
                  muted
                  playsInline
                  controls
                  className="h-full w-full object-contain"
                />
              </div>

              {/* Muscle & Equipment Badges */}
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="border-[#ccff00]/40 text-[#ccff00] bg-[#ccff00]/10 font-bold capitalize">
                  Primary: {inspectExercise.tg}
                </Badge>
                <Badge variant="outline" className="border-[#273044] text-zinc-300 capitalize">
                  Equipment: {inspectExercise.eq}
                </Badge>
                {inspectExercise.sm && inspectExercise.sm.length > 0 && (
                  <Badge variant="outline" className="border-[#273044] text-zinc-400 capitalize">
                    Synergists: {inspectExercise.sm.join(', ')}
                  </Badge>
                )}
              </div>

              {/* Execution Instructions */}
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-zinc-300 mb-2">Step-by-step instructions</h4>
                {instructionsMap[inspectExercise.id] && instructionsMap[inspectExercise.id].length > 0 ? (
                  <ol className="space-y-2 text-xs text-zinc-300">
                    {instructionsMap[inspectExercise.id].map((step, sIdx) => (
                      <li key={sIdx} className="flex gap-2">
                        <span className="font-mono font-bold text-[#ccff00] shrink-0">{sIdx + 1}.</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                ) : (
                  <div className="rounded-xl border border-[#1f2638] bg-[#101420] p-3 text-xs text-zinc-400">
                    <p className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-[#ccff00]" />
                      <span>Maintain continuous muscle tension throughout the full range of motion. Control the eccentric tempo for 2-3 seconds.</span>
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-[#1f2536] bg-[#090c12] p-4 flex items-center justify-between">
              <button
                onClick={() => setInspectExercise(null)}
                className="rounded-xl border border-[#242c3e] bg-[#121622] px-4 py-2 text-xs font-bold text-zinc-300 hover:text-white"
              >
                Close
              </button>

              <button
                onClick={() => {
                  handleAddExerciseToSession(inspectExercise);
                  setInspectExercise(null);
                }}
                className="flex items-center gap-2 rounded-xl bg-[#ccff00] px-4 py-2 text-xs font-black text-black hover:bg-[#d8ff33]"
              >
                <Plus className="h-4 w-4" />
                <span>Add to Active Workout</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: OLYMPIC BARBELL PLATE CALCULATOR */}
      {/* ========================================================================= */}
      {showPlateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-md rounded-2xl border border-[#262d40] bg-[#0c0f16] shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[#1f2536] pb-3">
              <div className="flex items-center gap-2">
                <Calculator className="h-4 w-4 text-[#ccff00]" />
                <h3 className="font-black text-sm text-white">Olympic Barbell Plate Calculator</h3>
              </div>
              <button onClick={() => setShowPlateModal(false)} className="text-zinc-500 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div>
              <label className="text-xs text-zinc-400 font-bold block mb-1">Target Total Weight (kg):</label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPlateCalcWeight((prev) => Math.max(20, prev - 5))}
                  className="rounded-xl border border-[#232b3d] bg-[#121622] px-3 py-2 text-sm font-bold text-zinc-300 hover:text-white"
                >
                  -5
                </button>
                <input
                  type="number"
                  step="2.5"
                  value={plateCalcWeight}
                  onChange={(e) => setPlateCalcWeight(parseFloat(e.target.value) || 20)}
                  className="w-full rounded-xl border border-[#262e40] bg-[#121622] py-2 text-center font-mono text-xl font-black text-[#ccff00] outline-none"
                />
                <button
                  onClick={() => setPlateCalcWeight((prev) => prev + 5)}
                  className="rounded-xl border border-[#232b3d] bg-[#121622] px-3 py-2 text-sm font-bold text-zinc-300 hover:text-white"
                >
                  +5
                </button>
              </div>
            </div>

            {/* Plate Breakdown Card */}
            <div className="rounded-xl border border-[#202738] bg-[#0e121c] p-4 space-y-3">
              <div className="flex justify-between text-xs text-zinc-400">
                <span>Standard Barbell:</span>
                <strong className="text-white font-mono">{plateBreakdown.barWeight} kg</strong>
              </div>
              <div className="flex justify-between text-xs text-zinc-400">
                <span>Per Side Weight Needed:</span>
                <strong className="text-[#ccff00] font-mono text-sm">{plateBreakdown.perSide} kg</strong>
              </div>

              <div className="border-t border-[#1b212f] pt-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block mb-2">
                  Plates to load per side:
                </span>
                {plateBreakdown.platesUsed.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {plateBreakdown.platesUsed.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-1.5 rounded-lg border border-[#2e3950] bg-[#151b2a] px-3 py-1.5"
                      >
                        <span className="font-mono font-black text-white text-xs">{item.plate} kg</span>
                        <span className="text-xs text-zinc-400">×</span>
                        <span className="font-mono font-black text-[#ccff00] text-xs">{item.count}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-zinc-500">Empty barbell only (20 kg).</p>
                )}
              </div>
            </div>

            <button
              onClick={() => setShowPlateModal(false)}
              className="w-full rounded-xl bg-[#ccff00] py-2 text-xs font-black text-black hover:bg-[#d8ff33]"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: WORKOUT COMPLETE SUMMARY */}
      {/* ========================================================================= */}
      {showFinishModal && workoutFinishedStats && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-md rounded-2xl border border-[#2a344a] bg-[#0c0f16] shadow-2xl p-6 text-center space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#ccff00] text-black shadow-lg shadow-[#ccff00]/30">
              <Trophy className="h-7 w-7" />
            </div>

            <div>
              <h3 className="font-black text-xl text-white">Workout Session Complete!</h3>
              <p className="text-xs text-zinc-400 mt-1">
                Outstanding effort! All your sets, weights and volume have been saved to your athlete profile.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 rounded-xl border border-[#202738] bg-[#0e121b] p-3 text-center">
              <div>
                <span className="text-[10px] text-zinc-400 font-bold uppercase">Volume</span>
                <p className="font-mono text-base font-black text-[#ccff00]">{workoutFinishedStats.volumeKg.toLocaleString()} kg</p>
              </div>
              <div>
                <span className="text-[10px] text-zinc-400 font-bold uppercase">Sets Done</span>
                <p className="font-mono text-base font-black text-white">{workoutFinishedStats.setsCount}</p>
              </div>
              <div>
                <span className="text-[10px] text-zinc-400 font-bold uppercase">Duration</span>
                <p className="font-mono text-base font-black text-emerald-400">{workoutFinishedStats.durationMin}m</p>
              </div>
            </div>

            <button
              onClick={() => {
                setShowFinishModal(false);
                setSubTab('analytics');
              }}
              className="w-full rounded-xl bg-[#ccff00] py-2.5 text-xs font-black text-black hover:bg-[#d8ff33] shadow-md shadow-[#ccff00]/20"
            >
              View Updated Recovery & Volume
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
