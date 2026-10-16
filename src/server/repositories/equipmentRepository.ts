import { EquipmentItem, EquipmentTier } from '@/types';
import { supabase } from '../db/supabase';
import { INITIAL_EQUIPMENT } from '@/lib/mockData';

export interface EquipmentRow {
  id: string;
  name: string;
  category?: string | null;
  tier?: string | null;
  status: 'operational' | 'needs_service' | 'out_of_order';
  last_serviced_date: string;
  next_service_due_date: string;
  notes?: string | null;
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

export function rowToEquipment(row: EquipmentRow): EquipmentItem {
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

export const equipmentRepository = {
  async getAll(): Promise<EquipmentItem[]> {
    if (!supabase) return INITIAL_EQUIPMENT;
    try {
      const { data, error } = await supabase
        .from('equipment')
        .select('*')
        .order('name', { ascending: true });
      if (error) throw error;
      if (!data || data.length === 0) return INITIAL_EQUIPMENT;
      return (data as unknown as EquipmentRow[]).map(rowToEquipment);
    } catch (error) {
      console.error('Database fetch error (equipment):', error);
      return INITIAL_EQUIPMENT;
    }
  },

  async create(item: EquipmentItem): Promise<EquipmentItem> {
    if (!supabase) return item;
    try {
      const row: Partial<EquipmentRow> = {
        id: item.id,
        name: item.name,
        category: item.category,
        tier: item.tier,
        status: item.status,
        last_serviced_date: item.lastServicedDate,
        next_service_due_date: item.nextServiceDueDate,
        notes: item.notes || null
      };

      const { data, error } = await supabase
        .from('equipment')
        .insert([row])
        .select()
        .single();
      if (error) throw error;
      return rowToEquipment(data as unknown as EquipmentRow);
    } catch (error) {
      console.error('Database insert error (equipment):', error);
      return item;
    }
  },

  async update(id: string, updates: Partial<EquipmentItem>): Promise<EquipmentItem | null> {
    if (!supabase) {
      const found = INITIAL_EQUIPMENT.find((e) => e.id === id);
      return found ? { ...found, ...updates } : null;
    }
    try {
      const rowUpdates: Record<string, unknown> = {};
      if (updates.name !== undefined) rowUpdates.name = updates.name;
      if (updates.category !== undefined) rowUpdates.category = updates.category;
      if (updates.tier !== undefined) rowUpdates.tier = updates.tier;
      if (updates.status !== undefined) rowUpdates.status = updates.status;
      if (updates.lastServicedDate !== undefined) rowUpdates.last_serviced_date = updates.lastServicedDate;
      if (updates.nextServiceDueDate !== undefined) rowUpdates.next_service_due_date = updates.nextServiceDueDate;
      if (updates.notes !== undefined) rowUpdates.notes = updates.notes;

      const { data, error } = await supabase
        .from('equipment')
        .update(rowUpdates)
        .eq('id', id)
        .select()
        .maybeSingle();
      if (error) throw error;
      if (!data) return null;
      return rowToEquipment(data as unknown as EquipmentRow);
    } catch (error) {
      console.error(`Database update error (equipment ${id}):`, error);
      return null;
    }
  }
};
