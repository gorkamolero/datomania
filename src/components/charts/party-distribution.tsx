'use client';

import { ResponsiveBar } from '@nivo/bar';
import { getPartido } from '@/data/partidos';

interface PartyDistributionProps {
  data: Record<string, number>;
  className?: string;
}

export function PartyDistribution({ data, className }: PartyDistributionProps) {
  // Transform data for Nivo and sort by count descending
  const chartData = Object.entries(data)
    .map(([partido, count]) => {
      const partidoData = getPartido(partido);
      return {
        partido: partidoData.nombre_corto,
        partido_full: partidoData.nombre,
        count,
        color: partidoData.color,
      };
    })
    .sort((a, b) => b.count - a.count);

  return (
    <div className={className} style={{ height: '500px' }}>
      <ResponsiveBar
        data={chartData}
        keys={['count']}
        indexBy="partido"
        layout="horizontal"
        margin={{ top: 20, right: 30, bottom: 50, left: 120 }}
        padding={0.3}
        valueScale={{ type: 'linear' }}
        indexScale={{ type: 'band', round: true }}
        colors={(bar) => {
          const partido = chartData.find((p) => p.partido === bar.indexValue);
          return partido?.color ?? '#A0A0A0';
        }}
        borderColor={{
          from: 'color',
          modifiers: [['darker', 1.6]],
        }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'Número de parlamentarios',
          legendPosition: 'middle',
          legendOffset: 40,
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'Partido',
          legendPosition: 'middle',
          legendOffset: -110,
        }}
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor={{
          from: 'color',
          modifiers: [['darker', 1.6]],
        }}
        role="img"
        tooltip={({ indexValue, value, color }) => {
          const partido = chartData.find((p) => p.partido === indexValue);
          return (
            <div
              style={{
                padding: '12px 16px',
                background: 'hsl(var(--background))',
                color: 'hsl(var(--foreground))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '4px',
                }}
              >
                <div
                  style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    background: color,
                  }}
                />
                <strong>{partido?.partido_full ?? indexValue}</strong>
              </div>
              <div style={{ fontSize: '14px' }}>
                {value} parlamentario{value !== 1 ? 's' : ''}
              </div>
            </div>
          );
        }}
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
