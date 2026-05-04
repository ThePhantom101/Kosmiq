"use client";

import React from "react";
import { motion } from "framer-motion";
import { Zap, Sparkles } from "lucide-react";

interface ResonanceMeterProps {
  score: number;
  strengths: Record<string, number>;
}

export default function ResonanceMeter({ score, strengths }: ResonanceMeterProps) {
  // Radar Chart Data points (Planet Strengths)
  const planets = Object.keys(strengths);
  const angleStep = (Math.PI * 2) / planets.length;
  
  const points = planets.map((name, i) => {
    const r = (strengths[name] / 100) * 40; // Scale strength to 40% of size
    const x = 50 + r * Math.cos(i * angleStep - Math.PI / 2);
    const y = 50 + r * Math.sin(i * angleStep - Math.PI / 2);
    return `${x},${y}`;
  }).join(" ");

  const gridLevels = [20, 30, 40];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center h-full">
      {/* Circular Progress (Gen-Z Health Bar style) */}
      <div className="relative flex flex-col items-center justify-center p-8 border border-gold/10 bg-gold/5 rounded-sm overflow-hidden group">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(197,160,89,0.05)_0,transparent_70%)]" />
        
        <div className="relative w-48 h-48">
          <svg className="w-full h-full transform -rotate-90">
            {/* Background Circle */}
            <circle
              cx="50%"
              cy="50%"
              r="45%"
              className="stroke-gold/5 fill-none stroke-[8px]"
            />
            {/* Progress Circle */}
            <motion.circle
              cx="50%"
              cy="50%"
              r="45%"
              className="stroke-gold fill-none stroke-[8px] drop-shadow-[0_0_8px_rgba(197,160,89,0.5)]"
              strokeDasharray="283"
              initial={{ strokeDashoffset: 283 }}
              animate={{ strokeDashoffset: 283 - (283 * score) / 100 }}
              transition={{ duration: 2, ease: "easeOut" }}
              strokeLinecap="round"
            />
          </svg>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center space-y-1">
            <motion.span 
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-5xl font-serif text-white tracking-tighter"
            >
              {score}
            </motion.span>
            <span className="text-[10px] uppercase tracking-[0.3em] text-gold/60 font-bold">Resonance</span>
          </div>
        </div>

        <div className="mt-8 flex items-center space-x-3">
          <Zap className="w-4 h-4 text-gold animate-pulse" />
          <p className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">
            COSMIC FREQUENCY: <span className="text-white">OPTIMIZED</span>
          </p>
        </div>
      </div>

      {/* Radar Chart (Technical Laboratory style) */}
      <div className="relative flex flex-col items-center justify-center p-8 border border-gold/10 bg-gold/5 rounded-sm overflow-hidden group">
        <div className="absolute top-4 right-4">
          <Sparkles className="w-4 h-4 text-gold/40" />
        </div>

        <div className="w-64 h-64 relative">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {/* Grid Levels */}
            {gridLevels.map((r, i) => (
              <circle
                key={i}
                cx="50"
                cy="50"
                r={r}
                className="fill-none stroke-gold/10 stroke-[0.5]"
              />
            ))}
            
            {/* Axis Lines */}
            {planets.map((_, i) => (
              <line
                key={i}
                x1="50"
                y1="50"
                x2={50 + 45 * Math.cos(i * angleStep - Math.PI / 2)}
                y2={50 + 45 * Math.sin(i * angleStep - Math.PI / 2)}
                className="stroke-gold/5 stroke-[0.5]"
              />
            ))}

            {/* Radar Shape */}
            <motion.polygon
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 0.4, scale: 1 }}
              points={points}
              className="fill-gold stroke-gold stroke-[1] drop-shadow-[0_0_10px_rgba(197,160,89,0.3)]"
            />

            {/* Labels */}
            {planets.map((name, i) => {
              const x = 50 + 48 * Math.cos(i * angleStep - Math.PI / 2);
              const y = 50 + 48 * Math.sin(i * angleStep - Math.PI / 2);
              return (
                <text
                  key={i}
                  x={x}
                  y={y}
                  className="fill-gold/40 text-[3px] font-bold uppercase tracking-widest"
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  {name.substring(0, 2)}
                </text>
              );
            })}
          </svg>
        </div>

        <div className="mt-4">
          <h3 className="text-[10px] uppercase tracking-[0.2em] text-gold/60 font-bold">Planetary Alignment HUD</h3>
        </div>
      </div>
    </div>
  );
}
