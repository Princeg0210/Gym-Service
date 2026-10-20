import { PaymentRecord } from '@/types';
import { supabase } from '../db/supabase';

export interface PaymentRow {
  id: string;
  member_id: string;
  member_name: string;
  amount_inr: number | string;
  payment_mode?: string | null;
  transaction_ref?: string | null;
  timestamp: string;
  created_at?: string;
}

export function rowToPayment(row: PaymentRow): PaymentRecord {
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

export const paymentRepository = {
  async getAll(): Promise<PaymentRecord[]> {
    if (!supabase) return [];
    try {
      const { data: allMembers } = await supabase
        .from('members')
        .select('id, status');

      if (!allMembers || allMembers.length === 0) return [];
      const memberIds = allMembers.filter((m) => m.status !== 'deleted').map((m) => m.id);
      if (memberIds.length === 0) return [];

      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .in('member_id', memberIds)
        .order('created_at', { ascending: false });
      if (error) throw error;
      if (!data) return [];
      return (data as unknown as PaymentRow[]).map(rowToPayment);
    } catch (error) {
      console.error('Database fetch error (payments):', error);
      return [];
    }
  },

  async create(record: PaymentRecord): Promise<PaymentRecord> {
    if (!supabase) return record;
    try {
      const row: Partial<PaymentRow> = {
        id: record.id,
        member_id: record.memberId,
        member_name: record.memberName,
        amount_inr: record.amountInr,
        payment_mode: record.paymentMode,
        transaction_ref: record.transactionRef,
        timestamp: record.timestamp
      };

      const { data, error } = await supabase
        .from('payments')
        .insert([row])
        .select()
        .single();
      if (error) throw error;
      return rowToPayment(data as unknown as PaymentRow);
    } catch (error) {
      console.error('Database insert error (payments):', error);
      return record;
    }
  }
};
