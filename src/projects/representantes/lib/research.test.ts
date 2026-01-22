/**
 * Integration tests for the research cron job
 *
 * These tests use the EXACT same functions as the cron job:
 * - getParlamentarios: loads real data
 * - buildResearchQueue: finds parlamentarios needing research
 * - researchParlamentario: calls Perplexity API
 * - applyResearchResult: applies results without overwriting
 *
 * Run with: PERPLEXITY_API_KEY=xxx pnpm test:run
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { getParlamentarios } from './data';
import {
  buildResearchQueue,
  researchParlamentario,
  applyResearchResult,
  needsEducationResearch,
  type ResearchQueueItem,
} from './research';
import type { ParlamentarioRaw } from '../types/parlamentario';

const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY;

describe('Research Cron Job Integration Tests', () => {
  let allParlamentarios: ParlamentarioRaw[];
  let researchQueue: ResearchQueueItem[];
  let parlamentarioNeedingResearch: ParlamentarioRaw | undefined;

  beforeAll(() => {
    // Load real data using the exact same function as the cron
    allParlamentarios = getParlamentarios();
    researchQueue = buildResearchQueue(allParlamentarios);

    // Find a real parlamentario that needs education research
    parlamentarioNeedingResearch = allParlamentarios.find(
      (p) => p.estudios_nivel === 'No_consta'
    );
  });

  describe('Finding parlamentarios needing research', () => {
    it('loads real parlamentario data', () => {
      expect(allParlamentarios.length).toBeGreaterThan(0);
      console.log(`\n📊 Total parlamentarios loaded: ${allParlamentarios.length}`);
    });

    it('finds parlamentarios with No_consta that need Perplexity research', () => {
      expect(researchQueue.length).toBeGreaterThan(0);
      console.log(`\n🔍 Parlamentarios needing research: ${researchQueue.length}`);

      // Log first few for verification
      console.log('\nFirst 3 in queue:');
      researchQueue.slice(0, 3).forEach((item) => {
        console.log(`  - ${item.nombre_completo} (${item.camara}, ${item.circunscripcion})`);
        console.log(`    Missing: estudios=${item.missing.estudios}, profesion=${item.missing.profesion}`);
      });
    });

    it('identifies a specific parlamentario needing education research', () => {
      expect(parlamentarioNeedingResearch).toBeDefined();

      if (parlamentarioNeedingResearch) {
        console.log('\n🎯 Found parlamentario needing education research:');
        console.log(`  Name: ${parlamentarioNeedingResearch.nombre_completo}`);
        console.log(`  Camara: ${parlamentarioNeedingResearch.camara}`);
        console.log(`  Circunscripcion: ${parlamentarioNeedingResearch.circunscripcion}`);
        console.log(`  Current estudios_nivel: ${parlamentarioNeedingResearch.estudios_nivel}`);

        expect(parlamentarioNeedingResearch.estudios_nivel).toBe('No_consta');
        expect(needsEducationResearch(parlamentarioNeedingResearch)).toBe(true);
      }
    });
  });

  describe('Perplexity API research (requires PERPLEXITY_API_KEY)', () => {
    it('calls Perplexity API and gets education research results', async () => {
      if (!PERPLEXITY_API_KEY) {
        console.log('\n⚠️  Skipping: PERPLEXITY_API_KEY not set');
        return;
      }

      if (!parlamentarioNeedingResearch) {
        console.log('\n⚠️  Skipping: No parlamentario found needing research');
        return;
      }

      console.log(`\n🔬 Researching: ${parlamentarioNeedingResearch.nombre_completo}`);
      console.log('   Calling Perplexity API...');

      // Call the EXACT same function the cron uses
      const result = await researchParlamentario({
        nombre_completo: parlamentarioNeedingResearch.nombre_completo,
        camara: parlamentarioNeedingResearch.camara,
        circunscripcion: parlamentarioNeedingResearch.circunscripcion,
        research_type: 'estudios',
        perplexityApiKey: PERPLEXITY_API_KEY,
      });

      console.log('\n📋 Perplexity API Response:');
      console.log(`   Success: ${result.success}`);
      console.log(`   Found data: ${result.found}`);
      console.log(`   Classified level: ${result.result.estudios_nivel || 'N/A'}`);
      console.log(`   Citations: ${result.result.citations.length}`);
      console.log(`\n   Raw response (truncated):\n   "${result.result.raw.slice(0, 300)}..."`);

      expect(result.success).toBe(true);
      expect(result.nombre_completo).toBe(parlamentarioNeedingResearch.nombre_completo);
      expect(result.research_type).toBe('estudios');

      // Result should have classification or indicate no data
      if (result.found) {
        expect(result.result.estudios_nivel).toBeDefined();
      }
    }, 30000); // 30s timeout for API call
  });

  describe('Data protection - never overwrite existing data', () => {
    it('applyResearchResult does NOT overwrite existing education data', () => {
      // Find a parlamentario WITH education data
      const parlamentarioWithData = allParlamentarios.find(
        (p) => p.estudios_nivel !== 'No_consta'
      );

      expect(parlamentarioWithData).toBeDefined();

      if (parlamentarioWithData) {
        const originalLevel = parlamentarioWithData.estudios_nivel;
        const originalRaw = parlamentarioWithData.estudios_raw;

        console.log('\n🛡️  Testing data protection:');
        console.log(`   Original: ${parlamentarioWithData.nombre_completo}`);
        console.log(`   estudios_nivel: ${originalLevel}`);

        // Attempt to overwrite with research result
        const result = applyResearchResult(parlamentarioWithData, {
          estudios_raw: 'FAKE: Should not appear',
          estudios_nivel: 'Doctorado',
        });

        console.log(`   After applyResearchResult: ${result.estudios_nivel}`);

        // CRITICAL: Original data must be preserved
        expect(result.estudios_nivel).toBe(originalLevel);
        expect(result.estudios_raw).toBe(originalRaw);
        console.log('   ✅ Existing data was NOT overwritten');
      }
    });

    it('applyResearchResult does NOT overwrite existing profession data', () => {
      // Find a parlamentario WITH profession data
      const parlamentarioWithData = allParlamentarios.find(
        (p) => p.profesion_categoria !== 'No_consta'
      );

      expect(parlamentarioWithData).toBeDefined();

      if (parlamentarioWithData) {
        const originalCategory = parlamentarioWithData.profesion_categoria;
        const originalRaw = parlamentarioWithData.profesion_raw;

        console.log('\n🛡️  Testing profession data protection:');
        console.log(`   Original: ${parlamentarioWithData.nombre_completo}`);
        console.log(`   profesion_categoria: ${originalCategory}`);

        // Attempt to overwrite with research result
        const result = applyResearchResult(parlamentarioWithData, {
          profesion_raw: 'FAKE: Should not appear',
          profesion_categoria: 'Empresario',
        });

        console.log(`   After applyResearchResult: ${result.profesion_categoria}`);

        // CRITICAL: Original data must be preserved
        expect(result.profesion_categoria).toBe(originalCategory);
        expect(result.profesion_raw).toBe(originalRaw);
        console.log('   ✅ Existing profession data was NOT overwritten');
      }
    });

    it('applyResearchResult DOES update when data is No_consta', () => {
      if (!parlamentarioNeedingResearch) {
        console.log('\n⚠️  Skipping: No parlamentario found needing research');
        return;
      }

      console.log('\n📝 Testing update of missing data:');
      console.log(`   Original: ${parlamentarioNeedingResearch.nombre_completo}`);
      console.log(`   estudios_nivel: ${parlamentarioNeedingResearch.estudios_nivel}`);

      const result = applyResearchResult(parlamentarioNeedingResearch, {
        estudios_raw: 'Licenciado en Derecho por la Universidad de Valencia',
        estudios_nivel: 'Universitario',
      });

      console.log(`   After applyResearchResult: ${result.estudios_nivel}`);

      // Should update because original was No_consta
      expect(result.estudios_nivel).toBe('Universitario');
      expect(result.estudios_raw).toBe('Licenciado en Derecho por la Universidad de Valencia');
      expect(result.source).toBe('researched');
      console.log('   ✅ Missing data was correctly updated');
    });
  });
});
