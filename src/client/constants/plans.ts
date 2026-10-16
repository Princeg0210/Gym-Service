import { MembershipPlan } from '@/types';

export const MEMBERSHIP_PLANS: MembershipPlan[] = [
  {
    id: 'plan-1m',
    name: 'Monthly Standard',
    durationMonths: 1,
    feeInr: 1500,
    features: ['Access to cardio & free weights', 'Locker access', 'General trainer guidance']
  },
  {
    id: 'plan-3m',
    name: 'Quarterly Strength',
    durationMonths: 3,
    feeInr: 3800,
    features: ['Full gym access', '1 Diet Consultation', 'Free Steam Bath session bi-weekly']
  },
  {
    id: 'plan-6m',
    name: 'Half-Year Elite',
    durationMonths: 6,
    feeInr: 6500,
    features: ['Priority locker', 'Monthly Body Composition Analysis (BCA)', 'WhatsApp workout tracker']
  },
  {
    id: 'plan-1y',
    name: 'Annual VIP Pro',
    durationMonths: 12,
    feeInr: 11000,
    features: ['All-hours access', 'Dedicated trainer allocation', 'Unlimited Guest passes (2/month)']
  }
];

export const STATUS_COLORS = {
  active: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  expired: 'bg-red-500/10 text-red-400 border-red-500/20',
  trial: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  defaulter: 'bg-rose-950/40 text-rose-300 border-rose-500/30'
};
