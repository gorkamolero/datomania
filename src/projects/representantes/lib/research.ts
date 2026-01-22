/**
 * Research logic extracted for testability
 *
 * Core functions for identifying parlamentarios needing research
 * and ensuring existing data is not overwritten.
 */

import type { Parlamentario, ParlamentarioRaw } from '../types/parlamentario';

/**
 * Education level classification keywords
 */
// Order matters: more specific matches should come first
export const EDUCATION_KEYWORDS: [string, string[]][] = [
  ['Doctorado', ['doctor', 'phd', 'doctorado', 'tesis doctoral']],
  ['Master', ['master', 'máster', 'postgrado', 'posgrado', 'mba']],
  // FP must come before Universitario to avoid "Ciclo Formativo de Grado" matching "grado"
  ['FP', ['formación profesional', 'ciclo formativo', 'técnico superior', 'técnico medio', 'módulo profesional']],
  ['Universitario', [
    'licenciado',
    'licenciatura',
    'grado universitario',
    'grado en',
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
  ]],
  ['Bachillerato', ['bachillerato', 'bachiller', 'bup', 'cou']],
  ['Secundaria', ['secundaria', 'eso', 'graduado escolar']],
];

/**
 * Classify education level from text content
 */
export function classifyEducation(text: string): string {
  const lower = text.toLowerCase();

  for (const [level, keywords] of EDUCATION_KEYWORDS) {
    for (const keyword of keywords) {
      if (lower.includes(keyword)) {
        return level;
      }
    }
  }

  return 'No_consta';
}

/**
 * Check if a parlamentario needs education research
 */
export function needsEducationResearch(
  parlamentario: ParlamentarioRaw | Parlamentario
): boolean {
  return parlamentario.estudios_nivel === 'No_consta';
}

/**
 * Check if a parlamentario needs profession research
 */
export function needsProfessionResearch(
  parlamentario: ParlamentarioRaw | Parlamentario
): boolean {
  return parlamentario.profesion_categoria === 'No_consta';
}

/**
 * Check if a parlamentario needs any research
 */
export function needsResearch(
  parlamentario: ParlamentarioRaw | Parlamentario
): boolean {
  return needsEducationResearch(parlamentario) || needsProfessionResearch(parlamentario);
}

/**
 * Get all parlamentarios that need research
 */
export function getParlamentariosNeedingResearch<T extends ParlamentarioRaw | Parlamentario>(
  parlamentarios: T[]
): T[] {
  return parlamentarios.filter(needsResearch);
}

/**
 * Research queue item format
 */
export interface ResearchQueueItem {
  nombre_completo: string;
  camara: 'Congreso' | 'Senado';
  circunscripcion: string;
  partido: string;
  missing: {
    estudios: boolean;
    profesion: boolean;
  };
}

/**
 * Build the research queue from parlamentarios
 */
export function buildResearchQueue<T extends ParlamentarioRaw | Parlamentario>(
  parlamentarios: T[]
): ResearchQueueItem[] {
  return parlamentarios
    .filter(needsResearch)
    .map((p) => ({
      nombre_completo: p.nombre_completo,
      camara: p.camara,
      circunscripcion: p.circunscripcion,
      partido: p.partido,
      missing: {
        estudios: needsEducationResearch(p),
        profesion: needsProfessionResearch(p),
      },
    }));
}

/**
 * Research result from Perplexity API
 */
export interface ResearchResult {
  estudios_raw?: string;
  estudios_nivel?: string;
  profesion_raw?: string;
  profesion_categoria?: string;
  citations?: string[];
}

/**
 * Apply research results to a parlamentario without overwriting existing data
 *
 * CRITICAL: This function ensures that existing data is NEVER overwritten.
 * It only fills in fields that are currently "No_consta".
 */
export function applyResearchResult<T extends ParlamentarioRaw>(
  parlamentario: T,
  result: ResearchResult
): T {
  const updated = { ...parlamentario };

  // Only update estudios if currently No_consta
  if (parlamentario.estudios_nivel === 'No_consta' && result.estudios_nivel) {
    updated.estudios_raw = result.estudios_raw || '';
    updated.estudios_nivel = result.estudios_nivel as T['estudios_nivel'];
    updated.source = 'researched';
  }

  // Only update profesion if currently No_consta
  if (parlamentario.profesion_categoria === 'No_consta' && result.profesion_categoria) {
    updated.profesion_raw = result.profesion_raw || '';
    updated.profesion_categoria = result.profesion_categoria as T['profesion_categoria'];
    updated.source = 'researched';
  }

  return updated;
}

/**
 * Check if research response indicates no data was found
 */
export function isNoDataResponse(content: string): boolean {
  const lower = content.toLowerCase();
  return (
    lower.includes('no educational information found') ||
    lower.includes('no information available') ||
    lower.includes('could not find') ||
    lower.includes('no data found') ||
    lower.includes('information not available')
  );
}

/**
 * Perplexity API response structure
 */
interface PerplexityResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
  citations?: string[];
}

/**
 * Research process result
 */
export interface ProcessResult {
  success: boolean;
  nombre_completo: string;
  research_type: 'estudios' | 'profesion';
  found: boolean;
  result: {
    raw: string;
    estudios_nivel?: string;
    citations: string[];
  };
  timestamp: string;
}

/**
 * Research a parlamentario using Perplexity API
 *
 * This is the core research function used by both the API route and tests.
 * It calls Perplexity but does NOT save results - that's the caller's responsibility.
 */
export async function researchParlamentario(params: {
  nombre_completo: string;
  camara: 'Congreso' | 'Senado';
  circunscripcion: string;
  research_type: 'estudios' | 'profesion';
  perplexityApiKey: string;
}): Promise<ProcessResult> {
  const { nombre_completo, camara, circunscripcion, research_type, perplexityApiKey } = params;

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
      Authorization: `Bearer ${perplexityApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'sonar',
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Perplexity API error: ${error}`);
  }

  const data = (await response.json()) as PerplexityResponse;
  const content = data.choices[0]?.message?.content || '';
  const citations = data.citations || [];

  // Check if no data was found
  const noDataFound = isNoDataResponse(content);

  // Classify education level if researching estudios
  const estudios_nivel =
    research_type === 'estudios' && !noDataFound
      ? classifyEducation(content)
      : undefined;

  return {
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
  };
}
