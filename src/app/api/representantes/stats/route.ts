import { NextRequest, NextResponse } from 'next/server';
import { computeStats, compareLegislatures } from '@/projects/representantes/lib/data';
import type { Legislature } from '@/projects/representantes/types/parlamentario';

/**
 * GET /api/representantes/stats
 *
 * Returns aggregate statistics for the parlamentarios dataset
 *
 * Query params:
 * - legislature: 'I' | 'XV' (default: 'XV')
 * - compare: 'true' to return comparison between I and XV
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const legislature = (searchParams.get('legislature') || 'XV') as Legislature;
  const compare = searchParams.get('compare') === 'true';

  if (compare) {
    const comparison = compareLegislatures('I', 'XV');
    return NextResponse.json(comparison, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  }

  const stats = computeStats(legislature);

  return NextResponse.json({ legislature, ...stats }, {
    headers: {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
