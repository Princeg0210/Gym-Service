export type EquipmentTier = 'tier_a' | 'tier_b' | 'tier_c';

export type FitnessGoal = 'muscle_gain' | 'fat_loss' | 'strength' | 'general_fitness';

export type DietaryPreference = 'vegetarian' | 'eggetarian' | 'non_veg';

export type MemberStatus = 'active' | 'expired' | 'defaulter' | 'trial';

export interface MembershipPlan {
  id: string;
  name: string;
  durationMonths: number;
  feeInr: number;
  features: string[];
}

export interface Member {
  id: string;
  gymId?: string;
  fullName: string;
  phone: string;
  gender: 'male' | 'female' | 'other';
  age: number;
  planId: string;
  planName: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  totalFeeInr: number;
  paidAmountInr: number;
  pendingDueInr: number;
  status: MemberStatus;
  emergencyContact?: string;
  fitnessGoal: FitnessGoal;
  dietaryPreference: DietaryPreference;
  avatarSeed: string;
  assignedTrainerId?: string;
  assignedTrainerName?: string;
}

export interface StaffTrainer {
  id: string;
  name: string;
  role: string;
  spec: string;
  exp: string;
  rating: string;
  phone: string;
  email?: string;
  status: 'active' | 'on_leave';
  assignedMemberIds: string[];
}

export interface AttendanceRecord {
  id: string;
  gymId?: string;
  memberId: string;
  memberName: string;
  phone: string;
  checkInTime: string; // ISO string
  checkInMethod: 'phone_search' | 'qr_scan';
  planStatus: MemberStatus;
  pendingDueInr: number;
}

export interface PaymentRecord {
  id: string;
  gymId?: string;
  memberId: string;
  memberName: string;
  amountInr: number;
  paymentMode: 'cash' | 'upi' | 'card' | 'netbanking' | 'other';
  transactionRef: string;
  timestamp: string;
}

export interface EquipmentItem {
  id: string;
  gymId?: string;
  name: string;
  category: 'strength_machine' | 'free_weights' | 'cardio' | 'cable_station';
  tier: EquipmentTier;
  status: 'operational' | 'needs_service' | 'out_of_order';
  lastServicedDate: string;
  nextServiceDueDate: string;
  notes?: string;
}

export interface LeadItem {
  id: string;
  gymId?: string;
  fullName: string;
  phone: string;
  goal: FitnessGoal;
  inquiryDate: string;
  trialStatus: 'trial_booked' | 'trial_completed' | 'follow_up' | 'converted';
  nextFollowUpDate: string;
  notes: string;
}

export interface Exercise {
  id: string;
  name: string;
  targetMuscle: 'chest' | 'back' | 'quads' | 'hamstrings' | 'deltoids' | 'biceps' | 'triceps' | 'core';
  movementPattern: 'horizontal_push' | 'vertical_pull' | 'horizontal_pull' | 'squat' | 'hinge' | 'vertical_push' | 'isolation';
  equipmentTier: EquipmentTier;
  equipmentRequired: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  cues: string[];
  alternativeExerciseId?: string;
}

export interface WorkoutSet {
  setNumber: number;
  weightKg: number;
  targetReps: number;
  completedReps?: number;
  completed: boolean;
  rpe?: number;
}

export interface WorkoutExerciseItem {
  exerciseId: string;
  exercise: Exercise;
  sets: WorkoutSet[];
  restSeconds: number;
}

export interface WorkoutRoutine {
  id: string;
  title: string;
  splitType: 'full_body' | 'push' | 'pull' | 'legs' | 'upper' | 'lower';
  goal: FitnessGoal;
  experienceLevel: 'beginner' | 'intermediate' | 'advanced';
  exercises: WorkoutExerciseItem[];
  isAiGenerated?: boolean;
}

export interface DietMeal {
  mealName: string;
  timeOfDay: string;
  items: string[];
  approxProteinGrams: number;
  approxCalories: number;
}

export interface DietPlan {
  id: string;
  title: string;
  preference: DietaryPreference;
  dailyCalories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatsGrams: number;
  meals: DietMeal[];
  tips: string[];
}

export interface ExpiringAlertItem {
  member: Member;
  daysRemaining: number;
  urgency: 'expired' | 'today' | 'urgent' | 'upcoming';
  suggestedAction: string;
  whatsappUrl: string;
  lastSentAt?: string;
}

export interface FinancialAnalytics {
  totalMembers: number;
  activeMembers: number;
  expiredMembers: number;
  defaulterMembers: number;
  retentionRate: number;
  churnRate: number;
  totalRevenueInr: number;
  totalPendingDuesInr: number;
  projectedRenewalInr: number;
  monthlyRunRateInr: number;
  paymentMethods: {
    cash: number;
    upi: number;
    card: number;
    other: number;
  };
  duesRecoveryRate: number;
}

// ─────────────────────────────────────────────────────────────
// CMS & Multi-Tenant Gym Landing Page Interfaces
// ─────────────────────────────────────────────────────────────

export interface GymProgram {
  id: string;
  title: string;
  category: 'strength' | 'conditioning' | 'personal' | 'mobility';
  desc: string;
  intensity: string;
  duration: string;
}

export interface GymFeature {
  title: string;
  desc: string;
  icon?: string;
}

export interface GymTrainer {
  name: string;
  role: string;
  spec: string;
  exp: string;
  rating: string;
}

export interface GymTransformation {
  name: string;
  role: string;
  achievement: string;
  quote: string;
  startWeight?: string;
  endWeight?: string;
  metricLabel?: string;
}

export interface GymCmsPlan extends MembershipPlan {
  isPopular?: boolean;
  badge?: string;
}

export interface GymProfile {
  id: string;
  slug: string;
  gymName: string;
  tagline: string;
  heroHeadline: string;
  heroHighlight: string;
  heroSubtitle: string;
  heroImageUrl: string;
  logoUrl?: string;
  primaryColor: string; // e.g. '#ccff00'
  accentColor: string;  // e.g. '#b8e600'
  secondaryColor: string; // e.g. '#121724'
  phone: string;
  email: string;
  whatsappNumber: string;
  upiVpa: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  operatingHours: string;
  features: GymFeature[];
  programs: GymProgram[];
  membershipPlans: GymCmsPlan[];
  trainers: GymTrainer[];
  transformations: GymTransformation[];
  isPublished: boolean;
  createdAt?: string;
  updatedAt?: string;
}

