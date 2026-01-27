/**
 * Education mapping system for Spanish parliamentary data
 *
 * Maps historical Spanish education system to current normalized categories:
 * - Pre-1970 (Ley Moyano)
 * - 1970-1990 (Ley General de Educación - EGB, BUP, COU, FP)
 * - 1990-2006 (LOGSE - ESO, Bachillerato, FP)
 * - Pre-Bologna university (Licenciado, Diplomado, Ingeniero)
 * - Post-Bologna (Grado, Máster, Doctorado)
 *
 * Returns three levels:
 * 1. Original: Exact text from source
 * 2. Normalized: Mapped to current education system
 * 3. Simplified: Broad category (Obligatoria/Postobligatoria/Universitaria)
 */

import type { EducationLevels, EstudiosNivelNormalized, EstudiosSimplificado } from '../types/parlamentario';

/**
 * Historical education system mapping rules
 * Each entry maps a pattern to its normalized equivalent and simplified category
 */
interface EducationPattern {
  patterns: RegExp[];
  normalized: EstudiosNivelNormalized;
  simplified: EstudiosSimplificado;
  priority: number; // Higher priority wins (for detecting highest degree in compound text)
}

const EDUCATION_PATTERNS: EducationPattern[] = [
  // ============================================================================
  // UNIVERSITY - POST-BOLOGNA (Priority 9-7)
  // ============================================================================
  {
    patterns: [/\bdoctorado\b/i, /\bdoctor(?:a)?\b/i, /\bphd\b/i, /\btesis\s+doctoral\b/i],
    normalized: 'Doctorado',
    simplified: 'Universitaria',
    priority: 9,
  },
  {
    patterns: [/\bm[áa]ster\b/i, /\bmba\b/i, /\bpostgrado\b/i, /\bposgrado\b/i],
    normalized: 'Master',
    simplified: 'Universitaria',
    priority: 8,
  },

  // ============================================================================
  // UNIVERSITY - PRE-BOLOGNA (Priority 8-6)
  // ============================================================================
  {
    patterns: [
      /\blicenciad[oa]\b/i, // Licenciado/Licenciada
      /\blicenciatura\b/i,
      /\bingeni[eo]r[oa](?:\s+(?!t[ée]cnic[oa])|$)/i, // "Ingeniero/Ingeniera" but NOT "Técnico/a"
      /\barquitect[oa](?:\s+(?!t[ée]cnic[oa])|$)/i, // "Arquitecto/a" but NOT "Técnico/a"
    ],
    normalized: 'Licenciatura',
    simplified: 'Universitaria',
    priority: 8,
  },
  {
    patterns: [
      /\bdiplomad[oa]\b/i, // Diplomado/Diplomada
      /\bdiplomatura\b/i,
      /\bingeni[eo]r[oa]\s+t[ée]cnic[oa]/i, // Ingeniero/a Técnico/a
      /\barquitect[oa]\s+t[ée]cnic[oa]/i, // Arquitecto/a Técnico/a
    ],
    normalized: 'Grado',
    simplified: 'Universitaria',
    priority: 6,
  },

  // ============================================================================
  // POST-SECONDARY / VOCATIONAL (Priority 5-4)
  // These must come BEFORE "Grado" to avoid false matches
  // ============================================================================
  {
    patterns: [
      /\bciclo\s+formativo\s+de\s+grado\s+superior\b/i,
      /\bfp\s*(?:de\s*)?(?:grado\s*)?superior\b/i,
      /\bfp\s*2\b/i,
      /\bformaci[óo]n\s+profesional\s+de\s+segundo\s+grado\b/i,
      /\bt[ée]cnico\s+superior\b/i,
    ],
    normalized: 'FP_Grado_Superior',
    simplified: 'Postobligatoria',
    priority: 5,
  },
  {
    patterns: [
      /\bciclo\s+formativo\s+de\s+grado\s+medio\b/i,
      /\bfp\s*(?:de\s*)?(?:grado\s*)?medio\b/i,
      /\bfp\s*1\b/i,
      /\bformaci[óo]n\s+profesional\s+de\s+primer\s+grado\b/i,
      /\bt[ée]cnico\s+medio\b/i,
    ],
    normalized: 'FP_Grado_Medio',
    simplified: 'Postobligatoria',
    priority: 4,
  },

  // ============================================================================
  // UNIVERSITY - POST-BOLOGNA GRADO (Priority 7)
  // Must come AFTER FP patterns to avoid false matches with "FP Grado X"
  // ============================================================================
  {
    patterns: [
      /\bgrado\s+(?:en|universitario)/i,
      /\bgraduado\s+en\b/i,
      // "Grado" but NOT in FP contexts:
      // - NOT after "FP", "Ciclo Formativo de", "primer", "segundo"
      // - NOT before "medio" or "superior"
      /(?<!\bfp\s)(?<!\bciclo\s+formativo\s+de\s)(?<!\bprimer\s)(?<!\bsegundo\s)\bgrado\b(?!\s+(?:medio|superior))/i,
      /\bestudios\s+universitarios/i, // Catch "estudios universitarios"
      /\buniversitarios?\b/i, // General university education
    ],
    normalized: 'Grado',
    simplified: 'Universitaria',
    priority: 7,
  },

  {
    patterns: [
      /\bbachillerato\b/i,
      /\bbup\b/i,
      /\bcou\b/i,
      /\bbachiller\b/i,
    ],
    normalized: 'Bachillerato',
    simplified: 'Postobligatoria',
    priority: 4,
  },

  // ============================================================================
  // MANDATORY EDUCATION (Priority 6)
  // Higher priority to catch "Bachillerato Elemental" before general "Bachillerato"
  // ============================================================================
  {
    patterns: [
      /\bbachillerato\s+elemental\b/i, // Must come BEFORE general Bachillerato pattern
      /\beso\b/i,
      /\begb\b/i,
      /\bgraduado\s+escolar\b/i,
      /\beducaci[óo]n\s+secundaria\s+obligatoria\b/i,
      /\bense[ñn]anza\s+primaria\b/i,
    ],
    normalized: 'ESO',
    simplified: 'Obligatoria',
    priority: 6, // Higher than Bachillerato (priority 4)
  },

  // ============================================================================
  // NO DATA / SPECIAL CASES (Priority 1-2)
  // ============================================================================
  {
    patterns: [/\bno\s+consta\b/i, /\bsin\s+datos\b/i],
    normalized: 'No_consta',
    simplified: 'Obligatoria',
    priority: 1,
  },
  {
    patterns: [/\bsin\s+estudios\b/i],
    normalized: 'ESO',
    simplified: 'Obligatoria',
    priority: 2,
  },
];

/**
 * Normalizes education text to three-level representation
 *
 * @param educationText - Raw education text from official sources (or null)
 * @returns EducationLevels with original, normalized, and simplified fields
 *
 * @example
 * ```typescript
 * normalizeEducation('Licenciado en Derecho por la UCM')
 * // => {
 * //   original: 'Licenciado en Derecho por la UCM',
 * //   normalized: 'Licenciatura',
 * //   simplified: 'Universitaria'
 * // }
 * ```
 */
export function normalizeEducation(educationText: string | null): EducationLevels {
  // Handle null or empty input
  if (!educationText || educationText.trim() === '') {
    return {
      original: 'No consta',
      normalized: 'No_consta',
      simplified: 'Obligatoria',
    };
  }

  const original = educationText;
  const textLower = educationText.toLowerCase();

  // Find all matching patterns and select the one with highest priority
  let bestMatch: EducationPattern | null = null;

  for (const pattern of EDUCATION_PATTERNS) {
    const matches = pattern.patterns.some((regex) => regex.test(textLower));

    if (matches) {
      if (!bestMatch || pattern.priority > bestMatch.priority) {
        bestMatch = pattern;
      }
    }
  }

  // If we found a match, return it
  if (bestMatch) {
    return {
      original,
      normalized: bestMatch.normalized,
      simplified: bestMatch.simplified,
    };
  }

  // No match found - return as No_consta but preserve original text
  return {
    original,
    normalized: 'No_consta',
    simplified: 'Obligatoria',
  };
}

/**
 * Get a human-readable explanation of the normalized education level
 * Useful for UI tooltips and documentation
 */
export function getEducationExplanation(normalized: EstudiosNivelNormalized): string {
  const explanations: Record<EstudiosNivelNormalized, string> = {
    ESO: 'Educación Secundaria Obligatoria (hasta 16 años)',
    Bachillerato: 'Bachillerato (16-18 años)',
    FP_Grado_Medio: 'Formación Profesional de Grado Medio',
    FP_Grado_Superior: 'Formación Profesional de Grado Superior',
    Grado: 'Grado universitario (4 años, sistema Bolonia)',
    Licenciatura: 'Licenciatura/Ingeniería (5 años, sistema pre-Bolonia)',
    Master: 'Máster universitario',
    Doctorado: 'Doctorado (PhD)',
    No_consta: 'No consta / Dato no disponible',
  };

  return explanations[normalized] || 'Desconocido';
}

/**
 * Map old EstudiosNivel to new EstudiosNivelNormalized
 * Used during data migration from legacy system
 */
export function mapLegacyEducationLevel(legacyLevel: string): EstudiosNivelNormalized {
  const mapping: Record<string, EstudiosNivelNormalized> = {
    Universitario: 'Grado',
    Universitario_inferido: 'Grado',
    FP_Tecnico: 'FP_Grado_Superior',
    Secundario: 'ESO',
    Estudios_incompletos: 'ESO',
    No_consta: 'No_consta',
  };

  return mapping[legacyLevel] || 'No_consta';
}
