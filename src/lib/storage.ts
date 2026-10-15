import {
  Member,
  AttendanceRecord,
  PaymentRecord,
  EquipmentItem,
  LeadItem,
  WorkoutRoutine,
  Exercise
} from '@/types';
import {
  INITIAL_MEMBERS,
  INITIAL_ATTENDANCE,
  INITIAL_PAYMENTS,
  INITIAL_EQUIPMENT,
  INITIAL_LEADS,
  INITIAL_ROUTINES,
  INITIAL_EXERCISES
} from './mockData';

const KEYS = {
  MEMBERS: 'gympro_members_v2',
  ATTENDANCE: 'gympro_attendance_v2',
  PAYMENTS: 'gympro_payments_v2',
  EQUIPMENT: 'gympro_equipment_v2',
  LEADS: 'gympro_leads_v2',
  ROUTINES: 'gympro_routines_v2',
  EXERCISES: 'gympro_exercises_v2'
};

export const AppStorage = {
  getMembers(): Member[] {
    if (typeof window === 'undefined') return INITIAL_MEMBERS;
    try {
      const data = localStorage.getItem(KEYS.MEMBERS);
      return data ? JSON.parse(data) : INITIAL_MEMBERS;
    } catch {
      return INITIAL_MEMBERS;
    }
  },

  saveMembers(members: Member[]) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(KEYS.MEMBERS, JSON.stringify(members));
  },

  getAttendance(): AttendanceRecord[] {
    if (typeof window === 'undefined') return INITIAL_ATTENDANCE;
    try {
      const data = localStorage.getItem(KEYS.ATTENDANCE);
      return data ? JSON.parse(data) : INITIAL_ATTENDANCE;
    } catch {
      return INITIAL_ATTENDANCE;
    }
  },

  saveAttendance(records: AttendanceRecord[]) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(KEYS.ATTENDANCE, JSON.stringify(records));
  },

  getPayments(): PaymentRecord[] {
    if (typeof window === 'undefined') return INITIAL_PAYMENTS;
    try {
      const data = localStorage.getItem(KEYS.PAYMENTS);
      return data ? JSON.parse(data) : INITIAL_PAYMENTS;
    } catch {
      return INITIAL_PAYMENTS;
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
    if (typeof window === 'undefined') return INITIAL_LEADS;
    try {
      const data = localStorage.getItem(KEYS.LEADS);
      return data ? JSON.parse(data) : INITIAL_LEADS;
    } catch {
      return INITIAL_LEADS;
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

  resetAll() {
    if (typeof window === 'undefined') return;
    Object.values(KEYS).forEach((k) => localStorage.removeItem(k));
  }
};
