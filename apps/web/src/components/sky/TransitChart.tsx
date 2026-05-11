"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShodashvargaChart, TransitPlanetDetail } from "@/types/astro";

interface TransitChartProps {
  natalData: ShodashvargaChart;
  transitDetails: TransitPlanetDetail[];
  title: string;
}

const PLANET_GLYPHS: Record<string, string> = {
  Sun: "Su",
  Moon: "Mo",
  Mars: "Ma",
  Mercury: "Me",
  Jupiter: "Ju",
  Venus: "Ve",
  Saturn: "Sa",
  Rahu: "Ra",
  Ketu: "Ke",
  Lagna: "As",
};

export default function TransitChart({ natalData, transitDetails, title }: TransitChartProps) {
  // 1. Determine Lagna Sign (1-12)
  const lagnaSign = Math.floor(natalData.Lagna / 30) + 1;

  // 2. Map houses to signs
  const houseSigns: number[] = [];
  for (let i = 0; i < 12; i++) {
    houseSigns[i] = ((lagnaSign + i - 1) % 12) + 1;
  }

  // 3. Map natal planets to houses
  const natalHousePlanets: string[][] = Array.from({ length: 12 }, () => []);
  Object.entries(natalData).forEach(([planet, longitude]) => {
    if (planet === "Lagna") return;
    const sign = Math.floor(longitude / 30) + 1;
    const houseIndex = (sign - lagnaSign + 12) % 12;
    natalHousePlanets[houseIndex].push(planet);
  });

  // 4. Map transit planets to houses
  const transitHousePlanets: string[][] = Array.from({ length: 12 }, () => []);
  transitDetails.forEach((p) => {
    // Backend already gives us the house number (1-indexed)
    transitHousePlanets[p.house - 1].push(p.name);
  });

  const housePoints = [
    { x: 50, y: 25 },  // House 1
    { x: 25, y: 12 },  // House 2
    { x: 12, y: 25 },  // House 3
    { x: 25, y: 50 },  // House 4
    { x: 12, y: 75 },  // House 5
    { x: 25, y: 88 },  // House 6
    { x: 50, y: 75 },  // House 7
    { x: 75, y: 88 },  // House 8
    { x: 88, y: 75 },  // House 9
    { x: 75, y: 50 },  // House 10
    { x: 88, y: 25 },  // House 11
    { x: 75, y: 12 },  // House 12
  ];

  const signLabelPoints = [
    { x: 50, y: 42 },
    { x: 30, y: 22 },
    { x: 22, y: 30 },
    { x: 42, y: 50 },
    { x: 22, y: 70 },
    { x: 30, y: 78 },
    { x: 50, y: 58 },
    { x: 70, y: 78 },
    { x: 78, y: 70 },
    { x: 58, y: 50 },
    { x: 78, y: 30 },
    { x: 70, y: 22 },
  ];

  return (
    <div className="flex flex-col items-center space-y-4">
      <h3 className="text-[10px] uppercase tracking-[0.3em] text-gold font-medium">
        {title}
      </h3>
      <div className="relative w-full max-w-[400px] aspect-square">
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full drop-shadow-[0_0_15px_rgba(201,168,76,0.1)]"
        >
          {/* Background */}
          <rect
            x="2" y="2" width="96" height="96"
            className="fill-black/60 stroke-gold/20 stroke-[0.5]"
            rx="4"
          />

          {/* Grid Lines */}
          <g className="stroke-gold/10 stroke-[0.3]">
            <line x1="2" y1="2" x2="98" y2="98" />
            <line x1="98" y1="2" x2="2" y2="98" />
            <line x1="50" y1="2" x2="2" y2="50" />
            <line x1="2" y1="50" x2="50" y2="98" />
            <line x1="50" y1="98" x2="98" y2="50" />
            <line x1="98" y1="50" x2="50" y2="2" />
          </g>

          {/* Sign Numbers */}
          {houseSigns.map((sign, i) => (
            <text
              key={`sign-${i}`}
              x={signLabelPoints[i].x}
              y={signLabelPoints[i].y}
              className="fill-gold/30 text-[4px] font-light select-none"
              textAnchor="middle"
              dominantBaseline="middle"
            >
              {sign}
            </text>
          ))}

          {/* Natal Planets (White/Gray) */}
          {natalHousePlanets.map((planets, i) => (
            <g key={`natal-house-${i}`}>
              {planets.map((planet, pi) => {
                const row = Math.floor(pi / 3);
                const col = pi % 3;
                const offsetX = (col - 1) * 8;
                const offsetY = (row - 1) * 6 - 4; // Top part of house

                return (
                  <text
                    key={`natal-${planet}-${i}`}
                    x={housePoints[i].x + offsetX}
                    y={housePoints[i].y + offsetY}
                    className="fill-white/40 text-[3.5px] font-medium select-none"
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    {PLANET_GLYPHS[planet]}
                  </text>
                );
              })}
            </g>
          ))}

          {/* Transit Planets (Gold) */}
          {transitHousePlanets.map((planets, i) => (
            <g key={`transit-house-${i}`}>
              {planets.map((planet, pi) => {
                const row = Math.floor(pi / 3);
                const col = pi % 3;
                const offsetX = (col - 1) * 8;
                const offsetY = (row - 1) * 6 + 4; // Bottom part of house

                return (
                  <motion.text
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 10, delay: 0.1 * pi }}
                    key={`transit-${planet}-${i}`}
                    x={housePoints[i].x + offsetX}
                    y={housePoints[i].y + offsetY}
                    className="fill-gold text-[5px] font-bold select-none drop-shadow-[0_0_2px_rgba(201,168,76,0.5)]"
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    {PLANET_GLYPHS[planet]}
                  </motion.text>
                );
              })}
            </g>
          ))}
        </svg>
        
        {/* Legend */}
        <div className="absolute bottom-[-20px] left-0 right-0 flex justify-center space-x-4 text-[8px] uppercase tracking-wider text-white/40">
          <div className="flex items-center">
            <span className="w-1.5 h-1.5 bg-white/40 rounded-full mr-1"></span>
            Natal
          </div>
          <div className="flex items-center">
            <span className="w-1.5 h-1.5 bg-gold rounded-full mr-1"></span>
            Transit
          </div>
        </div>
      </div>
    </div>
  );
}
