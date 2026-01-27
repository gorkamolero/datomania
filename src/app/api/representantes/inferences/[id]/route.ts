import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import type { ParlamentarioRaw, Legislature } from '@/projects/representantes/types/parlamentario';

/**
 * Data file paths per legislature
 */
const DATA_PATHS: Record<Legislature, string> = {
  I: path.join(process.cwd(), 'src', 'projects', 'representantes', 'data', 'parlamentarios_espana_i.json'),
  XV: path.join(process.cwd(), 'src', 'projects', 'representantes', 'data', 'parlamentarios_espana_xv.json'),
};

/**
 * Update inference request body
 */
interface UpdateInferenceRequest {
  action: 'approve' | 'reject' | 'modify';
  reviewed_by: string;
  modified_education?: string; // Only for 'modify' action
}

/**
 * PUT /api/representantes/inferences/[id]
 *
 * Updates an inference (approve, reject, or modify).
 *
 * Request body:
 * - action: 'approve' | 'reject' | 'modify'
 * - reviewed_by: string (name of reviewer)
 * - modified_education: string (only for 'modify' action)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Parse ID to determine legislature and find parlamentario
  // ID format: legislature-chamber-slug (e.g., xv-c-abascal-conde-santiago)
  const legislature = id.split('-')[0].toUpperCase() as Legislature;

  if (legislature !== 'I' && legislature !== 'XV') {
    return NextResponse.json({ error: 'Invalid legislature in ID' }, { status: 400 });
  }

  // Load data
  const dataPath = DATA_PATHS[legislature];
  const rawData = fs.readFileSync(dataPath, 'utf-8');
  const parlamentarios: ParlamentarioRaw[] = JSON.parse(rawData);

  // Find parlamentario by reconstructing slug from ID
  const slugPart = id.slice(id.indexOf('-', id.indexOf('-') + 1) + 1);
  const camaraPrefix = id.split('-')[1];
  const expectedCamara = camaraPrefix === 'c' ? 'Congreso' : 'Senado';

  const parlamentarioIndex = parlamentarios.findIndex((p) => {
    const pSlug = p.nombre_completo
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[ñ]/g, 'n')
      .replace(/[ç]/g, 'c')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
    return pSlug === slugPart && p.camara === expectedCamara;
  });

  if (parlamentarioIndex === -1) {
    return NextResponse.json({ error: 'Parlamentario not found' }, { status: 404 });
  }

  const parlamentario = parlamentarios[parlamentarioIndex];

  if (!parlamentario.education_inference) {
    return NextResponse.json({ error: 'No inference to update' }, { status: 400 });
  }

  // Parse request body
  let body: UpdateInferenceRequest;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { action, reviewed_by, modified_education } = body;

  if (!action || !reviewed_by) {
    return NextResponse.json({ error: 'Missing action or reviewed_by' }, { status: 400 });
  }

  if (action === 'modify' && !modified_education) {
    return NextResponse.json({ error: 'modified_education required for modify action' }, { status: 400 });
  }

  // Update inference
  const now = new Date().toISOString();

  switch (action) {
    case 'approve':
      parlamentario.education_inference = {
        ...parlamentario.education_inference,
        approved: true,
        applied: true,
        reviewed_by,
        reviewed_at: now,
      };
      break;

    case 'reject':
      parlamentario.education_inference = {
        ...parlamentario.education_inference,
        approved: false,
        applied: false,
        reviewed_by,
        reviewed_at: now,
      };
      break;

    case 'modify':
      parlamentario.education_inference = {
        ...parlamentario.education_inference,
        inferred_education: modified_education!,
        approved: true,
        applied: true,
        reviewed_by,
        reviewed_at: now,
      };
      break;

    default:
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  }

  // Update array
  parlamentarios[parlamentarioIndex] = parlamentario;

  // Save to file
  fs.writeFileSync(dataPath, JSON.stringify(parlamentarios, null, 2), 'utf-8');

  return NextResponse.json({
    success: true,
    id,
    action,
    education_inference: parlamentario.education_inference,
  });
}
