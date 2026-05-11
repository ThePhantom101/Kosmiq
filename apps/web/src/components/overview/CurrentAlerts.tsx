"use client";

import React from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Info, CheckCircle2, XCircle } from "lucide-react";
import type { TransitAlert } from "@/types/overview";

interface CurrentAlertsProps {
  alerts: TransitAlert[];
}

const SEVERITY_CONFIG = {
  warning: {
    icon: AlertTriangle,
    borderColor: "border-amber-500/30",
    bgColor: "bg-amber-500/5",
    iconColor: "text-amber-400",
    badgeClass: "border-amber-500/30 text-amber-400 bg-amber-500/10",
    label: "Warning",
  },
  info: {
    icon: Info,
    borderColor: "border-blue-400/30",
    bgColor: "bg-blue-400/5",
    iconColor: "text-blue-300",
    badgeClass: "border-blue-400/30 text-blue-300 bg-blue-400/10",
    label: "Notice",
  },
  success: {
    icon: CheckCircle2,
    borderColor: "border-gold/30",
    bgColor: "bg-gold/5",
    iconColor: "text-gold",
    badgeClass: "border-gold/30 text-gold bg-gold/10",
    label: "Favorable",
  },
  critical: {
    icon: XCircle,
    borderColor: "border-red-500/40",
    bgColor: "bg-red-500/5",
    iconColor: "text-red-400",
    badgeClass: "border-red-500/40 text-red-400 bg-red-500/10",
    label: "Critical",
  },
};

export function CurrentAlerts({ alerts }: CurrentAlertsProps) {
  return (
    <section className="space-y-5">
      <span className="overline-label">Current Alerts (Sūchanā)</span>

      <div className="flex flex-col gap-3">
        {alerts.map((alert, i) => {
          const config = SEVERITY_CONFIG[alert.severity];
          const Icon = config.icon;

          return (
            <motion.div
              key={`${alert.type}-${i}`}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1, ease: [0.2, 0, 0.2, 1] }}
              className={`flex items-start gap-4 border ${config.borderColor} ${config.bgColor} p-4`}
              style={{
                clipPath:
                  "polygon(0 8px, 8px 0, calc(100% - 8px) 0, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0 calc(100% - 8px))",
              }}
            >
              {/* Icon */}
              <div className={`mt-0.5 shrink-0 ${config.iconColor}`}>
                <Icon className="h-4 w-4" />
              </div>

              {/* Content */}
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-serif text-sm font-bold text-white">{alert.title}</p>
                  <span
                    className={`border px-1.5 py-0.5 font-mono text-[8px] uppercase tracking-[0.2em] ${config.badgeClass}`}
                  >
                    {config.label}
                  </span>
                  <span className="border border-white/10 bg-white/5 px-1.5 py-0.5 font-mono text-[8px] uppercase tracking-[0.2em] text-gray-500">
                    {alert.type}
                  </span>
                </div>
                <p className="mt-1 text-xs leading-relaxed text-gray-400">{alert.description}</p>
                {alert.activeUntil && (
                  <p className="mt-1.5 font-mono text-[9px] uppercase tracking-[0.15em] text-gray-600">
                    Active until:{" "}
                    <span className="text-gray-400">
                      {new Date(alert.activeUntil).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </p>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
