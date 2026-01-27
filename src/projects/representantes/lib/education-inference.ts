/**
 * Education inference engine
 *
 * Infers education level from profession when education data is missing.
 * Uses pattern matching rules based on profession requirements.
 *
 * Example: "Abogado" (Lawyer) requires "Licenciado en Derecho" (Law degree)
 */

import type { EducationInference, ParlamentarioRaw, ProfesionCategoria } from '../types/parlamentario';

/**
 * Inference rule definition
 */
interface ProfessionEducationRule {
  profession_pattern: RegExp;
  inferred_education: string;
  confidence: number; // 0-1 scale
  inference_rule: 'profession_requires_degree' | 'occupation_implies_level';
}

/**
 * Profession-based education inference rules
 * Ordered by confidence (highest first)
 */
export const PROFESSION_EDUCATION_RULES: ProfessionEducationRule[] = [
  // ============================================================================
  // LEGAL PROFESSIONS (95% confidence)
  // ============================================================================
  {
    profession_pattern: /\b(?:abogad[oa]|letrad[oa])\b/i,
    inferred_education: 'Licenciado en Derecho',
    confidence: 0.95,
    inference_rule: 'profession_requires_degree',
  },

  // ============================================================================
  // MEDICAL PROFESSIONS (95% confidence)
  // ============================================================================
  {
    profession_pattern: /\b(?:m[ée]dic[oa]|doctor(?:a)?\s+en\s+medicina|cirujano|cirujana)\b/i,
    inferred_education: 'Licenciado en Medicina',
    confidence: 0.95,
    inference_rule: 'profession_requires_degree',
  },

  // ============================================================================
  // HEALTHCARE PROFESSIONS (90% confidence)
  // ============================================================================
  {
    profession_pattern: /\b(?:enfermer[oa])\b/i,
    inferred_education: 'Diplomado en Enfermería',
    confidence: 0.90,
    inference_rule: 'profession_requires_degree',
  },
  {
    profession_pattern: /\b(?:farmac[ée]utic[oa])\b/i,
    inferred_education: 'Licenciado en Farmacia',
    confidence: 0.90,
    inference_rule: 'profession_requires_degree',
  },

  // ============================================================================
  // ARCHITECTURE (90% confidence)
  // ============================================================================
  {
    profession_pattern: /\b(?:arquitect[oa])\b/i,
    inferred_education: 'Arquitectura',
    confidence: 0.90,
    inference_rule: 'profession_requires_degree',
  },

  // ============================================================================
  // ECONOMICS & FINANCE (85% confidence)
  // ============================================================================
  {
    profession_pattern: /\b(?:economista)\b/i,
    inferred_education: 'Licenciado en Economía',
    confidence: 0.85,
    inference_rule: 'profession_requires_degree',
  },
  {
    profession_pattern: /\b(?:auditor|auditora)\b/i,
    inferred_education: 'Licenciado en Economía o ADE',
    confidence: 0.80,
    inference_rule: 'profession_requires_degree',
  },

  // ============================================================================
  // ENGINEERING (80% confidence, field ambiguous)
  // ============================================================================
  {
    profession_pattern: /\b(?:ingenier[oa])\b/i,
    inferred_education: 'Ingeniería',
    confidence: 0.80,
    inference_rule: 'profession_requires_degree',
  },

  // ============================================================================
  // ACADEMIC PROFESSIONS (70% confidence)
  // ============================================================================
  {
    profession_pattern: /\b(?:catedr[áa]tic[oa]|profesor[a]?\s+(?:de\s+)?universidad|profesor[a]?\s+universitari[oa])\b/i,
    inferred_education: 'Doctorado',
    confidence: 0.70,
    inference_rule: 'occupation_implies_level',
  },
];

/**
 * Infers education from profession text
 *
 * @param profesionRaw - Raw profession text
 * @param profesionCategoria - Profession category (reserved for future use)
 * @returns EducationInference object or null if no inference possible
 *
 * @example
 * ```typescript
 * inferEducationFromProfession('Abogado', 'Profesional_liberal')
 * // => {
 * //   inferred_education: 'Licenciado en Derecho',
 * //   inference_rule: 'profession_requires_degree',
 * //   confidence: 0.95,
 * //   applied: false,
 * //   reviewed_by: null,
 * //   reviewed_at: null,
 * //   approved: null
 * // }
 * ```
 */
export function inferEducationFromProfession(
  profesionRaw: string | null,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  profesionCategoria: ProfesionCategoria
): EducationInference | null {
  // Skip inference for missing or generic professions
  if (!profesionRaw || profesionRaw.trim() === '' || profesionRaw.toLowerCase() === 'no consta') {
    return null;
  }

  // Skip inference for generic categories with no specific profession text
  const genericProfessions = ['empresario', 'político', 'funcionario', 'no consta'];
  if (genericProfessions.includes(profesionRaw.toLowerCase().trim())) {
    return null;
  }

  const textLower = profesionRaw.toLowerCase();

  // Find the first matching rule (rules are ordered by confidence)
  for (const rule of PROFESSION_EDUCATION_RULES) {
    if (rule.profession_pattern.test(textLower)) {
      return {
        inferred_education: rule.inferred_education,
        inference_rule: rule.inference_rule,
        confidence: rule.confidence,
        applied: false, // Not applied by default, needs review/approval
        reviewed_by: null,
        reviewed_at: null,
        approved: null,
      };
    }
  }

  // No matching rule found
  return null;
}

/**
 * Checks if a parlamentario needs education inference
 *
 * Returns true if:
 * - Education is "No_consta"
 * - Profession data exists and is not "No_consta"
 * - No inference has been attempted yet
 *
 * @param parlamentario - Parlamentario to check
 * @returns true if inference is needed
 */
export function needsEducationInference(parlamentario: ParlamentarioRaw): boolean {
  // Already has education data
  if (parlamentario.education_levels.normalized !== 'No_consta') {
    return false;
  }

  // No profession data to infer from
  const professionSource = parlamentario.data_sources.find(s => s.field === 'profesion');
  if (!professionSource || !professionSource.raw_text || professionSource.raw_text.trim() === '') {
    return false;
  }

  // Already has an inference
  if (parlamentario.education_inference) {
    return false;
  }

  return true;
}

/**
 * Applies an inference to a parlamentario
 * Used during data migration or when an inference is approved
 *
 * @param parlamentario - Parlamentario to update
 * @param inference - Inference to apply
 * @param reviewedBy - Name of person who reviewed/approved
 * @returns Updated parlamentario
 */
export function applyInference(
  parlamentario: ParlamentarioRaw,
  inference: EducationInference,
  reviewedBy?: string
): ParlamentarioRaw {
  return {
    ...parlamentario,
    education_inference: {
      ...inference,
      applied: true,
      reviewed_by: reviewedBy || null,
      reviewed_at: new Date().toISOString(),
      approved: true,
    },
  };
}

/**
 * Gets all parlamentarios that could benefit from inference
 *
 * @param parlamentarios - Array of parlamentarios
 * @returns Array of parlamentarios needing inference with their potential inference
 */
export function getParlamentariosNeedingInference(
  parlamentarios: ParlamentarioRaw[]
): Array<{ parlamentario: ParlamentarioRaw; inference: EducationInference }> {
  const needingInference: Array<{ parlamentario: ParlamentarioRaw; inference: EducationInference }> =
    [];

  for (const p of parlamentarios) {
    if (needsEducationInference(p)) {
      const professionSource = p.data_sources.find(s => s.field === 'profesion');
      if (professionSource) {
        const inference = inferEducationFromProfession(professionSource.raw_text, 'Profesional_liberal');
        if (inference) {
          needingInference.push({ parlamentario: p, inference });
        }
      }
    }
  }

  return needingInference;
}
