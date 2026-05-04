"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function AstrolabeLoader() {
  return (
    <div className="flex flex-col items-center justify-center space-y-8 py-20 relative">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-500/20 rounded-full blur-[80px] animate-pulse-glow" />
      
      {/* Astrolabe Visual */}
      <div className="relative w-48 h-48 flex items-center justify-center">
        {/* Outer Ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 border-2 border-white/5 rounded-full"
        />
        
        {/* Zodiac Ring */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute inset-4 border border-purple-500/20 rounded-full flex items-center justify-center"
        >
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/20 rounded-full"
              style={{
                transform: `rotate(${i * 30}deg) translateY(-84px)`,
              }}
            />
          ))}
        </motion.div>

        {/* Inner Gear */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute inset-12 border-2 border-pink-500/20 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.1)]"
        >
          <div className="w-1/2 h-0.5 bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
          <div className="w-0.5 h-1/2 bg-gradient-to-b from-transparent via-pink-500 to-transparent absolute" />
        </motion.div>

        {/* Center Crystal */}
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="relative z-10 w-4 h-4 bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.8)]"
        />
      </div>

      <div className="text-center space-y-3 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex items-center justify-center gap-2 text-purple-400 font-medium tracking-widest uppercase text-xs"
        >
          <Sparkles className="w-3 h-3 animate-pulse" />
          Consulting the Cosmos
          <Sparkles className="w-3 h-3 animate-pulse" />
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-gray-500 text-sm italic"
        >
          Aligning planetary degrees and synthesizing your karma...
        </motion.p>
      </div>
    </div>
  );
}
