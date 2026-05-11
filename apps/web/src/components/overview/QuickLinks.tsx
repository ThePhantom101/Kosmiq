"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Grid3x3, Zap, BarChart3, GitBranch, MessageCircle } from "lucide-react";

interface QuickLink {
  label: string;
  sanskrit: string;
  href: string;
  icon: React.ElementType;
  description: string;
}

interface QuickLinksProps {
  chartId: string;
}

export function QuickLinks({ chartId }: QuickLinksProps) {
  const links: QuickLink[] = [
    {
      label: "Divisional Charts",
      sanskrit: "Shodashvarga",
      href: `/chart/${chartId}/divisional`,
      icon: Grid3x3,
      description: "D1 through D60 varga maps",
    },
    {
      label: "Planet Strength",
      sanskrit: "Shadbala",
      href: `/chart/${chartId}/strengths`,
      icon: Zap,
      description: "Sixfold strength analysis",
    },
    {
      label: "Point Grid",
      sanskrit: "Ashtakavarga",
      href: `/chart/${chartId}/strengths`,
      icon: BarChart3,
      description: "8-source bindhu scoring",
    },
    {
      label: "Dasha Timeline",
      sanskrit: "Vimshottari",
      href: `/chart/${chartId}/timeline`,
      icon: GitBranch,
      description: "Planetary period sequence",
    },
    {
      label: "Ask AI",
      sanskrit: "Raj Jyotishi",
      href: `/ask`,
      icon: MessageCircle,
      description: "Gemini-powered chart reading",
    },
  ];

  return (
    <section className="space-y-5">
      <span className="overline-label">Quick Navigation (Śīghra Gamana)</span>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {links.map((link, i) => {
          const Icon = link.icon;
          return (
            <motion.div
              key={link.href}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35, delay: i * 0.06, ease: [0.2, 0, 0.2, 1] }}
            >
              <Link
                href={link.href}
                className="group flex flex-col items-center gap-3 border border-gold/10 bg-gold/[0.03] p-4 text-center transition-all hover:border-gold/40 hover:bg-gold/10"
                style={{
                  clipPath:
                    "polygon(0 8px, 8px 0, calc(100% - 8px) 0, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0 calc(100% - 8px))",
                }}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/20 bg-gold/10 transition-all group-hover:border-gold/50 group-hover:bg-gold/20">
                  <Icon className="h-4 w-4 text-gold/70 transition-colors group-hover:text-gold" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-white/80 group-hover:text-white">
                    {link.label}
                  </p>
                  <p className="mt-0.5 font-mono text-[8px] uppercase tracking-[0.2em] text-gold/40 group-hover:text-gold/60">
                    {link.sanskrit}
                  </p>
                  <p className="mt-1 text-[9px] leading-tight text-gray-600">{link.description}</p>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
