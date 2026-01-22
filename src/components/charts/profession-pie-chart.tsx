'use client';

import { ResponsivePie } from '@nivo/pie';
import type { ProfesionCategoria } from '@/types/parlamentario';

interface ProfessionPieChartProps {
  data: Record<ProfesionCategoria, number>;
  className?: string;
}

// Human-readable labels for profession categories
const PROFESSION_LABELS: Record<ProfesionCategoria, string> = {
  Manual: 'Trabajo manual',
  Oficina: 'Oficina',
  Funcionario: 'Funcionario',
  Profesional_liberal: 'Profesional liberal',
  Empresario: 'Empresario',
  Politica: 'Política',
  No_consta: 'No consta',
};

// Color scheme for professions
const PROFESSION_COLORS: Record<ProfesionCategoria, string> = {
  Manual: '#8b5cf6', // Purple
  Oficina: '#3b82f6', // Blue
  Funcionario: '#10b981', // Green
  Profesional_liberal: '#f59e0b', // Amber
  Empresario: '#ef4444', // Red
  Politica: '#ec4899', // Pink
  No_consta: '#6b7280', // Gray
};

export function ProfessionPieChart({
  data,
  className,
}: ProfessionPieChartProps) {
  // Transform data for Nivo
  const chartData = Object.entries(data)
    .filter(([, value]) => value > 0) // Only include categories with values
    .map(([key, value]) => ({
      id: PROFESSION_LABELS[key as ProfesionCategoria],
      label: PROFESSION_LABELS[key as ProfesionCategoria],
      value,
      color: PROFESSION_COLORS[key as ProfesionCategoria],
    }));

  return (
    <div className={className} style={{ height: '400px' }}>
      <ResponsivePie
        data={chartData}
        margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
        innerRadius={0.5}
        padAngle={0.7}
        cornerRadius={3}
        activeOuterRadiusOffset={8}
        colors={{ datum: 'data.color' }}
        borderWidth={1}
        borderColor={{
          from: 'color',
          modifiers: [['darker', 0.2]],
        }}
        arcLinkLabelsSkipAngle={10}
        arcLinkLabelsTextColor="hsl(var(--foreground))"
        arcLinkLabelsThickness={2}
        arcLinkLabelsColor={{ from: 'color' }}
        arcLabelsSkipAngle={10}
        arcLabelsTextColor={{
          from: 'color',
          modifiers: [['darker', 2]],
        }}
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
            itemTextColor: 'hsl(var(--foreground))',
            itemDirection: 'left-to-right',
            itemOpacity: 1,
            symbolSize: 12,
            symbolShape: 'circle',
          },
        ]}
        role="img"
        theme={{
          text: {
            fontSize: 12,
            fill: 'hsl(var(--foreground))',
          },
          tooltip: {
            container: {
              background: 'hsl(var(--background))',
              color: 'hsl(var(--foreground))',
              fontSize: 12,
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              border: '1px solid hsl(var(--border))',
            },
          },
        }}
      />
    </div>
  );
}
