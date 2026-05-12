"use client";

import React from "react";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

export type StatusType = "Opportunity" | "Caution" | "Transition" | "Neutral";

interface IntelligenceCardProps {
  title: string;
  subtitle?: string;
  status?: StatusType;
  icon?: LucideIcon;
  children?: React.ReactNode;
  className?: string;
}

const statusStyles: Record<StatusType, { color: string; bg: string; border: string }> = {
  Opportunity: {
    color: "text-gold",
    bg: "bg-gold/10",
    border: "border-gold/30",
  },
  Caution: {
    color: "text-red-400",
    bg: "bg-red-400/10",
    border: "border-red-400/30",
  },
  Transition: {
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    border: "border-blue-400/30",
  },
  Neutral: {
    color: "text-zinc-400",
    bg: "bg-white/5",
    border: "border-white/10",
  },
};

export function IntelligenceCard({
  title,
  subtitle,
  status = "Neutral",
  icon: Icon,
  children,
  className = "",
}: IntelligenceCardProps) {
  const style = statusStyles[status];

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={`hud-module p-6 border bg-black/40 relative overflow-hidden group ${style.border} ${className}`}
    >
      {/* Background Accent */}
      <div className={`absolute top-0 right-0 w-32 h-32 blur-[60px] opacity-10 transition-opacity group-hover:opacity-20 ${style.bg}`} />
      
      <div className="relative space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="relative flex h-2 w-2">
                <motion.span 
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${style.bg.replace('/10', '/40')}`}
                />
                <span className={`relative inline-flex rounded-full h-2 w-2 ${style.bg.replace('/10', '/70')}`} />
              </div>
              <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${style.color}`}>
                {status}
              </span>
              <div className={`h-[1px] w-4 ${style.bg.replace('/10', '/30')}`} />
            </div>
            <h3 className="text-xl font-serif text-white tracking-tight">{title}</h3>
            {subtitle && (
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">
                {subtitle}
              </p>
            )}
          </div>
          {Icon && (
            <div className={`p-2 rounded-sm border ${style.border} ${style.bg}`}>
              <Icon className={`w-4 h-4 ${style.color}`} />
            </div>
          )}
        </div>

        <div className="pt-2">
          {children}
        </div>
      </div>

      {/* Decorative Corner */}
      <div className={`absolute bottom-0 right-0 w-8 h-8 opacity-20 pointer-events-none`}>
        <div className={`absolute bottom-2 right-2 w-px h-2 ${style.bg.replace('/10', '/50')}`} />
        <div className={`absolute bottom-2 right-2 h-px w-2 ${style.bg.replace('/10', '/50')}`} />
      </div>
    </motion.div>
  );
}

export function StatusBadge({ status }: { status: StatusType }) {
  const style = statusStyles[status];
  return (
    <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-tighter border ${style.border} ${style.bg} ${style.color}`}>
      {status}
    </span>
  );
}
