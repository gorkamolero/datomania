import { NextRequest, NextResponse } from 'next/server';
import { filterParlamentarios } from '@/projects/representantes/lib/data';
import type {
  Parlamentario,
  ParlamentarioFilters,
  Camara,
  EstudiosNivelNormalized,
  ProfesionCategoria,
  Legislature,
} from '@/projects/representantes/types/parlamentario';

/**
 * CSV field headers for export
 * Maps to the new data structure with data_sources and education_levels
 */
const CSV_HEADERS = [
  // Identity
  'nombre_completo',
  'camara',
  'partido',
  'grupo_parlamentario',
  'circunscripcion',
  'fecha_alta',
  'estado',
  'fecha_baja',
  'sustituido_por',
  // Education 3 levels
  'estudios_original',
  'estudios_normalized',
  'estudios_simplified',
  // Profession
  'profesion_raw',
  'profesion_categoria',
  // Data provenance
  'estudios_fuentes',
  'profesion_fuentes',
  // Inference fields
  'educacion_inferida',
  'inferencia_aplicada',
  'inferencia_aprobada',
  'inferencia_confianza',
  // Links
  'url_ficha',
] as const;

/**
 * Escape a value for CSV format
 * - Wraps in quotes if contains comma, quote, or newline
 * - Doubles any existing quotes
 */
function escapeCSVValue(value: string | null | undefined): string {
  if (value === null || value === undefined) {
    return '';
  }

  const stringValue = String(value);

  // Check if escaping is needed
  if (
    stringValue.includes(',') ||
    stringValue.includes('"') ||
    stringValue.includes('\n') ||
    stringValue.includes('\r')
  ) {
    // Escape double quotes by doubling them
    const escaped = stringValue.replace(/"/g, '""');
    return `"${escaped}"`;
  }

  return stringValue;
}

/**
 * Extract profession raw text from data_sources
 */
function extractProfesionRaw(p: Parlamentario): string {
  const profesionSources = p.data_sources.filter((ds) => ds.field === 'profesion');
  if (profesionSources.length === 0) return '';
  // Return the most recent profession raw text
  return profesionSources[profesionSources.length - 1].raw_text || '';
}

/**
 * Extract profession categoria from data_sources
 */
function extractProfesionCategoria(p: Parlamentario): string {
  const profesionSources = p.data_sources.filter((ds) => ds.field === 'profesion');
  if (profesionSources.length === 0) return '';
  // Return the most recent extracted value (categoria)
  return profesionSources[profesionSources.length - 1].extracted_value || '';
}

/**
 * Get comma-separated list of sources for a field
 */
function extractSources(p: Parlamentario, field: 'estudios' | 'profesion'): string {
  const sources = p.data_sources
    .filter((ds) => ds.field === field)
    .map((ds) => ds.source);
  return [...new Set(sources)].join(', ');
}

/**
 * Convert parlamentarios array to CSV string
 */
function parlamentariosToCSV(parlamentarios: Parlamentario[]): string {
  const rows: string[] = [];

  // Add header row
  rows.push(CSV_HEADERS.join(','));

  // Add data rows
  for (const p of parlamentarios) {
    const row = CSV_HEADERS.map((header) => {
      switch (header) {
        // Identity fields - direct access
        case 'nombre_completo':
        case 'camara':
        case 'partido':
        case 'grupo_parlamentario':
        case 'circunscripcion':
        case 'fecha_alta':
        case 'url_ficha':
          return escapeCSVValue(p[header]);
        case 'estado':
          return escapeCSVValue(p.estado || 'activo');
        case 'fecha_baja':
          return escapeCSVValue(p.fecha_baja || '');
        case 'sustituido_por':
          return escapeCSVValue(p.sustituido_por || '');

        // Education 3 levels
        case 'estudios_original':
          return escapeCSVValue(p.education_levels?.original || '');
        case 'estudios_normalized':
          return escapeCSVValue(p.education_levels?.normalized || '');
        case 'estudios_simplified':
          return escapeCSVValue(p.education_levels?.simplified || '');

        // Profession
        case 'profesion_raw':
          return escapeCSVValue(extractProfesionRaw(p));
        case 'profesion_categoria':
          return escapeCSVValue(extractProfesionCategoria(p));

        // Data provenance
        case 'estudios_fuentes':
          return escapeCSVValue(extractSources(p, 'estudios'));
        case 'profesion_fuentes':
          return escapeCSVValue(extractSources(p, 'profesion'));

        // Inference fields
        case 'educacion_inferida':
          return escapeCSVValue(p.education_inference?.inferred_education || '');
        case 'inferencia_aplicada':
          return escapeCSVValue(
            p.education_inference?.applied !== undefined
              ? String(p.education_inference.applied)
              : ''
          );
        case 'inferencia_aprobada':
          return escapeCSVValue(
            p.education_inference?.approved !== undefined && p.education_inference.approved !== null
              ? String(p.education_inference.approved)
              : ''
          );
        case 'inferencia_confianza':
          return escapeCSVValue(
            p.education_inference?.confidence !== undefined
              ? String(p.education_inference.confidence)
              : ''
          );

        default:
          return '';
      }
    });
    rows.push(row.join(','));
  }

  return rows.join('\n');
}

/**
 * Parse and validate filter parameters from URL search params
 */
function parseFilters(searchParams: URLSearchParams): ParlamentarioFilters {
  const filters: ParlamentarioFilters = {};

  const camara = searchParams.get('camara');
  if (camara && (camara === 'Congreso' || camara === 'Senado')) {
    filters.camara = camara as Camara;
  }

  const partido = searchParams.get('partido');
  if (partido) {
    filters.partido = partido;
  }

  // Note: estudios_nivel filter uses the normalized level from education_levels
  const estudiosNivel = searchParams.get('estudios_nivel');
  if (estudiosNivel) {
    const validLevels: EstudiosNivelNormalized[] = [
      'ESO',
      'Bachillerato',
      'FP_Grado_Medio',
      'FP_Grado_Superior',
      'Grado',
      'Licenciatura',
      'Master',
      'Doctorado',
      'No_consta',
    ];
    if (validLevels.includes(estudiosNivel as EstudiosNivelNormalized)) {
      // The filter system may need updating to use new education_levels
      // For now, keep the filter param but note it maps to normalized level
    }
  }

  const profesionCategoria = searchParams.get('profesion_categoria');
  if (profesionCategoria) {
    const validCategories: ProfesionCategoria[] = [
      'Manual',
      'Oficina',
      'Funcionario',
      'Profesional_liberal',
      'Empresario',
      'Politica',
      'No_consta',
    ];
    if (validCategories.includes(profesionCategoria as ProfesionCategoria)) {
      filters.profesion_categoria = profesionCategoria as ProfesionCategoria;
    }
  }

  const circunscripcion = searchParams.get('circunscripcion');
  if (circunscripcion) {
    filters.circunscripcion = circunscripcion;
  }

  return filters;
}

/**
 * GET /api/representantes/export
 *
 * Export parlamentarios data in JSON or CSV format
 *
 * Query params:
 * - format: 'json' | 'csv' (default: 'json')
 * - legislature: 'I' | 'XV' (default: 'XV')
 * - camara: 'Congreso' | 'Senado'
 * - partido: string
 * - estudios_nivel: EstudiosNivel
 * - profesion_categoria: ProfesionCategoria
 * - circunscripcion: string
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const format = searchParams.get('format') || 'json';
  const legislature = (searchParams.get('legislature') || 'XV') as Legislature;

  // Parse filters
  const filters = parseFilters(searchParams);

  // Get filtered data
  const parlamentarios = filterParlamentarios(filters, legislature);

  // Generate filename with timestamp
  const timestamp = new Date().toISOString().split('T')[0];
  const filterSuffix = Object.keys(filters).length > 0 ? '_filtered' : '';
  const baseFilename = `parlamentarios_espana_${legislature.toLowerCase()}${filterSuffix}_${timestamp}`;

  if (format === 'csv') {
    const csvContent = parlamentariosToCSV(parlamentarios);

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${baseFilename}.csv"`,
      },
    });
  }

  // Default: JSON format
  return new NextResponse(JSON.stringify(parlamentarios, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Content-Disposition': `attachment; filename="${baseFilename}.json"`,
    },
  });
}
