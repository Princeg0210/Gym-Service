import { NextRequest } from 'next/server';
import { gymController } from '@/server/controllers/gymController';

export async function GET(req: NextRequest) {
  return gymController.getAll(req);
}

export async function POST(req: NextRequest) {
  return gymController.create(req);
}
