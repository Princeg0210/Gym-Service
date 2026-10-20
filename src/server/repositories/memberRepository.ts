import { Member, FitnessGoal, DietaryPreference } from '@/types';
import { supabase } from '../db/supabase';

export interface MemberRow {
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
  status?: 'active' | 'expired' | 'trial' | 'defaulter' | 'deleted' | null;
  emergency_contact?: string | null;
  fitness_goal?: string | null;
  dietary_preference?: string | null;
  avatar_seed?: string | null;
  created_at?: string;
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

export function rowToMember(row: MemberRow): Member {
  return {
    id: row.id,
    fullName: row.full_name || 'Member',
    phone: row.phone || '',
    gender: row.gender || 'male',
    age: Number(row.age) || 25,
    planId: row.plan_id || 'plan-1m',
    planName: row.plan_name || 'Standard Gym',
    startDate: row.start_date || new Date().toISOString().split('T')[0],
    endDate: row.end_date || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    totalFeeInr: Number(row.total_fee_inr) || 0,
    paidAmountInr: Number(row.paid_amount_inr) || 0,
    pendingDueInr: Number(row.pending_due_inr) || 0,
    status: (row.status === 'expired' || row.status === 'defaulter' || row.status === 'trial') ? row.status : 'active',
    emergencyContact: row.emergency_contact || undefined,
    fitnessGoal: normalizeFitnessGoal(row.fitness_goal),
    dietaryPreference: normalizeDietaryPreference(row.dietary_preference),
    avatarSeed: row.avatar_seed || (row.full_name ? row.full_name.split(' ')[0] : 'Member')
  };
}

export const memberRepository = {
  async getAll(): Promise<Member[]> {
    if (!supabase) return [];
    try {
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      if (!data) return [];
      return (data as unknown as MemberRow[])
        .filter((row) => row.status !== 'deleted')
        .map(rowToMember);
    } catch (error) {
      console.error('Database fetch error (members):', error);
      return [];
    }
  },

  async getById(id: string): Promise<Member | null> {
    if (!supabase) return null;
    try {
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      if (error) throw error;
      if (!data || data.status === 'deleted') return null;
      return rowToMember(data as unknown as MemberRow);
    } catch (error) {
      console.error(`Database fetch error (member ${id}):`, error);
      return null;
    }
  },

  async create(member: Member): Promise<Member> {
    if (!supabase) return member;
    try {
      const row: Partial<MemberRow> = {
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
      };

      const { data, error } = await supabase
        .from('members')
        .upsert([row], { onConflict: 'id' })
        .select()
        .single();
      if (error) {
        console.error('Database upsert error (member):', error.message, error.details, error.hint);
        throw error;
      }
      return rowToMember(data as unknown as MemberRow);
    } catch (error) {
      console.error('Database insert/upsert error (member):', error);
      return member;
    }
  },

  async update(id: string, updates: Partial<Member>): Promise<Member | null> {
    if (!supabase) return null;
    try {
      const rowUpdates: Record<string, unknown> = {};
      if (updates.fullName !== undefined) rowUpdates.full_name = updates.fullName;
      if (updates.phone !== undefined) rowUpdates.phone = updates.phone;
      if (updates.gender !== undefined) rowUpdates.gender = updates.gender;
      if (updates.age !== undefined) rowUpdates.age = updates.age;
      if (updates.planId !== undefined) rowUpdates.plan_id = updates.planId;
      if (updates.planName !== undefined) rowUpdates.plan_name = updates.planName;
      if (updates.startDate !== undefined) rowUpdates.start_date = updates.startDate;
      if (updates.endDate !== undefined) rowUpdates.end_date = updates.endDate;
      if (updates.totalFeeInr !== undefined) rowUpdates.total_fee_inr = updates.totalFeeInr;
      if (updates.paidAmountInr !== undefined) rowUpdates.paid_amount_inr = updates.paidAmountInr;
      if (updates.pendingDueInr !== undefined) rowUpdates.pending_due_inr = updates.pendingDueInr;
      if (updates.status !== undefined) rowUpdates.status = updates.status;
      if (updates.emergencyContact !== undefined) rowUpdates.emergency_contact = updates.emergencyContact;
      if (updates.fitnessGoal !== undefined) rowUpdates.fitness_goal = updates.fitnessGoal;
      if (updates.dietaryPreference !== undefined) rowUpdates.dietary_preference = updates.dietaryPreference;
      if (updates.avatarSeed !== undefined) rowUpdates.avatar_seed = updates.avatarSeed;

      const { data, error } = await supabase
        .from('members')
        .update(rowUpdates)
        .eq('id', id)
        .select()
        .maybeSingle();
      if (error) throw error;
      if (!data) return null;
      return rowToMember(data as unknown as MemberRow);
    } catch (error) {
      console.error(`Database update error (member ${id}):`, error);
      return null;
    }
  },

  async delete(id: string): Promise<boolean> {
    if (!supabase) return true;
    try {
      const { error } = await supabase.from('members').update({ status: 'deleted' }).eq('id', id);
      if (error) throw error;
      return true;
    } catch (error) {
      console.error(`Database delete error (member ${id}):`, error);
      return false;
    }
  }
};
