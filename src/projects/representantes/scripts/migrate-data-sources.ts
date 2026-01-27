#!/usr/bin/env tsx
/**
 * Data migration script: Add multi-source tracking and education normalization
 *
 * This script:
 * 1. Loads existing parlamentario JSON files
 * 2. Populates new fields (data_sources, education_levels, education_inference)
 * 3. Keeps all existing fields for backward compatibility
 * 4. Writes to new files (.migrated.json) for safety
 * 5. Validates no data loss occurred
 *
 * Usage:
 *   pnpm tsx src/projects/representantes/scripts/migrate-data-sources.ts [--dry-run] [--legislature XV|I]
 */

import fs from 'fs';
import path from 'path';
import type { ParlamentarioRaw, DataSourceEntry, EducationInference } from '../types/parlamentario';
import { normalizeEducation } from '../lib/education-mapping';
import { inferEducationFromProfession } from '../lib/education-inference';
import { validateDataQuality, printDataQualityReport } from '../lib/data-quality';

const DATA_DIR = path.join(process.cwd(), 'src/projects/representantes/data');
const METADATA_PATH = path.join(DATA_DIR, 'metadata.json');

interface MigrationOptions {
  dryRun: boolean;
  legislature: 'XV' | 'I' | 'all';
}

/**
 * Old parlamentario structure before migration
 */
interface ParlamentarioOld {
  camara: string;
  nombre_completo: string;
  partido: string;
  grupo_parlamentario: string;
  circunscripcion: string;
  estudios_raw?: string | null;
  estudios_nivel?: string;
  profesion_raw?: string | null;
  profesion_categoria?: string;
  source?: string;
  fecha_alta: string;
  url_ficha: string;
  estado?: string;
  fecha_baja?: string;
  sustituido_por?: string;
  last_researched?: string;
  [key: string]: unknown; // Allow other fields
}

/**
 * Migrates a single parlamentario to the new data structure
 */
function migrateParlamentario(p: ParlamentarioOld, metadataDate: string): ParlamentarioRaw {
  // 1. Read old fields before deletion
  const estudios_raw = p.estudios_raw;
  const estudios_nivel = p.estudios_nivel;
  const profesion_raw = p.profesion_raw;
  const profesion_categoria = p.profesion_categoria;
  const source = p.source;

  // 2. Populate data_sources array from old fields
  const dataSources: DataSourceEntry[] = [];

  // Add education source
  if (estudios_raw && estudios_raw.trim() !== '') {
    const sourceType = source === 'researched' ? 'perplexity' : p.camara === 'Congreso' ? 'congreso' : 'senado';
    dataSources.push({
      source: sourceType,
      field: 'estudios',
      raw_text: estudios_raw,
      extracted_at: p.last_researched || metadataDate,
      extracted_value: estudios_nivel,
    });
  }

  // Add profession source
  if (profesion_raw && profesion_raw.trim() !== '') {
    const sourceType = source === 'researched' ? 'perplexity' : p.camara === 'Congreso' ? 'congreso' : 'senado';
    dataSources.push({
      source: sourceType,
      field: 'profesion',
      raw_text: profesion_raw,
      extracted_at: p.last_researched || metadataDate,
      extracted_value: profesion_categoria,
    });
  }

  // 3. Generate education_levels using normalizeEducation
  const education_levels = estudios_raw
    ? normalizeEducation(estudios_raw)
    : normalizeEducation(null);

  // 4. Check for inference opportunity
  let education_inference: EducationInference | undefined = undefined;
  if (estudios_nivel === 'No_consta' && profesion_raw && profesion_categoria) {
    // profesion_categoria is a string from old data, cast to ProfesionCategoria type
    const inference = inferEducationFromProfession(profesion_raw, profesion_categoria as 'Manual' | 'Oficina' | 'Funcionario' | 'Profesional_liberal' | 'Empresario' | 'Politica' | 'No_consta');
    if (inference) {
      education_inference = inference;
    }
  }

  // 5. Build new structure - ONLY present moment fields
  const migrated: ParlamentarioRaw = {
    camara: p.camara as 'Congreso' | 'Senado',
    nombre_completo: p.nombre_completo,
    partido: p.partido,
    grupo_parlamentario: p.grupo_parlamentario,
    circunscripcion: p.circunscripcion,
    data_sources: dataSources,
    education_levels,
    fecha_alta: p.fecha_alta,
    url_ficha: p.url_ficha,
  };

  // Add optional fields if present
  if (education_inference) {
    migrated.education_inference = education_inference;
  }
  if (p.estado) {
    migrated.estado = p.estado as 'activo' | 'baja';
  }
  if (p.fecha_baja) {
    migrated.fecha_baja = p.fecha_baja;
  }
  if (p.sustituido_por) {
    migrated.sustituido_por = p.sustituido_por;
  }
  if (p.last_researched) {
    migrated.last_researched = p.last_researched;
  }

  return migrated;
}

/**
 * Migrates a legislature's data file
 */
function migrateLegislature(legislature: 'XV' | 'I', options: MigrationOptions): void {
  const inputFile = path.join(DATA_DIR, `parlamentarios_espana_${legislature.toLowerCase()}.json`);
  const outputFile = path.join(DATA_DIR, `parlamentarios_espana_${legislature.toLowerCase()}.migrated.json`);

  console.log(`\n📂 Migrating legislature ${legislature}...`);
  console.log(`   Input: ${inputFile}`);
  console.log(`   Output: ${outputFile}`);

  // Load existing data (in OLD format before migration)
  const rawData = fs.readFileSync(inputFile, 'utf-8');
  const parlamentarios: ParlamentarioOld[] = JSON.parse(rawData);

  console.log(`   Loaded: ${parlamentarios.length} parlamentarios`);

  // Load metadata for timestamp
  const metadataRaw = fs.readFileSync(METADATA_PATH, 'utf-8');
  const metadata = JSON.parse(metadataRaw);
  const metadataDate = metadata.lastUpdated || new Date().toISOString();

  // Migrate each parlamentario
  const migrated = parlamentarios.map((p) => migrateParlamentario(p, metadataDate));

  console.log(`   Migrated: ${migrated.length} parlamentarios`);

  // Validate no data loss
  if (migrated.length !== parlamentarios.length) {
    throw new Error(`Data loss detected! Original: ${parlamentarios.length}, Migrated: ${migrated.length}`);
  }

  // Validate all names preserved
  const originalNames = new Set(parlamentarios.map((p) => p.nombre_completo));
  const migratedNames = new Set(migrated.map((p) => p.nombre_completo));
  if (originalNames.size !== migratedNames.size) {
    throw new Error(
      `Name mismatch! Original: ${originalNames.size} unique names, Migrated: ${migratedNames.size}`
    );
  }

  // Count new fields added
  const withDataSources = migrated.filter((p) => p.data_sources && p.data_sources.length > 0).length;
  const withEducationLevels = migrated.filter((p) => p.education_levels).length;
  const withInferences = migrated.filter((p) => p.education_inference).length;

  console.log(`\n   ✅ Validation passed:`);
  console.log(`      - All ${parlamentarios.length} parlamentarios preserved`);
  console.log(`      - ${withDataSources} with data_sources`);
  console.log(`      - ${withEducationLevels} with education_levels`);
  console.log(`      - ${withInferences} with education_inference`);

  // Run data quality check on migrated data
  console.log(`\n   🔍 Running data quality checks...`);
  const qualityReport = validateDataQuality(migrated);
  printDataQualityReport(qualityReport);

  // Write to output file (unless dry run)
  if (options.dryRun) {
    console.log(`\n   ⚠️  DRY RUN - Not writing to disk`);
  } else {
    fs.writeFileSync(outputFile, JSON.stringify(migrated, null, 2), 'utf-8');
    console.log(`\n   ✅ Written to: ${outputFile}`);
    console.log(`      File size: ${(fs.statSync(outputFile).size / 1024).toFixed(1)} KB`);
  }
}

/**
 * Main migration function
 */
function main() {
  const args = process.argv.slice(2);
  const options: MigrationOptions = {
    dryRun: args.includes('--dry-run'),
    legislature: 'all',
  };

  // Check for legislature flag
  const legIndex = args.indexOf('--legislature');
  if (legIndex >= 0 && args[legIndex + 1]) {
    const leg = args[legIndex + 1].toUpperCase();
    if (leg === 'XV' || leg === 'I') {
      options.legislature = leg;
    }
  }

  console.log('\n🚀 Data Migration: Multi-Source Tracking + Education Normalization');
  console.log('='.repeat(70));
  console.log(`   Mode: ${options.dryRun ? 'DRY RUN' : 'LIVE'}`);
  console.log(`   Legislature: ${options.legislature}`);

  try {
    if (options.legislature === 'all' || options.legislature === 'XV') {
      migrateLegislature('XV', options);
    }

    if (options.legislature === 'all' || options.legislature === 'I') {
      migrateLegislature('I', options);
    }

    console.log('\n' + '='.repeat(70));
    console.log('✅ Migration completed successfully!');

    if (!options.dryRun) {
      console.log('\n📝 Next steps:');
      console.log('   1. Review .migrated.json files');
      console.log('   2. Run tests: pnpm test:run');
      console.log('   3. If all good, replace original files:');
      console.log('      mv parlamentarios_espana_xv.migrated.json parlamentarios_espana_xv.json');
      console.log('      mv parlamentarios_espana_i.migrated.json parlamentarios_espana_i.json');
    }
  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

export { migrateParlamentario, migrateLegislature };
