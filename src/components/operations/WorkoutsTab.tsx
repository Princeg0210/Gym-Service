'use client';

import React, { useState, useEffect } from 'react';
import {
  Member,
  WorkoutRoutine,
  Exercise,
  WorkoutSet
} from '@/types';
import {
  Dumbbell,
  Timer,
  Sparkles,
  ArrowRightLeft,
  CheckCircle2,
  Plus,
  Minus,
  RefreshCw,
  Flame,
  Award
} from 'lucide-react';
import { sounds } from '@/lib/audio';

interface WorkoutsTabProps {
  members: Member[];
  routines: WorkoutRoutine[];
  exercises: Exercise[];
  onUpdateRoutines?: (routines: WorkoutRoutine[]) => void;
}

export function WorkoutsTab({
  members,
  routines,
  exercises,
  onUpdateRoutines
}: WorkoutsTabProps) {
  const [selectedMemberId, setSelectedMemberId] = useState<string>(members[0]?.id || 'mem-101');
  const [selectedRoutineIndex, setSelectedRoutineIndex] = useState<number>(0);
  const [activeRoutines, setActiveRoutines] = useState<WorkoutRoutine[]>(routines);
  const [selectedExerciseIndex, setSelectedExerciseIndex] = useState<number>(0);

  // Rest Timer State
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  // AI Routine Generator State
  const [isGenModalOpen, setIsGenModalOpen] = useState(false);
  const [genGoal, setGenGoal] = useState<'muscle_gain' | 'fat_loss' | 'general_fitness'>('muscle_gain');
  const [genLevel, setGenLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate');

  const currentMember = members.find((m) => m.id === selectedMemberId) || members[0];
  const currentRoutine = activeRoutines[selectedRoutineIndex] || activeRoutines[0];
  const currentExerciseItem = currentRoutine?.exercises[selectedExerciseIndex] || currentRoutine?.exercises[0];

  useEffect(() => {
    setActiveRoutines(routines);
  }, [routines]);

  // Timer countdown
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

  // Steppers
  const handleUpdateSetWeight = (setIndex: number, delta: number) => {
    const updated = [...activeRoutines];
    const targetSet = updated[selectedRoutineIndex].exercises[selectedExerciseIndex].sets[setIndex];
    targetSet.weightKg = Math.max(0, targetSet.weightKg + delta);
    setActiveRoutines(updated);
    if (onUpdateRoutines) onUpdateRoutines(updated);
  };

  const handleUpdateSetReps = (setIndex: number, delta: number) => {
    const updated = [...activeRoutines];
    const targetSet = updated[selectedRoutineIndex].exercises[selectedExerciseIndex].sets[setIndex];
    const currentReps = targetSet.completedReps ?? targetSet.targetReps;
    targetSet.completedReps = Math.max(1, currentReps + delta);
    setActiveRoutines(updated);
    if (onUpdateRoutines) onUpdateRoutines(updated);
  };

  const handleToggleSetComplete = (setIndex: number, restSeconds: number) => {
    const updated = [...activeRoutines];
    const targetSet = updated[selectedRoutineIndex].exercises[selectedExerciseIndex].sets[setIndex];
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
    if (onUpdateRoutines) onUpdateRoutines(updated);
  };

  // Busy Machine Swap
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
    if (onUpdateRoutines) onUpdateRoutines(updated);
    sounds.playSuccess();
  };

  // Generate Routine
  const handleGeneratePlan = (e: React.FormEvent) => {
    e.preventDefault();
    let selectedExList: Exercise[] = [];

    if (genGoal === 'fat_loss') {
      selectedExList = [
        exercises.find((e) => e.id === 'ex-9') || exercises[0],
        exercises.find((e) => e.id === 'ex-2') || exercises[1],
        exercises.find((e) => e.id === 'ex-5') || exercises[4],
        exercises.find((e) => e.id === 'ex-11') || exercises[10]
      ];
    } else {
      selectedExList = [
        exercises.find((e) => e.id === 'ex-1') || exercises[0],
        exercises.find((e) => e.id === 'ex-3') || exercises[2],
        exercises.find((e) => e.id === 'ex-14') || exercises[13],
        exercises.find((e) => e.id === 'ex-18') || exercises[17]
      ];
    }

    const newRoutine: WorkoutRoutine = {
      id: `custom-routine-${Date.now()}`,
      title: `${genGoal === 'fat_loss' ? 'Fat Loss & Conditioning' : 'Strength & Hypertrophy'} (${genLevel.toUpperCase()})`,
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
    if (onUpdateRoutines) onUpdateRoutines(updated);
    setSelectedRoutineIndex(0);
    setIsGenModalOpen(false);
    sounds.playSuccess();
  };

  return (
    <div className="space-y-6">
      {/* ── TOP ATHLETE & ROUTINE STRIP ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-2xl border border-[#1e2638] bg-[#0c1017] p-4 shadow-md">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ccff00] text-black shadow-md">
            <Dumbbell className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Athlete:
              </span>
              <select
                value={selectedMemberId}
                onChange={(e) => setSelectedMemberId(e.target.value)}
                className="rounded-xl border border-[#262c3e] bg-[#121622] px-3 py-1.5 text-xs font-bold text-white outline-none focus:border-[#ccff00] transition-colors"
              >
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.fullName} (+91 {m.phone}) — {m.status.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
            <p className="mt-1 text-xs text-zinc-400">
              Goal: <strong className="text-white capitalize">{currentMember?.fitnessGoal?.replace('_', ' ')}</strong> • Plan: <strong className="text-[#ccff00]">{currentMember?.planName}</strong>
            </p>
          </div>
        </div>

        {/* Routine Split Selector & Generator CTA */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center rounded-xl border border-[#202738] bg-[#101522] p-1">
            {activeRoutines.map((r, idx) => (
              <button
                key={r.id}
                onClick={() => {
                  setSelectedRoutineIndex(idx);
                  setSelectedExerciseIndex(0);
                }}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                  selectedRoutineIndex === idx
                    ? 'bg-[#ccff00] text-black shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {r.title.split(' ')[0]}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsGenModalOpen(true)}
            className="flex items-center gap-1.5 rounded-xl border border-[#ccff00]/40 bg-[#ccff00]/10 px-3 py-1.5 text-xs font-bold text-[#ccff00] hover:bg-[#ccff00] hover:text-black transition-colors"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Generate Plan</span>
          </button>
        </div>
      </div>

      {/* ── SIDE-BY-SIDE GRID ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ════════════════════════════════════════════════════════
            LEFT COLUMN (col-span-7): Exercise Library & Machine Swaps
        ════════════════════════════════════════════════════════ */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">
              {currentRoutine?.title} ({currentRoutine?.exercises.length} Exercises)
            </h3>
            <span className="text-xs text-zinc-400">
              Click an exercise to log sets
            </span>
          </div>

          <div className="space-y-3">
            {currentRoutine?.exercises.map((item, exIdx) => {
              const isSelected = selectedExerciseIndex === exIdx;
              const completedSetsCount = item.sets.filter((s) => s.completed).length;
              const allDone = completedSetsCount === item.sets.length;

              return (
                <div
                  key={`${item.exerciseId}-${exIdx}`}
                  onClick={() => setSelectedExerciseIndex(exIdx)}
                  className={`rounded-2xl border p-4 transition-all cursor-pointer ${
                    isSelected
                      ? 'border-[#ccff00] bg-[#121926] shadow-lg'
                      : 'border-[#1e2638] bg-[#0c1017] hover:border-zinc-600'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl font-mono text-xs font-black ${
                          allDone
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : isSelected
                            ? 'bg-[#ccff00] text-black'
                            : 'bg-[#182030] text-zinc-300'
                        }`}
                      >
                        {allDone ? '✓' : exIdx + 1}
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-white leading-tight">
                          {item.exercise.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="rounded bg-[#1a2233] px-2 py-0.5 text-xs font-bold uppercase text-zinc-300">
                            {item.exercise.targetMuscle}
                          </span>
                          <span className="rounded bg-[#1a2233] px-2 py-0.5 text-xs font-bold uppercase text-zinc-400">
                            {item.exercise.equipmentTier.replace('_', ' ').toUpperCase()}
                          </span>
                          <span className="text-xs text-zinc-400 font-mono">
                            {completedSetsCount}/{item.sets.length} Sets
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Peak Hour Machine Alternative Swap Button */}
                    {item.exercise.alternativeExerciseId && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSwapExercise(exIdx);
                        }}
                        title="Station occupied? Click to swap with free-weight alternative"
                        className="flex items-center gap-1 rounded-lg border border-amber-500/30 bg-amber-950/20 px-2 py-1 text-xs font-bold text-amber-400 hover:bg-amber-950/40 transition-colors"
                      >
                        <ArrowRightLeft className="h-3 w-3" />
                        <span>Swap Machine</span>
                      </button>
                    )}
                  </div>

                  {/* Form Cues Preview */}
                  {isSelected && item.exercise.cues?.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-[#1e2638] text-xs text-zinc-400 space-y-1">
                      <p className="font-bold text-zinc-300">Form Execution Cue:</p>
                      <p className="italic text-zinc-400">
                        • {item.exercise.cues[0]}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════
            RIGHT COLUMN (col-span-5): Interactive Set Logger & Rest Timer
        ════════════════════════════════════════════════════════ */}
        <div className="lg:col-span-5 space-y-5">
          {/* Rest Interval Timer Widget */}
          <div className="rounded-2xl border border-[#1e2638] bg-[#0c1017] p-5 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Timer className="h-4 w-4 text-[#ccff00]" />
                <h3 className="text-xs font-bold text-white">Rest Interval Timer</h3>
              </div>
              <span className="text-xs font-mono text-zinc-400">
                {isTimerRunning ? 'Running' : 'Ready'}
              </span>
            </div>

            {/* Glowing Big Timer Display */}
            <div className="flex flex-col items-center justify-center py-3">
              <div className="font-mono text-4xl font-black tracking-wider text-[#ccff00]">
                {String(Math.floor(timerSeconds / 60)).padStart(2, '0')}:
                {String(timerSeconds % 60).padStart(2, '0')}
              </div>
              <p className="mt-1 text-xs text-zinc-400">
                Audio chime sounds on zero
              </p>
            </div>

            {/* Timer Presets */}
            <div className="grid grid-cols-4 gap-2 pt-2">
              <button
                onClick={() => startRestTimer(30)}
                className="rounded-xl border border-[#202738] bg-[#101522] py-1.5 text-xs font-bold text-zinc-300 hover:border-[#ccff00] hover:text-white transition-colors"
              >
                30s
              </button>
              <button
                onClick={() => startRestTimer(60)}
                className="rounded-xl border border-[#202738] bg-[#101522] py-1.5 text-xs font-bold text-zinc-300 hover:border-[#ccff00] hover:text-white transition-colors"
              >
                60s
              </button>
              <button
                onClick={() => startRestTimer(90)}
                className="rounded-xl border border-[#202738] bg-[#101522] py-1.5 text-xs font-bold text-zinc-300 hover:border-[#ccff00] hover:text-white transition-colors"
              >
                90s
              </button>
              <button
                onClick={() => {
                  setIsTimerRunning(false);
                  setTimerSeconds(0);
                }}
                className="rounded-xl border border-red-500/30 bg-red-950/20 py-1.5 text-xs font-bold text-red-400 hover:bg-red-950/40 transition-colors"
              >
                Stop
              </button>
            </div>
          </div>

          {/* Interactive Set Logger for Current Exercise */}
          <div className="rounded-2xl border border-[#1e2638] bg-[#0c1017] p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-[#1b2333] pb-3">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#ccff00]">
                  Active Logger
                </span>
                <h4 className="text-xs font-bold text-white">
                  {currentExerciseItem?.exercise.name}
                </h4>
              </div>
              <span className="text-xs font-mono text-zinc-400">
                Rest: {currentExerciseItem?.restSeconds}s
              </span>
            </div>

            {/* Set by Set Table */}
            <div className="space-y-3">
              {currentExerciseItem?.sets.map((set, sIdx) => {
                const reps = set.completedReps ?? set.targetReps;
                return (
                  <div
                    key={sIdx}
                    className={`flex items-center justify-between rounded-xl border p-2.5 transition-colors ${
                      set.completed
                        ? 'border-emerald-500/40 bg-emerald-950/20'
                        : 'border-[#1b2333] bg-[#0f1422]'
                    }`}
                  >
                    {/* Set Number */}
                    <span className="font-mono text-xs font-black text-zinc-400 w-6">
                      S{set.setNumber}
                    </span>

                    {/* Weight Controls */}
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleUpdateSetWeight(sIdx, -2.5)}
                        className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#1a2233] text-zinc-300 hover:bg-[#253046] transition-colors"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-12 text-center font-mono text-xs font-bold text-white">
                        {set.weightKg}kg
                      </span>
                      <button
                        onClick={() => handleUpdateSetWeight(sIdx, 2.5)}
                        className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#1a2233] text-zinc-300 hover:bg-[#253046] transition-colors"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>

                    {/* Reps Controls */}
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleUpdateSetReps(sIdx, -1)}
                        className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#1a2233] text-zinc-300 hover:bg-[#253046] transition-colors"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-10 text-center font-mono text-xs font-bold text-white">
                        {reps}r
                      </span>
                      <button
                        onClick={() => handleUpdateSetReps(sIdx, 1)}
                        className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#1a2233] text-zinc-300 hover:bg-[#253046] transition-colors"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>

                    {/* Done Button */}
                    <button
                      onClick={() => handleToggleSetComplete(sIdx, currentExerciseItem.restSeconds)}
                      className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-bold transition-all ${
                        set.completed
                          ? 'bg-emerald-500 text-black shadow-sm'
                          : 'border border-[#2b364e] bg-[#161d2d] text-zinc-200 hover:bg-[#20293d]'
                      }`}
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>{set.completed ? 'Done' : 'Log'}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Routine Generator Modal */}
      {isGenModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
          <div className="relative w-full max-w-md rounded-3xl border border-[#222738] bg-[#0c1017] p-6 shadow-2xl space-y-4">
            <h3 className="text-sm font-bold text-white">Generate Custom Routine</h3>
            <form onSubmit={handleGeneratePlan} className="space-y-4 text-xs">
              <div>
                <label className="text-zinc-400 font-bold">Target Fitness Goal</label>
                <select
                  value={genGoal}
                  onChange={(e) => setGenGoal(e.target.value as 'muscle_gain' | 'fat_loss')}
                  className="mt-1 w-full rounded-xl border border-[#262c3e] bg-[#121622] px-3 py-2 font-bold text-white outline-none"
                >
                  <option value="muscle_gain">Muscle Gain & Hypertrophy</option>
                  <option value="fat_loss">Fat Loss & Metabolic Conditioning</option>
                </select>
              </div>

              <div>
                <label className="text-zinc-400 font-bold">Lifting Experience</label>
                <select
                  value={genLevel}
                  onChange={(e) => setGenLevel(e.target.value as 'beginner' | 'intermediate' | 'advanced')}
                  className="mt-1 w-full rounded-xl border border-[#262c3e] bg-[#121622] px-3 py-2 font-bold text-white outline-none"
                >
                  <option value="beginner">Beginner (1-6 Months)</option>
                  <option value="intermediate">Intermediate (6-24 Months)</option>
                  <option value="advanced">Advanced (2+ Years)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#1f2637]">
                <button
                  type="button"
                  onClick={() => setIsGenModalOpen(false)}
                  className="rounded-xl border border-[#262c3e] px-4 py-2 font-bold text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#ccff00] px-4 py-2 font-black text-black hover:bg-[#b5e600]"
                >
                  Create Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
