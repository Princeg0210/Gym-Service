'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  StaffTrainer,
  Member,
  AttendanceRecord,
  TrainerSession,
  WorkoutRoutine,
  DietPlan,
  Exercise,
  WorkoutExerciseItem
} from '@/types';
import { AppStorage } from '@/lib/storage';
import {
  Users,
  Calendar,
  Clock,
  Phone,
  Search,
  Plus,
  CheckCircle,
  X,
  Dumbbell,
  Award,
  ChevronDown,
  ArrowUpRight,
  ShieldCheck,
  UserCheck,
  FileText,
  Flame,
  Check,
  Utensils,
  Trash2,
  Target,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { sounds } from '@/lib/audio';

interface TrainerPortalProps {
  initialGymSlug?: string;
  gymName?: string;
  primaryColor?: string;
}

export function TrainerPortal({
  initialGymSlug,
  gymName = 'IronPulse Fitness Club',
  primaryColor = '#ccff00'
}: TrainerPortalProps) {
  // ponytail: read persistent state from AppStorage directly
  const [trainers, setTrainers] = useState<StaffTrainer[]>(() => AppStorage.getTrainers());
  const [members, setMembers] = useState<Member[]>(() => AppStorage.getMembers());
  const [attendance] = useState<AttendanceRecord[]>(() => AppStorage.getAttendance());
  const [routines, setRoutines] = useState<WorkoutRoutine[]>(() => AppStorage.getRoutines());
  const [dietPlans, setDietPlans] = useState<DietPlan[]>(() => AppStorage.getDietPlans());
  const [exercises] = useState<Exercise[]>(() => AppStorage.getExercises());
  const [sessions, setSessions] = useState<TrainerSession[]>(() => AppStorage.getTrainerSessions());

  // Active trainer selection
  const [selectedTrainerId, setSelectedTrainerId] = useState<string>(
    trainers[0]?.id || 'tr-1'
  );

  // Active top navigation tab
  const [activeTab, setActiveTab] = useState<'athletes' | 'workouts' | 'diet'>('athletes');

  // Search & filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [goalFilter, setGoalFilter] = useState<string>('all');

  // Modal: Log 1-on-1 Session
  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);
  const [selectedMemberForSession, setSelectedMemberForSession] = useState<Member | null>(null);
  const [sessionType, setSessionType] = useState<TrainerSession['sessionType']>('Strength');
  const [sessionNotes, setSessionNotes] = useState('');

  // Modal: Create Workout Plan
  const [isWorkoutModalOpen, setIsWorkoutModalOpen] = useState(false);
  const [newRoutineTitle, setNewRoutineTitle] = useState('');
  const [newRoutineSplit, setNewRoutineSplit] = useState<WorkoutRoutine['splitType']>('push');
  const [newRoutineGoal, setNewRoutineGoal] = useState<WorkoutRoutine['goal']>('muscle_gain');
  const [newRoutineLevel, setNewRoutineLevel] = useState<WorkoutRoutine['experienceLevel']>('intermediate');
  const [newRoutineAssignMemberId, setNewRoutineAssignMemberId] = useState<string>('unassigned');
  const [selectedExIds, setSelectedExIds] = useState<string[]>(['ex-1', 'ex-3', 'ex-14']);

  // Modal: Create Diet Plan
  const [isDietModalOpen, setIsDietModalOpen] = useState(false);
  const [newDietTitle, setNewDietTitle] = useState('');
  const [newDietPref, setNewDietPref] = useState<DietPlan['preference']>('vegetarian');
  const [newDietCalories, setNewDietCalories] = useState<number>(2300);
  const [newDietProtein, setNewDietProtein] = useState<number>(145);
  const [newDietCarbs, setNewDietCarbs] = useState<number>(220);
  const [newDietFats, setNewDietFats] = useState<number>(65);
  const [newDietAssignMemberId, setNewDietAssignMemberId] = useState<string>('unassigned');
  const [newDietMealsText, setNewDietMealsText] = useState(
    'Breakfast (8:00 AM) - Besan Paneer Chilla (2) + Low-Fat Milk (250ml) [28g Protein, 480 kcal]\n' +
    'Lunch (1:30 PM) - Soya Chunks Curry (50g) + 2 Phulkas + Curd + Salad [42g Protein, 620 kcal]\n' +
    'Evening Snack (5:30 PM) - Roasted Chana (40g) + 1 Banana + Black Coffee [10g Protein, 250 kcal]\n' +
    'Dinner (8:30 PM) - Paneer Bhurji (120g) + 1 Multigrain Roti + Palak Salad [35g Protein, 550 kcal]'
  );
  const [newDietTipsText, setNewDietTipsText] = useState(
    'Stay hydrated with 3.5 to 4 Litres of water daily.\n' +
    'Consume high-protein meals within 45 minutes of training.\n' +
    'Keep salt intake moderate and avoid processed sugars.'
  );

  // Modal: Quick Assign Routine / Diet to athlete
  const [isQuickAssignOpen, setIsQuickAssignOpen] = useState(false);
  const [assignTargetMember, setAssignTargetMember] = useState<Member | null>(null);
  const [assignType, setAssignType] = useState<'workout' | 'diet'>('workout');
  const [selectedAssignId, setSelectedAssignId] = useState<string>('');

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const activeTrainer = useMemo(
    () => trainers.find((t) => t.id === selectedTrainerId) || trainers[0],
    [trainers, selectedTrainerId]
  );

  // Assigned members for the active trainer
  const assignedMembers = useMemo(() => {
    if (!activeTrainer) return [];
    return members.filter((m) =>
      activeTrainer.assignedMemberIds?.includes(m.id) ||
      m.assignedTrainerId === activeTrainer.id
    );
  }, [members, activeTrainer]);

  // Today's attendance filter (check-ins today)
  const todayStr = new Date().toISOString().split('T')[0];
  const checkedInTodayMemberIds = useMemo(() => {
    const set = new Set<string>();
    attendance.forEach((log) => {
      if (log.checkInTime.startsWith(todayStr)) {
        set.add(log.memberId);
      }
    });
    return set;
  }, [attendance, todayStr]);

  // Filtered assigned members
  const filteredMembers = useMemo(() => {
    return assignedMembers.filter((m) => {
      const matchQuery =
        m.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.phone.includes(searchQuery);
      const matchGoal =
        goalFilter === 'all' ||
        m.fitnessGoal.toLowerCase() === goalFilter.toLowerCase();
      return matchQuery && matchGoal;
    });
  }, [assignedMembers, searchQuery, goalFilter]);

  // Filtered sessions logged by this trainer
  const trainerSessions = useMemo(() => {
    return sessions.filter((s) => s.trainerId === activeTrainer?.id);
  }, [sessions, activeTrainer]);

  // Handler to open session logging modal
  const handleOpenLogSession = (member: Member) => {
    setSelectedMemberForSession(member);
    setSessionType('Strength');
    setSessionNotes('');
    setIsSessionModalOpen(true);
  };

  // Handler to submit a session log
  const handleSaveSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTrainer || !selectedMemberForSession) return;

    const newSession: TrainerSession = {
      id: `ts-${Date.now()}`,
      trainerId: activeTrainer.id,
      memberId: selectedMemberForSession.id,
      memberName: selectedMemberForSession.fullName,
      date: new Date().toISOString(),
      sessionType,
      notes: sessionNotes.trim() || 'Completed planned training protocol.'
    };

    const updatedSessions = [newSession, ...sessions];
    setSessions(updatedSessions);
    AppStorage.saveTrainerSessions(updatedSessions);

    sounds.playSuccess();
    showToast(`Logged session for ${selectedMemberForSession.fullName}`);
    setIsSessionModalOpen(false);
  };

  // Handler: Create Custom Workout Plan
  const handleCreateWorkoutPlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoutineTitle.trim()) return;

    const selectedExercises = exercises.filter((ex) => selectedExIds.includes(ex.id));
    const items: WorkoutExerciseItem[] = selectedExercises.map((ex, idx) => ({
      exerciseId: ex.id,
      exercise: ex,
      sets: [
        { setNumber: 1, weightKg: 20, targetReps: 12, completed: false },
        { setNumber: 2, weightKg: 25, targetReps: 10, completed: false },
        { setNumber: 3, weightKg: 30, targetReps: 8, completed: false }
      ],
      restSeconds: newRoutineSplit === 'push' || newRoutineSplit === 'pull' ? 90 : 60
    }));

    const newRoutine: WorkoutRoutine = {
      id: `routine-coach-${Date.now()}`,
      title: newRoutineTitle.trim(),
      splitType: newRoutineSplit,
      goal: newRoutineGoal,
      experienceLevel: newRoutineLevel,
      trainerId: activeTrainer?.id,
      assignedMemberId: newRoutineAssignMemberId !== 'unassigned' ? newRoutineAssignMemberId : undefined,
      exercises: items
    };

    const updatedRoutines = [newRoutine, ...routines];
    setRoutines(updatedRoutines);
    AppStorage.saveRoutines(updatedRoutines);

    // If assigned to a member, update member's assignedRoutineId
    if (newRoutineAssignMemberId !== 'unassigned') {
      const updatedMembers = members.map((m) =>
        m.id === newRoutineAssignMemberId ? { ...m, assignedRoutineId: newRoutine.id } : m
      );
      setMembers(updatedMembers);
      AppStorage.saveMembers(updatedMembers);
    }

    sounds.playSuccess();
    showToast(`Created workout protocol: "${newRoutine.title}"`);
    setNewRoutineTitle('');
    setIsWorkoutModalOpen(false);
  };

  // Handler: Create Custom Diet Plan
  const handleCreateDietPlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDietTitle.trim()) return;

    // Parse meals from text lines
    const parsedMeals = newDietMealsText
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line, idx) => {
        const parts = line.split('-');
        const name = parts[0]?.trim() || `Meal ${idx + 1}`;
        const desc = parts[1]?.trim() || line;
        return {
          mealName: name,
          timeOfDay: idx === 0 ? 'Morning' : idx === 1 ? 'Afternoon' : idx === 2 ? 'Evening' : 'Night',
          items: [desc],
          approxProteinGrams: Math.round(newDietProtein / 4),
          approxCalories: Math.round(newDietCalories / 4)
        };
      });

    const parsedTips = newDietTipsText
      .split('\n')
      .map((t) => t.trim())
      .filter(Boolean);

    const newPlan: DietPlan = {
      id: `diet-coach-${Date.now()}`,
      title: newDietTitle.trim(),
      preference: newDietPref,
      dailyCalories: Number(newDietCalories) || 2200,
      proteinGrams: Number(newDietProtein) || 140,
      carbsGrams: Number(newDietCarbs) || 220,
      fatsGrams: Number(newDietFats) || 60,
      trainerId: activeTrainer?.id,
      assignedMemberId: newDietAssignMemberId !== 'unassigned' ? newDietAssignMemberId : undefined,
      meals: parsedMeals.length > 0 ? parsedMeals : [
        {
          mealName: 'Balanced Daily Diet',
          timeOfDay: 'Daily',
          items: ['High Protein, Low Sugar, Whole Foods'],
          approxProteinGrams: newDietProtein,
          approxCalories: newDietCalories
        }
      ],
      tips: parsedTips
    };

    const updatedPlans = [newPlan, ...dietPlans];
    setDietPlans(updatedPlans);
    AppStorage.saveDietPlans(updatedPlans);

    // If assigned to an athlete, update member's assignedDietPlanId
    if (newDietAssignMemberId !== 'unassigned') {
      const updatedMembers = members.map((m) =>
        m.id === newDietAssignMemberId ? { ...m, assignedDietPlanId: newPlan.id } : m
      );
      setMembers(updatedMembers);
      AppStorage.saveMembers(updatedMembers);
    }

    sounds.playSuccess();
    showToast(`Created diet plan: "${newPlan.title}"`);
    setNewDietTitle('');
    setIsDietModalOpen(false);
  };

  // Open quick assign modal
  const handleOpenQuickAssign = (member: Member, type: 'workout' | 'diet') => {
    setAssignTargetMember(member);
    setAssignType(type);
    setSelectedAssignId(
      type === 'workout'
        ? member.assignedRoutineId || routines[0]?.id || ''
        : member.assignedDietPlanId || dietPlans[0]?.id || ''
    );
    setIsQuickAssignOpen(true);
  };

  // Save quick assign
  const handleSaveQuickAssign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignTargetMember || !selectedAssignId) return;

    const updatedMembers = members.map((m) => {
      if (m.id === assignTargetMember.id) {
        return assignType === 'workout'
          ? { ...m, assignedRoutineId: selectedAssignId }
          : { ...m, assignedDietPlanId: selectedAssignId };
      }
      return m;
    });

    setMembers(updatedMembers);
    AppStorage.saveMembers(updatedMembers);

    const planTitle =
      assignType === 'workout'
        ? routines.find((r) => r.id === selectedAssignId)?.title
        : dietPlans.find((d) => d.id === selectedAssignId)?.title;

    sounds.playSuccess();
    showToast(`Assigned ${assignType} plan "${planTitle}" to ${assignTargetMember.fullName}`);
    setIsQuickAssignOpen(false);
  };

  // Delete workout plan
  const handleDeleteRoutine = (routineId: string) => {
    const updated = routines.filter((r) => r.id !== routineId);
    setRoutines(updated);
    AppStorage.saveRoutines(updated);
    showToast('Workout plan removed.');
  };

  // Delete diet plan
  const handleDeleteDietPlan = (planId: string) => {
    const updated = dietPlans.filter((d) => d.id !== planId);
    setDietPlans(updated);
    AppStorage.saveDietPlans(updated);
    showToast('Diet plan removed.');
  };

  const adminLink = initialGymSlug ? `/admin?gym=${initialGymSlug}` : '/admin';
  const memberLink = initialGymSlug ? `/member?gym=${initialGymSlug}` : '/member';
  const homeLink = initialGymSlug ? `/gym/${initialGymSlug}` : '/';

  return (
    <div className="min-h-screen bg-[#07090e] text-zinc-100 flex flex-col font-sans">
      {/* ─────────────────────────────────────────────────────────────
          PORTAL HEADER
      ───────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-[#07090e]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Link href={homeLink} className="flex items-center gap-2.5">
              <div
                className="flex h-9 w-9 items-center justify-center rounded-xl text-black font-black shadow-md"
                style={{ backgroundColor: primaryColor }}
              >
                <Dumbbell className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-black tracking-tight text-white text-base sm:text-lg">
                    {gymName}
                  </span>
                  <span
                    className="rounded-lg border px-2 py-0.5 text-[10px] font-black uppercase tracking-wider"
                    style={{
                      borderColor: `${primaryColor}40`,
                      backgroundColor: `${primaryColor}15`,
                      color: primaryColor
                    }}
                  >
                    COACH PORTAL
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 font-medium leading-none hidden sm:block">
                  Personal Training, Workout & Diet Plans
                </p>
              </div>
            </Link>
          </div>

          {/* Navigation & Portal Switcher Links */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href={memberLink}
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-white/10 transition-all"
            >
              <UserCheck className="h-3.5 w-3.5 text-zinc-400" />
              <span className="hidden sm:inline">Member Portal</span>
              <span className="sm:hidden">Member</span>
            </Link>
            <Link
              href={adminLink}
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-white/10 transition-all"
            >
              <ShieldCheck className="h-3.5 w-3.5 text-[#ccff00]" />
              <span className="hidden sm:inline">Admin</span>
            </Link>
          </div>
        </div>
      </header>

      {/* ─────────────────────────────────────────────────────────────
          MAIN CONTENT AREA
      ───────────────────────────────────────────────────────────── */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        
        {/* 1. Coach Selector & Profile Strip */}
        <section className="rounded-2xl border border-white/10 bg-[#0c1017] p-4 sm:p-6 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Coach Profile Details */}
            <div className="flex items-center gap-4">
              <div
                className="h-14 w-14 shrink-0 rounded-2xl flex items-center justify-center text-black font-black text-xl shadow-lg"
                style={{ backgroundColor: primaryColor }}
              >
                {activeTrainer?.name ? activeTrainer.name.charAt(0) : 'T'}
              </div>
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="text-xl font-black tracking-tight text-white">
                    {activeTrainer?.name || 'Coach'}
                  </h1>
                  <span className="text-[11px] font-semibold text-zinc-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded-md">
                    {activeTrainer?.exp || '5+ Years'}
                  </span>
                  <span className="text-[11px] font-bold text-[#ccff00] bg-[#ccff00]/10 border border-[#ccff00]/20 px-2 py-0.5 rounded-md">
                    ★ {activeTrainer?.rating || '4.95'}
                  </span>
                </div>
                <p className="text-xs text-zinc-400 font-medium mt-0.5">
                  {activeTrainer?.role} • {activeTrainer?.spec}
                </p>
                <p className="text-[11px] text-zinc-500 font-mono mt-1 flex items-center gap-1.5">
                  <Phone className="h-3 w-3 text-zinc-400 shrink-0" />
                  <span>{activeTrainer?.phone} {activeTrainer?.email ? `• ${activeTrainer.email}` : ''}</span>
                </p>
              </div>
            </div>

            {/* Coach Switcher Dropdown */}
            <div className="flex items-center gap-2 self-start md:self-center">
              <span className="text-xs text-zinc-400 font-medium hidden sm:inline">Active Coach:</span>
              <div className="relative">
                <select
                  value={selectedTrainerId}
                  onChange={(e) => setSelectedTrainerId(e.target.value)}
                  className="appearance-none rounded-xl border border-white/10 bg-[#121722] px-3.5 py-2 pr-8 text-xs font-bold text-white hover:border-white/20 focus:outline-none focus:ring-1 focus:ring-[#ccff00]"
                >
                  {trainers.map((t) => (
                    <option key={t.id} value={t.id} className="bg-[#121722] text-white">
                      {t.name} ({t.role.split(' ')[0]})
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
              </div>
            </div>

          </div>
        </section>

        {/* 2. Top Segmented Navigation Tabs */}
        <section className="flex items-center gap-2 border-b border-white/10 pb-3 overflow-x-auto">
          <button
            onClick={() => setActiveTab('athletes')}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'athletes'
                ? 'bg-[#ccff00] text-black shadow-md'
                : 'border border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Users className="h-4 w-4" />
            <span>Athletes & Sessions</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-black/20">
              {assignedMembers.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('workouts')}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'workouts'
                ? 'bg-[#ccff00] text-black shadow-md'
                : 'border border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Dumbbell className="h-4 w-4" />
            <span>Workout Plan Creator</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-black/20">
              {routines.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('diet')}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'diet'
                ? 'bg-[#ccff00] text-black shadow-md'
                : 'border border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Utensils className="h-4 w-4" />
            <span>Diet & Nutrition Creator</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-black/20">
              {dietPlans.length}
            </span>
          </button>
        </section>

        {/* ─────────────────────────────────────────────────────────────
            TAB 1: ATHLETES & SESSIONS
        ───────────────────────────────────────────────────────────── */}
        {activeTab === 'athletes' && (
          <div className="space-y-6">
            {/* Overview Metric Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="rounded-2xl border border-white/10 bg-[#0c1017] p-4">
                <div className="flex items-center justify-between text-zinc-400 text-xs font-semibold">
                  <span>Assigned Athletes</span>
                  <Users className="h-4 w-4 text-[#ccff00]" />
                </div>
                <div className="mt-2 text-2xl font-black text-white">
                  {assignedMembers.length}
                </div>
                <p className="text-[11px] text-zinc-500 mt-0.5">Active 1-on-1 clients</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#0c1017] p-4">
                <div className="flex items-center justify-between text-zinc-400 text-xs font-semibold">
                  <span>Present Today</span>
                  <CheckCircle className="h-4 w-4 text-emerald-400" />
                </div>
                <div className="mt-2 text-2xl font-black text-white">
                  {assignedMembers.filter((m) => checkedInTodayMemberIds.has(m.id)).length}
                </div>
                <p className="text-[11px] text-zinc-500 mt-0.5">Checked in at reception</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#0c1017] p-4">
                <div className="flex items-center justify-between text-zinc-400 text-xs font-semibold">
                  <span>Sessions Logged</span>
                  <FileText className="h-4 w-4 text-cyan-400" />
                </div>
                <div className="mt-2 text-2xl font-black text-white">
                  {trainerSessions.length}
                </div>
                <p className="text-[11px] text-zinc-500 mt-0.5">Coaching records</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#0c1017] p-4">
                <div className="flex items-center justify-between text-zinc-400 text-xs font-semibold">
                  <span>Client Adherence</span>
                  <Flame className="h-4 w-4 text-amber-400" />
                </div>
                <div className="mt-2 text-2xl font-black text-white">
                  {assignedMembers.length > 0
                    ? Math.round(
                        (assignedMembers.filter((m) => checkedInTodayMemberIds.has(m.id)).length /
                          assignedMembers.length) *
                          100
                      )
                    : 0}
                  %
                </div>
                <p className="text-[11px] text-zinc-500 mt-0.5">Daily check-in rate</p>
              </div>
            </div>

            {/* Athletes Roster */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-black tracking-tight text-white">
                    Assigned Athlete Roster
                  </h2>
                  <p className="text-xs text-zinc-400">
                    Track workout adherence, assigned diet plans, and log 1-on-1 personal training notes.
                  </p>
                </div>

                {/* Filter & Search Bar */}
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
                    <input
                      type="text"
                      placeholder="Search athlete or phone..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="h-9 w-44 sm:w-56 rounded-xl border border-white/10 bg-[#121722] pl-8 pr-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-[#ccff00]"
                    />
                  </div>

                  <select
                    value={goalFilter}
                    onChange={(e) => setGoalFilter(e.target.value)}
                    className="h-9 rounded-xl border border-white/10 bg-[#121722] px-3 text-xs font-semibold text-zinc-300 focus:outline-none focus:ring-1 focus:ring-[#ccff00]"
                  >
                    <option value="all">All Goals</option>
                    <option value="fat loss">Fat Loss</option>
                    <option value="muscle building">Muscle Building</option>
                    <option value="powerlifting">Powerlifting</option>
                    <option value="endurance">Endurance</option>
                  </select>
                </div>
              </div>

              {filteredMembers.length === 0 ? (
                <div className="rounded-2xl border border-white/10 bg-[#0c1017] p-8 text-center">
                  <Users className="h-8 w-8 text-zinc-500 mx-auto mb-2" />
                  <p className="text-sm font-bold text-white">No Athletes Found</p>
                  <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto">
                    {searchQuery || goalFilter !== 'all'
                      ? 'No assigned athlete matches your filter criteria.'
                      : 'No athletes are currently assigned to this coach. You can assign members from the Admin Console.'}
                  </p>
                  {activeTrainer && (
                    <Link
                      href={adminLink}
                      className="mt-4 inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-xs font-bold text-[#ccff00] hover:bg-white/10 transition-colors"
                    >
                      <ShieldCheck className="h-3.5 w-3.5" />
                      <span>Assign Clients in Admin</span>
                    </Link>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredMembers.map((member) => {
                    const isCheckedInToday = checkedInTodayMemberIds.has(member.id);
                    const assignedRoutine = routines.find((r) => r.id === member.assignedRoutineId);
                    const assignedDiet = dietPlans.find((d) => d.id === member.assignedDietPlanId);

                    return (
                      <div
                        key={member.id}
                        className="rounded-2xl border border-white/10 bg-[#0c1017] p-4 flex flex-col justify-between hover:border-white/20 transition-all group shadow-md"
                      >
                        <div>
                          {/* Athlete Header */}
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <div
                                className="h-10 w-10 shrink-0 rounded-xl flex items-center justify-center text-black font-black text-sm"
                                style={{ backgroundColor: `${primaryColor}cc` }}
                              >
                                {member.fullName.charAt(0)}
                              </div>
                              <div>
                                <h3 className="font-bold text-white text-sm group-hover:text-[#ccff00] transition-colors leading-snug">
                                  {member.fullName}
                                </h3>
                                <p className="text-[11px] text-zinc-400 font-mono">
                                  {member.phone}
                                </p>
                              </div>
                            </div>

                            {/* Attendance Badge */}
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                                isCheckedInToday
                                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                  : 'bg-zinc-800/80 text-zinc-400 border border-white/5'
                              }`}
                            >
                              {isCheckedInToday ? (
                                <>
                                  <Check className="h-3 w-3" />
                                  Checked In
                                </>
                              ) : (
                                'Not In Yet'
                              )}
                            </span>
                          </div>

                          {/* Fitness Goal & Diet Tags */}
                          <div className="mt-3.5 flex flex-wrap gap-1.5">
                            <span className="text-[11px] font-semibold bg-white/5 border border-white/10 text-zinc-300 px-2 py-0.5 rounded-md flex items-center gap-1">
                              <Target className="h-3 w-3 text-zinc-400" />
                              <span>{member.fitnessGoal}</span>
                            </span>
                            <span className="text-[11px] font-semibold bg-white/5 border border-white/10 text-zinc-300 px-2 py-0.5 rounded-md flex items-center gap-1">
                              <Utensils className="h-3 w-3 text-zinc-400" />
                              <span>{member.dietaryPreference}</span>
                            </span>
                          </div>

                          {/* Assigned Routine & Diet Status */}
                          <div className="mt-3 space-y-1.5 border-t border-white/5 pt-2.5 text-xs">
                            <div className="flex items-center justify-between text-zinc-400">
                              <span className="flex items-center gap-1.5 truncate">
                                <Dumbbell className="h-3.5 w-3.5 text-[#ccff00] shrink-0" />
                                <span className="truncate">
                                  {assignedRoutine ? assignedRoutine.title : 'No Workout Plan'}
                                </span>
                              </span>
                              <button
                                onClick={() => handleOpenQuickAssign(member, 'workout')}
                                className="text-[10px] font-bold text-[#ccff00] hover:underline shrink-0"
                              >
                                {assignedRoutine ? 'Change' : '+ Assign'}
                              </button>
                            </div>

                            <div className="flex items-center justify-between text-zinc-400">
                              <span className="flex items-center gap-1.5 truncate">
                                <Utensils className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                                <span className="truncate">
                                  {assignedDiet ? assignedDiet.title : 'No Diet Plan'}
                                </span>
                              </span>
                              <button
                                onClick={() => handleOpenQuickAssign(member, 'diet')}
                                className="text-[10px] font-bold text-amber-400 hover:underline shrink-0"
                              >
                                {assignedDiet ? 'Change' : '+ Assign'}
                              </button>
                            </div>
                          </div>

                          {/* Membership Status & Expiry */}
                          <div className="mt-3 text-[11px] text-zinc-400 flex items-center justify-between border-t border-white/5 pt-2.5">
                            <span>Status: <strong className="text-zinc-200 capitalize">{member.status}</strong></span>
                            <span>Expires: <strong className="text-zinc-200">{member.endDate}</strong></span>
                          </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="mt-4 pt-3 border-t border-white/10 flex items-center gap-2">
                          <button
                            onClick={() => handleOpenLogSession(member)}
                            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold text-black transition-all hover:brightness-110 active:scale-95 shadow-sm"
                            style={{ backgroundColor: primaryColor }}
                          >
                            <Plus className="h-3.5 w-3.5" />
                            <span>Log Session</span>
                          </button>

                          <a
                            href={`tel:${member.phone}`}
                            title="Call Athlete"
                            className="h-8 w-8 inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 text-zinc-300 hover:text-white hover:bg-white/10 transition-colors"
                          >
                            <Phone className="h-3.5 w-3.5" />
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Recent Coaching Session Notes Log */}
            <div className="rounded-2xl border border-white/10 bg-[#0c1017] p-5 sm:p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-black text-white">
                    Recent 1-on-1 Session Notes
                  </h2>
                  <p className="text-xs text-zinc-400">
                    Logged training records, weights, progression metrics and diet advice.
                  </p>
                </div>
                <span className="text-xs font-mono text-zinc-400">
                  {trainerSessions.length} Recorded
                </span>
              </div>

              {trainerSessions.length === 0 ? (
                <div className="py-8 text-center text-xs text-zinc-500">
                  No coaching sessions logged yet. Click &quot;Log Session&quot; on any athlete card above.
                </div>
              ) : (
                <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                  {trainerSessions.map((session) => (
                    <div
                      key={session.id}
                      className="rounded-xl border border-white/5 bg-[#121722]/60 p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-sm">
                            {session.memberName}
                          </span>
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/10 text-zinc-300">
                            {session.sessionType}
                          </span>
                          <span className="text-[11px] text-zinc-400 font-mono">
                            {new Date(session.date).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                        <p className="text-zinc-300 font-normal leading-relaxed">
                          {session.notes}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────
            TAB 2: WORKOUT PLAN CREATOR & LIBRARY
        ───────────────────────────────────────────────────────────── */}
        {activeTab === 'workouts' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-black tracking-tight text-white">
                  Workout Protocol Library
                </h2>
                <p className="text-xs text-zinc-400">
                  Design custom training splits, barbell regimens, and assign them directly to your athletes.
                </p>
              </div>

              <button
                onClick={() => setIsWorkoutModalOpen(true)}
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold text-black shadow-md transition-all hover:brightness-110 active:scale-95 self-start sm:self-auto"
                style={{ backgroundColor: primaryColor }}
              >
                <Plus className="h-4 w-4" />
                <span>Create Workout Plan</span>
              </button>
            </div>

            {/* Routines Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {routines.map((routine) => {
                const assignedCount = members.filter((m) => m.assignedRoutineId === routine.id).length;

                return (
                  <div
                    key={routine.id}
                    className="rounded-2xl border border-white/10 bg-[#0c1017] p-5 flex flex-col justify-between hover:border-white/20 transition-all shadow-md space-y-4"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-white text-base">
                              {routine.title}
                            </h3>
                            {routine.trainerId && (
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#ccff00]/10 text-[#ccff00] border border-[#ccff00]/20">
                                Coach Created
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[11px] font-mono uppercase font-bold text-zinc-400">
                              Split: <strong className="text-zinc-200">{routine.splitType}</strong>
                            </span>
                            <span className="text-zinc-600">•</span>
                            <span className="text-[11px] text-zinc-400 capitalize">
                              {routine.experienceLevel}
                            </span>
                          </div>
                        </div>

                        {routine.trainerId && (
                          <button
                            onClick={() => handleDeleteRoutine(routine.id)}
                            title="Delete Routine"
                            className="text-zinc-500 hover:text-red-400 p-1"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>

                      {/* Exercises Roster */}
                      <div className="mt-4 space-y-2 border-t border-white/5 pt-3">
                        <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                          Exercises ({routine.exercises.length}):
                        </span>
                        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                          {routine.exercises.map((item, idx) => (
                            <div
                              key={idx}
                              className="rounded-lg border border-white/5 bg-[#121722]/70 px-3 py-1.5 flex items-center justify-between text-xs"
                            >
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-zinc-500">{idx + 1}.</span>
                                <span className="font-medium text-white">{item.exercise.name}</span>
                              </div>
                              <span className="text-[11px] font-mono text-[#ccff00]">
                                {item.sets.length} sets × {item.sets[0]?.targetReps || 10} reps
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-white/10 pt-3 flex items-center justify-between text-xs">
                      <span className="text-zinc-400">
                        Assigned: <strong className="text-white">{assignedCount}</strong> athlete(s)
                      </span>
                      <button
                        onClick={() => {
                          setAssignType('workout');
                          setSelectedAssignId(routine.id);
                          if (assignedMembers[0]) {
                            setAssignTargetMember(assignedMembers[0]);
                            setIsQuickAssignOpen(true);
                          } else {
                            showToast('No assigned athletes available. Assign athletes from Admin first.');
                          }
                        }}
                        className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs font-semibold text-zinc-200 hover:text-white hover:bg-white/10"
                      >
                        <UserCheck className="h-3.5 w-3.5 text-[#ccff00]" />
                        <span>Assign to Client</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────
            TAB 3: DIET & NUTRITION CREATOR & LIBRARY
        ───────────────────────────────────────────────────────────── */}
        {activeTab === 'diet' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-black tracking-tight text-white">
                  Diet & Nutrition Protocol Library
                </h2>
                <p className="text-xs text-zinc-400">
                  Formulate calorie targets, macro breakdowns, and high-protein meal timing charts for clients.
                </p>
              </div>

              <button
                onClick={() => setIsDietModalOpen(true)}
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold text-black shadow-md transition-all hover:brightness-110 active:scale-95 self-start sm:self-auto"
                style={{ backgroundColor: primaryColor }}
              >
                <Plus className="h-4 w-4" />
                <span>Create Diet Plan</span>
              </button>
            </div>

            {/* Diet Plans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dietPlans.map((plan) => {
                const assignedCount = members.filter((m) => m.assignedDietPlanId === plan.id).length;

                return (
                  <div
                    key={plan.id}
                    className="rounded-2xl border border-white/10 bg-[#0c1017] p-5 flex flex-col justify-between hover:border-white/20 transition-all shadow-md space-y-4"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-white text-base">
                              {plan.title}
                            </h3>
                            {plan.trainerId && (
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-400/10 text-amber-400 border border-amber-400/20">
                                Coach Created
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                            Preference: <strong className="text-zinc-200 capitalize">{plan.preference}</strong>
                          </span>
                        </div>

                        {plan.trainerId && (
                          <button
                            onClick={() => handleDeleteDietPlan(plan.id)}
                            title="Delete Diet Plan"
                            className="text-zinc-500 hover:text-red-400 p-1"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>

                      {/* Macro Breakdown Pills */}
                      <div className="mt-3 grid grid-cols-4 gap-2 text-center">
                        <div className="rounded-xl border border-white/5 bg-[#121722] p-2">
                          <span className="text-[10px] text-zinc-400 uppercase font-semibold block">Calories</span>
                          <span className="text-sm font-black text-[#ccff00]">{plan.dailyCalories}</span>
                        </div>
                        <div className="rounded-xl border border-white/5 bg-[#121722] p-2">
                          <span className="text-[10px] text-zinc-400 uppercase font-semibold block">Protein</span>
                          <span className="text-sm font-black text-white">{plan.proteinGrams}g</span>
                        </div>
                        <div className="rounded-xl border border-white/5 bg-[#121722] p-2">
                          <span className="text-[10px] text-zinc-400 uppercase font-semibold block">Carbs</span>
                          <span className="text-sm font-black text-white">{plan.carbsGrams}g</span>
                        </div>
                        <div className="rounded-xl border border-white/5 bg-[#121722] p-2">
                          <span className="text-[10px] text-zinc-400 uppercase font-semibold block">Fats</span>
                          <span className="text-sm font-black text-white">{plan.fatsGrams}g</span>
                        </div>
                      </div>

                      {/* Meals Preview */}
                      <div className="mt-4 space-y-2 border-t border-white/5 pt-3">
                        <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                          Meals ({plan.meals.length}):
                        </span>
                        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                          {plan.meals.map((meal, idx) => (
                            <div
                              key={idx}
                              className="rounded-lg border border-white/5 bg-[#121722]/70 px-3 py-2 text-xs space-y-1"
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-white">{meal.mealName}</span>
                                <span className="text-[10px] font-mono text-[#ccff00]">
                                  {meal.approxProteinGrams}g Protein • {meal.approxCalories} kcal
                                </span>
                              </div>
                              <p className="text-zinc-400 text-[11px] leading-relaxed">
                                {meal.items.join(', ')}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-white/10 pt-3 flex items-center justify-between text-xs">
                      <span className="text-zinc-400">
                        Assigned: <strong className="text-white">{assignedCount}</strong> athlete(s)
                      </span>
                      <button
                        onClick={() => {
                          setAssignType('diet');
                          setSelectedAssignId(plan.id);
                          if (assignedMembers[0]) {
                            setAssignTargetMember(assignedMembers[0]);
                            setIsQuickAssignOpen(true);
                          } else {
                            showToast('No assigned athletes available. Assign athletes from Admin first.');
                          }
                        }}
                        className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs font-semibold text-zinc-200 hover:text-white hover:bg-white/10"
                      >
                        <UserCheck className="h-3.5 w-3.5 text-amber-400" />
                        <span>Assign to Client</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </main>

      {/* ─────────────────────────────────────────────────────────────
          MODAL 1: LOG 1-ON-1 COACHING SESSION
      ───────────────────────────────────────────────────────────── */}
      {isSessionModalOpen && selectedMemberForSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#0e121a] p-5 sm:p-6 shadow-2xl space-y-4">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="font-black text-white text-base">
                  Log Coaching Session
                </h3>
                <p className="text-xs text-zinc-400">
                  Athlete: <strong className="text-white">{selectedMemberForSession.fullName}</strong>
                </p>
              </div>
              <button
                onClick={() => setIsSessionModalOpen(false)}
                className="h-8 w-8 inline-flex items-center justify-center rounded-xl border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveSession} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Session Type
                </label>
                <select
                  value={sessionType}
                  onChange={(e) => setSessionType(e.target.value as TrainerSession['sessionType'])}
                  className="w-full rounded-xl border border-white/10 bg-[#141a24] px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#ccff00]"
                >
                  <option value="Strength">Strength / Hypertrophy Training</option>
                  <option value="Cardio">Cardio & Conditioning</option>
                  <option value="Assessment">Mobility & Body Composition Assessment</option>
                  <option value="Nutrition">Diet Chart & Macros Consultation</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Coaching Notes / Protocol
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="e.g. Barbell Squats 80kg x 5 sets. Form improved on hip hinge. Advised 140g protein intake."
                  value={sessionNotes}
                  onChange={(e) => setSessionNotes(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-[#141a24] p-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-[#ccff00] leading-relaxed resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsSessionModalOpen(false)}
                  className="rounded-xl border border-white/10 px-4 py-2 text-xs font-semibold text-zinc-400 hover:text-white hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold text-black shadow-md transition-all hover:brightness-110 active:scale-95"
                  style={{ backgroundColor: primaryColor }}
                >
                  <Check className="h-3.5 w-3.5" />
                  <span>Save Session Note</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          MODAL 2: CREATE WORKOUT PLAN
      ───────────────────────────────────────────────────────────── */}
      {isWorkoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg rounded-2xl border border-white/10 bg-[#0e121a] p-5 sm:p-6 shadow-2xl space-y-4 my-8">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="font-black text-white text-base">
                  Create Custom Workout Plan
                </h3>
                <p className="text-xs text-zinc-400">
                  Coach: <strong className="text-white">{activeTrainer?.name}</strong>
                </p>
              </div>
              <button
                onClick={() => setIsWorkoutModalOpen(false)}
                className="h-8 w-8 inline-flex items-center justify-center rounded-xl border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateWorkoutPlan} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Routine Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vikram's 4-Week Hypertrophy Push"
                  value={newRoutineTitle}
                  onChange={(e) => setNewRoutineTitle(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-[#141a24] px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-[#ccff00]"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Split Type</label>
                  <select
                    value={newRoutineSplit}
                    onChange={(e) => setNewRoutineSplit(e.target.value as WorkoutRoutine['splitType'])}
                    className="w-full rounded-xl border border-white/10 bg-[#141a24] px-2.5 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#ccff00]"
                  >
                    <option value="push">Push (Chest/Shoulders/Triceps)</option>
                    <option value="pull">Pull (Back/Biceps)</option>
                    <option value="legs">Legs & Core</option>
                    <option value="upper">Upper Body</option>
                    <option value="lower">Lower Body</option>
                    <option value="full_body">Full Body Conditioning</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Goal</label>
                  <select
                    value={newRoutineGoal}
                    onChange={(e) => setNewRoutineGoal(e.target.value as WorkoutRoutine['goal'])}
                    className="w-full rounded-xl border border-white/10 bg-[#141a24] px-2.5 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#ccff00]"
                  >
                    <option value="muscle_gain">Muscle Gain</option>
                    <option value="fat_loss">Fat Loss</option>
                    <option value="general_fitness">General Fitness</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Level</label>
                  <select
                    value={newRoutineLevel}
                    onChange={(e) => setNewRoutineLevel(e.target.value as WorkoutRoutine['experienceLevel'])}
                    className="w-full rounded-xl border border-white/10 bg-[#141a24] px-2.5 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#ccff00]"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Assign to Client (Optional)
                </label>
                <select
                  value={newRoutineAssignMemberId}
                  onChange={(e) => setNewRoutineAssignMemberId(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-[#141a24] px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#ccff00]"
                >
                  <option value="unassigned">- General Gym Library (Do not assign yet) -</option>
                  {assignedMembers.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.fullName} ({m.fitnessGoal})
                    </option>
                  ))}
                </select>
              </div>

              {/* Select Exercises */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Select Exercises from Gym Roster
                </label>
                <div className="grid grid-cols-2 gap-2 max-h-44 overflow-y-auto border border-white/10 rounded-xl p-2.5 bg-[#141a24]/50">
                  {exercises.map((ex) => {
                    const isSelected = selectedExIds.includes(ex.id);
                    return (
                      <button
                        type="button"
                        key={ex.id}
                        onClick={() => {
                          setSelectedExIds((prev) =>
                            isSelected ? prev.filter((id) => id !== ex.id) : [...prev, ex.id]
                          );
                        }}
                        className={`text-left rounded-lg p-2 text-xs font-medium border transition-all ${
                          isSelected
                            ? 'border-[#ccff00] bg-[#ccff00]/10 text-white font-bold'
                            : 'border-white/5 bg-[#101520] text-zinc-400 hover:text-white'
                        }`}
                      >
                        <div className="truncate">{ex.name}</div>
                        <span className="text-[10px] text-zinc-500 uppercase">{ex.targetMuscle}</span>
                      </button>
                    );
                  })}
                </div>
                <span className="text-[11px] text-zinc-500 mt-1 block">
                  {selectedExIds.length} exercises selected
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsWorkoutModalOpen(false)}
                  className="rounded-xl border border-white/10 px-4 py-2 text-xs font-semibold text-zinc-400 hover:text-white hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={selectedExIds.length === 0}
                  className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold text-black shadow-md transition-all hover:brightness-110 active:scale-95 disabled:opacity-50"
                  style={{ backgroundColor: primaryColor }}
                >
                  <Check className="h-3.5 w-3.5" />
                  <span>Save Workout Plan</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          MODAL 3: CREATE DIET PLAN
      ───────────────────────────────────────────────────────────── */}
      {isDietModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg rounded-2xl border border-white/10 bg-[#0e121a] p-5 sm:p-6 shadow-2xl space-y-4 my-8">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="font-black text-white text-base">
                  Create Custom Diet & Nutrition Plan
                </h3>
                <p className="text-xs text-zinc-400">
                  Coach: <strong className="text-white">{activeTrainer?.name}</strong>
                </p>
              </div>
              <button
                onClick={() => setIsDietModalOpen(false)}
                className="h-8 w-8 inline-flex items-center justify-center rounded-xl border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateDietPlan} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Diet Plan Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Priya's 2400 kcal Lean Shred Protocol"
                  value={newDietTitle}
                  onChange={(e) => setNewDietTitle(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-[#141a24] px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-[#ccff00]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Dietary Preference
                  </label>
                  <select
                    value={newDietPref}
                    onChange={(e) => setNewDietPref(e.target.value as DietPlan['preference'])}
                    className="w-full rounded-xl border border-white/10 bg-[#141a24] px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#ccff00]"
                  >
                    <option value="vegetarian">Vegetarian (Lacto/High Protein)</option>
                    <option value="eggetarian">Eggetarian</option>
                    <option value="non_veg">Non-Veg (Chicken/Fish/Eggs)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Assign to Client (Optional)
                  </label>
                  <select
                    value={newDietAssignMemberId}
                    onChange={(e) => setNewDietAssignMemberId(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-[#141a24] px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#ccff00]"
                  >
                    <option value="unassigned">- General Diet Library -</option>
                    {assignedMembers.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.fullName} ({m.fitnessGoal})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Macro Target Inputs */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Daily Target Macros
                </label>
                <div className="grid grid-cols-4 gap-2">
                  <div>
                    <span className="text-[10px] text-zinc-400 block mb-0.5">Calories</span>
                    <input
                      type="number"
                      required
                      value={newDietCalories}
                      onChange={(e) => setNewDietCalories(Number(e.target.value))}
                      className="w-full rounded-xl border border-white/10 bg-[#141a24] px-2.5 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#ccff00]"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-400 block mb-0.5">Protein (g)</span>
                    <input
                      type="number"
                      required
                      value={newDietProtein}
                      onChange={(e) => setNewDietProtein(Number(e.target.value))}
                      className="w-full rounded-xl border border-white/10 bg-[#141a24] px-2.5 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#ccff00]"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-400 block mb-0.5">Carbs (g)</span>
                    <input
                      type="number"
                      required
                      value={newDietCarbs}
                      onChange={(e) => setNewDietCarbs(Number(e.target.value))}
                      className="w-full rounded-xl border border-white/10 bg-[#141a24] px-2.5 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#ccff00]"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-400 block mb-0.5">Fats (g)</span>
                    <input
                      type="number"
                      required
                      value={newDietFats}
                      onChange={(e) => setNewDietFats(Number(e.target.value))}
                      className="w-full rounded-xl border border-white/10 bg-[#141a24] px-2.5 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#ccff00]"
                    />
                  </div>
                </div>
              </div>

              {/* Meals text breakdown */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Meal Plan Breakdown (1 line per meal)
                </label>
                <textarea
                  rows={4}
                  required
                  value={newDietMealsText}
                  onChange={(e) => setNewDietMealsText(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-[#141a24] p-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-[#ccff00] leading-relaxed resize-none font-mono"
                />
              </div>

              {/* Practical Tips */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Coach Guidance & Tips (1 per line)
                </label>
                <textarea
                  rows={2}
                  value={newDietTipsText}
                  onChange={(e) => setNewDietTipsText(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-[#141a24] p-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-[#ccff00] leading-relaxed resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsDietModalOpen(false)}
                  className="rounded-xl border border-white/10 px-4 py-2 text-xs font-semibold text-zinc-400 hover:text-white hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold text-black shadow-md transition-all hover:brightness-110 active:scale-95"
                  style={{ backgroundColor: primaryColor }}
                >
                  <Check className="h-3.5 w-3.5" />
                  <span>Save Diet Plan</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          MODAL 4: QUICK ASSIGN PLAN TO ATHLETE
      ───────────────────────────────────────────────────────────── */}
      {isQuickAssignOpen && assignTargetMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#0e121a] p-5 sm:p-6 shadow-2xl space-y-4">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="font-black text-white text-base">
                  Assign {assignType === 'workout' ? 'Workout Routine' : 'Diet Plan'}
                </h3>
                <p className="text-xs text-zinc-400">
                  Athlete: <strong className="text-white">{assignTargetMember.fullName}</strong>
                </p>
              </div>
              <button
                onClick={() => setIsQuickAssignOpen(false)}
                className="h-8 w-8 inline-flex items-center justify-center rounded-xl border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveQuickAssign} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Select {assignType === 'workout' ? 'Routine' : 'Diet Plan'}
                </label>
                <select
                  value={selectedAssignId}
                  onChange={(e) => setSelectedAssignId(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-[#141a24] px-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#ccff00]"
                >
                  {assignType === 'workout'
                    ? routines.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.title} ({r.splitType.toUpperCase()} • {r.exercises.length} exercises)
                        </option>
                      ))
                    : dietPlans.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.title} ({d.dailyCalories} kcal • {d.proteinGrams}g Protein)
                        </option>
                      ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsQuickAssignOpen(false)}
                  className="rounded-xl border border-white/10 px-4 py-2 text-xs font-semibold text-zinc-400 hover:text-white hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold text-black shadow-md transition-all hover:brightness-110 active:scale-95"
                  style={{ backgroundColor: primaryColor }}
                >
                  <Check className="h-3.5 w-3.5" />
                  <span>Assign to Athlete</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 rounded-xl border border-[#ccff00]/30 bg-[#0e121a]/95 backdrop-blur-md px-4 py-2.5 text-xs font-bold text-[#ccff00] shadow-2xl animate-fade-in flex items-center gap-2">
          <CheckCircle className="h-4 w-4" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
