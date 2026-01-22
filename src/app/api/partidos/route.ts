import { NextResponse } from 'next/server';
import { getAllPartidos } from '@/data/partidos';
import { getPartidosFromData } from '@/lib/data';

/**
 * GET /api/partidos
 *
 * Returns all political parties with their metadata and colors.
 */
export async function GET() {
  const partidos = getAllPartidos();
  const partidosInData = getPartidosFromData();

  // Filter to only include parties that actually appear in the data
  const partidosConDatos = partidos.filter((p) =>
    partidosInData.includes(p.nombre_corto)
  );

  return NextResponse.json({
    partidos: partidosConDatos,
    total: partidosConDatos.length,
  });
}
