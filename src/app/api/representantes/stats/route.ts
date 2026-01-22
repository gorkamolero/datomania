import { NextResponse } from 'next/server';
import { computeStats } from '@/projects/representantes/lib/data';

/**
 * GET /api/representantes/stats
 *
 * Returns aggregate statistics for the education/profession dataset.
 */
export async function GET() {
  const stats = computeStats();
  return NextResponse.json(stats);
}
