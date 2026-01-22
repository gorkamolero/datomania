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
        margin={{ top: 20, right: 30, bottom: 50, left: 100 }}
        padding={0.3}
        valueScale={{ type: 'linear' }}
        indexScale={{ type: 'band', round: true }}
        colors={(bar) => {
          const partido = chartData.find((p) => p.partido === bar.indexValue);
          return partido?.color ?? '#CCCCCC';
        }}
        borderWidth={2}
        borderColor="#000000"
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 0,
          tickPadding: 10,
          tickRotation: 0,
        }}
        axisLeft={{
          tickSize: 0,
          tickPadding: 10,
          tickRotation: 0,
        }}
        enableGridX={true}
        gridXValues={5}
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor="#000000"
        role="img"
        tooltip={({ indexValue, value, color }) => {
          const partido = chartData.find((p) => p.partido === indexValue);
          return (
            <div
              style={{
                padding: '8px 12px',
                background: '#FFFEF0',
                color: '#000000',
                border: '2px solid #000000',
                boxShadow: '4px 4px 0px 0px #000000',
                fontWeight: 600,
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
                    background: color,
                    border: '1px solid #000',
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
