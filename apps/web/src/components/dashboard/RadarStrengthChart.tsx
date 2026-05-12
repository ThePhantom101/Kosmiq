"use client";

import React from "react";
import { motion } from "framer-motion";

interface RadarDataPoint {
  label: string;
  value: number; // 0 to 100
}

interface RadarStrengthChartProps {
  data: RadarDataPoint[];
  size?: number;
}

export function RadarStrengthChart({ data, size = 400 }: RadarStrengthChartProps) {
  const center = size / 2;
  const radius = size * 0.4;
  const angleStep = (Math.PI * 2) / data.length;

  // Generate points for the data polygon
  const points = data.map((d, i) => {
    const r = (d.value / 100) * radius;
    const angle = i * angleStep - Math.PI / 2;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  });

  const polygonPath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x},${p.y}`).join(" ") + " Z";

  return (
    <div className="relative flex items-center justify-center select-none">
      <svg width={size} height={size} className="overflow-visible">
        {/* Background Grids */}
        {[0.2, 0.4, 0.6, 0.8, 1].map((scale) => (
          <circle
            key={scale}
            cx={center}
            cy={center}
            r={radius * scale}
            className="fill-none stroke-gold/10 stroke-[0.5]"
            strokeDasharray="2 2"
          />
        ))}

        {/* Axis Lines */}
        {data.map((_, i) => {
          const angle = i * angleStep - Math.PI / 2;
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={center + radius * Math.cos(angle)}
              y2={center + radius * Math.sin(angle)}
              className="stroke-gold/10 stroke-[0.5]"
            />
          );
        })}

        {/* Data Polygon */}
        <motion.path
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          d={polygonPath}
          className="fill-gold/10 stroke-gold stroke-2"
        />

        {/* Data Points */}
        {points.map((p, i) => (
          <motion.circle
            key={i}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5 + i * 0.1 }}
            cx={p.x}
            cy={p.y}
            r={3}
            className="fill-black stroke-gold stroke-2"
          />
        ))}

        {/* Labels */}
        {data.map((d, i) => {
          const angle = i * angleStep - Math.PI / 2;
          const labelRadius = radius + 25;
          const x = center + labelRadius * Math.cos(angle);
          const y = center + labelRadius * Math.sin(angle);
          return (
            <text
              key={i}
              x={x}
              y={y}
              className="fill-zinc-500 text-[10px] font-black uppercase tracking-widest"
              textAnchor="middle"
              dominantBaseline="middle"
            >
              {d.label}
            </text>
          );
        })}
      </svg>
    </div>
  );
}
