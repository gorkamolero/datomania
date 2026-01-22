import { NextRequest, NextResponse } from 'next/server';
import { getParlamentarioBySlug } from '@/projects/representantes/lib/data';

interface RouteParams {
  params: Promise<{ slug: string }>;
}

/**
 * GET /api/representantes/parlamentarios/:slug
 *
 * Returns a single parlamentario by slug.
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  const { slug } = await params;
  const parlamentario = getParlamentarioBySlug(slug);

  if (!parlamentario) {
    return NextResponse.json(
      { error: 'Parlamentario no encontrado' },
      { status: 404 }
    );
  }

  return NextResponse.json(parlamentario);
}
