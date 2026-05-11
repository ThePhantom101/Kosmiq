"use client";

import React from "react";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";

interface ComingSoonProps {
  title: string;
  sanskrit?: string;
  description: string;
  priority?: "P0" | "P1" | "P2";
}

export function ComingSoon({ title, sanskrit, description, priority = "P1" }: ComingSoonProps) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-8 py-20">
      {/* Icon */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="p-6 rounded-full bg-gold/5 border border-gold/10"
      >
        <Clock className="w-10 h-10 text-gold/30" />
      </motion.div>

      {/* Labels */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="space-y-3"
      >
        <div className="flex items-center justify-center gap-3">
          <span className="text-[9px] uppercase tracking-[0.3em] font-bold text-gold/40 border border-gold/20 px-2 py-0.5 rounded-sm">
            {priority} · Coming Soon
          </span>
        </div>
        <h1 className="text-4xl font-serif text-white uppercase tracking-tight">
          {title}
        </h1>
        {sanskrit && (
          <p className="text-gold/40 font-mono text-xs uppercase tracking-[0.3em]">
            {sanskrit}
          </p>
        )}
        <p className="text-gray-500 max-w-sm mx-auto text-sm leading-relaxed">
          {description}
        </p>
      </motion.div>

      {/* Dashed placeholder */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="w-full max-w-lg hud-module p-16 border border-gold/10 bg-gold/5 border-dashed"
      >
        <span className="text-gray-600 uppercase tracking-widest text-xs font-mono">
          Module Initializing
        </span>
      </motion.div>
    </div>
  );
}

export default ComingSoon;
