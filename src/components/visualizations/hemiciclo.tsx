'use client';

import { Parlamentario } from '@/types/parlamentario';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface HemicicloProps {
  parlamentarios: Parlamentario[];
}

interface Seat {
  parlamentario: Parlamentario;
  x: number;
  y: number;
}

/**
 * Hemiciclo - Parliament seating visualization
 *
 * Displays parlamentarios in a semicircular arrangement colored by party.
 * Supports hover tooltips and click-to-navigate.
 */
export function Hemiciclo({ parlamentarios }: HemicicloProps) {
  const router = useRouter();
  const [hoveredSeat, setHoveredSeat] = useState<Seat | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  // Calculate seat positions in a semicircular arrangement
  const seats = calculateSeatPositions(parlamentarios);

  const handleSeatClick = (parlamentario: Parlamentario) => {
    router.push(`/representantes/parlamentarios/${parlamentario.slug}`);
  };

  const handleMouseMove = (
    event: React.MouseEvent<SVGCircleElement>,
    seat: Seat
  ) => {
    const svg = event.currentTarget.ownerSVGElement;
    if (!svg) return;

    const rect = svg.getBoundingClientRect();
    setTooltipPosition({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    });
    setHoveredSeat(seat);
  };

  return (
    <div className="relative w-full">
      <svg
        viewBox="0 0 1000 600"
        className="w-full h-auto"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Seats */}
        <g>
          {seats.map((seat, index) => (
            <circle
              key={`${seat.parlamentario.id}-${index}`}
              cx={seat.x}
              cy={seat.y}
              r={8}
              fill={seat.parlamentario.partido_color}
              stroke="white"
              strokeWidth={1}
              className="cursor-pointer transition-all duration-200 hover:r-10 hover:stroke-2"
              style={{
                filter: hoveredSeat === seat ? 'brightness(1.2)' : 'none',
              }}
              onClick={() => handleSeatClick(seat.parlamentario)}
              onMouseMove={(e) => handleMouseMove(e, seat)}
              onMouseLeave={() => setHoveredSeat(null)}
            />
          ))}
        </g>

        {/* Tooltip */}
        {hoveredSeat && (
          <g
            style={{
              pointerEvents: 'none',
            }}
          >
            <foreignObject
              x={tooltipPosition.x + 10}
              y={tooltipPosition.y - 40}
              width={250}
              height={80}
            >
              <div
                className="bg-gray-900 text-white px-3 py-2 rounded-lg shadow-lg text-sm"
                style={{ width: '250px' }}
              >
                <div className="font-semibold truncate">
                  {hoveredSeat.parlamentario.nombre_completo}
                </div>
                <div className="text-gray-300 text-xs">
                  {hoveredSeat.parlamentario.partido}
                </div>
                <div className="text-gray-400 text-xs">
                  {hoveredSeat.parlamentario.circunscripcion}
                </div>
              </div>
            </foreignObject>
          </g>
        )}
      </svg>
    </div>
  );
}

/**
 * Calculate seat positions in a semicircular parliament layout
 *
 * Arranges seats in concentric semicircular rows, grouped by party.
 * Inner rows have fewer seats, outer rows have more (realistic parliament layout).
 */
function calculateSeatPositions(parlamentarios: Parlamentario[]): Seat[] {
  const width = 1000;
  const height = 600;
  const centerX = width / 2;
  const centerY = height - 50;

  // Group by party to seat similar parties together
  const byParty = parlamentarios.reduce(
    (acc, p) => {
      if (!acc[p.partido]) {
        acc[p.partido] = [];
      }
      acc[p.partido].push(p);
      return acc;
    },
    {} as Record<string, Parlamentario[]>
  );

  const seats: Seat[] = [];

  // Number of rows (concentric arcs)
  const numRows = 8;
  const minRadius = 120;
  const maxRadius = 480;
  const radiusStep = (maxRadius - minRadius) / (numRows - 1);

  // Distribute parlamentarios across rows
  const totalSeats = parlamentarios.length;
  let seatsPlaced = 0;

  // Get partido groups in consistent order
  const partidoGroups = Object.entries(byParty).sort((a, b) =>
    a[0].localeCompare(b[0])
  );

  let currentPartidoIndex = 0;
  let currentPartidoSeats = partidoGroups[0][1];
  let seatInPartido = 0;

  for (let row = 0; row < numRows; row++) {
    const radius = minRadius + row * radiusStep;

    // More seats in outer rows (realistic parliament)
    const seatsInRow = Math.min(
      Math.floor(12 + row * 8),
      totalSeats - seatsPlaced
    );

    if (seatsInRow <= 0) break;

    // Angle span: semicircle (π radians)
    const startAngle = Math.PI;
    const endAngle = 0;
    const angleStep = (startAngle - endAngle) / (seatsInRow - 1 || 1);

    for (let i = 0; i < seatsInRow; i++) {
      // Get next parlamentario from current party group
      if (seatInPartido >= currentPartidoSeats.length) {
        // Move to next party
        currentPartidoIndex++;
        if (currentPartidoIndex >= partidoGroups.length) {
          // Wrapped around, start from beginning
          currentPartidoIndex = 0;
        }
        currentPartidoSeats = partidoGroups[currentPartidoIndex][1];
        seatInPartido = 0;
      }

      const parlamentario = currentPartidoSeats[seatInPartido];
      seatInPartido++;

      const angle = startAngle - i * angleStep;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY - radius * Math.sin(angle);

      seats.push({
        parlamentario,
        x,
        y,
      });

      seatsPlaced++;
    }
  }

  return seats;
}
