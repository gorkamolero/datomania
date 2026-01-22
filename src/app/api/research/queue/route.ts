import { NextRequest, NextResponse } from 'next/server';
import { getParlamentarios } from '@/projects/representantes/lib/data';
import { buildResearchQueue } from '@/projects/representantes/lib/research';

const CRON_SECRET = process.env.CRON_SECRET;

/**
 * GET /api/research/queue
 *
 * Returns parlamentarios needing research (missing estudios or profesion).
 * Used by external worker to process research queue.
 */
export async function GET(request: NextRequest) {
  // Verify authorization
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = getParlamentarios();
    const queue = buildResearchQueue(data);

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      total: queue.length,
      queue,
    });
  } catch (error) {
    console.error('Research queue error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
