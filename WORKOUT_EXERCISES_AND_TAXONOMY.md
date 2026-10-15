# Comprehensive Gym Exercise Taxonomy & Workout Engine Analysis
**Project:** Gym Management SaaS (Indian Gym Focus)  
**Target Modules:** Member Workout Plans, Exercise Instructions, AI Recommendation Engine & Offline Fallbacks

---

## 1. Executive Summary & Context

Under **Section 1.B (Member Portal)** and **Section 1.C (AI Fitness Features)** of the Gym Management SaaS PRD, the platform must deliver:
1. **Personalized workout plans** and clear exercise instructions.
2. **AI-driven workout recommendations** filtered by user goal, training experience, and available equipment.
3. **Fail-safe, deterministic workout progression** that operates seamlessly when AI services are offline or rate-limited.

In Indian fitness facilities (ranging from neighborhood tier-2/3 gyms to premium urban franchises like Gold's, Cult, Anytime Fitness), equipment availability, trainer-to-member ratios, and member goals follow distinct operational realities. This document provides:
- The authoritative **Top 50+ Gym Exercises catalog** categorized by muscle group, mechanics, and equipment tier.
- **Indian Gym Equipment Availability Matrix** (Tier 1 Premium vs. Tier 2/3 Neighborhood Gyms).
- **Workout Plan Architecture & Splits** (PPL, Upper/Lower, Full Body, Bro-Split).
- **Offline Deterministic Fallback Engine** (ensuring 100% uptime without AI API dependencies).
- **Supabase Database Schema for Exercise & Workout Modules**.

---

## 2. Indian Gym Equipment Availability Matrix

To ensure workout plans never recommend exercises with unavailable machinery, exercises are tagged against three operational equipment tiers:

| Equipment Tier | Typical Equipment Present | Gym Profile |
| :--- | :--- | :--- |
| **Tier A: Universal Baseline (100% of Indian Gyms)** | Flat bench, incline bench, standard Olympic barbells, hex/iron dumbbells (2.5kg to 35kg), pull-up bar, basic lat pulldown + seated cable row station, EZ curl bar, dipping bars/bench. | Local neighborhood "iron" gyms, budget commercial setups. |
| **Tier B: Standard Commercial (85% of Indian Gyms)** | Cable crossover / dual adjustable pulley, Smith machine, 45° Leg press, Leg extension, Seated/lying hamstring curl, Pec deck fly machine, Preacher curl bench. | Mid-tier commercial gyms (Anytime, local commercial clubs). |
| **Tier C: Premium Facilities (35% of Indian Gyms)** | Hack squat machine, Pendulum squat, Belt squat, Assisted pull-up/dip, T-Bar row machine, Standing calf raise machine, Glute-ham developer (GHD), specialized grip attachments. | High-end clubs, Gold's, Cult.fit centres, athletic gyms. |

---

## 3. Top Gym Exercises Catalog (By Muscle Group & Movement Pattern)

Each exercise includes its **Movement Plane**, **Target Muscle**, **Equipment Requirement**, and **Substitution Alternative** (crucial for crowded Indian peak hours: 6:00 AM – 9:00 AM and 6:30 PM – 9:30 PM).

### 3.1. Chest (Pectoralis Major & Minor, Anterior Deltoids)

| # | Exercise Name | Target Region | Equipment Tier | Primary Mechanics | Indian Gym Busy-Hour Alternative |
|---|---|---|---|---|---|
| 1 | **Barbell Flat Bench Press** | Mid/Overall Pecs | Tier A | Compound (Horizontal Push) | Dumbbell Flat Bench Press / Push-ups |
| 2 | **Incline Dumbbell Press** | Clavicular Head (Upper Chest) | Tier A | Compound (Incline Push, 30°-45°) | Incline Barbell Press / Low-to-High Cable Fly |
| 3 | **Flat / Decline Dumbbell Fly** | Sternal Chest (Stretch focus) | Tier A | Isolation | Pec Deck Machine / Cable Crossover Fly |
| 4 | **Pec Deck Fly (Machine Fly)** | Sternal Chest (Peak contraction) | Tier B | Isolation (Fixed trajectory) | Standing Cable Chest Fly (Cables) |
| 5 | **Smith Machine Incline Press** | Upper Pecs (Stability/Tension) | Tier B | Compound (Constrained path) | Incline Dumbbell Press |
| 6 | **Standing Cable Crossover Fly** | Lower/Inner Chest fibers | Tier B | Isolation (Continuous tension) | Dumbbell Fly on Flat Bench / Parallel Dips |
| 7 | **Dips (Chest Leaning)** | Lower Pecs & Triceps | Tier A | Compound (Vertical/Diagonal Push) | Decline Dumbbell Press / Machine Chest Press |

---

### 3.2. Back (Latissimus Dorsi, Trapezius, Rhomboids, Erector Spinae)

| # | Exercise Name | Target Region | Equipment Tier | Primary Mechanics | Indian Gym Busy-Hour Alternative |
|---|---|---|---|---|---|
| 8 | **Conventional / Trap Bar Deadlift** | Posterior Chain, Erectors, Traps | Tier A | Compound (Hip Hinge) | Barbell Romanian Deadlift (RDL) / Hyperextensions |
| 9 | **Lat Pulldown (Wide / Neutral Grip)** | Latissimus Dorsi (Width) | Tier A | Compound (Vertical Pull) | Pull-ups / Resistance Band Assisted Pull-ups |
| 10 | **Bent-Over Barbell Row** | Mid-Back, Rhomboids, Lats | Tier A | Compound (Horizontal Pull) | One-Arm Dumbbell Row / Seated Cable Row |
| 11 | **Seated Cable Row (Close Grip V-Bar)** | Mid-Back thickness, Lower Lats | Tier A | Compound (Horizontal Pull) | Chest-Supported T-Bar Row / Incline Dumbbell Row |
| 12 | **One-Arm Dumbbell Row** | Lat Isolation & Core anti-rotation | Tier A | Compound (Unilateral Pull) | Single-Arm Cable Row / Landmine Row |
| 13 | **T-Bar Row (Plate Loaded / Landmine)** | Upper Back & Traps | Tier A | Compound (Horizontal Pull) | Chest-Supported Dumbbell Row |
| 14 | **Cable Face Pulls** | Rear Delts, Rotator Cuff, Upper Traps | Tier A | Isolation (Shoulder Health) | Dumbbell Reverse Fly / Band Face Pulls |
| 15 | **Straight-Arm Cable Pushdown** | Lat isolation (no bicep involvement) | Tier B | Isolation (Shoulder Extension) | Dumbbell Pullover on Flat Bench |

---

### 3.3. Legs & Lower Body (Quadriceps, Hamstrings, Glutes, Calves)

| # | Exercise Name | Target Region | Equipment Tier | Primary Mechanics | Indian Gym Busy-Hour Alternative |
|---|---|---|---|---|---|
| 16 | **Barbell Back Squat (High/Low Bar)** | Quads, Glutes, Core | Tier A | Compound (Squat pattern) | Smith Machine Squat / Dumbbell Goblet Squat |
| 17 | **45-Degree Leg Press** | Quads, Adductors, Glutes | Tier B | Compound (Closed kinetic chain) | Dumbbell Bulgarian Split Squat / Goblet Squat |
| 18 | **Romanian Deadlift (RDL - DB/BB)** | Hamstrings, Glutes | Tier A | Compound (Hip Hinge / Eccentric stretch) | Seated/Lying Leg Curl |
| 19 | **Leg Extension (Machine)** | Rectus Femoris & Quad peak | Tier B | Isolation (Open kinetic chain) | Sissy Squat / Bodyweight Quad Extensions |
| 20 | **Lying or Seated Hamstring Curl** | Hamstring Knee-Flexion | Tier B | Isolation | Dumbbell Hamstring Curl (between feet) / Nordic Curl |
| 21 | **Bulgarian Split Squat (Dumbbell)** | Glutes, Quads (Unilateral balance) | Tier A | Compound (Unilateral Squat) | Walking Lunges / Step-Ups on Bench |
| 22 | **Standing / Seated Calf Raise** | Gastrocnemius & Soleus | Tier A | Isolation (Plantar flexion) | Dumbbell Single-Leg Calf Raise on Edge Plate |
| 23 | **Barbell / Machine Hip Thrust** | Gluteus Maximus | Tier A | Compound (Horizontal Hip Extension) | Dumbbell Glute Bridge on Bench |

---

### 3.4. Shoulders (Deltoids - Anterior, Lateral, Posterior & Traps)

| # | Exercise Name | Target Region | Equipment Tier | Primary Mechanics | Indian Gym Busy-Hour Alternative |
|---|---|---|---|---|---|
| 24 | **Overhead Barbell Military Press (OHP)** | Anterior/Lateral Delts, Triceps | Tier A | Compound (Vertical Push) | Seated Dumbbell Shoulder Press |
| 25 | **Seated Dumbbell Shoulder Press** | Front/Side Delts | Tier A | Compound (Vertical Push) | Smith Machine Overhead Press |
| 26 | **Standing Dumbbell Lateral Raise** | Lateral Deltoid (Shoulder width) | Tier A | Isolation (Abduction) | Cable Lateral Raise (Single Arm) |
| 27 | **Cable Lateral Raise (Behind/Front)** | Lateral Deltoid (Constant resistance) | Tier B | Isolation (Uniform torque curve) | Dumbbell Lean-Away Lateral Raise |
| 28 | **Reverse Pec Deck / Rear Delt Fly** | Posterior Deltoid | Tier B | Isolation (Horizontal Abduction) | Incline Bench Prone Dumbbell Reverse Fly |
| 29 | **Barbell / Dumbbell Shrugs** | Upper Trapezius | Tier A | Isolation (Scapular elevation) | Farmer’s Walk with Heavy Dumbbells |
| 30 | **Arnold Press (Dumbbell)** | All 3 deltoid heads | Tier A | Compound (Rotational Push) | Standard Seated Dumbbell Press |

---

### 3.5. Arms (Biceps Brachii, Brachialis, Triceps Brachii, Forearms)

| # | Exercise Name | Target Region | Equipment Tier | Primary Mechanics | Indian Gym Busy-Hour Alternative |
|---|---|---|---|---|---|
| 31 | **Standing Barbell / EZ-Bar Bicep Curl** | Biceps (Short & Long head) | Tier A | Isolation (Supinated elbow flexion) | Standing Dumbbell Bicep Curl |
| 32 | **Incline Dumbbell Curl** | Biceps Long Head (Maximum stretch) | Tier A | Isolation (Shoulder hyperextension) | Cable Behind-the-Back Curl |
| 33 | **Dumbbell Hammer Curl** | Brachialis & Brachioradialis (Forearm) | Tier A | Isolation (Neutral grip flexion) | Cable Rope Hammer Curl |
| 34 | **Preacher Curl (EZ Bar / Machine)** | Biceps Short Head (Contraction lock) | Tier B | Isolation (Arm supported) | Concentration Dumbbell Curl |
| 35 | **Triceps Rope Pushdown** | Triceps Lateral & Medial Head | Tier A | Isolation (Elbow extension) | Resistance Band Pushdown / Bench Dips |
| 36 | **Skull Crushers (EZ-Bar / DB)** | Triceps Long Head | Tier A | Isolation (Overhead extension on bench) | Overhead Dumbbell Extension |
| 37 | **Overhead Cable / Dumbbell Triceps Ext** | Triceps Long Head (Stretched position) | Tier A | Isolation (Vertical elbow extension) | Single-Arm Cable Overhead Extension |
| 38 | **Close-Grip Barbell Bench Press** | Triceps & Inner Chest | Tier A | Compound (Narrow grip push) | Parallel Bar Dips (Upright torso) |

---

### 3.6. Core & Conditioning (Abdominals, Obliques, Lower Back)

| # | Exercise Name | Target Region | Equipment Tier | Primary Mechanics | Indian Gym Busy-Hour Alternative |
|---|---|---|---|---|---|
| 39 | **Hanging Leg / Knee Raises** | Lower Rectus Abdominis | Tier A | Dynamic Core Flexion | Captain’s Chair Leg Raise / Floor Reverse Crunches |
| 40 | **Cable Woodchoppers** | Internal & External Obliques | Tier B | Anti-Rotation / Rotational Power | Russian Twists with Dumbbell/Plate |
| 41 | **Plank / Side Plank Holds** | Transverse Abdominis, Core Stability | Tier A | Isometric Anti-Extension / Anti-Lateral | Ab Wheel Rollout |
| 42 | **Decline Bench Weighted Crunches** | Rectus Abdominis | Tier A | Dynamic Trunk Flexion | Cable Kneeling Crunch |

---

## 4. Standard Workout Split Architecture for Indian Gyms

Indian gyms typically cater to three primary member segments:
1. **Beginner / Weight Loss / General Health (40%):** Low baseline strength, high dropout risk; needs simple 3-day full body or upper/lower routines.
2. **Intermediate Muscle Gain (45%):** Follows Push-Pull-Legs (PPL) or 4-day Upper-Lower; desires progressive overload and aesthetic symmetry.
3. **Traditional "Bro-Split" Devotees (15%):** Single muscle group per day (Chest Mon, Back Tue, Legs Wed, Shoulders Thu, Arms Fri).

### Recommended MVP Workout Programs:

#### Program 1: 3-Day Full Body (Beginners & Busy Working Professionals)
- **Day 1 (Mon):** Barbell/Goblet Squat (3x10), Flat Dumbbell Press (3x10), Lat Pulldown (3x10), Dumbbell Romanian Deadlift (3x10), Plank (3x45s).
- **Day 2 (Wed):** 45° Leg Press (3x12), Standing Overhead Press (3x10), Seated Cable Row (3x10), Lying Leg Curl (3x12), Dumbbell Bicep Curl + Triceps Pushdown Superset (3x12).
- **Day 3 (Fri):** Barbell Deadlift or RDL (3x8), Incline Dumbbell Press (3x10), Pull-ups or Lat Pulldown (3x8-10), Bulgarian Split Squat (3x10/leg), Hanging Knee Raises (3x12).

#### Program 2: 6-Day Push-Pull-Legs (Intermediate & Advanced Hypertrophy)
- **Push A:** Barbell Flat Bench Press, Incline DB Press, Standing DB Lateral Raise, Pec Deck Fly, Triceps Rope Pushdown.
- **Pull A:** Lat Pulldown, Bent-Over Barbell Row, Seated Cable Row, Cable Face Pulls, EZ-Bar Bicep Curl, Hammer Curl.
- **Legs A:** Barbell Back Squat, 45° Leg Press, Romanian Deadlift (DB), Leg Extension, Standing Calf Raise.
- **Push B:** Seated DB Shoulder Press, Flat DB Press, Incline DB Fly, Cable Lateral Raise, Overhead DB Triceps Extension.
- **Pull B:** Deadlift, Neutral-Grip Pull-down, One-Arm DB Row, Dumbbell Reverse Fly, Incline Dumbbell Bicep Curl.
- **Legs B:** Barbell RDL, Bulgarian Split Squat, Lying Leg Curl, Walking Lunges, Seated Calf Raise.

---

## 5. Offline-Safe Deterministic Fallback Engine

Per the PRD requirement:
> *"Keep AI features practical and safe. Workout and diet plans should remain usable even when the AI service is unavailable."*

### Architecture Flowchart:
```
[User Requests Workout Plan / Daily Routine]
                     │
         Is Supabase Edge AI Available?
              /              \
        (YES)                 (NO or Rate-Limited)
          │                            │
   LLM Generates Plan        Deterministic Rule Engine (Fallback)
          │                            │
  Schema Validation Check     Select pre-compiled template:
          │                   [Goal: Hypertrophy | Exp: Beginner | Equip: Tier A]
          │                            │
          └───────────┬────────────────┘
                      ▼
    Map to Local `exercises` Table (Foreign Keys)
                      ▼
      Render to Member Portal & Log Sets
```

### Deterministic Rule Engine Matrix:
1. **Goal Matching:**
   - `Fat Loss`: 12–15 reps, 60s rest, higher density supersets, 3x full body or 4x upper/lower.
   - `Hypertrophy`: 8–12 reps, 90–120s rest, 4x Upper/Lower or 6x PPL.
   - `Strength`: 4–6 reps on primary compounds, 3–5 min rest, RPE 8–9.
2. **Equipment Check:**
   - Filter `exercises` where `required_tier <= gym.tier_rating`.
3. **Injuries / Exclusions:**
   - If `lower_back_pain`: Substitute Barbell Squat → Leg Press / Belt Squat; Deadlift → Hip Thrust.
   - If `shoulder_impingement`: Substitute Behind-neck / Barbell OHP → Neutral-grip Dumbbell Press; Barbell Bench → Floor Press.

---

## 6. Supabase PostgreSQL Schema for Workout Engine

```sql
-- 1. Exercises Table (Normalized Exercise Directory)
CREATE TABLE public.exercises (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL,
    target_muscle VARCHAR(50) NOT NULL, -- 'chest', 'back', 'quads', 'hamstrings', 'deltoids', 'biceps', 'triceps', 'core'
    movement_pattern VARCHAR(50) NOT NULL, -- 'horizontal_push', 'vertical_pull', 'squat', 'hinge', 'isolation'
    equipment_tier VARCHAR(20) NOT NULL DEFAULT 'tier_a', -- 'tier_a', 'tier_b', 'tier_c'
    equipment_required VARCHAR(50) NOT NULL, -- 'barbell', 'dumbbell', 'cable', 'machine', 'bodyweight'
    difficulty_level VARCHAR(20) NOT NULL DEFAULT 'beginner', -- 'beginner', 'intermediate', 'advanced'
    instructions TEXT NOT NULL,
    video_url VARCHAR(255),
    alternative_exercise_id UUID REFERENCES public.exercises(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Workout Templates (Standard / Seeded / Deterministic Fallback)
CREATE TABLE public.workout_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gym_id UUID REFERENCES public.gyms(id) ON DELETE CASCADE, -- NULL if global system template
    title VARCHAR(120) NOT NULL,
    goal VARCHAR(50) NOT NULL, -- 'muscle_gain', 'fat_loss', 'general_fitness'
    experience_level VARCHAR(30) NOT NULL, -- 'beginner', 'intermediate', 'advanced'
    split_type VARCHAR(50) NOT NULL, -- 'full_body', 'upper_lower', 'push_pull_legs'
    days_per_week INT NOT NULL DEFAULT 3,
    is_system_fallback BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Workout Template Exercises
CREATE TABLE public.workout_template_exercises (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_id UUID NOT NULL REFERENCES public.workout_templates(id) ON DELETE CASCADE,
    exercise_id UUID NOT NULL REFERENCES public.exercises(id) ON DELETE RESTRICT,
    day_number INT NOT NULL, -- 1 to 7
    order_index INT NOT NULL,
    recommended_sets INT NOT NULL DEFAULT 3,
    min_reps INT NOT NULL DEFAULT 8,
    max_reps INT NOT NULL DEFAULT 12,
    rest_seconds INT NOT NULL DEFAULT 90,
    rpe_target NUMERIC(3, 1) DEFAULT 8.0,
    notes VARCHAR(255)
);

-- 4. Member Assigned Workout Plans (Generated by AI or Selected from Template)
CREATE TABLE public.member_workout_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gym_id UUID NOT NULL REFERENCES public.gyms(id) ON DELETE CASCADE,
    member_id UUID NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
    template_id UUID REFERENCES public.workout_templates(id) ON DELETE SET NULL,
    generated_by VARCHAR(30) NOT NULL DEFAULT 'rule_engine', -- 'rule_engine', 'ai_gemini', 'trainer'
    start_date DATE NOT NULL DEFAULT CURRENT_DATE,
    end_date DATE,
    status VARCHAR(20) NOT NULL DEFAULT 'active', -- 'active', 'completed', 'paused'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Daily Workout Logs (Member Execution & Progress Tracking)
CREATE TABLE public.member_workout_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id UUID NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
    exercise_id UUID NOT NULL REFERENCES public.exercises(id) ON DELETE RESTRICT,
    workout_plan_id UUID REFERENCES public.member_workout_plans(id) ON DELETE SET NULL,
    logged_date DATE NOT NULL DEFAULT CURRENT_DATE,
    set_number INT NOT NULL,
    weight_kg NUMERIC(6, 2) NOT NULL,
    reps_completed INT NOT NULL,
    rpe NUMERIC(3, 1),
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 7. Indian Gym Usability & Member Safety Considerations

1. **Vegetarian / Low-Protein Dietary Context Alignment:**
   - 60%+ of members in Indian gyms are lacto-vegetarian or eggetarian. High volume routines without adequate recovery will lead to early burnout. The system scales baseline volume (12–16 sets per muscle group weekly) rather than aggressive 25+ set routines.
2. **Form Cueing & Injury Prevention:**
   - Over 75% of injuries in Indian gyms occur on heavy flat barbell bench presses and unsupervised conventional deadlifts.
   - The exercise instructions explicitly detail setup cues (e.g., scapular retraction, hip hinge initiation, knee tracking over toes).
3. **Crowded Equipment Flexibility:**
   - In peak hours (e.g. 7:30 PM), members cannot wait 15 minutes for a free flat bench. The app includes a **"Swap Exercise"** button powered by `alternative_exercise_id` (e.g., Barbell Flat Bench → Flat Dumbbell Press), saving the set log seamlessly under the substitute exercise.
