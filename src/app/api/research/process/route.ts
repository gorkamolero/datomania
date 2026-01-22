import { NextRequest, NextResponse } from 'next/server';

const CRON_SECRET = process.env.CRON_SECRET;
const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY;

// Education level mapping based on keywords
const EDUCATION_KEYWORDS: Record<string, string[]> = {
  Doctorado: ['doctor', 'phd', 'doctorado', 'tesis doctoral'],
  Master: ['master', 'máster', 'postgrado', 'posgrado', 'mba'],
  Universitario: [
    'licenciado',
    'licenciatura',
    'grado',
    'ingeniero',
    'ingeniería',
    'derecho',
    'medicina',
    'arquitecto',
    'universidad',
    'universitario',
    'degree',
    'bachelor',
    'carrera universitaria',
  ],
  FP: ['formación profesional', 'fp', 'técnico', 'ciclo formativo', 'módulo'],
  Bachillerato: ['bachillerato', 'bachiller', 'bup', 'cou'],
  Secundaria: ['secundaria', 'eso', 'graduado escolar'],
};

function classifyEducation(text: string): string {
  const lower = text.toLowerCase();

  for (const [level, keywords] of Object.entries(EDUCATION_KEYWORDS)) {
    for (const keyword of keywords) {
      if (lower.includes(keyword)) {
        return level;
      }
    }
  }

  return 'No_consta';
}

interface PerplexityResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
  citations?: string[];
}

interface ProcessRequest {
  nombre_completo: string;
  camara: 'Congreso' | 'Senado';
  circunscripcion: string;
  research_type: 'estudios' | 'profesion' | 'both';
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

    const camaraLabel = camara === 'Senado' ? 'senator' : 'member of Congress';

    // Build prompt based on what we're researching
    let prompt: string;
    if (research_type === 'profesion') {
      prompt = `What is the professional background and occupation of ${nombre_completo}, Spanish ${camaraLabel} from ${circunscripcion}? Include their profession, work history, and any notable professional roles.`;
    } else {
      prompt = `What is the educational background of ${nombre_completo}, Spanish ${camaraLabel} from ${circunscripcion}? Include degrees, universities, and fields of study. If no educational information is found, say "No educational information found." Be specific and cite sources.`;
    }

    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'sonar',
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      return NextResponse.json(
        { error: `Perplexity API error: ${error}` },
        { status: 502 }
      );
    }

    const data = (await response.json()) as PerplexityResponse;
    const content = data.choices[0]?.message?.content || '';
    const citations = data.citations || [];

    // Check if no data was found
    const noDataFound =
      content.toLowerCase().includes('no educational information found') ||
      content.toLowerCase().includes('no information available') ||
      content.toLowerCase().includes('could not find');

    // Classify education level if researching estudios
    const estudios_nivel =
      research_type !== 'profesion' && !noDataFound
        ? classifyEducation(content)
        : undefined;

    return NextResponse.json({
      success: true,
      nombre_completo,
      research_type,
      found: !noDataFound,
      result: {
        raw: content.slice(0, 1000), // Truncate to reasonable length
        estudios_nivel,
        citations,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Research process error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
