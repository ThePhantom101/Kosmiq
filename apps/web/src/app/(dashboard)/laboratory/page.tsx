"use client";

import React from "react";
import { motion } from "framer-motion";
import BirthForm from "@/components/BirthForm";
import { useAstro } from "@/context/AstroContext";
import { Beaker, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export default function LaboratoryPage() {
  const { data, setData, isLoading, setIsLoading } = useAstro();

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <span className="overline-label">Module: Laboratory</span>
          <div className="h-[1px] w-8 bg-gold/30" />
        </div>
        <h1 className="text-5xl font-serif text-white tracking-tight uppercase">
          Celestial <span className="text-gold">Initialization</span>
        </h1>
        <p className="text-gray-400 font-sans max-w-2xl leading-relaxed">
          Calibrate your personal cosmic coordinates. This data forms the architectural foundation for all future planetary mapping and AI synthesis.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        {/* Input HUD Module */}
        <div className="space-y-6">
          <div className="flex items-center space-x-2">
            <Beaker className="w-4 h-4 text-gold/60" />
            <h3 className="text-[10px] uppercase tracking-[0.3em] text-gold/60 font-bold">Input Matrix</h3>
          </div>
          <BirthForm 
            onResult={(res) => {
              setData(res);
              // Small delay to let the user see the success before redirecting if we want
            }} 
            isLoading={isLoading} 
            setIsLoading={setIsLoading} 
          />
        </div>

        {/* Info / Status Side */}
        <div className="space-y-8">
          {data ? (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gold/5 border border-gold/20 p-8 rounded-sm space-y-6"
            >
              <div className="flex justify-center">
                <div className="p-4 rounded-full bg-gold/10 border border-gold/20">
                  <Sparkles className="w-8 h-8 text-gold" />
                </div>
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-gold font-serif text-2xl tracking-tight uppercase">Coordinates Synchronized</h3>
                <p className="text-gray-400 text-sm leading-relaxed max-w-sm mx-auto">
                  Your birth data has been successfully mapped to the current ephemeris. The Astrolabe is now active.
                </p>
              </div>
              <Link
                href="/astrolabe"
                className="w-full bg-gold text-black font-bold py-4 rounded-sm hover:bg-gold/90 transition-all flex items-center justify-center space-x-3 shadow-[0_0_20px_rgba(197,160,89,0.3)] uppercase tracking-widest text-xs"
              >
                <span>Access Astrolabe</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          ) : (
            <div className="hud-module p-8 border border-gold/10 bg-gold/5 space-y-6">
              <h4 className="text-gold uppercase tracking-[0.2em] font-bold text-sm">Calibration Protocol</h4>
              <ul className="space-y-4 font-mono text-[10px] uppercase tracking-wider text-gray-500">
                <li className="flex items-start space-x-3">
                  <span className="text-gold">01</span>
                  <span>Enter precise temporal data (Date & Time of Birth)</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-gold">02</span>
                  <span>Set geographic coordinates for spatial alignment</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-gold">03</span>
                  <span>Initialize the recursive Varga calculations</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-gold">04</span>
                  <span>Access the complete Shodashvarga mapping</span>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
