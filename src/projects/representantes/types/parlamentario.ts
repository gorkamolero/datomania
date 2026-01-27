/**
 * TypeScript types for the Parlamentarios España platform
 *
 * Data model supports multiple legislatures for historical comparison
 */

// Legislature identifiers
export type Legislature = 'I' | 'XV';

export const LEGISLATURE_INFO: Record<Legislature, { name: string; years: string; roman: string }> = {
  I: { name: 'I Legislatura', years: '1979-1982', roman: 'I' },
  XV: { name: 'XV Legislatura', years: '2023-presente', roman: 'XV' },
};

// Chamber types
export type Camara = 'Congreso' | 'Senado';

// Education level classifications
export type EstudiosNivel =
  | 'Universitario'
  | 'FP_Tecnico'
  | 'Secundario'
  | 'No_consta'
  | 'Universitario_inferido'
  | 'Estudios_incompletos';

// Profession category classifications
export type ProfesionCategoria =
  | 'Manual'
  | 'Oficina'
  | 'Funcionario'
  | 'Profesional_liberal'
  | 'Empresario'
  | 'Politica'
  | 'No_consta';

// Data source tracking (DEPRECATED - use data_sources array instead)
export type DataSource = 'official' | 'researched';

// Multi-source data tracking
export type DataSourceType = 'congreso' | 'senado' | 'perplexity';
export type DataFieldType = 'estudios' | 'profesion';

/**
 * Tracks a single piece of data from a specific source
 */
export interface DataSourceEntry {
  source: DataSourceType;
  field: DataFieldType;
  raw_text: string;
  extracted_at: string; // ISO timestamp
  extracted_value?: string; // normalized category
  citations?: string[]; // URLs or references
}

// Normalized education levels (current Spanish education system)
export type EstudiosNivelNormalized =
  | 'ESO' // Educación Secundaria Obligatoria (until 16)
  | 'Bachillerato' // Post-secondary (16-18)
  | 'FP_Grado_Medio' // Vocational training - medium level
  | 'FP_Grado_Superior' // Vocational training - advanced level
  | 'Grado' // University degree (post-Bologna, 4 years)
  | 'Licenciatura' // University degree (pre-Bologna, 5 years)
  | 'Master' // Master's degree
  | 'Doctorado' // PhD
  | 'No_consta'; // No data available

// Simplified education categories for broad analysis
export type EstudiosSimplificado = 'Obligatoria' | 'Postobligatoria' | 'Universitaria';

/**
 * Three-level education representation:
 * 1. Original: What they declared (raw text)
 * 2. Normalized: Mapped to current education system
 * 3. Simplified: Broad category (obligatoria/postobligatoria/universitaria)
 */
export interface EducationLevels {
  original: string;
  normalized: EstudiosNivelNormalized;
  simplified: EstudiosSimplificado;
}

/**
 * Education inference from profession
 * Used when education data is missing but profession suggests education level
 */
export interface EducationInference {
  inferred_education: string;
  inference_rule: 'profession_requires_degree' | 'occupation_implies_level';
  confidence: number; // 0-1
  applied: boolean; // Whether inference has been applied to education_levels
  reviewed_by: string | null;
  reviewed_at: string | null; // ISO timestamp
  approved: boolean | null;
}

// Status for parliamentarians (active vs departed)
export type Estado = 'activo' | 'baja';

/**
 * Raw parlamentario data as stored in JSON
 */
export interface ParlamentarioRaw {
  camara: Camara;
  nombre_completo: string;
  partido: string;
  grupo_parlamentario: string;
  circunscripcion: string;

  // Multi-source tracking
  data_sources: DataSourceEntry[];

  // Three-level education normalization
  education_levels: EducationLevels;

  // Education inference tracking (optional - only if inference was made)
  education_inference?: EducationInference;

  // Timestamps and links
  fecha_alta: string;
  url_ficha: string;

  // Status tracking for senators who left
  estado?: Estado;
  fecha_baja?: string;
  sustituido_por?: string;

  // Research tracking - avoid re-researching failed lookups (30-day cooldown)
  last_researched?: string; // ISO date of last Perplexity attempt
}

/**
 * Extended parlamentario with computed fields (slug, id, party color)
 */
export interface Parlamentario extends ParlamentarioRaw {
  id: string;
  slug: string;
  partido_color: string;
}

/**
 * Party metadata with colors for visualizations
 */
export interface Partido {
  id: string;
  nombre: string;
  nombre_corto: string;
  color: string;
  color_secundario?: string;
}

/**
 * Aggregate statistics for the data dump
 */
export interface EducacionStats {
  total: number;
  por_camara: Record<Camara, number>;
  por_estudios_nivel: Record<EstudiosNivel, number>;
  por_profesion_categoria: Record<ProfesionCategoria, number>;
  por_partido: Record<string, number>;
  cobertura: {
    estudios_con_datos: number;
    estudios_sin_datos: number;
    profesion_con_datos: number;
    profesion_sin_datos: number;
  };
  ultima_actualizacion: string;
}

/**
 * Filter options for the parlamentarios list
 */
export interface ParlamentarioFilters {
  camara?: Camara;
  partido?: string;
  estudios_nivel?: EstudiosNivel;
  profesion_categoria?: ProfesionCategoria;
  circunscripcion?: string;
  busqueda?: string;
}

/**
 * API response for paginated list
 */
export interface ParlamentariosListResponse {
  parlamentarios: Parlamentario[];
  total: number;
  pagina: number;
  por_pagina: number;
  total_paginas: number;
}

/**
 * Data quality validation report
 */
export interface DataQualityIssue {
  nombre_completo: string;
  issue: string;
  severity: 'high' | 'medium' | 'low';
}

export interface DataQualityReport {
  total: number;
  unique_names: number;
  active: number;
  baja: number;
  baja_missing_metadata: number; // fecha_baja or sustituido_por is null
  coverage: {
    education_complete: number;
    education_missing: number;
    profession_complete: number;
    profession_missing: number;
    both_complete: number;
  };
  conflicts: DataQualityIssue[]; // Sources disagree
  suspicious: DataQualityIssue[]; // Inconsistent data
}
