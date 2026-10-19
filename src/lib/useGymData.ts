'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Member,
  AttendanceRecord,
  PaymentRecord,
  EquipmentItem,
  LeadItem,
  WorkoutRoutine,
  Exercise
} from '@/types';
import { AppStorage } from '@/lib/storage';

export function useGymData() {
  const [isLoaded] = useState(true);
  const [members, setMembers] = useState<Member[]>(() => AppStorage.getMembers());
  const [attendanceLogs, setAttendanceLogs] = useState<AttendanceRecord[]>(() => AppStorage.getAttendance());
  const [payments, setPayments] = useState<PaymentRecord[]>(() => AppStorage.getPayments());
  const [equipmentList, setEquipmentList] = useState<EquipmentItem[]>(() => AppStorage.getEquipment());
  const [leads, setLeads] = useState<LeadItem[]>(() => AppStorage.getLeads());
  const [routines, setRoutines] = useState<WorkoutRoutine[]>(() => AppStorage.getRoutines());
  const [exercises] = useState<Exercise[]>(() => AppStorage.getExercises());
  const [checkedInBannerMember, setCheckedInBannerMember] = useState<Member | null>(null);

  // Background sync with database backend
  useEffect(() => {
    async function syncFromBackend() {
      try {
        const [mRes, aRes, pRes, eRes, lRes] = await Promise.all([
          fetch('/api/members').then((r) => r.json()).catch(() => null),
          fetch('/api/attendance').then((r) => r.json()).catch(() => null),
          fetch('/api/payments').then((r) => r.json()).catch(() => null),
          fetch('/api/equipment').then((r) => r.json()).catch(() => null),
          fetch('/api/leads').then((r) => r.json()).catch(() => null)
        ]);

        if (mRes?.success && Array.isArray(mRes.data)) {
          const activeMembers = mRes.data as Member[];
          const memberIdSet = new Set(activeMembers.map((m) => m.id));

          setMembers(activeMembers);
          AppStorage.saveMembers(activeMembers);

          if (aRes?.success && Array.isArray(aRes.data)) {
            const cleanAttendance = (aRes.data as AttendanceRecord[]).filter((a) =>
              memberIdSet.has(a.memberId)
            );
            setAttendanceLogs(cleanAttendance);
            AppStorage.saveAttendance(cleanAttendance);
          } else {
            setAttendanceLogs((prev) => {
              const clean = prev.filter((a) => memberIdSet.has(a.memberId));
              AppStorage.saveAttendance(clean);
              return clean;
            });
          }

          if (pRes?.success && Array.isArray(pRes.data)) {
            const cleanPayments = (pRes.data as PaymentRecord[]).filter((p) =>
              memberIdSet.has(p.memberId)
            );
            setPayments(cleanPayments);
            AppStorage.savePayments(cleanPayments);
          } else {
            setPayments((prev) => {
              const clean = prev.filter((p) => memberIdSet.has(p.memberId));
              AppStorage.savePayments(clean);
              return clean;
            });
          }
        } else {
          if (aRes?.success && Array.isArray(aRes.data)) {
            setAttendanceLogs(aRes.data);
            AppStorage.saveAttendance(aRes.data);
          }
          if (pRes?.success && Array.isArray(pRes.data)) {
            setPayments(pRes.data);
            AppStorage.savePayments(pRes.data);
          }
        }

        if (eRes?.success && Array.isArray(eRes.data)) {
          setEquipmentList(eRes.data);
          AppStorage.saveEquipment(eRes.data);
        }
        if (lRes?.success && Array.isArray(lRes.data)) {
          setLeads(lRes.data);
          AppStorage.saveLeads(lRes.data);
        }
      } catch (err) {
        console.warn('Backend sync failed, continuing with cached storage:', err);
      }
    }

    syncFromBackend();
  }, []);

  const handleCheckInMember = useCallback(async (member: Member, method: 'phone_search' | 'qr_scan') => {
    const newLog: AttendanceRecord = {
      id: `att-${Date.now()}`,
      memberId: member.id,
      memberName: member.fullName,
      phone: member.phone,
      checkInTime: new Date().toISOString(),
      checkInMethod: method,
      planStatus: member.status,
      pendingDueInr: member.pendingDueInr
    };

    setAttendanceLogs((prev) => {
      const updated = [newLog, ...prev];
      AppStorage.saveAttendance(updated);
      return updated;
    });
    setCheckedInBannerMember(member);

    try {
      await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLog)
      });
    } catch (e) {
      console.error('Failed to persist attendance to backend:', e);
    }
  }, []);

  const handlePaymentSuccess = useCallback(async (newPayment: PaymentRecord, updatedMember: Member) => {
    setPayments((prev) => {
      const updated = [newPayment, ...prev];
      AppStorage.savePayments(updated);
      return updated;
    });

    setMembers((prev) => {
      const updated = prev.map((m) => (m.id === updatedMember.id ? updatedMember : m));
      AppStorage.saveMembers(updated);
      return updated;
    });

    setCheckedInBannerMember((prev) => (prev?.id === updatedMember.id ? updatedMember : prev));

    try {
      await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPayment)
      });
    } catch (e) {
      console.error('Failed to persist payment to backend:', e);
    }
  }, []);

  const handleMemberCreated = useCallback(async (newMember: Member, initialPayment?: PaymentRecord) => {
    setMembers((prev) => {
      const updated = [newMember, ...prev];
      AppStorage.saveMembers(updated);
      return updated;
    });

    if (initialPayment) {
      setPayments((prev) => {
        const updated = [initialPayment, ...prev];
        AppStorage.savePayments(updated);
        return updated;
      });
    }

    setCheckedInBannerMember(newMember);

    try {
      await fetch('/api/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMember)
      });

      if (initialPayment) {
        await fetch('/api/payments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(initialPayment)
        });
      }
    } catch (e) {
      console.error('Failed to persist member to backend:', e);
    }
  }, []);

  const handleToggleEquipmentStatus = useCallback(async (id: string, newStatus: EquipmentItem['status']) => {
    setEquipmentList((prev) => {
      const updated = prev.map((e) => (e.id === id ? { ...e, status: newStatus } : e));
      AppStorage.saveEquipment(updated);
      return updated;
    });

    try {
      await fetch('/api/equipment', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus })
      });
    } catch (e) {
      console.error('Failed to persist equipment to backend:', e);
    }
  }, []);

  const handleUpdateRoutines = useCallback((newRoutines: WorkoutRoutine[]) => {
    setRoutines(newRoutines);
    AppStorage.saveRoutines(newRoutines);
  }, []);

  const handleResetData = useCallback(() => {
    if (confirm('Clear local storage and synchronize fresh data from database?')) {
      AppStorage.resetAll();
      setMembers([]);
      setAttendanceLogs([]);
      setPayments([]);
      setEquipmentList(AppStorage.getEquipment());
      setLeads([]);
      setRoutines(AppStorage.getRoutines());
      setCheckedInBannerMember(null);
    }
  }, []);

  return {
    isLoaded,
    members,
    attendanceLogs,
    payments,
    equipmentList,
    leads,
    routines,
    exercises,
    checkedInBannerMember,
    setCheckedInBannerMember,
    handleCheckInMember,
    handlePaymentSuccess,
    handleMemberCreated,
    handleToggleEquipmentStatus,
    handleUpdateRoutines,
    handleResetData
  };
}
