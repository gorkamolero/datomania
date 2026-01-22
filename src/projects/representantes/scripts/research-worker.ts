#!/usr/bin/env npx tsx
/**
 * Research Worker Script
 *
 * Runs externally (GitHub Actions, Pi, local) to:
 * 1. Find parlamentarios needing research
 * 2. Call Perplexity API to get education data
 * 3. Update the JSON data files
 * 4. Commit and push to GitHub
 *
 * Usage:
 *   PERPLEXITY_API_KEY=xxx npx tsx research-worker.ts
 *
 * Options:
 *   --dry-run    Don't commit, just show what would change
 *   --limit N    Only process N items (default: all)
 */

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

// Config
const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY;
const DRY_RUN = process.argv.includes('--dry-run');
const LIMIT = (() => {
  const idx = process.argv.indexOf('--limit');
  return idx !== -1 ? parseInt(process.argv[idx + 1], 10) : Infinity;
})();
const DELAY_MS = 2500;

// Paths
const DATA_DIR = path.join(process.cwd(), 'src', 'projects', 'representantes', 'data');
const DATA_FILE = path.join(DATA_DIR, 'parlamentarios_espana_xv.json');
const METADATA_FILE = path.join(DATA_DIR, 'metadata.json');

// Types
interface Parlamentario {
  nombre_completo: string;
  camara: 'Congreso' | 'Senado';
  circunscripcion: string;
  partido: string;
  estudios_raw: string;
  estudios_nivel: string;
  profesion_raw: string;
  profesion_categoria: string;
  source: string;
  [key: string]: unknown;
}

interface PerplexityResponse {
  choices: Array<{ message: { content: string } }>;
  citations?: string[];
}

// Education classification (same as research.ts)
const EDUCATION_KEYWORDS: [string, string[]][] = [
  ['Doctorado', ['doctor', 'phd', 'doctorado', 'tesis doctoral']],
  ['Master', ['master', 'máster', 'postgrado', 'posgrado', 'mba']],
  ['FP', ['formación profesional', 'ciclo formativo', 'técnico superior', 'técnico medio', 'módulo profesional']],
  ['Universitario', [
    'licenciado', 'licenciatura', 'grado universitario', 'grado en',
    'ingeniero', 'ingeniería', 'derecho', 'medicina', 'arquitecto',
    'universidad', 'universitario', 'degree', 'bachelor', 'carrera universitaria',
  ]],
  ['Bachillerato', ['bachillerato', 'bachiller', 'bup', 'cou']],
  ['Secundaria', ['secundaria', 'eso', 'graduado escolar']],
];

function classifyEducation(text: string): string {
  const lower = text.toLowerCase();
  for (const [level, keywords] of EDUCATION_KEYWORDS) {
    for (const keyword of keywords) {
      if (lower.includes(keyword)) return level;
    }
  }
  return 'No_consta';
}

function isNoDataResponse(content: string): boolean {
  const lower = content.toLowerCase();
  return (
    lower.includes('no educational information found') ||
    lower.includes('no information available') ||
    lower.includes('could not find') ||
    lower.includes('no data found')
  );
}

async function researchEducation(p: Parlamentario): Promise<{ raw: string; nivel: string } | null> {
  const camaraLabel = p.camara === 'Senado' ? 'senator' : 'member of Congress';
  const prompt = `What is the educational background of ${p.nombre_completo}, Spanish ${camaraLabel} from ${p.circunscripcion}? Include degrees, universities, and fields of study. If no educational information is found, say "No educational information found."`;

  const response = await fetch('https://api.perplexity.ai/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${PERPLEXITY_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'sonar',
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!response.ok) {
    console.error(`  ✗ Perplexity error: ${response.status}`);
    return null;
  }

  const data = (await response.json()) as PerplexityResponse;
  const content = data.choices[0]?.message?.content || '';

  if (isNoDataResponse(content)) {
    return null;
  }

  const nivel = classifyEducation(content);
  if (nivel === 'No_consta') {
    return null;
  }

  return { raw: content.slice(0, 500), nivel };
}

function gitExec(cmd: string): string {
  try {
    return execSync(cmd, { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] }).trim();
  } catch (error) {
    console.error(`Git error: ${cmd}`);
    throw error;
  }
}

async function main() {
  console.log('=== Research Worker ===\n');

  if (!PERPLEXITY_API_KEY) {
    console.error('Error: PERPLEXITY_API_KEY not set');
    process.exit(1);
  }

  if (DRY_RUN) {
    console.log('🔸 DRY RUN - no changes will be committed\n');
  }

  // Load current data
  console.log('Loading parlamentarios data...');
  const parlamentarios: Parlamentario[] = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
  console.log(`  Total: ${parlamentarios.length}`);

  // Find those needing research
  const needsResearch = parlamentarios.filter((p) => p.estudios_nivel === 'No_consta');
  console.log(`  Needing research: ${needsResearch.length}`);

  const toProcess = needsResearch.slice(0, LIMIT);
  console.log(`  Processing: ${toProcess.length}\n`);

  if (toProcess.length === 0) {
    console.log('Nothing to research. Exiting.');
    return;
  }

  // Research each
  let updatedCount = 0;
  const updates: string[] = [];

  for (let i = 0; i < toProcess.length; i++) {
    const p = toProcess[i];
    console.log(`[${i + 1}/${toProcess.length}] ${p.nombre_completo}`);

    if (i > 0) {
      await new Promise((r) => setTimeout(r, DELAY_MS));
    }

    const result = await researchEducation(p);

    if (result) {
      console.log(`  ✓ Found: ${result.nivel}`);
      updates.push(`${p.nombre_completo}: ${result.nivel}`);

      // Update in-place
      const idx = parlamentarios.findIndex((x) => x.nombre_completo === p.nombre_completo);
      if (idx !== -1) {
        parlamentarios[idx].estudios_raw = result.raw;
        parlamentarios[idx].estudios_nivel = result.nivel;
        parlamentarios[idx].source = 'researched';
        updatedCount++;
      }
    } else {
      console.log('  ✗ No data found');
    }
  }

  console.log(`\n=== Summary ===`);
  console.log(`Processed: ${toProcess.length}`);
  console.log(`Updated: ${updatedCount}`);

  if (updatedCount === 0) {
    console.log('\nNo updates to commit.');
    return;
  }

  console.log('\nUpdates:');
  updates.forEach((u) => console.log(`  - ${u}`));

  if (DRY_RUN) {
    console.log('\n🔸 DRY RUN - skipping file write and commit');
    return;
  }

  // Write updated data
  console.log('\nWriting updated data...');
  fs.writeFileSync(DATA_FILE, JSON.stringify(parlamentarios, null, 2));

  // Update metadata
  const metadata = JSON.parse(fs.readFileSync(METADATA_FILE, 'utf-8'));
  metadata.lastUpdated = new Date().toISOString();
  metadata.totalParlamentarios = parlamentarios.length;
  fs.writeFileSync(METADATA_FILE, JSON.stringify(metadata, null, 2));

  // Git commit and push
  console.log('\nCommitting to GitHub...');
  try {
    gitExec('git add -A');
    const commitMsg = `data: update education data for ${updatedCount} parlamentario${updatedCount > 1 ? 's' : ''}\n\n${updates.join('\n')}`;
    gitExec(`git commit -m "${commitMsg.replace(/"/g, '\\"')}"`);
    gitExec('git push origin main');
    console.log('✓ Pushed to GitHub');
  } catch (error) {
    console.error('Git commit/push failed:', error);
    process.exit(1);
  }

  console.log('\n✅ Done! Vercel will auto-deploy.');
}

main().catch((error) => {
  console.error('Worker error:', error);
  process.exit(1);
});
