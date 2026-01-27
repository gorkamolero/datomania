/**
 * Data quality validation for parlamentario data
 *
 * Validates for:
 * - Duplicate entries
 * - Conflicts between data sources
 * - Data consistency (e.g., profession requires education)
 * - Missing critical metadata
 */

import type { ParlamentarioRaw, DataQualityReport, DataQualityIssue } from '../types/parlamentario';
import { inferEducationFromProfession } from './education-inference';

/**
 * Duplicate check result
 */
export interface DuplicateCheck {
  type: 'exact_match' | 'similar_name' | 'same_person_both_chambers';
  entries: ParlamentarioRaw[];
  confidence: number;
  notes: string;
}

/**
 * Finds duplicate entries in the dataset
 *
 * @param parlamentarios - Array of parlamentarios to check
 * @returns Array of duplicate checks
 */
export function findDuplicates(parlamentarios: ParlamentarioRaw[]): DuplicateCheck[] {
  const duplicates: DuplicateCheck[] = [];
  const nameMap = new Map<string, ParlamentarioRaw[]>();

  // Group by exact name match
  for (const p of parlamentarios) {
    const normalizedName = p.nombre_completo.trim().toLowerCase();
    if (!nameMap.has(normalizedName)) {
      nameMap.set(normalizedName, []);
    }
    nameMap.get(normalizedName)!.push(p);
  }

  // Find groups with more than one entry
  for (const [name, entries] of nameMap.entries()) {
    if (entries.length > 1) {
      duplicates.push({
        type: 'exact_match',
        entries,
        confidence: 1.0,
        notes: `${entries.length} entries with name "${name}"`,
      });
    }
  }

  return duplicates;
}

/**
 * Finds parlamentarios where data sources disagree
 *
 * @param parlamentarios - Array of parlamentarios to check
 * @returns Array of data quality issues
 */
export function findConflictingSources(parlamentarios: ParlamentarioRaw[]): DataQualityIssue[] {
  const conflicts: DataQualityIssue[] = [];

  for (const p of parlamentarios) {
    if (!p.data_sources || p.data_sources.length < 2) {
      continue;
    }

    // Group sources by field
    const sourcesByField = new Map<string, typeof p.data_sources>();
    for (const source of p.data_sources) {
      if (!sourcesByField.has(source.field)) {
        sourcesByField.set(source.field, []);
      }
      sourcesByField.get(source.field)!.push(source);
    }

    // Check for conflicts in each field
    for (const [field, sources] of sourcesByField.entries()) {
      if (sources.length < 2) continue;

      // Check if extracted values differ
      const values = sources.map((s) => s.extracted_value).filter((v) => v);
      const uniqueValues = new Set(values);

      // Conflict if: multiple different values, OR one has data and another says No_consta
      if (uniqueValues.size > 1) {
        const sourceNames = sources.map((s) => s.source).join(', ');
        const valuesList = Array.from(uniqueValues).join(' vs ');
        conflicts.push({
          nombre_completo: p.nombre_completo,
          issue: `Sources disagree on ${field}: ${sourceNames} report different values (${valuesList})`,
          severity: 'medium',
        });
      }
    }
  }

  return conflicts;
}

/**
 * Finds inconsistent data (e.g., profession requires education but missing)
 *
 * @param parlamentarios - Array of parlamentarios to check
 * @returns Array of data quality issues
 */
export function findInconsistentData(parlamentarios: ParlamentarioRaw[]): DataQualityIssue[] {
  const inconsistencies: DataQualityIssue[] = [];

  for (const p of parlamentarios) {
    // Check if profession suggests education but education is missing
    const professionSource = p.data_sources.find(s => s.field === 'profesion');
    if (p.education_levels.normalized === 'No_consta' && professionSource) {
      const inference = inferEducationFromProfession(professionSource.raw_text, 'Profesional_liberal');

      // High confidence inference (>= 0.9) suggests inconsistency
      if (inference && inference.confidence >= 0.9) {
        inconsistencies.push({
          nombre_completo: p.nombre_completo,
          issue: `Profession "${professionSource.raw_text}" typically requires education (${inference.inferred_education}) but education is No_consta`,
          severity: 'medium',
        });
      }
    }
  }

  return inconsistencies;
}

/**
 * Checks for bajas missing critical metadata (fecha_baja, sustituido_por)
 *
 * @param parlamentarios - Array of parlamentarios to check
 * @returns Array of data quality issues
 */
export function checkBajasMetadata(parlamentarios: ParlamentarioRaw[]): DataQualityIssue[] {
  const issues: DataQualityIssue[] = [];

  for (const p of parlamentarios) {
    if (p.estado === 'baja') {
      const missingFields: string[] = [];

      if (!p.fecha_baja) {
        missingFields.push('fecha_baja');
      }
      if (!p.sustituido_por) {
        missingFields.push('sustituido_por');
      }

      if (missingFields.length > 0) {
        issues.push({
          nombre_completo: p.nombre_completo,
          issue: `Senator marked as "baja" but missing: ${missingFields.join(', ')}`,
          severity: 'low',
        });
      }
    }
  }

  return issues;
}

/**
 * Validates data quality and generates comprehensive report
 *
 * @param parlamentarios - Array of parlamentarios to validate
 * @returns DataQualityReport with all quality metrics
 */
export function validateDataQuality(parlamentarios: ParlamentarioRaw[]): DataQualityReport {
  // Count unique names
  const uniqueNames = new Set(parlamentarios.map((p) => p.nombre_completo.trim().toLowerCase()));

  // Count active vs baja
  const activeCount = parlamentarios.filter((p) => !p.estado || p.estado === 'activo').length;
  const bajaCount = parlamentarios.filter((p) => p.estado === 'baja').length;

  // Count bajas missing metadata
  const bajasWithMissingMetadata = parlamentarios.filter(
    (p) => p.estado === 'baja' && (!p.fecha_baja || !p.sustituido_por)
  ).length;

  // Calculate coverage
  const educationComplete = parlamentarios.filter((p) => p.education_levels.normalized !== 'No_consta').length;
  const educationMissing = parlamentarios.length - educationComplete;

  const professionComplete = parlamentarios.filter((p) =>
    p.data_sources.some(s => s.field === 'profesion' && s.raw_text && s.raw_text.trim() !== '')
  ).length;
  const professionMissing = parlamentarios.length - professionComplete;

  const bothComplete = parlamentarios.filter(
    (p) => p.education_levels.normalized !== 'No_consta' &&
           p.data_sources.some(s => s.field === 'profesion' && s.raw_text && s.raw_text.trim() !== '')
  ).length;

  // Find issues
  const conflicts = findConflictingSources(parlamentarios);
  const suspicious = findInconsistentData(parlamentarios);
  const bajasIssues = checkBajasMetadata(parlamentarios);

  // Combine all issues
  const allConflicts = [...conflicts, ...bajasIssues];
  const allSuspicious = [...suspicious];

  return {
    total: parlamentarios.length,
    unique_names: uniqueNames.size,
    active: activeCount,
    baja: bajaCount,
    baja_missing_metadata: bajasWithMissingMetadata,
    coverage: {
      education_complete: educationComplete,
      education_missing: educationMissing,
      profession_complete: professionComplete,
      profession_missing: professionMissing,
      both_complete: bothComplete,
    },
    conflicts: allConflicts,
    suspicious: allSuspicious,
  };
}

/**
 * Prints a formatted data quality report to console
 * Useful for scripts and debugging
 *
 * @param report - Data quality report to print
 */
export function printDataQualityReport(report: DataQualityReport): void {
  console.log('\n📊 Data Quality Report');
  console.log('='.repeat(60));

  console.log('\n📈 Overview:');
  console.log(`  Total entries: ${report.total}`);
  console.log(`  Unique names: ${report.unique_names}`);
  console.log(`  Active: ${report.active}`);
  console.log(`  Baja: ${report.baja}`);
  console.log(`  Bajas missing metadata: ${report.baja_missing_metadata}`);

  console.log('\n📚 Coverage:');
  const educationPercent = ((report.coverage.education_complete / report.total) * 100).toFixed(1);
  const professionPercent = ((report.coverage.profession_complete / report.total) * 100).toFixed(1);
  const bothPercent = ((report.coverage.both_complete / report.total) * 100).toFixed(1);

  console.log(`  Education: ${report.coverage.education_complete}/${report.total} (${educationPercent}%)`);
  console.log(`  Profession: ${report.coverage.profession_complete}/${report.total} (${professionPercent}%)`);
  console.log(`  Both complete: ${report.coverage.both_complete}/${report.total} (${bothPercent}%)`);

  if (report.conflicts.length > 0) {
    console.log(`\n⚠️  Conflicts: ${report.conflicts.length}`);
    report.conflicts.slice(0, 5).forEach((conflict) => {
      console.log(`  - ${conflict.nombre_completo}: ${conflict.issue}`);
    });
    if (report.conflicts.length > 5) {
      console.log(`  ... and ${report.conflicts.length - 5} more`);
    }
  } else {
    console.log('\n✅ No conflicts found');
  }

  if (report.suspicious.length > 0) {
    console.log(`\n🔍 Suspicious data: ${report.suspicious.length}`);
    report.suspicious.slice(0, 5).forEach((issue) => {
      console.log(`  - ${issue.nombre_completo}: ${issue.issue}`);
    });
    if (report.suspicious.length > 5) {
      console.log(`  ... and ${report.suspicious.length - 5} more`);
    }
  } else {
    console.log('\n✅ No suspicious data found');
  }

  console.log('\n' + '='.repeat(60) + '\n');
}
