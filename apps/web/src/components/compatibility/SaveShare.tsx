"use client";

import React from "react";
import { Save, Share2, Download, MessageCircle } from "lucide-react";
import { CompatibilityResponse } from "@/types/astro";

interface SaveShareProps {
  result: CompatibilityResponse;
}

export function SaveShare({ result }: SaveShareProps) {
  return (
    <div className="flex flex-wrap justify-center gap-6 py-12 border-t border-gold/10 mt-16">
      <button className="flex items-center gap-3 px-8 py-3 bg-transparent border border-gold/20 text-[10px] uppercase tracking-widest font-bold text-gray-400 hover:text-gold hover:border-gold transition-all rounded-sm">
        <Save className="w-4 h-4" />
        Save Report
      </button>
      <button className="flex items-center gap-3 px-8 py-3 bg-transparent border border-gold/20 text-[10px] uppercase tracking-widest font-bold text-gray-400 hover:text-gold hover:border-gold transition-all rounded-sm">
        <Share2 className="w-4 h-4" />
        Share
      </button>
      <button className="flex items-center gap-3 px-8 py-3 bg-transparent border border-gold/20 text-[10px] uppercase tracking-widest font-bold text-gray-400 hover:text-gold hover:border-gold transition-all rounded-sm">
        <Download className="w-4 h-4" />
        PDF Report
      </button>
      <button className="flex items-center gap-3 px-8 py-3 bg-gold/5 border border-gold/30 text-[10px] uppercase tracking-widest font-bold text-gold hover:bg-gold/10 transition-all shadow-[0_0_20px_rgba(197,160,89,0.1)] rounded-sm">
        <MessageCircle className="w-4 h-4" />
        Ask AI about Match
      </button>
    </div>
  );
}
