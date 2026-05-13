"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAstro } from "@/context/AstroContext";
import { ChartShell } from "@/components/ChartShell";
import { VargaCard } from "@/components/dashboard/VargaCard";
import NorthIndianChart from "@/components/NorthIndianChart";
import { 
  Grid3x3, 
  AlertCircle, 
  RefreshCcw, 
  Info, 
  X, 
  Filter,
  Sparkles,
  Zap,
  Globe,
  Briefcase,
  Layers
} from "lucide-react";
import { ShodashvargaChart } from "@/types/astro";

interface VargaInfo {
  id: string;
  division: number;
  english: string;
  sanskrit: string;
  description: string;
  category: "Core" | "Material" | "Society" | "Success" | "Subtle";
}

const VARGAS: VargaInfo[] = [
  { id: "D1", division: 1, english: "Birth Chart", sanskrit: "Rasi", category: "Core", description: "Overall life blueprint and physical manifestation" },
  { id: "D9", division: 9, english: "Soul Chart", sanskrit: "Navamsa", category: "Core", description: "Marriage, dharma, and the internal strength of planets" },
  { id: "D2", division: 2, english: "Wealth Chart", sanskrit: "Hora", category: "Material", description: "Financial potential and material resources" },
  { id: "D4", division: 4, english: "Fortune Chart", sanskrit: "Chaturthamsa", description: "Property, fixed assets, and net luck", category: "Material" },
  { id: "D16", division: 16, english: "Vehicles Chart", sanskrit: "Shodasamsa", description: "Vehicles, comforts, and material pleasures", category: "Material" },
  { id: "D3", division: 3, english: "Siblings Chart", sanskrit: "Drekkana", description: "Siblings, courage, and short journeys", category: "Society" },
  { id: "D7", division: 7, english: "Children Chart", sanskrit: "Saptamsa", description: "Children and creative legacy", category: "Society" },
  { id: "D12", division: 12, english: "Ancestry Chart", sanskrit: "Dwadasamsa", description: "Parents, ancestry, and karmic inheritance", category: "Society" },
  { id: "D10", division: 10, english: "Career Chart", sanskrit: "Dasamsa", description: "Profession, status, and public life", category: "Success" },
  { id: "D24", division: 24, english: "Learning Chart", sanskrit: "Chaturvimsamsa", description: "Education, skills, and advanced knowledge", category: "Success" },
  { id: "D20", division: 20, english: "Spiritual Chart", sanskrit: "Vimsamsa", description: "Spiritual practices and inner growth", category: "Subtle" },
  { id: "D27", division: 27, english: "Strength Chart", sanskrit: "Saptvimsamsa", description: "Physical strength and vitality", category: "Subtle" },
  { id: "D30", division: 30, english: "Karma Chart", sanskrit: "Trimsamsa", description: "Misfortunes, challenges, and past karma", category: "Subtle" },
  { id: "D40", division: 40, english: "Maternal History", sanskrit: "Khavedamsa", description: "Auspicious and inauspicious tendencies from maternal side", category: "Subtle" },
  { id: "D45", division: 45, english: "Paternal History", sanskrit: "Akshavedamsa", description: "General well-being and character from paternal side", category: "Subtle" },
  { id: "D60", division: 60, english: "Past Life Destiny", sanskrit: "Shashtyamsa", description: "Deep past life karma and final destiny", category: "Subtle" },
];

const CATEGORIES = ["All", "Core", "Material", "Society", "Success", "Subtle"] as const;

export default function DivisionalChartsPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id ?? "me";
  const { data: astroData } = useAstro();
  const [activeCategory, setActiveCategory] = useState<typeof CATEGORIES[number]>("All");
  const [vargaData, setVargaData] = useState<Record<string, ShodashvargaChart> | null>(null);
  const [selectedVarga, setSelectedVarga] = useState<VargaInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchVargaData = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      if (id === "me") {
        if (astroData?.chart?.shodashvarga) {
          setVargaData(astroData.chart.shodashvarga);
        } else {
          // Try fetching if context is empty
          const res = await fetch(`/api/chart/me/varga`);
          if (res.ok) setVargaData(await res.json());
        }
        return;
      }
      const res = await fetch(`/api/chart/${id}/varga`);
      if (!res.ok) throw new Error("Failed to fetch");
      setVargaData(await res.json());
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [id, astroData]);

  useEffect(() => {
    fetchVargaData();
  }, [fetchVargaData]);

  const filteredVargas = useMemo(() => {
    if (activeCategory === "All") return VARGAS;
    return VARGAS.filter(v => v.category === activeCategory);
  }, [activeCategory]);

  if (loading) {
    return (
      <ChartShell>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-8 animate-pulse">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="aspect-[3/4] bg-white/5 border border-gold/10 rounded-sm" />
          ))}
        </div>
      </ChartShell>
    );
  }

  return (
    <ChartShell>
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pb-32 space-y-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pt-8 border-b border-white/5 pb-8">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <span className="overline-label text-gold/60">Multidimensional Blueprint</span>
              <div className="h-[1px] w-8 bg-gold/20" />
            </div>
            <h1 className="text-5xl font-serif text-white tracking-tight uppercase">
              Harmonic <span className="text-gold">Charts</span>
            </h1>
            <p className="text-zinc-500 max-w-xl text-xs font-medium leading-relaxed uppercase tracking-widest">
              The Shodashvarga: 16 layers of karmic resonance decoding every facet of existence.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 text-[10px] uppercase font-black tracking-widest transition-all border ${
                  activeCategory === cat 
                    ? 'bg-gold text-black border-gold' 
                    : 'bg-white/5 text-zinc-500 border-white/10 hover:border-gold/30 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredVargas.map((v, idx) => (
            <VargaCard
              key={v.id}
              {...v}
              data={vargaData?.[v.id] || ({} as ShodashvargaChart)}
              index={idx}
              onClick={() => setSelectedVarga(v)}
            />
          ))}
        </div>

        {/* Inspector Modal */}
        <AnimatePresence>
          {selectedVarga && vargaData?.[selectedVarga.id] && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedVarga(null)}
                className="absolute inset-0 bg-black/90 backdrop-blur-sm"
              />
              
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-4xl bg-[#0a0a0a] border border-gold/30 p-6 sm:p-10 shadow-[0_0_100px_rgba(197,160,89,0.15)] overflow-hidden"
              >
                {/* Decorative corner */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 blur-3xl rounded-full" />
                
                <button 
                  onClick={() => setSelectedVarga(null)}
                  className="absolute top-6 right-6 p-2 text-zinc-500 hover:text-gold transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  <div className="space-y-8">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                         <span className="text-sm font-black text-gold uppercase tracking-[0.3em]">{selectedVarga.id}</span>
                         <div className="h-px flex-1 bg-gold/10" />
                      </div>
                      <h2 className="text-4xl font-serif text-white uppercase">{selectedVarga.english}</h2>
                      <p className="text-lg text-gold/60 font-serif italic">{selectedVarga.sanskrit}</p>
                    </div>

                    <div className="space-y-6">
                      <div className="space-y-2">
                        <span className="text-[10px] uppercase font-black tracking-widest text-zinc-600">Esoteric Significance</span>
                        <p className="text-zinc-300 leading-relaxed text-sm">
                          {selectedVarga.description}. In this division, we analyze the specific harmonic resonance of your natal planets as they move through the {selectedVarga.division}th level of solar space.
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                         <div className="p-4 bg-white/[0.02] border border-white/5 space-y-1">
                            <span className="text-[9px] uppercase font-bold text-zinc-500 tracking-widest">Division</span>
                            <p className="text-white font-mono">1/{selectedVarga.division}</p>
                         </div>
                         <div className="p-4 bg-white/[0.02] border border-white/5 space-y-1">
                            <span className="text-[9px] uppercase font-bold text-zinc-500 tracking-widest">Category</span>
                            <p className="text-white font-mono">{selectedVarga.category}</p>
                         </div>
                      </div>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="hud-module p-6 bg-gold/5 border border-gold/10 relative">
                       <NorthIndianChart 
                          data={vargaData[selectedVarga.id]} 
                          title={`${selectedVarga.english}`} 
                       />
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </ChartShell>
  );
}
