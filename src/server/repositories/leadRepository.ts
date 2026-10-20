import { LeadItem, FitnessGoal } from '@/types';
import { supabase } from '../db/supabase';

export interface LeadRow {
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

export function rowToLead(row: LeadRow): LeadItem {
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

export const leadRepository = {
  async getAll(): Promise<LeadItem[]> {
    if (!supabase) return [];
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      if (!data || data.length === 0) return [];
      return (data as unknown as LeadRow[])
        .filter((r) => r.status !== 'deleted')
        .map(rowToLead);
    } catch (error) {
      console.error('Database fetch error (leads):', error);
      return [];
    }
  },

  async create(lead: LeadItem): Promise<LeadItem> {
    if (!supabase) return lead;
    try {
      const row: Partial<LeadRow> = {
        id: lead.id,
        full_name: lead.fullName,
        phone: lead.phone,
        goal: lead.goal,
        inquiry_date: lead.inquiryDate,
        trial_status: lead.trialStatus,
        next_follow_up_date: lead.nextFollowUpDate,
        notes: lead.notes || null
      };

      const { data, error } = await supabase
        .from('leads')
        .insert([row])
        .select()
        .single();
      if (error) throw error;
      return rowToLead(data as unknown as LeadRow);
    } catch (error) {
      console.error('Database insert error (lead):', error);
      return lead;
    }
  },

  async update(id: string, updates: Partial<LeadItem>): Promise<LeadItem | null> {
    if (!supabase) return null;
    try {
      const rowUpdates: Record<string, unknown> = {};
      if (updates.fullName !== undefined) rowUpdates.full_name = updates.fullName;
      if (updates.phone !== undefined) rowUpdates.phone = updates.phone;
      if (updates.goal !== undefined) rowUpdates.goal = updates.goal;
      if (updates.inquiryDate !== undefined) rowUpdates.inquiry_date = updates.inquiryDate;
      if (updates.trialStatus !== undefined) rowUpdates.trial_status = updates.trialStatus;
      if (updates.nextFollowUpDate !== undefined) rowUpdates.next_follow_up_date = updates.nextFollowUpDate;
      if (updates.notes !== undefined) rowUpdates.notes = updates.notes;

      const { data, error } = await supabase
        .from('leads')
        .update(rowUpdates)
        .eq('id', id)
        .select()
        .maybeSingle();
      if (error) throw error;
      if (!data) return null;
      return rowToLead(data as unknown as LeadRow);
    } catch (error) {
      console.error(`Database update error (lead ${id}):`, error);
      return null;
    }
  }
};
