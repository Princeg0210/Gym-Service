import { Member, Exercise, WorkoutRoutine, DietPlan, EquipmentItem, LeadItem, AttendanceRecord, PaymentRecord } from '@/types';

export const INITIAL_EXERCISES: Exercise[] = [
  // Chest
  {
    id: 'ex-1',
    name: 'Barbell Flat Bench Press',
    targetMuscle: 'chest',
    movementPattern: 'horizontal_push',
    equipmentTier: 'tier_a',
    equipmentRequired: 'Olympic Barbell & Flat Bench',
    difficulty: 'intermediate',
    cues: ['Retract scapula & plant feet firmly', 'Touch lower sternum smoothly', 'Drive straight up without flaring elbows'],
    alternativeExerciseId: 'ex-2'
  },
  {
    id: 'ex-2',
    name: 'Flat Dumbbell Press',
    targetMuscle: 'chest',
    movementPattern: 'horizontal_push',
    equipmentTier: 'tier_a',
    equipmentRequired: 'Dumbbells & Flat Bench',
    difficulty: 'beginner',
    cues: ['Neutral grip at bottom', 'Press slightly inwards at top', 'Deep chest stretch without shoulder hyperextension'],
    alternativeExerciseId: 'ex-1'
  },
  {
    id: 'ex-3',
    name: 'Incline Dumbbell Press (30°)',
    targetMuscle: 'chest',
    movementPattern: 'horizontal_push',
    equipmentTier: 'tier_a',
    equipmentRequired: 'Adjustable Bench & Dumbbells',
    difficulty: 'intermediate',
    cues: ['Bench angle set between 30° to 45°', 'Focus on upper clavicular head contraction', 'Controlled 2-second negative'],
    alternativeExerciseId: 'ex-4'
  },
  {
    id: 'ex-4',
    name: 'Pec Deck Machine Fly',
    targetMuscle: 'chest',
    movementPattern: 'isolation',
    equipmentTier: 'tier_b',
    equipmentRequired: 'Pec Deck Fly Machine',
    difficulty: 'beginner',
    cues: ['Keep chest proud and shoulders back', 'Squeeze pads together for 1-second peak pause', 'Do not let weight stack slam'],
    alternativeExerciseId: 'ex-2'
  },
  // Back
  {
    id: 'ex-5',
    name: 'Lat Pulldown (Wide Grip)',
    targetMuscle: 'back',
    movementPattern: 'vertical_pull',
    equipmentTier: 'tier_a',
    equipmentRequired: 'Cable Lat Pulldown Machine',
    difficulty: 'beginner',
    cues: ['Pull with elbows down and back towards pockets', 'Lean torso back slightly (10-15°)', 'Full stretch at top without shrugging'],
    alternativeExerciseId: 'ex-6'
  },
  {
    id: 'ex-6',
    name: 'Seated Cable Row (Close-Grip V-Bar)',
    targetMuscle: 'back',
    movementPattern: 'horizontal_pull',
    equipmentTier: 'tier_a',
    equipmentRequired: 'Low Cable Row Station',
    difficulty: 'beginner',
    cues: ['Keep lower spine neutral', 'Drive elbows back past torso', 'Pause and squeeze mid-back rhomboids'],
    alternativeExerciseId: 'ex-7'
  },
  {
    id: 'ex-7',
    name: 'One-Arm Dumbbell Row',
    targetMuscle: 'back',
    movementPattern: 'horizontal_pull',
    equipmentTier: 'tier_a',
    equipmentRequired: 'Flat Bench & Dumbbell',
    difficulty: 'intermediate',
    cues: ['Plant non-working hand & knee on bench', 'Pull dumbbell towards hip crease', 'Avoid rotating hips at top'],
    alternativeExerciseId: 'ex-6'
  },
  {
    id: 'ex-8',
    name: 'Conventional Barbell Deadlift',
    targetMuscle: 'back',
    movementPattern: 'hinge',
    equipmentTier: 'tier_a',
    equipmentRequired: 'Barbell & Bumper/Cast Plates',
    difficulty: 'advanced',
    cues: ['Bar against shins, engage lats', 'Push floor away with legs', 'Lock out hips without hyperextending spine'],
    alternativeExerciseId: 'ex-11'
  },
  // Legs
  {
    id: 'ex-9',
    name: 'Barbell Back Squat',
    targetMuscle: 'quads',
    movementPattern: 'squat',
    equipmentTier: 'tier_a',
    equipmentRequired: 'Squat Rack & Barbell',
    difficulty: 'intermediate',
    cues: ['Brace core with diaphragmatic breath', 'Break at hips and knees simultaneously', 'Keep knees tracking over second toe'],
    alternativeExerciseId: 'ex-10'
  },
  {
    id: 'ex-10',
    name: '45-Degree Leg Press',
    targetMuscle: 'quads',
    movementPattern: 'squat',
    equipmentTier: 'tier_b',
    equipmentRequired: '45° Plate-Loaded Leg Press',
    difficulty: 'beginner',
    cues: ['Keep lower back glued to back pad', 'Do not lock out knees aggressively at top', 'Lower sled until knees reach 90°'],
    alternativeExerciseId: 'ex-9'
  },
  {
    id: 'ex-11',
    name: 'Dumbbell Romanian Deadlift (RDL)',
    targetMuscle: 'hamstrings',
    movementPattern: 'hinge',
    equipmentTier: 'tier_a',
    equipmentRequired: 'Dumbbells',
    difficulty: 'intermediate',
    cues: ['Slight knee bend, push hips far backwards', 'Keep dumbbells close to thighs and shins', 'Feel intense hamstring stretch at bottom'],
    alternativeExerciseId: 'ex-12'
  },
  {
    id: 'ex-12',
    name: 'Lying or Seated Leg Curl',
    targetMuscle: 'hamstrings',
    movementPattern: 'isolation',
    equipmentTier: 'tier_b',
    equipmentRequired: 'Hamstring Curl Machine',
    difficulty: 'beginner',
    cues: ['Keep hips pinned to pad', 'Curl heels to glutes with smooth control', 'Control the 3-second eccentric return'],
    alternativeExerciseId: 'ex-11'
  },
  // Shoulders
  {
    id: 'ex-13',
    name: 'Seated Dumbbell Shoulder Press',
    targetMuscle: 'deltoids',
    movementPattern: 'vertical_push',
    equipmentTier: 'tier_a',
    equipmentRequired: 'High Incline / 85° Bench & Dumbbells',
    difficulty: 'intermediate',
    cues: ['Elbows at 30° angle from shoulder plane', 'Press up in smooth slight arc', 'Stop just short of elbow lockout'],
    alternativeExerciseId: 'ex-14'
  },
  {
    id: 'ex-14',
    name: 'Standing Dumbbell Lateral Raise',
    targetMuscle: 'deltoids',
    movementPattern: 'isolation',
    equipmentTier: 'tier_a',
    equipmentRequired: 'Dumbbells',
    difficulty: 'beginner',
    cues: ['Slight forward torso lean', 'Lead with elbows rather than wrists', 'Raise until parallel to floor, no swinging'],
    alternativeExerciseId: 'ex-15'
  },
  {
    id: 'ex-15',
    name: 'Cable Face Pulls',
    targetMuscle: 'deltoids',
    movementPattern: 'isolation',
    equipmentTier: 'tier_a',
    equipmentRequired: 'Cable Station & Rope Attachment',
    difficulty: 'beginner',
    cues: ['Set pulley to eye level', 'Pull rope towards bridge of nose', 'Rotate hands back at finish to work rotator cuff'],
    alternativeExerciseId: 'ex-14'
  },
  // Arms
  {
    id: 'ex-16',
    name: 'EZ-Bar Standing Bicep Curl',
    targetMuscle: 'biceps',
    movementPattern: 'isolation',
    equipmentTier: 'tier_a',
    equipmentRequired: 'EZ-Bar & Plates',
    difficulty: 'beginner',
    cues: ['Pin elbows to sides', 'Curl bar up to upper chest without swinging hips', 'Lower with 2-second control'],
    alternativeExerciseId: 'ex-17'
  },
  {
    id: 'ex-17',
    name: 'Dumbbell Hammer Curl',
    targetMuscle: 'biceps',
    movementPattern: 'isolation',
    equipmentTier: 'tier_a',
    equipmentRequired: 'Dumbbells',
    difficulty: 'beginner',
    cues: ['Palms facing each other throughout', 'Target brachialis & forearms', 'Maintain strict torso stability'],
    alternativeExerciseId: 'ex-16'
  },
  {
    id: 'ex-18',
    name: 'Triceps Cable Rope Pushdown',
    targetMuscle: 'triceps',
    movementPattern: 'isolation',
    equipmentTier: 'tier_a',
    equipmentRequired: 'Cable Station & Rope',
    difficulty: 'beginner',
    cues: ['Elbows tucked close to ribs', 'Push down and spread rope ends apart at bottom', 'Squeeze triceps for 1 second'],
    alternativeExerciseId: 'ex-19'
  },
  {
    id: 'ex-19',
    name: 'Overhead Dumbbell Triceps Extension',
    targetMuscle: 'triceps',
    movementPattern: 'isolation',
    equipmentTier: 'tier_a',
    equipmentRequired: 'Dumbbell & Bench',
    difficulty: 'intermediate',
    cues: ['Support dumbbell vertically with both palms', 'Lower behind neck keeping elbows pointing forward', 'Extend straight overhead'],
    alternativeExerciseId: 'ex-18'
  },
  // Core
  {
    id: 'ex-20',
    name: 'Hanging Knee / Leg Raises',
    targetMuscle: 'core',
    movementPattern: 'isolation',
    equipmentTier: 'tier_a',
    equipmentRequired: 'Pull-up Bar or Captain Chair',
    difficulty: 'intermediate',
    cues: ['Posterior pelvic tilt as you raise knees to chest', 'Avoid using momentum or swinging', 'Lower slowly to dead hang'],
    alternativeExerciseId: 'ex-21'
  },
  {
    id: 'ex-21',
    name: 'Standard Forearm Plank',
    targetMuscle: 'core',
    movementPattern: 'isolation',
    equipmentTier: 'tier_a',
    equipmentRequired: 'Exercise Mat',
    difficulty: 'beginner',
    cues: ['Elbows under shoulders', 'Glutes squeezed, pelvis tucked', 'Do not let hips sag downwards'],
    alternativeExerciseId: 'ex-20'
  }
];

export const INITIAL_MEMBERS: Member[] = [
  {
    id: 'mem-101',
    fullName: 'Vikram Sharma',
    phone: '9876543210',
    gender: 'male',
    age: 28,
    planId: 'plan-3m',
    planName: '3-Month Standard Gym',
    startDate: '2026-08-15',
    endDate: '2026-11-15',
    totalFeeInr: 4500,
    paidAmountInr: 4500,
    pendingDueInr: 0,
    status: 'active',
    emergencyContact: '9876500001',
    fitnessGoal: 'muscle_gain',
    dietaryPreference: 'vegetarian',
    avatarSeed: 'Vikram'
  },
  {
    id: 'mem-102',
    fullName: 'Priya Patel',
    phone: '9822334455',
    gender: 'female',
    age: 26,
    planId: 'plan-1m',
    planName: 'Monthly General',
    startDate: '2026-09-10',
    endDate: '2026-10-10',
    totalFeeInr: 1800,
    paidAmountInr: 600,
    pendingDueInr: 1200,
    status: 'defaulter',
    emergencyContact: '9822334400',
    fitnessGoal: 'fat_loss',
    dietaryPreference: 'eggetarian',
    avatarSeed: 'Priya'
  },
  {
    id: 'mem-103',
    fullName: 'Rohit Verma',
    phone: '9899112233',
    gender: 'male',
    age: 32,
    planId: 'plan-6m',
    planName: '6-Month Strength & Cardio',
    startDate: '2026-04-18',
    endDate: '2026-10-18',
    totalFeeInr: 8000,
    paidAmountInr: 8000,
    pendingDueInr: 0,
    status: 'active', // Expiring in 5 days!
    emergencyContact: '9899112200',
    fitnessGoal: 'strength',
    dietaryPreference: 'non_veg',
    avatarSeed: 'Rohit'
  },
  {
    id: 'mem-104',
    fullName: 'Ananya Iyer',
    phone: '9711223344',
    gender: 'female',
    age: 24,
    planId: 'plan-3m',
    planName: '3-Month Standard Gym',
    startDate: '2026-07-01',
    endDate: '2026-10-01',
    totalFeeInr: 4500,
    paidAmountInr: 2500,
    pendingDueInr: 2000,
    status: 'expired',
    emergencyContact: '9711223300',
    fitnessGoal: 'general_fitness',
    dietaryPreference: 'vegetarian',
    avatarSeed: 'Ananya'
  },
  {
    id: 'mem-105',
    fullName: 'Amit Singh',
    phone: '9810556677',
    gender: 'male',
    age: 35,
    planId: 'plan-12m',
    planName: 'Annual VIP Membership',
    startDate: '2026-01-10',
    endDate: '2027-01-10',
    totalFeeInr: 14000,
    paidAmountInr: 14000,
    pendingDueInr: 0,
    status: 'active',
    emergencyContact: '9810556600',
    fitnessGoal: 'muscle_gain',
    dietaryPreference: 'non_veg',
    avatarSeed: 'Amit'
  },
  {
    id: 'mem-106',
    fullName: 'Rajesh Yadav',
    phone: '9870123456',
    gender: 'male',
    age: 29,
    planId: 'plan-1m',
    planName: 'Monthly General',
    startDate: '2026-09-05',
    endDate: '2026-10-05',
    totalFeeInr: 1800,
    paidAmountInr: 0,
    pendingDueInr: 1800,
    status: 'defaulter',
    emergencyContact: '9870123400',
    fitnessGoal: 'fat_loss',
    dietaryPreference: 'vegetarian',
    avatarSeed: 'Rajesh'
  },
  {
    id: 'mem-107',
    fullName: 'Sneha Nair',
    phone: '9940223344',
    gender: 'female',
    age: 27,
    planId: 'plan-3m',
    planName: '3-Month Standard Gym',
    startDate: '2026-08-20',
    endDate: '2026-11-20',
    totalFeeInr: 4500,
    paidAmountInr: 4500,
    pendingDueInr: 0,
    status: 'active',
    emergencyContact: '9940223300',
    fitnessGoal: 'general_fitness',
    dietaryPreference: 'eggetarian',
    avatarSeed: 'Sneha'
  },
  {
    id: 'mem-108',
    fullName: 'Neha Sharma',
    phone: '9812543210',
    gender: 'female',
    age: 27,
    planId: 'plan-6m',
    planName: '6-Month Strength & Cardio',
    startDate: '2026-03-01',
    endDate: '2026-09-01',
    totalFeeInr: 9000,
    paidAmountInr: 3000,
    pendingDueInr: 6000,
    status: 'defaulter',
    emergencyContact: '9812543200',
    fitnessGoal: 'fat_loss',
    dietaryPreference: 'vegetarian',
    avatarSeed: 'Neha'
  },
  {
    id: 'mem-109',
    fullName: 'Karan Malhotra',
    phone: '9823654321',
    gender: 'male',
    age: 31,
    planId: 'plan-3m',
    planName: '3-Month Standard Gym',
    startDate: '2026-06-15',
    endDate: '2026-09-15',
    totalFeeInr: 4500,
    paidAmountInr: 0,
    pendingDueInr: 4500,
    status: 'defaulter',
    emergencyContact: '9823654300',
    fitnessGoal: 'strength',
    dietaryPreference: 'non_veg',
    avatarSeed: 'Karan'
  },
  {
    id: 'mem-110',
    fullName: 'Rohit Mehta',
    phone: '9834765432',
    gender: 'male',
    age: 29,
    planId: 'plan-1m',
    planName: 'Monthly General',
    startDate: '2026-09-01',
    endDate: '2026-10-01',
    totalFeeInr: 3500,
    paidAmountInr: 0,
    pendingDueInr: 3500,
    status: 'defaulter',
    emergencyContact: '9834765400',
    fitnessGoal: 'muscle_gain',
    dietaryPreference: 'eggetarian',
    avatarSeed: 'RohitMehta'
  },
  {
    id: 'mem-111',
    fullName: 'Aditya Kulkarni',
    phone: '9845876543',
    gender: 'male',
    age: 26,
    planId: 'plan-3m',
    planName: '3-Month Standard Gym',
    startDate: '2026-07-30',
    endDate: '2026-10-16',
    totalFeeInr: 4500,
    paidAmountInr: 4500,
    pendingDueInr: 0,
    status: 'active',
    emergencyContact: '9845876500',
    fitnessGoal: 'strength',
    dietaryPreference: 'non_veg',
    avatarSeed: 'Aditya'
  },
  {
    id: 'mem-112',
    fullName: 'Pooja Sharma',
    phone: '9856987654',
    gender: 'female',
    age: 28,
    planId: 'plan-1m',
    planName: 'Monthly General',
    startDate: '2026-09-18',
    endDate: '2026-10-18',
    totalFeeInr: 1800,
    paidAmountInr: 1800,
    pendingDueInr: 0,
    status: 'active',
    emergencyContact: '9856987600',
    fitnessGoal: 'general_fitness',
    dietaryPreference: 'vegetarian',
    avatarSeed: 'Pooja'
  }
];

export const INITIAL_ATTENDANCE: AttendanceRecord[] = [
  {
    id: 'att-1',
    memberId: 'mem-101',
    memberName: 'Vikram Sharma',
    phone: '9876543210',
    checkInTime: '2026-10-13T06:45:00+05:30',
    checkInMethod: 'phone_search',
    planStatus: 'active',
    pendingDueInr: 0
  },
  {
    id: 'att-2',
    memberId: 'mem-105',
    memberName: 'Amit Singh',
    phone: '9810556677',
    checkInTime: '2026-10-13T07:12:00+05:30',
    checkInMethod: 'qr_scan',
    planStatus: 'active',
    pendingDueInr: 0
  },
  {
    id: 'att-3',
    memberId: 'mem-103',
    memberName: 'Sneha Nair',
    phone: '9823456789',
    checkInTime: '2026-10-13T07:55:00+05:30',
    checkInMethod: 'phone_search',
    planStatus: 'active',
    pendingDueInr: 0
  },
  {
    id: 'att-4',
    memberId: 'mem-108',
    memberName: 'Neha Sharma',
    phone: '9812543210',
    checkInTime: '2026-10-13T08:30:00+05:30',
    checkInMethod: 'phone_search',
    planStatus: 'defaulter',
    pendingDueInr: 6000
  }
];

export const INITIAL_PAYMENTS: PaymentRecord[] = [
  {
    id: 'pay-501',
    memberId: 'mem-101',
    memberName: 'Vikram Sharma',
    amountInr: 104400,
    paymentMode: 'cash',
    transactionRef: 'CSH-REC-8841',
    timestamp: '2026-08-15T11:20:00+05:30'
  },
  {
    id: 'pay-502',
    memberId: 'mem-105',
    memberName: 'Amit Singh',
    amountInr: 94200,
    paymentMode: 'upi',
    transactionRef: 'UPI/6192837461/PAYTM',
    timestamp: '2026-08-10T14:40:00+05:30'
  },
  {
    id: 'pay-503',
    memberId: 'mem-102',
    memberName: 'Priya Patel',
    amountInr: 29800,
    paymentMode: 'card',
    transactionRef: 'CRD-POS-7719',
    timestamp: '2026-08-12T18:15:00+05:30'
  },
  {
    id: 'pay-504',
    memberId: 'mem-103',
    memberName: 'Rohit Verma',
    amountInr: 20200,
    paymentMode: 'netbanking',
    transactionRef: 'NEFT/554899120',
    timestamp: '2026-08-14T09:30:00+05:30'
  }
];

export const INITIAL_EQUIPMENT: EquipmentItem[] = [
  {
    id: 'eq-1',
    name: 'Leg Press Machine',
    category: 'strength_machine',
    tier: 'tier_b',
    status: 'out_of_order',
    lastServicedDate: '2026-08-10',
    nextServiceDueDate: '2026-11-10',
    notes: 'Reported 2 days ago; awaiting technician inspection'
  },
  {
    id: 'eq-2',
    name: 'Dual Adjustable Cable Crossover',
    category: 'cable_station',
    tier: 'tier_b',
    status: 'needs_service',
    lastServicedDate: '2026-06-15',
    nextServiceDueDate: '2026-10-15',
    notes: 'Right pulley cable starting to fray; service scheduled'
  },
  {
    id: 'eq-3',
    name: 'Olympic Flat Bench Press Station',
    category: 'free_weights',
    tier: 'tier_a',
    status: 'operational',
    lastServicedDate: '2026-09-01',
    nextServiceDueDate: '2026-12-01',
    notes: 'Upholstery intact; bar catches solid'
  },
  {
    id: 'eq-4',
    name: 'Commercial Treadmill T-900',
    category: 'cardio',
    tier: 'tier_a',
    status: 'operational',
    lastServicedDate: '2026-07-20',
    nextServiceDueDate: '2026-10-05',
    notes: 'Belt alignment calibrated and lubricated'
  },
  {
    id: 'eq-5',
    name: 'Smith Machine Multi-Track',
    category: 'strength_machine',
    tier: 'tier_b',
    status: 'operational',
    lastServicedDate: '2026-08-25',
    nextServiceDueDate: '2026-11-25',
    notes: 'Safety catches and counter-weights checked'
  }
];

export const INITIAL_LEADS: LeadItem[] = [
  {
    id: 'lead-1',
    fullName: 'Karan Mehra',
    phone: '9811002233',
    goal: 'muscle_gain',
    inquiryDate: '2026-10-11',
    trialStatus: 'trial_booked',
    nextFollowUpDate: '2026-10-14',
    notes: 'Interested in evening slot (7:30 PM). Free trial scheduled tomorrow.'
  },
  {
    id: 'lead-2',
    fullName: 'Deepika Rao',
    phone: '9845112233',
    goal: 'fat_loss',
    inquiryDate: '2026-10-09',
    trialStatus: 'follow_up',
    nextFollowUpDate: '2026-10-13',
    notes: 'Attended trial on Sunday. Quoted ₹4,500 for 3 months. Call today.'
  },
  {
    id: 'lead-3',
    fullName: 'Harpreet Singh',
    phone: '9872112233',
    goal: 'strength',
    inquiryDate: '2026-10-12',
    trialStatus: 'trial_completed',
    nextFollowUpDate: '2026-10-15',
    notes: 'Looking for powerlifting setup and deadlift platform.'
  }
];

export const INITIAL_ROUTINES: WorkoutRoutine[] = [
  {
    id: 'routine-push-hypertrophy',
    title: 'Push Day A (Chest, Delts & Triceps)',
    splitType: 'push',
    goal: 'muscle_gain',
    experienceLevel: 'intermediate',
    exercises: [
      {
        exerciseId: 'ex-1',
        exercise: INITIAL_EXERCISES[0], // Flat Bench
        sets: [
          { setNumber: 1, weightKg: 60, targetReps: 10, completedReps: 10, completed: true, rpe: 8 },
          { setNumber: 2, weightKg: 70, targetReps: 8, completedReps: 8, completed: true, rpe: 8.5 },
          { setNumber: 3, weightKg: 75, targetReps: 6, completedReps: 6, completed: false }
        ],
        restSeconds: 90
      },
      {
        exerciseId: 'ex-3',
        exercise: INITIAL_EXERCISES[2], // Incline DB
        sets: [
          { setNumber: 1, weightKg: 20, targetReps: 10, completed: false },
          { setNumber: 2, weightKg: 22.5, targetReps: 10, completed: false },
          { setNumber: 3, weightKg: 22.5, targetReps: 8, completed: false }
        ],
        restSeconds: 90
      },
      {
        exerciseId: 'ex-4',
        exercise: INITIAL_EXERCISES[3], // Pec Deck Fly
        sets: [
          { setNumber: 1, weightKg: 40, targetReps: 12, completed: false },
          { setNumber: 2, weightKg: 45, targetReps: 12, completed: false },
          { setNumber: 3, weightKg: 45, targetReps: 10, completed: false }
        ],
        restSeconds: 60
      },
      {
        exerciseId: 'ex-14',
        exercise: INITIAL_EXERCISES[13], // DB Lateral Raise
        sets: [
          { setNumber: 1, weightKg: 7.5, targetReps: 15, completed: false },
          { setNumber: 2, weightKg: 7.5, targetReps: 15, completed: false },
          { setNumber: 3, weightKg: 10, targetReps: 12, completed: false }
        ],
        restSeconds: 60
      },
      {
        exerciseId: 'ex-18',
        exercise: INITIAL_EXERCISES[17], // Triceps Rope Pushdown
        sets: [
          { setNumber: 1, weightKg: 25, targetReps: 12, completed: false },
          { setNumber: 2, weightKg: 30, targetReps: 10, completed: false },
          { setNumber: 3, weightKg: 30, targetReps: 10, completed: false }
        ],
        restSeconds: 60
      }
    ]
  },
  {
    id: 'routine-pull-hypertrophy',
    title: 'Pull Day A (Lats, Upper Back & Biceps)',
    splitType: 'pull',
    goal: 'muscle_gain',
    experienceLevel: 'intermediate',
    exercises: [
      {
        exerciseId: 'ex-5',
        exercise: INITIAL_EXERCISES[4], // Lat Pulldown
        sets: [
          { setNumber: 1, weightKg: 50, targetReps: 10, completed: false },
          { setNumber: 2, weightKg: 55, targetReps: 10, completed: false },
          { setNumber: 3, weightKg: 60, targetReps: 8, completed: false }
        ],
        restSeconds: 90
      },
      {
        exerciseId: 'ex-6',
        exercise: INITIAL_EXERCISES[5], // Seated Cable Row
        sets: [
          { setNumber: 1, weightKg: 45, targetReps: 10, completed: false },
          { setNumber: 2, weightKg: 50, targetReps: 10, completed: false },
          { setNumber: 3, weightKg: 50, targetReps: 8, completed: false }
        ],
        restSeconds: 90
      },
      {
        exerciseId: 'ex-15',
        exercise: INITIAL_EXERCISES[14], // Face Pulls
        sets: [
          { setNumber: 1, weightKg: 20, targetReps: 15, completed: false },
          { setNumber: 2, weightKg: 22.5, targetReps: 15, completed: false },
          { setNumber: 3, weightKg: 25, targetReps: 12, completed: false }
        ],
        restSeconds: 60
      },
      {
        exerciseId: 'ex-16',
        exercise: INITIAL_EXERCISES[15], // EZ Bar Curl
        sets: [
          { setNumber: 1, weightKg: 20, targetReps: 12, completed: false },
          { setNumber: 2, weightKg: 25, targetReps: 10, completed: false },
          { setNumber: 3, weightKg: 25, targetReps: 8, completed: false }
        ],
        restSeconds: 60
      }
    ]
  },
  {
    id: 'routine-legs-hypertrophy',
    title: 'Legs Day A (Quads, Hamstrings & Calves)',
    splitType: 'legs',
    goal: 'muscle_gain',
    experienceLevel: 'intermediate',
    exercises: [
      {
        exerciseId: 'ex-9',
        exercise: INITIAL_EXERCISES[8], // Squat
        sets: [
          { setNumber: 1, weightKg: 60, targetReps: 10, completed: false },
          { setNumber: 2, weightKg: 80, targetReps: 8, completed: false },
          { setNumber: 3, weightKg: 90, targetReps: 6, completed: false }
        ],
        restSeconds: 120
      },
      {
        exerciseId: 'ex-10',
        exercise: INITIAL_EXERCISES[9], // Leg Press
        sets: [
          { setNumber: 1, weightKg: 120, targetReps: 12, completed: false },
          { setNumber: 2, weightKg: 140, targetReps: 10, completed: false },
          { setNumber: 3, weightKg: 160, targetReps: 10, completed: false }
        ],
        restSeconds: 90
      },
      {
        exerciseId: 'ex-11',
        exercise: INITIAL_EXERCISES[10], // DB RDL
        sets: [
          { setNumber: 1, weightKg: 20, targetReps: 10, completed: false },
          { setNumber: 2, weightKg: 22.5, targetReps: 10, completed: false },
          { setNumber: 3, weightKg: 25, targetReps: 8, completed: false }
        ],
        restSeconds: 90
      }
    ]
  }
];

export const INITIAL_DIET_PLANS: Record<string, DietPlan> = {
  vegetarian: {
    id: 'diet-veg',
    title: 'High-Protein Indian Lacto-Vegetarian Plan',
    preference: 'vegetarian',
    dailyCalories: 2200,
    proteinGrams: 135,
    carbsGrams: 240,
    fatsGrams: 65,
    meals: [
      {
        mealName: 'Breakfast (8:00 AM)',
        timeOfDay: 'Morning',
        items: ['Besan Chilla (2) made with grated Paneer (50g)', '1 Glass Low-Fat Milk (250ml) or Curd', 'Handful of Soaked Almonds & Walnuts (15g)'],
        approxProteinGrams: 28,
        approxCalories: 480
      },
      {
        mealName: 'Lunch (1:30 PM)',
        timeOfDay: 'Afternoon',
        items: ['Soya Chunks Curry (50g dry chunks)', 'Moong/Toor Dal (1 large bowl)', '2 Phulkas (Rotis with light ghee) + Cucumber Salad'],
        approxProteinGrams: 42,
        approxCalories: 620
      },
      {
        mealName: 'Pre-Workout Snack (5:30 PM)',
        timeOfDay: 'Evening',
        items: ['Roasted Chana (40g) + 1 Banana', 'Black Coffee or Green Tea without sugar'],
        approxProteinGrams: 10,
        approxCalories: 250
      },
      {
        mealName: 'Dinner (8:30 PM)',
        timeOfDay: 'Night',
        items: ['Low-Fat Paneer Bhurji (120g) with Capsicum/Tomato', '1 Multigrain Roti or 1 Cup Brown Rice', 'Green Leafy Vegetable Salad (Palak / Methi)'],
        approxProteinGrams: 35,
        approxCalories: 550
      },
      {
        mealName: 'Before Bed (10:30 PM)',
        timeOfDay: 'Bedtime',
        items: ['Warm Turmeric Milk with Pinch of Cinnamon (150ml)'],
        approxProteinGrams: 6,
        approxCalories: 110
      }
    ],
    tips: [
      'Soya chunks are 52% pure protein by dry weight — consume 40-50g at least 3-4 times a week.',
      'Combine pulses with grain (e.g. Dal + Rice) to complete the essential amino acid profile.',
      'Stay hydrated with 3.5 to 4 Litres of water daily in Indian tropical climates.'
    ]
  },
  eggetarian: {
    id: 'diet-egg',
    title: 'Indian Eggetarian Lean Muscle Plan',
    dailyCalories: 2300,
    preference: 'eggetarian',
    proteinGrams: 150,
    carbsGrams: 230,
    fatsGrams: 70,
    meals: [
      {
        mealName: 'Breakfast (8:00 AM)',
        timeOfDay: 'Morning',
        items: ['3 Whole Boiled Eggs + 2 Egg Whites', '2 Slices Brown Bread or 1 Stuffed Methi Paratha (dry)', '1 Glass Black Coffee'],
        approxProteinGrams: 32,
        approxCalories: 450
      },
      {
        mealName: 'Lunch (1:30 PM)',
        timeOfDay: 'Afternoon',
        items: ['Paneer (80g) or Rajma/Chole Bowl (1.5 cup)', '1.5 Cup Steamed Basmati Rice', 'Curd (100g) + Fresh Sprout Salad'],
        approxProteinGrams: 38,
        approxCalories: 650
      },
      {
        mealName: 'Pre/Post Workout (6:00 PM)',
        timeOfDay: 'Evening',
        items: ['4 Boiled Egg Whites sprinkled with Chaat Masala', '1 Sweet Potato or Banana'],
        approxProteinGrams: 16,
        approxCalories: 220
      },
      {
        mealName: 'Dinner (8:30 PM)',
        timeOfDay: 'Night',
        items: ['Egg Bhurji (2 Whole Eggs + 3 Whites) with Onions & Green Chillies', '2 Phulkas + Mixed Vegetable Sabzi'],
        approxProteinGrams: 36,
        approxCalories: 560
      }
    ],
    tips: [
      'Egg whites provide fast-absorbing albumin protein with zero saturated fat.',
      'Keep 2 whole eggs daily for healthy cholesterol, lutein, and vitamin D balance.'
    ]
  },
  non_veg: {
    id: 'diet-nonveg',
    title: 'Indian High-Protein Balanced Non-Veg Plan',
    dailyCalories: 2400,
    preference: 'non_veg',
    proteinGrams: 165,
    carbsGrams: 240,
    fatsGrams: 68,
    meals: [
      {
        mealName: 'Breakfast (8:00 AM)',
        timeOfDay: 'Morning',
        items: ['3 Whole Eggs Omelette with Tomato & Coriander', '2 Slices Multigrain Bread', 'Handful Almonds'],
        approxProteinGrams: 26,
        approxCalories: 460
      },
      {
        mealName: 'Lunch (1:30 PM)',
        timeOfDay: 'Afternoon',
        items: ['Grilled or Curry Chicken Breast (150g)', '1 Cup Brown or White Rice', 'Cucumber Onion Salad + 1 Bowl Yellow Dal'],
        approxProteinGrams: 52,
        approxCalories: 640
      },
      {
        mealName: 'Evening Snack (5:30 PM)',
        timeOfDay: 'Evening',
        items: ['Sprouts Chaat with Lime & Tomato (1 Bowl)', '1 Cup Greek Yogurt or Thick Curd (150g)'],
        approxProteinGrams: 18,
        approxCalories: 260
      },
      {
        mealName: 'Dinner (8:30 PM)',
        timeOfDay: 'Night',
        items: ['Chicken Breast Stir-Fry or Fish Curry (150g)', '2 Phulkas + Green Salad'],
        approxProteinGrams: 48,
        approxCalories: 580
      }
    ],
    tips: [
      'Use breast cuts rather than thigh/leg meat to reduce unnecessary animal fats.',
      'Prepare curries with tomato-onion bases and minimal oil rather than heavy cashew creams.'
    ]
  }
};
