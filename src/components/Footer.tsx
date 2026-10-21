'use client';

import React from 'react';
import Link from 'next/link';
import { Clock } from 'lucide-react';
import { GymProMark } from './GymProLogo';
import { GymProfile } from '@/types';

interface FooterProps {
  gymProfile?: GymProfile;
}

export function Footer({ gymProfile }: FooterProps) {
  const gymName = gymProfile?.gymName || 'Alpha Fitness Gym';
  const primaryColor = gymProfile?.primaryColor || '#ccff00';

  return (
    <footer className="w-full py-14 border-t border-white/5 bg-[#07080a] text-zinc-400 text-xs font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 pb-10">
          {/* Logo Column */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 group mb-4">
              <GymProMark className="h-6 w-6 text-white group-hover:scale-105 transition-transform shrink-0" color={primaryColor} />
              <span className="font-extrabold text-xl tracking-tight text-white">
                Gym<span style={{ color: primaryColor }}>PRO</span>
              </span>
            </Link>
            <p className="text-[11px] text-zinc-500 leading-relaxed">
              Operating multi-tenant commercial strength arenas, Olympic power rigs, and automated reception desks across India.
            </p>
          </div>

          {/* Facilities */}
          <div>
            <h5 className="text-white font-bold tracking-wider mb-3 text-xs">Facilities</h5>
            <ul className="space-y-2 text-[11px]">
              <li>
                <a href="#facilities" className="hover:text-white transition-colors">
                  Olympic Power Racks
                </a>
              </li>
              <li>
                <a href="#facilities" className="hover:text-white transition-colors">
                  Free Weights Arena
                </a>
              </li>
              <li>
                <a href="#facilities" className="hover:text-white transition-colors">
                  MetCon Sprint Turf
                </a>
              </li>
              <li>
                <a href="#facilities" className="hover:text-[#ccff00] transition-colors">
                  Recovery Suite
                </a>
              </li>
            </ul>
          </div>

          {/* Programs */}
          <div>
            <h5 className="text-white font-bold tracking-wider mb-3 text-xs">Programs</h5>
            <ul className="space-y-2 text-[11px]">
              <li>
                <a href="#programs" className="hover:text-white transition-colors">
                  Strength & Hypertrophy
                </a>
              </li>
              <li>
                <a href="#programs" className="hover:text-white transition-colors">
                  Cardio Fat Oxidation
                </a>
              </li>
              <li>
                <a href="#programs" className="hover:text-white transition-colors">
                  Personal Training (1-on-1)
                </a>
              </li>
              <li>
                <a href="#programs" className="hover:text-white transition-colors">
                  Indian Nutrition Plans
                </a>
              </li>
            </ul>
          </div>

          {/* Admin & Member Portals */}
          <div>
            <h5 className="text-white font-bold tracking-wider mb-3 text-xs">Portals</h5>
            <ul className="space-y-2 text-[11px]">
              <li>
                <Link href="/admin" className="hover:text-[#ccff00] transition-colors font-semibold">
                  Admin Operations Console
                </Link>
              </li>
              <li>
                <Link href="/member" className="hover:text-white transition-colors">
                  Athlete Member Arena
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-white transition-colors">
                  WhatsApp Fee Reminders
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-white transition-colors">
                  Equipment AMC Monitor
                </Link>
              </li>
            </ul>
          </div>

          {/* Hours & Access */}
          <div>
            <h5 className="text-white font-bold tracking-wider mb-3 text-xs">Hours & Access</h5>
            <p className="text-[11px] text-zinc-400 mb-2 font-mono">
              Mon - Sat: 5:30 AM - 10:30 PM
              <br />
              Sun: 7:00 AM - 8:00 PM
            </p>
            <div className="flex items-center gap-2 mt-4 text-[#ccff00] text-[11px] font-bold">
              <Clock className="w-3.5 h-3.5" />
              <span>24/7 Biometric QR Enabled</span>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-500">
          <p>© 2026 GymPRO India. All rights reserved. • {gymName}</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-zinc-300 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-zinc-300 transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
