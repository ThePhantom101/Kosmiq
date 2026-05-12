"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Sparkles, 
  ArrowUpRight, 
  Zap, 
  Plus, 
  TrendingUp, 
  AlertTriangle, 
  RefreshCw,
  Clock,
  Navigation
} from "lucide-react";
import { useSession } from "@/hooks/useSession";
import { useAstro } from "@/context/AstroContext";
import Link from "next/link";
import { AstroScoreGauge } from "@/components/dashboard/AstroScoreGauge";
import { IntelligenceCard } from "@/components/dashboard/IntelligenceCard";

export default function DashboardPage() {
  const { isAuthenticated } = useSession();
  const { data: astroData, isLoading, refresh } = useAstro();

  const astroScore = astroData?.chart?.astro_score ?? 0;

  return (
    <div className="space-y-10 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <span className="overline-label text-gold/60">Cosmic Intelligence</span>
            <div className="h-[1px] w-8 bg-gold/20" />
            {isLoading && (
              <RefreshCw className="w-3 h-3 text-gold/40 animate-spin" />
            )}
          </div>
          <h1 className="text-4xl font-serif text-white tracking-tight uppercase">
            Your <span className="text-gold">Sanctuary</span>
          </h1>
          <p className="text-zinc-500 max-w-xl text-xs font-medium leading-relaxed">
            Real-time planetary synthesis and karmic trajectory monitoring.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => refresh()}
            className="p-3 border border-gold/10 rounded-sm hover:bg-gold/5 transition-colors group"
          >
            <RefreshCw className="w-4 h-4 text-gold/40 group-hover:text-gold transition-colors" />
          </button>
          {!isAuthenticated && (
            <Link
              href="/login?next=/dashboard"
              className="flex items-center gap-2 px-6 py-3 bg-gold text-black font-bold rounded-sm uppercase tracking-widest text-[10px] hover:bg-gold/90 transition-all shadow-[0_0_30px_rgba(197,160,89,0.2)] shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Save to Chronicles</span>
            </Link>
          )}
        </div>
      </div>

      {/* Main Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-min">
        
        {/* AstroScore Section */}
        <div className="md:col-span-4 hud-module p-8 flex flex-col items-center justify-center border-gold/20 bg-gold/[0.02]">
          <AstroScoreGauge score={astroScore} label="Overall Resonance" />
          <div className="mt-4 text-center">
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">
              Current Vibe
            </p>
            <p className="text-sm text-white font-serif italic mt-1">
              {astroScore > 70 ? "High Harmonic Alignment" : astroScore > 40 ? "Moderate Stability" : "Strategic Caution Advised"}
            </p>
          </div>
        </div>

        {/* What's Happening Now */}
        <IntelligenceCard 
          title="What's Happening Now"
          subtitle="Transit Impact Analysis"
          status={astroScore > 60 ? "Opportunity" : "Transition"}
          icon={TrendingUp}
          className="md:col-span-8"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="p-3 bg-white/5 border border-white/10 rounded-sm">
                <p className="text-xs text-zinc-300 leading-relaxed">
                  {astroData?.reading?.substring(0, 180) || "Initialize your chart to see real-time transit analysis and personalized insights."}
                  ...
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-gold/40" />
                <span className="text-[10px] text-zinc-500 uppercase tracking-wider">
                  Peak Influence: Next 48 Hours
                </span>
              </div>
            </div>
            
            <div className="space-y-3">
              <p className="text-[9px] text-gold/60 uppercase font-black tracking-widest">Active Focus</p>
              <ul className="space-y-2">
                {[
                  "Career Expansion",
                  "Internal Calibration",
                  "Financial Strategy"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-gold rounded-full" />
                    <span className="text-xs text-zinc-400">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </IntelligenceCard>

        {/* Highlights / Alerts */}
        <IntelligenceCard
          title="Cosmic Highlights"
          subtitle="Key Influence Pointers"
          status="Caution"
          icon={AlertTriangle}
          className="md:col-span-5"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 border border-red-400/20 bg-red-400/5 rounded-sm">
              <div className="flex items-center gap-3">
                <Zap className="w-4 h-4 text-red-400" />
                <span className="text-xs text-zinc-300">Mars Square Saturn</span>
              </div>
              <span className="text-[10px] text-red-400 font-bold uppercase tracking-tighter">High Tension</span>
            </div>
            <div className="flex items-center justify-between p-3 border border-gold/20 bg-gold/5 rounded-sm">
              <div className="flex items-center gap-3">
                <Sparkles className="w-4 h-4 text-gold" />
                <span className="text-xs text-zinc-300">Jupiter Trine Lagna</span>
              </div>
              <span className="text-[10px] text-gold font-bold uppercase tracking-tighter">Abundance</span>
            </div>
          </div>
        </IntelligenceCard>

        {/* Action Center */}
        <div className="md:col-span-7 hud-module p-8 border border-gold/10 bg-gold/5 relative overflow-hidden group">
          <div className="absolute inset-0 bg-grid-white/[0.02]" />
          <div className="relative h-full flex flex-col justify-between space-y-6">
            <div className="space-y-2">
              <div className="inline-flex p-3 rounded-full bg-gold/10 border border-gold/20 group-hover:scale-110 transition-transform duration-500">
                <Navigation className="w-5 h-5 text-gold" />
              </div>
              <h2 className="text-2xl font-serif text-white">Soul Signature</h2>
              <p className="text-zinc-500 max-w-sm text-xs leading-relaxed">
                Refine your birth data or explore deeper divisional analysis.
              </p>
            </div>
            <div className="flex gap-4">
              <Link 
                href="/charts"
                className="px-6 py-3 bg-gold text-black font-bold rounded-sm uppercase tracking-widest text-[10px] hover:bg-gold/90 transition-all flex items-center space-x-2"
              >
                <span>New Calculation</span>
                <ArrowUpRight className="w-3 h-3" />
              </Link>
              <Link 
                href={`/chart/${astroData?.profile?.id || "me"}`}
                className="px-6 py-3 border border-gold/30 text-gold font-bold rounded-sm uppercase tracking-widest text-[10px] hover:bg-gold/10 transition-all"
              >
                Full Analysis
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
