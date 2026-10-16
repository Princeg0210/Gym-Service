import { NextRequest } from 'next/server';
import { memberController } from '@/server/controllers/memberController';

export async function GET() {
  return memberController.getAll();
}

export async function POST(req: NextRequest) {
  return memberController.create(req);
}
