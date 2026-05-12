"use client";

import React from "react";
import { motion } from "framer-motion";
import { useAstro } from "@/context/AstroContext";
import { BookOpen, Plus, ArrowRight, User, Calendar, MapPin } from "lucide-react";
import Link from "next/link";

import { AuthGate } from "@/components/auth/AuthGate";

export default function ChartsPage() {
  const { data } = useAstro();

  return (
    <AuthGate mode="redirect">
      <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="overline-label">My Charts</span>
            <div className="h-px w-8 bg-gold/30" />
          </div>
          <h1 className="text-5xl font-serif text-white tracking-tight uppercase">
            Your <span className="text-gold">Kundlis</span>
          </h1>
        </div>

        <Link
          href="/charts/new"
          className="flex items-center gap-2 px-6 py-3 bg-gold text-black font-bold rounded-sm uppercase tracking-widest text-xs hover:bg-gold/90 transition-all shadow-[0_0_20px_rgba(197,160,89,0.2)]"
        >
          <Plus className="w-4 h-4" />
          <span>New Chart</span>
        </Link>
      </div>

      {/* Charts Grid */}
      {data ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Link
              href="/chart/me/divisional"
              className="group block hud-module p-6 border border-gold/20 bg-gold/5 hover:border-gold/40 hover:bg-gold/10 transition-all space-y-5 rounded-sm"
            >
              {/* Card Header */}
              <div className="flex items-start justify-between">
                <div className="p-3 bg-gold/10 border border-gold/20 rounded-sm">
                  <BookOpen className="w-5 h-5 text-gold" />
                </div>
                <span className="text-[9px] uppercase tracking-widest font-bold text-gold/40 border border-gold/20 px-2 py-0.5 rounded-sm">
                  Active
                </span>
              </div>

              {/* Subject */}
              <div className="space-y-1">
                <h3 className="text-xl font-serif text-white tracking-tight">
                  My Chart
                </h3>
                <div className="flex flex-wrap gap-3 text-[10px] font-mono uppercase tracking-wider text-gray-500">
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    Lagna: House {data.chart.ascendant}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {data.chart.ascendant_nakshatra.name}
                  </span>
                </div>
              </div>

              {/* Ayanamsa */}
              <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider">
                <span className="text-gray-600 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {data.chart.metadata.ayanamsa_name}
                </span>
                <span className="text-gold/60 group-hover:text-gold transition-colors flex items-center gap-1">
                  View Kundli <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </Link>
          </motion.div>

          {/* Add More CTA */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <Link
              href="/charts/new"
              className="group flex flex-col items-center justify-center gap-4 hud-module p-6 border border-gold/10 border-dashed bg-transparent hover:border-gold/30 hover:bg-gold/5 transition-all rounded-sm min-h-[180px]"
            >
              <div className="p-3 bg-gold/5 border border-gold/10 rounded-full group-hover:border-gold/30 transition-colors">
                <Plus className="w-5 h-5 text-gold/40 group-hover:text-gold transition-colors" />
              </div>
              <span className="text-[10px] uppercase tracking-widest font-bold text-gray-600 group-hover:text-gray-400 transition-colors">
                Add Chart
              </span>
            </Link>
          </motion.div>
        </div>
      ) : (
        <div className="h-[50vh] flex flex-col items-center justify-center text-center space-y-6">
          <div className="p-6 rounded-full bg-gold/5 border border-gold/10">
            <BookOpen className="w-10 h-10 text-gold/20" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-serif text-white">No Charts Yet</h2>
            <p className="text-gray-500 max-w-sm mx-auto text-sm">
              Generate your first Kundli by entering your birth details.
            </p>
          </div>
          <Link
            href="/charts/new"
            className="px-8 py-4 bg-gold text-black font-bold rounded-sm uppercase tracking-widest text-xs hover:bg-gold/90 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Create First Chart</span>
          </Link>
        </div>
      )}
      </div>
    </AuthGate>
  );
}
