"use client";

import React, { useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ChartHeroBanner } from "@/components/overview/ChartHeroBanner";
import { MetricCards, MetricCardsSkeleton } from "@/components/overview/MetricCards";
import { LifeAtAGlance } from "@/components/overview/LifeAtAGlance";
import { CurrentAlerts } from "@/components/overview/CurrentAlerts";
import { QuickLinks } from "@/components/overview/QuickLinks";
import { useChartStrengths } from "@/hooks/useChartStrengths";
import { useAstro } from "@/context/AstroContext";
import { useDasha } from "@/hooks/useDasha";
import { useYogas } from "@/hooks/useYogas";
import NorthIndianChart from "@/components/NorthIndianChart";
import { PlanetPlacements } from "@/components/overview/PlanetPlacements";
import ReactMarkdown from "react-markdown";
import { Sparkles, LayoutGrid } from "lucide-react";
import { motion } from "framer-motion";
import type { OverviewMetrics, LifeGlance, TransitAlert, ChartHero } from "@/types/overview";

const SIGNS = [
  "Aries", "Taurus", "Gemini", "Cancer",
  "Leo", "Virgo", "Libra", "Scorpio",
  "Sagittarius", "Capricorn", "Aquarius", "Pisces",
];

const PLANET_LORDS: Record<string, string> = {
  Aries: "Mars", Taurus: "Venus", Gemini: "Mercury", Cancer: "Moon",
  Leo: "Sun", Virgo: "Mercury", Libra: "Venus", Scorpio: "Mars",
  Sagittarius: "Jupiter", Capricorn: "Saturn", Aquarius: "Saturn", Pisces: "Jupiter",
};

const PLANET_SANSKRIT: Record<string, string> = {
  Sun: "Surya", Moon: "Chandra", Mars: "Mangala", Mercury: "Budha",
  Jupiter: "Guru", Venus: "Shukra", Saturn: "Shani", Rahu: "Rahu", Ketu: "Ketu",
};

function getSign(lon: number) {
  return SIGNS[Math.floor(lon / 30) % 12];
}

export default function OverviewPage() {
  const params = useParams<{ id: string }>();
  const chartId = params?.id ?? "me";

  const { data: astroData, isLoading: isAstroLoading, error: astroError } = useAstro();
  const { data: dashaData, isLoading: isDashaLoading, error: dashaError } = useDasha();
  const { data: yogasData, isLoading: isYogasLoading, error: yogasError } = useYogas();
  const { strongestPlanet, weakestPlanet, bestHouse, isLive, isLoading: isStrengthsLoading, error: strengthsError } = useChartStrengths();
  
  const isLoading = isAstroLoading || isDashaLoading || isYogasLoading || isStrengthsLoading;
  const error = astroError || dashaError || yogasError || strengthsError;

  // 1. DATA DERIVATION
  const derivedData = useMemo(() => {
    if (!astroData?.chart) return null;
    const chart = astroData.chart;

    // 1. ASTRO SCORE CALCULATION
    const avTotals = (chart.ashtakavarga as any)?.house_totals || {};
    const totalBindhu = Object.values(avTotals).reduce((a: number, b: any) => a + Number(b), 0);
    const normalizedBindhu = (totalBindhu / 337) * 100;

    const dashaLord = dashaData?.current_mahadasha?.lord || "Sun";
    const dashaLordStrength = chart.planetary_strengths[dashaLord] ?? 50;
    
    let dignityBonus = 0;
    if (dashaLordStrength >= 85) dignityBonus = 10;
    else if (dashaLordStrength >= 70) dignityBonus = 7;
    else if (dashaLordStrength >= 55) dignityBonus = 4;
    else if (dashaLordStrength >= 40) dignityBonus = 0;
    else if (dashaLordStrength >= 20) dignityBonus = -4;
    else dignityBonus = -10;

    const favorableYogas = yogasData?.yogas.filter(y => y.present && y.category !== "Challenging") || [];
    const yogaBonus = Math.min(15, favorableYogas.length * 3);

    const astroScore = Math.round(Math.max(0, Math.min(100, normalizedBindhu + dignityBonus + yogaBonus)));

    // 2. HERO DATA
    const birthData = astroData.birth_data;
    const hero: ChartHero = {
      name: birthData?.name || chart.metadata.name || "Seeker",
      dateOfBirth: birthData?.date || new Date(chart.metadata.jd ? (chart.metadata.jd - 2440587.5) * 86400000 : Date.now()).toISOString().split('T')[0],
      timeOfBirth: birthData?.time || "Birth Time", 
      placeOfBirth: birthData?.location || "Celestial Coordinates",
      lagna: getSign(chart.ascendant),
      lagnaLord: PLANET_LORDS[getSign(chart.ascendant)],
      moonSign: getSign(chart.planets.Moon?.longitude || 0),
      moonNakshatra: chart.planets.Moon?.nakshatra?.name || "Unknown",
      sunSign: getSign(chart.planets.Sun?.longitude || 0),
      ascendantDegree: chart.ascendant % 30,
    };

    // 3. METRICS
    const metrics: OverviewMetrics = {
      strongestPlanet,
      weakestPlanet,
      bestHouse,
      astroScore,
      currentDasha: {
        mahadasha: dashaData?.current_mahadasha?.lord || "Unknown",
        mahadashaSanskrit: `${PLANET_SANSKRIT[dashaData?.current_mahadasha?.lord || "Sun"]} Mahadasha`,
        antardasha: dashaData?.current_antardasha?.lord || "Unknown",
        antardashaSanskrit: `${PLANET_SANSKRIT[dashaData?.current_antardasha?.lord || "Sun"]} Antardasha`,
        endsAt: dashaData?.current_mahadasha?.end || "",
        percentComplete: dashaData?.current_mahadasha?.percent_complete || 0,
      },
      yogaSummary: {
        count: yogasData?.yogas.length || 0,
        active: yogasData?.yogas.filter(y => y.present).map(y => y.name) || [],
        dormant: yogasData?.yogas.filter(y => !y.present).map(y => y.name) || [],
      }
    };

    // 4. LIFE AT A GLANCE
    const h = (house: number) => Number(avTotals[String(house)] || 28);
    const norm = (val: number) => Math.round((val / 48) * 100);
    const lifeGlance: LifeGlance = {
      career: norm(h(10)),
      wealth: norm((h(2) + h(11)) / 2),
      health: norm((h(1) + h(6)) / 2),
      relationships: norm(h(7)),
      creativity: norm(h(5)),
      spirituality: norm((h(9) + h(12)) / 2),
    };

    // 5. ALERTS
    const alerts: TransitAlert[] = [];
    
    // Sade Sati calculation
    const moonHouse = Math.floor((chart.planets.Moon?.longitude - chart.ascendant + 360) % 360 / 30) + 1;
    const saturnHouse = Math.floor((chart.planets.Saturn?.longitude - chart.ascendant + 360) % 360 / 30) + 1;
    const diffSaturnMoon = (saturnHouse - moonHouse + 12) % 12;
    
    if (diffSaturnMoon === 11 || diffSaturnMoon === 0 || diffSaturnMoon === 1) {
      alerts.push({
        type: "Sade Sati",
        severity: "warning",
        title: "Sade Sati Active",
        description: "Saturn is transiting your lunar domain. Focus on discipline and internal growth.",
      });
    }

    // Mangal Dosha
    const marsHouse = Math.floor((chart.planets.Mars?.longitude - chart.ascendant + 360) % 360 / 30) + 1;
    if ([1, 4, 7, 8, 12].includes(marsHouse)) {
      alerts.push({
        type: "Mangal Dosha",
        severity: "info",
        title: "Mangal Dosha Detected",
        description: "Mars is in a sensitive house. High energy in personal spheres needs conscious channeling.",
      });
    }

    if (alerts.length === 0) {
      alerts.push({
        type: "Favorable Transit",
        severity: "success",
        title: "Celestial Harmony",
        description: "No major challenging transits detected. A stable period for progression.",
      });
    }

    return { hero, metrics, lifeGlance, alerts };
  }, [astroData, dashaData, yogasData, strongestPlanet, weakestPlanet, bestHouse]);

  // LOADING STATE
  if (isLoading) {
    return (
      <div className="space-y-10 pb-20">
        <div className="h-64 bg-white/5 animate-pulse rounded-sm" />
        <MetricCardsSkeleton />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 h-[400px] bg-white/5 animate-pulse rounded-sm" />
          <div className="h-[400px] bg-white/5 animate-pulse rounded-sm" />
        </div>
      </div>
    );
  }

  // EMPTY STATE
  if (!astroData?.chart) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-6">
        <div className="p-6 bg-gold/5 border border-gold/10 rounded-full">
          <LayoutGrid className="w-12 h-12 text-gold/40" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-serif text-white">No Celestial Data Found</h2>
          <p className="text-gray-400 max-w-sm mx-auto text-sm">
            We couldn't locate your birth chart coordinates. Please generate a new chart to unlock the dashboard.
          </p>
        </div>
        <Link 
          href="/"
          className="bg-gold text-black font-bold uppercase tracking-widest text-xs px-8 py-4 rounded-sm hover:bg-gold/90 transition-all"
        >
          Generate New Chart
        </Link>
      </div>
    );
  }

  const { hero, metrics, lifeGlance, alerts } = derivedData!;

  return (
    <div className="space-y-10 pb-20">
      {/* Hero Banner */}
      <ChartHeroBanner hero={hero} />

      {/* Data Source Indicator */}
      {!isLive && !isLoading && (
        <div className="flex items-center gap-2 border border-gold/10 bg-gold/5 px-4 py-2">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-400/60" />
          <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-gray-500">
            No chart loaded — showing sample data. Generate a chart to see live intelligence.
          </p>
        </div>
      )}
      {isLoading && (
        <div className="flex items-center gap-2 border border-gold/10 bg-gold/5 px-4 py-2">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-gold/60" />
          <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-gray-500">
            Calculating cosmic alignment…
          </p>
        </div>
      )}
      {isLive && !isLoading && (
        <div className="flex items-center gap-2 border border-gold/10 bg-gold/5 px-4 py-2">
          <span className="h-1.5 w-1.5 rounded-full bg-gold" />
          <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-gold/60">
            Live · Complete intelligence derived from your natal chart
          </p>
        </div>
      )}

      {/* Summary Metric Cards */}
      <section className="space-y-5">
        <span className="overline-label">Intelligence Summary (Buddhi Sāra)</span>
        <MetricCards metrics={metrics} />
      </section>

      {/* Life at a Glance */}
      <LifeAtAGlance data={lifeGlance} />

      {/* Current Alerts */}
      <CurrentAlerts alerts={alerts} />

      {/* Quick Links */}
      <QuickLinks chartId={chartId} />

      {/* Main Chart + AI Synthesis */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Chart Visualization */}
        <div className="lg:col-span-5 space-y-5">
          <div className="flex items-center gap-3">
            <LayoutGrid className="w-4 h-4 text-gold" />
            <span className="overline-label">Natal Blueprint (Rāshi Chakra)</span>
          </div>
          <div className="backdrop-blur-2xl bg-black/40 border border-gold/10 rounded-sm p-6 shadow-2xl relative overflow-hidden group">
             {/* Subtle glow behind chart */}
             <div className="absolute inset-0 bg-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
             
             {astroData?.chart?.shodashvarga?.D1 ? (
               <NorthIndianChart 
                 data={astroData.chart.shodashvarga.D1} 
                 title="Main Birth Chart (D1)" 
                 retrogradePlanets={Object.entries(astroData.chart.planets)
                   .filter(([_, p]) => p.is_retrograde)
                   .map(([name]) => name)}
               />
             ) : (
               <div className="flex flex-col items-center justify-center aspect-square border border-gold/5 bg-gold/5 animate-pulse">
                 <p className="text-[10px] uppercase tracking-widest text-gray-500">Awaiting Cosmic Data</p>
               </div>
             )}
          </div>

          {astroData?.chart && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="pt-5"
            >
              <div className="flex items-center gap-3 mb-5">
                <LayoutGrid className="w-4 h-4 text-gold" />
                <span className="overline-label">Planetary Council (Graha Sabhā)</span>
              </div>
              <PlanetPlacements planets={astroData.chart.planets} />
            </motion.div>
          )}
        </div>

        {/* Right: AI Synthesis Snippet */}
        <div className="lg:col-span-7 space-y-5">
          <div className="flex items-center gap-3">
            <Sparkles className="w-4 h-4 text-gold" />
            <span className="overline-label">The Oracle's Revelation (Daiva Vāni)</span>
          </div>
          
          <div className="relative group h-full">
            <div className="absolute -inset-px bg-gradient-to-b from-gold/20 to-transparent rounded-sm -z-10" />
            <div className="backdrop-blur-3xl bg-black/60 border border-gold/10 rounded-sm p-8 md:p-10 shadow-2xl h-full overflow-hidden relative">
              <div className="prose prose-invert prose-sm prose-headings:font-serif prose-headings:text-gold prose-p:text-gray-400 prose-p:leading-relaxed max-w-none">
                {astroData?.reading ? (
                  <ReactMarkdown>{astroData.reading.split('\n\n').slice(0, 3).join('\n\n')}</ReactMarkdown>
                ) : (
                  <div className="space-y-4">
                    <div className="h-4 w-3/4 bg-gold/5 animate-pulse rounded-full" />
                    <div className="h-4 w-full bg-gold/5 animate-pulse rounded-full" />
                    <div className="h-4 w-5/6 bg-gold/5 animate-pulse rounded-full" />
                    <p className="mt-6 text-[10px] uppercase tracking-[0.2em] text-gray-600 font-bold">
                      The Raj Jyotishi is contemplating your destiny…
                    </p>
                  </div>
                )}
              </div>
              
              {astroData?.reading && (
                <div className="mt-8 pt-6 border-t border-gold/10">
                  <Link 
                    href="/ask" 
                    className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-gold hover:text-white transition-colors group"
                  >
                    Dive deeper into your reading
                    <motion.span animate={{ x: [0, 4, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>→</motion.span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

