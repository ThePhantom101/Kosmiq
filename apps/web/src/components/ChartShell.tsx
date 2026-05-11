"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Grid3x3, GitBranch, BarChart3, Zap, Moon, LayoutDashboard } from "lucide-react";

interface ChartTab {
  name: string;
  href: string;
  icon: React.ElementType;
}

export function ChartShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const params = useParams<{ id: string }>();
  const id = params?.id ?? "me";

  const tabs: ChartTab[] = [
    { name: "Overview", icon: LayoutDashboard, href: `/chart/${id}` },
    { name: "Divisional Charts", icon: Grid3x3, href: `/chart/${id}/divisional` },
    { name: "Dasha Timeline", icon: GitBranch, href: `/chart/${id}/timeline` },
    { name: "Strengths", icon: BarChart3, href: `/chart/${id}/strengths` },
    { name: "Yogas", icon: Zap, href: `/chart/${id}/yogas` },
    { name: "Shadow Planets", icon: Moon, href: `/chart/${id}/shadows` },
  ];

  return (
    <div className="space-y-0">
      {/* Tab Bar */}
      <div className="border-b border-gold/10 bg-black/40 backdrop-blur-sm sticky top-0 z-20 -mx-8 px-8">
        <div className="flex items-end gap-1 overflow-x-auto scrollbar-none">
          {tabs.map((tab) => {
            const isActive = pathname === tab.href;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`group relative flex items-center gap-2 px-5 py-4 text-[10px] uppercase tracking-[0.2em] font-bold whitespace-nowrap transition-all border-b-2 ${
                  isActive
                    ? "text-gold border-gold"
                    : "text-gray-500 border-transparent hover:text-white hover:border-gold/30"
                }`}
              >
                <tab.icon
                  className={`w-3.5 h-3.5 shrink-0 transition-colors ${
                    isActive ? "text-gold" : "group-hover:text-gold/60"
                  }`}
                />
                {tab.name}
                {isActive && (
                  <motion.div
                    layoutId="chartTabUnderline"
                    className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-gold"
                  />
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="pt-8">{children}</div>
    </div>
  );
}

export default ChartShell;
