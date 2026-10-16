// ─────────────────────────────────────────────────────────────
// GymPRO Data Access Facade
// Re-exports from src/server/repositories for backward-compatibility
// ─────────────────────────────────────────────────────────────

import { Member, AttendanceRecord, PaymentRecord, EquipmentItem, LeadItem } from '@/types';
import { supabase } from '@/server/db/supabase';
import { memberRepository } from '@/server/repositories/memberRepository';
import { attendanceRepository } from '@/server/repositories/attendanceRepository';
import { paymentRepository } from '@/server/repositories/paymentRepository';
import { equipmentRepository } from '@/server/repositories/equipmentRepository';
import { leadRepository } from '@/server/repositories/leadRepository';

export { supabase };

// Members
export async function getMembersFromDb(): Promise<Member[]> {
  return memberRepository.getAll();
}

export async function getMemberByIdFromDb(id: string): Promise<Member | null> {
  return memberRepository.getById(id);
}

export async function createMemberInDb(member: Member): Promise<Member> {
  return memberRepository.create(member);
}

export async function updateMemberInDb(id: string, updates: Partial<Member>): Promise<Member | null> {
  return memberRepository.update(id, updates);
}

export async function deleteMemberInDb(id: string): Promise<boolean> {
  return memberRepository.delete(id);
}

// Attendance
export async function getAttendanceFromDb(): Promise<AttendanceRecord[]> {
  return attendanceRepository.getAll();
}

export async function logAttendanceInDb(rec: AttendanceRecord): Promise<AttendanceRecord> {
  return attendanceRepository.create(rec);
}

// Payments
export async function getPaymentsFromDb(): Promise<PaymentRecord[]> {
  return paymentRepository.getAll();
}

export async function recordPaymentInDb(pay: PaymentRecord): Promise<PaymentRecord> {
  return paymentRepository.create(pay);
}

// Equipment
export async function getEquipmentFromDb(): Promise<EquipmentItem[]> {
  return equipmentRepository.getAll();
}

export async function updateEquipmentStatusInDb(id: string, status: EquipmentItem['status']): Promise<EquipmentItem | null> {
  return equipmentRepository.update(id, { status });
}

// Leads
export async function getLeadsFromDb(): Promise<LeadItem[]> {
  return leadRepository.getAll();
}

export async function createLeadInDb(lead: LeadItem): Promise<LeadItem> {
  return leadRepository.create(lead);
}

export async function updateLeadInDb(id: string, updates: Partial<LeadItem>): Promise<LeadItem | null> {
  return leadRepository.update(id, updates);
}
