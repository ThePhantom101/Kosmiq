"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { AlertCircle, RefreshCcw, Moon, Sparkles, ShieldAlert, Zap, Compass, Ghost } from "lucide-react";
import { useAstro } from "@/context/AstroContext";
import { IntelligenceCard } from "@/components/dashboard/IntelligenceCard";
import type { LucideIcon } from "lucide-react";

interface ShadowPlanet {
  name: string;
  sanskrit: string;
  house: number;
  sign: string;
  description: string;
  type: "Amplifying" | "Spiritualizing" | "Challenging" | "Protective";
}

const typeMap: Record<ShadowPlanet["type"], { status: "Transition" | "Opportunity" | "Caution" | "Neutral", icon: LucideIcon }> = {
  Amplifying: { status: "Transition", icon: Zap },
  Spiritualizing: { status: "Opportunity", icon: Sparkles },
  Challenging: { status: "Caution", icon: ShieldAlert },
  Protective: { status: "Neutral", icon: Compass },
};

export default function ShadowsPage() {
  const { id } = useParams<{ id: string }>();
  const { data: astroData } = useAstro();
  const [shadows, setShadows] = useState<ShadowPlanet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchShadows = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const url = `/api/chart/${id}/shadows`;
      const options: RequestInit = id === "me" ? {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chart_data: astroData?.chart }),
      } : {
        method: "GET",
      };

      const response = await fetch(url, options);
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();
      setShadows(data.shadows);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [id, astroData]);

  useEffect(() => {
    fetchShadows();
  }, [fetchShadows]);

  return (
    <div className="max-w-6xl mx-auto space-y-16 pb-32 pt-8 px-4 sm:px-8">
      {/* HEADER: VEILED INTELLIGENCE */}
      <section className="relative flex flex-col md:flex-row items-center gap-12 pb-12 border-b border-white/5">
        <div className="relative w-32 h-32 shrink-0">
           <div className="absolute inset-0 bg-gold/10 blur-3xl rounded-full" />
           <div className="absolute inset-0 flex items-center justify-center border border-gold/20 rounded-full">
              <Ghost className="w-12 h-12 text-gold/40" />
           </div>
           {/* Decorative Outer Ring */}
           <motion.div 
             animate={{ rotate: 360 }}
             transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
             className="absolute inset-[-10px] border border-dashed border-white/10 rounded-full"
           />
        </div>

        <div className="flex-1 space-y-4 text-center md:text-left">
           <div className="flex items-center justify-center md:justify-start gap-3">
              <span className="overline-label text-gold/60 tracking-[0.4em]">Upagraha Transmission</span>
              <div className="h-[1px] w-12 bg-gold/20" />
           </div>
           <h1 className="text-5xl md:text-7xl font-serif text-white tracking-tighter uppercase leading-none">
             Shadow <span className="text-gold">Planets</span>
           </h1>
           <p className="text-zinc-500 max-w-xl text-xs font-bold leading-relaxed uppercase tracking-[0.2em] opacity-80">
             The mathematical sensitive points (sub-planets) that govern hidden karmic currents and protective biological signatures.
           </p>
        </div>
      </section>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="h-64 bg-white/[0.02] border border-white/5 rounded-sm animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <div className="h-[50vh] flex flex-col items-center justify-center text-center space-y-8">
          <div className="relative">
             <AlertCircle className="w-16 h-16 text-red-500/20" />
             <div className="absolute inset-0 blur-xl bg-red-500/10" />
          </div>
          <div className="space-y-3">
            <h2 className="text-2xl font-serif uppercase tracking-tight text-white">Interface Desync</h2>
            <p className="text-xs text-zinc-600 uppercase font-black tracking-widest leading-loose max-w-xs mx-auto">
              The shadow realms are currently veiled from our sensors. Verify connectivity and re-initiate transmission.
            </p>
          </div>
          <button
            onClick={fetchShadows}
            className="hud-button px-10 py-4 bg-gold/10 border border-gold/20 text-gold text-[10px] font-black uppercase tracking-[0.3em] hover:bg-gold/20 transition-all flex items-center gap-3"
          >
            <RefreshCcw className="w-4 h-4" />
            Reconnect Interface
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {shadows.map((shadow, index) => {
            const { status, icon: Icon } = typeMap[shadow.type] || { status: "Neutral", icon: Moon };
            
            return (
              <motion.div
                key={shadow.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <IntelligenceCard
                  title={shadow.name}
                  subtitle={shadow.sanskrit}
                  status={status}
                  icon={Icon}
                >
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                       <div className="flex items-baseline gap-1">
                          <span className="text-3xl font-serif text-white">{shadow.house}</span>
                          <span className="text-[10px] text-zinc-600 font-black uppercase tracking-tighter">House</span>
                       </div>
                       <div className="text-right">
                          <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{shadow.sign}</div>
                          <div className="text-[8px] text-zinc-700 font-black uppercase tracking-tighter">Zodiac Signature</div>
                       </div>
                    </div>

                    <div className="h-[1px] w-full bg-white/5" />

                    <p className="text-xs text-zinc-400 leading-relaxed min-h-[4em] italic group-hover:text-zinc-300 transition-colors">
                      {shadow.description}
                    </p>

                    <div className={`mt-4 px-3 py-1 text-[8px] font-black uppercase tracking-widest rounded-full border inline-block ${
                      shadow.type === 'Amplifying' ? 'border-gold/30 bg-gold/5 text-gold' :
                      shadow.type === 'Challenging' ? 'border-red-900/30 bg-red-950/10 text-red-500' :
                      shadow.type === 'Spiritualizing' ? 'border-zinc-800 bg-zinc-900 text-zinc-400' :
                      'border-white/5 bg-white/[0.02] text-zinc-600'
                    }`}>
                      {shadow.type} Dynamics
                    </div>
                  </div>
                </IntelligenceCard>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
