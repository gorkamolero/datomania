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
      (p) => p.education_levels.normalized === 'No_consta'
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
        console.log(`  Current education_levels.normalized: ${parlamentarioNeedingResearch.education_levels.normalized}`);

        expect(parlamentarioNeedingResearch.education_levels.normalized).toBe('No_consta');
        expect(needsEducationResearch(parlamentarioNeedingResearch)).toBe(true);
      }
    });
  });

  describe('Perplexity API research (requires PERPLEXITY_API_KEY)', () => {
    it('researches a known politician with education data (Pedro Sánchez)', async () => {
      if (!PERPLEXITY_API_KEY) {
        console.log('\n⚠️  Skipping: PERPLEXITY_API_KEY not set');
        return;
      }

      // Pedro Sánchez is well-known - Perplexity should find his PhD
      console.log('\n🔬 Researching: Pedro Sánchez Pérez-Castejón');
      console.log('   Expected: PhD in Economics (well documented)');
      console.log('   Calling Perplexity API...');

      const result = await researchParlamentario({
        nombre_completo: 'Sánchez Pérez-Castejón, Pedro',
        camara: 'Congreso',
        circunscripcion: 'Madrid',
        research_type: 'estudios',
        perplexityApiKey: PERPLEXITY_API_KEY,
      });

      console.log('\n📋 Perplexity API Response:');
      console.log(`   Success: ${result.success}`);
      console.log(`   Found data: ${result.found}`);
      console.log(`   Citations: ${result.result.citations.length}`);
      console.log(`\n   Raw response (truncated):\n   "${result.result.raw.slice(0, 500)}..."`);

      expect(result.success).toBe(true);
      expect(result.found).toBe(true);
      expect(result.result.raw).toBeDefined();
      expect(result.result.raw.length).toBeGreaterThan(0);
      console.log(`   ✅ Found education data in raw response`);
    }, 30000);

    it('returns no data for parlamentario with no public education info', async () => {
      if (!PERPLEXITY_API_KEY) {
        console.log('\n⚠️  Skipping: PERPLEXITY_API_KEY not set');
        return;
      }

      // Julia Parra has no education info in public records
      console.log('\n🔬 Researching: Parra Aparicio, Julia');
      console.log('   Expected: No education info available online');
      console.log('   Calling Perplexity API...');

      const result = await researchParlamentario({
        nombre_completo: 'Parra Aparicio, Julia',
        camara: 'Congreso',
        circunscripcion: 'Alicante/Alacant',
        research_type: 'estudios',
        perplexityApiKey: PERPLEXITY_API_KEY,
      });

      console.log('\n📋 Perplexity API Response:');
      console.log(`   Success: ${result.success}`);
      console.log(`   Found data: ${result.found}`);
      console.log(`   Citations: ${result.result.citations.length}`);
      console.log(`\n   Raw response (truncated):\n   "${result.result.raw.slice(0, 400)}..."`);

      expect(result.success).toBe(true);
      expect(result.found).toBe(false);
      console.log('   ✅ Correctly identified: no education data available');
    }, 30000);
  });

  describe('Data protection - never overwrite existing data', () => {
    it('applyResearchResult does NOT overwrite existing education data', () => {
      // Find a parlamentario WITH education data
      const parlamentarioWithData = allParlamentarios.find(
        (p) => p.education_levels.normalized !== 'No_consta'
      );

      expect(parlamentarioWithData).toBeDefined();

      if (parlamentarioWithData) {
        const originalLevel = parlamentarioWithData.education_levels.normalized;
        const originalSourcesCount = parlamentarioWithData.data_sources.length;

        console.log('\n🛡️  Testing data protection:');
        console.log(`   Original: ${parlamentarioWithData.nombre_completo}`);
        console.log(`   education_levels.normalized: ${originalLevel}`);

        // Attempt to overwrite with research result
        const result = applyResearchResult(parlamentarioWithData, {
          field: 'estudios',
          raw_text: 'FAKE: Should not appear',
          citations: [],
        });

        console.log(`   After applyResearchResult: ${result.education_levels.normalized}`);

        // CRITICAL: Original data must be preserved
        expect(result.education_levels.normalized).toBe(originalLevel);
        expect(result.data_sources.length).toBe(originalSourcesCount);
        console.log('   ✅ Existing data was NOT overwritten');
      }
    });

    it('applyResearchResult does NOT overwrite existing profession data', () => {
      // Find a parlamentario WITH profession data
      const parlamentarioWithData = allParlamentarios.find(
        (p) => p.data_sources.some(s => s.field === 'profesion' && s.raw_text && s.raw_text.trim() !== '')
      );

      expect(parlamentarioWithData).toBeDefined();

      if (parlamentarioWithData) {
        const originalSourcesCount = parlamentarioWithData.data_sources.length;
        const originalProfessionSource = parlamentarioWithData.data_sources.find(s => s.field === 'profesion');

        console.log('\n🛡️  Testing profession data protection:');
        console.log(`   Original: ${parlamentarioWithData.nombre_completo}`);
        console.log(`   Profession: ${originalProfessionSource?.raw_text || 'N/A'}`);

        // Attempt to overwrite with research result
        const result = applyResearchResult(parlamentarioWithData, {
          field: 'profesion',
          raw_text: 'FAKE: Should not appear',
          citations: [],
        });

        console.log(`   After applyResearchResult: ${result.data_sources.length} sources`);

        // CRITICAL: Original data must be preserved
        expect(result.data_sources.length).toBe(originalSourcesCount);
        const newProfessionSource = result.data_sources.find(s => s.field === 'profesion');
        expect(newProfessionSource?.raw_text).toBe(originalProfessionSource?.raw_text);
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
      console.log(`   education_levels.normalized: ${parlamentarioNeedingResearch.education_levels.normalized}`);

      const result = applyResearchResult(parlamentarioNeedingResearch, {
        field: 'estudios',
        raw_text: 'Licenciado en Derecho por la Universidad de Valencia',
        citations: ['https://example.com'],
      });

      console.log(`   After applyResearchResult: ${result.education_levels.normalized}`);

      // Should update because original was No_consta
      expect(result.education_levels.normalized).toBe('Licenciatura');
      const perplexitySource = result.data_sources.find(s => s.source === 'perplexity' && s.field === 'estudios');
      expect(perplexitySource).toBeDefined();
      expect(perplexitySource?.raw_text).toBe('Licenciado en Derecho por la Universidad de Valencia');
      expect(result.last_researched).toBeDefined();
      console.log('   ✅ Missing data was correctly updated');
    });
  });
});
