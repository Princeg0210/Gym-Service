import { NextRequest, NextResponse } from 'next/server';
import { memberRepository } from '../repositories/memberRepository';
import { validateMemberInput } from '../validators/memberValidator';
import { handleServerError } from '../middlewares/errorMiddleware';
import { Member } from '@/types';

export const memberController = {
  async getAll(): Promise<NextResponse> {
    try {
      const members = await memberRepository.getAll();
      return NextResponse.json({ success: true, count: members.length, data: members });
    } catch (error) {
      return handleServerError(error, 'Failed to fetch members');
    }
  },

  async getById(id: string): Promise<NextResponse> {
    try {
      const member = await memberRepository.getById(id);
      if (!member) {
        return NextResponse.json({ success: false, error: 'Member not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: member });
    } catch (error) {
      return handleServerError(error, `Failed to fetch member ${id}`);
    }
  },

  async create(req: NextRequest): Promise<NextResponse> {
    try {
      const body = await req.json();
      const validation = validateMemberInput(body);

      if (!validation.isValid) {
        return NextResponse.json(
          { success: false, errors: validation.errors },
          { status: 400 }
        );
      }

      const newMember: Member = {
        id: body.id || `mem-${Date.now()}`,
        fullName: body.fullName.trim(),
        phone: body.phone.trim(),
        gender: body.gender || 'male',
        age: Number(body.age) || 25,
        planId: body.planId || 'plan-1m',
        planName: body.planName,
        startDate: body.startDate || new Date().toISOString().split('T')[0],
        endDate: body.endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        totalFeeInr: Number(body.totalFeeInr) || 0,
        paidAmountInr: Number(body.paidAmountInr) || 0,
        pendingDueInr: Number(body.pendingDueInr) || 0,
        status: body.status || 'active',
        emergencyContact: body.emergencyContact || undefined,
        fitnessGoal: body.fitnessGoal || 'general_fitness',
        dietaryPreference: body.dietaryPreference || 'vegetarian',
        avatarSeed: body.avatarSeed || body.fullName.split(' ')[0]
      };

      const saved = await memberRepository.create(newMember);
      return NextResponse.json({ success: true, data: saved }, { status: 201 });
    } catch (error) {
      return handleServerError(error, 'Failed to create member');
    }
  },

  async update(id: string, req: NextRequest): Promise<NextResponse> {
    try {
      const body = await req.json();
      const updated = await memberRepository.update(id, body);
      if (!updated) {
        return NextResponse.json({ success: false, error: 'Member not found or update failed' }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: updated });
    } catch (error) {
      return handleServerError(error, `Failed to update member ${id}`);
    }
  },

  async delete(id: string): Promise<NextResponse> {
    try {
      const success = await memberRepository.delete(id);
      return NextResponse.json({ success });
    } catch (error) {
      return handleServerError(error, `Failed to delete member ${id}`);
    }
  }
};
