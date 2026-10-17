'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Globe,
  Palette,
  Eye,
  CheckCircle2,
  ExternalLink,
  Plus,
  Trash2,
  Save,
  Copy,
  Smartphone,
  Monitor,
  X,
  Sparkles,
  HelpCircle,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GymProfile, GymCmsPlan, GymFeature } from '@/types';
import { gymApiClient } from '@/client/api/gymApiClient';
import { INITIAL_GYM_PROFILES } from '@/lib/mockGyms';

// Color Presets for quick 1-click theme customization
const COLOR_PRESETS = [
  { name: 'Neon Volt', primary: '#ccff00', accent: '#b8e600', secondary: '#121724' },
  { name: 'Cyber Cyan', primary: '#00e5ff', accent: '#00b4d8', secondary: '#0b192c' },
  { name: 'Crimson Fury', primary: '#ff3366', accent: '#e60049', secondary: '#1c1018' },
  { name: 'Electric Amber', primary: '#ffaa00', accent: '#f77f00', secondary: '#1e160a' },
  { name: 'Emerald Peak', primary: '#10b981', accent: '#059669', secondary: '#061a14' },
  { name: 'Ultra Violet', primary: '#a855f7', accent: '#9333ea', secondary: '#180e29' },
];

export function GymCmsManager() {
  const [gyms, setGyms] = useState<GymProfile[]>([]);
  const [selectedGymId, setSelectedGymId] = useState<string>('');
  const [currentGym, setCurrentGym] = useState<GymProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<'branding' | 'hero' | 'contact' | 'plans' | 'features'>('branding');
  const [showPreviewModal, setShowPreviewModal] = useState<boolean>(false);
  const [previewViewport, setPreviewViewport] = useState<'desktop' | 'mobile'>('desktop');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedUrl, setCopiedUrl] = useState<boolean>(false);

  const [draftGymIds, setDraftGymIds] = useState<Set<string>>(new Set());
  const [persistedGymIds, setPersistedGymIds] = useState<Set<string>>(new Set());

  // Load all gyms on mount
  useEffect(() => {
    async function loadGyms() {
      setIsLoading(true);
      try {
        const fetched = await gymApiClient.getGyms(false);
        if (fetched && fetched.length > 0) {
          setGyms(fetched);
          setSelectedGymId(fetched[0].id);
          setCurrentGym(JSON.parse(JSON.stringify(fetched[0])));
          setPersistedGymIds(new Set(fetched.map((g) => g.id)));
        } else {
          // Fallback to initial seeds
          setGyms(INITIAL_GYM_PROFILES);
          setSelectedGymId(INITIAL_GYM_PROFILES[0].id);
          setCurrentGym(JSON.parse(JSON.stringify(INITIAL_GYM_PROFILES[0])));
          setPersistedGymIds(new Set(INITIAL_GYM_PROFILES.map((g) => g.id)));
        }
      } catch (err) {
        console.warn('Falling back to local mock gym profiles:', err);
        setGyms(INITIAL_GYM_PROFILES);
        setSelectedGymId(INITIAL_GYM_PROFILES[0].id);
        setCurrentGym(JSON.parse(JSON.stringify(INITIAL_GYM_PROFILES[0])));
        setPersistedGymIds(new Set(INITIAL_GYM_PROFILES.map((g) => g.id)));
      } finally {
        setIsLoading(false);
      }
    }
    loadGyms();
  }, []);

  // When selected gym changes
  const handleSelectGym = (gymId: string) => {
    const gym = gyms.find((g) => g.id === gymId);
    if (gym) {
      setSelectedGymId(gym.id);
      setCurrentGym(JSON.parse(JSON.stringify(gym)));
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Handle generic field update
  const handleFieldChange = <K extends keyof GymProfile>(field: K, value: GymProfile[K]) => {
    if (!currentGym) return;
    setCurrentGym({
      ...currentGym,
      [field]: value
    });
  };

  // Add new gym
  const handleCreateNewGym = () => {
    const newId = `gym-${Date.now()}`;
    const newGym: GymProfile = {
      id: newId,
      slug: `branch-${gyms.length + 1}`,
      gymName: `Fitness Club ${gyms.length + 1}`,
      tagline: 'Strength Training, Free Weights & Personal Coaching',
      heroHeadline: 'NO EXCUSES.',
      heroHighlight: 'ONLY RESULTS.',
      heroSubtitle: 'Train with top-tier free weights, power racks, cardio equipment, and certified coaches focused on real transformations.',
      heroImageUrl: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=1400&q=80',
      logoUrl: '',
      primaryColor: '#ccff00',
      accentColor: '#b8e600',
      secondaryColor: '#121724',
      phone: '9876543210',
      email: 'info@gymclub.in',
      whatsappNumber: '919876543210',
      upiVpa: 'gymbranch@upi',
      address: 'Main Commercial Hub, 1st Floor',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001',
      operatingHours: 'Mon - Sat: 6:00 AM - 10:00 PM | Sun: 7:00 AM - 1:00 PM',
      isPublished: true,
      features: [
        { title: 'Certified Trainers', desc: 'Expert coaches for personalized strength and fat loss workouts.' },
        { title: 'Free Weights & Racks', desc: 'Olympic barbells, dumbbells up to 50kg, and cable stations.' },
        { title: 'Custom Diet Support', desc: 'High-protein meal guidance tailored to Indian food habits.' },
        { title: 'Supportive Community', desc: 'Friendly community of lifters focused on personal bests.' }
      ],
      programs: [
        { id: 'prog-1', title: 'Strength Training', category: 'strength', desc: 'Build muscle with compound barbell and dumbbell lifts.', intensity: 'High', duration: '60 min' }
      ],
      membershipPlans: [
        { id: 'plan-1', name: 'Monthly Basic', durationMonths: 1, feeInr: 1999, features: ['Full Gym Floor Access', 'Locker Room'] },
        { id: 'plan-3', name: 'Quarterly Pro', durationMonths: 3, feeInr: 4999, isPopular: true, features: ['Full Gym Access', '1 Free Trainer Session', 'Diet Plan'] },
        { id: 'plan-12', name: 'Annual Pass', durationMonths: 12, feeInr: 14999, features: ['Full Year Access', 'All Amenities', 'Guest Passes'] }
      ],
      trainers: [
        { name: 'Coach Dev', role: 'Head Trainer', spec: 'Strength & Conditioning', exp: '5 Years', rating: '4.9' }
      ],
      transformations: []
    };

    setGyms([...gyms, newGym]);
    setDraftGymIds((prev) => new Set(prev).add(newGym.id));
    setSelectedGymId(newGym.id);
    setCurrentGym(newGym);
    showToast(`Created draft for "${newGym.gymName}"! Enter your branding and click Save Changes.`);
  };

  // Save changes (POST for new drafts, PUT for existing gyms)
  const handleSaveGym = async () => {
    if (!currentGym) return;
    setIsSaving(true);
    try {
      // Validate slug
      const sanitizedSlug = currentGym.slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-');
      const updatedGym: GymProfile = {
        ...currentGym,
        slug: sanitizedSlug,
        updatedAt: new Date().toISOString()
      };

      const isNew = draftGymIds.has(currentGym.id) || !persistedGymIds.has(currentGym.id);
      let savedGym: GymProfile;

      if (isNew) {
        savedGym = await gymApiClient.createGym(updatedGym);
        setDraftGymIds((prev) => {
          const next = new Set(prev);
          next.delete(currentGym.id);
          return next;
        });
        setPersistedGymIds((prev) => new Set(prev).add(savedGym.id));
      } else {
        savedGym = await gymApiClient.updateGym(updatedGym.slug, updatedGym);
      }

      // Update local state
      setGyms(gyms.map((g) => (g.id === currentGym.id ? savedGym : g)));
      setSelectedGymId(savedGym.id);
      setCurrentGym(savedGym);
      showToast(`✓ Landing page for "${savedGym.gymName}" ${isNew ? 'created' : 'updated'} successfully!`);
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Error saving gym';
      console.error('Error saving gym:', err);
      showToast(`Failed to save: ${errorMsg}`);
    } finally {
      setIsSaving(false);
    }
  };

  // Copy public landing page URL
  const handleCopyUrl = () => {
    if (!currentGym) return;
    const url = `${window.location.origin}/gym/${currentGym.slug}`;
    navigator.clipboard.writeText(url);
    setCopiedUrl(true);
    showToast('Public link copied to clipboard!');
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center rounded-2xl border border-[#1e2433] bg-[#0c1017]">
        <div className="flex items-center gap-3 text-zinc-400">
          <RefreshCw className="h-5 w-5 animate-spin text-[#ccff00]" />
          <span className="text-sm font-medium">Loading Gym CMS & Tenant Configurations...</span>
        </div>
      </div>
    );
  }

  if (!currentGym) return null;

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2 rounded-xl border border-[#ccff00] bg-[#0c1017] px-4 py-3 text-xs font-bold text-white shadow-2xl">
          <CheckCircle2 className="h-4 w-4 text-[#ccff00]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          1. HEADER & TENANT SWITCHER BAR
      ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 rounded-2xl border border-[#1e2433] bg-[#0c1017] p-5 lg:flex-row lg:items-center lg:justify-between shadow-lg">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#ccff00] text-black font-black">
              <Globe className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
                Gym Landing CMS & Tenant Customizer
                <span className="rounded-full border border-blue-500/40 bg-blue-500/10 px-2 py-0.5 text-[10px] font-mono font-bold text-blue-400">
                  MULTI-TENANT
                </span>
              </h2>
              <p className="text-xs text-zinc-400 font-medium">
                Customize public landing pages, color schemes, pricing, contact details & URLs per gym branch.
              </p>
            </div>
          </div>

          {/* Gym Branch Selector Pills */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-zinc-400 mr-1">Active Gym:</span>
            {gyms.map((g) => (
              <button
                key={g.id}
                onClick={() => handleSelectGym(g.id)}
                className={`flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                  selectedGymId === g.id
                    ? 'bg-[#ccff00] text-black shadow-md'
                    : 'border border-[#202738] bg-[#121724] text-zinc-300 hover:border-zinc-500 hover:text-white'
                }`}
              >
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: g.primaryColor }}
                />
                <span>{g.gymName}</span>
                {g.isPublished ? (
                  <span className="text-[10px] text-emerald-950 font-black px-1 rounded bg-emerald-400/80">
                    LIVE
                  </span>
                ) : (
                  <span className="text-[10px] text-zinc-400 font-black px-1 rounded bg-zinc-800">
                    DRAFT
                  </span>
                )}
              </button>
            ))}

            <button
              onClick={handleCreateNewGym}
              className="flex items-center gap-1.5 rounded-xl border border-dashed border-[#303b52] bg-[#101522] px-3 py-1.5 text-xs font-bold text-zinc-300 hover:border-[#ccff00] hover:text-[#ccff00] transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Gym Branch</span>
            </button>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5 pt-2 lg:pt-0">
          {/* Copy URL */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyUrl}
            className="border-[#202738] bg-[#121724] text-xs font-bold text-zinc-200 hover:text-white"
          >
            <Copy className="h-3.5 w-3.5 mr-1.5 text-[#ccff00]" />
            <span>{copiedUrl ? 'Copied!' : 'Copy Public URL'}</span>
          </Button>

          {/* Open Public Page */}
          <Link
            href={`/gym/${currentGym.slug}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#202738] bg-[#121724] px-3 py-1.5 text-xs font-bold text-zinc-200 hover:border-zinc-500 hover:text-white transition-colors"
          >
            <ExternalLink className="h-3.5 w-3.5 text-[#ccff00]" />
            <span>View Live</span>
          </Link>

          {/* Live Preview Modal Button */}
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowPreviewModal(true)}
            className="bg-[#1b2333] text-xs font-bold text-white hover:bg-[#253046]"
          >
            <Eye className="h-3.5 w-3.5 mr-1.5 text-blue-400" />
            <span>Preview</span>
          </Button>

          {/* Save Button */}
          <Button
            variant="volt"
            size="sm"
            onClick={handleSaveGym}
            disabled={isSaving}
            className="font-black text-xs"
          >
            {isSaving ? (
              <>
                <RefreshCw className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="h-3.5 w-3.5 mr-1.5" />
                <span>Save Changes</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. EDITOR SUB-NAVIGATION TABS
      ───────────────────────────────────────────────────────────── */}
      <div className="flex border-b border-[#1b2333] gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveSection('branding')}
          className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-xs font-bold transition-all whitespace-nowrap ${
            activeSection === 'branding'
              ? 'border-[#ccff00] text-[#ccff00]'
              : 'border-transparent text-zinc-400 hover:text-white'
          }`}
        >
          <Palette className="h-4 w-4" />
          <span>Brand, Colors & URL</span>
        </button>

        <button
          onClick={() => setActiveSection('hero')}
          className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-xs font-bold transition-all whitespace-nowrap ${
            activeSection === 'hero'
              ? 'border-[#ccff00] text-[#ccff00]'
              : 'border-transparent text-zinc-400 hover:text-white'
          }`}
        >
          <Sparkles className="h-4 w-4" />
          <span>Hero Content & Image</span>
        </button>

        <button
          onClick={() => setActiveSection('contact')}
          className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-xs font-bold transition-all whitespace-nowrap ${
            activeSection === 'contact'
              ? 'border-[#ccff00] text-[#ccff00]'
              : 'border-transparent text-zinc-400 hover:text-white'
          }`}
        >
          <Globe className="h-4 w-4" />
          <span>Contact, UPI & Location</span>
        </button>

        <button
          onClick={() => setActiveSection('plans')}
          className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-xs font-bold transition-all whitespace-nowrap ${
            activeSection === 'plans'
              ? 'border-[#ccff00] text-[#ccff00]'
              : 'border-transparent text-zinc-400 hover:text-white'
          }`}
        >
          <Badge className="h-3.5 w-3.5 p-0 bg-transparent text-current" />
          <span>Membership Plans ({currentGym.membershipPlans?.length || 0})</span>
        </button>

        <button
          onClick={() => setActiveSection('features')}
          className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-xs font-bold transition-all whitespace-nowrap ${
            activeSection === 'features'
              ? 'border-[#ccff00] text-[#ccff00]'
              : 'border-transparent text-zinc-400 hover:text-white'
          }`}
        >
          <HelpCircle className="h-4 w-4" />
          <span>Why Train With Us ({currentGym.features?.length || 0})</span>
        </button>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. TAB CONTENT EDITORS
      ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Form Fields (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">

          {/* ── SECTION: BRANDING & COLORS ── */}
          {activeSection === 'branding' && (
            <div className="space-y-6 rounded-2xl border border-[#1e2433] bg-[#0c1017] p-6 shadow-md">
              <div className="border-b border-[#1b2333] pb-4">
                <h3 className="text-base font-black text-white">Brand Identity & Visual Theme</h3>
                <p className="text-xs text-zinc-400">
                  Configure gym naming, unique URL slug, and brand color palette applied across the public showcase.
                </p>
              </div>

              {/* Publish Toggle */}
              <div className="flex items-center justify-between rounded-xl border border-[#202738] bg-[#101522] p-4">
                <div>
                  <p className="text-xs font-bold text-white">Public Landing Page Status</p>
                  <p className="text-xs text-zinc-400">
                    {currentGym.isPublished
                      ? 'Page is live and accessible to visitors at /gym/' + currentGym.slug
                      : 'Page is in draft mode. Visitors will see a Coming Soon notice.'}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-black ${
                      currentGym.isPublished
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                    }`}
                  >
                    {currentGym.isPublished ? 'PUBLISHED' : 'DRAFT'}
                  </span>
                  <button
                    onClick={() => handleFieldChange('isPublished', !currentGym.isPublished)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      currentGym.isPublished ? 'bg-[#ccff00]' : 'bg-zinc-700'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-black transition-transform ${
                        currentGym.isPublished ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Gym Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-300">Gym Name *</label>
                  <input
                    type="text"
                    value={currentGym.gymName}
                    onChange={(e) => handleFieldChange('gymName', e.target.value)}
                    className="w-full rounded-xl border border-[#202738] bg-[#121724] px-3.5 py-2.5 text-xs font-medium text-white outline-none focus:border-[#ccff00]"
                    placeholder="e.g. IronPulse Commercial Gym"
                  />
                </div>

                {/* URL Slug */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-300">
                    URL Slug * (public path: /gym/{currentGym.slug})
                  </label>
                  <div className="flex items-center rounded-xl border border-[#202738] bg-[#121724] px-3.5 py-2.5">
                    <span className="text-xs text-zinc-400 font-mono">/gym/</span>
                    <input
                      type="text"
                      value={currentGym.slug}
                      onChange={(e) =>
                        handleFieldChange(
                          'slug',
                          e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '')
                        )
                      }
                      className="w-full bg-transparent text-xs font-mono font-bold text-[#ccff00] outline-none pl-1"
                      placeholder="ironpulse"
                    />
                  </div>
                </div>

                {/* Tagline */}
                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-xs font-bold text-zinc-300">Tagline / Motto</label>
                  <input
                    type="text"
                    value={currentGym.tagline}
                    onChange={(e) => handleFieldChange('tagline', e.target.value)}
                    className="w-full rounded-xl border border-[#202738] bg-[#121724] px-3.5 py-2.5 text-xs font-medium text-white outline-none focus:border-[#ccff00]"
                    placeholder="e.g. High-Performance Commercial Gym & Biomechanics Arena"
                  />
                </div>

                {/* Logo URL */}
                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-xs font-bold text-zinc-300">Logo Image URL (Optional)</label>
                  <input
                    type="text"
                    value={currentGym.logoUrl || ''}
                    onChange={(e) => handleFieldChange('logoUrl', e.target.value)}
                    className="w-full rounded-xl border border-[#202738] bg-[#121724] px-3.5 py-2.5 text-xs font-medium text-white outline-none focus:border-[#ccff00]"
                    placeholder="https://example.com/logo.png"
                  />
                </div>
              </div>

              {/* Color Customization */}
              <div className="space-y-4 pt-2 border-t border-[#1b2333]">
                <label className="text-xs font-bold text-zinc-300">Quick Palette Presets</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {COLOR_PRESETS.map((preset) => (
                    <button
                      key={preset.name}
                      onClick={() => {
                        handleFieldChange('primaryColor', preset.primary);
                        handleFieldChange('accentColor', preset.accent);
                        handleFieldChange('secondaryColor', preset.secondary);
                      }}
                      className={`flex items-center gap-2.5 rounded-xl border p-2.5 text-left transition-all ${
                        currentGym.primaryColor === preset.primary
                          ? 'border-[#ccff00] bg-[#161d2d]'
                          : 'border-[#202738] bg-[#101522] hover:border-zinc-500'
                      }`}
                    >
                      <div
                        className="h-5 w-5 rounded-lg border border-black/30 shadow-inner shrink-0"
                        style={{ backgroundColor: preset.primary }}
                      />
                      <span className="text-xs font-bold text-white">{preset.name}</span>
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-400">Primary Color</label>
                    <div className="flex items-center gap-2 rounded-xl border border-[#202738] bg-[#121724] p-2">
                      <input
                        type="color"
                        value={currentGym.primaryColor}
                        onChange={(e) => handleFieldChange('primaryColor', e.target.value)}
                        className="h-7 w-7 rounded cursor-pointer bg-transparent border-0"
                      />
                      <input
                        type="text"
                        value={currentGym.primaryColor}
                        onChange={(e) => handleFieldChange('primaryColor', e.target.value)}
                        className="w-full bg-transparent text-xs font-mono text-white outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-400">Accent Color</label>
                    <div className="flex items-center gap-2 rounded-xl border border-[#202738] bg-[#121724] p-2">
                      <input
                        type="color"
                        value={currentGym.accentColor}
                        onChange={(e) => handleFieldChange('accentColor', e.target.value)}
                        className="h-7 w-7 rounded cursor-pointer bg-transparent border-0"
                      />
                      <input
                        type="text"
                        value={currentGym.accentColor}
                        onChange={(e) => handleFieldChange('accentColor', e.target.value)}
                        className="w-full bg-transparent text-xs font-mono text-white outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-400">Dark Secondary Card</label>
                    <div className="flex items-center gap-2 rounded-xl border border-[#202738] bg-[#121724] p-2">
                      <input
                        type="color"
                        value={currentGym.secondaryColor}
                        onChange={(e) => handleFieldChange('secondaryColor', e.target.value)}
                        className="h-7 w-7 rounded cursor-pointer bg-transparent border-0"
                      />
                      <input
                        type="text"
                        value={currentGym.secondaryColor}
                        onChange={(e) => handleFieldChange('secondaryColor', e.target.value)}
                        className="w-full bg-transparent text-xs font-mono text-white outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── SECTION: HERO CONTENT ── */}
          {activeSection === 'hero' && (
            <div className="space-y-6 rounded-2xl border border-[#1e2433] bg-[#0c1017] p-6 shadow-md">
              <div className="border-b border-[#1b2333] pb-4">
                <h3 className="text-base font-black text-white">Hero Section & Visual Impact</h3>
                <p className="text-xs text-zinc-400">
                  The initial viewport headline, motivational subtitle, and hero athlete imagery.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-300">Hero Main Headline *</label>
                  <input
                    type="text"
                    value={currentGym.heroHeadline}
                    onChange={(e) => handleFieldChange('heroHeadline', e.target.value)}
                    className="w-full rounded-xl border border-[#202738] bg-[#121724] px-3.5 py-2.5 text-xs font-medium text-white outline-none focus:border-[#ccff00]"
                    placeholder="NO EXCUSES."
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-300">Hero Highlight Line (Colored) *</label>
                  <input
                    type="text"
                    value={currentGym.heroHighlight}
                    onChange={(e) => handleFieldChange('heroHighlight', e.target.value)}
                    className="w-full rounded-xl border border-[#202738] bg-[#121724] px-3.5 py-2.5 text-xs font-medium text-white outline-none focus:border-[#ccff00]"
                    placeholder="ONLY RESULTS."
                  />
                </div>

                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-xs font-bold text-zinc-300">Hero Subtitle Paragraph</label>
                  <textarea
                    rows={3}
                    value={currentGym.heroSubtitle}
                    onChange={(e) => handleFieldChange('heroSubtitle', e.target.value)}
                    className="w-full rounded-xl border border-[#202738] bg-[#121724] px-3.5 py-2.5 text-xs font-medium text-white outline-none focus:border-[#ccff00]"
                    placeholder="Join a results-driven fitness community..."
                  />
                </div>

                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-xs font-bold text-zinc-300">Hero Background / Athlete Image URL</label>
                  <input
                    type="text"
                    value={currentGym.heroImageUrl}
                    onChange={(e) => handleFieldChange('heroImageUrl', e.target.value)}
                    className="w-full rounded-xl border border-[#202738] bg-[#121724] px-3.5 py-2.5 text-xs font-medium text-white outline-none focus:border-[#ccff00]"
                    placeholder="https://images.unsplash.com/..."
                  />
                </div>
              </div>

              {/* Live Preview Thumbnail */}
              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold text-zinc-400">Hero Banner Preview</span>
                <div
                  className="relative h-44 w-full overflow-hidden rounded-xl border border-[#202738] p-5 flex flex-col justify-end"
                  style={{
                    backgroundImage: `linear-gradient(to top, rgba(6,7,9,0.92) 20%, rgba(6,7,9,0.4) 100%), url(${currentGym.heroImageUrl})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  <div className="relative z-10">
                    <h4 className="text-2xl font-black uppercase text-white leading-tight">
                      {currentGym.heroHeadline}{' '}
                      <span style={{ color: currentGym.primaryColor }}>{currentGym.heroHighlight}</span>
                    </h4>
                    <p className="text-xs text-zinc-300 line-clamp-2 max-w-lg mt-1 font-medium">
                      {currentGym.heroSubtitle}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── SECTION: CONTACT, UPI & LOCATION ── */}
          {activeSection === 'contact' && (
            <div className="space-y-6 rounded-2xl border border-[#1e2433] bg-[#0c1017] p-6 shadow-md">
              <div className="border-b border-[#1b2333] pb-4">
                <h3 className="text-base font-black text-white">Contact Info, UPI Billing & Location</h3>
                <p className="text-xs text-zinc-400">
                  These details power WhatsApp reminders, 1-click UPI payments, and footer contact cards.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Phone */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-300">Front Desk Phone *</label>
                  <input
                    type="text"
                    value={currentGym.phone}
                    onChange={(e) => handleFieldChange('phone', e.target.value)}
                    className="w-full rounded-xl border border-[#202738] bg-[#121724] px-3.5 py-2.5 text-xs font-medium text-white outline-none focus:border-[#ccff00]"
                    placeholder="9876543210"
                  />
                </div>

                {/* WhatsApp */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-300">WhatsApp Number (with country code) *</label>
                  <input
                    type="text"
                    value={currentGym.whatsappNumber}
                    onChange={(e) => handleFieldChange('whatsappNumber', e.target.value)}
                    className="w-full rounded-xl border border-[#202738] bg-[#121724] px-3.5 py-2.5 text-xs font-medium text-white outline-none focus:border-[#ccff00]"
                    placeholder="919876543210"
                  />
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-300">Contact Email</label>
                  <input
                    type="email"
                    value={currentGym.email}
                    onChange={(e) => handleFieldChange('email', e.target.value)}
                    className="w-full rounded-xl border border-[#202738] bg-[#121724] px-3.5 py-2.5 text-xs font-medium text-white outline-none focus:border-[#ccff00]"
                    placeholder="info@gymdomain.com"
                  />
                </div>

                {/* UPI VPA */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-300">
                    UPI VPA (for auto QR & payment links) *
                  </label>
                  <input
                    type="text"
                    value={currentGym.upiVpa}
                    onChange={(e) => handleFieldChange('upiVpa', e.target.value)}
                    className="w-full rounded-xl border border-[#202738] bg-[#121724] px-3.5 py-2.5 text-xs font-mono font-bold text-[#ccff00] outline-none focus:border-[#ccff00]"
                    placeholder="gymname@upi"
                  />
                </div>

                {/* Address */}
                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-xs font-bold text-zinc-300">Full Physical Address</label>
                  <input
                    type="text"
                    value={currentGym.address}
                    onChange={(e) => handleFieldChange('address', e.target.value)}
                    className="w-full rounded-xl border border-[#202738] bg-[#121724] px-3.5 py-2.5 text-xs font-medium text-white outline-none focus:border-[#ccff00]"
                    placeholder="Plot 42, 27th Main, Sector 1, HSR Layout"
                  />
                </div>

                {/* City */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-300">City</label>
                  <input
                    type="text"
                    value={currentGym.city}
                    onChange={(e) => handleFieldChange('city', e.target.value)}
                    className="w-full rounded-xl border border-[#202738] bg-[#121724] px-3.5 py-2.5 text-xs font-medium text-white outline-none focus:border-[#ccff00]"
                    placeholder="Bengaluru"
                  />
                </div>

                {/* State */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-300">State</label>
                  <input
                    type="text"
                    value={currentGym.state}
                    onChange={(e) => handleFieldChange('state', e.target.value)}
                    className="w-full rounded-xl border border-[#202738] bg-[#121724] px-3.5 py-2.5 text-xs font-medium text-white outline-none focus:border-[#ccff00]"
                    placeholder="Karnataka"
                  />
                </div>

                {/* Operating Hours */}
                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-xs font-bold text-zinc-300">Operating Hours</label>
                  <input
                    type="text"
                    value={currentGym.operatingHours}
                    onChange={(e) => handleFieldChange('operatingHours', e.target.value)}
                    className="w-full rounded-xl border border-[#202738] bg-[#121724] px-3.5 py-2.5 text-xs font-medium text-white outline-none focus:border-[#ccff00]"
                    placeholder="Mon - Sat: 5:30 AM - 10:30 PM | Sun: 6:00 AM - 1:00 PM"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ── SECTION: MEMBERSHIP PLANS ── */}
          {activeSection === 'plans' && (
            <div className="space-y-6 rounded-2xl border border-[#1e2433] bg-[#0c1017] p-6 shadow-md">
              <div className="flex items-center justify-between border-b border-[#1b2333] pb-4">
                <div>
                  <h3 className="text-base font-black text-white">Membership Plans & Pricing</h3>
                  <p className="text-xs text-zinc-400">
                    Plans displayed on the public landing page with fees, duration & features.
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="volt"
                  onClick={() => {
                    const newPlan: GymCmsPlan = {
                      id: `plan-${Date.now()}`,
                      name: 'Special Pass',
                      durationMonths: 3,
                      feeInr: 3999,
                      features: ['Gym Access', 'Locker Usage']
                    };
                    handleFieldChange('membershipPlans', [...(currentGym.membershipPlans || []), newPlan]);
                  }}
                  className="text-xs font-bold"
                >
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  <span>Add Plan</span>
                </Button>
              </div>

              <div className="space-y-4">
                {(currentGym.membershipPlans || []).map((plan, idx) => (
                  <div
                    key={plan.id}
                    className="rounded-xl border border-[#202738] bg-[#101522] p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#ccff00]/10 text-xs font-bold text-[#ccff00]">
                          {idx + 1}
                        </span>
                        <input
                          type="text"
                          value={plan.name}
                          onChange={(e) => {
                            const updated = [...(currentGym.membershipPlans || [])];
                            updated[idx].name = e.target.value;
                            handleFieldChange('membershipPlans', updated);
                          }}
                          className="rounded-lg border border-[#263147] bg-[#161d2d] px-2.5 py-1 text-xs font-bold text-white outline-none focus:border-[#ccff00]"
                          placeholder="Plan Name"
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <label className="flex items-center gap-1.5 text-xs text-zinc-400 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={Boolean(plan.isPopular)}
                            onChange={(e) => {
                              const updated = [...(currentGym.membershipPlans || [])];
                              updated[idx].isPopular = e.target.checked;
                              handleFieldChange('membershipPlans', updated);
                            }}
                            className="rounded accent-[#ccff00]"
                          />
                          <span>Most Popular</span>
                        </label>
                        <button
                          onClick={() => {
                            const updated = currentGym.membershipPlans.filter((_, i) => i !== idx);
                            handleFieldChange('membershipPlans', updated);
                          }}
                          className="text-zinc-500 hover:text-red-400 p-1 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="text-[10px] font-bold text-zinc-400">Duration (Months)</label>
                        <input
                          type="number"
                          value={plan.durationMonths}
                          onChange={(e) => {
                            const updated = [...(currentGym.membershipPlans || [])];
                            updated[idx].durationMonths = Number(e.target.value) || 1;
                            handleFieldChange('membershipPlans', updated);
                          }}
                          className="w-full rounded-lg border border-[#263147] bg-[#161d2d] px-2.5 py-1 text-xs font-mono text-white outline-none focus:border-[#ccff00]"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-zinc-400">Fee (INR ₹)</label>
                        <input
                          type="number"
                          value={plan.feeInr}
                          onChange={(e) => {
                            const updated = [...(currentGym.membershipPlans || [])];
                            updated[idx].feeInr = Number(e.target.value) || 0;
                            handleFieldChange('membershipPlans', updated);
                          }}
                          className="w-full rounded-lg border border-[#263147] bg-[#161d2d] px-2.5 py-1 text-xs font-mono font-bold text-[#ccff00] outline-none focus:border-[#ccff00]"
                        />
                      </div>

                      <div className="col-span-2 sm:col-span-1">
                        <label className="text-[10px] font-bold text-zinc-400">Features (comma-separated)</label>
                        <input
                          type="text"
                          value={plan.features.join(', ')}
                          onChange={(e) => {
                            const updated = [...(currentGym.membershipPlans || [])];
                            updated[idx].features = e.target.value.split(',').map((s) => s.trim()).filter(Boolean);
                            handleFieldChange('membershipPlans', updated);
                          }}
                          className="w-full rounded-lg border border-[#263147] bg-[#161d2d] px-2.5 py-1 text-xs text-white outline-none focus:border-[#ccff00]"
                          placeholder="Cardio access, Locker, Diet..."
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── SECTION: WHY TRAIN WITH US (FEATURES) ── */}
          {activeSection === 'features' && (
            <div className="space-y-6 rounded-2xl border border-[#1e2433] bg-[#0c1017] p-6 shadow-md">
              <div className="border-b border-[#1b2333] pb-4">
                <h3 className="text-base font-black text-white">Why Train With Us (Features)</h3>
                <p className="text-xs text-zinc-400">
                  Value proposition highlights that convince prospects to enroll.
                </p>
              </div>

              <div className="space-y-4">
                {(currentGym.features || []).map((feat, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-[#202738] bg-[#101522] p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-zinc-400">Feature #{idx + 1}</span>
                      <button
                        onClick={() => {
                          const updated = currentGym.features.filter((_, i) => i !== idx);
                          handleFieldChange('features', updated);
                        }}
                        className="text-zinc-500 hover:text-red-400 p-1 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="space-y-2">
                      <input
                        type="text"
                        value={feat.title}
                        onChange={(e) => {
                          const updated = [...(currentGym.features || [])];
                          updated[idx].title = e.target.value;
                          handleFieldChange('features', updated);
                        }}
                        className="w-full rounded-lg border border-[#263147] bg-[#161d2d] px-2.5 py-1.5 text-xs font-bold text-white outline-none focus:border-[#ccff00]"
                        placeholder="Feature Title (e.g. Certified Trainers)"
                      />
                      <textarea
                        rows={2}
                        value={feat.desc}
                        onChange={(e) => {
                          const updated = [...(currentGym.features || [])];
                          updated[idx].desc = e.target.value;
                          handleFieldChange('features', updated);
                        }}
                        className="w-full rounded-lg border border-[#263147] bg-[#161d2d] px-2.5 py-1.5 text-xs text-zinc-300 outline-none focus:border-[#ccff00]"
                        placeholder="Feature Description..."
                      />
                    </div>
                  </div>
                ))}

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    const newFeat: GymFeature = {
                      title: 'New Value Prop',
                      desc: 'Describe what sets this gym apart from competitors.'
                    };
                    handleFieldChange('features', [...(currentGym.features || []), newFeat]);
                  }}
                  className="w-full text-xs font-bold border-[#202738] text-zinc-300 hover:text-white"
                >
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  <span>Add Another Feature</span>
                </Button>
              </div>
            </div>
          )}

        </div>

        {/* Right Column: Live Mini Preview Card & Public Summary (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Tenant Summary Card */}
          <div className="rounded-2xl border border-[#1e2433] bg-[#0c1017] p-5 space-y-4 shadow-md">
            <h4 className="text-xs font-black uppercase tracking-wider text-zinc-400">
              Active Tenant Card
            </h4>

            <div
              className="rounded-xl border p-4 space-y-3"
              style={{
                backgroundColor: currentGym.secondaryColor || '#121724',
                borderColor: `${currentGym.primaryColor}40`
              }}
            >
              <div className="flex items-center justify-between">
                <span
                  className="text-xs font-black tracking-wide uppercase px-2 py-0.5 rounded"
                  style={{
                    backgroundColor: `${currentGym.primaryColor}20`,
                    color: currentGym.primaryColor
                  }}
                >
                  {currentGym.city} BRANCH
                </span>
                <span className="text-[10px] font-mono text-zinc-400">ID: {currentGym.id}</span>
              </div>

              <div>
                <h5 className="text-lg font-black text-white">{currentGym.gymName}</h5>
                <p className="text-xs text-zinc-300 line-clamp-1">{currentGym.tagline}</p>
              </div>

              <div className="pt-2 border-t border-white/10 space-y-1.5 text-xs text-zinc-300">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Public URL:</span>
                  <span className="font-mono text-[#ccff00]">/gym/{currentGym.slug}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">UPI VPA:</span>
                  <span className="font-mono text-white">{currentGym.upiVpa}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">WhatsApp:</span>
                  <span className="font-mono text-white">+{currentGym.whatsappNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Plans Active:</span>
                  <span className="font-bold text-white">{currentGym.membershipPlans?.length || 0}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPreviewModal(true)}
                className="w-full border-[#202738] bg-[#101522] text-xs font-bold text-zinc-200 hover:text-white"
              >
                <Eye className="h-3.5 w-3.5 mr-1.5 text-blue-400" />
                <span>Open Responsive Preview</span>
              </Button>

              <Link
                href={`/gym/${currentGym.slug}`}
                target="_blank"
                className="w-full flex items-center justify-center gap-1.5 rounded-xl border border-[#202738] bg-[#121724] py-2 text-xs font-bold text-zinc-200 hover:text-white hover:border-[#ccff00] transition-colors"
              >
                <ExternalLink className="h-3.5 w-3.5 text-[#ccff00]" />
                <span>Visit Landing Page</span>
              </Link>
            </div>
          </div>

          {/* Quick Help Card */}
          <div className="rounded-2xl border border-[#1e2433] bg-[#0c1017] p-4 text-xs space-y-2 text-zinc-400">
            <p className="font-bold text-white flex items-center gap-1.5">
              <Globe className="h-3.5 w-3.5 text-[#ccff00]" />
              Multi-Tenant Architecture
            </p>
            <p>
              Each gym has its own public landing page with customized branding, hero imagery, and membership plans.
            </p>
            <p>
              When a visitor navigates to <span className="font-mono text-[#ccff00]">/gym/{currentGym.slug}</span>, the app automatically adopts this gym&apos;s brand theme, UPI VPA for payment reminders, and contact coordinates.
            </p>
          </div>
        </div>

      </div>

      {/* ─────────────────────────────────────────────────────────────
          4. INTERACTIVE RESPONSIVE PREVIEW MODAL
      ───────────────────────────────────────────────────────────── */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="flex h-[90vh] w-full max-w-6xl flex-col rounded-2xl border border-[#1e2433] bg-[#07090d] shadow-2xl overflow-hidden">
            
            {/* Modal Bar */}
            <div className="flex items-center justify-between border-b border-[#1b2333] bg-[#0c1017] px-6 py-3">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-white">Live CMS Preview:</span>
                <span className="font-mono text-xs text-[#ccff00]">/gym/{currentGym.slug}</span>
                <Badge variant="outline" className="text-[10px] font-mono">
                  {currentGym.isPublished ? 'PUBLIC' : 'DRAFT'}
                </Badge>
              </div>

              {/* Viewport Toggles */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPreviewViewport('desktop')}
                  className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold transition-all ${
                    previewViewport === 'desktop'
                      ? 'bg-[#ccff00] text-black'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <Monitor className="h-3.5 w-3.5" />
                  <span>Desktop</span>
                </button>

                <button
                  onClick={() => setPreviewViewport('mobile')}
                  className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold transition-all ${
                    previewViewport === 'mobile'
                      ? 'bg-[#ccff00] text-black'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <Smartphone className="h-3.5 w-3.5" />
                  <span>Mobile</span>
                </button>

                <button
                  onClick={() => setShowPreviewModal(false)}
                  className="rounded-lg p-1 text-zinc-400 hover:text-white ml-2 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Preview Viewport Frame */}
            <div className="flex-1 overflow-y-auto bg-[#040608] p-4 flex justify-center">
              <div
                className={`transition-all duration-300 bg-[#060709] border border-[#1e2433] rounded-2xl overflow-y-auto shadow-2xl ${
                  previewViewport === 'mobile' ? 'w-[375px]' : 'w-full max-w-5xl'
                }`}
                style={{
                  minHeight: '750px'
                }}
              >
                {/* Simulated Header */}
                <div className="flex items-center justify-between border-b border-[#1b2333] px-6 py-4 bg-[#080b11]">
                  <div className="flex items-center gap-2">
                    <span
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: currentGym.primaryColor }}
                    />
                    <span className="font-black text-white text-base">
                      {currentGym.gymName}
                    </span>
                  </div>
                  <span
                    className="text-xs font-bold px-3 py-1 rounded-full text-black font-black"
                    style={{ backgroundColor: currentGym.primaryColor }}
                  >
                    Join Now
                  </span>
                </div>

                {/* Simulated Hero */}
                <div
                  className="relative p-8 md:p-14 text-white overflow-hidden flex flex-col justify-center min-h-[360px]"
                  style={{
                    backgroundImage: `linear-gradient(to right, rgba(6,7,9,0.95) 45%, rgba(6,7,9,0.5) 100%), url(${currentGym.heroImageUrl})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  <div className="max-w-xl space-y-4">
                    <h1 className="text-3xl md:text-5xl font-black uppercase leading-tight tracking-tight">
                      {currentGym.heroHeadline}{' '}
                      <span style={{ color: currentGym.primaryColor }}>
                        {currentGym.heroHighlight}
                      </span>
                    </h1>
                    <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                      {currentGym.heroSubtitle}
                    </p>
                    <div className="flex items-center gap-3 pt-2">
                      <button
                        className="rounded-xl px-5 py-2.5 text-xs font-black text-black shadow-lg"
                        style={{ backgroundColor: currentGym.primaryColor }}
                      >
                        Book Free Trial
                      </button>
                      <button className="rounded-xl border border-white/20 px-5 py-2.5 text-xs font-bold text-white hover:bg-white/10">
                        View Membership Plans
                      </button>
                    </div>
                  </div>
                </div>

                {/* Simulated Plans */}
                <div className="p-8 space-y-6">
                  <div className="text-center space-y-1">
                    <h3 className="text-xl font-black text-white">Membership Plans</h3>
                    <p className="text-xs text-zinc-400">Choose the ideal duration for your physique transformation</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {(currentGym.membershipPlans || []).map((p) => (
                      <div
                        key={p.id}
                        className={`rounded-2xl border p-5 space-y-4 flex flex-col justify-between ${
                          p.isPopular
                            ? 'border-[#ccff00] bg-[#121724]'
                            : 'border-[#1e2433] bg-[#0c1017]'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-zinc-300">{p.name}</span>
                            {p.isPopular && (
                              <span
                                className="text-[10px] font-black uppercase px-2 py-0.5 rounded text-black"
                                style={{ backgroundColor: currentGym.primaryColor }}
                              >
                                POPULAR
                              </span>
                            )}
                          </div>
                          <div className="mt-2">
                            <span className="text-2xl font-black text-white">₹{p.feeInr.toLocaleString('en-IN')}</span>
                            <span className="text-xs text-zinc-400"> / {p.durationMonths} mo</span>
                          </div>
                          <ul className="mt-4 space-y-1.5 text-xs text-zinc-300">
                            {p.features.map((f, i) => (
                              <li key={i} className="flex items-center gap-2">
                                <CheckCircle2 className="h-3.5 w-3.5" style={{ color: currentGym.primaryColor }} />
                                <span>{f}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <button
                          className="w-full rounded-xl py-2 text-xs font-black text-black"
                          style={{ backgroundColor: currentGym.primaryColor }}
                        >
                          Select Plan
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Simulated Footer */}
                <div className="border-t border-[#1b2333] p-6 text-center text-xs text-zinc-400 space-y-1 bg-[#080b11]">
                  <p className="font-bold text-white">{currentGym.gymName} • {currentGym.city}</p>
                  <p>{currentGym.address} | Hours: {currentGym.operatingHours}</p>
                  <p className="text-zinc-500">Powered by GymPRO Multi-Tenant Operating Engine</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
