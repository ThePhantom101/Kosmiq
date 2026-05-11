"use client";

import React from "react";
import { motion } from "framer-motion";
import { PanchangElement } from "@/types/astro";

interface PanchangCardProps {
  title: string;
  data: PanchangElement;
  icon: React.ReactNode;
  index: number;
}

export default function PanchangCard({ title, data, icon, index }: PanchangCardProps) {
  const qualityColors = {
    Auspicious: "text-gold border-gold/40 bg-gold/5",
    Neutral: "text-white/60 border-white/10 bg-white/5",
    Inauspicious: "text-red-400 border-red-500/40 bg-red-500/5",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-black/40 border border-white/5 rounded-3xl p-6 flex flex-col justify-between hover:border-gold/20 transition-all group"
    >
      <div className="flex justify-between items-start">
        <div className="p-3 bg-white/5 border border-white/10 rounded-2xl group-hover:border-gold/30 transition-colors">
          {icon}
        </div>
        <div className={`text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full border ${qualityColors[data.quality]}`}>
          {data.quality}
        </div>
      </div>

      <div className="mt-8">
        <p className="text-[10px] uppercase tracking-[0.3em] text-white/40 mb-2 font-medium">
          {title}
        </p>
        <h3 className="text-2xl font-light text-white group-hover:text-gold transition-colors">
          {data.name} {data.number && <span className="text-white/20 ml-1">— {data.number}</span>}
        </h3>
        {data.extra && (
          <p className="text-xs text-white/40 mt-2 italic">
            {data.extra}
          </p>
        )}
      </div>
    </motion.div>
  );
}
