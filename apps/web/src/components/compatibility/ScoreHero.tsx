"use client";

import React from "react";
import { motion } from "framer-motion";

interface ScoreHeroProps {
  score: number;
  names: [string, string];
}

export function ScoreHero({ score, names }: ScoreHeroProps) {
  const percentage = (score / 36) * 100;
  
  const getMatchLabel = (s: number) => {
    if (s >= 30) return { label: "Divine Union", color: "text-gold", sub: "Exceptional harmony and spiritual alignment." };
    if (s >= 25) return { label: "Excellent Match", color: "text-gold/80", sub: "Strong foundation for a lasting bond." };
    if (s >= 18) return { label: "Fair Compatibility", color: "text-gray-300", sub: "Balanced dynamics with minor adjustments." };
    return { label: "Challenging Match", color: "text-gray-600", sub: "Requires conscious effort and understanding." };
  };

  const { label, color, sub } = getMatchLabel(score);

  return (
    <div className="flex flex-col items-center justify-center space-y-8 text-center">
      {/* Progress Circle */}
      <div className="relative w-64 h-64 flex items-center justify-center">
        {/* Glow Background */}
        <div className="absolute inset-0 bg-gold/5 rounded-full blur-3xl" />
        
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="128"
            cy="128"
            r="110"
            stroke="rgba(197, 160, 89, 0.1)"
            strokeWidth="8"
            fill="transparent"
          />
          <motion.circle
            cx="128"
            cy="128"
            r="110"
            stroke="var(--gold)"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={2 * Math.PI * 110}
            initial={{ strokeDashoffset: 2 * Math.PI * 110 }}
            animate={{ strokeDashoffset: 2 * Math.PI * 110 * (1 - percentage / 100) }}
            transition={{ duration: 2, ease: "easeOut" }}
            strokeLinecap="square"
            style={{ filter: "drop-shadow(0 0 12px rgba(197, 160, 89, 0.4))" }}
          />
        </svg>
        
        <div className="absolute flex flex-col items-center">
          <motion.span 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-8xl font-serif text-white tracking-tighter"
          >
            {score}
          </motion.span>
          <span className="text-[10px] text-gray-500 font-black uppercase tracking-[0.3em] mt-2">OF 36 GUNAS</span>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="space-y-4"
      >
        <div className="flex items-center justify-center gap-4 text-gray-600 font-bold tracking-[0.2em] uppercase text-[9px]">
          <span>{names[0]}</span>
          <div className="w-1 h-1 rounded-full bg-gold/30" />
          <span>{names[1]}</span>
        </div>
        <h2 className={`text-6xl font-serif tracking-tight uppercase ${color}`}>
          {label}
        </h2>
        <p className="text-gray-500 max-w-sm mx-auto text-sm tracking-wide leading-relaxed">
          {sub}
        </p>
      </motion.div>
    </div>
  );
}
