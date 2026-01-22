#!/usr/bin/env npx tsx
/**
 * Research Worker Script
 *
 * Runs externally (Pi, GitHub Actions, local) to process the research queue.
 * Fetches queue from API, processes each item, saves results to JSON.
 *
 * Usage:
 *   CRON_SECRET=xxx API_BASE_URL=https://your-app.vercel.app npx tsx research-worker.ts
 *
 * For local dev:
 *   CRON_SECRET=xxx API_BASE_URL=http://localhost:3000 npx tsx research-worker.ts
 *
 * Outputs results to research-results-{timestamp}.json
 */

import * as fs from 'fs';
import * as path from 'path';

const CRON_SECRET = process.env.CRON_SECRET;
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';
const DELAY_MS = 2500; // 2.5 seconds between requests to be safe

interface QueueItem {
  nombre_completo: string;
  camara: 'Congreso' | 'Senado';
  circunscripcion: string;
  partido: string;
  missing: {
    estudios: boolean;
    profesion: boolean;
  };
}

interface QueueResponse {
  timestamp: string;
  total: number;
  queue: QueueItem[];
}

interface ProcessResponse {
  success: boolean;
  nombre_completo: string;
  research_type: string;
  found: boolean;
  result: {
    raw: string;
    estudios_nivel?: string;
    citations: string[];
  };
  timestamp: string;
}

interface ResearchResult {
  nombre_completo: string;
  camara: string;
  found: boolean;
  estudios_raw?: string;
  estudios_nivel?: string;
  citations?: string[];
  error?: string;
}

async function fetchQueue(): Promise<QueueItem[]> {
  const response = await fetch(`${API_BASE_URL}/api/research/queue`, {
    headers: {
      Authorization: `Bearer ${CRON_SECRET}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch queue: ${response.status}`);
  }

  const data = (await response.json()) as QueueResponse;
  return data.queue;
}

async function processItem(item: QueueItem): Promise<ProcessResponse> {
  const response = await fetch(`${API_BASE_URL}/api/research/process`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${CRON_SECRET}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      nombre_completo: item.nombre_completo,
      camara: item.camara,
      circunscripcion: item.circunscripcion,
      research_type: item.missing.estudios ? 'estudios' : 'profesion',
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to process: ${error}`);
  }

  return response.json();
}

async function main() {
  console.log('=== Research Worker ===\n');

  if (!CRON_SECRET) {
    console.error('Error: CRON_SECRET environment variable not set');
    process.exit(1);
  }

  console.log(`API Base: ${API_BASE_URL}`);
  console.log('Fetching research queue...\n');

  // Fetch queue
  const queue = await fetchQueue();
  console.log(`Found ${queue.length} items needing research\n`);

  if (queue.length === 0) {
    console.log('Nothing to research. Exiting.');
    return;
  }

  // Process each item
  const results: ResearchResult[] = [];
  let successCount = 0;

  for (let i = 0; i < queue.length; i++) {
    const item = queue[i];
    console.log(`[${i + 1}/${queue.length}] ${item.nombre_completo}`);

    try {
      // Rate limit
      if (i > 0) {
        await new Promise((resolve) => setTimeout(resolve, DELAY_MS));
      }

      const response = await processItem(item);

      if (response.found && response.result.estudios_nivel !== 'No_consta') {
        successCount++;
        console.log(`  ✓ Found: ${response.result.estudios_nivel}`);
      } else {
        console.log(`  ✗ No data found`);
      }

      results.push({
        nombre_completo: item.nombre_completo,
        camara: item.camara,
        found: response.found,
        estudios_raw: response.result.raw,
        estudios_nivel: response.result.estudios_nivel,
        citations: response.result.citations,
      });
    } catch (error) {
      console.log(`  ✗ Error: ${error instanceof Error ? error.message : 'Unknown'}`);
      results.push({
        nombre_completo: item.nombre_completo,
        camara: item.camara,
        found: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  // Save results
  const timestamp = new Date().toISOString().slice(0, 19).replace(/[T:]/g, '-');
  const outputPath = path.join(process.cwd(), `research-results-${timestamp}.json`);

  const output = {
    timestamp: new Date().toISOString(),
    total_processed: results.length,
    successful: successCount,
    results,
  };

  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));

  // Summary
  console.log('\n=== Summary ===');
  console.log(`Total processed: ${results.length}`);
  console.log(`Found data for: ${successCount}`);
  console.log(`Results saved to: ${outputPath}`);

  // Print results that can be merged into the data file
  const toMerge = results.filter(
    (r) => r.found && r.estudios_nivel && r.estudios_nivel !== 'No_consta'
  );

  if (toMerge.length > 0) {
    console.log('\n=== Data to Merge ===');
    console.log(JSON.stringify(toMerge, null, 2));
  }
}

main().catch((error) => {
  console.error('Worker error:', error);
  process.exit(1);
});
