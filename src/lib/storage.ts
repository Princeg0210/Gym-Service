import {
  Member,
  AttendanceRecord,
  PaymentRecord,
  EquipmentItem,
  LeadItem,
  WorkoutRoutine,
  Exercise,
  StaffTrainer,
  TrainerSession,
  DietPlan
} from '@/types';
import {
  INITIAL_EQUIPMENT,
  INITIAL_ROUTINES,
  INITIAL_EXERCISES,
  INITIAL_TRAINERS,
  INITIAL_DIET_PLANS
} from './mockData';

const KEYS = {
  MEMBERS: 'gympro_members_v2',
  ATTENDANCE: 'gympro_attendance_v2',
  PAYMENTS: 'gympro_payments_v2',
  EQUIPMENT: 'gympro_equipment_v2',
  LEADS: 'gympro_leads_v2',
  ROUTINES: 'gympro_routines_v2',
  EXERCISES: 'gympro_exercises_v2',
  TRAINERS: 'gympro_trainers_v2',
  TRAINER_SESSIONS: 'gympro_trainer_sessions_v1',
  DIET_PLANS: 'gympro_diet_plans_v2'
};

export const AppStorage = {
  getMembers(): Member[] {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(KEYS.MEMBERS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveMembers(members: Member[]) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(KEYS.MEMBERS, JSON.stringify(members));
  },

  getAttendance(): AttendanceRecord[] {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(KEYS.ATTENDANCE);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveAttendance(records: AttendanceRecord[]) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(KEYS.ATTENDANCE, JSON.stringify(records));
  },

  getPayments(): PaymentRecord[] {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(KEYS.PAYMENTS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  savePayments(payments: PaymentRecord[]) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(KEYS.PAYMENTS, JSON.stringify(payments));
  },

  getEquipment(): EquipmentItem[] {
    if (typeof window === 'undefined') return INITIAL_EQUIPMENT;
    try {
      const data = localStorage.getItem(KEYS.EQUIPMENT);
      return data ? JSON.parse(data) : INITIAL_EQUIPMENT;
    } catch {
      return INITIAL_EQUIPMENT;
    }
  },

  saveEquipment(equipment: EquipmentItem[]) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(KEYS.EQUIPMENT, JSON.stringify(equipment));
  },

  getLeads(): LeadItem[] {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(KEYS.LEADS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveLeads(leads: LeadItem[]) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(KEYS.LEADS, JSON.stringify(leads));
  },

  getRoutines(): WorkoutRoutine[] {
    if (typeof window === 'undefined') return INITIAL_ROUTINES;
    try {
      const data = localStorage.getItem(KEYS.ROUTINES);
      return data ? JSON.parse(data) : INITIAL_ROUTINES;
    } catch {
      return INITIAL_ROUTINES;
    }
  },

  saveRoutines(routines: WorkoutRoutine[]) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(KEYS.ROUTINES, JSON.stringify(routines));
  },

  getExercises(): Exercise[] {
    if (typeof window === 'undefined') return INITIAL_EXERCISES;
    try {
      const data = localStorage.getItem(KEYS.EXERCISES);
      return data ? JSON.parse(data) : INITIAL_EXERCISES;
    } catch {
      return INITIAL_EXERCISES;
    }
  },

  // ponytail: minimal trainer roster persistence
  getTrainers(): StaffTrainer[] {
    if (typeof window === 'undefined') return INITIAL_TRAINERS;
    try {
      const data = localStorage.getItem(KEYS.TRAINERS);
      return data ? JSON.parse(data) : INITIAL_TRAINERS;
    } catch {
      return INITIAL_TRAINERS;
    }
  },

  saveTrainers(trainers: StaffTrainer[]) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(KEYS.TRAINERS, JSON.stringify(trainers));
  },

  getTrainerSessions(): TrainerSession[] {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(KEYS.TRAINER_SESSIONS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveTrainerSessions(sessions: TrainerSession[]) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(KEYS.TRAINER_SESSIONS, JSON.stringify(sessions));
  },

  // ponytail: minimal diet plan library & coach customized diets persistence
  getDietPlans(): DietPlan[] {
    if (typeof window === 'undefined') return Object.values(INITIAL_DIET_PLANS);
    try {
      const data = localStorage.getItem(KEYS.DIET_PLANS);
      return data ? JSON.parse(data) : Object.values(INITIAL_DIET_PLANS);
    } catch {
      return Object.values(INITIAL_DIET_PLANS);
    }
  },

  saveDietPlans(plans: DietPlan[]) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(KEYS.DIET_PLANS, JSON.stringify(plans));
  },

  resetAll() {
    if (typeof window === 'undefined') return;
    Object.values(KEYS).forEach((k) => localStorage.removeItem(k));
  }
};
