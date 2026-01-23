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

// Data source tracking
export type DataSource = 'official' | 'researched';

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
  estudios_raw: string | null;
  estudios_nivel: EstudiosNivel;
  profesion_raw: string | null;
  profesion_categoria: ProfesionCategoria;
  fecha_alta: string;
  url_ficha: string;
  bio_oficial?: string;
  source: DataSource;
  // Status tracking for senators who left
  estado?: Estado;
  fecha_baja?: string;
  sustituido_por?: string;
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
