export const serverConfig = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '',
  supabaseKey:
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
  adminPasskey: process.env.ADMIN_PASSKEY || '2026',
  isProduction: process.env.NODE_ENV === 'production',
  port: Number(process.env.PORT) || 3000
};

export function validateServerConfig(): boolean {
  return Boolean(serverConfig.supabaseUrl && serverConfig.supabaseKey);
}
