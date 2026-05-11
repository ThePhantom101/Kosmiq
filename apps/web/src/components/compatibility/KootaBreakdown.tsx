"use client";

import React from "react";
import { KootaScore } from "@/types/astro";

interface KootaBreakdownProps {
  scores: KootaScore[];
}

export function KootaBreakdown({ scores }: KootaBreakdownProps) {
  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between border-b border-gold/10 pb-6">
        <div>
          <span className="overline-label">Ashta Koota</span>
          <h3 className="text-3xl font-serif text-white uppercase tracking-tight mt-2">The Eight Pillars</h3>
        </div>
        <div className="text-2xl text-gold font-serif">
          {scores.reduce((acc, s) => acc + s.score, 0)}<span className="text-gray-700 text-sm"> / 36</span>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-hidden hud-module">
        <table className="w-full text-left">
          <thead className="bg-white/5 text-gray-500 text-[9px] uppercase tracking-[0.2em] font-black">
            <tr>
              <th className="px-8 py-5">Category (Sanskrit)</th>
              <th className="px-8 py-5">Alignment</th>
              <th className="px-8 py-5 text-right">Points</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gold/10">
            {scores.map((s) => (
              <tr key={s.category} className="hover:bg-gold/5 transition-all group">
                <td className="px-8 py-6">
                  <div className="text-white font-serif text-lg tracking-tight group-hover:text-gold transition-colors">{s.category}</div>
                  <div className="text-[10px] text-gold/40 uppercase tracking-widest font-mono">{s.sanskrit}</div>
                </td>
                <td className="px-8 py-6">
                  <div className="space-y-2 max-w-[300px]">
                    <div className="h-1.5 w-full bg-black/50 border border-gold/10 overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-1000 ${s.score === 0 ? "bg-red-900/50" : "bg-gold shadow-[0_0_10px_rgba(197,160,89,0.3)]"}`}
                        style={{ width: `${(s.score / s.max) * 100}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-gray-600 italic line-clamp-1 group-hover:line-clamp-none transition-all">
                      {s.explanation}
                    </p>
                  </div>
                </td>
                <td className="px-8 py-6 text-right font-serif text-xl text-gray-400">
                  <span className="text-white">{s.score}</span>
                  <span className="text-gray-700 text-xs ml-1">/ {s.max}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List */}
      <div className="md:hidden space-y-6">
        {scores.map((s) => (
          <div key={s.category} className="p-6 hud-module space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-white font-serif text-xl">{s.category}</div>
                <div className="text-[10px] text-gold/60 uppercase tracking-widest font-mono">{s.sanskrit}</div>
              </div>
              <div className="font-serif text-2xl text-white">
                {s.score}<span className="text-gray-700 text-xs ml-1">/{s.max}</span>
              </div>
            </div>
            <div className="h-1.5 w-full bg-black border border-gold/10 overflow-hidden">
              <div 
                className={`h-full ${s.score === 0 ? "bg-red-900/50" : "bg-gold"}`}
                style={{ width: `${(s.score / s.max) * 100}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 leading-relaxed italic">
              {s.explanation}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
