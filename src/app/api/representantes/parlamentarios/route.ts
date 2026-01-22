import { NextRequest, NextResponse } from 'next/server';
import { filterParlamentarios } from '@/lib/data';
import type { ParlamentarioFilters } from '@/types/parlamentario';

/**
 * GET /api/representantes/parlamentarios
 *
 * Returns a list of parlamentarios with optional filters and pagination.
 *
 * Query parameters:
 * - camara: 'Congreso' | 'Senado'
 * - partido: string
 * - estudios_nivel: 'Universitario' | 'FP_Tecnico' | 'Secundario' | 'No_consta' | 'Universitario_inferido'
 * - profesion_categoria: 'Manual' | 'Oficina' | 'Funcionario' | 'Profesional_liberal' | 'Empresario' | 'Politica' | 'No_consta'
 * - circunscripcion: string
 * - busqueda: string (search term)
 * - pagina: number (default: 1)
 * - por_pagina: number (default: 50, max: 100)
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  // Extract filters from query params
  const filters: ParlamentarioFilters = {};

  const camara = searchParams.get('camara');
  if (camara === 'Congreso' || camara === 'Senado') {
    filters.camara = camara;
  }

  const partido = searchParams.get('partido');
  if (partido) {
    filters.partido = partido;
  }

  const estudios_nivel = searchParams.get('estudios_nivel');
  if (estudios_nivel) {
    filters.estudios_nivel = estudios_nivel as ParlamentarioFilters['estudios_nivel'];
  }

  const profesion_categoria = searchParams.get('profesion_categoria');
  if (profesion_categoria) {
    filters.profesion_categoria = profesion_categoria as ParlamentarioFilters['profesion_categoria'];
  }

  const circunscripcion = searchParams.get('circunscripcion');
  if (circunscripcion) {
    filters.circunscripcion = circunscripcion;
  }

  const busqueda = searchParams.get('busqueda');
  if (busqueda) {
    filters.busqueda = busqueda;
  }

  // Apply filters
  const filtered = filterParlamentarios(filters);

  // Pagination
  const pagina = Math.max(1, parseInt(searchParams.get('pagina') || '1', 10));
  const por_pagina = Math.max(1, parseInt(searchParams.get('por_pagina') || '50', 10));

  const total = filtered.length;
  const total_paginas = Math.ceil(total / por_pagina);
  const start = (pagina - 1) * por_pagina;
  const end = start + por_pagina;

  const parlamentarios = filtered.slice(start, end);

  return NextResponse.json({
    parlamentarios,
    total,
    pagina,
    por_pagina,
    total_paginas,
  });
}
