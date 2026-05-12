"use client";

import React from "react";
import { DoshaAnalysisItem } from "@/types/astro";
import { ShieldAlert, ShieldCheck, Info } from "lucide-react";

interface DoshaAnalysisProps {
  doshas: DoshaAnalysisItem[];
}

import { IntelligenceCard } from "@/components/dashboard/IntelligenceCard";

export function DoshaAnalysis({ doshas }: DoshaAnalysisProps) {
  return (
    <div className="space-y-12">
      <div className="flex items-center gap-4 border-b border-white/5 pb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
             <ShieldAlert className="w-4 h-4 text-gold/60" />
             <span className="overline-label text-gold/60">Karmic Assessment</span>
          </div>
          <h3 className="text-4xl font-serif text-white uppercase tracking-tight">Karmic Obstacles</h3>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {doshas.map((d) => {
          const isWarning = d.status === "Present";
          const isSafe = d.status === "Absent" || d.status === "Cancelled";
          
          return (
            <IntelligenceCard
              key={d.name}
              title={d.name}
              subtitle={`Impacts: ${d.affects}`}
              status={isWarning ? "Caution" : isSafe ? "Opportunity" : "Neutral"}
              icon={isWarning ? ShieldAlert : ShieldCheck}
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                   <div className={`px-3 py-1 rounded-sm text-[9px] font-black uppercase tracking-widest border ${
                     isWarning ? "border-red-900/30 bg-red-950/10 text-red-500" : 
                     d.status === 'Cancelled' ? "border-gold/30 bg-gold/5 text-gold" :
                     "border-zinc-800 bg-zinc-900 text-zinc-500"
                   }`}>
                     {d.status} Status
                   </div>
                   <div className="text-[10px] text-zinc-600 font-mono uppercase tracking-tighter">Diagnostic Ref: {d.name.slice(0, 3)}</div>
                </div>

                <div className="flex gap-4 p-4 bg-white/[0.02] border border-white/5 rounded-sm">
                   <Info className="w-4 h-4 text-zinc-700 shrink-0 mt-0.5" />
                   <p className="text-xs text-zinc-400 leading-relaxed italic">
                     {d.reason}
                   </p>
                </div>
              </div>
            </IntelligenceCard>
          );
        })}
      </div>
    </div>
  );
}
