'use client';

import { useMemo } from 'react';
import type {
  Parlamentario,
  EstudiosNivel,
  ProfesionCategoria,
} from '@/projects/representantes/types/parlamentario';

interface EducationProfessionSankeyProps {
  parlamentarios: Parlamentario[];
}

// Human-readable labels
const EDUCATION_LABELS: Record<EstudiosNivel, string> = {
  Universitario: 'Universitario',
  FP_Tecnico: 'FP Técnico',
  Secundario: 'Secundario',
  No_consta: 'Sin datos',
  Universitario_inferido: 'Univ. (inferido)',
  Estudios_incompletos: 'Incompletos',
};

const PROFESSION_LABELS: Record<ProfesionCategoria, string> = {
  Manual: 'Manual',
  Oficina: 'Oficina',
  Funcionario: 'Funcionario',
  Profesional_liberal: 'Prof. liberal',
  Empresario: 'Empresario',
  Politica: 'Política',
  No_consta: 'Sin datos',
};

const EDUCATION_COLORS: Record<EstudiosNivel, string> = {
  Universitario: '#3b82f6',
  FP_Tecnico: '#8b5cf6',
  Secundario: '#06b6d4',
  No_consta: '#94a3b8',
  Universitario_inferido: '#60a5fa',
  Estudios_incompletos: '#f97316',
};

const PROFESSION_COLORS: Record<ProfesionCategoria, string> = {
  Manual: '#f59e0b',
  Oficina: '#14b8a6',
  Funcionario: '#10b981',
  Profesional_liberal: '#8b5cf6',
  Empresario: '#f97316',
  Politica: '#ec4899',
  No_consta: '#94a3b8',
};

interface FlowData {
  source: EstudiosNivel;
  target: ProfesionCategoria;
  value: number;
}

export function EducationProfessionSankey({
  parlamentarios,
}: EducationProfessionSankeyProps) {
  // Calculate flows
  const { flows, eduTotals, profTotals, total } = useMemo(() => {
    const flowMap = new Map<string, number>();
    const eduMap = new Map<EstudiosNivel, number>();
    const profMap = new Map<ProfesionCategoria, number>();

    parlamentarios.forEach((p) => {
      const key = `${p.estudios_nivel}→${p.profesion_categoria}`;
      flowMap.set(key, (flowMap.get(key) || 0) + 1);
      eduMap.set(p.estudios_nivel, (eduMap.get(p.estudios_nivel) || 0) + 1);
      profMap.set(p.profesion_categoria, (profMap.get(p.profesion_categoria) || 0) + 1);
    });

    const flows: FlowData[] = [];

    flowMap.forEach((value, key) => {
      const [source, target] = key.split('→') as [EstudiosNivel, ProfesionCategoria];
      flows.push({ source, target, value });
    });

    return {
      flows,
      eduTotals: eduMap,
      profTotals: profMap,
      total: parlamentarios.length,
    };
  }, [parlamentarios]);

  // Sort education and profession by totals
  const sortedEdu = Object.keys(EDUCATION_LABELS)
    .filter((k) => eduTotals.has(k as EstudiosNivel))
    .sort((a, b) => (eduTotals.get(b as EstudiosNivel) || 0) - (eduTotals.get(a as EstudiosNivel) || 0)) as EstudiosNivel[];

  const sortedProf = Object.keys(PROFESSION_LABELS)
    .filter((k) => profTotals.has(k as ProfesionCategoria))
    .sort((a, b) => (profTotals.get(b as ProfesionCategoria) || 0) - (profTotals.get(a as ProfesionCategoria) || 0)) as ProfesionCategoria[];

  // Calculate positions
  const height = 500;
  const eduHeight = height - 40;
  const profHeight = height - 40;

  // Position nodes
  const eduPositions: Record<string, { y: number; height: number }> = {};
  let eduY = 20;
  sortedEdu.forEach((edu) => {
    const count = eduTotals.get(edu) || 0;
    const h = Math.max(20, (count / total) * eduHeight);
    eduPositions[edu] = { y: eduY, height: h };
    eduY += h + 8;
  });

  const profPositions: Record<string, { y: number; height: number }> = {};
  let profY = 20;
  sortedProf.forEach((prof) => {
    const count = profTotals.get(prof) || 0;
    const h = Math.max(20, (count / total) * profHeight);
    profPositions[prof] = { y: profY, height: h };
    profY += h + 8;
  });

  // Track flow offsets for stacking
  const eduFlowOffsets: Record<string, number> = {};
  const profFlowOffsets: Record<string, number> = {};
  sortedEdu.forEach((e) => (eduFlowOffsets[e] = 0));
  sortedProf.forEach((p) => (profFlowOffsets[p] = 0));

  // Sort flows by value for better visualization
  const sortedFlows = [...flows].sort((a, b) => b.value - a.value);

  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox="0 0 800 550" className="w-full min-w-[600px]" preserveAspectRatio="xMidYMid meet">
        {/* Education labels (left) */}
        {sortedEdu.map((edu) => {
          const pos = eduPositions[edu];
          const count = eduTotals.get(edu) || 0;
          return (
            <g key={`edu-${edu}`}>
              <rect
                x={100}
                y={pos.y}
                width={24}
                height={pos.height}
                fill={EDUCATION_COLORS[edu]}
                rx={4}
              />
              <text
                x={95}
                y={pos.y + pos.height / 2}
                textAnchor="end"
                dominantBaseline="middle"
                className="text-xs fill-foreground"
              >
                {EDUCATION_LABELS[edu]}
              </text>
              <text
                x={95}
                y={pos.y + pos.height / 2 + 12}
                textAnchor="end"
                dominantBaseline="middle"
                className="text-[10px] fill-muted-foreground"
              >
                ({count})
              </text>
            </g>
          );
        })}

        {/* Profession labels (right) */}
        {sortedProf.map((prof) => {
          const pos = profPositions[prof];
          const count = profTotals.get(prof) || 0;
          return (
            <g key={`prof-${prof}`}>
              <rect
                x={676}
                y={pos.y}
                width={24}
                height={pos.height}
                fill={PROFESSION_COLORS[prof]}
                rx={4}
              />
              <text
                x={705}
                y={pos.y + pos.height / 2}
                textAnchor="start"
                dominantBaseline="middle"
                className="text-xs fill-foreground"
              >
                {PROFESSION_LABELS[prof]}
              </text>
              <text
                x={705}
                y={pos.y + pos.height / 2 + 12}
                textAnchor="start"
                dominantBaseline="middle"
                className="text-[10px] fill-muted-foreground"
              >
                ({count})
              </text>
            </g>
          );
        })}

        {/* Flow paths */}
        {sortedFlows.map((flow, i) => {
          const eduPos = eduPositions[flow.source];
          const profPos = profPositions[flow.target];
          if (!eduPos || !profPos) return null;

          const flowHeight = Math.max(2, (flow.value / total) * 300);

          const sourceY = eduPos.y + eduFlowOffsets[flow.source] + flowHeight / 2;
          const targetY = profPos.y + profFlowOffsets[flow.target] + flowHeight / 2;

          eduFlowOffsets[flow.source] += flowHeight;
          profFlowOffsets[flow.target] += flowHeight;

          const x1 = 124;
          const x2 = 676;
          const cx1 = x1 + 150;
          const cx2 = x2 - 150;

          return (
            <g key={`flow-${i}`} className="group">
              <path
                d={`M ${x1} ${sourceY} C ${cx1} ${sourceY}, ${cx2} ${targetY}, ${x2} ${targetY}`}
                fill="none"
                stroke={EDUCATION_COLORS[flow.source]}
                strokeWidth={flowHeight}
                strokeOpacity={0.25}
                className="transition-all group-hover:stroke-opacity-50"
              />
              <title>
                {EDUCATION_LABELS[flow.source]} → {PROFESSION_LABELS[flow.target]}: {flow.value} parlamentarios
              </title>
            </g>
          );
        })}

        {/* Title */}
        <text x={400} y={535} textAnchor="middle" className="text-sm fill-muted-foreground">
          Flujo: Nivel educativo → Categoría profesional
        </text>
      </svg>
    </div>
  );
}
