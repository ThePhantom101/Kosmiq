"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, Sparkles, Globe, Navigation, Cpu } from "lucide-react";
import { useRouter } from "next/navigation";

import { calculateChart } from "@/actions/calculate";
import { searchLocation, getTimezone } from "@/actions/location";
import { CombinedChartResponse } from "@/types/astro";

interface LocationFeature {
  geometry: {
    coordinates: [number, number];
  };
  properties: {
    name: string;
    city?: string;
    country?: string;
  };
}

interface BirthFormProps {
  onResult?: (result: CombinedChartResponse) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export default function BirthForm({ onResult, isLoading, setIsLoading }: BirthFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    date: "",
    time: "",
    lat: 12.9716,
    long: 77.5946,
    tz: 5.5,
  });

  const [locationSearch, setLocationSearch] = useState("");
  const [suggestions, setSuggestions] = useState<LocationFeature[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^0-9]/g, "");
    if (value.length > 4) {
      value = value.slice(0, 4) + "-" + value.slice(4);
    }
    if (value.length > 7) {
      value = value.slice(0, 7) + "-" + value.slice(7);
    }
    setFormData({ ...formData, date: value.slice(0, 10) });
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^0-9:]/g, "");
    if (value.length === 2 && !value.includes(":")) value += ":";
    setFormData({ ...formData, time: value.slice(0, 5) });
  };

  const handleLocationSearch = async (query: string) => {
    setLocationSearch(query);
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }

    setIsSearching(true);
    try {
      const data = await searchLocation(query);
      setSuggestions(data.features || []);
      setShowSuggestions(true);
    } catch (err) {
      console.error("Location search failed", err);
    } finally {
      setIsSearching(false);
    }
  };

  const selectLocation = async (feature: LocationFeature) => {
    const [lon, lat] = feature.geometry.coordinates;
    const name = feature.properties.name + (feature.properties.city ? `, ${feature.properties.city}` : "") + (feature.properties.country ? `, ${feature.properties.country}` : "");
    
    setLocationSearch(name);
    setShowSuggestions(false);
    
    setFormData(prev => ({ ...prev, lat, long: lon }));

    // Fetch Timezone
    try {
      const tzData = await getTimezone(lat, lon);
      if (tzData && tzData.currentUtcOffset) {
        const offsetHours = tzData.currentUtcOffset.seconds / 3600;
        setFormData(prev => ({ ...prev, tz: offsetHours }));
      }
    } catch (err) {
      console.error("Timezone fetch failed", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const result = await calculateChart({
        date_of_birth: formData.date,
        time_of_birth: formData.time.includes(":") ? formData.time + ":00" : formData.time, 
        latitude: formData.lat,
        longitude: formData.long,
        timezone_offset: formData.tz,
      });
      
      if (onResult) {
        onResult(result);
      }
      // Auto-redirect to astrolabe
      router.push("/chart/me/divisional");
    } catch (error) {
      const message = error instanceof Error ? error.message : "An unknown error occurred";
      alert("Submission failed: " + message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl w-full mx-auto"
    >
      <div className="hud-module p-10 relative overflow-hidden group">
        {/* Technical Deco */}
        <div className="absolute top-4 right-4 flex space-x-2">
          <div className="w-1 h-1 bg-gold rounded-full animate-pulse" />
          <div className="w-1 h-1 bg-gold rounded-full animate-pulse delay-75" />
          <div className="w-1 h-1 bg-gold rounded-full animate-pulse delay-150" />
        </div>
        <div className="absolute bottom-4 left-4 font-mono text-[10px] text-gold/30 uppercase tracking-widest">
          Engine: Astro-v1.4 // Lahiri Ayanamsa
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
          <div className="space-y-2 text-center">
            <span className="overline-label">Birth Details</span>
            <h2 className="text-4xl font-serif text-white tracking-tight">Your Kundli</h2>
            <p className="text-gray-500 text-sm font-sans italic">Enter your birth details to generate your precise Vedic chart.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            {/* Name */}
            <div className="col-span-full space-y-1">
              <label className="text-[10px] uppercase tracking-[0.2em] text-gold/60 font-semibold block ml-1">
                Your Name
              </label>
              <input
                type="text"
                placeholder="Your Name"
                className="w-full bg-black/60 border border-gold/20 rounded-sm px-4 py-3 focus:outline-none focus:border-gold/50 transition-all placeholder:text-gray-700 text-white font-mono text-sm"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            {/* Date */}
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-[0.2em] text-gold/60 font-semibold block ml-1">
                Birth Date (YYYY-MM-DD)
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gold/40" />
                <input
                  type="text"
                  placeholder="1990-05-12"
                  maxLength={10}
                  className="w-full bg-black/60 border border-gold/20 rounded-sm pl-10 pr-4 py-3 focus:outline-none focus:border-gold/50 transition-all text-white font-mono text-sm"
                  value={formData.date}
                  onChange={handleDateChange}
                  required
                />
              </div>
            </div>

            {/* Time */}
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-[0.2em] text-gold/60 font-semibold block ml-1">
                Birth Time (HH:MM)
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gold/40" />
                <input
                  type="text"
                  placeholder="14:30"
                  maxLength={5}
                  className="w-full bg-black/60 border border-gold/20 rounded-sm pl-10 pr-4 py-3 focus:outline-none focus:border-gold/50 transition-all text-white font-mono text-sm"
                  value={formData.time}
                  onChange={handleTimeChange}
                  required
                />
              </div>
            </div>

            {/* Location Search - New Field */}
            <div className="col-span-full space-y-1 relative">
              <label className="text-[10px] uppercase tracking-[0.2em] text-gold/60 font-semibold block ml-1">
                Birth Location Search
              </label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gold/40" />
                <input
                  type="text"
                  placeholder="Search city (e.g. London, Tokyo...)"
                  className="w-full bg-black/60 border border-gold/20 rounded-sm pl-10 pr-4 py-3 focus:outline-none focus:border-gold/50 transition-all placeholder:text-gray-700 text-white font-mono text-sm"
                  value={locationSearch}
                  onChange={(e) => handleLocationSearch(e.target.value)}
                  onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                />
                {isSearching && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <div className="w-4 h-4 border-2 border-gold/20 border-t-gold animate-spin rounded-full" />
                  </div>
                )}
              </div>

              {/* Suggestions Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-black/90 border border-gold/30 rounded-sm shadow-2xl backdrop-blur-md max-h-60 overflow-y-auto">
                  {suggestions.map((s, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => selectLocation(s)}
                      className="w-full text-left px-4 py-3 text-sm text-white/80 hover:bg-gold/10 hover:text-white transition-colors border-b border-gold/5 last:border-0"
                    >
                      <span className="font-semibold">{s.properties.name}</span>
                      <span className="text-gold/40 text-xs ml-2">
                        {s.properties.city ? `${s.properties.city}, ` : ""}{s.properties.country}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Coordinates Grid */}
            <div className="col-span-full grid grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-[0.2em] text-gold/60 font-semibold block ml-1">
                  Latitude
                </label>
                <div className="relative">
                  <Navigation className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gold/40" />
                  <input
                    type="number"
                    step="any"
                    className="w-full bg-black/60 border border-gold/20 rounded-sm pl-10 pr-4 py-3 focus:outline-none focus:border-gold/50 transition-all text-white font-mono text-sm"
                    value={formData.lat}
                    onChange={(e) => setFormData({ ...formData, lat: parseFloat(e.target.value) })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-[0.2em] text-gold/60 font-semibold block ml-1">
                  Longitude
                </label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gold/40" />
                  <input
                    type="number"
                    step="any"
                    className="w-full bg-black/60 border border-gold/20 rounded-sm pl-10 pr-4 py-3 focus:outline-none focus:border-gold/50 transition-all text-white font-mono text-sm"
                    value={formData.long}
                    onChange={(e) => setFormData({ ...formData, long: parseFloat(e.target.value) })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-[0.2em] text-gold/60 font-semibold block ml-1">
                  Timezone
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gold/40" />
                  <input
                    type="number"
                    step="0.5"
                    className="w-full bg-black/60 border border-gold/20 rounded-sm pl-10 pr-4 py-3 focus:outline-none focus:border-gold/50 transition-all text-white font-mono text-sm"
                    value={formData.tz}
                    onChange={(e) => setFormData({ ...formData, tz: parseFloat(e.target.value) })}
                    required
                  />
                </div>
              </div>
            </div>

          </div>

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            type="submit"
            disabled={isLoading}
            className={`w-full group/btn overflow-hidden relative border border-gold/40 bg-gold/5 hover:bg-gold/10 text-gold font-bold py-5 rounded-sm transition-all shadow-lg flex items-center justify-center space-x-3 ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {/* Shimmer Effect */}
            <div className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-gold/10 to-transparent" />
            
            {isLoading ? (
              <div className="flex items-center gap-3">
                <Cpu className="w-5 h-5 animate-spin" />
                <span className="uppercase tracking-[0.3em] text-sm">Synthesizing...</span>
              </div>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span className="uppercase tracking-[0.3em] text-sm">Generate Kundli</span>
              </>
            )}
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
}

