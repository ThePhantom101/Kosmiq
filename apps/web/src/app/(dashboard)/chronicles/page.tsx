"use client";
import React from "react";
export default function ChroniclesPage() {
  return (
    <div className="space-y-8 text-center py-20">
      <h1 className="text-4xl font-serif text-white uppercase tracking-tighter">Chronicles</h1>
      <p className="text-gold/40 font-mono text-xs uppercase tracking-[0.3em]">Saved Transmissions & History</p>
      <div className="hud-module p-20 border border-gold/10 bg-gold/5 border-dashed">
        <span className="text-gray-500 uppercase tracking-widest text-xs">Library Archives Initializing</span>
      </div>
    </div>
  );
}
