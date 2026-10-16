import { GymProfile } from '@/types';

export const INITIAL_GYM_PROFILES: GymProfile[] = [
  {
    id: 'gym-ironpulse',
    slug: 'ironpulse',
    gymName: 'IronPulse Commercial Gym',
    tagline: 'High-Performance Commercial Gym & Biomechanics Arena',
    heroHeadline: 'NO EXCUSES.',
    heroHighlight: 'ONLY RESULTS.',
    heroSubtitle: 'Join a results-driven fitness community with certified trainers, modern bio-mechanical equipment, and personalized nutrition designed to transform your physique and performance.',
    heroImageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1400&q=80',
    logoUrl: '',
    primaryColor: '#ccff00',
    accentColor: '#b8e600',
    secondaryColor: '#121724',
    phone: '9876543210',
    email: 'contact@ironpulsefitness.in',
    whatsappNumber: '919876543210',
    upiVpa: 'ironpulse@oksbi',
    address: 'Plot 42, 27th Main, Sector 1, HSR Layout',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560102',
    operatingHours: 'Mon - Sat: 5:30 AM - 10:30 PM | Sun: 6:00 AM - 1:00 PM',
    isPublished: true,
    features: [
      {
        title: 'Certified Trainers',
        desc: 'Our expert coaches design science-backed programs tailored to your personal biomechanics and metabolic goals.',
        icon: 'Award'
      },
      {
        title: 'Modern Equipment',
        desc: 'Train with world-class bio-mechanical machines, dual-pulley towers, and advanced peak-hour load tracking.',
        icon: 'Zap'
      },
      {
        title: 'Personalized Nutrition',
        desc: 'Custom high-protein Indian diets (Soya chunks, Paneer, Dal, Eggs) engineered for complete essential amino acid profiles.',
        icon: 'Utensils'
      },
      {
        title: 'Motivating Community',
        desc: 'Surround yourself with disciplined athletes and coaches who push you to exceed your limits every single session.',
        icon: 'Users'
      }
    ],
    programs: [
      {
        id: 'weight',
        title: 'Weight Training',
        category: 'strength',
        desc: 'Build raw muscular power and dense hypertrophy with periodized barbell and dumbbell progressions.',
        intensity: 'High Intensity',
        duration: '45-60 min'
      },
      {
        id: 'cardio',
        title: 'Cardio & Fat Loss',
        category: 'conditioning',
        desc: 'Accelerate fat oxidation with interval sprints, rowing ladders, and metabolic functional circuits.',
        intensity: 'Peak Heart Rate',
        duration: '35-45 min'
      },
      {
        id: 'coaching',
        title: 'Personal Coaching',
        category: 'personal',
        desc: 'One-on-one kinematic analysis, form correction, and custom progressive overload architecture.',
        intensity: 'Precision Focus',
        duration: '60 min'
      },
      {
        id: 'calisthenics',
        title: 'Group Functional',
        category: 'conditioning',
        desc: 'Dynamic bodyweight mastery, plyometric bounding, and anaerobic stamina conditioning.',
        intensity: 'High Energy',
        duration: '50 min'
      },
      {
        id: 'yoga',
        title: 'Yoga & Flexibility',
        category: 'mobility',
        desc: 'Joint longevity, hip and thoracic mobility, posterior chain decompression, and active recovery.',
        intensity: 'Restorative',
        duration: '45 min'
      }
    ],
    membershipPlans: [
      {
        id: 'plan-1m',
        name: 'Starter Pass',
        durationMonths: 1,
        feeInr: 2499,
        features: [
          'Full Cardio & Weight Floor Access',
          'Locker & Shower Access',
          'Free Functional Movement Assessment',
          'GymPRO Athlete App Companion'
        ],
        isPopular: false
      },
      {
        id: 'plan-3m',
        name: 'Pro Strength',
        durationMonths: 3,
        feeInr: 5999,
        features: [
          'Everything in Starter',
          '1 Personal Trainer Session / mo',
          'Indian Macro Diet Consultation',
          'Instant WhatsApp Fee Receipts',
          'Peak-Hour Equipment Swap Engine'
        ],
        isPopular: true,
        badge: 'MOST POPULAR'
      },
      {
        id: 'plan-1y',
        name: 'VIP Elite Annual',
        durationMonths: 12,
        feeInr: 18999,
        features: [
          'Everything in Pro Strength',
          'Unlimited Personal Coaching Consults',
          'Custom High-Protein Indian Diet Charts',
          'Dedicated VIP Locker & Laundry',
          'Unlimited Guest Passes (2/month)'
        ],
        isPopular: false,
        badge: 'BEST VALUE'
      }
    ],
    trainers: [
      {
        name: 'Vikram Singh',
        role: 'Head Strength Coach',
        spec: 'Biomechanics & Powerlifting',
        exp: '6 Years Exp.',
        rating: '4.95'
      },
      {
        name: 'Rajesh Sharma',
        role: 'Senior Hypertrophy Coach',
        spec: 'Bodybuilding & Injury Rehab',
        exp: '8 Years Exp.',
        rating: '4.98'
      },
      {
        name: 'Priya Nair',
        role: 'Functional & Dietetics Coach',
        spec: 'Indian Macro Planning & Mobility',
        exp: '5 Years Exp.',
        rating: '4.92'
      }
    ],
    transformations: [
      {
        name: 'Rahul M.',
        role: 'Software Architect • Bengaluru',
        achievement: '-15 kg Body Fat',
        quote: 'Joining transformed my routine. The high-protein Indian diet plan with soya & paneer fit seamlessly into my lifestyle. Lost 15kg in 6 months.',
        startWeight: '88kg',
        endWeight: '73kg',
        metricLabel: 'Weight Progression'
      },
      {
        name: 'Ananya K.',
        role: 'Management Consultant • Gurgaon',
        achievement: '+40kg Deadlift',
        quote: 'Coach Vikram dialled in my posterior chain biomechanics. Deadlift shot from 45kg to 125kg without lower back pain.',
        startWeight: '45kg',
        endWeight: '125kg',
        metricLabel: 'Strength PR Curve'
      },
      {
        name: 'Kabir D.',
        role: 'Fintech Founder • Indiranagar',
        achievement: '18% → 10% Body Fat',
        quote: 'Consistent 6 AM sessions with targeted compound lifts. The reception scan and WhatsApp progress tracking kept me 100% accountable.',
        startWeight: '18%',
        endWeight: '10.2%',
        metricLabel: 'DEXA Body Fat Scan'
      }
    ]
  },
  {
    id: 'gym-alpha-fitness',
    slug: 'alpha-fitness',
    gymName: 'Alpha Elite Fitness & Combat Arena',
    tagline: 'Premier MMA, Strength & Metabolic Conditioning Hub',
    heroHeadline: 'UNLEASH THE',
    heroHighlight: 'ALPHA WITHIN.',
    heroSubtitle: 'Gurgaon’s premier combat and athletic strength facility. High-altitude oxygen chambers, competition boxing ring, and Olympic lifting platforms.',
    heroImageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1400&q=80',
    logoUrl: '',
    primaryColor: '#00f0ff',
    accentColor: '#00b8d4',
    secondaryColor: '#0a192f',
    phone: '9811223344',
    email: 'info@alphafitnessarena.in',
    whatsappNumber: '919811223344',
    upiVpa: 'alphafitness@okhdfcbank',
    address: 'Level 3, Global Foyer Mall, Golf Course Road',
    city: 'Gurgaon',
    state: 'Haryana',
    pincode: '122002',
    operatingHours: 'Open 24/7 (Staffed 6:00 AM - 11:00 PM)',
    isPublished: true,
    features: [
      {
        title: 'Combat & MMA Ring',
        desc: 'Pro-grade boxing ring, heavy bag rails, and Brazilian Jiu-Jitsu mats coached by national medalists.',
        icon: 'Award'
      },
      {
        title: 'Olympic Lifting Decks',
        desc: 'Eleiko certified calibrated barbell sets, bumper plates, and competition-ready lifting platforms.',
        icon: 'Zap'
      },
      {
        title: 'Cryo Recovery Lounge',
        desc: 'Cold plunge tubs, infrared sauna, and percussive therapy zones for rapid athletic recovery.',
        icon: 'Utensils'
      },
      {
        title: '24/7 Biometric Access',
        desc: 'Seamless anytime entry with GymPRO optical mobile QR passes and automatic turnstile gating.',
        icon: 'Users'
      }
    ],
    programs: [
      {
        id: 'mma',
        title: 'Mixed Martial Arts',
        category: 'strength',
        desc: 'Striking, grappling, and clinch transitions designed for self-defense and peak conditioning.',
        intensity: 'Extreme Intensity',
        duration: '60 min'
      },
      {
        id: 'olympic',
        title: 'Olympic Weightlifting',
        category: 'strength',
        desc: 'Snatch and Clean & Jerk kinematics with high-speed video feedback.',
        intensity: 'Max Power',
        duration: '75 min'
      },
      {
        id: 'hiit',
        title: 'Alpha Metabolic Circuit',
        category: 'conditioning',
        desc: 'Sled pushes, battle ropes, assault bikes, and kettlebell intervals.',
        intensity: 'Heart Rate Zone 5',
        duration: '45 min'
      }
    ],
    membershipPlans: [
      {
        id: 'plan-combat-1m',
        name: 'Combat Cadet',
        durationMonths: 1,
        feeInr: 3499,
        features: [
          '24/7 Gym Floor Access',
          'Heavy Bag & Mat Access',
          'Locker & Sauna Access',
          'GymPRO Pass Companion'
        ],
        isPopular: false
      },
      {
        id: 'plan-combat-3m',
        name: 'Alpha Warrior',
        durationMonths: 3,
        feeInr: 8999,
        features: [
          'Full Combat + Lifting Access',
          '4 Muay Thai / MMA Classes / mo',
          'Cryo Recovery Lounge Access',
          'WhatsApp Diet & Hydration Alerts'
        ],
        isPopular: true,
        badge: 'FIGHTER FAVORITE'
      },
      {
        id: 'plan-combat-1y',
        name: 'Championship Ring VIP',
        durationMonths: 12,
        feeInr: 28999,
        features: [
          'All-Inclusive Unlimited Everything',
          'Unlimited MMA, Boxing & Lifting Coaching',
          'Private Locker with Keypad Lock',
          'Monthly Athletic Bloodwork Analysis'
        ],
        isPopular: false,
        badge: 'CHAMPIONSHIP TIER'
      }
    ],
    trainers: [
      {
        name: 'Arjun Hooda',
        role: 'MMA & Grappling Coach',
        spec: 'National Gold Medalist • Sambo & BJJ',
        exp: '9 Years Exp.',
        rating: '4.99'
      },
      {
        name: 'Simran Walia',
        role: 'Olympic Strength Specialist',
        spec: 'Snatch Kinematics & Power Cleans',
        exp: '7 Years Exp.',
        rating: '4.94'
      }
    ],
    transformations: [
      {
        name: 'Tarun V.',
        role: 'Equity Analyst • Cyber City',
        achievement: 'Dropped 12kg & Learned Kickboxing',
        quote: 'Alpha Arena rebuilt my physical confidence. The boxing circuits melted my corporate burnout.',
        startWeight: '92kg',
        endWeight: '80kg',
        metricLabel: 'Combat Conditioning'
      }
    ]
  },
  {
    id: 'gym-powerhouse',
    slug: 'powerhouse-gym',
    gymName: 'Powerhouse 24/7 Gym & Spa',
    tagline: 'Luxury Fitness, Wellness & Body Sculpting Club',
    heroHeadline: 'REDEFINE YOUR',
    heroHighlight: 'LIFESTYLE.',
    heroSubtitle: 'Mumbai’s favorite celebrity fitness studio. Steam baths, imported Italian machines, open-air turf, and organic protein smoothie bar.',
    heroImageUrl: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=1400&q=80',
    logoUrl: '',
    primaryColor: '#ff3366',
    accentColor: '#e6004c',
    secondaryColor: '#1a0b16',
    phone: '9820011223',
    email: 'mumbai@powerhousegym.in',
    whatsappNumber: '919820011223',
    upiVpa: 'powerhousemumbai@icici',
    address: 'Link Road, Opposite Infinity Mall, Andheri West',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400053',
    operatingHours: '24 Hours Open (Monday to Sunday)',
    isPublished: true,
    features: [
      {
        title: 'Celebrity Trainers',
        desc: 'Trained by coaches who prepare Bollywood actors and elite supermodels for on-screen roles.',
        icon: 'Award'
      },
      {
        title: 'Spa & Steam Sanctuary',
        desc: 'Eucalyptus steam room, Finnish sauna, and luxury shower suites with organic toiletries.',
        icon: 'Zap'
      },
      {
        title: 'Organic Fuel Bar',
        desc: 'Fresh whey shakes, cold-pressed green juices, and macro-counted post-workout bowls.',
        icon: 'Utensils'
      },
      {
        title: 'Private Posing Studio',
        desc: 'Lighting calibrated for stage bodybuilding prep, silhouette checks, and progress documentation.',
        icon: 'Users'
      }
    ],
    programs: [
      {
        id: 'sculpt',
        title: 'Glutes & Core Sculpting',
        category: 'conditioning',
        desc: 'Hyper-targeted glute activation and abdominal core definition using hip-thrust platforms and cable kickbacks.',
        intensity: 'Moderate-High',
        duration: '50 min'
      },
      {
        id: 'pilates',
        title: 'Reformer Pilates',
        category: 'mobility',
        desc: 'Low-impact core strengthening, posture realignment, and spinal elongation.',
        intensity: 'Controlled Flow',
        duration: '45 min'
      }
    ],
    membershipPlans: [
      {
        id: 'plan-ph-1m',
        name: 'Silver Club',
        durationMonths: 1,
        feeInr: 3999,
        features: ['24/7 Access', 'Steam & Sauna', 'Locker Room Access'],
        isPopular: false
      },
      {
        id: 'plan-ph-3m',
        name: 'Gold Signature',
        durationMonths: 3,
        feeInr: 9999,
        features: ['Everything in Silver', '2 Pilates Sessions', 'Smoothie Bar 10% Discount'],
        isPopular: true,
        badge: 'POPULAR'
      },
      {
        id: 'plan-ph-1y',
        name: 'Platinum Black VIP',
        durationMonths: 12,
        feeInr: 32000,
        features: ['All Club Privileges', 'Personal Trainer 2x/week', 'Private Valet Parking'],
        isPopular: false,
        badge: 'VIP'
      }
    ],
    trainers: [
      {
        name: 'Sameer Khan',
        role: 'Celebrity Physique Specialist',
        spec: 'Body Recomposition & Lean Muscle',
        exp: '11 Years Exp.',
        rating: '5.0'
      }
    ],
    transformations: [
      {
        name: 'Meera S.',
        role: 'Creative Producer • Bandra',
        achievement: 'Corrected Posture & Gained 4kg Lean Muscle',
        quote: 'The ambiance, lighting, and expert guidance made going to the gym the best hour of my day.',
        startWeight: 'Posture: Kyphosis',
        endWeight: 'Neutral Spine + Core PR',
        metricLabel: 'Mobility & Posture'
      }
    ]
  }
];
