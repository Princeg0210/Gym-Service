import { createClient } from '@supabase/supabase-js';
import {
  Member,
  AttendanceRecord,
  PaymentRecord,
  EquipmentItem,
  EquipmentTier,
  FitnessGoal,
  DietaryPreference,
  LeadItem
} from '@/types';
import { INITIAL_MEMBERS, INITIAL_ATTENDANCE, INITIAL_PAYMENTS, INITIAL_EQUIPMENT, INITIAL_LEADS } from './mockData';

// ─────────────────────────────────────────────────────────────
// Supabase Client (replaces Neon PostgreSQL)
// ─────────────────────────────────────────────────────────────
const isConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  !supabaseUrl.includes('YOUR_PROJECT_ID') &&
  !supabaseAnonKey.includes('YOUR_SUPABASE_ANON_KEY')
);

export const supabase = isConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : null;

// ─────────────────────────────────────────────────────────────
// Row Interfaces & TypeScript type mappers
// ─────────────────────────────────────────────────────────────

interface MemberRow {
  id: string;
  full_name: string;
  phone: string;
  gender: 'male' | 'female' | 'other';
  age: number | string;
  plan_id: string;
  plan_name: string;
  start_date: string;
  end_date: string;
  total_fee_inr: number | string;
  paid_amount_inr: number | string;
  pending_due_inr: number | string;
  status: 'active' | 'expired' | 'trial' | 'defaulter';
  emergency_contact?: string | null;
  fitness_goal?: string | null;
  dietary_preference?: string | null;
  avatar_seed?: string | null;
  created_at?: string;
}

interface AttendanceRow {
  id: string;
  member_id: string;
  member_name: string;
  phone: string;
  check_in_time: string;
  check_in_method: 'qr_scan' | 'phone_search';
  plan_status: 'active' | 'expired' | 'trial' | 'defaulter';
  pending_due_inr: number | string;
  created_at?: string;
}

interface PaymentRow {
  id: string;
  member_id: string;
  member_name: string;
  amount_inr: number | string;
  payment_mode?: string | null;
  transaction_ref?: string | null;
  timestamp: string;
  created_at?: string;
}

interface EquipmentRow {
  id: string;
  name: string;
  category?: string | null;
  tier?: string | null;
  status: 'operational' | 'needs_service' | 'out_of_order';
  last_serviced_date: string;
  next_service_due_date: string;
  notes?: string | null;
}

interface LeadRow {
  id: string;
  full_name: string;
  phone: string;
  goal?: string | null;
  interest?: string | null;
  inquiry_date?: string;
  created_at?: string;
  trial_status?: string;
  status?: string;
  next_follow_up_date?: string;
  follow_up_date?: string;
  notes?: string | null;
}

function normalizeFitnessGoal(goal?: string | null): FitnessGoal {
  if (goal === 'muscle_gain' || goal === 'fat_loss' || goal === 'strength' || goal === 'general_fitness') {
    return goal;
  }
  if (goal === 'weight_gain') return 'muscle_gain';
  return 'general_fitness';
}

function normalizeDietaryPreference(pref?: string | null): DietaryPreference {
  if (pref === 'vegetarian' || pref === 'eggetarian' || pref === 'non_veg') {
    return pref;
  }
  if (pref === 'non_vegetarian') return 'non_veg';
  if (pref === 'vegan') return 'vegetarian';
  return 'vegetarian';
}

function normalizeEquipmentCategory(cat?: string | null): EquipmentItem['category'] {
  if (cat === 'strength_machine' || cat === 'free_weights' || cat === 'cardio' || cat === 'cable_station') {
    return cat;
  }
  return 'strength_machine';
}

function normalizeEquipmentTier(tier?: string | null): EquipmentTier {
  if (tier === 'tier_a' || tier === 'tier_b' || tier === 'tier_c') {
    return tier;
  }
  return 'tier_a';
}

function rowToMember(row: MemberRow): Member {
  return {
    id: row.id,
    fullName: row.full_name,
    phone: row.phone,
    gender: row.gender,
    age: Number(row.age),
    planId: row.plan_id,
    planName: row.plan_name,
    startDate: row.start_date,
    endDate: row.end_date,
    totalFeeInr: Number(row.total_fee_inr),
    paidAmountInr: Number(row.paid_amount_inr),
    pendingDueInr: Number(row.pending_due_inr),
    status: row.status,
    emergencyContact: row.emergency_contact || undefined,
    fitnessGoal: normalizeFitnessGoal(row.fitness_goal),
    dietaryPreference: normalizeDietaryPreference(row.dietary_preference),
    avatarSeed: row.avatar_seed || row.full_name.split(' ')[0]
  };
}

function rowToAttendance(row: AttendanceRow): AttendanceRecord {
  return {
    id: row.id,
    memberId: row.member_id,
    memberName: row.member_name,
    phone: row.phone,
    checkInTime: row.check_in_time,
    checkInMethod: row.check_in_method,
    planStatus: row.plan_status,
    pendingDueInr: Number(row.pending_due_inr)
  };
}

function rowToPayment(row: PaymentRow): PaymentRecord {
  return {
    id: row.id,
    memberId: row.member_id,
    memberName: row.member_name,
    amountInr: Number(row.amount_inr),
    paymentMode: (row.payment_mode as PaymentRecord['paymentMode']) || 'cash',
    transactionRef: row.transaction_ref || row.id || `TXN-${row.id.slice(0, 8)}`,
    timestamp: row.timestamp
  };
}

function rowToEquipment(row: EquipmentRow): EquipmentItem {
  return {
    id: row.id,
    name: row.name,
    category: normalizeEquipmentCategory(row.category),
    tier: normalizeEquipmentTier(row.tier),
    status: row.status,
    lastServicedDate: row.last_serviced_date,
    nextServiceDueDate: row.next_service_due_date,
    notes: row.notes || undefined
  };
}

function rowToLead(row: LeadRow): LeadItem {
  return {
    id: row.id,
    fullName: row.full_name,
    phone: row.phone,
    goal: normalizeFitnessGoal(row.goal || row.interest),
    inquiryDate: row.inquiry_date || row.created_at || '2026-10-12',
    trialStatus: (row.trial_status || row.status || 'trial_booked') as LeadItem['trialStatus'],
    nextFollowUpDate: row.next_follow_up_date || row.follow_up_date || '2026-10-15',
    notes: row.notes || 'Inquired at desk'
  };
}

// ─────────────────────────────────────────────────────────────
// Members — CRUD
// ─────────────────────────────────────────────────────────────

export async function getMembersFromDb(): Promise<Member[]> {
  if (!supabase) return INITIAL_MEMBERS;
  try {
    const { data, error } = await supabase
      .from('members')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    if (!data || data.length === 0) return INITIAL_MEMBERS;
    return (data as unknown as MemberRow[]).map(rowToMember);
  } catch (error) {
    console.error('Supabase fetch error (members):', error);
    return INITIAL_MEMBERS;
  }
}

export async function getMemberByIdFromDb(id: string): Promise<Member | null> {
  if (!supabase) {
    const found = INITIAL_MEMBERS.find((m) => m.id === id);
    return found || null;
  }
  try {
    const { data, error } = await supabase
      .from('members')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    if (error) throw error;
    if (!data) {
      const found = INITIAL_MEMBERS.find((m) => m.id === id);
      return found || null;
    }
    return rowToMember(data as unknown as MemberRow);
  } catch (error) {
    console.error(`Supabase fetch error (member ${id}):`, error);
    const found = INITIAL_MEMBERS.find((m) => m.id === id);
    return found || null;
  }
}

export async function createMemberInDb(member: Member): Promise<Member> {
  if (!supabase) return member;
  try {
    const { data, error } = await supabase
      .from('members')
      .insert([{
        id: member.id,
        full_name: member.fullName,
        phone: member.phone,
        gender: member.gender,
        age: member.age,
        plan_id: member.planId,
        plan_name: member.planName,
        start_date: member.startDate,
        end_date: member.endDate,
        total_fee_inr: member.totalFeeInr,
        paid_amount_inr: member.paidAmountInr,
        pending_due_inr: member.pendingDueInr,
        status: member.status,
        emergency_contact: member.emergencyContact || null,
        fitness_goal: member.fitnessGoal,
        dietary_preference: member.dietaryPreference,
        avatar_seed: member.avatarSeed
      }])
      .select()
      .single();
    if (error) throw error;
    return rowToMember(data as unknown as MemberRow);
  } catch (error) {
    console.error('Supabase insert error (member):', error);
    return member;
  }
}

export async function updateMemberInDb(id: string, updates: Partial<Member>): Promise<Member | null> {
  if (!supabase) return null;
  try {
    const patch: Record<string, unknown> = {};
    if (updates.fullName !== undefined) patch.full_name = updates.fullName;
    if (updates.phone !== undefined) patch.phone = updates.phone;
    if (updates.gender !== undefined) patch.gender = updates.gender;
    if (updates.age !== undefined) patch.age = updates.age;
    if (updates.planId !== undefined) patch.plan_id = updates.planId;
    if (updates.planName !== undefined) patch.plan_name = updates.planName;
    if (updates.startDate !== undefined) patch.start_date = updates.startDate;
    if (updates.endDate !== undefined) patch.end_date = updates.endDate;
    if (updates.totalFeeInr !== undefined) patch.total_fee_inr = updates.totalFeeInr;
    if (updates.paidAmountInr !== undefined) patch.paid_amount_inr = updates.paidAmountInr;
    if (updates.pendingDueInr !== undefined) patch.pending_due_inr = updates.pendingDueInr;
    if (updates.status !== undefined) patch.status = updates.status;
    if (updates.emergencyContact !== undefined) patch.emergency_contact = updates.emergencyContact;
    if (updates.fitnessGoal !== undefined) patch.fitness_goal = updates.fitnessGoal;
    if (updates.dietaryPreference !== undefined) patch.dietary_preference = updates.dietaryPreference;

    const { data, error } = await supabase
      .from('members')
      .update(patch)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return rowToMember(data as unknown as MemberRow);
  } catch (error) {
    console.error('Supabase update error (member):', error);
    return null;
  }
}

export async function deleteMemberInDb(id: string): Promise<boolean> {
  if (!supabase) return true;
  try {
    const { error } = await supabase.from('members').delete().eq('id', id);
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Supabase delete error (member):', error);
    return false;
  }
}

// ─────────────────────────────────────────────────────────────
// Attendance
// ─────────────────────────────────────────────────────────────

export async function getAttendanceFromDb(): Promise<AttendanceRecord[]> {
  if (!supabase) return INITIAL_ATTENDANCE;
  try {
    const { data, error } = await supabase
      .from('attendance')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    if (!data || data.length === 0) return INITIAL_ATTENDANCE;
    return (data as unknown as AttendanceRow[]).map(rowToAttendance);
  } catch (error) {
    console.error('Supabase fetch error (attendance):', error);
    return INITIAL_ATTENDANCE;
  }
}

export async function logAttendanceInDb(rec: AttendanceRecord): Promise<AttendanceRecord> {
  if (!supabase) return rec;
  try {
    const { data, error } = await supabase
      .from('attendance')
      .insert([{
        id: rec.id,
        member_id: rec.memberId,
        member_name: rec.memberName,
        phone: rec.phone,
        check_in_time: rec.checkInTime,
        check_in_method: rec.checkInMethod,
        plan_status: rec.planStatus,
        pending_due_inr: rec.pendingDueInr
      }])
      .select()
      .single();
    if (error) throw error;
    return rowToAttendance(data as unknown as AttendanceRow);
  } catch (error) {
    console.error('Supabase insert error (attendance):', error);
    return rec;
  }
}

// ─────────────────────────────────────────────────────────────
// Payments
// ─────────────────────────────────────────────────────────────

export async function getPaymentsFromDb(): Promise<PaymentRecord[]> {
  if (!supabase) return INITIAL_PAYMENTS;
  try {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    if (!data || data.length === 0) return INITIAL_PAYMENTS;
    return (data as unknown as PaymentRow[]).map(rowToPayment);
  } catch (error) {
    console.error('Supabase fetch error (payments):', error);
    return INITIAL_PAYMENTS;
  }
}

export async function recordPaymentInDb(pay: PaymentRecord): Promise<PaymentRecord> {
  if (!supabase) return pay;
  try {
    const { data, error } = await supabase
      .from('payments')
      .insert([{
        id: pay.id,
        member_id: pay.memberId,
        member_name: pay.memberName,
        amount_inr: pay.amountInr,
        payment_mode: pay.paymentMode,
        transaction_ref: pay.transactionRef,
        timestamp: pay.timestamp
      }])
      .select()
      .single();
    if (error) throw error;
    return rowToPayment(data as unknown as PaymentRow);
  } catch (error) {
    console.error('Supabase insert error (payment):', error);
    return pay;
  }
}

// ─────────────────────────────────────────────────────────────
// Equipment
// ─────────────────────────────────────────────────────────────

export async function getEquipmentFromDb(): Promise<EquipmentItem[]> {
  if (!supabase) return INITIAL_EQUIPMENT;
  try {
    const { data, error } = await supabase
      .from('equipment')
      .select('*')
      .order('id', { ascending: true });
    if (error) throw error;
    if (!data || data.length === 0) return INITIAL_EQUIPMENT;
    return (data as unknown as EquipmentRow[]).map(rowToEquipment);
  } catch (error) {
    console.error('Supabase fetch error (equipment):', error);
    return INITIAL_EQUIPMENT;
  }
}

export async function updateEquipmentStatusInDb(id: string, status: EquipmentItem['status']): Promise<EquipmentItem | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('equipment')
      .update({ status })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return rowToEquipment(data as unknown as EquipmentRow);
  } catch (error) {
    console.error('Supabase update error (equipment):', error);
    return null;
  }
}

// ─────────────────────────────────────────────────────────────
// Leads
// ─────────────────────────────────────────────────────────────

export async function getLeadsFromDb(): Promise<LeadItem[]> {
  if (!supabase) return INITIAL_LEADS;
  try {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    if (!data || data.length === 0) return INITIAL_LEADS;
    return (data as unknown as LeadRow[]).map(rowToLead);
  } catch (error) {
    console.error('Supabase fetch error (leads):', error);
    return INITIAL_LEADS;
  }
}
