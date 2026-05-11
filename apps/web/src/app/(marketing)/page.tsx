"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BirthForm from "@/components/BirthForm";
import { CombinedChartResponse } from "@/types/astro";
import { ArrowRight, ShieldCheck, Database, Zap } from "lucide-react";

export default function Home() {
  const [result, setResult] = useState<CombinedChartResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.8, 
        ease: [0.22, 1, 0.36, 1] as const
      } 
    },
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-6 overflow-hidden">
      <AnimatePresence mode="wait">
        {!result ? (
          <motion.div
            key="landing"
            variants={containerVariants}
            initial="hidden"
            animate="show"
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-16 items-center py-12"
          >
            {/* Hero Section */}
            <div className="space-y-8">
              <motion.div variants={itemVariants} className="space-y-4">
                <div className="flex items-center space-x-2">
                  <span className="overline-label">v1.4 Internal Release</span>
                  <div className="h-[1px] w-12 bg-gold/30" />
                </div>
                <h1 className="text-6xl md:text-8xl font-serif text-white leading-tight">
                  Behold the <br />
                  <span className="text-gold">Cosmic Code</span>
                </h1>
                <p className="text-xl text-gray-400 font-sans max-w-lg leading-relaxed">
                  A high-precision laboratory for the soul. Calculate your unique karmic signature through mathematical Vedic algorithms and generative synthesis.
                </p>
              </motion.div>

              <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                <div className="flex items-start space-x-4 group">
                  <div className="p-2 border border-gold/20 rounded-sm bg-gold/5 group-hover:border-gold/50 transition-colors">
                    <Database className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-sm uppercase tracking-wider">Lahiri Precision</h3>
                    <p className="text-xs text-gray-500 mt-1 leading-snug">Swiss Ephemeris powered calculations with sub-arc-second accuracy.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4 group">
                  <div className="p-2 border border-gold/20 rounded-sm bg-gold/5 group-hover:border-gold/50 transition-colors">
                    <Zap className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-sm uppercase tracking-wider">AI Synthesis</h3>
                    <p className="text-xs text-gray-500 mt-1 leading-snug">Neural networks trained on the Brihat Parashara Hora Shastra.</p>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="pt-8 flex items-center space-x-6">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-black bg-gray-800 flex items-center justify-center overflow-hidden">
                      <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" />
                    </div>
                  ))}
                  <div className="w-10 h-10 rounded-full border-2 border-black bg-gold/20 flex items-center justify-center text-[10px] text-gold font-bold">
                    12K+
                  </div>
                </div>
                <p className="text-xs text-gray-500 uppercase tracking-widest font-mono">
                  Synthesized across <br /> 48 celestial quadrants
                </p>
              </motion.div>
            </div>

            {/* Input HUD Module */}
            <motion.div variants={itemVariants}>
              <BirthForm onResult={setResult} isLoading={isLoading} setIsLoading={setIsLoading} />
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-4xl py-20 text-center space-y-12"
          >
            <div className="space-y-4">
              <span className="overline-label">Synthesis Complete</span>
              <h2 className="text-5xl font-serif text-white">Your Soul Signature is Ready</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                The cosmic positions at the moment of your emergence have been calculated. To preserve this chronicle and unlock the full depth of your reading, secure your session.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="hud-module p-8 space-y-6 text-left">
                <div className="flex items-center justify-between">
                  <h3 className="text-gold uppercase tracking-[0.2em] font-bold text-sm">Session Data</h3>
                  <ShieldCheck className="w-4 h-4 text-gold/40" />
                </div>
                <div className="space-y-3 font-mono text-xs">
                  <div className="flex justify-between border-b border-gold/10 pb-2">
                    <span className="text-gray-500">ASCENDANT</span>
                    <span className="text-white">{result.chart.ascendant.toFixed(2)}°</span>
                  </div>
                  <div className="flex justify-between border-b border-gold/10 pb-2">
                    <span className="text-gray-500">MOON LONGITUDE</span>
                    <span className="text-white">{result.chart.planets["Moon"]?.longitude.toFixed(2)}°</span>
                  </div>
                  <div className="flex justify-between border-b border-gold/10 pb-2">
                    <span className="text-gray-500">AYANAMSA</span>
                    <span className="text-white">{result.chart.metadata.ayanamsa_name}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-center space-y-6">
                <button
                  onClick={() => window.location.href = "/login"}
                  className="w-full bg-gold text-black font-bold py-4 rounded-sm hover:bg-gold/90 transition-all flex items-center justify-center space-x-3 shadow-[0_0_20px_rgba(197,160,89,0.3)]"
                >
                  <ArrowRight className="w-5 h-5" />
                  <span className="uppercase tracking-[0.2em] text-xs">Save to Chronicles</span>
                </button>
                <button
                  onClick={() => setResult(null)}
                  className="text-gray-500 hover:text-white transition-colors uppercase tracking-[0.2em] text-[10px] font-mono"
                >
                  ← Recalculate Coordinates
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
