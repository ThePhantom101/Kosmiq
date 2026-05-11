"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShodashvargaChart } from "@/types/astro";

interface NorthIndianChartProps {
  data: ShodashvargaChart;
  title: string;
  retrogradePlanets?: string[]; // New optional prop
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

export default function NorthIndianChart({ data, title, retrogradePlanets = [] }: NorthIndianChartProps) {
  // 1. Determine Lagna Sign (1-12)
  const lagnaSign = Math.floor(data.Lagna / 30) + 1;

  // 2. Map houses to signs
  const houseSigns: number[] = [];
  for (let i = 0; i < 12; i++) {
    houseSigns[i] = ((lagnaSign + i - 1) % 12) + 1;
  }

  // 3. Map planets to houses
  const housePlanets: string[][] = Array.from({ length: 12 }, () => []);
  Object.entries(data).forEach(([planet, longitude]) => {
    if (planet === "Lagna") return;
    const sign = Math.floor(longitude / 30) + 1;
    const houseIndex = (sign - lagnaSign + 12) % 12;
    housePlanets[houseIndex].push(planet);
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
    { x: 50, y: 40 },  // 1
    { x: 28, y: 20 },  // 2
    { x: 20, y: 28 },  // 3
    { x: 40, y: 50 },  // 4
    { x: 20, y: 72 },  // 5
    { x: 28, y: 80 },  // 6
    { x: 50, y: 60 },  // 7
    { x: 72, y: 80 },  // 8
    { x: 80, y: 72 },  // 9
    { x: 60, y: 50 },  // 10
    { x: 80, y: 28 },  // 11
    { x: 72, y: 20 },  // 12
  ];

  return (
    <div className="flex flex-col items-center space-y-4 w-full">
      {title && (
        <h3 className="font-mono text-[10px] uppercase tracking-[0.3em] text-gold/60 font-bold">
          {title}
        </h3>
      )}
      <div className="relative w-full max-w-[450px] aspect-square p-2 bg-black/40 border border-gold/10 shadow-[0_0_50px_rgba(197,160,89,0.05)]">
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full drop-shadow-[0_0_20px_rgba(197,160,89,0.1)]"
        >
          {/* Main Frame */}
          <rect
            x="2" y="2" width="96" height="96"
            className="fill-none stroke-gold/20 stroke-[0.5]"
          />

          {/* Diagonals and Sub-frames */}
          <g className="stroke-gold/15 stroke-[0.3]">
            <line x1="2" y1="2" x2="98" y2="98" />
            <line x1="98" y1="2" x2="2" y2="98" />
            <line x1="50" y1="2" x2="2" y2="50" />
            <line x1="2" y1="50" x2="50" y2="98" />
            <line x1="50" y1="98" x2="98" y2="50" />
            <line x1="98" y1="50" x2="50" y2="2" />
          </g>

          {/* Central Point */}
          <circle cx="50" cy="50" r="0.5" className="fill-gold/40" />

          {/* Sign Numbers */}
          {houseSigns.map((sign, i) => (
            <text
              key={`sign-${i}`}
              x={signLabelPoints[i].x}
              y={signLabelPoints[i].y}
              className="fill-gold/40 text-[4.5px] font-mono font-bold select-none"
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
                const isRetro = retrogradePlanets.includes(planet);
                const row = Math.floor(pi / 3);
                const col = pi % 3;
                const offsetX = (col - (Math.min(planets.length, 3) - 1) / 2) * 8;
                const offsetY = (row - (Math.ceil(planets.length / 3) - 1) / 2) * 6;

                return (
                  <motion.g
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 + (i * 0.05) + (pi * 0.02) }}
                    key={`${planet}-${i}`}
                  >
                    <text
                      x={housePoints[i].x + offsetX}
                      y={housePoints[i].y + offsetY}
                      className={`text-[5.5px] font-bold select-none tracking-tighter ${
                        planet === "Moon" ? "fill-blue-100" : 
                        planet === "Sun" ? "fill-amber-300" :
                        ["Rahu", "Ketu"].includes(planet) ? "fill-red-300" : "fill-white"
                      }`}
                      style={{ filter: "drop-shadow(0 0 2px rgba(0,0,0,0.5))" }}
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      {PLANET_GLYPHS[planet]}{isRetro ? "ᴿ" : ""}
                    </text>
                  </motion.g>
                );
              })}
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}

