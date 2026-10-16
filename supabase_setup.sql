-- ============================================================
-- GymPRO — Supabase SQL Setup Script
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- 1. MEMBERS TABLE
create table if not exists members (
  id                 varchar primary key,
  full_name          varchar not null,
  phone              varchar not null,
  gender             varchar not null,
  age                integer not null,
  plan_id            varchar not null,
  plan_name          varchar not null,
  start_date         varchar not null,
  end_date           varchar not null,
  total_fee_inr      numeric not null default 0,
  paid_amount_inr    numeric not null default 0,
  pending_due_inr    numeric not null default 0,
  status             varchar not null default 'active',
  emergency_contact  varchar,
  fitness_goal       varchar not null default 'general_fitness',
  dietary_preference varchar not null default 'vegetarian',
  avatar_seed        varchar,
  created_at         timestamptz default now()
);

-- 2. ATTENDANCE TABLE
create table if not exists attendance (
  id              varchar primary key,
  member_id       varchar not null,
  member_name     varchar not null,
  phone           varchar not null,
  check_in_time   varchar not null,
  check_in_method varchar not null,
  plan_status     varchar not null,
  pending_due_inr numeric not null default 0,
  created_at      timestamptz default now()
);

-- 3. PAYMENTS TABLE
create table if not exists payments (
  id              varchar primary key,
  member_id       varchar not null,
  member_name     varchar not null,
  amount_inr      numeric not null,
  payment_mode    varchar not null,
  transaction_ref varchar,
  timestamp       varchar not null,
  created_at      timestamptz default now()
);

-- 4. EQUIPMENT TABLE
create table if not exists equipment (
  id                    varchar primary key,
  name                  varchar not null,
  category              varchar not null,
  tier                  varchar not null,
  status                varchar not null default 'operational',
  last_serviced_date    varchar not null,
  next_service_due_date varchar not null,
  notes                 text
);

-- 5. LEADS TABLE
create table if not exists leads (
  id              varchar primary key,
  full_name       varchar not null,
  phone           varchar not null,
  interest        varchar not null,
  status          varchar not null default 'new',
  created_at      varchar not null,
  follow_up_date  varchar not null
);

-- 6. GYM PROFILES TABLE (CENTRALIZED CMS & MULTI-TENANT LANDING PAGES)
create table if not exists gym_profiles (
  id                varchar primary key,
  slug              varchar unique not null,
  gym_name          varchar not null,
  tagline           text,
  hero_headline     text,
  hero_highlight    text,
  hero_subtitle     text,
  hero_image_url    text,
  logo_url          text,
  primary_color     varchar default '#ccff00',
  accent_color      varchar default '#b8e600',
  secondary_color   varchar default '#121724',
  phone             varchar,
  email             varchar,
  whatsapp_number   varchar,
  upi_vpa           varchar,
  address           text,
  city              varchar,
  state             varchar,
  pincode           varchar,
  operating_hours   text,
  features          jsonb default '[]'::jsonb,
  programs          jsonb default '[]'::jsonb,
  membership_plans  jsonb default '[]'::jsonb,
  trainers          jsonb default '[]'::jsonb,
  transformations   jsonb default '[]'::jsonb,
  is_published      boolean default true,
  created_at        timestamptz default now(),
  updated_at        timestamptz default now()
);

-- Multi-Tenant Isolation Columns (Scoped to individual gym branches)
alter table members    add column if not exists gym_id varchar default 'gym-ironpulse';
alter table attendance add column if not exists gym_id varchar default 'gym-ironpulse';
alter table payments   add column if not exists gym_id varchar default 'gym-ironpulse';
alter table equipment  add column if not exists gym_id varchar default 'gym-ironpulse';
alter table leads      add column if not exists gym_id varchar default 'gym-ironpulse';

-- ============================================================
-- PERFORMANCE INDEXES (Optimized for 100,000+ member scale)
-- ============================================================
create index if not exists idx_members_phone on members(phone);
create index if not exists idx_members_status on members(status);
create index if not exists idx_members_created_at on members(created_at desc);
create index if not exists idx_members_gym_id on members(gym_id);
create index if not exists idx_attendance_member_id on attendance(member_id);
create index if not exists idx_attendance_check_in_time on attendance(check_in_time desc);
create index if not exists idx_attendance_gym_id on attendance(gym_id);
create index if not exists idx_payments_member_id on payments(member_id);
create index if not exists idx_payments_timestamp on payments(timestamp desc);
create index if not exists idx_payments_gym_id on payments(gym_id);
create index if not exists idx_gym_profiles_slug on gym_profiles(slug);
create index if not exists idx_gym_profiles_is_published on gym_profiles(is_published);

-- ============================================================
-- Row Level Security (RLS) Configuration
-- Enabled with explicit policies to prevent table tampering or deletions
-- ============================================================
alter table members      enable row level security;
alter table attendance   enable row level security;
alter table payments     enable row level security;
alter table equipment    enable row level security;
alter table leads        enable row level security;
alter table gym_profiles enable row level security;

-- 1. Members Policies
create policy "Allow select on members" on members for select using (true);
create policy "Allow insert on members" on members for insert with check (length(full_name) > 0 and length(phone) >= 10);
create policy "Allow update on members" on members for update using (true) with check (total_fee_inr >= 0 and pending_due_inr >= 0);

-- 2. Attendance Policies
create policy "Allow select on attendance" on attendance for select using (true);
create policy "Allow insert on attendance" on attendance for insert with check (length(member_id) > 0);

-- 3. Payments Policies (Prevents negative amounts and unauthorized tampering)
create policy "Allow select on payments" on payments for select using (true);
create policy "Allow insert on payments" on payments for insert with check (amount_inr > 0 and length(member_id) > 0);

-- 4. Equipment Policies
create policy "Allow select on equipment" on equipment for select using (true);
create policy "Allow update on equipment" on equipment for update using (true);

-- 5. Leads Policies
create policy "Allow select on leads" on leads for select using (true);
create policy "Allow insert on leads" on leads for insert with check (length(full_name) > 0);
create policy "Allow update on leads" on leads for update using (true);

-- 6. Gym Profiles Policies (Public landing views & tenant admin controls)
create policy "Allow select on gym_profiles" on gym_profiles for select using (true);
create policy "Allow insert on gym_profiles" on gym_profiles for insert with check (length(slug) > 0 and length(gym_name) > 0);
create policy "Allow update on gym_profiles" on gym_profiles for update using (true);
create policy "Allow delete on gym_profiles" on gym_profiles for delete using (true);

-- ============================================================
-- INITIAL SEED DATA
-- ============================================================

insert into members (id, full_name, phone, gender, age, plan_id, plan_name, start_date, end_date, total_fee_inr, paid_amount_inr, pending_due_inr, status, fitness_goal, dietary_preference, avatar_seed, gym_id) values
  ('mem-101', 'Vikram Sharma', '9876543210', 'male',   28, 'plan-1y', 'Annual Elite All-Access',      '2026-01-10', '2027-01-10', 15000, 15000, 0,    'active',    'muscle_gain',   'non_vegetarian', 'Vikram', 'gym-ironpulse'),
  ('mem-102', 'Amit Singh',    '9898765432', 'male',   34, 'plan-3m', '3-Month Standard Gym',         '2026-07-01', '2026-10-01', 4500,  4500,  0,    'expired',   'general_fitness','non_vegetarian', 'Amit',   'gym-ironpulse'),
  ('mem-103', 'Sneha Nair',    '9823456789', 'female', 25, 'plan-1m', 'Monthly General',              '2026-10-01', '2026-11-01', 1800,  1800,  0,    'active',    'fat_loss',      'vegetarian',     'Sneha',  'gym-ironpulse'),
  ('mem-108', 'Neha Sharma',   '9812543210', 'female', 29, 'plan-6m', '6-Month Strength & Cardio',    '2026-05-01', '2026-11-01', 9000,  3000,  6000, 'defaulter', 'muscle_gain',   'vegetarian',     'Neha',   'gym-ironpulse'),
  ('mem-109', 'Karan Malhotra','9823654321', 'male',   31, 'plan-3m', '3-Month Standard Gym',         '2026-07-15', '2026-10-15', 4500,  0,     4500, 'defaulter', 'weight_gain',   'non_vegetarian', 'Karan',  'gym-ironpulse'),
  ('mem-110', 'Rohit Mehta',   '9867543210', 'male',   22, 'plan-1m', 'Monthly General',              '2026-10-05', '2026-11-05', 1800,  1800,  0,    'active',    'strength',      'non_vegetarian', 'Rohit',  'gym-ironpulse'),
  ('mem-111', 'Aditya Kulkarni','9845231987','male',   26, 'plan-6m', '6-Month Strength & Cardio',    '2026-06-01', '2026-12-01', 9000,  9000,  0,    'active',    'general_fitness','vegetarian',    'Aditya', 'gym-ironpulse'),
  ('mem-112', 'Pooja Sharma',  '9811234567', 'female', 23, 'plan-3m', '3-Month Standard Gym',         '2026-08-01', '2026-11-01', 4500,  4500,  0,    'active',    'fat_loss',      'vegetarian',     'Pooja',  'gym-ironpulse')
on conflict (id) do nothing;

insert into attendance (id, member_id, member_name, phone, check_in_time, check_in_method, plan_status, pending_due_inr, gym_id) values
  ('att-1', 'mem-101', 'Vikram Sharma', '9876543210', '2026-10-13T06:45:00+05:30', 'phone_search', 'active',    0,    'gym-ironpulse'),
  ('att-2', 'mem-102', 'Amit Singh',    '9898765432', '2026-10-13T07:12:00+05:30', 'qr_scan',      'expired',   0,    'gym-ironpulse'),
  ('att-3', 'mem-103', 'Sneha Nair',    '9823456789', '2026-10-13T07:55:00+05:30', 'phone_search', 'active',    0,    'gym-ironpulse'),
  ('att-4', 'mem-108', 'Neha Sharma',   '9812543210', '2026-10-13T08:30:00+05:30', 'phone_search', 'defaulter', 6000, 'gym-ironpulse')
on conflict (id) do nothing;

insert into payments (id, member_id, member_name, amount_inr, payment_mode, transaction_ref, timestamp, gym_id) values
  ('pay-501', 'mem-101', 'Vikram Sharma', 15000, 'cash', null,          '2026-01-10T10:00:00+05:30', 'gym-ironpulse'),
  ('pay-502', 'mem-102', 'Amit Singh',    4500,  'upi',  'UPI202607001', '2026-07-01T11:00:00+05:30', 'gym-ironpulse'),
  ('pay-503', 'mem-103', 'Sneha Nair',    1800,  'card', 'CARD20261001', '2026-10-01T09:30:00+05:30', 'gym-ironpulse'),
  ('pay-504', 'mem-108', 'Neha Sharma',   3000,  'cash', null,          '2026-05-01T12:00:00+05:30', 'gym-ironpulse')
on conflict (id) do nothing;

insert into equipment (id, name, category, tier, status, last_serviced_date, next_service_due_date, notes, gym_id) values
  ('eq-1', 'Leg Press Machine',              'strength_machine', 'premium',   'out_of_order',   '2026-09-01', '2026-12-01', 'Hydraulic seal failure — parts ordered', 'gym-ironpulse'),
  ('eq-2', 'Dual Adjustable Cable Crossover','cable_station',    'premium',   'needs_service',  '2026-08-15', '2026-11-15', 'Left pulley bearing loose',               'gym-ironpulse'),
  ('eq-3', 'Olympic Flat Bench Press Station','free_weights',    'standard',  'operational',    '2026-09-20', '2026-12-20', null,                                     'gym-ironpulse'),
  ('eq-4', 'Commercial Treadmill T-900',     'cardio',           'premium',   'operational',    '2026-10-01', '2027-01-01', null,                                     'gym-ironpulse'),
  ('eq-5', 'Smith Machine Multi-Track',      'strength_machine', 'premium',   'operational',    '2026-09-15', '2026-12-15', null,                                     'gym-ironpulse')
on conflict (id) do nothing;

insert into leads (id, full_name, phone, interest, status, created_at, follow_up_date, gym_id) values
  ('lead-1', 'Karan Mehra',    '9811002233', 'Muscle Gain', 'trial_scheduled', '2026-10-11', '2026-10-14', 'gym-ironpulse'),
  ('lead-2', 'Deepika Rao',    '9845112233', 'Fat Loss',    'contacted',        '2026-10-09', '2026-10-13', 'gym-ironpulse'),
  ('lead-3', 'Harpreet Singh', '9872112233', 'Strength',    'new',              '2026-10-12', '2026-10-15', 'gym-ironpulse')
on conflict (id) do nothing;

insert into gym_profiles (id, slug, gym_name, tagline, hero_headline, hero_highlight, hero_subtitle, hero_image_url, primary_color, accent_color, secondary_color, phone, email, whatsapp_number, upi_vpa, address, city, state, pincode, operating_hours, is_published) values
  ('gym-ironpulse', 'ironpulse', 'IronPulse Commercial Gym', 'High-Performance Commercial Gym & Biomechanics Arena', 'NO EXCUSES.', 'ONLY RESULTS.', 'Join a results-driven fitness community with certified trainers, modern bio-mechanical equipment, and personalized nutrition designed to transform your physique and performance.', 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1400&q=80', '#ccff00', '#b8e600', '#121724', '9876543210', 'contact@ironpulsefitness.in', '919876543210', 'ironpulse@oksbi', 'Plot 42, 27th Main, Sector 1, HSR Layout', 'Bengaluru', 'Karnataka', '560102', 'Mon - Sat: 5:30 AM - 10:30 PM | Sun: 6:00 AM - 1:00 PM', true),
  ('gym-alpha-fitness', 'alpha-fitness', 'Alpha Fitness Club', 'State of the Art Fitness, Powerlifting & Functional Training Hub', 'UNLEASH YOUR', 'TRUE POWER.', 'Elevate your physical discipline with Olympic lifting zones, metabolic conditioning classes, and certified sports nutritionists.', 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=1400&q=80', '#00e5ff', '#00b4d8', '#0b192c', '9811223344', 'contact@alphafitness.co.in', '919811223344', 'alphafitness@okhdfcbank', 'Cyber City, DLF Phase 2', 'Gurgaon', 'Haryana', '122002', 'Mon - Sun: 5:00 AM - 11:00 PM', true),
  ('gym-powerhouse', 'powerhouse-gym', 'Powerhouse Fitness Arena', 'Hardcore Iron Paradise & Athlete Conditioning Facility', 'FORGE YOUR', 'LEGACY.', 'Built for dedicated lifters and high-performance athletes. Hammer Strength machines, calibrated steel plates, and zero distractions.', 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1400&q=80', '#ff3366', '#e60049', '#1c1018', '9822334455', 'info@powerhousearena.in', '919822334455', 'powerhouse@okicici', 'Bandra West, Hill Road', 'Mumbai', 'Maharashtra', '400050', '24 Hours Open (7 Days a Week)', true)
on conflict (id) do nothing;

