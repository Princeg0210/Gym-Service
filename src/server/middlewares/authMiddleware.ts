import { NextRequest, NextResponse } from 'next/server';
import { serverConfig } from '../config/env';

export function verifyAdminAccess(req: NextRequest): { authorized: boolean; response?: NextResponse } {
  const authHeader = req.headers.get('authorization') || '';
  const token = authHeader.replace(/^Bearer\s+/i, '').trim();
  const passkeyHeader = req.headers.get('x-admin-passkey') || '';

  const isAuthorized =
    token === serverConfig.adminPasskey ||
    passkeyHeader === serverConfig.adminPasskey ||
    process.env.NODE_ENV === 'development';

  if (!isAuthorized) {
    return {
      authorized: false,
      response: NextResponse.json(
        { success: false, error: 'Unauthorized: Invalid administrative credentials.' },
        { status: 401 }
      )
    };
  }

  return { authorized: true };
}
