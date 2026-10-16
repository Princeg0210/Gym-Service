import { NextRequest, NextResponse } from 'next/server';
import { gymRepository } from '../repositories/gymRepository';
import { handleServerError } from '../middlewares/errorMiddleware';
import { GymProfile } from '@/types';

export const gymController = {
  async getAll(req?: NextRequest): Promise<NextResponse> {
    try {
      const url = req ? new URL(req.url) : null;
      const publishedOnly = url?.searchParams.get('published') === 'true';
      const gyms = await gymRepository.getAll(publishedOnly);
      return NextResponse.json({ success: true, count: gyms.length, data: gyms });
    } catch (error) {
      return handleServerError(error, 'Failed to fetch gym landing pages');
    }
  },

  async getBySlug(slug: string): Promise<NextResponse> {
    try {
      const gym = await gymRepository.getBySlug(slug);
      if (!gym) {
        return NextResponse.json(
          { success: false, error: `Gym landing page for '${slug}' was not found.` },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true, data: gym });
    } catch (error) {
      return handleServerError(error, `Failed to fetch gym '${slug}'`);
    }
  },

  async create(req: NextRequest): Promise<NextResponse> {
    try {
      const body = await req.json();
      if (!body.gymName || !body.slug) {
        return NextResponse.json(
          { success: false, error: 'Gym name and URL slug are required.' },
          { status: 400 }
        );
      }

      const existing = await gymRepository.getBySlug(body.slug);
      if (existing) {
        return NextResponse.json(
          { success: false, error: `The URL slug '${body.slug}' is already taken. Please choose another.` },
          { status: 409 }
        );
      }

      const newProfile: GymProfile = {
        id: body.id || `gym-${Date.now()}`,
        slug: body.slug.toLowerCase().trim().replace(/[^a-z0-9-]/g, '-'),
        gymName: body.gymName.trim(),
        tagline: body.tagline || 'Commercial Gym Operating Engine',
        heroHeadline: body.heroHeadline || 'NO EXCUSES.',
        heroHighlight: body.heroHighlight || 'ONLY RESULTS.',
        heroSubtitle: body.heroSubtitle || 'Transform your physique with science-backed personal coaching.',
        heroImageUrl: body.heroImageUrl || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1400&q=80',
        logoUrl: body.logoUrl || '',
        primaryColor: body.primaryColor || '#ccff00',
        accentColor: body.accentColor || '#b8e600',
        secondaryColor: body.secondaryColor || '#121724',
        phone: body.phone || '9876543210',
        email: body.email || 'contact@gympro.in',
        whatsappNumber: body.whatsappNumber || '919876543210',
        upiVpa: body.upiVpa || 'gymprofitness@oksbi',
        address: body.address || 'Commercial Sector',
        city: body.city || 'Bengaluru',
        state: body.state || 'Karnataka',
        pincode: body.pincode || '560001',
        operatingHours: body.operatingHours || 'Mon - Sat: 5:30 AM - 10:30 PM',
        features: body.features || [],
        programs: body.programs || [],
        membershipPlans: body.membershipPlans || [],
        trainers: body.trainers || [],
        transformations: body.transformations || [],
        isPublished: body.isPublished !== undefined ? Boolean(body.isPublished) : true
      };

      const created = await gymRepository.create(newProfile);
      return NextResponse.json({ success: true, data: created }, { status: 201 });
    } catch (error) {
      return handleServerError(error, 'Failed to create gym landing page');
    }
  },

  async update(slugOrId: string, req: NextRequest): Promise<NextResponse> {
    try {
      const body = await req.json();
      const updated = await gymRepository.update(slugOrId, body);
      if (!updated) {
        return NextResponse.json(
          { success: false, error: `Gym '${slugOrId}' not found or update failed.` },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true, data: updated });
    } catch (error) {
      return handleServerError(error, `Failed to update gym '${slugOrId}'`);
    }
  },

  async delete(slugOrId: string): Promise<NextResponse> {
    try {
      const ok = await gymRepository.delete(slugOrId);
      return NextResponse.json({ success: ok });
    } catch (error) {
      return handleServerError(error, `Failed to delete gym '${slugOrId}'`);
    }
  }
};
