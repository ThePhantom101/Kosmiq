"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import { motion } from "framer-motion";
import { Sparkles, Star, Moon, Sun, LayoutGrid, Table2 } from "lucide-react";
import NorthIndianChart from "./NorthIndianChart";
import PlanetaryTable from "./PlanetaryTable";
import { ChartResponse } from "../../types/astro";

interface ReadingDisplayProps {
  reading: string;
  chartData: ChartResponse;
}

export default function ReadingDisplay({ reading, chartData }: ReadingDisplayProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-3xl mx-auto space-y-12"
    >
      {/* Decorative Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-6">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <Star className="w-5 h-5 text-purple-500/50" />
          </motion.div>
          <h2 className="text-3xl font-light tracking-[0.2em] uppercase bg-gradient-to-b from-white to-gray-500 bg-clip-text text-transparent">
            Your Cosmic Revelation
          </h2>
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <Star className="w-5 h-5 text-pink-500/50" />
          </motion.div>
        </div>
        <div className="h-px w-24 mx-auto bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </div>

      {/* Visual Blueprint Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div className="flex items-center gap-3 text-xs uppercase tracking-widest text-gray-500 mb-2">
            <LayoutGrid className="w-4 h-4 text-purple-500" />
            <span>Main Birth Chart (D1)</span>
          </div>
          <div className="backdrop-blur-2xl bg-white/5 border border-white/10 rounded-[2rem] p-6 shadow-2xl">
            <NorthIndianChart data={chartData.shodashvarga["D1"]} title="Rashi Chakra" />
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div className="flex items-center gap-3 text-xs uppercase tracking-widest text-gray-500 mb-2">
            <Table2 className="w-4 h-4 text-pink-500" />
            <span>Planetary Placements</span>
          </div>
          <PlanetaryTable planets={chartData.planets} ascendant={chartData.ascendant} />
        </motion.div>
      </div>

      {/* Reading Content */}
      <div className="relative group">
        {/* Mystical Border/Glass Effect */}
        <div className="absolute -inset-px bg-gradient-to-b from-white/10 to-transparent rounded-[2rem] -z-10 group-hover:from-white/20 transition-all duration-1000" />
        <div className="backdrop-blur-3xl bg-black/40 border border-white/5 rounded-[2rem] p-8 md:p-12 shadow-2xl overflow-hidden relative">
          
          {/* Subtle background icons */}
          <Sun className="absolute top-10 right-10 w-32 h-32 text-white/2 -rotate-12 pointer-events-none" />
          <Moon className="absolute bottom-10 left-10 w-24 h-24 text-white/2 rotate-12 pointer-events-none" />

          <article className="prose prose-invert prose-headings:font-light prose-headings:tracking-wide prose-headings:text-purple-400 prose-p:text-gray-300 prose-p:leading-relaxed prose-strong:text-white prose-blockquote:border-purple-500/30 prose-blockquote:bg-white/5 prose-blockquote:py-1 prose-blockquote:px-6 prose-blockquote:rounded-r-lg max-w-none">
            <ReactMarkdown>{reading}</ReactMarkdown>
          </article>
        </div>
      </div>

      {/* Footer Note */}
      <div className="text-center space-y-4 pt-8">
        <p className="text-[10px] uppercase tracking-[0.3em] text-gray-500 flex items-center justify-center gap-3">
          <span className="w-12 h-px bg-white/10" />
          Designed for the Seekers
          <span className="w-12 h-px bg-white/10" />
        </p>
        <div className="flex justify-center gap-4 text-gray-600">
          <Sparkles className="w-4 h-4" />
          <Star className="w-4 h-4" />
          <Sparkles className="w-4 h-4" />
        </div>
      </div>
    </motion.div>
  );
}
