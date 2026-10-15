'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Lock, ShieldCheck, ArrowRight, Home, AlertCircle, Dumbbell } from 'lucide-react';

interface AdminAuthGuardProps {
  children: React.ReactNode;
}

export function AdminAuthGuard({ children }: AdminAuthGuardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    try {
      return sessionStorage.getItem('gympro_admin_auth') === 'true';
    } catch {
      return false;
    }
  });
  const [passcode, setPasscode] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  const CORRECT_PIN = process.env.NEXT_PUBLIC_ADMIN_PIN || 'admin123';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode.trim() === CORRECT_PIN) {
      try {
        sessionStorage.setItem('gympro_admin_auth', 'true');
        document.cookie = 'admin_session=active; path=/; max-age=86400; SameSite=Lax';
      } catch {
        // ignore
      }
      setIsAuthenticated(true);
      setErrorMsg('');
    } else {
      setErrorMsg('Invalid authorization passkey. Please check credentials.');
    }
  };

  const handleLogout = () => {
    try {
      sessionStorage.removeItem('gympro_admin_auth');
      document.cookie = 'admin_session=; path=/; max-age=0; SameSite=Lax';
    } catch {
      // ignore
    }
    setIsAuthenticated(false);
    setPasscode('');
  };

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#060709] px-4">
        <div className="w-full max-w-md rounded-2xl border border-[#1e2330] bg-[#0c1017] p-8 shadow-2xl backdrop-blur-md">
          {/* Header */}
          <div className="flex flex-col items-center text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#ccff00] text-black shadow-lg">
              <Dumbbell className="h-6 w-6" />
            </div>
            <div className="mt-4 flex items-center gap-1.5">
              <span className="font-black text-xl text-white">
                Gym<span className="text-[#ccff00]">PRO</span>
              </span>
              <span className="rounded-md border border-[#232b3d] bg-[#121724] px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                Staff Only
              </span>
            </div>
            <h1 className="mt-2 text-base font-bold text-zinc-100">
              Admin Operations Console
            </h1>
            <p className="mt-1 text-xs text-zinc-400">
              Enter your managerial authorization passkey to access member accounts, billing, and operational desk.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Manager Passkey / Staff PIN
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={passcode}
                  onChange={(e) => {
                    setPasscode(e.target.value);
                    if (errorMsg) setErrorMsg('');
                  }}
                  placeholder="Enter staff passkey..."
                  autoFocus
                  className="w-full rounded-xl border border-[#232b3d] bg-[#121724] px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-[#ccff00] focus:outline-hidden focus:ring-1 focus:ring-[#ccff00]"
                />
                <div className="absolute right-3 top-2.5 text-zinc-500">
                  <Lock className="h-4 w-4" />
                </div>
              </div>
            </div>

            {errorMsg && (
              <div className="flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 p-2.5 text-xs text-red-400">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#ccff00] py-2.5 text-xs font-bold text-black transition-all hover:bg-[#b8e600] active:scale-98 shadow-md"
            >
              <ShieldCheck className="h-4 w-4" />
              <span>Unlock Admin Console</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>

            {/* Demo Helper Badge */}
            <div className="rounded-xl border border-[#232b3d]/60 bg-[#07090d] p-3 text-center">
              <p className="text-[11px] text-zinc-400">
                Default Demo Passkey:{' '}
                <span className="font-mono font-bold text-[#ccff00]">admin123</span>
              </p>
            </div>
          </form>

          {/* Footer Back Link */}
          <div className="mt-6 border-t border-[#1e2330] pt-4 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors"
            >
              <Home className="h-3.5 w-3.5" />
              <span>Return to Club Showcase</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Session Lock Quick Action Floating Badge */}
      <div className="fixed top-3 right-4 z-50 hidden md:block">
        <button
          onClick={handleLogout}
          title="Sign out of Admin Session"
          className="flex items-center gap-1.5 rounded-xl border border-[#232b3d] bg-[#07090d]/90 px-3 py-1.5 text-[11px] font-semibold text-zinc-400 backdrop-blur-md transition-all hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-400 shadow-md"
        >
          <Lock className="h-3 w-3" />
          <span>Lock Console</span>
        </button>
      </div>
      {children}
    </div>
  );
}
