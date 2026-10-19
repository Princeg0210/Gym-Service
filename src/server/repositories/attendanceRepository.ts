import { AttendanceRecord } from '@/types';
import { supabase } from '../db/supabase';

export interface AttendanceRow {
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

export function rowToAttendance(row: AttendanceRow): AttendanceRecord {
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

export const attendanceRepository = {
  async getAll(): Promise<AttendanceRecord[]> {
    if (!supabase) return [];
    try {
      const { data: activeMembers } = await supabase
        .from('members')
        .select('id')
        .neq('status', 'deleted');

      if (!activeMembers || activeMembers.length === 0) return [];
      const memberIds = activeMembers.map((m) => m.id);

      const { data, error } = await supabase
        .from('attendance')
        .select('*')
        .in('member_id', memberIds)
        .order('created_at', { ascending: false });
      if (error) throw error;
      if (!data) return [];
      return (data as unknown as AttendanceRow[]).map(rowToAttendance);
    } catch (error) {
      console.error('Database fetch error (attendance):', error);
      return [];
    }
  },

  async create(record: AttendanceRecord): Promise<AttendanceRecord> {
    if (!supabase) return record;
    try {
      const row: Partial<AttendanceRow> = {
        id: record.id,
        member_id: record.memberId,
        member_name: record.memberName,
        phone: record.phone,
        check_in_time: record.checkInTime,
        check_in_method: record.checkInMethod,
        plan_status: record.planStatus,
        pending_due_inr: record.pendingDueInr
      };

      const { data, error } = await supabase
        .from('attendance')
        .insert([row])
        .select()
        .single();
      if (error) throw error;
      return rowToAttendance(data as unknown as AttendanceRow);
    } catch (error) {
      console.error('Database insert error (attendance):', error);
      return record;
    }
  }
};
