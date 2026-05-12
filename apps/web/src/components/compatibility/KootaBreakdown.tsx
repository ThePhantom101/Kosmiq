"use client";

import React from "react";
import { motion } from "framer-motion";
import { KootaScore } from "@/types/astro";

interface KootaBreakdownProps {
  scores: KootaScore[];
}

export function KootaBreakdown({ scores }: KootaBreakdownProps) {
  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
             <div className="w-1.5 h-1.5 bg-gold" />
             <span className="overline-label text-gold/60">Ashta Koota Analysis</span>
          </div>
          <h3 className="text-4xl md:text-5xl font-serif text-white uppercase tracking-tight">The Eight Pillars</h3>
        </div>
        <div className="flex flex-col items-end">
           <div className="text-5xl font-serif text-gold">
             {scores.reduce((acc, s) => acc + s.score, 0)}<span className="text-zinc-700 text-lg ml-1">/ 36.0</span>
           </div>
           <span className="text-[9px] text-zinc-500 font-black uppercase tracking-[0.3em]">Aggregate Strength</span>
        </div>
      </div>

      {/* Modern HUD Table */}
      <div className="grid grid-cols-1 gap-4">
        {/* Header Row - Hidden on Mobile */}
        <div className="hidden md:grid grid-cols-12 px-8 py-3 bg-white/[0.02] border border-white/5 text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500 rounded-t-sm">
           <div className="col-span-4">Category / Sanskrit</div>
           <div className="col-span-5">Distribution & Alignment</div>
           <div className="col-span-3 text-right">Magnitude</div>
        </div>

        {/* Data Rows */}
        {scores.map((s, i) => (
          <div 
            key={s.category} 
            className="hud-module p-6 md:p-8 bg-black/20 border border-white/5 hover:border-gold/20 transition-all group overflow-hidden relative"
          >
            {/* Background Accent */}
            <div className="absolute top-0 right-0 p-4 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
               <span className="text-6xl font-serif text-white italic">{i + 1}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center relative z-10">
              <div className="col-span-4 space-y-1">
                <div className="text-xl md:text-2xl font-serif text-white group-hover:text-gold transition-colors">{s.category}</div>
                <div className="flex items-center gap-2">
                   <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest">{s.sanskrit}</span>
                   <div className="w-1 h-1 rounded-full bg-zinc-800" />
                   <span className="text-[9px] text-zinc-600 font-bold uppercase">Weight: {s.max}</span>
                </div>
              </div>

              <div className="col-span-5 space-y-3">
                <div className="flex items-center justify-between text-[10px] uppercase font-black tracking-widest">
                   <span className={s.score === 0 ? "text-red-500/60" : "text-zinc-500"}>
                     {s.score === 0 ? "Disharmony" : "Balanced Resonance"}
                   </span>
                   <span className="text-zinc-600">{Math.round((s.score / s.max) * 100)}%</span>
                </div>
                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(s.score / s.max) * 100}%` }}
                    transition={{ duration: 1, delay: i * 0.1 }}
                    className={`h-full ${s.score === 0 ? "bg-red-950" : "bg-gold shadow-[0_0_10px_rgba(197,160,89,0.3)]"}`}
                  />
                </div>
                <p className="text-xs text-zinc-500 leading-relaxed italic group-hover:text-zinc-400 transition-colors">
                  {s.explanation}
                </p>
              </div>

              <div className="col-span-3 text-right">
                <div className="flex flex-col items-end">
                   <div className="text-3xl font-serif text-white">
                      {s.score}<span className="text-zinc-700 text-sm"> / {s.max}</span>
                   </div>
                   <div className={`mt-1 px-2 py-0.5 text-[8px] font-black uppercase rounded-full border ${
                     s.status === 'Full' ? 'border-gold/30 bg-gold/5 text-gold' :
                     s.status === 'Partial' ? 'border-zinc-800 bg-zinc-900 text-zinc-500' :
                     'border-red-900/30 bg-red-950/10 text-red-500'
                   }`}>
                      {s.status} Fulfillment
                   </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
