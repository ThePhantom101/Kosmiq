"use client";

import React from "react";
import { motion, type Variants } from "framer-motion";
import { Star, AlertCircle, Home, Timer, Zap, Sparkles } from "lucide-react";
import type { OverviewMetrics } from "@/types/overview";

interface MetricCardsProps {
  metrics: OverviewMetrics;
}

const STAGGER: Variants = {
  hidden: { opacity: 1 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const FADE_UP: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

export function MetricCards({ metrics }: MetricCardsProps) {
  const { strongestPlanet, weakestPlanet, bestHouse, currentDasha, astroScore, yogaSummary } =
    metrics;

  return (
    <motion.div
      variants={STAGGER}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
    >
      {/* Astro Score */}
      <AstroScoreCard score={astroScore} />

      {/* Strongest Planet */}
      <MetricCard
        icon={<Star className="h-4 w-4" />}
        overline="Strongest Planet"
        title={strongestPlanet.planet}
        subtitle={strongestPlanet.signification}
        badge={strongestPlanet.dignity}
        badgeColor="gold"
        footer={`House ${strongestPlanet.house} · Score ${strongestPlanet.score}/100`}
        barValue={strongestPlanet.score}
        barColor="gold"
      />

      {/* Weakest Planet */}
      <MetricCard
        icon={<AlertCircle className="h-4 w-4" />}
        overline="Weakest Planet"
        title={weakestPlanet.planet}
        subtitle={weakestPlanet.signification}
        badge={weakestPlanet.dignity}
        badgeColor="red"
        footer={`House ${weakestPlanet.house} · Score ${weakestPlanet.score}/100`}
        barValue={weakestPlanet.score}
        barColor="red"
      />

      {/* Best House */}
      <MetricCard
        icon={<Home className="h-4 w-4" />}
        overline="Best Supported House"
        title={`House ${bestHouse.house}`}
        subtitle={bestHouse.label}
        badge={`Score ${bestHouse.score}`}
        badgeColor="gold"
        footer={`Planets: ${bestHouse.planets.join(", ")}`}
        barValue={bestHouse.score}
        barColor="gold"
      />

      {/* Current Dasha */}
      <DashaCard dasha={currentDasha} />

      {/* Yoga Count */}
      <MetricCard
        icon={<Sparkles className="h-4 w-4" />}
        overline="Yoga Count"
        title={`${yogaSummary.count} Yogas`}
        subtitle={`${yogaSummary.active.length} active · ${yogaSummary.dormant.length} dormant`}
        badge={`${yogaSummary.active.length} Active`}
        badgeColor="gold"
        footer={yogaSummary.active.slice(0, 2).join(" · ")}
        barValue={(yogaSummary.active.length / yogaSummary.count) * 100}
        barColor="gold"
      />
    </motion.div>
  );
}

// ─── Skeletons ─────────────────────────────────────────────────────────────

export function MetricCardSkeleton() {
  return (
    <div className="hud-module animate-pulse flex flex-col gap-4 p-5">
      <div className="flex items-start justify-between gap-2">
        <div className="h-4 w-4 rounded-full bg-white/5" />
        <div className="h-4 w-12 bg-white/5" />
      </div>
      <div className="space-y-2">
        <div className="h-2 w-24 bg-white/5" />
        <div className="h-8 w-32 bg-white/5" />
        <div className="h-2 w-20 bg-white/5" />
      </div>
      <div className="h-[2px] w-full bg-white/5" />
      <div className="h-2 w-40 bg-white/5" />
    </div>
  );
}

export function MetricCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {[...Array(6)].map((_, i) => (
        <MetricCardSkeleton key={i} />
      ))}
    </div>
  );
}

// ─── Metric Card ─────────────────────────────────────────────────────────────

interface MetricCardProps {
  icon: React.ReactNode;
  overline: string;
  title: string;
  subtitle: string;
  badge: string;
  badgeColor: "gold" | "red" | "gray";
  footer: string;
  barValue: number;
  barColor: "gold" | "red" | "gray";
}

const BADGE_STYLES: Record<MetricCardProps["badgeColor"], string> = {
  gold: "border-gold/30 text-gold bg-gold/10",
  red: "border-red-500/30 text-red-400 bg-red-500/10",
  gray: "border-white/10 text-gray-400 bg-white/5",
};

const BAR_STYLES: Record<MetricCardProps["barColor"], string> = {
  gold: "bg-gold",
  red: "bg-red-500",
  gray: "bg-gray-500",
};

function MetricCard({
  icon,
  overline,
  title,
  subtitle,
  badge,
  badgeColor,
  footer,
  barValue,
  barColor,
}: MetricCardProps) {
  return (
    <motion.div
      variants={FADE_UP}
      className="hud-module group flex flex-col gap-4 p-5 transition-all hover:border-gold/30"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 text-gold/50">{icon}</div>
        <span
          className={`border px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.2em] ${BADGE_STYLES[badgeColor]}`}
        >
          {badge}
        </span>
      </div>

      {/* Body */}
      <div>
        <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-gray-500">{overline}</p>
        <p className="mt-1 font-serif text-2xl font-bold text-white">{title}</p>
        <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.2em] text-gold/60">
          {subtitle}
        </p>
      </div>

      {/* Bar */}
      <div className="h-[2px] w-full overflow-hidden bg-white/5">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(barValue, 100)}%` }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className={`h-full ${BAR_STYLES[barColor]}`}
        />
      </div>

      {/* Footer */}
      <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-gray-600">{footer}</p>
    </motion.div>
  );
}

// ─── Astro Score Card ───────────────────────────────────────────────────────

interface AstroScoreCardProps {
  score: number;
}

function AstroScoreCard({ score }: AstroScoreCardProps) {
  const getStatus = (s: number) => {
    if (s >= 75) return { label: "Excellent", color: "text-gold", ring: "stroke-gold" };
    if (s >= 50) return { label: "Balanced", color: "text-white", ring: "stroke-white/60" };
    return { label: "Challenged", color: "text-gray-500", ring: "stroke-gray-600" };
  };

  const status = getStatus(score);

  return (
    <motion.div
      variants={FADE_UP}
      className="hud-module group flex items-center gap-6 p-5 transition-all hover:border-gold/30"
    >
      {/* Circular Progress */}
      <div className="relative h-20 w-20 shrink-0">
        <svg className="h-full w-full -rotate-90" viewBox="0 0 64 64">
          <circle
            cx="32"
            cy="32"
            r="28"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="4"
            fill="none"
          />
          <motion.circle
            cx="32"
            cy="32"
            r="28"
            className={status.ring}
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 28}`}
            initial={{ strokeDashoffset: 2 * Math.PI * 28 }}
            animate={{
              strokeDashoffset: 2 * Math.PI * 28 * (1 - score / 100),
            }}
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-serif text-xl font-bold text-white">{score}</span>
        </div>
      </div>

      <div className="min-w-0 flex-1">
        <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-gray-500">
          Astro Score
        </p>
        <p className={`mt-1 font-serif text-xl font-bold uppercase tracking-tight ${status.color}`}>
          {status.label}
        </p>
        <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.15em] text-gray-600">
          Composite chart intelligence score
        </p>
      </div>
    </motion.div>
  );
}

// ─── Dasha Card ──────────────────────────────────────────────────────────────

interface DashaCardProps {
  dasha: OverviewMetrics["currentDasha"];
}

function DashaCard({ dasha }: DashaCardProps) {
  const endsDate = new Date(dasha.endsAt).toLocaleDateString("en-GB", {
    month: "short",
    year: "numeric",
  });

  return (
    <motion.div
      variants={FADE_UP}
      className="hud-module group flex flex-col gap-4 p-5 transition-all hover:border-gold/30"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 text-gold/50">
          <Timer className="h-4 w-4" />
        </div>
        <span className="border border-gold/30 bg-gold/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.2em] text-gold">
          Active
        </span>
      </div>

      <div>
        <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-gray-500">
          Current Timeline
        </p>
        <p className="mt-1 font-serif text-2xl font-bold text-white">{dasha.mahadasha}</p>
        <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.2em] text-gold/60">
          {dasha.mahadashaLabel}
        </p>
        <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.2em] text-gray-500">
          Sub-period:{" "}
          <span className="text-white/70">
            {dasha.antardasha} ({dasha.antardashaLabel})
          </span>
        </p>
      </div>

      {/* Progress */}
      <div className="space-y-1">
        <div className="h-[2px] w-full overflow-hidden bg-white/5">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${dasha.percentComplete}%` }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="h-full bg-gold"
          />
        </div>
        <div className="flex justify-between font-mono text-[8px] uppercase tracking-[0.15em] text-gray-600">
          <span>{dasha.percentComplete}% complete</span>
          <span>Ends {endsDate}</span>
        </div>
      </div>
    </motion.div>
  );
}
