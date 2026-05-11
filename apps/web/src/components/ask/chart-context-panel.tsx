"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Crown,
  Moon,
  Zap,
  AlertTriangle,
  GitBranch,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import type { ChartContextData } from "@/types/ask";

interface ChartContextPanelProps {
  context: ChartContextData | null;
  isLoading: boolean;
  isMobileExpanded: boolean;
  onToggleMobile: () => void;
}

function ContextCard({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ElementType;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Icon className="w-3 h-3 text-gold/60" />
        <span className="text-[11px] uppercase tracking-[0.2em] font-bold text-gold/80">
          {label}
        </span>
      </div>
      <div className="pl-5">{children}</div>
    </div>
  );
}

function MobilePillStrip({
  context,
  onToggle,
}: {
  context: ChartContextData;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className="w-full flex items-center gap-2 px-4 py-3 bg-black/60 border border-gold/10 backdrop-blur-sm rounded-sm"
      aria-label="Toggle chart context details"
    >
      <Sparkles className="w-3.5 h-3.5 text-gold/60 shrink-0" />
      <div className="flex items-center gap-3 overflow-x-auto scrollbar-none flex-1 min-w-0">
        <span className="text-[10px] uppercase tracking-widest text-white font-bold whitespace-nowrap">
          {context.lagnaSign} Lagna
        </span>
        <span className="w-px h-3 bg-gold/20" />
        <span className="text-[10px] uppercase tracking-widest text-gray-400 whitespace-nowrap">
          {context.currentMahadasha} Dasha
        </span>
        <span className="w-px h-3 bg-gold/20" />
        <span className="text-[10px] uppercase tracking-widest text-gray-400 whitespace-nowrap">
          {context.moonSign} Moon
        </span>
      </div>
      <ChevronRight className="w-3 h-3 text-gold/40 shrink-0" />
    </button>
  );
}

export function ChartContextPanel({
  context,
  isLoading,
  isMobileExpanded,
  onToggleMobile,
}: ChartContextPanelProps) {
  if (isLoading) {
    return (
      <div className="space-y-4 p-6 animate-pulse">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-3 w-24 bg-gold/10 rounded-sm" />
            <div className="h-5 w-32 bg-gold/5 rounded-sm" />
          </div>
        ))}
      </div>
    );
  }

  if (!context) {
    return (
      <div className="p-6 text-center space-y-3">
        <div className="p-4 rounded-full bg-gold/10 border border-gold/20 mx-auto w-fit">
          <AlertTriangle className="w-6 h-6 text-gold/40" />
        </div>
        <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">
          No chart data available
        </p>
        <p className="text-xs text-gray-600">
          Generate a chart first to unlock Raj Jyotishi
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Mobile pill strip */}
      <div className="lg:hidden">
        <MobilePillStrip context={context} onToggle={onToggleMobile} />

        {isMobileExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border border-gold/10 border-t-0 bg-black/80 backdrop-blur-sm rounded-b-sm"
          >
            <FullContextContent context={context} />
          </motion.div>
        )}
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:block h-full overflow-y-auto scrollbar-none">
        <FullContextContent context={context} />
      </div>
    </>
  );
}

function FullContextContent({ context }: { context: ChartContextData }) {
  return (
    <div className="p-5 space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <span className="text-[11px] uppercase tracking-[0.25em] font-black text-gold">
          Active Context
        </span>
        <p className="text-[10px] text-gray-600 leading-relaxed">
          Data visible to Raj Jyotishi
        </p>
      </div>

      <div className="h-px bg-gold/10" />

      {/* Identity */}
      <ContextCard icon={Crown} label="Identity">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[13px] text-gray-400">Lagna (Ascendant)</span>
            <span className="text-[13px] text-white font-bold">
              {context.lagnaSign}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[13px] text-gray-400">Moon Sign (Rashi)</span>
            <span className="text-[13px] text-white font-bold">
              {context.moonSign}
            </span>
          </div>
        </div>
      </ContextCard>

      {/* Dasha */}
      <ContextCard icon={GitBranch} label="Current Period (Dasha)">
        <div className="space-y-1.5">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[13px] text-gray-400">Mahadasha</span>
              <span className="text-[13px] text-gold font-bold">
                {context.currentMahadasha}
              </span>
            </div>
            <div className="h-1 w-full bg-gold/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gold/60 rounded-full transition-all duration-1000"
                style={{ width: `${context.currentMahadashaPercent}%` }}
              />
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[13px] text-gray-400">Antardasha</span>
              <span className="text-[13px] text-white font-bold">
                {context.currentAntardasha}
              </span>
            </div>
            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-white/30 rounded-full transition-all duration-1000"
                style={{ width: `${context.currentAntardashaPercent}%` }}
              />
            </div>
          </div>
        </div>
      </ContextCard>

      {/* Top Planets */}
      <ContextCard icon={Zap} label="Strongest Planets">
        <div className="space-y-2">
          {context.topPlanets.length > 0 ? (
            context.topPlanets.map((planet, i) => (
              <div key={planet.name} className="flex items-center gap-2">
                <span className="text-[10px] text-gold/40 font-mono w-4">
                  #{i + 1}
                </span>
                <span className="text-xs text-white font-bold flex-1">
                  {planet.name}
                </span>
                <span className="text-[10px] text-gray-500 font-mono">
                  H{planet.house}
                </span>
                <div className="w-12 h-1 bg-gold/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gold/60 rounded-full"
                    style={{
                      width: `${Math.min((planet.strength / 200) * 100, 100)}%`,
                    }}
                  />
                </div>
              </div>
            ))
          ) : (
            <span className="text-xs text-gray-600">
              Strength data unavailable
            </span>
          )}
        </div>
      </ContextCard>

      {/* Alerts */}
      {context.alerts.length > 0 && (
        <ContextCard icon={AlertTriangle} label="Active Alerts">
          <div className="space-y-2">
            {context.alerts.map((alert, i) => (
              <div
                key={i}
                className="flex items-start gap-2 px-3 py-2 bg-amber-500/5 border border-amber-500/10 rounded-sm"
              >
                <AlertTriangle className="w-3 h-3 text-amber-500/60 shrink-0 mt-0.5" />
                <span className="text-[10px] text-amber-200/80 leading-relaxed">
                  {alert.label}
                </span>
              </div>
            ))}
          </div>
        </ContextCard>
      )}
    </div>
  );
}
