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
    if (s >= 18) return { label: "Fair Compatibility", color: "text-zinc-400", sub: "Balanced dynamics with minor adjustments." };
    return { label: "Challenging Match", color: "text-zinc-600", sub: "Requires conscious effort and understanding." };
  };

  const { label, color, sub } = getMatchLabel(score);

  return (
    <div className="flex flex-col items-center justify-center space-y-12 text-center py-16">
      {/* HUD Score Visualization */}
      <div className="relative w-72 h-72 flex items-center justify-center">
        {/* Animated Outer Rings */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 rounded-full border border-gold/10 border-dashed"
        />
        <motion.div 
          animate={{ rotate: -360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="absolute inset-[-20px] rounded-full border border-white/5"
        />
        
        {/* Glow */}
        <div className="absolute inset-0 bg-gold/5 rounded-full blur-[80px]" />
        
        <svg className="w-full h-full transform -rotate-90 relative z-10">
          <circle
            cx="144"
            cy="144"
            r="130"
            stroke="rgba(197, 160, 89, 0.05)"
            strokeWidth="2"
            fill="transparent"
          />
          <motion.circle
            cx="144"
            cy="144"
            r="130"
            stroke="var(--gold)"
            strokeWidth="3"
            fill="transparent"
            strokeDasharray={2 * Math.PI * 130}
            initial={{ strokeDashoffset: 2 * Math.PI * 130 }}
            animate={{ strokeDashoffset: 2 * Math.PI * 130 * (1 - percentage / 100) }}
            transition={{ duration: 2.5, ease: "circOut" }}
            strokeLinecap="round"
            className="drop-shadow-[0_0_15px_rgba(197,160,89,0.5)]"
          />
        </svg>
        
        {/* Celestial Markers */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map(deg => (
          <div key={deg} className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ transform: `rotate(${deg}deg)` }}>
            <div className="w-full flex justify-between px-2">
               <div className="w-1.5 h-[1px] bg-gold/40" />
               <div className="w-1.5 h-[1px] bg-gold/40" />
            </div>
          </div>
        ))}

        <div className="absolute flex flex-col items-center z-20">
          <div className="flex items-baseline gap-1">
             <motion.span 
               initial={{ opacity: 0, scale: 0.5 }}
               animate={{ opacity: 1, scale: 1 }}
               className="text-9xl font-serif text-white tracking-tighter"
             >
               {score}
             </motion.span>
             <span className="text-2xl font-serif text-zinc-600">.0</span>
          </div>
          <span className="text-[9px] text-zinc-500 font-black uppercase tracking-[0.4em] mt-2">Guna Accumulation</span>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="space-y-6 max-w-xl"
      >
        <div className="flex items-center justify-center gap-6">
           <div className="h-[1px] w-12 bg-white/10" />
           <div className="flex items-center gap-3">
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{names[0]}</span>
              <div className="w-1.5 h-1.5 rotate-45 border border-gold/40" />
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{names[1]}</span>
           </div>
           <div className="h-[1px] w-12 bg-white/10" />
        </div>

        <div className="space-y-4">
           <h2 className={`text-6xl md:text-8xl font-serif tracking-tighter uppercase leading-none ${color}`}>
             {label}
           </h2>
           <p className="text-zinc-500 text-xs md:text-sm tracking-[0.1em] leading-relaxed font-medium">
             {sub}
           </p>
        </div>

        <div className="pt-8 flex justify-center gap-12">
           <div className="text-center">
              <div className="text-[10px] text-zinc-600 font-black uppercase tracking-widest mb-1">Pass Threshold</div>
              <div className="text-lg font-serif text-white">18.0</div>
           </div>
           <div className="w-[1px] h-10 bg-white/5" />
           <div className="text-center">
              <div className="text-[10px] text-zinc-600 font-black uppercase tracking-widest mb-1">Max Potential</div>
              <div className="text-lg font-serif text-white">36.0</div>
           </div>
        </div>
      </motion.div>
    </div>
  );
}
