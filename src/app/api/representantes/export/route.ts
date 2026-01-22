import { NextRequest, NextResponse } from 'next/server';
import { getParlamentarios } from '@/lib/data';

/**
 * GET /api/representantes/export
 *
 * Export the full dataset in JSON or CSV format.
 *
 * Query parameters:
 * - format: 'json' | 'csv' (default: 'json')
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const format = searchParams.get('format') || 'json';

  const parlamentarios = getParlamentarios();

  if (format === 'csv') {
    // Generate CSV
    const headers = [
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
    ];

    const escapeCSV = (value: string | null): string => {
      if (value === null) return '';
      const str = String(value);
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    const rows = parlamentarios.map((p) =>
      headers.map((h) => escapeCSV(p[h as keyof typeof p] as string | null)).join(',')
    );

    const csv = [headers.join(','), ...rows].join('\n');

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="parlamentarios_educacion_profesional.csv"',
      },
    });
  }

  // Default: JSON
  return new NextResponse(JSON.stringify(parlamentarios, null, 2), {
    headers: {
      'Content-Type': 'application/json',
      'Content-Disposition': 'attachment; filename="parlamentarios_educacion_profesional.json"',
    },
  });
}
