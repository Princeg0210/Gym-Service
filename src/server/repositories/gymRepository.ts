import { GymProfile } from '@/types';
import { supabase } from '../db/supabase';
import { INITIAL_GYM_PROFILES } from '@/lib/mockGyms';

// In-memory runtime cache for seamless offline and non-migrated fallback
let localGymProfiles: GymProfile[] = [...INITIAL_GYM_PROFILES];

export interface GymProfileRow {
  id: string;
  slug: string;
  gym_name: string;
  tagline: string;
  hero_headline: string;
  hero_highlight: string;
  hero_subtitle: string;
  hero_image_url: string;
  logo_url?: string | null;
  primary_color: string;
  accent_color: string;
  secondary_color: string;
  phone: string;
  email: string;
  whatsapp_number: string;
  upi_vpa: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  operating_hours: string;
  features: unknown;
  programs: unknown;
  membership_plans: unknown;
  trainers: unknown;
  transformations: unknown;
  is_published: boolean;
  created_at?: string;
  updated_at?: string;
}

function rowToGymProfile(row: GymProfileRow): GymProfile {
  return {
    id: row.id,
    slug: row.slug,
    gymName: row.gym_name,
    tagline: row.tagline,
    heroHeadline: row.hero_headline,
    heroHighlight: row.hero_highlight,
    heroSubtitle: row.hero_subtitle,
    heroImageUrl: row.hero_image_url,
    logoUrl: row.logo_url || undefined,
    primaryColor: row.primary_color || '#ccff00',
    accentColor: row.accent_color || '#b8e600',
    secondaryColor: row.secondary_color || '#121724',
    phone: row.phone,
    email: row.email,
    whatsappNumber: row.whatsapp_number,
    upiVpa: row.upi_vpa,
    address: row.address,
    city: row.city,
    state: row.state,
    pincode: row.pincode,
    operatingHours: row.operating_hours,
    features: Array.isArray(row.features) ? row.features : [],
    programs: Array.isArray(row.programs) ? row.programs : [],
    membershipPlans: Array.isArray(row.membership_plans) ? row.membership_plans : [],
    trainers: Array.isArray(row.trainers) ? row.trainers : [],
    transformations: Array.isArray(row.transformations) ? row.transformations : [],
    isPublished: Boolean(row.is_published),
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

export const gymRepository = {
  async getAll(publishedOnly = false): Promise<GymProfile[]> {
    if (supabase) {
      let query = supabase.from('gym_profiles').select('*').order('created_at', { ascending: false });
      if (publishedOnly) {
        query = query.eq('is_published', true);
      }
      const { data, error } = await query;
      if (error) {
        throw new Error(`Database error fetching gyms: ${error.message}`);
      }
      if (data && data.length > 0) {
        return (data as unknown as GymProfileRow[]).map(rowToGymProfile);
      }
      return publishedOnly
        ? INITIAL_GYM_PROFILES.filter((g) => g.isPublished)
        : INITIAL_GYM_PROFILES;
    }
    return publishedOnly
      ? localGymProfiles.filter((g) => g.isPublished)
      : localGymProfiles;
  },

  async getBySlug(slug: string): Promise<GymProfile | null> {
    const cleanSlug = slug.toLowerCase().trim();
    if (supabase) {
      const { data, error } = await supabase
        .from('gym_profiles')
        .select('*')
        .eq('slug', cleanSlug)
        .maybeSingle();
      if (error) {
        throw new Error(`Database error fetching gym '${cleanSlug}': ${error.message}`);
      }
      if (data) {
        return rowToGymProfile(data as unknown as GymProfileRow);
      }
      const foundSeed = INITIAL_GYM_PROFILES.find((g) => g.slug.toLowerCase() === cleanSlug);
      return foundSeed || null;
    }
    const found = localGymProfiles.find((g) => g.slug.toLowerCase() === cleanSlug);
    return found || null;
  },

  async getById(id: string): Promise<GymProfile | null> {
    if (supabase) {
      const { data, error } = await supabase
        .from('gym_profiles')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      if (error) {
        throw new Error(`Database error fetching gym ID '${id}': ${error.message}`);
      }
      if (data) {
        return rowToGymProfile(data as unknown as GymProfileRow);
      }
      const foundSeed = INITIAL_GYM_PROFILES.find((g) => g.id === id);
      return foundSeed || null;
    }
    const found = localGymProfiles.find((g) => g.id === id);
    return found || null;
  },

  async create(profile: GymProfile): Promise<GymProfile> {
    const newProfile: GymProfile = {
      ...profile,
      id: profile.id || `gym-${Date.now()}`,
      slug: (profile.slug || profile.gymName.toLowerCase().replace(/[^a-z0-9]/g, '-')).toLowerCase(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (supabase) {
      const row: Partial<GymProfileRow> = {
        id: newProfile.id,
        slug: newProfile.slug,
        gym_name: newProfile.gymName,
        tagline: newProfile.tagline,
        hero_headline: newProfile.heroHeadline,
        hero_highlight: newProfile.heroHighlight,
        hero_subtitle: newProfile.heroSubtitle,
        hero_image_url: newProfile.heroImageUrl,
        logo_url: newProfile.logoUrl || null,
        primary_color: newProfile.primaryColor,
        accent_color: newProfile.accentColor,
        secondary_color: newProfile.secondaryColor,
        phone: newProfile.phone,
        email: newProfile.email,
        whatsapp_number: newProfile.whatsappNumber,
        upi_vpa: newProfile.upiVpa,
        address: newProfile.address,
        city: newProfile.city,
        state: newProfile.state,
        pincode: newProfile.pincode,
        operating_hours: newProfile.operatingHours,
        features: newProfile.features,
        programs: newProfile.programs,
        membership_plans: newProfile.membershipPlans,
        trainers: newProfile.trainers,
        transformations: newProfile.transformations,
        is_published: newProfile.isPublished
      };

      const { data, error } = await supabase.from('gym_profiles').insert([row]).select().single();
      if (error) {
        throw new Error(`Database error creating gym profile: ${error.message}`);
      }
      if (!data) {
        throw new Error('Database error creating gym profile: No data returned from insert');
      }
      return rowToGymProfile(data as unknown as GymProfileRow);
    }

    localGymProfiles = [newProfile, ...localGymProfiles.filter((g) => g.id !== newProfile.id)];
    return newProfile;
  },

  async update(id: string, updates: Partial<GymProfile>): Promise<GymProfile | null> {
    if (supabase) {
      const rowUpdates: Record<string, unknown> = { updated_at: new Date().toISOString() };
      if (updates.slug !== undefined) rowUpdates.slug = updates.slug.toLowerCase().trim();
      if (updates.gymName !== undefined) rowUpdates.gym_name = updates.gymName;
      if (updates.tagline !== undefined) rowUpdates.tagline = updates.tagline;
      if (updates.heroHeadline !== undefined) rowUpdates.hero_headline = updates.heroHeadline;
      if (updates.heroHighlight !== undefined) rowUpdates.hero_highlight = updates.heroHighlight;
      if (updates.heroSubtitle !== undefined) rowUpdates.hero_subtitle = updates.heroSubtitle;
      if (updates.heroImageUrl !== undefined) rowUpdates.hero_image_url = updates.heroImageUrl;
      if (updates.logoUrl !== undefined) rowUpdates.logo_url = updates.logoUrl;
      if (updates.primaryColor !== undefined) rowUpdates.primary_color = updates.primaryColor;
      if (updates.accentColor !== undefined) rowUpdates.accent_color = updates.accentColor;
      if (updates.secondaryColor !== undefined) rowUpdates.secondary_color = updates.secondaryColor;
      if (updates.phone !== undefined) rowUpdates.phone = updates.phone;
      if (updates.email !== undefined) rowUpdates.email = updates.email;
      if (updates.whatsappNumber !== undefined) rowUpdates.whatsapp_number = updates.whatsappNumber;
      if (updates.upiVpa !== undefined) rowUpdates.upi_vpa = updates.upiVpa;
      if (updates.address !== undefined) rowUpdates.address = updates.address;
      if (updates.city !== undefined) rowUpdates.city = updates.city;
      if (updates.state !== undefined) rowUpdates.state = updates.state;
      if (updates.pincode !== undefined) rowUpdates.pincode = updates.pincode;
      if (updates.operatingHours !== undefined) rowUpdates.operating_hours = updates.operatingHours;
      if (updates.features !== undefined) rowUpdates.features = updates.features;
      if (updates.programs !== undefined) rowUpdates.programs = updates.programs;
      if (updates.membershipPlans !== undefined) rowUpdates.membership_plans = updates.membershipPlans;
      if (updates.trainers !== undefined) rowUpdates.trainers = updates.trainers;
      if (updates.transformations !== undefined) rowUpdates.transformations = updates.transformations;
      if (updates.isPublished !== undefined) rowUpdates.is_published = updates.isPublished;

      const { data, error } = await supabase
        .from('gym_profiles')
        .update(rowUpdates)
        .or(`id.eq.${id},slug.eq.${id}`)
        .select()
        .maybeSingle();

      if (error) {
        throw new Error(`Database error updating gym '${id}': ${error.message}`);
      }
      if (!data) {
        return null;
      }
      return rowToGymProfile(data as unknown as GymProfileRow);
    }

    const existingIndex = localGymProfiles.findIndex((g) => g.id === id || g.slug === id);
    if (existingIndex >= 0) {
      localGymProfiles[existingIndex] = {
        ...localGymProfiles[existingIndex],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      return localGymProfiles[existingIndex];
    }
    return null;
  },

  async delete(id: string): Promise<boolean> {
    if (supabase) {
      const { error } = await supabase.from('gym_profiles').delete().or(`id.eq.${id},slug.eq.${id}`);
      if (error) {
        throw new Error(`Database error deleting gym '${id}': ${error.message}`);
      }
      return true;
    }
    localGymProfiles = localGymProfiles.filter((g) => g.id !== id && g.slug !== id);
    return true;
  }
};
