"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAstro } from "@/context/AstroContext";
import { PanchangResponse } from "@/types/astro";
import PanchangCard from "@/components/sky/PanchangCard";
import { 
  Moon, Sun, Calendar, Zap, Compass, 
  Sunrise, Sunset, Clock, AlertTriangle, Star
} from "lucide-react";

import { IntelligenceCard } from "@/components/dashboard/IntelligenceCard";
import type { LucideIcon } from "lucide-react";

export default function PanchangPage() {
  const { data: natalData } = useAstro();
  const [panchang, setPanchang] = useState<PanchangResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [location, setLocation] = useState<{ lat: number; lng: number }>({ lat: 28.6139, lng: 77.2090 });
  const [cityName, setCityName] = useState("New Delhi, IN");

  useEffect(() => {
    const fetchPanchang = async (lat: number, lng: number) => {
      try {
        const res = await fetch(`/api/sky/panchang?date=today&lat=${lat}&lng=${lng}`);
        if (!res.ok) throw new Error("Failed to fetch Panchang");
        const json = await res.json();
        setPanchang(json);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (typeof window !== "undefined" && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setLocation({ lat: latitude, lng: longitude });
          setCityName(`${latitude.toFixed(2)}°N, ${longitude.toFixed(2)}°E`);
          fetchPanchang(latitude, longitude);
        },
        () => {
          fetchPanchang(28.6139, 77.2090);
        }
      );
    } else {
      fetchPanchang(28.6139, 77.2090);
    }
  }, [natalData]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8">
        <div className="relative w-16 h-16">
           <div className="absolute inset-0 border-2 border-gold/10 rounded-full" />
           <div className="absolute inset-0 border-2 border-gold border-t-transparent rounded-full animate-spin" />
           <div className="absolute inset-0 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-gold/40" />
           </div>
        </div>
        <p className="text-gold/60 text-[10px] font-black tracking-[0.4em] uppercase animate-pulse">Consulting Universal Harmonics</p>
      </div>
    );
  }

  if (error || !panchang) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 space-y-6">
        <div className="relative">
           <AlertTriangle className="w-16 h-16 text-red-500/20" />
           <div className="absolute inset-0 blur-xl bg-red-500/10" />
        </div>
        <div className="space-y-2">
           <h2 className="text-2xl font-serif uppercase tracking-tight text-white">Almanac Desync</h2>
           <p className="text-xs text-zinc-500 uppercase font-black tracking-widest max-w-md mx-auto">We couldn't calculate the current celestial elements. Verify connectivity.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 pb-32 space-y-24">
      {/* HEADER: DAILY ALCHEMIST */}
      <section className="flex flex-col md:flex-row items-center justify-between gap-8 pb-12 border-b border-white/5">
        <div className="space-y-4 text-center md:text-left">
           <div className="flex items-center justify-center md:justify-start gap-4">
              <span className="overline-label text-gold/60 tracking-[0.4em]">Universal Rhythms</span>
              <div className="h-[1px] w-12 bg-gold/20" />
           </div>
           <h1 className="text-6xl md:text-8xl font-serif text-white tracking-tighter uppercase leading-[0.8]">
             Daily <br /> <span className="text-gold">Almanac</span>
           </h1>
           <div className="flex items-center justify-center md:justify-start gap-3 pt-4">
              <div className="text-[10px] text-zinc-500 font-mono uppercase">Coord: {cityName}</div>
              <div className="w-1 h-1 bg-zinc-800 rounded-full" />
              <div className="text-[10px] text-zinc-500 font-mono uppercase">LMT Alignment: Enabled</div>
           </div>
        </div>

        <div className="flex flex-col items-center md:items-end gap-3 bg-white/[0.02] border border-white/5 p-8 rounded-sm backdrop-blur-sm">
           <div className="flex items-center gap-3">
              <Moon className="w-4 h-4 text-gold/60" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Lunar Environment</span>
           </div>
           <div className="text-2xl font-serif text-white uppercase tracking-tight">
             {panchang.moon_sign} <span className="text-gold/40 mx-2">/</span> {panchang.moon_degree.toFixed(1)}°
           </div>
           <div className="text-[9px] text-zinc-700 font-black uppercase tracking-tighter">Current Transit Context</div>
        </div>
      </section>

      {/* 5 ELEMENTS GRID */}
      <section className="space-y-12">
        <div className="flex items-center gap-3">
           <Zap className="w-4 h-4 text-gold/60" />
           <span className="overline-label text-gold/60">The Five Elements (Panchang)</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <IntelligenceCard 
            title="Tithi" 
            subtitle="Lunar Phase" 
            status={panchang.tithi.quality === "Auspicious" ? "Opportunity" : panchang.tithi.quality === "Inauspicious" ? "Caution" : "Neutral"} 
            icon={Moon}
          >
            <div className="space-y-4">
               <div className="text-3xl font-serif text-white uppercase tracking-tighter">{panchang.tithi.name}</div>
               <p className="text-[10px] text-zinc-500 font-bold uppercase leading-relaxed tracking-widest">Controls the psychological and emotional landscape of the day.</p>
            </div>
          </IntelligenceCard>

          <IntelligenceCard 
            title="Vara" 
            subtitle="Solar Day" 
            status={panchang.vara.quality === "Auspicious" ? "Opportunity" : panchang.vara.quality === "Inauspicious" ? "Caution" : "Neutral"} 
            icon={Sun}
          >
            <div className="space-y-4">
               <div className="text-3xl font-serif text-white uppercase tracking-tighter">{panchang.vara.name}</div>
               <p className="text-[10px] text-zinc-500 font-bold uppercase leading-relaxed tracking-widest">Governs the vitality and the primary energy available for action.</p>
            </div>
          </IntelligenceCard>

          <IntelligenceCard 
            title="Nakshatra" 
            subtitle="Stellar Mansion" 
            status={panchang.nakshatra.quality === "Auspicious" ? "Opportunity" : panchang.nakshatra.quality === "Inauspicious" ? "Caution" : "Neutral"} 
            icon={Star}
          >
            <div className="space-y-4">
               <div className="text-3xl font-serif text-white uppercase tracking-tighter">{panchang.nakshatra.name}</div>
               <p className="text-[10px] text-zinc-500 font-bold uppercase leading-relaxed tracking-widest">Influences the deep subconscious and biological predispositions.</p>
            </div>
          </IntelligenceCard>

          <IntelligenceCard 
            title="Yoga" 
            subtitle="Luni-Solar Harmony" 
            status={panchang.yoga.quality === "Auspicious" ? "Opportunity" : panchang.yoga.quality === "Inauspicious" ? "Caution" : "Neutral"} 
            icon={Zap}
          >
            <div className="space-y-4">
               <div className="text-3xl font-serif text-white uppercase tracking-tighter">{panchang.yoga.name}</div>
               <p className="text-[10px] text-zinc-500 font-bold uppercase leading-relaxed tracking-widest">Determines the overall quality of resonance and structural integrity.</p>
            </div>
          </IntelligenceCard>

          <IntelligenceCard 
            title="Karana" 
            subtitle="Sub-Lunar Power" 
            status={panchang.karana.quality === "Auspicious" ? "Opportunity" : panchang.karana.quality === "Inauspicious" ? "Caution" : "Neutral"} 
            icon={Compass}
          >
            <div className="space-y-4">
               <div className="text-3xl font-serif text-white uppercase tracking-tighter">{panchang.karana.name}</div>
               <p className="text-[10px] text-zinc-500 font-bold uppercase leading-relaxed tracking-widest">Governs the results of physical efforts and material pursuits.</p>
            </div>
          </IntelligenceCard>

          {/* SOLAR METRICS HUD */}
          <div className="hud-module p-8 flex flex-col justify-between border-gold/10 bg-gold/[0.02]">
            <div className="flex justify-between items-start">
               <div className="space-y-1">
                  <div className="text-[8px] font-black uppercase tracking-[0.3em] text-gold/40">Solar Metrics</div>
                  <div className="text-lg font-serif text-white uppercase">Atmosphere</div>
               </div>
               <Sunrise className="w-5 h-5 text-gold/20" />
            </div>

            <div className="space-y-6 mt-8">
               <div className="flex justify-between items-end border-b border-white/5 pb-2">
                  <div className="text-[9px] font-black uppercase tracking-widest text-zinc-600">Sunrise</div>
                  <div className="text-xl font-serif text-white">{panchang.sunrise}</div>
               </div>
               <div className="flex justify-between items-end border-b border-white/5 pb-2">
                  <div className="text-[9px] font-black uppercase tracking-widest text-zinc-600">Sunset</div>
                  <div className="text-xl font-serif text-white">{panchang.sunset}</div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* TIMELINE: TEMPORAL DYNAMICS */}
      <section className="space-y-12">
        <div className="flex items-center gap-3">
           <Clock className="w-4 h-4 text-gold/60" />
           <span className="overline-label text-gold/60">Temporal Dynamics</span>
        </div>

        <div className="hud-module p-12 space-y-16">
          {/* Progress Bar Container */}
          <div className="relative">
             <div className="h-1 bg-white/5 w-full rounded-full" />
             
             {/* Timeline Labels */}
             <div className="absolute -top-8 left-0 right-0 flex justify-between px-2">
                {[6, 9, 12, 15, 18].map(h => (
                   <span key={h} className="text-[8px] font-mono text-zinc-700 uppercase">{h}:00</span>
                ))}
             </div>

             {/* Abhijit Highlight */}
             <motion.div 
               initial={{ opacity: 0, scaleX: 0 }}
               animate={{ opacity: 1, scaleX: 1 }}
               className="absolute top-0 bottom-0 bg-gold/40 border-x border-gold shadow-[0_0_20px_rgba(201,168,76,0.2)]"
               style={{ left: '46%', width: '8%', height: '4px', top: '-1.5px' }}
             />

             {/* Rahu Highlight */}
             <motion.div 
               initial={{ opacity: 0, scaleX: 0 }}
               animate={{ opacity: 1, scaleX: 1 }}
               className="absolute top-0 bottom-0 bg-red-500/40 border-x border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.2)]"
               style={{ left: '75%', width: '12%', height: '4px', top: '-1.5px' }}
             />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div className="space-y-4 group">
               <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 bg-gold rounded-full group-hover:scale-150 transition-transform shadow-[0_0_10px_rgba(201,168,76,0.8)]" />
                  <h3 className="text-lg font-serif text-white uppercase tracking-tight">Abhijit Muhurta</h3>
               </div>
               <div className="text-xl font-serif text-gold/60 tracking-widest">{panchang.abhijit.start} — {panchang.abhijit.end}</div>
               <p className="text-xs text-zinc-500 leading-relaxed italic uppercase tracking-wider opacity-60">
                 The zenith point of solar clarity. Ideal for initiation of strategic objectives and structural changes.
               </p>
            </div>

            <div className="space-y-4 group">
               <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full group-hover:scale-150 transition-transform shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
                  <h3 className="text-lg font-serif text-white uppercase tracking-tight">Rahukalam</h3>
               </div>
               <div className="text-xl font-serif text-red-500/60 tracking-widest">{panchang.rahukalam.start} — {panchang.rahukalam.end}</div>
               <p className="text-xs text-zinc-500 leading-relaxed italic uppercase tracking-wider opacity-60">
                 A period of distorted perception and karmic friction. Recommended for internal retrospection and maintenance only.
               </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
