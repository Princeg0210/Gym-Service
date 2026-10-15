'use client';

import React, { useState } from 'react';
import { Member, FitnessGoal, DietaryPreference, PaymentRecord } from '@/types';
import { X, UserPlus, CheckCircle, MessageSquare } from 'lucide-react';
import { generateWelcomeWhatsAppUrl } from '@/lib/whatsapp';

interface AddMemberModalProps {
  onClose: () => void;
  onMemberCreated: (member: Member, initialPayment?: PaymentRecord) => void;
}

const PLANS = [
  { id: 'plan-1m', name: '1-Month General', months: 1, fee: 1800 },
  { id: 'plan-3m', name: '3-Month Standard', months: 3, fee: 4500 },
  { id: 'plan-6m', name: '6-Month Fitness', months: 6, fee: 8000 },
  { id: 'plan-12m', name: '1-Year VIP Pass', months: 12, fee: 14000 }
];

export function AddMemberModal({ onClose, onMemberCreated }: AddMemberModalProps) {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('male');
  const [age, setAge] = useState<number>(25);
  const [selectedPlanId, setSelectedPlanId] = useState<string>('plan-3m');
  const [fitnessGoal, setFitnessGoal] = useState<FitnessGoal>('muscle_gain');
  const [dietaryPref, setDietaryPref] = useState<DietaryPreference>('vegetarian');
  const [amountPaid, setAmountPaid] = useState<number>(4500);
  const [paymentMode, setPaymentMode] = useState<'cash' | 'upi'>('upi');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [newlyCreated, setNewlyCreated] = useState<Member | null>(null);

  const currentPlan = PLANS.find((p) => p.id === selectedPlanId) || PLANS[1];

  const handlePlanChange = (planId: string) => {
    setSelectedPlanId(planId);
    const plan = PLANS.find((p) => p.id === planId);
    if (plan) {
      setAmountPaid(plan.fee);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || phone.length < 10) return;

    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(startDate.getMonth() + currentPlan.months);

    const pendingDue = Math.max(0, currentPlan.fee - amountPaid);
    const memberId = `mem-${Date.now().toString().slice(-4)}`;

    const newMember: Member = {
      id: memberId,
      fullName: fullName.trim(),
      phone: phone.trim().slice(-10),
      gender,
      age: Number(age),
      planId: currentPlan.id,
      planName: currentPlan.name,
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      totalFeeInr: currentPlan.fee,
      paidAmountInr: amountPaid,
      pendingDueInr: pendingDue,
      status: pendingDue > 0 && amountPaid === 0 ? 'defaulter' : 'active',
      emergencyContact: emergencyPhone || undefined,
      fitnessGoal,
      dietaryPreference: dietaryPref,
      avatarSeed: fullName.trim()
    };

    let initialPayment: PaymentRecord | undefined;
    if (amountPaid > 0) {
      initialPayment = {
        id: `pay-${Date.now()}`,
        memberId: newMember.id,
        memberName: newMember.fullName,
        amountInr: amountPaid,
        paymentMode,
        transactionRef: `${paymentMode.toUpperCase()}-INIT-${Date.now().toString().slice(-4)}`,
        timestamp: new Date().toISOString()
      };
    }

    onMemberCreated(newMember, initialPayment);
    setNewlyCreated(newMember);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs overflow-y-auto">
      <div className="relative my-8 w-full max-w-lg rounded-xl border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-md p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800"
        >
          <X className="h-5 w-5" />
        </button>

        {!newlyCreated ? (
          <>
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900">
                <UserPlus className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-zinc-950 dark:text-zinc-50">
                  Register New Gym Member
                </h2>
                <p className="text-xs text-zinc-600 dark:text-zinc-400">
                  Instant registration with attendance pass and WhatsApp welcome
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              {/* Row 1: Name and Phone */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block font-semibold text-zinc-700 dark:text-zinc-300">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-zinc-900 outline-none focus:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-semibold text-zinc-700 dark:text-zinc-300">
                    Mobile Number (10-digit) *
                  </label>
                  <div className="flex">
                    <span className="flex items-center rounded-l-md border border-r-0 border-zinc-200 bg-zinc-100 px-2.5 font-mono text-zinc-600 dark:border-zinc-700 dark:bg-zinc-800">
                      +91
                    </span>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      pattern="[0-9]{10}"
                      placeholder="9876543210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                      className="w-full rounded-r-md border border-zinc-200 bg-white px-3 py-2 font-mono text-zinc-900 outline-none focus:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
                    />
                  </div>
                </div>
              </div>

              {/* Row 2: Age, Gender, Emergency */}
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="mb-1 block font-semibold text-zinc-700 dark:text-zinc-300">Age</label>
                  <input
                    type="number"
                    min={14}
                    max={80}
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-zinc-900 outline-none focus:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-semibold text-zinc-700 dark:text-zinc-300">Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as 'male' | 'female' | 'other')}
                    className="w-full rounded-md border border-zinc-200 bg-white px-2 py-2 text-zinc-900 outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block font-semibold text-zinc-700 dark:text-zinc-300">
                    Emergency No.
                  </label>
                  <input
                    type="tel"
                    placeholder="Optional"
                    value={emergencyPhone}
                    onChange={(e) => setEmergencyPhone(e.target.value.replace(/\D/g, ''))}
                    className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-zinc-900 outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
                  />
                </div>
              </div>

              {/* Plan Selection */}
              <div>
                <label className="mb-1 block font-semibold text-zinc-700 dark:text-zinc-300">
                  Select Membership Plan
                </label>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {PLANS.map((plan) => (
                    <button
                      key={plan.id}
                      type="button"
                      onClick={() => handlePlanChange(plan.id)}
                      className={`flex flex-col items-center justify-center rounded-lg border p-2 text-center transition-all ${
                        selectedPlanId === plan.id
                          ? 'border-zinc-950 bg-zinc-950 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900'
                          : 'border-zinc-200 bg-zinc-50 text-zinc-800 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-800/80 dark:text-zinc-300'
                      }`}
                    >
                      <span className="font-semibold text-xs">{plan.name}</span>
                      <span className="font-mono text-xs font-bold mt-1">₹{plan.fee.toLocaleString('en-IN')}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Fitness Goal & Diet */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block font-semibold text-zinc-700 dark:text-zinc-300">
                    Fitness Goal
                  </label>
                  <select
                    value={fitnessGoal}
                    onChange={(e) => setFitnessGoal(e.target.value as FitnessGoal)}
                    className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-zinc-900 outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
                  >
                    <option value="muscle_gain">Muscle Gain (Hypertrophy)</option>
                    <option value="fat_loss">Fat Loss & Weight Management</option>
                    <option value="strength">Strength & Powerlifting</option>
                    <option value="general_fitness">General Health & Mobility</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block font-semibold text-zinc-700 dark:text-zinc-300">
                    Dietary Preference
                  </label>
                  <select
                    value={dietaryPref}
                    onChange={(e) => setDietaryPref(e.target.value as DietaryPreference)}
                    className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-zinc-900 outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
                  >
                    <option value="vegetarian">Pure Vegetarian (Lacto-Veg)</option>
                    <option value="eggetarian">Eggetarian</option>
                    <option value="non_veg">Non-Vegetarian</option>
                  </select>
                </div>
              </div>

              {/* Payment Section */}
              <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-950/60">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1 block font-semibold text-zinc-700 dark:text-zinc-300">
                      Amount Paid Now (₹)
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={currentPlan.fee}
                      value={amountPaid}
                      onChange={(e) => setAmountPaid(Number(e.target.value))}
                      className="w-full rounded-md border border-zinc-200 bg-white px-3 py-1.5 font-mono text-zinc-900 outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block font-semibold text-zinc-700 dark:text-zinc-300">
                      Payment Rail
                    </label>
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        type="button"
                        onClick={() => setPaymentMode('upi')}
                        className={`rounded py-1.5 font-medium transition-all ${
                          paymentMode === 'upi'
                            ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                            : 'bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
                        }`}
                      >
                        UPI
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMode('cash')}
                        className={`rounded py-1.5 font-medium transition-all ${
                          paymentMode === 'cash'
                            ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                            : 'bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
                        }`}
                      >
                        Cash
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-2 flex justify-between border-t border-zinc-200 pt-1.5 text-xs text-zinc-700 dark:border-zinc-800 dark:text-zinc-300">
                  <span>Balance Due:</span>
                  <span className="font-mono font-bold text-red-600 dark:text-red-400">
                    ₹{Math.max(0, currentPlan.fee - amountPaid).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="pt-1">
                <button
                  type="submit"
                  className="w-full rounded-lg bg-zinc-900 py-2.5 text-xs font-semibold text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 transition-colors shadow-sm"
                >
                  Create Member & Activate Pass
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="text-center py-4">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
              <CheckCircle className="h-7 w-7" />
            </div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">Member Registered!</h3>
            <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
              {newlyCreated.fullName} (+91 {newlyCreated.phone}) is now enrolled in{' '}
              <strong>{newlyCreated.planName}</strong>.
            </p>

            <div className="mt-5 space-y-2">
              <a
                href={generateWelcomeWhatsAppUrl(newlyCreated)}
                target="_blank"
                rel="noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#25D366] py-2.5 text-xs font-semibold text-white hover:bg-[#20ba59] transition-colors shadow-sm"
              >
                <MessageSquare className="h-4 w-4" />
                <span>Send WhatsApp Welcome Pass</span>
              </a>

              <button
                onClick={onClose}
                className="w-full rounded-lg border border-zinc-200 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                Done / Back to Roster
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
