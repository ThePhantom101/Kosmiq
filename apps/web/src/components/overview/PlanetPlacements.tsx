"use client";

import React from "react";
import { motion } from "framer-motion";
import { Star, Shield, Zap, Info } from "lucide-react";
import { PlanetData } from "@/types/astro";

interface PlanetPlacementsProps {
  planets: Record<string, PlanetData>;
}

const PLANET_ORDER = [
  "Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"
];

const PLANET_SYMBOLS: Record<string, string> = {
  Sun: "☉", Moon: "☽", Mars: "♂", Mercury: "☿",
  Jupiter: "♃", Venus: "♀", Saturn: "♄", Rahu: "☊", Ketu: "☋"
};

export function PlanetPlacements({ planets }: PlanetPlacementsProps) {
  return (
    <div className="backdrop-blur-xl bg-black/40 border border-gold/10 rounded-sm overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-gold/10 bg-gold/5">
            <th className="px-6 py-4 text-[10px] uppercase tracking-[0.2em] text-gold font-bold">Planet</th>
            <th className="px-6 py-4 text-[10px] uppercase tracking-[0.2em] text-gold font-bold">Position</th>
            <th className="px-6 py-4 text-[10px] uppercase tracking-[0.2em] text-gold font-bold hidden md:table-cell">Nakshatra</th>
            <th className="px-6 py-4 text-[10px] uppercase tracking-[0.2em] text-gold font-bold">Dignity</th>
          </tr>
        </thead>
        <tbody>
          {PLANET_ORDER.map((name, idx) => {
            const data = planets[name];
            if (!data) return null;

            const isRetro = data.is_retrograde;
            const dignity = data.dignity || "Neutral";
            const isExalted = dignity.toLowerCase().includes("exalted");
            const isDebilitated = dignity.toLowerCase().includes("debilitated");
            const isOwn = dignity.toLowerCase().includes("own");

            return (
              <motion.tr 
                key={name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <span className="text-xl text-gold/40 font-serif leading-none group-hover:text-gold transition-colors">
                      {PLANET_SYMBOLS[name]}
                    </span>
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-2">
                        {name}
                        {isRetro && (
                          <span className="text-[8px] bg-amber-500/10 text-amber-500 border border-amber-500/20 px-1 rounded-sm">R</span>
                        )}
                      </div>
                      <div className="text-[9px] text-white/30 uppercase tracking-widest">{data.nakshatra.pada} Pada</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-xs text-white/80 font-medium">
                    {data.house}H • {data.sign}
                  </div>
                  <div className="text-[10px] font-mono text-white/40">
                    {Math.floor(data.longitude % 30)}° {Math.floor((data.longitude % 1) * 60)}'
                  </div>
                </td>
                <td className="px-6 py-4 hidden md:table-cell">
                  <div className="text-xs text-white/60">
                    {data.nakshatra.name}
                  </div>
                  <div className="text-[9px] text-white/30 uppercase tracking-tighter">
                    Lord: {data.nakshatra.lord}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {isExalted ? (
                      <span className="flex items-center gap-1.5 text-[10px] font-bold text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded-full uppercase tracking-widest">
                        <Star className="w-2.5 h-2.5" /> Exalted
                      </span>
                    ) : isDebilitated ? (
                      <span className="flex items-center gap-1.5 text-[10px] font-bold text-red-400 bg-red-400/10 border border-red-400/20 px-2 py-0.5 rounded-full uppercase tracking-widest">
                        <Shield className="w-2.5 h-2.5" /> Debilitated
                      </span>
                    ) : isOwn ? (
                      <span className="flex items-center gap-1.5 text-[10px] font-bold text-gold bg-gold/10 border border-gold/20 px-2 py-0.5 rounded-full uppercase tracking-widest">
                        <Zap className="w-2.5 h-2.5" /> Swakshetra
                      </span>
                    ) : (
                      <span className="text-[10px] font-medium text-white/40 uppercase tracking-widest">
                        {dignity}
                      </span>
                    )}
                  </div>
                </td>
              </motion.tr>
            );
          })}
        </tbody>
      </table>
      
      <div className="p-4 bg-gold/5 border-t border-gold/10 flex items-center gap-3">
        <Info className="w-3.5 h-3.5 text-gold/40" />
        <p className="text-[9px] text-white/30 leading-relaxed italic">
          Planetary dignities determine the strength and manifestation of each planet's karakas (significations). Exalted planets offer supreme results, while debilitated ones require karmic purification.
        </p>
      </div>
    </div>
  );
}
