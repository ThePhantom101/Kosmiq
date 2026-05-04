"use client";

import React from "react";
import { motion } from "framer-motion";

import { ShodashvargaChart } from "../../types/astro";

interface NorthIndianChartProps {
  data: ShodashvargaChart;
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

export default function NorthIndianChart({ data, title }: NorthIndianChartProps) {
  // 1. Determine Lagna Sign (1-12)
  const lagnaSign = Math.floor(data.Lagna / 30) + 1;

  // 2. Map houses to signs
  // House 1 is always the top central diamond.
  // signs[house_index] = sign_number
  const houseSigns: number[] = [];
  for (let i = 0; i < 12; i++) {
    houseSigns[i] = ((lagnaSign + i - 1) % 12) + 1;
  }

  // 3. Map planets to houses
  const housePlanets: string[][] = Array.from({ length: 12 }, () => []);
  Object.entries(data).forEach(([planet, longitude]) => {
    if (planet === "Lagna") return;
    const sign = Math.floor(longitude / 30) + 1;
    // Find which house this sign belongs to
    const houseIndex = (sign - lagnaSign + 12) % 12;
    housePlanets[houseIndex].push(planet);
  });

  // House coordinates for labels and planets
  // 0-indexed house indices
  const housePoints = [
    { x: 50, y: 25 },  // House 1 (Top Diamond)
    { x: 25, y: 12 },  // House 2 (Top Left Tri)
    { x: 12, y: 25 },  // House 3 (Left Top Tri)
    { x: 25, y: 50 },  // House 4 (Left Diamond)
    { x: 12, y: 75 },  // House 5 (Left Bottom Tri)
    { x: 25, y: 88 },  // House 6 (Bottom Left Tri)
    { x: 50, y: 75 },  // House 7 (Bottom Diamond)
    { x: 75, y: 88 },  // House 8 (Bottom Right Tri)
    { x: 88, y: 75 },  // House 9 (Right Bottom Tri)
    { x: 75, y: 50 },  // House 10 (Right Diamond)
    { x: 88, y: 25 },  // House 11 (Right Top Tri)
    { x: 75, y: 12 },  // House 12 (Top Right Tri)
  ];

  const signLabelPoints = [
    { x: 50, y: 42 },  // 1
    { x: 30, y: 22 },  // 2
    { x: 22, y: 30 },  // 3
    { x: 42, y: 50 },  // 4
    { x: 22, y: 70 },  // 5
    { x: 30, y: 78 },  // 6
    { x: 50, y: 58 },  // 7
    { x: 70, y: 78 },  // 8
    { x: 78, y: 70 },  // 9
    { x: 58, y: 50 },  // 10
    { x: 78, y: 30 },  // 11
    { x: 70, y: 22 },  // 12
  ];

  return (
    <div className="flex flex-col items-center space-y-4">
      <h3 className="text-xs uppercase tracking-[0.3em] text-purple-400 font-medium">
        {title}
      </h3>
      <div className="relative w-full max-w-[400px] aspect-square">
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full drop-shadow-[0_0_15px_rgba(168,85,247,0.2)]"
        >
          {/* Background */}
          <rect
            x="2" y="2" width="96" height="96"
            className="fill-black/40 stroke-white/10 stroke-[0.5]"
            rx="4"
          />

          {/* Grid Lines */}
          <g className="stroke-white/20 stroke-[0.3]">
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
              className="fill-white/30 text-[4px] font-light select-none"
              textAnchor="middle"
              dominantBaseline="middle"
            >
              {sign}
            </text>
          ))}

          {/* Planets */}
          {housePlanets.map((planets, i) => (
            <g key={`house-planets-${i}`}>
              {planets.map((planet, pi) => {
                // Arrange multiple planets in a grid within the house
                const row = Math.floor(pi / 3);
                const col = pi % 3;
                const offsetX = (col - (Math.min(planets.length, 3) - 1) / 2) * 8;
                const offsetY = (row - (Math.ceil(planets.length / 3) - 1) / 2) * 6;

                return (
                  <motion.text
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + (i * 0.05) + (pi * 0.02) }}
                    key={`${planet}-${i}`}
                    x={housePoints[i].x + offsetX}
                    y={housePoints[i].y + offsetY}
                    className={`text-[5px] font-bold select-none ${
                      planet === "Moon" ? "fill-blue-300" : 
                      planet === "Sun" ? "fill-yellow-400" :
                      ["Rahu", "Ketu"].includes(planet) ? "fill-purple-400" : "fill-white"
                    }`}
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
      </div>
    </div>
  );
}
