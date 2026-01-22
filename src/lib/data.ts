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
} from '@/types/parlamentario';
import { getPartidoColor } from '@/data/partidos';

/**
 * Path to the data file
 */
const DATA_PATH = path.join(process.cwd(), 'src', 'data', 'json', 'parlamentarios_espana_xv.json');

/**
 * Load raw data from JSON file
 * This runs at build time (server-side only)
 */
function loadRawData(): ParlamentarioRaw[] {
  const raw = fs.readFileSync(DATA_PATH, 'utf-8');
  return JSON.parse(raw) as ParlamentarioRaw[];
}

/**
 * Generate URL-safe slug from a name
 *
 * "García Pérez, Juan Antonio" → "garcia-perez-juan-antonio"
 */
export function generateSlug(nombre: string): string {
  return nombre
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[ñ]/g, 'n')
    .replace(/[ç]/g, 'c')
    .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
    .trim()
    .replace(/\s+/g, '-') // Spaces to hyphens
    .replace(/-+/g, '-'); // Collapse multiple hyphens
}

/**
 * Generate unique ID from camara + slug
 */
function generateId(camara: Camara, slug: string): string {
  const prefix = camara === 'Congreso' ? 'c' : 's';
  return `${prefix}-${slug}`;
}

/**
 * Transform raw JSON data into enriched Parlamentario objects
 */
function enrichParlamentarios(raw: ParlamentarioRaw[]): Parlamentario[] {
  return raw.map((p) => {
    const slug = generateSlug(p.nombre_completo);
    return {
      ...p,
      id: generateId(p.camara, slug),
      slug,
      partido_color: getPartidoColor(p.partido),
    };
  });
}

// Cache the enriched data (computed once at module load)
let _parlamentariosCache: Parlamentario[] | null = null;

/**
 * Get all parlamentarios (enriched with computed fields)
 *
 * This reads from static JSON at build time for SSG
 */
export function getParlamentarios(): Parlamentario[] {
  if (!_parlamentariosCache) {
    _parlamentariosCache = enrichParlamentarios(loadRawData());
  }
  return _parlamentariosCache;
}

/**
 * Get a single parlamentario by slug
 */
export function getParlamentarioBySlug(
  slug: string
): Parlamentario | undefined {
  return getParlamentarios().find((p) => p.slug === slug);
}

/**
 * Get a single parlamentario by ID
 */
export function getParlamentarioById(id: string): Parlamentario | undefined {
  return getParlamentarios().find((p) => p.id === id);
}

/**
 * Filter parlamentarios based on criteria
 */
export function filterParlamentarios(
  filters: ParlamentarioFilters
): Parlamentario[] {
  let result = getParlamentarios();

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
 * Compute aggregate statistics for the dataset
 */
export function computeStats(): EducacionStats {
  const parlamentarios = getParlamentarios();

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
    // Count by camara
    por_camara[p.camara]++;

    // Count by education level
    por_estudios_nivel[p.estudios_nivel]++;

    // Count by profession category
    por_profesion_categoria[p.profesion_categoria]++;

    // Count by party
    por_partido[p.partido] = (por_partido[p.partido] || 0) + 1;

    // Coverage stats
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
 * Get all unique values for a field (for filter dropdowns)
 */
export function getUniqueValues<K extends keyof Parlamentario>(
  field: K
): Parlamentario[K][] {
  const values = new Set(getParlamentarios().map((p) => p[field]));
  return Array.from(values).sort() as Parlamentario[K][];
}

/**
 * Get all unique circunscripciones (provinces)
 */
export function getCircunscripciones(): string[] {
  return getUniqueValues('circunscripcion') as string[];
}

/**
 * Get all unique partidos
 */
export function getPartidosFromData(): string[] {
  return getUniqueValues('partido') as string[];
}
