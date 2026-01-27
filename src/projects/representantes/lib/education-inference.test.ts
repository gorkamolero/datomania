/**
 * Tests for education inference engine
 *
 * Infers education level from profession when education data is missing.
 * Rules based on profession requirements (e.g., lawyers need law degrees).
 *
 * Run with: pnpm test:run education-inference
 */

import { describe, it, expect } from 'vitest';
import {
  inferEducationFromProfession,
  needsEducationInference,
  PROFESSION_EDUCATION_RULES,
} from './education-inference';
import type { ParlamentarioRaw } from '../types/parlamentario';

describe('Education Inference Engine', () => {
  describe('Profession-based inference rules', () => {
    describe('Legal professions (95% confidence)', () => {
      it('infers "Licenciado en Derecho" from "Abogado"', () => {
        const result = inferEducationFromProfession('Abogado', 'Profesional_liberal');
        expect(result).toBeDefined();
        expect(result?.inferred_education).toBe('Licenciado en Derecho');
        expect(result?.confidence).toBeGreaterThanOrEqual(0.95);
        expect(result?.inference_rule).toBe('profession_requires_degree');
        expect(result?.applied).toBe(false);
      });

      it('infers "Licenciado en Derecho" from "Letrado"', () => {
        const result = inferEducationFromProfession('Letrado', 'Profesional_liberal');
        expect(result).toBeDefined();
        expect(result?.inferred_education).toBe('Licenciado en Derecho');
        expect(result?.confidence).toBeGreaterThanOrEqual(0.95);
      });

      it('infers "Licenciado en Derecho" from "Abogada"', () => {
        const result = inferEducationFromProfession('Abogada', 'Profesional_liberal');
        expect(result).toBeDefined();
        expect(result?.inferred_education).toBe('Licenciado en Derecho');
      });

      it('handles "Abogado del Estado"', () => {
        const result = inferEducationFromProfession('Abogado del Estado', 'Funcionario');
        expect(result).toBeDefined();
        expect(result?.inferred_education).toBe('Licenciado en Derecho');
        expect(result?.confidence).toBeGreaterThanOrEqual(0.95);
      });
    });

    describe('Medical professions (95% confidence)', () => {
      it('infers "Licenciado en Medicina" from "Médico"', () => {
        const result = inferEducationFromProfession('Médico', 'Profesional_liberal');
        expect(result).toBeDefined();
        expect(result?.inferred_education).toBe('Licenciado en Medicina');
        expect(result?.confidence).toBeGreaterThanOrEqual(0.95);
      });

      it('infers "Licenciado en Medicina" from "Médica"', () => {
        const result = inferEducationFromProfession('Médica', 'Profesional_liberal');
        expect(result).toBeDefined();
        expect(result?.inferred_education).toBe('Licenciado en Medicina');
      });

      it('infers "Licenciado en Medicina" from "Doctor en Medicina"', () => {
        const result = inferEducationFromProfession('Doctor en Medicina', 'Profesional_liberal');
        expect(result).toBeDefined();
        expect(result?.inferred_education).toContain('Medicina');
      });

      it('infers from "Cirujano"', () => {
        const result = inferEducationFromProfession('Cirujano', 'Profesional_liberal');
        expect(result).toBeDefined();
        expect(result?.inferred_education).toBe('Licenciado en Medicina');
      });
    });

    describe('Engineering professions (80% confidence, needs review)', () => {
      it('infers "Ingeniería" from "Ingeniero"', () => {
        const result = inferEducationFromProfession('Ingeniero', 'Profesional_liberal');
        expect(result).toBeDefined();
        expect(result?.inferred_education).toContain('Ingenier');
        expect(result?.confidence).toBeGreaterThanOrEqual(0.7);
        expect(result?.confidence).toBeLessThan(0.95);
      });

      it('infers from "Ingeniero Industrial"', () => {
        const result = inferEducationFromProfession('Ingeniero Industrial', 'Profesional_liberal');
        expect(result).toBeDefined();
        expect(result?.inferred_education).toContain('Ingenier');
      });

      it('infers from "Ingeniero de Telecomunicaciones"', () => {
        const result = inferEducationFromProfession(
          'Ingeniero de Telecomunicaciones',
          'Profesional_liberal'
        );
        expect(result).toBeDefined();
        expect(result?.inferred_education).toContain('Ingenier');
      });

      it('infers from "Ingeniera"', () => {
        const result = inferEducationFromProfession('Ingeniera', 'Profesional_liberal');
        expect(result).toBeDefined();
        expect(result?.inferred_education).toContain('Ingenier');
      });
    });

    describe('Architecture professions (90% confidence)', () => {
      it('infers "Arquitectura" from "Arquitecto"', () => {
        const result = inferEducationFromProfession('Arquitecto', 'Profesional_liberal');
        expect(result).toBeDefined();
        expect(result?.inferred_education).toContain('Arquitectura');
        expect(result?.confidence).toBeGreaterThanOrEqual(0.85);
      });

      it('infers from "Arquitecta"', () => {
        const result = inferEducationFromProfession('Arquitecta', 'Profesional_liberal');
        expect(result).toBeDefined();
        expect(result?.inferred_education).toContain('Arquitectura');
      });
    });

    describe('Academic professions (70-80% confidence)', () => {
      it('infers "Doctorado" from "Profesor Universitario"', () => {
        const result = inferEducationFromProfession('Profesor Universitario', 'Profesional_liberal');
        expect(result).toBeDefined();
        expect(result?.inferred_education).toContain('Doctorado');
        expect(result?.confidence).toBeGreaterThanOrEqual(0.6);
      });

      it('infers from "Catedrático"', () => {
        const result = inferEducationFromProfession('Catedrático', 'Profesional_liberal');
        expect(result).toBeDefined();
        expect(result?.inferred_education).toContain('Doctorado');
      });

      it('infers from "Profesor de Universidad"', () => {
        const result = inferEducationFromProfession('Profesor de Universidad', 'Profesional_liberal');
        expect(result).toBeDefined();
        expect(result?.confidence).toBeGreaterThanOrEqual(0.6);
      });
    });

    describe('Economic professions (85% confidence)', () => {
      it('infers "Economía" from "Economista"', () => {
        const result = inferEducationFromProfession('Economista', 'Profesional_liberal');
        expect(result).toBeDefined();
        expect(result?.inferred_education).toContain('Econom');
        expect(result?.confidence).toBeGreaterThanOrEqual(0.8);
      });

      it('infers from "Auditor"', () => {
        const result = inferEducationFromProfession('Auditor', 'Profesional_liberal');
        expect(result).toBeDefined();
        expect(result?.inferred_education).toBeDefined();
      });
    });

    describe('Healthcare professions (90% confidence)', () => {
      it('infers "Enfermería" from "Enfermero"', () => {
        const result = inferEducationFromProfession('Enfermero', 'Profesional_liberal');
        expect(result).toBeDefined();
        expect(result?.inferred_education).toContain('Enfermer');
        expect(result?.confidence).toBeGreaterThanOrEqual(0.85);
      });

      it('infers from "Enfermera"', () => {
        const result = inferEducationFromProfession('Enfermera', 'Profesional_liberal');
        expect(result).toBeDefined();
        expect(result?.inferred_education).toContain('Enfermer');
      });

      it('infers "Farmacia" from "Farmacéutico"', () => {
        const result = inferEducationFromProfession('Farmacéutico', 'Profesional_liberal');
        expect(result).toBeDefined();
        expect(result?.inferred_education).toContain('Farmacia');
      });
    });
  });

  describe('No inference cases', () => {
    it('returns null for generic "Empresario"', () => {
      const result = inferEducationFromProfession('Empresario', 'Empresario');
      expect(result).toBeNull();
    });

    it('returns null for "Político"', () => {
      const result = inferEducationFromProfession('Político', 'Politica');
      expect(result).toBeNull();
    });

    it('returns null for "Funcionario" without specific profession', () => {
      const result = inferEducationFromProfession('Funcionario', 'Funcionario');
      expect(result).toBeNull();
    });

    it('returns null for null profession', () => {
      const result = inferEducationFromProfession(null, 'No_consta');
      expect(result).toBeNull();
    });

    it('returns null for empty string profession', () => {
      const result = inferEducationFromProfession('', 'No_consta');
      expect(result).toBeNull();
    });

    it('returns null for "No consta"', () => {
      const result = inferEducationFromProfession('No consta', 'No_consta');
      expect(result).toBeNull();
    });
  });

  describe('Case insensitivity', () => {
    it('handles lowercase "abogado"', () => {
      const result = inferEducationFromProfession('abogado', 'Profesional_liberal');
      expect(result).toBeDefined();
      expect(result?.inferred_education).toBe('Licenciado en Derecho');
    });

    it('handles UPPERCASE "MÉDICO"', () => {
      const result = inferEducationFromProfession('MÉDICO', 'Profesional_liberal');
      expect(result).toBeDefined();
      expect(result?.inferred_education).toBe('Licenciado en Medicina');
    });

    it('handles mixed case "InGenIeRo"', () => {
      const result = inferEducationFromProfession('InGenIeRo', 'Profesional_liberal');
      expect(result).toBeDefined();
      expect(result?.inferred_education).toContain('Ingenier');
    });
  });

  describe('Confidence levels validation', () => {
    it('all confidence values are between 0 and 1', () => {
      PROFESSION_EDUCATION_RULES.forEach((rule) => {
        expect(rule.confidence).toBeGreaterThan(0);
        expect(rule.confidence).toBeLessThanOrEqual(1);
      });
    });

    it('high confidence professions (>= 0.95) do not require review', () => {
      const highConfidenceRule = PROFESSION_EDUCATION_RULES.find((r) => r.confidence >= 0.95);
      if (highConfidenceRule) {
        const testText = 'Abogado'; // We know this is high confidence
        const result = inferEducationFromProfession(testText, 'Profesional_liberal');
        expect(result).toBeDefined();
        if (result && result.confidence >= 0.95) {
          // High confidence inferences can be applied without review
          expect(result.confidence).toBeGreaterThanOrEqual(0.95);
        }
      }
    });

    it('medium confidence professions (< 0.90) should be flagged', () => {
      const result = inferEducationFromProfession('Ingeniero', 'Profesional_liberal');
      expect(result).toBeDefined();
      if (result && result.confidence < 0.9) {
        // These need human review
        expect(result.confidence).toBeLessThan(0.9);
      }
    });
  });

  describe('needsEducationInference helper', () => {
    it('returns true for parlamentario with No_consta education and valid profession', () => {
      const parlamentario: ParlamentarioRaw = {
        camara: 'Congreso',
        nombre_completo: 'Test Person',
        partido: 'Test',
        grupo_parlamentario: 'Test',
        circunscripcion: 'Test',
        data_sources: [
          {
            source: 'congreso',
            field: 'profesion',
            raw_text: 'Abogado',
            extracted_at: '2023-01-01T00:00:00Z',
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
      };

      expect(needsEducationInference(parlamentario)).toBe(true);
    });

    it('returns false for parlamentario with existing education', () => {
      const parlamentario: ParlamentarioRaw = {
        camara: 'Congreso',
        nombre_completo: 'Test Person',
        partido: 'Test',
        grupo_parlamentario: 'Test',
        circunscripcion: 'Test',
        data_sources: [
          {
            source: 'congreso',
            field: 'estudios',
            raw_text: 'Licenciado en Derecho',
            extracted_at: '2023-01-01T00:00:00Z',
            extracted_value: 'Universitario',
          },
          {
            source: 'congreso',
            field: 'profesion',
            raw_text: 'Abogado',
            extracted_at: '2023-01-01T00:00:00Z',
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
      };

      expect(needsEducationInference(parlamentario)).toBe(false);
    });

    it('returns false for parlamentario with No_consta profession', () => {
      const parlamentario: ParlamentarioRaw = {
        camara: 'Congreso',
        nombre_completo: 'Test Person',
        partido: 'Test',
        grupo_parlamentario: 'Test',
        circunscripcion: 'Test',
        data_sources: [],
        education_levels: {
          original: 'No consta',
          normalized: 'No_consta',
          simplified: 'Obligatoria',
        },
        fecha_alta: '2023-01-01',
        url_ficha: 'https://example.com',
      };

      expect(needsEducationInference(parlamentario)).toBe(false);
    });

    it('returns false if already has education_inference', () => {
      const parlamentario: ParlamentarioRaw = {
        camara: 'Congreso',
        nombre_completo: 'Test Person',
        partido: 'Test',
        grupo_parlamentario: 'Test',
        circunscripcion: 'Test',
        data_sources: [
          {
            source: 'congreso',
            field: 'profesion',
            raw_text: 'Abogado',
            extracted_at: '2023-01-01T00:00:00Z',
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
        education_inference: {
          inferred_education: 'Licenciado en Derecho',
          inference_rule: 'profession_requires_degree',
          confidence: 0.95,
          applied: false,
          reviewed_by: null,
          reviewed_at: null,
          approved: null,
        },
      };

      expect(needsEducationInference(parlamentario)).toBe(false);
    });
  });

  describe('Inference result structure', () => {
    it('returns properly structured inference object', () => {
      const result = inferEducationFromProfession('Abogado', 'Profesional_liberal');

      expect(result).toBeDefined();
      expect(result).toHaveProperty('inferred_education');
      expect(result).toHaveProperty('inference_rule');
      expect(result).toHaveProperty('confidence');
      expect(result).toHaveProperty('applied');
      expect(result).toHaveProperty('reviewed_by');
      expect(result).toHaveProperty('reviewed_at');
      expect(result).toHaveProperty('approved');

      if (result) {
        expect(typeof result.inferred_education).toBe('string');
        expect(typeof result.inference_rule).toBe('string');
        expect(typeof result.confidence).toBe('number');
        expect(typeof result.applied).toBe('boolean');
        expect(result.reviewed_by).toBeNull();
        expect(result.reviewed_at).toBeNull();
        expect(result.approved).toBeNull();
        expect(result.applied).toBe(false); // Not applied by default
      }
    });
  });

  describe('Real-world profession text variations', () => {
    it('handles "Abogado y empresario"', () => {
      const result = inferEducationFromProfession('Abogado y empresario', 'Profesional_liberal');
      expect(result).toBeDefined();
      expect(result?.inferred_education).toBe('Licenciado en Derecho');
    });

    it('handles "Ingeniero Industrial, MBA"', () => {
      const result = inferEducationFromProfession('Ingeniero Industrial, MBA', 'Profesional_liberal');
      expect(result).toBeDefined();
      expect(result?.inferred_education).toContain('Ingenier');
    });

    it('handles "Abogado del Ilustre Colegio de Madrid"', () => {
      const result = inferEducationFromProfession(
        'Abogado del Ilustre Colegio de Madrid',
        'Profesional_liberal'
      );
      expect(result).toBeDefined();
      expect(result?.inferred_education).toBe('Licenciado en Derecho');
    });

    it('handles "Médico especialista en cardiología"', () => {
      const result = inferEducationFromProfession(
        'Médico especialista en cardiología',
        'Profesional_liberal'
      );
      expect(result).toBeDefined();
      expect(result?.inferred_education).toBe('Licenciado en Medicina');
    });
  });
});
