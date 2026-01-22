'use client';

import { ResponsiveBar } from '@nivo/bar';
import type { EstudiosNivel } from '@/projects/representantes/types/parlamentario';

interface EducationBarChartProps {
  data: Record<EstudiosNivel, number>;
  className?: string;
}

// Human-readable labels for education levels
const EDUCATION_LABELS: Record<EstudiosNivel, string> = {
  Universitario: 'Universitario',
  FP_Tecnico: 'FP / Técnico',
  Secundario: 'Secundaria',
  Universitario_inferido: 'Univ. (inferido)',
  No_consta: 'No consta',
  Estudios_incompletos: 'Incompletos',
};

export function EducationBarChart({ data, className }: EducationBarChartProps) {
  // Transform data for Nivo, sorted by count descending
  const chartData = Object.entries(data)
    .map(([key, value]) => ({
      nivel: EDUCATION_LABELS[key as EstudiosNivel],
      count: value,
      nivel_id: key,
    }))
    .sort((a, b) => b.count - a.count);

  return (
    <div className={className} style={{ height: '400px' }}>
      <ResponsiveBar
        data={chartData}
        keys={['count']}
        indexBy="nivel"
        margin={{ top: 20, right: 30, bottom: 100, left: 60 }}
        padding={0.3}
        valueScale={{ type: 'linear' }}
        indexScale={{ type: 'band', round: true }}
        colors="#FF5C00"
        borderWidth={2}
        borderColor="#000000"
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 0,
          tickPadding: 10,
          tickRotation: -45,
        }}
        axisLeft={{
          tickSize: 0,
          tickPadding: 10,
          tickRotation: 0,
        }}
        enableGridY={true}
        gridYValues={5}
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor="#000000"
        role="img"
        theme={{
          text: {
            fontSize: 12,
            fontWeight: 600,
            fill: '#000000',
          },
          axis: {
            ticks: {
              text: {
                fontSize: 11,
                fontWeight: 500,
                fill: '#000000',
              },
            },
          },
          grid: {
            line: {
              stroke: '#000000',
              strokeWidth: 1,
              strokeDasharray: '4 4',
            },
          },
        }}
      />
    </div>
  );
}
