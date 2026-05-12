"use client";

import React from "react";
import { motion } from "framer-motion";
import NorthIndianChart from "@/components/NorthIndianChart";
import { ShodashvargaChart } from "@/types/astro";
import { Maximize2, Shield } from "lucide-react";

interface VargaCardProps {
  id: string;
  english: string;
  sanskrit: string;
  data: ShodashvargaChart;
  description: string;
  category: string;
  onClick: () => void;
  index: number;
}

export function VargaCard({ 
  id, 
  english, 
  sanskrit, 
  data, 
  description, 
  category,
  onClick,
  index 
}: VargaCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.03 }}
      onClick={onClick}
      className="group relative cursor-pointer"
    >
      <div className="hud-module p-4 bg-white/[0.02] border border-white/5 group-hover:border-gold/30 transition-all duration-500 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-gold uppercase tracking-widest">{id}</span>
              <span className="text-[9px] text-zinc-600 uppercase font-bold tracking-widest px-1.5 py-0.5 border border-zinc-800 rounded-full">
                {category}
              </span>
            </div>
            <h3 className="text-sm font-serif text-white group-hover:text-gold transition-colors">{english}</h3>
          </div>
          <Maximize2 className="w-3 h-3 text-zinc-700 group-hover:text-gold transition-colors" />
        </div>

        {/* Chart Preview */}
        <div className="aspect-square w-full relative mb-4 opacity-80 group-hover:opacity-100 transition-opacity">
           <div className="absolute inset-0 bg-gold/5 blur-xl group-hover:bg-gold/10 transition-all" />
           <div className="relative z-10 pointer-events-none scale-90 origin-center">
              <NorthIndianChart data={data} hideTitle />
           </div>
        </div>

        {/* Footer Meta */}
        <div className="flex items-center justify-between pt-3 border-t border-white/5">
           <span className="text-[10px] font-mono text-zinc-500 italic">{sanskrit}</span>
           <div className="flex gap-1">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-1 h-1 rounded-full bg-gold/20 group-hover:bg-gold/40 transition-colors" />
              ))}
           </div>
        </div>
      </div>
    </motion.div>
  );
}
