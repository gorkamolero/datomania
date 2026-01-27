/**
 * Tests for data quality validation
 *
 * Validates parlamentario data for:
 * - Duplicates
 * - Conflicts between data sources
 * - Consistency (e.g., profession requires education)
 * - Missing critical data
 *
 * Run with: pnpm test:run data-quality
 */

import { describe, it, expect } from 'vitest';
import {
  validateDataQuality,
  findDuplicates,
  findConflictingSources,
  findInconsistentData,
  checkBajasMetadata,
} from './data-quality';
import type { ParlamentarioRaw } from '../types/parlamentario';

describe('Data Quality Validation', () => {
  describe('Duplicate detection', () => {
    it('detects exact name duplicates', () => {
      const data: ParlamentarioRaw[] = [
        {
          camara: 'Congreso',
          nombre_completo: 'García López, Juan',
          partido: 'PP',
          grupo_parlamentario: 'GP',
          circunscripcion: 'Madrid',
          data_sources: [],
          education_levels: {
            original: 'No consta',
            normalized: 'No_consta',
            simplified: 'Obligatoria',
          },
          fecha_alta: '2023-01-01',
          url_ficha: 'https://example.com',
        },
        {
          camara: 'Senado',
          nombre_completo: 'García López, Juan',
          partido: 'PP',
          grupo_parlamentario: 'GP',
          circunscripcion: 'Madrid',
          data_sources: [],
          education_levels: {
            original: 'No consta',
            normalized: 'No_consta',
            simplified: 'Obligatoria',
          },
          fecha_alta: '2023-01-01',
          url_ficha: 'https://example.com',
        },
      ];

      const duplicates = findDuplicates(data);
      expect(duplicates.length).toBe(1);
      expect(duplicates[0].type).toBe('exact_match');
      expect(duplicates[0].entries.length).toBe(2);
    });

    it('returns empty array for no duplicates', () => {
      const data: ParlamentarioRaw[] = [
        {
          camara: 'Congreso',
          nombre_completo: 'García López, Juan',
          partido: 'PP',
          grupo_parlamentario: 'GP',
          circunscripcion: 'Madrid',
          data_sources: [],
          education_levels: {
            original: 'No consta',
            normalized: 'No_consta',
            simplified: 'Obligatoria',
          },
          fecha_alta: '2023-01-01',
          url_ficha: 'https://example.com',
        },
        {
          camara: 'Senado',
          nombre_completo: 'Pérez Martínez, María',
          partido: 'PSOE',
          grupo_parlamentario: 'GP',
          circunscripcion: 'Barcelona',
          data_sources: [],
          education_levels: {
            original: 'No consta',
            normalized: 'No_consta',
            simplified: 'Obligatoria',
          },
          fecha_alta: '2023-01-01',
          url_ficha: 'https://example.com',
        },
      ];

      const duplicates = findDuplicates(data);
      expect(duplicates.length).toBe(0);
    });

    it('ignores different people with similar names', () => {
      const data: ParlamentarioRaw[] = [
        {
          camara: 'Congreso',
          nombre_completo: 'García López, Juan',
          partido: 'PP',
          grupo_parlamentario: 'GP',
          circunscripcion: 'Madrid',
          data_sources: [],
          education_levels: {
            original: 'No consta',
            normalized: 'No_consta',
            simplified: 'Obligatoria',
          },
          fecha_alta: '2023-01-01',
          url_ficha: 'https://example.com',
        },
        {
          camara: 'Senado',
          nombre_completo: 'García López, José',
          partido: 'PP',
          grupo_parlamentario: 'GP',
          circunscripcion: 'Madrid',
          data_sources: [],
          education_levels: {
            original: 'No consta',
            normalized: 'No_consta',
            simplified: 'Obligatoria',
          },
          fecha_alta: '2023-01-01',
          url_ficha: 'https://example.com',
        },
      ];

      const duplicates = findDuplicates(data);
      expect(duplicates.length).toBe(0);
    });
  });

  describe('Source conflict detection', () => {
    it('detects conflicting education data from different sources', () => {
      const data: ParlamentarioRaw[] = [
        {
          camara: 'Congreso',
          nombre_completo: 'García López, Juan',
          partido: 'PP',
          grupo_parlamentario: 'GP',
          circunscripcion: 'Madrid',
          data_sources: [
            {
              source: 'congreso',
              field: 'estudios',
              raw_text: 'Licenciado en Derecho',
              extracted_at: '2025-01-20T00:00:00Z',
              extracted_value: 'Universitario',
            },
            {
              source: 'perplexity',
              field: 'estudios',
              raw_text: 'No degree found',
              extracted_at: '2025-01-21T00:00:00Z',
              extracted_value: 'No_consta',
            },
          ],
          education_levels: {
            original: 'Licenciado en Derecho',
            normalized: 'Licenciatura',
            simplified: 'Universitaria',
          },
          fecha_alta: '2023-01-01',
          url_ficha: 'https://example.com',
        },
      ];

      const conflicts = findConflictingSources(data);
      expect(conflicts.length).toBeGreaterThan(0);
      expect(conflicts[0].issue).toContain('Sources disagree');
    });

    it('returns empty array when sources agree', () => {
      const data: ParlamentarioRaw[] = [
        {
          camara: 'Congreso',
          nombre_completo: 'García López, Juan',
          partido: 'PP',
          grupo_parlamentario: 'GP',
          circunscripcion: 'Madrid',
          data_sources: [
            {
              source: 'congreso',
              field: 'estudios',
              raw_text: 'Licenciado en Derecho',
              extracted_at: '2025-01-20T00:00:00Z',
              extracted_value: 'Universitario',
            },
            {
              source: 'perplexity',
              field: 'estudios',
              raw_text: 'Law degree from Universidad Complutense',
              extracted_at: '2025-01-21T00:00:00Z',
              extracted_value: 'Universitario',
            },
          ],
          education_levels: {
            original: 'Licenciado en Derecho',
            normalized: 'Licenciatura',
            simplified: 'Universitaria',
          },
          fecha_alta: '2023-01-01',
          url_ficha: 'https://example.com',
        },
      ];

      const conflicts = findConflictingSources(data);
      expect(conflicts.length).toBe(0);
    });
  });

  describe('Data consistency checks', () => {
    it('flags Abogado without law degree', () => {
      const data: ParlamentarioRaw[] = [
        {
          camara: 'Congreso',
          nombre_completo: 'García López, Juan',
          partido: 'PP',
          grupo_parlamentario: 'GP',
          circunscripcion: 'Madrid',
          data_sources: [
            {
              source: 'congreso',
              field: 'profesion',
              raw_text: 'Abogado',
              extracted_at: '2025-01-20T00:00:00Z',
              extracted_value: 'Profesional_liberal',
            },
          ],
          education_levels: {
            original: 'No consta',
            normalized: 'No_consta',
            simplified: 'Obligatoria',
          },
          fecha_alta: '2023-01-01',
          url_ficha: 'https://example.com',
        },
      ];

      const issues = findInconsistentData(data);
      expect(issues.length).toBeGreaterThan(0);
      expect(issues[0].issue).toContain('Abogado');
      expect(issues[0].issue).toContain('requires education');
    });

    it('flags Médico without medical degree', () => {
      const data: ParlamentarioRaw[] = [
        {
          camara: 'Congreso',
          nombre_completo: 'Pérez Martínez, María',
          partido: 'PSOE',
          grupo_parlamentario: 'GP',
          circunscripcion: 'Barcelona',
          data_sources: [
            {
              source: 'congreso',
              field: 'profesion',
              raw_text: 'Médico',
              extracted_at: '2025-01-20T00:00:00Z',
              extracted_value: 'Profesional_liberal',
            },
          ],
          education_levels: {
            original: 'No consta',
            normalized: 'No_consta',
            simplified: 'Obligatoria',
          },
          fecha_alta: '2023-01-01',
          url_ficha: 'https://example.com',
        },
      ];

      const issues = findInconsistentData(data);
      expect(issues.length).toBeGreaterThan(0);
      expect(issues[0].issue).toContain('Médico');
    });

    it('accepts consistent data', () => {
      const data: ParlamentarioRaw[] = [
        {
          camara: 'Congreso',
          nombre_completo: 'García López, Juan',
          partido: 'PP',
          grupo_parlamentario: 'GP',
          circunscripcion: 'Madrid',
          data_sources: [
            {
              source: 'congreso',
              field: 'estudios',
              raw_text: 'Licenciado en Derecho',
              extracted_at: '2025-01-20T00:00:00Z',
              extracted_value: 'Universitario',
            },
            {
              source: 'congreso',
              field: 'profesion',
              raw_text: 'Abogado',
              extracted_at: '2025-01-20T00:00:00Z',
              extracted_value: 'Profesional_liberal',
            },
          ],
          education_levels: {
            original: 'Licenciado en Derecho',
            normalized: 'Licenciatura',
            simplified: 'Universitaria',
          },
          fecha_alta: '2023-01-01',
          url_ficha: 'https://example.com',
        },
      ];

      const issues = findInconsistentData(data);
      expect(issues.length).toBe(0);
    });
  });

  describe('Baja metadata validation', () => {
    it('flags bajas missing fecha_baja', () => {
      const data: ParlamentarioRaw[] = [
        {
          camara: 'Senado',
          nombre_completo: 'García López, Juan',
          partido: 'PP',
          grupo_parlamentario: 'GP',
          circunscripcion: 'Madrid',
          data_sources: [],
          education_levels: {
            original: 'No consta',
            normalized: 'No_consta',
            simplified: 'Obligatoria',
          },
          fecha_alta: '2023-01-01',
          url_ficha: 'https://example.com',
          estado: 'baja',
          sustituido_por: 'Replacement Person',
        },
      ];

      const issues = checkBajasMetadata(data);
      expect(issues.length).toBe(1);
      expect(issues[0].issue).toContain('fecha_baja');
    });

    it('flags bajas missing sustituido_por', () => {
      const data: ParlamentarioRaw[] = [
        {
          camara: 'Senado',
          nombre_completo: 'García López, Juan',
          partido: 'PP',
          grupo_parlamentario: 'GP',
          circunscripcion: 'Madrid',
          data_sources: [],
          education_levels: {
            original: 'No consta',
            normalized: 'No_consta',
            simplified: 'Obligatoria',
          },
          fecha_alta: '2023-01-01',
          url_ficha: 'https://example.com',
          estado: 'baja',
          fecha_baja: '2024-06-01',
        },
      ];

      const issues = checkBajasMetadata(data);
      expect(issues.length).toBe(1);
      expect(issues[0].issue).toContain('sustituido_por');
    });

    it('accepts bajas with complete metadata', () => {
      const data: ParlamentarioRaw[] = [
        {
          camara: 'Senado',
          nombre_completo: 'García López, Juan',
          partido: 'PP',
          grupo_parlamentario: 'GP',
          circunscripcion: 'Madrid',
          data_sources: [],
          education_levels: {
            original: 'No consta',
            normalized: 'No_consta',
            simplified: 'Obligatoria',
          },
          fecha_alta: '2023-01-01',
          url_ficha: 'https://example.com',
          estado: 'baja',
          fecha_baja: '2024-06-01',
          sustituido_por: 'Replacement Person',
        },
      ];

      const issues = checkBajasMetadata(data);
      expect(issues.length).toBe(0);
    });
  });

  describe('Full validation report', () => {
    it('generates comprehensive quality report', () => {
      const data: ParlamentarioRaw[] = [
        {
          camara: 'Congreso',
          nombre_completo: 'García López, Juan',
          partido: 'PP',
          grupo_parlamentario: 'GP',
          circunscripcion: 'Madrid',
          data_sources: [
            {
              source: 'congreso',
              field: 'estudios',
              raw_text: 'Licenciado en Derecho',
              extracted_at: '2025-01-20T00:00:00Z',
              extracted_value: 'Universitario',
            },
          ],
          education_levels: {
            original: 'Licenciado en Derecho',
            normalized: 'Licenciatura',
            simplified: 'Universitaria',
          },
          fecha_alta: '2023-01-01',
          url_ficha: 'https://example.com',
        },
        {
          camara: 'Senado',
          nombre_completo: 'Pérez Martínez, María',
          partido: 'PSOE',
          grupo_parlamentario: 'GP',
          circunscripcion: 'Barcelona',
          data_sources: [],
          education_levels: {
            original: 'No consta',
            normalized: 'No_consta',
            simplified: 'Obligatoria',
          },
          fecha_alta: '2023-01-01',
          url_ficha: 'https://example.com',
          estado: 'baja',
        },
      ];

      const report = validateDataQuality(data);

      expect(report.total).toBe(2);
      expect(report.unique_names).toBe(2);
      expect(report.active).toBe(1);
      expect(report.baja).toBe(1);
      expect(report.coverage.education_complete).toBe(1);
      expect(report.coverage.education_missing).toBe(1);
    });

    it('calculates coverage percentages correctly', () => {
      const data: ParlamentarioRaw[] = [
        {
          camara: 'Congreso',
          nombre_completo: 'Person 1',
          partido: 'PP',
          grupo_parlamentario: 'GP',
          circunscripcion: 'Madrid',
          data_sources: [
            {
              source: 'congreso',
              field: 'estudios',
              raw_text: 'Licenciado',
              extracted_at: '2025-01-20T00:00:00Z',
            },
            {
              source: 'congreso',
              field: 'profesion',
              raw_text: 'Abogado',
              extracted_at: '2025-01-20T00:00:00Z',
            },
          ],
          education_levels: {
            original: 'Licenciado',
            normalized: 'Licenciatura',
            simplified: 'Universitaria',
          },
          fecha_alta: '2023-01-01',
          url_ficha: 'https://example.com',
        },
        {
          camara: 'Congreso',
          nombre_completo: 'Person 2',
          partido: 'PP',
          grupo_parlamentario: 'GP',
          circunscripcion: 'Madrid',
          data_sources: [
            {
              source: 'congreso',
              field: 'estudios',
              raw_text: 'Ingeniero',
              extracted_at: '2025-01-20T00:00:00Z',
            },
            {
              source: 'congreso',
              field: 'profesion',
              raw_text: 'Ingeniero Industrial',
              extracted_at: '2025-01-20T00:00:00Z',
            },
          ],
          education_levels: {
            original: 'Ingeniero',
            normalized: 'Licenciatura',
            simplified: 'Universitaria',
          },
          fecha_alta: '2023-01-01',
          url_ficha: 'https://example.com',
        },
        {
          camara: 'Congreso',
          nombre_completo: 'Person 3',
          partido: 'PP',
          grupo_parlamentario: 'GP',
          circunscripcion: 'Madrid',
          data_sources: [],
          education_levels: {
            original: 'No consta',
            normalized: 'No_consta',
            simplified: 'Obligatoria',
          },
          fecha_alta: '2023-01-01',
          url_ficha: 'https://example.com',
        },
        {
          camara: 'Congreso',
          nombre_completo: 'Person 4',
          partido: 'PP',
          grupo_parlamentario: 'GP',
          circunscripcion: 'Madrid',
          data_sources: [],
          education_levels: {
            original: 'No consta',
            normalized: 'No_consta',
            simplified: 'Obligatoria',
          },
          fecha_alta: '2023-01-01',
          url_ficha: 'https://example.com',
        },
      ];

      const report = validateDataQuality(data);

      expect(report.coverage.education_complete).toBe(2);
      expect(report.coverage.education_missing).toBe(2);
      expect(report.coverage.profession_complete).toBe(2);
      expect(report.coverage.profession_missing).toBe(2);
      expect(report.coverage.both_complete).toBe(2);
    });
  });
});
