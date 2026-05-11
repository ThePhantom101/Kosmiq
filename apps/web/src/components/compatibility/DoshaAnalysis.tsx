"use client";

import React from "react";
import { DoshaAnalysisItem } from "@/types/astro";
import { ShieldAlert, ShieldCheck, Info } from "lucide-react";

interface DoshaAnalysisProps {
  doshas: DoshaAnalysisItem[];
}

export function DoshaAnalysis({ doshas }: DoshaAnalysisProps) {
  return (
    <div className="space-y-8">
      <div className="border-b border-gold/10 pb-6">
        <span className="overline-label">Dosha Analysis</span>
        <h3 className="text-3xl font-serif text-white uppercase tracking-tight mt-2">Karmic Barriers</h3>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {doshas.map((d) => {
          const isWarning = d.status === "Present";
          const isSafe = d.status === "Absent" || d.status === "Cancelled";
          
          return (
            <div 
              key={d.name}
              className={`p-6 hud-module flex flex-col justify-between transition-all group hover:border-gold/30 ${
                isWarning ? "border-red-900/30 bg-red-950/5 shadow-[inset_0_0_20px_rgba(239,68,68,0.05)]" : "border-gold/10"
              }`}
            >
              <div className="flex items-start justify-between mb-6">
                <div className="space-y-1">
                  <h4 className="font-serif text-xl text-white group-hover:text-gold transition-colors uppercase tracking-tight">
                    {d.name}
                  </h4>
                  <p className="text-[9px] text-gray-600 uppercase tracking-[0.2em] font-black">
                    Domain: {d.affects}
                  </p>
                </div>
                {isSafe ? (
                  <ShieldCheck className="w-6 h-6 text-emerald-500/50 group-hover:text-emerald-500 transition-colors" />
                ) : (
                  <ShieldAlert className="w-6 h-6 text-red-500/50 group-hover:text-red-500 transition-colors" />
                )}
              </div>

              <div className="space-y-4">
                <div className={`inline-flex px-2 py-0.5 rounded-sm text-[9px] font-black uppercase tracking-widest ${
                  isWarning ? "bg-red-500/10 text-red-400 border border-red-500/20" : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                }`}>
                  {d.status}
                </div>
                <div className="flex gap-3 text-[11px] text-gray-500 leading-relaxed italic border-t border-gold/5 pt-4">
                  <Info className="w-3.5 h-3.5 mt-0.5 shrink-0 text-gray-700" />
                  <span>{d.reason}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
