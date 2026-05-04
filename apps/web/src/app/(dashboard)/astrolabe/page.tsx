"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAstro } from "@/context/AstroContext";
import NorthIndianChart from "@/components/NorthIndianChart";
import PlanetaryTable from "@/components/PlanetaryTable";
import ResonanceMeter from "@/components/ResonanceMeter";
import { Compass, Table as TableIcon, Activity, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function AstrolabePage() {
  const { data } = useAstro();
  const [activeVarga, setActiveVarga] = useState<"D1" | "D9" | "D10">("D1");

  if (!data) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center text-center space-y-6">
        <div className="p-6 rounded-full bg-gold/5 border border-gold/10">
          <Compass className="w-12 h-12 text-gold/20" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-serif text-white">Astrolabe De-synchronized</h2>
          <p className="text-gray-500 max-w-sm mx-auto text-sm">
            To view your planetary charts and cosmic resonance, you must first initialize your celestial coordinates in the laboratory.
          </p>
        </div>
        <Link 
          href="/laboratory" 
          className="px-8 py-4 bg-gold text-black font-bold rounded-sm uppercase tracking-widest text-xs hover:bg-gold/90 transition-all flex items-center space-x-2"
        >
          <span>Open Laboratory</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  const { chart } = data;

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <span className="overline-label">Module: Astrolabe</span>
            <div className="h-[1px] w-8 bg-gold/30" />
          </div>
          <h1 className="text-5xl font-serif text-white tracking-tight uppercase">
            Planetary <span className="text-gold">Mapping</span>
          </h1>
        </div>
        
        {/* Varga Switcher */}
        <div className="flex bg-gold/5 border border-gold/10 p-1 rounded-sm">
          {(["D1", "D9", "D10"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setActiveVarga(v)}
              className={`px-6 py-2 text-[10px] uppercase tracking-widest font-bold transition-all ${
                activeVarga === v 
                  ? "bg-gold text-black shadow-[0_0_15px_rgba(197,160,89,0.3)]" 
                  : "text-gold/40 hover:text-gold"
              }`}
            >
              {v === "D1" ? "Rashi (D1)" : v === "D9" ? "Navamsha (D9)" : "Dashamsha (D10)"}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Chart & Resonance */}
        <div className="lg:col-span-7 space-y-8">
          {/* Main Chart HUD */}
          <div className="hud-module p-8 border border-gold/10 bg-gold/5 relative overflow-hidden">
            <div className="absolute top-4 left-4 flex items-center space-x-2">
              <Compass className="w-4 h-4 text-gold/40" />
              <span className="text-[10px] uppercase tracking-[0.2em] text-gold/40 font-mono">Precision Render</span>
            </div>
            
            <AnimatePresence mode="wait">
              <motion.div
                key={activeVarga}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.5 }}
              >
                <NorthIndianChart 
                  data={chart.shodashvarga[activeVarga]} 
                  title={`${activeVarga} - ${activeVarga === "D1" ? "Principal Life Map" : activeVarga === "D9" ? "Fruit of Deeds" : "Career Path"}`}
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Resonance Meter HUD */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Activity className="w-4 h-4 text-gold/60" />
              <h3 className="text-[10px] uppercase tracking-[0.3em] text-gold/60 font-bold">Resonance Analysis</h3>
            </div>
            <ResonanceMeter 
              score={chart.astro_score} 
              strengths={chart.planetary_strengths} 
            />
          </div>
        </div>

        {/* Right Column: Planetary Table */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center space-x-2">
            <TableIcon className="w-4 h-4 text-gold/60" />
            <h3 className="text-[10px] uppercase tracking-[0.3em] text-gold/60 font-bold">Planetary Registry</h3>
          </div>
          <PlanetaryTable 
            planets={chart.planets} 
            ascendant={chart.ascendant} 
            ascendant_nakshatra={chart.ascendant_nakshatra}
          />
          
          {/* Detailed Metadata HUD */}
          <div className="hud-module p-6 border border-gold/10 bg-gold/5 space-y-4">
            <h4 className="text-[10px] uppercase tracking-[0.2em] text-gold/40 font-bold">Calculation Metadata</h4>
            <div className="grid grid-cols-2 gap-4 font-mono text-[10px] uppercase">
              <div className="space-y-1">
                <span className="text-gray-500 block">Ayanamsa</span>
                <span className="text-white">{chart.metadata.ayanamsa_name}</span>
              </div>
              <div className="space-y-1">
                <span className="text-gray-500 block">Julian Day</span>
                <span className="text-white">{chart.metadata.jd.toFixed(4)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
