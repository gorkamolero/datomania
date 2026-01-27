/**
 * Research logic for finding and updating missing parlamentario data
 *
 * Uses the NEW data structure (education_levels, data_sources)
 * NO backwards compatibility with old fields
 */

import type { Parlamentario, ParlamentarioRaw, DataSourceEntry } from '../types/parlamentario';
import { normalizeEducation } from './education-mapping';

/**
 * Check if a parlamentario needs education research
 */
export function needsEducationResearch(
  parlamentario: ParlamentarioRaw | Parlamentario
): boolean {
  return parlamentario.education_levels.normalized === 'No_consta';
}

/**
 * Check if a parlamentario needs profession research
 */
export function needsProfessionResearch(
  parlamentario: ParlamentarioRaw | Parlamentario
): boolean {
  // Check if profession data exists in data_sources
  const hasProfession = parlamentario.data_sources.some(s => s.field === 'profesion' && s.raw_text && s.raw_text.trim() !== '');
  return !hasProfession;
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
  raw_text: string;
  field: 'estudios' | 'profesion';
  citations?: string[];
}

/**
 * Apply research results to a parlamentario without overwriting existing data
 *
 * CRITICAL: This function ensures that existing data is NEVER overwritten.
 * It only fills in fields that are currently missing.
 */
export function applyResearchResult<T extends ParlamentarioRaw>(
  parlamentario: T,
  result: ResearchResult
): T {
  const updated = { ...parlamentario };

  if (result.field === 'estudios' && needsEducationResearch(parlamentario)) {
    // Add new data source entry
    const newSource: DataSourceEntry = {
      source: 'perplexity',
      field: 'estudios',
      raw_text: result.raw_text,
      extracted_at: new Date().toISOString(),
      citations: result.citations,
    };

    updated.data_sources = [...parlamentario.data_sources, newSource];

    // Update education_levels
    updated.education_levels = normalizeEducation(result.raw_text);

    // Update research timestamp
    updated.last_researched = new Date().toISOString();
  }

  if (result.field === 'profesion' && needsProfessionResearch(parlamentario)) {
    // Add new data source entry
    const newSource: DataSourceEntry = {
      source: 'perplexity',
      field: 'profesion',
      raw_text: result.raw_text,
      extracted_at: new Date().toISOString(),
      citations: result.citations,
    };

    updated.data_sources = [...parlamentario.data_sources, newSource];

    // Update research timestamp
    updated.last_researched = new Date().toISOString();
  }

  return updated;
}

/**
 * Perplexity API research parameters
 */
export interface ResearchParams {
  nombre_completo: string;
  camara: 'Congreso' | 'Senado';
  circunscripcion: string;
  research_type: 'estudios' | 'profesion';
  perplexityApiKey: string;
}

/**
 * Response from Perplexity API
 */
export interface PerplexityResponse {
  success: boolean;
  found: boolean;
  result: {
    raw: string;
    citations: string[];
  };
}

/**
 * Research a parlamentario using Perplexity API
 *
 * NOTE: This function does NOT save results - it only calls the API
 * Use applyResearchResult() to save the results
 */
export async function researchParlamentario(
  params: ResearchParams
): Promise<PerplexityResponse> {
  const { nombre_completo, camara, circunscripcion, research_type, perplexityApiKey } = params;

  // Build prompt
  const prompts = {
    estudios: `What is the educational background of ${nombre_completo}, Spanish ${camara} member from ${circunscripcion}? Include degrees, universities, and fields of study. Be specific.`,
    profesion: `What is the professional background and occupation of ${nombre_completo}, Spanish ${camara} member from ${circunscripcion}? Include job titles, companies, and career history.`,
  };

  try {
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${perplexityApiKey}`,
      },
      body: JSON.stringify({
        model: 'sonar',
        messages: [
          {
            role: 'user',
            content: prompts[research_type],
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`Perplexity API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content || '';
    const citations = data.citations || [];

    // Check if response indicates no data found
    const noDataPhrases = [
      'no educational information',
      'no information available',
      'could not find',
      'no data found',
      'information is not available',
    ];

    const found = !noDataPhrases.some((phrase) => content.toLowerCase().includes(phrase));

    return {
      success: true,
      found,
      result: {
        raw: content,
        citations,
      },
    };
  } catch (error) {
    console.error('Perplexity API error:', error);
    return {
      success: false,
      found: false,
      result: {
        raw: '',
        citations: [],
      },
    };
  }
}
