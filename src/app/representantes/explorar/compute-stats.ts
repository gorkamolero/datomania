import type {
  Parlamentario,
  EducacionStats,
  Camara,
  EstudiosNivel,
  ProfesionCategoria,
} from '@/projects/representantes/types/parlamentario';

/**
 * Compute statistics from a filtered array of parlamentarios
 * This is a client-side version of the computeStats function
 */
export function computeStatsFromData(
  parlamentarios: Parlamentario[]
): EducacionStats {
  const por_camara: Record<Camara, number> = {
    Congreso: 0,
    Senado: 0,
  };

  const por_estudios_nivel: Record<EstudiosNivel, number> = {
    Universitario: 0,
    FP_Tecnico: 0,
    Secundario: 0,
    No_consta: 0,
    Universitario_inferido: 0,
    Estudios_incompletos: 0,
  };

  const por_profesion_categoria: Record<ProfesionCategoria, number> = {
    Manual: 0,
    Oficina: 0,
    Funcionario: 0,
    Profesional_liberal: 0,
    Empresario: 0,
    Politica: 0,
    No_consta: 0,
  };

  const por_partido: Record<string, number> = {};

  let estudios_con_datos = 0;
  let profesion_con_datos = 0;

  for (const p of parlamentarios) {
    // Count by camara
    por_camara[p.camara]++;

    // Count by education level
    por_estudios_nivel[p.estudios_nivel]++;

    // Count by profession category
    por_profesion_categoria[p.profesion_categoria]++;

    // Count by party
    por_partido[p.partido] = (por_partido[p.partido] || 0) + 1;

    // Coverage stats
    if (p.estudios_nivel !== 'No_consta') {
      estudios_con_datos++;
    }
    if (p.profesion_categoria !== 'No_consta') {
      profesion_con_datos++;
    }
  }

  return {
    total: parlamentarios.length,
    por_camara,
    por_estudios_nivel,
    por_profesion_categoria,
    por_partido,
    cobertura: {
      estudios_con_datos,
      estudios_sin_datos: parlamentarios.length - estudios_con_datos,
      profesion_con_datos,
      profesion_sin_datos: parlamentarios.length - profesion_con_datos,
    },
    ultima_actualizacion: new Date().toISOString().split('T')[0],
  };
}
