"use client";

import React, { useState } from "react";
import { ChartResponse } from "@/types/astro";
import { User, UserPlus, Search, Edit2 } from "lucide-react";

interface ChartPickerProps {
  label: string;
  selectedChart: ChartResponse | null;
  onSelect: (chart: ChartResponse | null) => void;
  isMe?: boolean;
}

export function ChartPicker({ label, selectedChart, onSelect, isMe }: ChartPickerProps) {
  const [isEnteringDetails, setIsEnteringDetails] = useState(false);

  return (
    <div className="space-y-4">
      <h3 className="overline-label">{label}</h3>
      
      <div className={`relative overflow-hidden hud-module transition-all duration-500 min-h-[160px] flex flex-col justify-center items-center p-6 group ${
        selectedChart ? "border-gold shadow-[0_0_30px_rgba(197,160,89,0.1)]" : "border-gold/10"
      }`}>
        {/* Glow Effect */}
        {selectedChart && (
          <div className="absolute inset-0 bg-gold/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        )}

        {selectedChart ? (
          <div className="w-full space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-sm bg-gold/10 border border-gold/20 flex items-center justify-center text-gold">
                <User className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <div className="text-xl font-serif text-white tracking-tight">
                  {isMe ? "Me" : selectedChart.metadata.name || "Selected Person"}
                </div>
                <div className="text-[10px] uppercase tracking-wider text-gray-500 font-mono">
                  {selectedChart.ascendant_nakshatra.name} Lagna • {selectedChart.planets.Moon.nakshatra.name} Moon
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button 
                className="flex-1 px-4 py-2 text-[10px] uppercase tracking-widest font-bold border border-gold/20 hover:border-gold hover:text-gold transition-all flex items-center justify-center gap-2"
                onClick={() => onSelect(null)}
              >
                <Search className="w-3 h-3" />
                Change
              </button>
              <button 
                className="flex-1 px-4 py-2 text-[10px] uppercase tracking-widest font-bold border border-gold/20 hover:border-gold hover:text-gold transition-all flex items-center justify-center gap-2"
              >
                <Edit2 className="w-3 h-3" />
                Edit
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-sm bg-black/50 border border-gold/10 flex items-center justify-center mx-auto text-gray-700 group-hover:text-gold/50 transition-colors">
              <UserPlus className="w-8 h-8" />
            </div>
            <div className="space-y-3">
              <div className="text-[10px] uppercase tracking-widest font-bold text-gray-500">Select {label}</div>
              <div className="flex gap-2">
                <button 
                  className="px-4 py-2 text-[9px] uppercase tracking-widest font-black border border-gold/10 bg-gold/5 hover:bg-gold/10 text-gold/60 hover:text-gold transition-all"
                >
                  Saved Charts
                </button>
                <button 
                  className="px-4 py-2 text-[9px] uppercase tracking-widest font-black border border-gold/10 bg-gold/5 hover:bg-gold/10 text-gold/60 hover:text-gold transition-all"
                  onClick={() => setIsEnteringDetails(true)}
                >
                  New Person
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Selected Indicator */}
        {selectedChart && (
          <div className="absolute top-4 right-4">
            <div className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse shadow-[0_0_8px_rgba(197,160,89,0.8)]" />
          </div>
        )}
      </div>
    </div>
  );
}
