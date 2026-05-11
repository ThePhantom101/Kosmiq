"use client";
import React from "react";
import SamhitaMatches from "@/components/predictions/SamhitaMatches";

export default function SamhitaPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 pb-32">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 space-y-4 md:space-y-0 border-b border-white/5 pb-8">
        <div>
          <h1 className="text-4xl font-light tracking-tight text-white mb-1">
            Historical Matches
          </h1>
          <p className="text-gold text-xs uppercase tracking-[0.4em] font-medium opacity-80">
            Samhita Archives
          </p>
        </div>
      </div>

      <SamhitaMatches />
    </div>
  );
}

