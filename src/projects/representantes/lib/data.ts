import fs from 'fs';
import path from 'path';
import type {
  Parlamentario,
  ParlamentarioRaw,
  ParlamentarioFilters,
  EducacionStats,
  Camara,
  EstudiosNivel,
  ProfesionCategoria,
  Legislature,
} from '@/projects/representantes/types/parlamentario';
import { getPartidoColor } from '@/projects/representantes/data/partidos';

/**
 * Data file paths per legislature
 */
const DATA_PATHS: Record<Legislature, string> = {
  I: path.join(process.cwd(), 'src', 'projects', 'representantes', 'data', 'parlamentarios_espana_i.json'),
  XV: path.join(process.cwd(), 'src', 'projects', 'representantes', 'data', 'parlamentarios_espana_xv.json'),
};

const DEFAULT_LEGISLATURE: Legislature = 'XV';

/**
 * Load raw data from JSON file for a specific legislature
 */
function loadRawData(legislature: Legislature = DEFAULT_LEGISLATURE): ParlamentarioRaw[] {
  const raw = fs.readFileSync(DATA_PATHS[legislature], 'utf-8');
  return JSON.parse(raw) as ParlamentarioRaw[];
}

/**
 * Generate URL-safe slug from a name
 */
export function generateSlug(nombre: string): string {
  return nombre
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[ñ]/g, 'n')
    .replace(/[ç]/g, 'c')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

/**
 * Generate unique ID from legislature + camara + slug
 */
function generateId(legislature: Legislature, camara: Camara, slug: string): string {
  const prefix = camara === 'Congreso' ? 'c' : 's';
  return `${legislature.toLowerCase()}-${prefix}-${slug}`;
}

/**
 * Transform raw JSON data into enriched Parlamentario objects
 */
function enrichParlamentarios(raw: ParlamentarioRaw[], legislature: Legislature): Parlamentario[] {
  return raw.map((p) => {
    const slug = generateSlug(p.nombre_completo);
    return {
      ...p,
      id: generateId(legislature, p.camara, slug),
      slug,
      partido_color: getPartidoColor(p.partido),
    };
  });
}

// Cache per legislature
const _cache: Record<Legislature, Parlamentario[] | null> = {
  I: null,
  XV: null,
};

/**
 * Get all parlamentarios for a legislature (enriched with computed fields)
 */
export function getParlamentarios(legislature: Legislature = DEFAULT_LEGISLATURE): Parlamentario[] {
  if (!_cache[legislature]) {
    _cache[legislature] = enrichParlamentarios(loadRawData(legislature), legislature);
  }
  return _cache[legislature]!;
}

/**
 * Get a single parlamentario by slug (searches default legislature)
 */
export function getParlamentarioBySlug(
  slug: string,
  legislature: Legislature = DEFAULT_LEGISLATURE
): Parlamentario | undefined {
  return getParlamentarios(legislature).find((p) => p.slug === slug);
}

/**
 * Get a single parlamentario by ID
 */
export function getParlamentarioById(
  id: string,
  legislature: Legislature = DEFAULT_LEGISLATURE
): Parlamentario | undefined {
  return getParlamentarios(legislature).find((p) => p.id === id);
}

/**
 * Filter parlamentarios based on criteria
 */
export function filterParlamentarios(
  filters: ParlamentarioFilters,
  legislature: Legislature = DEFAULT_LEGISLATURE
): Parlamentario[] {
  let result = getParlamentarios(legislature);

  if (filters.camara) {
    result = result.filter((p) => p.camara === filters.camara);
  }

  if (filters.partido) {
    result = result.filter((p) => p.partido === filters.partido);
  }

  if (filters.estudios_nivel) {
    result = result.filter((p) => p.estudios_nivel === filters.estudios_nivel);
  }

  if (filters.profesion_categoria) {
    result = result.filter(
      (p) => p.profesion_categoria === filters.profesion_categoria
    );
  }

  if (filters.circunscripcion) {
    result = result.filter((p) => p.circunscripcion === filters.circunscripcion);
  }

  if (filters.busqueda) {
    const searchTerm = filters.busqueda.toLowerCase();
    result = result.filter(
      (p) =>
        p.nombre_completo.toLowerCase().includes(searchTerm) ||
        p.partido.toLowerCase().includes(searchTerm) ||
        p.circunscripcion.toLowerCase().includes(searchTerm)
    );
  }

  return result;
}

/**
 * Compute aggregate statistics for a legislature
 */
export function computeStats(legislature: Legislature = DEFAULT_LEGISLATURE): EducacionStats {
  const parlamentarios = getParlamentarios(legislature);

  const por_camara: Record<Camara, number> = {
    Congreso: 0,
    Senado: 0,
  };

  const por_estudios_nivel: Record<EstudiosNivel, number> = {
    Universitario: 0,
    FP_Tecnico: 0,
    Secundario: 0,
    No_consta: 0,
    Universitario_inferido: 0,
    Estudios_incompletos: 0,
  };

  const por_profesion_categoria: Record<ProfesionCategoria, number> = {
    Manual: 0,
    Oficina: 0,
    Funcionario: 0,
    Profesional_liberal: 0,
    Empresario: 0,
    Politica: 0,
    No_consta: 0,
  };

  const por_partido: Record<string, number> = {};

  let estudios_con_datos = 0;
  let profesion_con_datos = 0;

  for (const p of parlamentarios) {
    por_camara[p.camara]++;

    // Map education levels
    if (p.estudios_nivel in por_estudios_nivel) {
      por_estudios_nivel[p.estudios_nivel]++;
    } else {
      // Handle legacy data with different category names
      const mapped = mapEducationLevel(p.estudios_nivel);
      por_estudios_nivel[mapped]++;
    }

    // Map profession categories
    if (p.profesion_categoria in por_profesion_categoria) {
      por_profesion_categoria[p.profesion_categoria]++;
    } else {
      por_profesion_categoria['No_consta']++;
    }

    por_partido[p.partido] = (por_partido[p.partido] || 0) + 1;

    if (p.estudios_nivel !== 'No_consta') {
      estudios_con_datos++;
    }
    if (p.profesion_categoria !== 'No_consta') {
      profesion_con_datos++;
    }
  }

  return {
    total: parlamentarios.length,
    por_camara,
    por_estudios_nivel,
    por_profesion_categoria,
    por_partido,
    cobertura: {
      estudios_con_datos,
      estudios_sin_datos: parlamentarios.length - estudios_con_datos,
      profesion_con_datos,
      profesion_sin_datos: parlamentarios.length - profesion_con_datos,
    },
    ultima_actualizacion: new Date().toISOString().split('T')[0],
  };
}

/**
 * Map education level strings to standard categories
 */
function mapEducationLevel(level: string): EstudiosNivel {
  const mapping: Record<string, EstudiosNivel> = {
    'Doctorado': 'Universitario',
    'Master': 'Universitario',
    'Universitario': 'Universitario',
    'FP': 'FP_Tecnico',
    'Bachillerato': 'Secundario',
    'Secundaria': 'Secundario',
  };
  return mapping[level] || 'No_consta';
}

/**
 * Compare statistics between two legislatures
 */
export interface LegislatureComparison {
  legislature1: Legislature;
  legislature2: Legislature;
  stats1: EducacionStats;
  stats2: EducacionStats;
  changes: {
    total_change: number;
    universitario_pct_change: number;
    no_consta_pct_change: number;
  };
}

export function compareLegislatures(
  leg1: Legislature,
  leg2: Legislature
): LegislatureComparison {
  const stats1 = computeStats(leg1);
  const stats2 = computeStats(leg2);

  const uni1_pct = (stats1.por_estudios_nivel.Universitario / stats1.total) * 100;
  const uni2_pct = (stats2.por_estudios_nivel.Universitario / stats2.total) * 100;

  const nc1_pct = (stats1.por_estudios_nivel.No_consta / stats1.total) * 100;
  const nc2_pct = (stats2.por_estudios_nivel.No_consta / stats2.total) * 100;

  return {
    legislature1: leg1,
    legislature2: leg2,
    stats1,
    stats2,
    changes: {
      total_change: stats2.total - stats1.total,
      universitario_pct_change: uni2_pct - uni1_pct,
      no_consta_pct_change: nc2_pct - nc1_pct,
    },
  };
}

/**
 * Get all unique values for a field
 */
export function getUniqueValues<K extends keyof Parlamentario>(
  field: K,
  legislature: Legislature = DEFAULT_LEGISLATURE
): Parlamentario[K][] {
  const values = new Set(getParlamentarios(legislature).map((p) => p[field]));
  return Array.from(values).sort() as Parlamentario[K][];
}

/**
 * Get all unique circunscripciones
 */
export function getCircunscripciones(legislature: Legislature = DEFAULT_LEGISLATURE): string[] {
  return getUniqueValues('circunscripcion', legislature) as string[];
}

/**
 * Get all unique partidos
 */
export function getPartidosFromData(legislature: Legislature = DEFAULT_LEGISLATURE): string[] {
  return getUniqueValues('partido', legislature) as string[];
}

/**
 * Get available legislatures
 */
export function getAvailableLegislatures(): Legislature[] {
  return ['I', 'XV'];
}

/**
 * Metadata about the dataset
 */
export interface DataMetadata {
  lastUpdated: string;
  legislature: string;
  totalParlamentarios: number;
  sources: {
    congreso: string;
    senado: string;
  };
}

const METADATA_PATH = path.join(
  process.cwd(),
  'src',
  'projects',
  'representantes',
  'data',
  'metadata.json'
);

/**
 * Get dataset metadata including last update timestamp
 */
export function getMetadata(): DataMetadata {
  const raw = fs.readFileSync(METADATA_PATH, 'utf-8');
  return JSON.parse(raw) as DataMetadata;
}

/**
 * Format date for display (e.g., "22 ene 2025")
 */
export function formatLastUpdated(isoDate: string): string {
  const date = new Date(isoDate);
  const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
}
