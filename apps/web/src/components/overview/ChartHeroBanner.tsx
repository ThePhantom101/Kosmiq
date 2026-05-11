"use client";

import React from "react";
import { motion } from "framer-motion";
import { MapPin, Calendar, Clock } from "lucide-react";
import type { ChartHero } from "@/types/overview";

interface ChartHeroBannerProps {
  hero: ChartHero;
}

export function ChartHeroBanner({ hero }: ChartHeroBannerProps) {
  const formattedDate = new Date(hero.dateOfBirth).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.2, 0, 0.2, 1] }}
      className="relative overflow-hidden rounded-none border border-gold/20 bg-gradient-to-br from-black via-[#0a0a0a] to-black p-6 md:p-10"
      style={{
        clipPath:
          "polygon(0 16px, 16px 0, calc(100% - 16px) 0, 100% 16px, 100% calc(100% - 16px), calc(100% - 16px) 100%, 16px 100%, 0 calc(100% - 16px))",
      }}
    >
      {/* Background constellation glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-gold/5 blur-[120px]" />
      </div>

      {/* Overline */}
      <div className="mb-4">
        <span className="overline-label">Kundali (जन्म कुंडली) Overview</span>
      </div>

      {/* Name + Identifiers */}
      <div className="relative flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="font-serif text-4xl font-bold tracking-tight text-white md:text-5xl">
            {hero.name}
          </h1>
          <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.3em] text-gold/50">
            Janma Kundali
          </p>

          {/* Birth Details Row */}
          <div className="mt-4 flex flex-wrap gap-4 text-xs text-gray-400">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-gold/40" />
              {formattedDate}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-gold/40" />
              {hero.timeOfBirth}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-gold/40" />
              {hero.placeOfBirth}
            </span>
          </div>
        </div>

        {/* Sign Badges */}
        <div className="flex flex-wrap gap-3 md:flex-nowrap">
          <SignBadge
            label="Ascendant (Lagna)"
            value={hero.lagna}
            sub={`${hero.ascendantDegree.toFixed(1)}° · Lord: ${hero.lagnaLord}`}
          />
          <SignBadge
            label="Moon Sign (Chandra Rashi)"
            value={hero.moonSign}
            sub={hero.moonNakshatra}
          />
          <SignBadge label="Sun Sign (Surya Rashi)" value={hero.sunSign} />
        </div>
      </div>
    </motion.div>
  );
}

interface SignBadgeProps {
  label: string;
  value: string;
  sub?: string;
}

function SignBadge({ label, value, sub }: SignBadgeProps) {
  return (
    <div className="min-w-[120px] border border-gold/15 bg-gold/5 px-4 py-3 text-center">
      <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-gold/50">{label}</p>
      <p className="mt-1 font-serif text-lg font-bold text-gold">{value}</p>
      {sub && (
        <p className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.15em] text-gray-500">
          {sub}
        </p>
      )}
    </div>
  );
}
