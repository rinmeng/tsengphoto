import { Logger } from '@/lib/logger';
import { NextResponse } from 'next/server';

// REMOVE THIS FILE AFTER DEBUGGING
export async function GET() {
  Logger.debug('Debug endpoint hit');
  Logger.info('Debug endpoint hit');
  Logger.warn('Debug endpoint hit');
  Logger.error('Debug endpoint hit');
  return NextResponse.json({
    message: 'Debug endpoint hit. Check logs for details.',
  });
}
