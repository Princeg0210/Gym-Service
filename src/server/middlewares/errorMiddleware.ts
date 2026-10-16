import { NextResponse } from 'next/server';

export function handleServerError(error: unknown, fallbackMessage = 'Internal Server Error'): NextResponse {
  console.error('[API Server Error]:', error);
  const message = error instanceof Error ? error.message : fallbackMessage;
  return NextResponse.json(
    {
      success: false,
      error: message,
      timestamp: new Date().toISOString()
    },
    { status: 500 }
  );
}
