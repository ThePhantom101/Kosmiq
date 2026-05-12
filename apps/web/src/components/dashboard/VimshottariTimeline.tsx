"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronDown, 
  ChevronUp, 
  Clock, 
  Star, 
  Calendar,
  Zap,
  ArrowRight
} from "lucide-react";
import { DashaPeriod } from "@/types/dasha";

interface VimshottariTimelineProps {
  mahadashas: any[];
  currentMahaLord: string;
}

export function VimshottariTimeline({ mahadashas, currentMahaLord }: VimshottariTimelineProps) {
  return (
    <div className="relative">
      {/* Vertical Connection Line */}
      <div className="absolute left-[23px] top-4 bottom-4 w-[1px] bg-gold/10" />

      <div className="space-y-6">
        {mahadashas.map((maha, idx) => (
          <MahadashaItem 
            key={maha.lord + maha.start}
            maha={maha}
            isCurrent={maha.lord === currentMahaLord}
            isPast={new Date(maha.end) < new Date()}
            index={idx}
          />
        ))}
      </div>
    </div>
  );
}

function MahadashaItem({ maha, isCurrent, isPast, index }: { 
  maha: any; 
  isCurrent: boolean; 
  isPast: boolean;
  index: number;
}) {
  const [isExpanded, setIsExpanded] = useState(isCurrent);
  const isFuture = !isCurrent && !isPast;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`relative pl-14 group`}
    >
      {/* Connector Node */}
      <div className="absolute left-0 top-0 bottom-0 flex items-start pt-6">
        <div className={`relative flex items-center justify-center w-12 h-12`}>
          {isCurrent && (
            <motion.div 
              animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 bg-gold rounded-full blur-md"
            />
          )}
          <div className={`w-3 h-3 rounded-full border-2 z-10 transition-all duration-500 ${
            isCurrent ? 'bg-gold border-gold' : 
            isPast ? 'bg-transparent border-gold/20' : 
            'bg-black border-zinc-700 group-hover:border-gold/40'
          }`} />
        </div>
      </div>

      {/* Card Content */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className={`hud-module p-5 cursor-pointer transition-all duration-300 border ${
          isCurrent ? 'border-gold/30 bg-gold/[0.03] ring-1 ring-gold/10' : 
          'border-gold/5 bg-white/[0.01] hover:border-gold/20 hover:bg-white/[0.03]'
        } ${isPast ? 'opacity-50' : ''}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`p-2 rounded-sm border ${isCurrent ? 'border-gold/30 bg-gold/10' : 'border-gold/10 bg-black/40'}`}>
              <Star className={`w-4 h-4 ${isCurrent ? 'text-gold' : 'text-gold/40'}`} />
            </div>
            <div>
              <h3 className={`text-lg font-serif tracking-tight ${isCurrent ? 'text-white' : 'text-zinc-400'}`}>
                {maha.lord} <span className="text-[10px] uppercase tracking-[0.2em] ml-2 opacity-40 font-bold">Mahadasha</span>
              </h3>
              <div className="flex items-center gap-3 text-[10px] font-mono uppercase tracking-widest text-zinc-500">
                <span>{new Date(maha.start).getFullYear()} - {new Date(maha.end).getFullYear()}</span>
                <span className="opacity-30">•</span>
                <span>{maha.duration_years} Years</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {isCurrent && (
              <div className="hidden md:flex flex-col items-end gap-1">
                <span className="text-[9px] text-gold/60 uppercase font-black tracking-widest">Active</span>
                <div className="w-24 h-1 bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${maha.percent_complete}%` }}
                    className="h-full bg-gold"
                  />
                </div>
              </div>
            )}
            <div className={`p-1 rounded-sm border border-gold/10 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
              <ChevronDown className="w-3 h-3 text-gold/40" />
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-6 pt-6 border-t border-gold/10">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {maha.sub_periods?.map((sub: any) => (
                    <AntardashaTile key={sub.lord + sub.start} sub={sub} />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function AntardashaTile({ sub }: { sub: any }) {
  const isCurrentSub = new Date(sub.start) <= new Date() && new Date() < new Date(sub.end);
  const isPastSub = new Date(sub.end) < new Date();
  
  return (
    <div className={`p-3 rounded-sm border flex flex-col gap-2 transition-all relative overflow-hidden group/tile ${
      isCurrentSub 
        ? 'border-gold/40 bg-gold/5 ring-1 ring-gold/10 shadow-[0_0_20px_rgba(197,160,89,0.1)]' 
        : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-gold/20'
    } ${isPastSub ? 'opacity-30' : 'opacity-100'}`}>
      
      {isCurrentSub && (
        <div className="absolute top-0 right-0 w-8 h-8 bg-gold/10 blur-xl" />
      )}

      <div className="flex justify-between items-center relative z-10">
        <span className={`text-[11px] font-serif tracking-tight ${isCurrentSub ? 'text-white' : 'text-zinc-400 group-hover/tile:text-white'}`}>
          {sub.lord}
        </span>
        {isCurrentSub && (
          <div className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-gold"></span>
          </div>
        )}
      </div>

      <div className="flex justify-between items-end text-[9px] font-mono uppercase tracking-tighter text-zinc-500 relative z-10">
        <div className="flex flex-col">
          <span>{new Date(sub.start).toLocaleDateString(undefined, { month: 'short', year: '2-digit' })}</span>
          <span className="opacity-40">Start</span>
        </div>
        <ArrowRight className="w-2 h-2 opacity-20" />
        <div className="flex flex-col text-right">
          <span>{new Date(sub.end).toLocaleDateString(undefined, { month: 'short', year: '2-digit' })}</span>
          <span className="opacity-40">End</span>
        </div>
      </div>
    </div>
  );
}
