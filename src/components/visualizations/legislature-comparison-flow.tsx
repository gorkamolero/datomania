'use client';

import { useMemo } from 'react';

interface LegislatureComparisonFlowProps {
  dataI: Record<string, number>;
  dataXV: Record<string, number>;
  type: 'education' | 'profession';
  totalI: number;
  totalXV: number;
}

const EDUCATION_LABELS: Record<string, string> = {
  Universitario: 'Universitario',
  FP_Tecnico: 'FP Técnico',
  Secundario: 'Secundario',
  No_consta: 'Sin datos',
  Universitario_inferido: 'Univ. (inferido)',
  Estudios_incompletos: 'Incompletos',
};

const PROFESSION_LABELS: Record<string, string> = {
  Manual: 'Manual',
  Oficina: 'Oficina',
  Funcionario: 'Funcionario',
  Profesional_liberal: 'Prof. liberal',
  Empresario: 'Empresario',
  Politica: 'Política',
  No_consta: 'Sin datos',
};

const EDUCATION_COLORS: Record<string, string> = {
  Universitario: '#3b82f6',
  FP_Tecnico: '#8b5cf6',
  Secundario: '#06b6d4',
  No_consta: '#94a3b8',
  Universitario_inferido: '#60a5fa',
  Estudios_incompletos: '#f97316',
};

const PROFESSION_COLORS: Record<string, string> = {
  Manual: '#f59e0b',
  Oficina: '#14b8a6',
  Funcionario: '#10b981',
  Profesional_liberal: '#8b5cf6',
  Empresario: '#f97316',
  Politica: '#ec4899',
  No_consta: '#94a3b8',
};

export function LegislatureComparisonFlow({
  dataI,
  dataXV,
  type,
  totalI,
  totalXV,
}: LegislatureComparisonFlowProps) {
  const labels = type === 'education' ? EDUCATION_LABELS : PROFESSION_LABELS;
  const colors = type === 'education' ? EDUCATION_COLORS : PROFESSION_COLORS;

  // Get all unique categories from both legislatures
  const allCategories = useMemo(() => {
    const categories = new Set([...Object.keys(dataI), ...Object.keys(dataXV)]);
    return Array.from(categories)
      .filter((cat) => labels[cat])
      .sort((a, b) => {
        const avgA = ((dataI[a] || 0) / totalI + (dataXV[a] || 0) / totalXV) / 2;
        const avgB = ((dataI[b] || 0) / totalI + (dataXV[b] || 0) / totalXV) / 2;
        return avgB - avgA;
      });
  }, [dataI, dataXV, totalI, totalXV, labels]);

  // Calculate positions
  const height = 400;
  const nodeHeight = height - 60;

  // Position nodes for Legislature I (left)
  const leftPositions: Record<string, { y: number; height: number }> = {};
  let leftY = 30;
  allCategories.forEach((cat) => {
    const count = dataI[cat] || 0;
    const pct = count / totalI;
    const h = Math.max(8, pct * nodeHeight * 0.85);
    leftPositions[cat] = { y: leftY, height: h };
    leftY += h + 6;
  });

  // Position nodes for Legislature XV (right)
  const rightPositions: Record<string, { y: number; height: number }> = {};
  let rightY = 30;
  allCategories.forEach((cat) => {
    const count = dataXV[cat] || 0;
    const pct = count / totalXV;
    const h = Math.max(8, pct * nodeHeight * 0.85);
    rightPositions[cat] = { y: rightY, height: h };
    rightY += h + 6;
  });

  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox="0 0 700 450" className="w-full min-w-[500px]" preserveAspectRatio="xMidYMid meet">
        {/* Era labels */}
        <text x={70} y={20} textAnchor="middle" className="text-sm font-bold fill-foreground">
          I (1979)
        </text>
        <text x={630} y={20} textAnchor="middle" className="text-sm font-bold fill-foreground">
          XV (2023)
        </text>

        {/* Flow paths (render first so nodes appear on top) */}
        {allCategories.map((cat) => {
          const leftPos = leftPositions[cat];
          const rightPos = rightPositions[cat];
          if (!leftPos || !rightPos) return null;

          const countI = dataI[cat] || 0;
          const countXV = dataXV[cat] || 0;
          const pctI = Math.round((countI / totalI) * 100);
          const pctXV = Math.round((countXV / totalXV) * 100);
          const diff = pctXV - pctI;

          const x1 = 95;
          const x2 = 605;
          const cx1 = x1 + 180;
          const cx2 = x2 - 180;

          // Create a path that connects the category between both eras
          const sourceTopY = leftPos.y;
          const sourceBottomY = leftPos.y + leftPos.height;
          const targetTopY = rightPos.y;
          const targetBottomY = rightPos.y + rightPos.height;

          return (
            <g key={`flow-${cat}`} className="group">
              {/* Flow area */}
              <path
                d={`
                  M ${x1} ${sourceTopY}
                  C ${cx1} ${sourceTopY}, ${cx2} ${targetTopY}, ${x2} ${targetTopY}
                  L ${x2} ${targetBottomY}
                  C ${cx2} ${targetBottomY}, ${cx1} ${sourceBottomY}, ${x1} ${sourceBottomY}
                  Z
                `}
                fill={colors[cat] || '#888'}
                fillOpacity={0.3}
                stroke={colors[cat] || '#888'}
                strokeOpacity={0.5}
                strokeWidth={1}
                className="transition-all group-hover:fill-opacity-50"
              />
              <title>
                {labels[cat]}: {pctI}% → {pctXV}% ({diff > 0 ? '+' : ''}{diff}%)
              </title>
            </g>
          );
        })}

        {/* Left nodes (Legislature I) */}
        {allCategories.map((cat) => {
          const pos = leftPositions[cat];
          const count = dataI[cat] || 0;
          const pct = Math.round((count / totalI) * 100);
          if (count === 0) return null;

          return (
            <g key={`left-${cat}`}>
              <rect
                x={70}
                y={pos.y}
                width={24}
                height={pos.height}
                fill={colors[cat] || '#888'}
                rx={3}
                className="stroke-border stroke-2"
              />
              <text
                x={65}
                y={pos.y + pos.height / 2}
                textAnchor="end"
                dominantBaseline="middle"
                className="text-[10px] fill-foreground"
              >
                {pct}%
              </text>
            </g>
          );
        })}

        {/* Right nodes (Legislature XV) */}
        {allCategories.map((cat) => {
          const pos = rightPositions[cat];
          const count = dataXV[cat] || 0;
          const pct = Math.round((count / totalXV) * 100);
          const countI = dataI[cat] || 0;
          const pctI = Math.round((countI / totalI) * 100);
          const diff = pct - pctI;

          return (
            <g key={`right-${cat}`}>
              <rect
                x={606}
                y={pos.y}
                width={24}
                height={pos.height}
                fill={colors[cat] || '#888'}
                rx={3}
                className="stroke-border stroke-2"
              />
              <text
                x={635}
                y={pos.y + pos.height / 2 - 6}
                textAnchor="start"
                dominantBaseline="middle"
                className="text-xs fill-foreground"
              >
                {labels[cat]}
              </text>
              <text
                x={635}
                y={pos.y + pos.height / 2 + 6}
                textAnchor="start"
                dominantBaseline="middle"
                className={`text-[10px] font-bold ${
                  diff > 0 ? 'fill-green-600' : diff < 0 ? 'fill-red-600' : 'fill-muted-foreground'
                }`}
              >
                {pct}% {diff !== 0 && `(${diff > 0 ? '+' : ''}${diff})`}
              </text>
            </g>
          );
        })}

        {/* Legend */}
        <text x={350} y={430} textAnchor="middle" className="text-xs fill-muted-foreground">
          Evolución en 45 años de democracia
        </text>
      </svg>
    </div>
  );
}
