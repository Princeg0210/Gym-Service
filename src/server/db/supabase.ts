import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const isConfigured = Boolean(
  supabaseUrl &&
  supabaseKey &&
  !supabaseUrl.includes('YOUR_PROJECT_ID') &&
  !supabaseKey.includes('YOUR_SUPABASE_ANON_KEY')
);

export const supabase = isConfigured
  ? createClient(supabaseUrl!, supabaseKey!)
  : null;

export function isDbConnected(): boolean {
  return supabase !== null;
}
