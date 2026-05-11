"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { AlertCircle, RefreshCcw, Moon } from "lucide-react";
import { useAstro } from "@/context/AstroContext";

interface ShadowPlanet {
  name: string;
  sanskrit: string;
  house: number;
  sign: string;
  description: string;
  type: "Amplifying" | "Spiritualizing" | "Challenging" | "Protective";
}

export default function ShadowsPage() {
  const { id } = useParams<{ id: string }>();
  const { data: astroData } = useAstro();
  const [shadows, setShadows] = useState<ShadowPlanet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchShadows = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const url = `/api/chart/${id}/shadows`;
      const options: RequestInit = id === "me" ? {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chart_data: astroData?.chart }),
      } : {
        method: "GET",
      };

      const response = await fetch(url, options);
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();
      setShadows(data.shadows);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [id, astroData]);

  useEffect(() => {
    fetchShadows();
  }, [fetchShadows]);

  const getBadgeColor = (type: ShadowPlanet["type"]) => {
    switch (type) {
      case "Amplifying": return "bg-gold/20 text-gold border-gold/30";
      case "Spiritualizing": return "bg-blue-400/10 text-blue-200 border-blue-400/20";
      case "Challenging": return "bg-red-500/10 text-red-400 border-red-500/20";
      case "Protective": return "bg-green-500/10 text-green-400 border-green-500/20";
      default: return "bg-gray-500/10 text-gray-400 border-gray-500/20";
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8 space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-4xl font-serif uppercase tracking-tight text-white flex items-center gap-3">
          Shadow Planets
        </h1>
        <p className="text-gold/60 text-sm italic font-medium uppercase tracking-widest">
          Upagrahas
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="h-48 bg-white/5 border border-gold/10 rounded-sm animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <div className="h-[50vh] flex flex-col items-center justify-center text-center space-y-6">
          <AlertCircle className="w-12 h-12 text-red-500/50" />
          <div className="space-y-2">
            <h2 className="text-xl font-serif uppercase">Transmission Interrupted</h2>
            <p className="text-sm text-gray-500">The shadow realms are currently veiled from our sensors.</p>
          </div>
          <button
            onClick={fetchShadows}
            className="flex items-center gap-2 px-6 py-3 bg-gold/10 border border-gold/20 text-gold text-xs uppercase tracking-widest hover:bg-gold/20 transition-all"
          >
            <RefreshCcw className="w-4 h-4" />
            Retry Connection
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {shadows.map((shadow, index) => (
            <motion.div
              key={shadow.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="hud-module p-6 bg-gold/5 border border-gold/10 hover:border-gold/30 transition-all group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Moon className="w-20 h-20 text-gold" />
              </div>

              <div className="space-y-4 relative z-10">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-serif text-white uppercase">{shadow.name}</h3>
                    <span className={`text-[9px] px-2 py-1 uppercase tracking-tighter font-black border rounded-full ${getBadgeColor(shadow.type)}`}>
                      {shadow.type}
                    </span>
                  </div>
                  <p className="text-gold/60 text-[10px] uppercase tracking-widest font-bold">
                    {shadow.sanskrit}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                  <span className="text-white">House {shadow.house}</span>
                  <span className="text-gold/40">·</span>
                  <span>{shadow.sign}</span>
                </div>

                <p className="text-sm text-gray-400 leading-relaxed min-h-[40px]">
                  {shadow.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
