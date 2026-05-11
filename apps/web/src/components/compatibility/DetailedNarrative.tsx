"use client";

import React from "react";
import { motion } from "framer-motion";
import { Loader2, Sparkles, BookOpen } from "lucide-react";

interface DetailedNarrativeProps {
  narrative: string | null;
  isLoading: boolean;
}

export function DetailedNarrative({ narrative, isLoading }: DetailedNarrativeProps) {
  if (!narrative && !isLoading) return null;

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4 border-b border-gold/10 pb-6">
        <div className="p-3 rounded-sm bg-gold/5 border border-gold/20 text-gold">
          <BookOpen className="w-5 h-5" />
        </div>
        <div>
          <span className="overline-label">Synthesis</span>
          <h3 className="text-3xl font-serif text-white uppercase tracking-tight mt-1">
            Raj Jyotishi Oracle
          </h3>
        </div>
      </div>

      <div className="relative overflow-hidden hud-module bg-gold/[0.02] min-h-[300px]">
        {/* Background Texture Overlay */}
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/black-linen.png')]" />
        
        {/* Top Accent Line */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

        <div className="p-10 md:p-16 relative z-10">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center space-y-6 py-20">
              <Loader2 className="w-12 h-12 animate-spin text-gold/40" />
              <p className="text-[10px] text-gray-500 animate-pulse font-black tracking-[0.4em] uppercase">
                Consulting the Cosmic Mandala
              </p>
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.5 }}
              className="space-y-10"
            >
              {narrative?.split('\n\n').map((para, i) => (
                <p 
                  key={i} 
                  className="text-lg md:text-2xl text-gray-300 leading-relaxed font-serif tracking-tight first-letter:text-4xl first-letter:text-gold first-letter:font-bold first-letter:mr-1"
                >
                  {para}
                </p>
              ))}

              <div className="flex justify-center pt-12 border-t border-gold/5">
                <div className="flex items-center gap-4 text-gold/30">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-[9px] uppercase tracking-[0.4em] font-black">Oracle Synthesis v2.5</span>
                  <Sparkles className="w-4 h-4" />
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
