"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowUpRight, Zap, Database, History } from "lucide-react";

export default function NexusPage() {
  return (
    <div className="space-y-12">
      {/* Header Section */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <span className="overline-label">Celestial Status: Active</span>
          <div className="h-[1px] w-8 bg-gold/30" />
        </div>
        <h1 className="text-5xl font-serif text-white tracking-tight">
          Welcome to the <span className="text-gold">Nexus</span>
        </h1>
        <p className="text-gray-400 font-sans max-w-2xl leading-relaxed">
          The central hub of your cosmic intelligence. Monitor your planetary transits, explore your stored chronicles, and access deep architectural insights.
        </p>
      </div>

      {/* Stats / Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <NexusCard 
          title="Current Transit" 
          value="Sun in Aries" 
          icon={Zap}
          description="High energy for new initiations and architectural breakthroughs."
        />
        <NexusCard 
          title="Stored Chronicles" 
          value="12 Readings" 
          icon={History}
          description="Your personal history of cosmic transmissions and AI synthesis."
        />
        <NexusCard 
          title="Calculation Health" 
          value="Sub-Arc Second" 
          icon={Database}
          description="Swiss Ephemeris precision actively syncing with Lahiri Ayanamsa."
        />
      </div>

      {/* Main Content Area Placeholder */}
      <div className="hud-module p-8 min-h-[400px] flex items-center justify-center border border-gold/10 bg-gold/5 relative overflow-hidden group">
        <div className="absolute inset-0 bg-grid-white/[0.02]" />
        <div className="relative text-center space-y-6">
          <div className="inline-flex p-4 rounded-full bg-gold/10 border border-gold/20 mb-4 group-hover:scale-110 transition-transform duration-500">
            <Sparkles className="w-8 h-8 text-gold" />
          </div>
          <h2 className="text-2xl font-serif text-white">Initialize Your Soul Signature</h2>
          <p className="text-gray-500 max-w-md mx-auto text-sm">
            Begin a new calculation or load an existing chronicle to populate the laboratory with active planetary data.
          </p>
          <button className="px-8 py-4 bg-gold text-black font-bold rounded-sm uppercase tracking-widest text-xs hover:bg-gold/90 transition-all flex items-center space-x-2 mx-auto">
            <span>Open Laboratory</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function NexusCard({ title, value, icon: Icon, description }: { 
  title: string; 
  value: string; 
  icon: any; 
  description: string;
}) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="hud-module p-6 border border-gold/10 bg-gold/5 hover:border-gold/30 transition-all space-y-4"
    >
      <div className="flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-[0.2em] text-gold/60 font-bold">{title}</span>
        <Icon className="w-4 h-4 text-gold/40" />
      </div>
      <div className="space-y-1">
        <h3 className="text-2xl font-serif text-white">{value}</h3>
        <p className="text-[10px] text-gray-500 font-mono leading-relaxed uppercase tracking-wider">
          {description}
        </p>
      </div>
    </motion.div>
  );
}
