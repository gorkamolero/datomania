'use client';

import { ResponsivePie } from '@nivo/pie';
import type { ProfesionCategoria } from '@/projects/representantes/types/parlamentario';

interface ProfessionPieChartProps {
  data: Record<ProfesionCategoria, number>;
  className?: string;
}

// Human-readable labels for profession categories
const PROFESSION_LABELS: Record<ProfesionCategoria, string> = {
  Manual: 'Manual',
  Oficina: 'Oficina',
  Funcionario: 'Funcionario',
  Profesional_liberal: 'Prof. liberal',
  Empresario: 'Empresario',
  Politica: 'Política',
  No_consta: 'No consta',
};

// Neobrutalist color scheme - high contrast, bold
const PROFESSION_COLORS: Record<ProfesionCategoria, string> = {
  Profesional_liberal: '#FF5C00', // Main orange
  Funcionario: '#000000', // Black
  Politica: '#3B82F6', // Blue
  Empresario: '#10B981', // Green
  Oficina: '#F59E0B', // Amber
  Manual: '#8B5CF6', // Purple
  No_consta: '#CCCCCC', // Grey
};

export function ProfessionPieChart({
  data,
  className,
}: ProfessionPieChartProps) {
  // Transform data for Nivo
  const chartData = Object.entries(data)
    .filter(([, value]) => value > 0)
    .map(([key, value]) => ({
      id: PROFESSION_LABELS[key as ProfesionCategoria],
      label: PROFESSION_LABELS[key as ProfesionCategoria],
      value,
      color: PROFESSION_COLORS[key as ProfesionCategoria],
    }))
    .sort((a, b) => b.value - a.value);

  return (
    <div className={className} style={{ height: '400px' }}>
      <ResponsivePie
        data={chartData}
        margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
        innerRadius={0.5}
        padAngle={2}
        cornerRadius={0}
        activeOuterRadiusOffset={8}
        colors={{ datum: 'data.color' }}
        borderWidth={2}
        borderColor="#000000"
        arcLinkLabelsSkipAngle={10}
        arcLinkLabelsTextColor="#000000"
        arcLinkLabelsThickness={2}
        arcLinkLabelsColor="#000000"
        arcLabelsSkipAngle={10}
        arcLabelsTextColor="#FFFFFF"
        legends={[
          {
            anchor: 'bottom',
            direction: 'row',
            justify: false,
            translateX: 0,
            translateY: 56,
            itemsSpacing: 0,
            itemWidth: 100,
            itemHeight: 18,
            itemTextColor: '#000000',
            itemDirection: 'left-to-right',
            itemOpacity: 1,
            symbolSize: 12,
            symbolShape: 'square',
          },
        ]}
        role="img"
        theme={{
          text: {
            fontSize: 12,
            fontWeight: 600,
            fill: '#000000',
          },
          legends: {
            text: {
              fontSize: 11,
              fontWeight: 500,
              fill: '#000000',
            },
          },
        }}
      />
    </div>
  );
}
