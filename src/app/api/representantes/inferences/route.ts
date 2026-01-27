import { NextRequest, NextResponse } from 'next/server';
import { getParlamentarios } from '@/projects/representantes/lib/data';
import type { Parlamentario, EducationInference } from '@/projects/representantes/types/parlamentario';

/**
 * Inference item for the review page
 */
export interface InferenceItem {
  id: string;
  slug: string;
  nombre_completo: string;
  partido: string;
  camara: string;
  circunscripcion: string;
  profession_raw: string;
  education_inference: EducationInference;
}

/**
 * GET /api/representantes/inferences
 *
 * Returns a list of parlamentarios with education_inference present.
 *
 * Query parameters:
 * - min_confidence: number (0-1) - Filter by minimum confidence
 * - status: 'pending' | 'approved' | 'rejected' | 'all' - Filter by approval status
 * - pagina: number (default: 1)
 * - por_pagina: number (default: 50, max: 100)
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const parlamentarios = getParlamentarios();

  // Filter to only those with education_inference
  const withInference = parlamentarios.filter(
    (p): p is Parlamentario & { education_inference: EducationInference } =>
      p.education_inference !== undefined
  );

  // Apply filters
  let filtered = withInference;

  // Min confidence filter
  const minConfidence = searchParams.get('min_confidence');
  if (minConfidence) {
    const minConf = parseFloat(minConfidence);
    if (!isNaN(minConf)) {
      filtered = filtered.filter((p) => p.education_inference.confidence >= minConf);
    }
  }

  // Status filter
  const status = searchParams.get('status') || 'all';
  if (status === 'pending') {
    filtered = filtered.filter((p) => p.education_inference.approved === null);
  } else if (status === 'approved') {
    filtered = filtered.filter((p) => p.education_inference.approved === true);
  } else if (status === 'rejected') {
    filtered = filtered.filter((p) => p.education_inference.approved === false);
  }

  // Transform to inference items
  const inferenceItems: InferenceItem[] = filtered.map((p) => {
    const professionSource = p.data_sources.find((s) => s.field === 'profesion');
    return {
      id: p.id,
      slug: p.slug,
      nombre_completo: p.nombre_completo,
      partido: p.partido,
      camara: p.camara,
      circunscripcion: p.circunscripcion,
      profession_raw: professionSource?.raw_text || '',
      education_inference: p.education_inference,
    };
  });

  // Sort by confidence descending
  inferenceItems.sort((a, b) => b.education_inference.confidence - a.education_inference.confidence);

  // Pagination
  const pagina = Math.max(1, parseInt(searchParams.get('pagina') || '1', 10));
  const por_pagina = Math.min(100, Math.max(1, parseInt(searchParams.get('por_pagina') || '50', 10)));

  const total = inferenceItems.length;
  const total_paginas = Math.ceil(total / por_pagina);
  const start = (pagina - 1) * por_pagina;
  const end = start + por_pagina;

  const paginatedItems = inferenceItems.slice(start, end);

  // Stats
  const stats = {
    total: withInference.length,
    pending: withInference.filter((p) => p.education_inference.approved === null).length,
    approved: withInference.filter((p) => p.education_inference.approved === true).length,
    rejected: withInference.filter((p) => p.education_inference.approved === false).length,
    high_confidence: withInference.filter((p) => p.education_inference.confidence >= 0.95).length,
  };

  return NextResponse.json({
    inferences: paginatedItems,
    stats,
    total,
    pagina,
    por_pagina,
    total_paginas,
  });
}
