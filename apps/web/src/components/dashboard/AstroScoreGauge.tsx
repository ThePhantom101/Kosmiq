"use client";

import React from "react";
import { motion } from "framer-motion";

interface AstroScoreGaugeProps {
  score: number; // 0 to 100
  label?: string;
  size?: number;
}

export function AstroScoreGauge({ score, label = "AstroScore", size = 200 }: AstroScoreGaugeProps) {
  // SVG Constants
  const radius = 40;
  const circumference = Math.PI * radius; // Half circle
  const strokeWidth = 8;
  const normalizedScore = Math.min(Math.max(score, 0), 100);
  const offset = circumference - (normalizedScore / 100) * circumference;

  return (
    <div 
      className="relative flex flex-col items-center justify-center select-none group"
      style={{ width: size, height: size / 1.5 }}
    >
      <svg
        viewBox="0 0 100 60"
        className="w-full h-full transform transition-transform duration-500 group-hover:scale-105"
      >
        <defs>
          <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ef4444" /> {/* Red */}
            <stop offset="50%" stopColor="#f59e0b" /> {/* Orange */}
            <stop offset="100%" stopColor="#c5a059" /> {/* Gold */}
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background Track */}
        <path
          d="M 10,50 A 40,40 0 0 1 90,50"
          fill="none"
          stroke="#1a1a1a"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

        {/* Decorative Inner Track */}
        <path
          d="M 15,50 A 35,35 0 0 1 85,50"
          fill="none"
          stroke="rgba(197, 160, 89, 0.05)"
          strokeWidth={1}
          strokeDasharray="2,2"
        />

        {/* Progress Path */}
        <motion.path
          d="M 10,50 A 40,40 0 0 1 90,50"
          fill="none"
          stroke="url(#gaugeGradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 2, ease: "easeOut" }}
          style={{ filter: "url(#glow)" }}
        />

        {/* Tick Marks */}
        {[0, 25, 50, 75, 100].map((tick) => {
          const angle = 180 + (tick / 100) * 180;
          const x = 50 + 45 * Math.cos((angle * Math.PI) / 180);
          const y = 50 + 45 * Math.sin((angle * Math.PI) / 180);
          return (
            <circle
              key={tick}
              cx={x}
              cy={y}
              r={0.5}
              fill="rgba(197, 160, 89, 0.3)"
            />
          );
        })}
      </svg>

      {/* Score Text Overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-end pb-2">
        <motion.span 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-4xl font-serif text-white tracking-tighter"
        >
          {Math.round(score)}
          <span className="text-xs text-gold/60 ml-0.5">%</span>
        </motion.span>
        <span className="text-[9px] uppercase tracking-[0.3em] text-gold/40 font-black">
          {label}
        </span>
      </div>
    </div>
  );
}
