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
          // Fallback to New Delhi if denied
          fetchPanchang(28.6139, 77.2090);
        }
      );
    } else {
      fetchPanchang(28.6139, 77.2090);
    }
  }, [natalData]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-12 h-12 border-2 border-gold/20 border-t-gold rounded-full animate-spin"></div>
        <p className="text-gold/60 text-sm animate-pulse tracking-widest uppercase text-center px-4">Consulting the celestial limbs...</p>
      </div>
    );
  }

  if (error || !panchang) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
        <AlertTriangle className="w-12 h-12 text-red-500 mb-4 opacity-50" />
        <h2 className="text-xl font-light text-white mb-2">Panchang Unavailable</h2>
        <p className="text-white/40 max-w-md">We couldn't calculate the current lunar elements. Please check your connection.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 pb-32">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 space-y-4 md:space-y-0 border-b border-white/5 pb-8">
        <div>
          <h1 className="text-4xl font-light tracking-tight text-white mb-1">
            Panchang
          </h1>
          <div className="flex items-center space-x-2">
            <p className="text-gold text-xs uppercase tracking-[0.4em] font-medium opacity-80">
              Vedic Calendar
            </p>
            <span className="text-white/20 text-[10px]">•</span>
            <span className="text-white/40 text-[10px] font-mono tracking-wider">{cityName}</span>
          </div>
        </div>
        
        <div className="flex flex-col items-end space-y-2">
          <div className="text-[10px] uppercase tracking-widest text-white/40 font-medium">Lunar Environment</div>
          <div className="flex items-center space-x-3 bg-gold/10 border border-gold/20 px-4 py-2 rounded-full backdrop-blur-md">
            <Moon className="w-3 h-3 text-gold" />
            <span className="text-xs text-gold font-semibold uppercase tracking-wider">
              {panchang.moon_sign} {panchang.moon_degree.toFixed(1)}°
            </span>
          </div>
        </div>
      </div>

      {/* 5 Elements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <PanchangCard 
          title="Tithi (Lunar Day)" 
          data={panchang.tithi} 
          index={0} 
          icon={<Moon className="w-6 h-6 text-gold/80" />} 
        />
        <PanchangCard 
          title="Vara (Weekday)" 
          data={panchang.vara} 
          index={1} 
          icon={<Sun className="w-6 h-6 text-gold" />} 
        />
        <PanchangCard 
          title="Nakshatra (Asterism)" 
          data={panchang.nakshatra} 
          index={2} 
          icon={<Star className="w-6 h-6 text-gold/60" />} 
        />
        <PanchangCard 
          title="Yoga (Luni-Solar)" 
          data={panchang.yoga} 
          index={3} 
          icon={<Zap className="w-6 h-6 text-gold" />} 
        />
        <PanchangCard 
          title="Karana (Half-Tithi)" 
          data={panchang.karana} 
          index={4} 
          icon={<Compass className="w-6 h-6 text-white/60" />} 
        />

        {/* Day Stats Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gold/5 border border-gold/20 rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between"
        >
          <div className="flex justify-between items-start mb-6">
            <div className="p-3 bg-gold/10 border border-gold/20 rounded-2xl">
              <Clock className="w-6 h-6 text-gold" />
            </div>
            <div className="text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full border border-gold/30 text-gold bg-gold/10">
              Solar Times
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-gold/10 pb-2">
              <div className="flex items-center space-x-2">
                <Sunrise className="w-4 h-4 text-gold opacity-60" />
                <span className="text-xs text-white/60">Sunrise</span>
              </div>
              <span className="text-sm font-medium text-white">{panchang.sunrise}</span>
            </div>
            <div className="flex justify-between items-center border-b border-gold/10 pb-2">
              <div className="flex items-center space-x-2">
                <Sunset className="w-4 h-4 text-gold opacity-60" />
                <span className="text-xs text-white/60">Sunset</span>
              </div>
              <span className="text-sm font-medium text-white">{panchang.sunset}</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Timeline Bar Section */}
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <Clock className="w-5 h-5 text-gold opacity-60" />
          <h2 className="text-lg font-light text-white tracking-wide">Daily Timeline</h2>
        </div>

        <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 backdrop-blur-sm">
          <div className="relative h-12 bg-white/5 rounded-full overflow-hidden flex items-center px-4">
            {/* Timeline markers */}
            <div className="absolute inset-0 flex justify-between px-8 items-center pointer-events-none">
              {[6, 8, 10, 12, 14, 16, 18].map(h => (
                <span key={h} className="text-[10px] text-white/20 font-mono">{h}:00</span>
              ))}
            </div>

            {/* Abhijit Muhurta (Gold block) */}
            {/* Approx 11:40 - 12:20 is ~40% to 50% width if 6am-6pm is the scale */}
            <motion.div 
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              className="absolute h-full bg-gold/20 border-x border-gold/40 flex items-center justify-center"
              style={{ left: '46%', width: '8%' }}
            >
              <div className="text-[8px] uppercase tracking-tighter text-gold font-bold rotate-90 md:rotate-0 whitespace-nowrap">
                Abhijit
              </div>
            </motion.div>

            {/* Rahukalam (Red block) */}
            {/* Varies by day, let's say 3pm-4:30pm (75% to 87%) */}
            <motion.div 
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              className="absolute h-full bg-red-500/20 border-x border-red-500/40 flex items-center justify-center"
              style={{ left: '75%', width: '12%' }}
            >
              <div className="text-[8px] uppercase tracking-tighter text-red-400 font-bold rotate-90 md:rotate-0 whitespace-nowrap">
                Rahu
              </div>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-gold rounded-full"></div>
                <h3 className="text-sm font-medium text-white">Abhijit Muhurta</h3>
              </div>
              <p className="text-xs text-white/40 leading-relaxed">
                The most auspicious time of the day. Ideal for starting new ventures, signing contracts, or important meetings. {panchang.abhijit.start} — {panchang.abhijit.end}.
              </p>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <h3 className="text-sm font-medium text-white">Rahukalam</h3>
              </div>
              <p className="text-xs text-white/40 leading-relaxed">
                A period influenced by Rahu where new beginnings should be avoided. Generally considered inauspicious for major transactions. {panchang.rahukalam.start} — {panchang.rahukalam.end}.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
