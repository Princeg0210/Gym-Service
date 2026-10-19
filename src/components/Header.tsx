'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Search,
  User,
  ShoppingBag,
  Menu,
  X,
  LayoutDashboard
} from 'lucide-react';
import { GymProfile } from '@/types';

interface HeaderProps {
  currentMode?: 'showcase' | 'operations' | 'member_portal';
  onModeChange?: (mode: 'showcase' | 'operations' | 'member_portal') => void;
  onResetData?: () => void;
  gymProfile?: GymProfile;
  onBookFreeTrial?: () => void;
}

export function Header({ gymProfile, onBookFreeTrial }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const primaryColor = gymProfile?.primaryColor || '#ccff00';

  const navLinks = [
    { label: 'MEN', href: '#men' },
    { label: 'WOMEN', href: '#women' },
    { label: 'ACCESSORIES', href: '#accessories' },
    { label: 'COLLECTIONS', href: '#collections' },
    { label: 'SALE', href: '#sale', isHighlight: true }
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.08] bg-[#0a0a0c]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Brand Logo: Exact Image 1 `/// MOVE` */}
        <Link href="/" className="flex items-center gap-1.5 group focus:outline-none">
          <span
            className="font-black tracking-tighter text-2xl group-hover:scale-105 transition-transform"
            style={{ color: primaryColor }}
          >
            ///
          </span>
          <span className="font-black text-2xl tracking-tight text-white uppercase">MOVE</span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-bold tracking-wider uppercase text-zinc-300">
          {navLinks.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className={`transition-colors ${
                item.isHighlight ? 'text-[#ccff00] hover:brightness-110' : 'hover:text-white'
              }`}
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Right Utilities: Search, Account / Admin, Cart (2) */}
        <div className="flex items-center gap-3 sm:gap-4 text-zinc-300">
          <button
            onClick={() => alert('Search MOVE apparel collection')}
            className="p-1.5 hover:text-white transition-colors"
            title="Search"
            aria-label="Search"
          >
            <Search className="w-5 h-5 stroke-[1.8]" />
          </button>

          {/* User Profile -> Jump to Admin Dashboard */}
          <Link
            href="/admin"
            className="p-1.5 hover:text-[#ccff00] transition-colors relative flex items-center gap-1 text-xs"
            title="Admin Operations Console"
            aria-label="Admin Operations Console"
          >
            <User className="w-5 h-5 stroke-[1.8]" />
            <span className="hidden xl:inline text-[10px] font-mono uppercase bg-white/10 px-1.5 py-0.5 rounded text-zinc-300">
              Admin
            </span>
          </Link>

          {/* Shopping Bag with (2) Badge */}
          <button
            onClick={() => alert('Shopping Bag: 2 items active')}
            className="p-1.5 hover:text-white transition-colors relative"
            title="Cart (2)"
            aria-label="Cart"
          >
            <ShoppingBag className="w-5 h-5 stroke-[1.8]" />
            <span
              className="absolute -top-1 -right-1 h-4 w-4 rounded-full text-black text-[10px] font-black flex items-center justify-center shadow-sm"
              style={{ backgroundColor: primaryColor }}
            >
              2
            </span>
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden h-8 w-8 inline-flex items-center justify-center rounded-lg border border-white/10 bg-white/5 text-zinc-300 hover:text-white"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#0a0a0c] px-5 py-5 space-y-4 shadow-2xl">
          <nav className="flex flex-col space-y-2 text-xs font-bold tracking-wider uppercase text-zinc-300">
            {navLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3 hover:bg-white/10 transition-colors ${
                  item.isHighlight ? 'text-[#ccff00]' : 'hover:text-white'
                }`}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="pt-2 border-t border-white/10">
            <Link
              href="/admin"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full h-11 inline-flex items-center justify-center gap-2 rounded-xl text-xs font-black uppercase tracking-wider text-black shadow-md transition-all active:scale-95"
              style={{ backgroundColor: primaryColor }}
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>Open Admin Operations Desk</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
