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

-- ============================================================
-- SEED DATA (initial records — same as what was in Neon)
-- ============================================================

insert into members (id, full_name, phone, gender, age, plan_id, plan_name, start_date, end_date, total_fee_inr, paid_amount_inr, pending_due_inr, status, fitness_goal, dietary_preference, avatar_seed) values
  ('mem-101', 'Vikram Sharma', '9876543210', 'male',   28, 'plan-1y', 'Annual Elite All-Access',      '2026-01-10', '2027-01-10', 15000, 15000, 0,    'active',    'muscle_gain',   'non_vegetarian', 'Vikram'),
  ('mem-102', 'Amit Singh',    '9898765432', 'male',   34, 'plan-3m', '3-Month Standard Gym',         '2026-07-01', '2026-10-01', 4500,  4500,  0,    'expired',   'general_fitness','non_vegetarian', 'Amit'),
  ('mem-103', 'Sneha Nair',    '9823456789', 'female', 25, 'plan-1m', 'Monthly General',              '2026-10-01', '2026-11-01', 1800,  1800,  0,    'active',    'fat_loss',      'vegetarian',     'Sneha'),
  ('mem-108', 'Neha Sharma',   '9812543210', 'female', 29, 'plan-6m', '6-Month Strength & Cardio',    '2026-05-01', '2026-11-01', 9000,  3000,  6000, 'defaulter', 'muscle_gain',   'vegetarian',     'Neha'),
  ('mem-109', 'Karan Malhotra','9823654321', 'male',   31, 'plan-3m', '3-Month Standard Gym',         '2026-07-15', '2026-10-15', 4500,  0,     4500, 'defaulter', 'weight_gain',   'non_vegetarian', 'Karan'),
  ('mem-110', 'Rohit Mehta',   '9867543210', 'male',   22, 'plan-1m', 'Monthly General',              '2026-10-05', '2026-11-05', 1800,  1800,  0,    'active',    'strength',      'non_vegetarian', 'Rohit'),
  ('mem-111', 'Aditya Kulkarni','9845231987','male',   26, 'plan-6m', '6-Month Strength & Cardio',    '2026-06-01', '2026-12-01', 9000,  9000,  0,    'active',    'general_fitness','vegetarian',    'Aditya'),
  ('mem-112', 'Pooja Sharma',  '9811234567', 'female', 23, 'plan-3m', '3-Month Standard Gym',         '2026-08-01', '2026-11-01', 4500,  4500,  0,    'active',    'fat_loss',      'vegetarian',     'Pooja')
on conflict (id) do nothing;

insert into attendance (id, member_id, member_name, phone, check_in_time, check_in_method, plan_status, pending_due_inr) values
  ('att-1', 'mem-101', 'Vikram Sharma', '9876543210', '2026-10-13T06:45:00+05:30', 'phone_search', 'active',    0),
  ('att-2', 'mem-102', 'Amit Singh',    '9898765432', '2026-10-13T07:12:00+05:30', 'qr_scan',      'expired',   0),
  ('att-3', 'mem-103', 'Sneha Nair',    '9823456789', '2026-10-13T07:55:00+05:30', 'phone_search', 'active',    0),
  ('att-4', 'mem-108', 'Neha Sharma',   '9812543210', '2026-10-13T08:30:00+05:30', 'phone_search', 'defaulter', 6000)
on conflict (id) do nothing;

insert into payments (id, member_id, member_name, amount_inr, payment_mode, transaction_ref, timestamp) values
  ('pay-501', 'mem-101', 'Vikram Sharma', 15000, 'cash', null,          '2026-01-10T10:00:00+05:30'),
  ('pay-502', 'mem-102', 'Amit Singh',    4500,  'upi',  'UPI202607001', '2026-07-01T11:00:00+05:30'),
  ('pay-503', 'mem-103', 'Sneha Nair',    1800,  'card', 'CARD20261001', '2026-10-01T09:30:00+05:30'),
  ('pay-504', 'mem-108', 'Neha Sharma',   3000,  'cash', null,          '2026-05-01T12:00:00+05:30')
on conflict (id) do nothing;

insert into equipment (id, name, category, tier, status, last_serviced_date, next_service_due_date, notes) values
  ('eq-1', 'Leg Press Machine',              'strength_machine', 'premium',   'out_of_order',   '2026-09-01', '2026-12-01', 'Hydraulic seal failure — parts ordered'),
  ('eq-2', 'Dual Adjustable Cable Crossover','cable_station',    'premium',   'needs_service',  '2026-08-15', '2026-11-15', 'Left pulley bearing loose'),
  ('eq-3', 'Olympic Flat Bench Press Station','free_weights',    'standard',  'operational',    '2026-09-20', '2026-12-20', null),
  ('eq-4', 'Commercial Treadmill T-900',     'cardio',           'premium',   'operational',    '2026-10-01', '2027-01-01', null),
  ('eq-5', 'Smith Machine Multi-Track',      'strength_machine', 'premium',   'operational',    '2026-09-15', '2026-12-15', null)
on conflict (id) do nothing;

insert into leads (id, full_name, phone, interest, status, created_at, follow_up_date) values
  ('lead-1', 'Karan Mehra',    '9811002233', 'Muscle Gain', 'trial_scheduled', '2026-10-11', '2026-10-14'),
  ('lead-2', 'Deepika Rao',    '9845112233', 'Fat Loss',    'contacted',        '2026-10-09', '2026-10-13'),
  ('lead-3', 'Harpreet Singh', '9872112233', 'Strength',    'new',              '2026-10-12', '2026-10-15')
on conflict (id) do nothing;

-- ============================================================
-- DISABLE Row Level Security for dev (enable it in production!)
-- ============================================================
alter table members    disable row level security;
alter table attendance disable row level security;
alter table payments   disable row level security;
alter table equipment  disable row level security;
alter table leads      disable row level security;
