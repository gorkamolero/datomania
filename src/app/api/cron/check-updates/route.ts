import { NextRequest, NextResponse } from 'next/server';
import { getParlamentarios } from '@/projects/representantes/lib/data';

// Allow up to 5 minutes for research (Fluid Compute)
export const maxDuration = 300;

const CRON_SECRET = process.env.CRON_SECRET;
const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY;
const RESEARCH_WEBHOOK_URL = process.env.RESEARCH_WEBHOOK_URL;

// Education level classification
const EDUCATION_KEYWORDS: Record<string, string[]> = {
  Doctorado: ['doctor', 'phd', 'doctorado', 'tesis doctoral'],
  Master: ['master', 'máster', 'postgrado', 'posgrado', 'mba'],
  Universitario: [
    'licenciado', 'licenciatura', 'grado', 'ingeniero', 'ingeniería',
    'derecho', 'medicina', 'arquitecto', 'universidad', 'universitario',
    'degree', 'bachelor', 'carrera universitaria',
  ],
  FP: ['formación profesional', 'fp', 'técnico', 'ciclo formativo', 'módulo'],
  Bachillerato: ['bachillerato', 'bachiller', 'bup', 'cou'],
  Secundaria: ['secundaria', 'eso', 'graduado escolar'],
};

function classifyEducation(text: string): string {
  const lower = text.toLowerCase();
  for (const [level, keywords] of Object.entries(EDUCATION_KEYWORDS)) {
    for (const keyword of keywords) {
      if (lower.includes(keyword)) return level;
    }
  }
  return 'No_consta';
}

interface PerplexityResponse {
  choices: Array<{ message: { content: string } }>;
  citations?: string[];
}

interface ResearchResult {
  nombre: string;
  found: boolean;
  estudios_raw?: string;
  estudios_nivel?: string;
  citations?: string[];
}

/**
 * Research a single parlamentario using Perplexity API
 */
async function researchParlamentario(
  nombre: string,
  camara: string,
  circunscripcion: string
): Promise<ResearchResult> {
  if (!PERPLEXITY_API_KEY) {
    return { nombre, found: false };
  }

  const camaraLabel = camara === 'Senado' ? 'senator' : 'member of Congress';
  const prompt = `What is the educational background of ${nombre}, Spanish ${camaraLabel} from ${circunscripcion}? Include degrees, universities, and fields of study. If no educational information is found, say "No educational information found."`;

  try {
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
      console.error(`Perplexity error for ${nombre}: ${response.status}`);
      return { nombre, found: false };
    }

    const data = (await response.json()) as PerplexityResponse;
    const content = data.choices[0]?.message?.content || '';

    if (
      content.toLowerCase().includes('no educational information found') ||
      content.toLowerCase().includes('no information available')
    ) {
      return { nombre, found: false };
    }

    const nivel = classifyEducation(content);
    return {
      nombre,
      found: nivel !== 'No_consta',
      estudios_raw: content.slice(0, 500),
      estudios_nivel: nivel,
      citations: data.citations,
    };
  } catch (error) {
    console.error(`Research error for ${nombre}:`, error);
    return { nombre, found: false };
  }
}

interface SenadoEntry {
  nombre: string;
  apellidos: string;
  fullName: string;
  procedLugar: string;
  grupoNombre: string;
}

/**
 * Fetch senators from Senado open data API (tipoFich=10)
 * Returns all senators for Legislature XV
 */
async function fetchSenadoData(): Promise<SenadoEntry[]> {
  const url = 'https://www.senado.es/web/ficopendataservlet?tipoFich=10';
  const response = await fetch(url, {
    headers: { 'Accept-Encoding': 'identity' },
  });

  if (!response.ok) {
    throw new Error(`Senado fetch failed: ${response.status}`);
  }

  const xml = await response.text();
  const senators: SenadoEntry[] = [];

  // Parse XML using regex (simple approach for CDATA content)
  const senadorRegex = /<senador>[\s\S]*?<\/senador>/g;
  let match;

  while ((match = senadorRegex.exec(xml)) !== null) {
    const senador = match[0];

    const getValue = (field: string): string => {
      const m = senador.match(
        new RegExp(`<${field}><!\\[CDATA\\[([^\\]]*?)\\]\\]></${field}>`)
      );
      return m ? m[1] : '';
    };

    const legislatura = getValue('legislatura');
    if (legislatura === '15') {
      const nombre = getValue('nombre');
      const apellidos = getValue('apellidos');
      senators.push({
        nombre,
        apellidos,
        fullName: `${apellidos}, ${nombre}`.toUpperCase(),
        procedLugar: getValue('procedLugar'),
        grupoNombre: getValue('grupoNombre'),
      });
    }
  }

  // Deduplicate by name
  const unique = new Map<string, SenadoEntry>();
  for (const s of senators) {
    if (!unique.has(s.fullName)) {
      unique.set(s.fullName, s);
    }
  }

  return Array.from(unique.values());
}

/**
 * Monthly cron job to check for updates and research missing data
 *
 * Flow:
 * 1. Fetch current official roster from Congreso AND Senado
 * 2. Compare with existing data by name
 * 3. Identify new parliamentarians or those missing research
 * 4. Use Perplexity API to research missing education data
 * 5. Return results (and optionally send to webhook)
 */
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Check for skipResearch param (for quick checks)
  const { searchParams } = new URL(request.url);
  const skipResearch = searchParams.get('skipResearch') === 'true';

  // Collect logs for response
  const logs: string[] = [];
  const log = (msg: string) => {
    const timestamp = new Date().toISOString().slice(11, 23);
    const entry = `[${timestamp}] ${msg}`;
    logs.push(entry);
    console.log(entry);
  };

  try {
    log('Starting cron check-updates' + (skipResearch ? ' (skipResearch=true)' : ''));

    // 1a. Fetch official Congreso data
    log('Fetching Congreso data...');
    const congresoUrl = await findCongresoJsonUrl();
    log(`Found Congreso URL: ${congresoUrl.split('/').pop()}`);
    const congresoResponse = await fetch(congresoUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; DatomaniaBot/1.0)' },
    });

    if (!congresoResponse.ok) {
      throw new Error(`Congreso fetch failed: ${congresoResponse.status}`);
    }

    const congresoData = await congresoResponse.json();
    log(`Congreso: ${congresoData.length} diputados`);

    // 1b. Fetch official Senado data
    log('Fetching Senado data...');
    const senadoData = await fetchSenadoData();
    log(`Senado: ${senadoData.length} senators (Legislature XV)`);

    // 2. Load existing data
    log('Loading existing data...');
    const existingData = getParlamentarios();
    const existingCongreso = existingData.filter((p) => p.camara === 'Congreso');
    const existingSenado = existingData.filter((p) => p.camara === 'Senado');
    const existingSenadoActivo = existingSenado.filter((p) => p.estado !== 'baja');
    const existingSenadoBajas = existingSenado.filter((p) => p.estado === 'baja');
    log(`Senado: ${existingSenadoActivo.length} activos, ${existingSenadoBajas.length} bajas`);

    const existingCongresoNames = new Set(
      existingCongreso.map((p) => normalizeNombre(p.nombre_completo))
    );
    const existingSenadoNames = new Set(
      existingSenado.map((p) => normalizeNombre(p.nombre_completo))
    );

    // 3a. Find new diputados (Congreso)
    const newDiputados: string[] = [];
    for (const oficial of congresoData) {
      const normalizedName = normalizeNombre(oficial.NOMBRE);
      if (!existingCongresoNames.has(normalizedName)) {
        newDiputados.push(oficial.NOMBRE);
      }
    }

    // 3b. Find new senators (Senado)
    const newSenadores: string[] = [];
    for (const oficial of senadoData) {
      const normalizedName = normalizeNombre(oficial.fullName);
      if (!existingSenadoNames.has(normalizedName)) {
        newSenadores.push(oficial.fullName);
      }
    }

    log(`Congreso: ${existingCongreso.length} existing, ${newDiputados.length} new`);
    log(`Senado: ${existingSenado.length} existing, ${newSenadores.length} new`);

    if (newDiputados.length > 0) {
      log(`New diputados: ${newDiputados.slice(0, 5).join(', ')}${newDiputados.length > 5 ? '...' : ''}`);
    }
    if (newSenadores.length > 0) {
      log(`New senators: ${newSenadores.slice(0, 5).join(', ')}${newSenadores.length > 5 ? '...' : ''}`);
    }

    // 4. Find those needing research
    const needsResearch = existingData.filter(
      (p) =>
        p.estudios_nivel === 'No_consta' || p.profesion_categoria === 'No_consta'
    );

    // 5. Research missing data using Perplexity (if API key configured)
    const researchResults: ResearchResult[] = [];
    log(`${needsResearch.length} parlamentarios need research`);

    if (skipResearch) {
      log('Skipping research (skipResearch=true)');
    } else if (PERPLEXITY_API_KEY && needsResearch.length > 0) {
      log(`Starting Perplexity research...`);

      for (let i = 0; i < needsResearch.length; i++) {
        const p = needsResearch[i];

        // Rate limit: 2 seconds between requests
        if (i > 0) {
          await new Promise((resolve) => setTimeout(resolve, 2000));
        }

        const result = await researchParlamentario(
          p.nombre_completo,
          p.camara,
          p.circunscripcion
        );
        researchResults.push(result);

        log(
          `[${i + 1}/${needsResearch.length}] ${p.nombre_completo}: ${
            result.found ? result.estudios_nivel : 'not found'
          }`
        );
      }
    } else if (!PERPLEXITY_API_KEY) {
      log('PERPLEXITY_API_KEY not configured, skipping research');
    }

    // 6. Build result
    const successfulResearch = researchResults.filter((r) => r.found);
    const hasNewMembers = newDiputados.length > 0 || newSenadores.length > 0;

    log(`Research complete: ${successfulResearch.length}/${researchResults.length} successful`);
    log(`Action: ${hasNewMembers ? 'NEW_MEMBERS' : 'RESEARCH_COMPLETE'}`);

    const result = {
      timestamp: new Date().toISOString(),
      congreso: {
        officialCount: congresoData.length,
        existingCount: existingCongreso.length,
        newMembers: newDiputados,
      },
      senado: {
        officialCount: senadoData.length,
        existingCount: existingSenado.length,
        newMembers: newSenadores,
      },
      needsResearchCount: needsResearch.length,
      researchPerformed: researchResults.length > 0,
      researchSuccessful: successfulResearch.length,
      researchResults: successfulResearch,
      action: hasNewMembers ? 'NEW_MEMBERS' : 'RESEARCH_COMPLETE',
      logs,
    };

    // 7. Send to webhook if configured
    if (RESEARCH_WEBHOOK_URL && successfulResearch.length > 0) {
      try {
        await fetch(RESEARCH_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(result),
        });
        console.log('Webhook notification sent');
      } catch (webhookError) {
        console.error('Webhook error:', webhookError);
      }
    }

    return NextResponse.json(result);
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    logs.push(`[${new Date().toISOString().slice(11, 23)}] ERROR: ${errorMsg}`);
    console.error('Cron check-updates error:', error);
    return NextResponse.json(
      { error: errorMsg, logs },
      { status: 500 }
    );
  }
}

/**
 * Normalize name for comparison
 */
function normalizeNombre(nombre: string): string {
  return nombre
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z\s]/g, '')
    .trim();
}

/**
 * Find the current Congreso JSON URL (changes daily with timestamp)
 */
async function findCongresoJsonUrl(): Promise<string> {
  const today = new Date();
  const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');

  const times = ['050007', '050006', '060007', '040007'];

  for (const time of times) {
    const url = `https://www.congreso.es/webpublica/opendata/diputados/DiputadosActivos__${dateStr}${time}.json`;
    try {
      const response = await fetch(url, {
        method: 'HEAD',
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; DatomaniaBot/1.0)',
        },
      });
      if (response.ok) {
        return url;
      }
    } catch {
      // Try next pattern
    }
  }

  throw new Error('Could not find Congreso JSON URL');
}
