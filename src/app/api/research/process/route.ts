import { NextRequest, NextResponse } from 'next/server';
import { researchParlamentario } from '@/projects/representantes/lib/research';

const CRON_SECRET = process.env.CRON_SECRET;
const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY;

interface ProcessRequest {
  nombre_completo: string;
  camara: 'Congreso' | 'Senado';
  circunscripcion: string;
  research_type: 'estudios' | 'profesion';
}

/**
 * POST /api/research/process
 *
 * Researches a single parlamentario using Perplexity API.
 * Returns the research results for the worker to handle storage.
 *
 * Body: { nombre_completo, camara, circunscripcion, research_type }
 */
export async function POST(request: NextRequest) {
  // Verify authorization
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!PERPLEXITY_API_KEY) {
    return NextResponse.json(
      { error: 'PERPLEXITY_API_KEY not configured' },
      { status: 500 }
    );
  }

  try {
    const body = (await request.json()) as ProcessRequest;
    const { nombre_completo, camara, circunscripcion, research_type } = body;

    if (!nombre_completo || !camara || !circunscripcion) {
      return NextResponse.json(
        { error: 'Missing required fields: nombre_completo, camara, circunscripcion' },
        { status: 400 }
      );
    }

    // Use the shared research function
    const result = await researchParlamentario({
      nombre_completo,
      camara,
      circunscripcion,
      research_type: research_type || 'estudios',
      perplexityApiKey: PERPLEXITY_API_KEY,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Research process error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
