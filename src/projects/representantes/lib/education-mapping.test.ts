/**
 * Tests for education mapping system
 *
 * Maps Spanish education system across historical reforms:
 * - Pre-1970 (Ley Moyano)
 * - 1970-1990 (Ley General de Educación - EGB, BUP, COU, FP)
 * - 1990-2006 (LOGSE - ESO, Bachillerato, FP)
 * - Pre-Bologna university (Licenciado, Diplomado, Ingeniero)
 * - Post-Bologna (Grado, Máster, Doctorado)
 *
 * Run with: pnpm test:run education-mapping
 */

import { describe, it, expect } from 'vitest';
import { normalizeEducation } from './education-mapping';

describe('Education Mapping - Historical Spanish Education System', () => {
  describe('Pre-1970 System (Ley Moyano)', () => {
    it('maps "Enseñanza Primaria" to ESO (Obligatoria)', () => {
      const result = normalizeEducation('Enseñanza Primaria');
      expect(result.normalized).toBe('ESO');
      expect(result.simplified).toBe('Obligatoria');
      expect(result.original).toBe('Enseñanza Primaria');
    });

    it('maps "Bachillerato Elemental" to ESO (Obligatoria)', () => {
      const result = normalizeEducation('Bachillerato Elemental');
      expect(result.normalized).toBe('ESO');
      expect(result.simplified).toBe('Obligatoria');
    });
  });

  describe('1970-1990 System (Ley General de Educación - LGE)', () => {
    it('maps "EGB" to ESO (Obligatoria)', () => {
      const result = normalizeEducation('EGB');
      expect(result.normalized).toBe('ESO');
      expect(result.simplified).toBe('Obligatoria');
    });

    it('maps "Graduado Escolar" to ESO (Obligatoria)', () => {
      const result = normalizeEducation('Graduado Escolar');
      expect(result.normalized).toBe('ESO');
      expect(result.simplified).toBe('Obligatoria');
    });

    it('maps "BUP" to Bachillerato (Postobligatoria)', () => {
      const result = normalizeEducation('BUP');
      expect(result.normalized).toBe('Bachillerato');
      expect(result.simplified).toBe('Postobligatoria');
    });

    it('maps "COU" to Bachillerato (Postobligatoria)', () => {
      const result = normalizeEducation('COU');
      expect(result.normalized).toBe('Bachillerato');
      expect(result.simplified).toBe('Postobligatoria');
    });

    it('maps "FP 1" to FP_Grado_Medio (Postobligatoria)', () => {
      const result = normalizeEducation('FP 1');
      expect(result.normalized).toBe('FP_Grado_Medio');
      expect(result.simplified).toBe('Postobligatoria');
    });

    it('maps "FP 2" to FP_Grado_Superior (Postobligatoria)', () => {
      const result = normalizeEducation('FP 2');
      expect(result.normalized).toBe('FP_Grado_Superior');
      expect(result.simplified).toBe('Postobligatoria');
    });

    it('handles "Formación Profesional de primer grado" as FP_Grado_Medio', () => {
      const result = normalizeEducation('Formación Profesional de primer grado');
      expect(result.normalized).toBe('FP_Grado_Medio');
      expect(result.simplified).toBe('Postobligatoria');
    });

    it('handles "Formación Profesional de segundo grado" as FP_Grado_Superior', () => {
      const result = normalizeEducation('Formación Profesional de segundo grado');
      expect(result.normalized).toBe('FP_Grado_Superior');
      expect(result.simplified).toBe('Postobligatoria');
    });
  });

  describe('1990-2006 System (LOGSE)', () => {
    it('maps "ESO" to ESO (Obligatoria)', () => {
      const result = normalizeEducation('ESO');
      expect(result.normalized).toBe('ESO');
      expect(result.simplified).toBe('Obligatoria');
    });

    it('maps "Bachillerato" to Bachillerato (Postobligatoria)', () => {
      const result = normalizeEducation('Bachillerato');
      expect(result.normalized).toBe('Bachillerato');
      expect(result.simplified).toBe('Postobligatoria');
    });

    it('maps "Bachillerato LOGSE" to Bachillerato (Postobligatoria)', () => {
      const result = normalizeEducation('Bachillerato LOGSE');
      expect(result.normalized).toBe('Bachillerato');
      expect(result.simplified).toBe('Postobligatoria');
    });

    it('maps "FP Grado Medio" to FP_Grado_Medio (Postobligatoria)', () => {
      const result = normalizeEducation('FP Grado Medio');
      expect(result.normalized).toBe('FP_Grado_Medio');
      expect(result.simplified).toBe('Postobligatoria');
    });

    it('maps "FP Grado Superior" to FP_Grado_Superior (Postobligatoria)', () => {
      const result = normalizeEducation('FP Grado Superior');
      expect(result.normalized).toBe('FP_Grado_Superior');
      expect(result.simplified).toBe('Postobligatoria');
    });

    it('maps "Ciclo Formativo de Grado Medio" to FP_Grado_Medio', () => {
      const result = normalizeEducation('Ciclo Formativo de Grado Medio');
      expect(result.normalized).toBe('FP_Grado_Medio');
      expect(result.simplified).toBe('Postobligatoria');
    });

    it('maps "Ciclo Formativo de Grado Superior" to FP_Grado_Superior', () => {
      const result = normalizeEducation('Ciclo Formativo de Grado Superior');
      expect(result.normalized).toBe('FP_Grado_Superior');
      expect(result.simplified).toBe('Postobligatoria');
    });
  });

  describe('Pre-Bologna University Degrees', () => {
    it('maps "Licenciado" to Licenciatura (Universitaria)', () => {
      const result = normalizeEducation('Licenciado');
      expect(result.normalized).toBe('Licenciatura');
      expect(result.simplified).toBe('Universitaria');
    });

    it('maps "Licenciado en Derecho" to Licenciatura (Universitaria)', () => {
      const result = normalizeEducation('Licenciado en Derecho');
      expect(result.normalized).toBe('Licenciatura');
      expect(result.simplified).toBe('Universitaria');
    });

    it('maps "Licenciatura en Medicina" to Licenciatura (Universitaria)', () => {
      const result = normalizeEducation('Licenciatura en Medicina');
      expect(result.normalized).toBe('Licenciatura');
      expect(result.simplified).toBe('Universitaria');
    });

    it('maps "Diplomado" to Grado (Universitaria)', () => {
      const result = normalizeEducation('Diplomado');
      expect(result.normalized).toBe('Grado');
      expect(result.simplified).toBe('Universitaria');
    });

    it('maps "Diplomado en Enfermería" to Grado (Universitaria)', () => {
      const result = normalizeEducation('Diplomado en Enfermería');
      expect(result.normalized).toBe('Grado');
      expect(result.simplified).toBe('Universitaria');
    });

    it('maps "Ingeniero" to Licenciatura (Universitaria)', () => {
      const result = normalizeEducation('Ingeniero');
      expect(result.normalized).toBe('Licenciatura');
      expect(result.simplified).toBe('Universitaria');
    });

    it('maps "Ingeniero Industrial" to Licenciatura (Universitaria)', () => {
      const result = normalizeEducation('Ingeniero Industrial');
      expect(result.normalized).toBe('Licenciatura');
      expect(result.simplified).toBe('Universitaria');
    });

    it('maps "Ingeniero Técnico" to Grado (Universitaria)', () => {
      const result = normalizeEducation('Ingeniero Técnico');
      expect(result.normalized).toBe('Grado');
      expect(result.simplified).toBe('Universitaria');
    });

    it('maps "Ingeniero Técnico Industrial" to Grado (Universitaria)', () => {
      const result = normalizeEducation('Ingeniero Técnico Industrial');
      expect(result.normalized).toBe('Grado');
      expect(result.simplified).toBe('Universitaria');
    });

    it('maps "Arquitecto" to Licenciatura (Universitaria)', () => {
      const result = normalizeEducation('Arquitecto');
      expect(result.normalized).toBe('Licenciatura');
      expect(result.simplified).toBe('Universitaria');
    });

    it('maps "Arquitecto Técnico" to Grado (Universitaria)', () => {
      const result = normalizeEducation('Arquitecto Técnico');
      expect(result.normalized).toBe('Grado');
      expect(result.simplified).toBe('Universitaria');
    });
  });

  describe('Post-Bologna University Degrees', () => {
    it('maps "Grado" to Grado (Universitaria)', () => {
      const result = normalizeEducation('Grado');
      expect(result.normalized).toBe('Grado');
      expect(result.simplified).toBe('Universitaria');
    });

    it('maps "Grado en Derecho" to Grado (Universitaria)', () => {
      const result = normalizeEducation('Grado en Derecho');
      expect(result.normalized).toBe('Grado');
      expect(result.simplified).toBe('Universitaria');
    });

    it('maps "Graduado en Economía" to Grado (Universitaria)', () => {
      const result = normalizeEducation('Graduado en Economía');
      expect(result.normalized).toBe('Grado');
      expect(result.simplified).toBe('Universitaria');
    });

    it('maps "Máster" to Master (Universitaria)', () => {
      const result = normalizeEducation('Máster');
      expect(result.normalized).toBe('Master');
      expect(result.simplified).toBe('Universitaria');
    });

    it('maps "Master" to Master (Universitaria)', () => {
      const result = normalizeEducation('Master');
      expect(result.normalized).toBe('Master');
      expect(result.simplified).toBe('Universitaria');
    });

    it('maps "Máster en Derecho" to Master (Universitaria)', () => {
      const result = normalizeEducation('Máster en Derecho');
      expect(result.normalized).toBe('Master');
      expect(result.simplified).toBe('Universitaria');
    });

    it('maps "MBA" to Master (Universitaria)', () => {
      const result = normalizeEducation('MBA');
      expect(result.normalized).toBe('Master');
      expect(result.simplified).toBe('Universitaria');
    });

    it('maps "Doctorado" to Doctorado (Universitaria)', () => {
      const result = normalizeEducation('Doctorado');
      expect(result.normalized).toBe('Doctorado');
      expect(result.simplified).toBe('Universitaria');
    });

    it('maps "Doctor en Economía" to Doctorado (Universitaria)', () => {
      const result = normalizeEducation('Doctor en Economía');
      expect(result.normalized).toBe('Doctorado');
      expect(result.simplified).toBe('Universitaria');
    });

    it('maps "PhD" to Doctorado (Universitaria)', () => {
      const result = normalizeEducation('PhD');
      expect(result.normalized).toBe('Doctorado');
      expect(result.simplified).toBe('Universitaria');
    });
  });

  describe('Complex real-world examples', () => {
    it('handles "Licenciado en Derecho por la Universidad Complutense de Madrid"', () => {
      const result = normalizeEducation('Licenciado en Derecho por la Universidad Complutense de Madrid');
      expect(result.normalized).toBe('Licenciatura');
      expect(result.simplified).toBe('Universitaria');
      expect(result.original).toBe('Licenciado en Derecho por la Universidad Complutense de Madrid');
    });

    it('handles "Grado en Economía y Máster en Finanzas"', () => {
      const result = normalizeEducation('Grado en Economía y Máster en Finanzas');
      // Should pick the highest level (Máster)
      expect(result.normalized).toBe('Master');
      expect(result.simplified).toBe('Universitaria');
    });

    it('handles "Doctor en Medicina, Licenciado en Derecho"', () => {
      const result = normalizeEducation('Doctor en Medicina, Licenciado en Derecho');
      // Should pick the highest level (Doctorado)
      expect(result.normalized).toBe('Doctorado');
      expect(result.simplified).toBe('Universitaria');
    });

    it('handles "Ingeniero Industrial y MBA"', () => {
      const result = normalizeEducation('Ingeniero Industrial y MBA');
      // Should recognize Master (MBA is a Master)
      expect(result.normalized).toBe('Master');
      expect(result.simplified).toBe('Universitaria');
    });

    it('handles "BUP y COU" (both postobligatory)', () => {
      const result = normalizeEducation('BUP y COU');
      expect(result.normalized).toBe('Bachillerato');
      expect(result.simplified).toBe('Postobligatoria');
    });
  });

  describe('Edge cases and missing data', () => {
    it('handles null as No_consta', () => {
      const result = normalizeEducation(null);
      expect(result.normalized).toBe('No_consta');
      expect(result.simplified).toBe('Obligatoria'); // Conservative assumption
      expect(result.original).toBe('No consta');
    });

    it('handles empty string as No_consta', () => {
      const result = normalizeEducation('');
      expect(result.normalized).toBe('No_consta');
      expect(result.simplified).toBe('Obligatoria');
      expect(result.original).toBe('No consta');
    });

    it('handles "No consta" as No_consta', () => {
      const result = normalizeEducation('No consta');
      expect(result.normalized).toBe('No_consta');
      expect(result.simplified).toBe('Obligatoria');
    });

    it('handles "Sin estudios" as ESO (minimum)', () => {
      const result = normalizeEducation('Sin estudios');
      expect(result.normalized).toBe('ESO');
      expect(result.simplified).toBe('Obligatoria');
    });

    it('handles "Estudios no finalizados" preserving original text', () => {
      const result = normalizeEducation('Estudios universitarios no finalizados');
      // Should recognize "universitarios" but mark as incomplete
      expect(result.normalized).toBe('Grado'); // Best guess
      expect(result.simplified).toBe('Universitaria');
      expect(result.original).toBe('Estudios universitarios no finalizados');
    });

    it('handles unknown/ambiguous text as No_consta', () => {
      const result = normalizeEducation('XYZ Invalid Education Level');
      expect(result.normalized).toBe('No_consta');
      expect(result.simplified).toBe('Obligatoria');
      expect(result.original).toBe('XYZ Invalid Education Level');
    });
  });

  describe('Case insensitivity and variations', () => {
    it('handles lowercase "licenciado en derecho"', () => {
      const result = normalizeEducation('licenciado en derecho');
      expect(result.normalized).toBe('Licenciatura');
      expect(result.simplified).toBe('Universitaria');
    });

    it('handles UPPERCASE "INGENIERO INDUSTRIAL"', () => {
      const result = normalizeEducation('INGENIERO INDUSTRIAL');
      expect(result.normalized).toBe('Licenciatura');
      expect(result.simplified).toBe('Universitaria');
    });

    it('handles mixed case "GrAdO eN EcOnOmÍa"', () => {
      const result = normalizeEducation('GrAdO eN EcOnOmÍa');
      expect(result.normalized).toBe('Grado');
      expect(result.simplified).toBe('Universitaria');
    });

    it('handles accented variations "Máster" vs "Master"', () => {
      const result1 = normalizeEducation('Máster');
      const result2 = normalizeEducation('Master');
      expect(result1.normalized).toBe('Master');
      expect(result2.normalized).toBe('Master');
      expect(result1.simplified).toBe(result2.simplified);
    });
  });

  describe('Original text preservation', () => {
    it('preserves exact original text including formatting', () => {
      const original = 'Licenciado en Derecho    por la UCM (1995)';
      const result = normalizeEducation(original);
      expect(result.original).toBe(original);
    });

    it('preserves special characters in original', () => {
      const original = 'Grado en Economía - Universidad de Barcelona (2010-2014)';
      const result = normalizeEducation(original);
      expect(result.original).toBe(original);
    });
  });
});
