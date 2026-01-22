import type { Parlamentario, Camara, EstudiosNivel, ProfesionCategoria } from '@/projects/representantes/types/parlamentario';

export interface ComputedStats {
  total: number;
  por_camara: Record<Camara, number>;
  por_estudios_nivel: Record<EstudiosNivel, number>;
  por_profesion_categoria: Record<ProfesionCategoria, number>;
  por_partido: Record<string, number>;
  cobertura: {
    estudios_con_datos: number;
    estudios_sin_datos: number;
    profesion_con_datos: number;
    profesion_sin_datos: number;
  };
}

export function computeStatsFromData(parlamentarios: Parlamentario[]): ComputedStats {
  const stats: ComputedStats = {
    total: parlamentarios.length,
    por_camara: { Congreso: 0, Senado: 0 },
    por_estudios_nivel: {
      Universitario: 0,
      FP_Tecnico: 0,
      Secundario: 0,
      No_consta: 0,
      Universitario_inferido: 0,
      Estudios_incompletos: 0,
    },
    por_profesion_categoria: {
      Manual: 0,
      Oficina: 0,
      Funcionario: 0,
      Profesional_liberal: 0,
      Empresario: 0,
      Politica: 0,
      No_consta: 0,
    },
    por_partido: {},
    cobertura: {
      estudios_con_datos: 0,
      estudios_sin_datos: 0,
      profesion_con_datos: 0,
      profesion_sin_datos: 0,
    },
  };

  parlamentarios.forEach((p) => {
    // Cámara
    stats.por_camara[p.camara]++;

    // Estudios
    stats.por_estudios_nivel[p.estudios_nivel]++;
    if (p.estudios_nivel !== 'No_consta') {
      stats.cobertura.estudios_con_datos++;
    } else {
      stats.cobertura.estudios_sin_datos++;
    }

    // Profesión
    stats.por_profesion_categoria[p.profesion_categoria]++;
    if (p.profesion_categoria !== 'No_consta') {
      stats.cobertura.profesion_con_datos++;
    } else {
      stats.cobertura.profesion_sin_datos++;
    }

    // Partido
    stats.por_partido[p.partido] = (stats.por_partido[p.partido] || 0) + 1;
  });

  return stats;
}
