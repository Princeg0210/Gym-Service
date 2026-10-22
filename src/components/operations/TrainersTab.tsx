'use client';

import React, { useState, useEffect } from 'react';
import { StaffTrainer, Member } from '@/types';
import { AppStorage } from '@/lib/storage';
import {
  Users,
  Award,
  Star,
  Plus,
  Edit2,
  Phone,
  Mail,
  UserCheck,
  Check,
  X,
  Search,
  ShieldCheck,
  Calendar,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MemberAvatar } from './OverviewTab';
import { sounds } from '@/lib/audio';

interface TrainersTabProps {
  members: Member[];
  initialTrainers?: StaffTrainer[];
}

export function TrainersTab({ members, initialTrainers }: TrainersTabProps) {
  // ponytail: sync trainer roster with AppStorage
  const [trainers, setTrainers] = useState<StaffTrainer[]>(() => {
    if (initialTrainers && initialTrainers.length > 0) return initialTrainers;
    return AppStorage.getTrainers();
  });

  useEffect(() => {
    AppStorage.saveTrainers(trainers);
  }, [trainers]);

  // Modal states
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [editingTrainer, setEditingTrainer] = useState<StaffTrainer | null>(null);

  // Form fields
  const [formName, setFormName] = useState('');
  const [formRole, setFormRole] = useState('Personal Strength Coach');
  const [formSpec, setFormSpec] = useState('');
  const [formExp, setFormExp] = useState('3 Years Exp.');
  const [formPhone, setFormPhone] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formStatus, setFormStatus] = useState<'active' | 'on_leave'>('active');

  // Client Assignment Drawer/Modal
  const [rosterTrainer, setRosterTrainer] = useState<StaffTrainer | null>(null);
  const [memberSearchQuery, setMemberSearchQuery] = useState('');

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Open modal to Add
  const handleOpenAdd = () => {
    setEditingTrainer(null);
    setFormName('');
    setFormRole('Personal Strength Coach');
    setFormSpec('');
    setFormExp('3 Years Exp.');
    setFormPhone('');
    setFormEmail('');
    setFormStatus('active');
    setIsAddEditOpen(true);
  };

  // Open modal to Edit
  const handleOpenEdit = (t: StaffTrainer) => {
    setEditingTrainer(t);
    setFormName(t.name);
    setFormRole(t.role);
    setFormSpec(t.spec);
    setFormExp(t.exp);
    setFormPhone(t.phone);
    setFormEmail(t.email || '');
    setFormStatus(t.status);
    setIsAddEditOpen(true);
  };

  // Save trainer (Add or Edit)
  const handleSaveTrainer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    if (editingTrainer) {
      const updated = trainers.map((t) =>
        t.id === editingTrainer.id
          ? {
              ...t,
              name: formName.trim(),
              role: formRole.trim(),
              spec: formSpec.trim() || 'General Fitness',
              exp: formExp.trim(),
              phone: formPhone.trim() || t.phone,
              email: formEmail.trim() || t.email,
              status: formStatus
            }
          : t
      );
      setTrainers(updated);
      showToast(`Updated coach details for ${formName}`);
    } else {
      const newTrainer: StaffTrainer = {
        id: `tr-${Date.now()}`,
        name: formName.trim(),
        role: formRole.trim(),
        spec: formSpec.trim() || 'General Fitness',
        exp: formExp.trim(),
        rating: '5.0',
        phone: formPhone.trim() || '9876543210',
        email: formEmail.trim() || `${formName.toLowerCase().replace(/\s+/g, '')}@gympro.in`,
        status: formStatus,
        assignedMemberIds: []
      };
      setTrainers([...trainers, newTrainer]);
      showToast(`Added new trainer: ${newTrainer.name}`);
    }

    sounds.playSuccess();
    setIsAddEditOpen(false);
  };

  // Toggle member assignment for a trainer
  const handleToggleMemberAssignment = (memberId: string) => {
    if (!rosterTrainer) return;

    const isAssigned = rosterTrainer.assignedMemberIds.includes(memberId);
    const updatedMemberIds = isAssigned
      ? rosterTrainer.assignedMemberIds.filter((id) => id !== memberId)
      : [...rosterTrainer.assignedMemberIds, memberId];

    const updatedTrainer = { ...rosterTrainer, assignedMemberIds: updatedMemberIds };

    setTrainers(trainers.map((t) => (t.id === rosterTrainer.id ? updatedTrainer : t)));
    setRosterTrainer(updatedTrainer);
    sounds.playClick();
    showToast(isAssigned ? 'Member unassigned from coach' : 'Member assigned to coach roster');
  };

  // Filtered members for assignment search
  const filteredMembers = members.filter((m) => {
    const q = memberSearchQuery.toLowerCase();
    return m.fullName.toLowerCase().includes(q) || m.phone.includes(q) || m.planName.toLowerCase().includes(q);
  });

  const totalAssignedClients = trainers.reduce((acc, t) => acc + t.assignedMemberIds.length, 0);

  return (
    <div className="space-y-6">
      {/* Toast Notice */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2 rounded-xl apple-glass px-4 py-3 text-xs font-bold text-white shadow-2xl border-white/10">
          <Sparkles className="h-4 w-4 text-[#ccff00]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          1. HEADER & ACTION
      ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/[0.08] pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl sm:text-2xl font-black text-white apple-headline tracking-[-0.02em]">
              Staff & Personal Trainers
            </h2>
            <Badge variant="volt" className="font-bold py-0.5 px-2">
              {trainers.length} Coaches
            </Badge>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Manage your coaching roster, specialties, and assign members to dedicated personal trainers.
          </p>
        </div>

        <Button
          onClick={handleOpenAdd}
          variant="volt"
          size="sm"
          className="apple-press self-start sm:self-auto font-black"
        >
          <Plus className="h-4 w-4 mr-1" />
          <span>Add Trainer</span>
        </Button>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. METRICS SUMMARY RIBBON
      ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-white/[0.08] apple-glass p-4.5 shadow-md">
          <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Total Coaches</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">{trainers.length}</span>
            <span className="text-xs text-emerald-400 font-semibold">Active Roster</span>
          </div>
        </div>

        <div className="rounded-2xl border border-[#ccff00]/30 apple-glass p-4.5 shadow-md">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#ccff00]">Assigned Clients</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#ccff00]">{totalAssignedClients}</span>
            <span className="text-xs text-zinc-400 font-semibold">Across Lifters</span>
          </div>
        </div>

        <div className="rounded-2xl border border-white/[0.08] apple-glass p-4.5 shadow-md">
          <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Average Rating</span>
          <div className="mt-1 flex items-baseline gap-1.5">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <span className="text-2xl font-black text-white">4.95</span>
            <span className="text-xs text-zinc-400">/ 5.0</span>
          </div>
        </div>

        <div className="rounded-2xl border border-white/[0.08] apple-glass p-4.5 shadow-md">
          <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Active Duty</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-400">
              {trainers.filter((t) => t.status === 'active').length}
            </span>
            <span className="text-xs text-zinc-400">On Floor</span>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. TRAINER ROSTER CARDS
      ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trainers.map((trainer) => {
          const assignedCount = trainer.assignedMemberIds.length;

          return (
            <div
              key={trainer.id}
              className="rounded-2xl border border-white/[0.08] apple-glass-card p-5 space-y-4 shadow-xl flex flex-col justify-between"
            >
              <div>
                {/* Header: Avatar, Name, Status */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <MemberAvatar name={trainer.name} className="w-12 h-12" />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-black text-white apple-headline tracking-[-0.02em]">
                          {trainer.name}
                        </h3>
                      </div>
                      <p className="text-xs font-bold text-[#ccff00]">{trainer.role}</p>
                      <p className="text-[11px] text-zinc-400">{trainer.exp}</p>
                    </div>
                  </div>

                  <Badge
                    variant={trainer.status === 'active' ? 'success' : 'secondary'}
                    className="text-[10px] uppercase font-bold py-0.5 px-2"
                  >
                    {trainer.status === 'active' ? 'Active' : 'On Leave'}
                  </Badge>
                </div>

                {/* Specialty Pill */}
                <div className="mt-4 rounded-xl border border-white/[0.06] bg-black/30 p-2.5 text-xs text-zinc-300">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block mb-0.5">
                    Focus & Specialty
                  </span>
                  <span className="font-semibold text-white">{trainer.spec}</span>
                </div>

                {/* Contact & Rating Info */}
                <div className="mt-3 space-y-1.5 text-xs text-zinc-400">
                  <div className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 text-zinc-500" />
                    <span className="font-mono">+91 {trainer.phone}</span>
                  </div>
                  {trainer.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-3.5 w-3.5 text-zinc-500" />
                      <span className="truncate">{trainer.email}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 pt-1 text-zinc-300">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    <span className="font-bold text-white">{trainer.rating} Rating</span>
                    <span className="text-zinc-500">•</span>
                    <span className="font-mono text-[#ccff00] font-bold">{assignedCount} Members Assigned</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-white/[0.08] flex items-center gap-2">
                <Button
                  onClick={() => setRosterTrainer(trainer)}
                  variant="secondary"
                  size="sm"
                  className="w-full text-xs font-bold apple-press"
                >
                  <UserCheck className="h-3.5 w-3.5 mr-1.5 text-[#ccff00]" />
                  <span>View Clients ({assignedCount})</span>
                </Button>

                <Button
                  onClick={() => handleOpenEdit(trainer)}
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 apple-press text-zinc-400 hover:text-white"
                  title="Edit Trainer"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ─────────────────────────────────────────────────────────────
          4. ASSIGNED CLIENTS MODAL / DRAWER
      ───────────────────────────────────────────────────────────── */}
      {rosterTrainer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-[20px] backdrop-saturate-[180%]">
          <div className="relative w-full max-w-2xl rounded-2xl apple-glass-card p-6 shadow-2xl border border-white/10 text-white max-h-[88vh] flex flex-col">
            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b border-white/[0.08]">
              <div className="flex items-center gap-3">
                <MemberAvatar name={rosterTrainer.name} className="w-10 h-10" />
                <div>
                  <h3 className="text-base font-black text-white apple-headline tracking-[-0.02em]">
                    {rosterTrainer.name}&apos;s Client Roster
                  </h3>
                  <p className="text-xs text-zinc-400">
                    {rosterTrainer.role} • {rosterTrainer.assignedMemberIds.length} Coached Members
                  </p>
                </div>
              </div>
              <button
                onClick={() => setRosterTrainer(null)}
                className="rounded-lg p-1.5 text-zinc-400 hover:bg-white/10 hover:text-white apple-press"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Search Input */}
            <div className="my-4 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <input
                type="text"
                placeholder="Search member by name, phone or plan..."
                value={memberSearchQuery}
                onChange={(e) => setMemberSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-black/40 pl-9 pr-4 py-2 text-xs text-white placeholder-zinc-500 outline-none focus:border-[#ccff00]"
              />
            </div>

            {/* Member List */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {filteredMembers.length === 0 ? (
                <div className="py-8 text-center text-xs text-zinc-400">
                  No gym members found matching &quot;{memberSearchQuery}&quot;.
                </div>
              ) : (
                filteredMembers.map((member) => {
                  const isAssigned = rosterTrainer.assignedMemberIds.includes(member.id);

                  return (
                    <div
                      key={member.id}
                      className={`flex items-center justify-between rounded-xl border p-3 transition-colors ${
                        isAssigned
                          ? 'border-[#ccff00]/40 bg-[#ccff00]/5'
                          : 'border-white/[0.06] bg-black/20 hover:bg-white/[0.04]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <MemberAvatar name={member.fullName} className="w-8 h-8" />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-white">{member.fullName}</span>
                            <span className="text-[10px] font-mono text-zinc-400">+91 {member.phone}</span>
                          </div>
                          <p className="text-[11px] text-zinc-400">
                            {member.planName} • Goal: <span className="text-zinc-300 font-semibold">{member.fitnessGoal}</span>
                          </p>
                        </div>
                      </div>

                      <Button
                        onClick={() => handleToggleMemberAssignment(member.id)}
                        variant={isAssigned ? 'destructive' : 'volt'}
                        size="sm"
                        className="text-xs font-bold apple-press h-8 px-3"
                      >
                        {isAssigned ? (
                          <>
                            <X className="h-3.5 w-3.5 mr-1" />
                            <span>Unassign</span>
                          </>
                        ) : (
                          <>
                            <Plus className="h-3.5 w-3.5 mr-1" />
                            <span>Assign</span>
                          </>
                        )}
                      </Button>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer Summary */}
            <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between text-xs text-zinc-400">
              <span>{rosterTrainer.assignedMemberIds.length} members currently assigned</span>
              <Button
                onClick={() => setRosterTrainer(null)}
                variant="outline"
                size="sm"
                className="apple-press text-xs font-bold"
              >
                Done
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          5. ADD / EDIT TRAINER MODAL
      ───────────────────────────────────────────────────────────── */}
      {isAddEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-[20px] backdrop-saturate-[180%]">
          <div className="relative w-full max-w-md rounded-2xl apple-glass-card p-6 shadow-2xl border border-white/10 text-white">
            <button
              onClick={() => setIsAddEditOpen(false)}
              className="absolute right-4 top-4 rounded-lg p-1.5 text-zinc-400 hover:bg-white/10 hover:text-white apple-press"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-base font-black text-white apple-headline tracking-[-0.02em] mb-1">
              {editingTrainer ? 'Edit Trainer Profile' : 'Add New Personal Trainer'}
            </h3>
            <p className="text-xs text-zinc-400 mb-4">
              Enter coach credentials, certifications, and specialty.
            </p>

            <form onSubmit={handleSaveTrainer} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-zinc-400 font-bold mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Karan Malhotra"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-white outline-none focus:border-[#ccff00]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 font-bold mb-1">Role / Designation</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Senior Strength Coach"
                    value={formRole}
                    onChange={(e) => setFormRole(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-white outline-none focus:border-[#ccff00]"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 font-bold mb-1">Experience</label>
                  <input
                    type="text"
                    placeholder="e.g. 5 Years Exp."
                    value={formExp}
                    onChange={(e) => setFormExp(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-white outline-none focus:border-[#ccff00]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 font-bold mb-1">Specialization</label>
                <input
                  type="text"
                  placeholder="e.g. Powerlifting, Hypertrophy, Diet Plans"
                  value={formSpec}
                  onChange={(e) => setFormSpec(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-white outline-none focus:border-[#ccff00]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 font-bold mb-1">Mobile Number</label>
                  <input
                    type="tel"
                    placeholder="9876543210"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 font-mono text-white outline-none focus:border-[#ccff00]"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 font-bold mb-1">Status</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as 'active' | 'on_leave')}
                    className="w-full rounded-xl border border-white/10 bg-[#0c1017] px-3 py-2 text-white outline-none focus:border-[#ccff00]"
                  >
                    <option value="active">Active On Duty</option>
                    <option value="on_leave">On Leave</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 font-bold mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="coach@ironpulse.in"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-white outline-none focus:border-[#ccff00]"
                />
              </div>

              <div className="pt-3 border-t border-white/[0.08] flex items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAddEditOpen(false)}
                  className="apple-press text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="volt"
                  size="sm"
                  className="apple-press font-black text-xs"
                >
                  {editingTrainer ? 'Save Changes' : 'Add Coach'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
