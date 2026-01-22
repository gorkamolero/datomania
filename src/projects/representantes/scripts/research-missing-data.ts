/**
 * Research missing parlamentario data using Perplexity API
 *
 * Uses the Sonar model for web-grounded research on senators
 * missing educational background or profession information.
 *
 * Run with: npx tsx src/projects/representantes/scripts/research-missing-data.ts
 */

import * as fs from 'fs';
import * as path from 'path';

const DATA_PATH = path.join(__dirname, '..', 'data', 'parlamentarios_espana_xv.json');
const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY;

interface ParlamentarioData {
  camara: 'Congreso' | 'Senado';
  nombre_completo: string;
  partido: string;
  grupo_parlamentario: string;
  circunscripcion: string;
  estudios_raw: string;
  estudios_nivel: string;
  profesion_raw: string;
  profesion_categoria: string;
  fecha_alta: string;
  url_ficha: string;
  bio_oficial?: string;
  source: 'official' | 'researched';
}

interface PerplexityResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
  citations?: string[];
}

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
  FP: [
    'formación profesional',
    'fp',
    'técnico',
    'ciclo formativo',
    'módulo',
  ],
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

async function researchParlamentario(
  nombre: string,
  camara: string,
  circunscripcion: string
): Promise<{ estudios_raw: string; estudios_nivel: string } | null> {
  if (!PERPLEXITY_API_KEY) {
    throw new Error('PERPLEXITY_API_KEY environment variable not set');
  }

  const prompt = `What is the educational background of ${nombre}, Spanish ${camara === 'Senado' ? 'senator' : 'member of Congress'} from ${circunscripcion}?
Include degrees, universities, and fields of study. If no educational information is found, say "No educational information found."
Be specific and cite sources.`;

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
      const error = await response.text();
      console.error(`  API error for ${nombre}: ${error}`);
      return null;
    }

    const data = (await response.json()) as PerplexityResponse;
    const content = data.choices[0]?.message?.content || '';

    if (
      content.toLowerCase().includes('no educational information found') ||
      content.toLowerCase().includes('no information available')
    ) {
      return null;
    }

    const nivel = classifyEducation(content);

    return {
      estudios_raw: content.slice(0, 500), // Truncate to reasonable length
      estudios_nivel: nivel,
    };
  } catch (error) {
    console.error(`  Error researching ${nombre}:`, error);
    return null;
  }
}

async function main() {
  console.log('=== Perplexity Research Script ===\n');

  if (!PERPLEXITY_API_KEY) {
    console.error('Error: PERPLEXITY_API_KEY environment variable not set');
    console.error('Set it with: export PERPLEXITY_API_KEY=pplx-...');
    process.exit(1);
  }

  // Load data
  const raw = fs.readFileSync(DATA_PATH, 'utf-8');
  const data: ParlamentarioData[] = JSON.parse(raw);

  // Find those needing research
  const needsResearch = data.filter(
    (p) =>
      p.estudios_nivel === 'No_consta' || p.profesion_categoria === 'No_consta'
  );

  console.log(`Found ${needsResearch.length} parlamentarios needing research\n`);

  let updatedCount = 0;
  const results: Array<{ nombre: string; result: string }> = [];

  for (let i = 0; i < needsResearch.length; i++) {
    const p = needsResearch[i];
    console.log(`[${i + 1}/${needsResearch.length}] Researching: ${p.nombre_completo}`);

    // Rate limit: 1 request per 2 seconds to be safe
    if (i > 0) {
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }

    const research = await researchParlamentario(
      p.nombre_completo,
      p.camara,
      p.circunscripcion
    );

    if (research && research.estudios_nivel !== 'No_consta') {
      // Update the original data object
      p.estudios_raw = research.estudios_raw;
      p.estudios_nivel = research.estudios_nivel;
      p.source = 'researched';
      updatedCount++;

      results.push({
        nombre: p.nombre_completo,
        result: `✓ Found: ${research.estudios_nivel}`,
      });
      console.log(`  ✓ Found: ${research.estudios_nivel}`);
    } else {
      results.push({
        nombre: p.nombre_completo,
        result: '✗ No data found',
      });
      console.log(`  ✗ No educational data found`);
    }
  }

  // Save updated data
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));

  // Summary
  console.log('\n=== Summary ===');
  console.log(`Total researched: ${needsResearch.length}`);
  console.log(`Successfully updated: ${updatedCount}`);
  console.log(`Still missing: ${needsResearch.length - updatedCount}`);

  console.log('\nResults:');
  for (const r of results) {
    console.log(`  ${r.nombre}: ${r.result}`);
  }

  console.log(`\nData saved to ${DATA_PATH}`);
}

main().catch(console.error);
