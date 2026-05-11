"use client";

import React from "react";
import { motion } from "framer-motion";
import type { LifeGlance } from "@/types/overview";

interface LifeAtAGlanceProps {
  data: LifeGlance;
}

const DOMAINS: { key: keyof LifeGlance; label: string; sanskrit: string }[] = [
  { key: "health", label: "Health & Vitality", sanskrit: "Ārogya" },
  { key: "wealth", label: "Wealth & Prosperity", sanskrit: "Dhana" },
  { key: "relationships", label: "Relationships", sanskrit: "Sambandha" },
  { key: "career", label: "Career & Ambition", sanskrit: "Karma" },
  { key: "creativity", label: "Creativity & Intellect", sanskrit: "Pratibhā" },
  { key: "spirituality", label: "Spirituality", sanskrit: "Adhyātma" },
];

function scoreToGrade(score: number): string {
  if (score >= 85) return "Excellent";
  if (score >= 70) return "Strong";
  if (score >= 55) return "Moderate";
  if (score >= 40) return "Weak";
  return "Challenged";
}

function scoreToColor(score: number): string {
  if (score >= 75) return "bg-gold";
  if (score >= 50) return "bg-amber-600";
  return "bg-red-600/70";
}

export function LifeAtAGlance({ data }: LifeAtAGlanceProps) {
  return (
    <section className="space-y-5">
      <div>
        <span className="overline-label">Life at a Glance (Jīvana Dṛṣṭi)</span>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {DOMAINS.map((domain, i) => {
          const score = data[domain.key];
          const grade = scoreToGrade(score);
          const barColor = scoreToColor(score);

          return (
            <motion.div
              key={domain.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.07, ease: [0.2, 0, 0.2, 1] }}
              className="hud-module flex flex-col gap-3 p-4"
            >
              {/* Score Ring */}
              <div className="relative mx-auto h-16 w-16">
                <svg className="h-full w-full -rotate-90" viewBox="0 0 64 64">
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    stroke="rgba(197,160,89,0.08)"
                    strokeWidth="4"
                    fill="none"
                  />
                  <motion.circle
                    cx="32"
                    cy="32"
                    r="28"
                    stroke="#C5A059"
                    strokeWidth="4"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 28}`}
                    initial={{ strokeDashoffset: 2 * Math.PI * 28 }}
                    animate={{
                      strokeDashoffset: 2 * Math.PI * 28 * (1 - score / 100),
                    }}
                    transition={{ duration: 0.9, delay: i * 0.07 + 0.3, ease: "easeOut" }}
                    opacity={score >= 75 ? 1 : 0.55}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-serif text-base font-bold text-white">{score}</span>
                </div>
              </div>

              {/* Labels */}
              <div className="text-center">
                <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-gold/60">
                  {domain.sanskrit}
                </p>
                <p className="mt-0.5 text-[11px] font-semibold text-white/80">{domain.label}</p>
                <p
                  className={`mt-1 font-mono text-[8px] uppercase tracking-[0.15em] ${
                    score >= 70 ? "text-gold/70" : score >= 50 ? "text-amber-500/70" : "text-red-400/70"
                  }`}
                >
                  {grade}
                </p>
              </div>

              {/* Mini bar */}
              <div className="h-[2px] w-full overflow-hidden bg-white/5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${score}%` }}
                  transition={{ duration: 0.7, delay: i * 0.07 + 0.4, ease: "easeOut" }}
                  className={`h-full ${barColor}`}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
