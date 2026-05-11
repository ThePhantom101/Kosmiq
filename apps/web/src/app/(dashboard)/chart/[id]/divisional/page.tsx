"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAstro } from "@/context/AstroContext";
import NorthIndianChart from "@/components/NorthIndianChart";
import { Grid3x3, AlertCircle, RefreshCcw, Info } from "lucide-react";
import { ShodashvargaChart } from "@/types/astro";

interface VargaInfo {
  id: string;
  division: number;
  english: string;
  sanskrit: string;
  description: string;
}

const VARGAS: VargaInfo[] = [
  { id: "D1", division: 1, english: "Birth Chart", sanskrit: "Rasi", description: "Overall life blueprint" },
  { id: "D2", division: 2, english: "Wealth Chart", sanskrit: "Hora", description: "Financial potential and material resources" },
  { id: "D3", division: 3, english: "Siblings Chart", sanskrit: "Drekkana", description: "Siblings, courage, and short journeys" },
  { id: "D4", division: 4, english: "Fortune Chart", sanskrit: "Chaturthamsa", description: "Property, fixed assets, and luck" },
  { id: "D7", division: 7, english: "Children Chart", sanskrit: "Saptamsa", description: "Children and creative legacy" },
  { id: "D9", division: 9, english: "Soul Chart", sanskrit: "Navamsa", description: "Marriage, dharma, and soul purpose" },
  { id: "D10", division: 10, english: "Career Chart", sanskrit: "Dasamsa", description: "Profession, status, and public life" },
  { id: "D12", division: 12, english: "Ancestry Chart", sanskrit: "Dwadasamsa", description: "Parents, ancestry, and karmic inheritance" },
  { id: "D16", division: 16, english: "Vehicles Chart", sanskrit: "Shodasamsa", description: "Vehicles, comforts, and pleasures" },
  { id: "D20", division: 20, english: "Spiritual Chart", sanskrit: "Vimsamsa", description: "Spiritual practices and inner growth" },
  { id: "D24", division: 24, english: "Learning Chart", sanskrit: "Chaturvimsamsa", description: "Education, skills, and knowledge" },
  { id: "D27", division: 27, english: "Strength Chart", sanskrit: "Saptvimsamsa", description: "Physical strength and vitality" },
  { id: "D30", division: 30, english: "Karma Chart", sanskrit: "Trimsamsa", description: "Misfortunes, challenges, and past karma" },
  { id: "D40", division: 40, english: "Maternal Chart", sanskrit: "Khavedamsa", description: "Auspicious and inauspicious tendencies" },
  { id: "D45", division: 45, english: "Paternal Chart", sanskrit: "Akshavedamsa", description: "General well-being and character" },
  { id: "D60", division: 60, english: "Destiny Chart", sanskrit: "Shashtyamsa", description: "Past life karma and destiny" },
];

const ZODIAC_SIGNS = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

const DEBILITATION: Record<string, number> = {
  Sun: 7,    // Libra
  Moon: 8,   // Scorpio
  Mars: 4,   // Cancer
  Mercury: 12, // Pisces
  Jupiter: 10, // Capricorn
  Venus: 6,   // Virgo
  Saturn: 1,  // Aries
};

export default function DivisionalChartsPage() {
  const { id } = useParams<{ id: string }>();
  const { data: astroData } = useAstro();
  const [activeVarga, setActiveVarga] = useState<VargaInfo>(VARGAS[0]);
  const [chartData, setChartData] = useState<ShodashvargaChart | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchVargaData = useCallback(async () => {
    if (id === "me") {
      if (astroData?.chart?.shodashvarga) {
        const vargaKey = activeVarga.id;
        const vargaData = astroData.chart.shodashvarga[vargaKey];
        if (vargaData) {
          setChartData(vargaData);
          setError(false);
          setLoading(false);
          return;
        }
      }
      // If we are on 'me' but have no data, it's an error
      setError(true);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(false);
    try {
      const response = await fetch(`/api/chart/${id}/varga?division=${activeVarga.division}`);
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();
      setChartData(data);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [id, activeVarga, astroData]);

  useEffect(() => {
    fetchVargaData();
  }, [fetchVargaData]);

  const getPlanetInfo = (data: ShodashvargaChart) => {
    const lagnaSign = Math.floor(data.Lagna / 30) + 1;
    const planets = Object.entries(data)
      .filter(([name]) => name !== "Lagna")
      .map(([name, lon]) => {
        const signNum = Math.floor((lon as number) / 30) + 1;
        const houseNum = (signNum - lagnaSign + 12) % 12 + 1;
        return { name, sign: ZODIAC_SIGNS[signNum - 1], house: houseNum, signNum };
      });

    const keyPlanets = planets.slice(0, 3);
    const debilitated = planets.find(p => DEBILITATION[p.name] === p.signNum);

    return { keyPlanets, debilitated };
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8 space-y-8">
      {/* Tab Strip */}
      <div className="sticky top-0 z-30 bg-black/80 backdrop-blur-md border-b border-gold/10 -mx-4 md:-mx-8 px-4 md:px-8">
        <div className="flex gap-6 overflow-x-auto py-4 scrollbar-none">
          {VARGAS.map((v) => (
            <button
              key={v.id}
              onClick={() => setActiveVarga(v)}
              className={`text-xs font-bold tracking-widest uppercase whitespace-nowrap pb-2 transition-all border-b-2 ${
                activeVarga.id === v.id
                  ? "text-gold border-gold"
                  : "text-gray-500 border-transparent hover:text-gray-300"
              }`}
            >
              {v.id}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-pulse">
          <div className="aspect-square bg-white/5 rounded-sm border border-gold/10" />
          <div className="space-y-6">
            <div className="h-10 bg-white/5 w-1/2" />
            <div className="h-20 bg-white/5" />
            <div className="h-32 bg-white/5" />
          </div>
        </div>
      ) : error ? (
        <div className="h-[50vh] flex flex-col items-center justify-center text-center space-y-6">
          <AlertCircle className="w-12 h-12 text-red-500/50" />
          <div className="space-y-2">
            <h2 className="text-xl font-serif">Chart data unavailable</h2>
            <p className="text-sm text-gray-500">The celestial engine encountered an alignment error.</p>
          </div>
          <button
            onClick={fetchVargaData}
            className="flex items-center gap-2 px-6 py-3 bg-gold/10 border border-gold/20 text-gold text-xs uppercase tracking-widest hover:bg-gold/20 transition-all"
          >
            <RefreshCcw className="w-4 h-4" />
            Retry Connection
          </button>
        </div>
      ) : chartData ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* LEFT: Chart */}
          <div className="hud-module p-6 bg-gold/5 border border-gold/10 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-5">
                <Grid3x3 className="w-32 h-32 text-gold" />
             </div>
            <NorthIndianChart data={chartData} title={`${activeVarga.english} (${activeVarga.sanskrit})`} />
          </div>

          {/* RIGHT: Info Panel */}
          <div className="space-y-8">
            <div className="space-y-2">
              <h1 className="text-4xl font-serif text-white uppercase tracking-tight">
                {activeVarga.english}
              </h1>
              <p className="text-gold/60 text-sm italic font-medium">
                {activeVarga.sanskrit}
              </p>
            </div>

            <div className="hud-module p-6 bg-gold/5 border border-gold/10 space-y-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-gold/40">
                  <Info className="w-4 h-4" />
                  <span className="text-[10px] uppercase tracking-widest font-bold">Revelation</span>
                </div>
                <p className="text-gray-300 leading-relaxed">
                  {activeVarga.description}. This varga provides a deep-dive into specific karmic dimensions of your existence.
                </p>
              </div>

              <div className="h-px bg-gold/10" />

              <div className="space-y-4">
                <span className="text-[10px] uppercase tracking-widest text-gold/40 font-bold block">Key Planetary Alignments</span>
                <div className="grid gap-3">
                  {getPlanetInfo(chartData).keyPlanets.map((p) => (
                    <div key={p.name} className="flex items-center justify-between p-3 bg-white/5 border border-white/5 rounded-sm">
                      <span className="text-sm font-bold text-white">{p.name}</span>
                      <span className="text-xs text-gray-400">
                        {p.sign} <span className="text-gold/60 mx-1">·</span> House {p.house}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {getPlanetInfo(chartData).debilitated && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-red-500/10 border border-red-500/20 rounded-sm space-y-2"
                >
                  <span className="text-[10px] uppercase tracking-widest text-red-400 font-black block">Watch out for</span>
                  <p className="text-sm text-red-200">
                    {getPlanetInfo(chartData).debilitated?.name} is debilitated in {getPlanetInfo(chartData).debilitated?.sign}. This may indicate challenges or weakened expression of its natural significations in this life area.
                  </p>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
