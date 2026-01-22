'use client';

import { ResponsiveBar } from '@nivo/bar';
import type { EstudiosNivel } from '@/types/parlamentario';

interface EducationBarChartProps {
  data: Record<EstudiosNivel, number>;
  className?: string;
}

// Human-readable labels for education levels
const EDUCATION_LABELS: Record<EstudiosNivel, string> = {
  Universitario: 'Universitario',
  FP_Tecnico: 'FP / Técnico',
  Secundario: 'Secundaria',
  Universitario_inferido: 'Universitario (inferido)',
  No_consta: 'No consta',
};

export function EducationBarChart({ data, className }: EducationBarChartProps) {
  // Transform data for Nivo
  const chartData = Object.entries(data).map(([key, value]) => ({
    nivel: EDUCATION_LABELS[key as EstudiosNivel],
    count: value,
    nivel_id: key,
  }));

  return (
    <div className={className} style={{ height: '400px' }}>
      <ResponsiveBar
        data={chartData}
        keys={['count']}
        indexBy="nivel"
        margin={{ top: 20, right: 30, bottom: 80, left: 60 }}
        padding={0.3}
        valueScale={{ type: 'linear' }}
        indexScale={{ type: 'band', round: true }}
        colors={{ scheme: 'blues' }}
        borderColor={{
          from: 'color',
          modifiers: [['darker', 1.6]],
        }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: -45,
          legend: 'Nivel educativo',
          legendPosition: 'middle',
          legendOffset: 70,
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'Número de parlamentarios',
          legendPosition: 'middle',
          legendOffset: -50,
        }}
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor={{
          from: 'color',
          modifiers: [['darker', 1.6]],
        }}
        role="img"
        theme={{
          text: {
            fontSize: 12,
            fill: 'hsl(var(--foreground))',
          },
          axis: {
            legend: {
              text: {
                fontSize: 14,
                fill: 'hsl(var(--foreground))',
                fontWeight: 500,
              },
            },
            ticks: {
              text: {
                fill: 'hsl(var(--muted-foreground))',
              },
            },
          },
          grid: {
            line: {
              stroke: 'hsl(var(--border))',
              strokeWidth: 1,
            },
          },
        }}
      />
    </div>
  );
}
