import { NextRequest, NextResponse } from 'next/server';
import { filterParlamentarios } from '@/projects/representantes/lib/data';
import type {
  Parlamentario,
  ParlamentarioFilters,
  Camara,
  EstudiosNivel,
  ProfesionCategoria,
  Legislature,
} from '@/projects/representantes/types/parlamentario';

/**
 * CSV field headers matching Parlamentario interface
 */
const CSV_HEADERS = [
  'id',
  'slug',
  'camara',
  'nombre_completo',
  'partido',
  'grupo_parlamentario',
  'circunscripcion',
  'estudios_raw',
  'estudios_nivel',
  'profesion_raw',
  'profesion_categoria',
  'fecha_alta',
  'url_ficha',
  'bio_oficial',
  'source',
  'partido_color',
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
 * Convert parlamentarios array to CSV string
 */
function parlamentariosToCSV(parlamentarios: Parlamentario[]): string {
  const rows: string[] = [];

  // Add header row
  rows.push(CSV_HEADERS.join(','));

  // Add data rows
  for (const p of parlamentarios) {
    const row = CSV_HEADERS.map((header) => {
      const value = p[header as keyof Parlamentario];
      return escapeCSVValue(value as string | null | undefined);
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

  const estudiosNivel = searchParams.get('estudios_nivel');
  if (estudiosNivel) {
    const validLevels: EstudiosNivel[] = [
      'Universitario',
      'FP_Tecnico',
      'Secundario',
      'No_consta',
      'Universitario_inferido',
      'Estudios_incompletos',
    ];
    if (validLevels.includes(estudiosNivel as EstudiosNivel)) {
      filters.estudios_nivel = estudiosNivel as EstudiosNivel;
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
