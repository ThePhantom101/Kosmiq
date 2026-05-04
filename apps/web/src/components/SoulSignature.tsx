"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

export default function SoulSignature() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for mouse movement
  const springConfig = { damping: 25, stiffness: 150 };
  const rotateX = useSpring(useSpring(mouseY, springConfig), springConfig);
  const rotateY = useSpring(useSpring(mouseX, springConfig), springConfig);

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      mouseX.set(x * 20); // Max 20deg rotation
      mouseY.set(y * -20);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  if (!isMounted) return null;

  // Generative points for the "Graha Network"
  const points = Array.from({ length: 9 }).map((_, i) => ({
    id: i,
    angle: (i * Math.PI * 2) / 9,
    radius: 100 + Math.random() * 50,
    size: 2 + Math.random() * 4,
  }));

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex items-center justify-center bg-black overflow-hidden"
    >
      {/* Background Glow */}
      <div className="absolute w-[500px] h-[500px] bg-gold/5 rounded-full blur-[120px] animate-pulse" />

      <motion.div
        style={{
          rotateX,
          rotateY,
          perspective: 1000,
        }}
        className="relative w-[400px] h-[400px]"
      >
        {/* Orbital Rings */}
        {[0.6, 0.8, 1, 1.2].map((scale, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.2, scale }}
            transition={{ duration: 1.5, delay: i * 0.2 }}
            className="absolute inset-0 border border-gold/30 rounded-full"
            style={{ margin: "auto" }}
          />
        ))}

        {/* Generative SVG Star Map */}
        <svg viewBox="0 0 400 400" className="absolute inset-0 w-full h-full">
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Connection Lines */}
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            transition={{ duration: 2, delay: 1 }}
          >
            {points.map((p, i) => (
              points.slice(i + 1).map((p2, j) => (
                <line
                  key={`${i}-${j}`}
                  x1={200 + Math.cos(p.angle) * p.radius}
                  y1={200 + Math.sin(p.angle) * p.radius}
                  x2={200 + Math.cos(p2.angle) * p2.radius}
                  y2={200 + Math.sin(p2.angle) * p2.radius}
                  stroke="#C5A059"
                  strokeWidth="0.5"
                  strokeDasharray="4 4"
                />
              ))
            ))}
          </motion.g>

          {/* Points (Grahas) */}
          {points.map((p, i) => (
            <motion.g
              key={p.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, delay: i * 0.1 + 0.5 }}
            >
              <circle
                cx={200 + Math.cos(p.angle) * p.radius}
                cy={200 + Math.sin(p.angle) * p.radius}
                r={p.size}
                fill="#C5A059"
                filter="url(#glow)"
              />
              <circle
                cx={200 + Math.cos(p.angle) * p.radius}
                cy={200 + Math.sin(p.angle) * p.radius}
                r={p.size + 4}
                fill="transparent"
                stroke="#C5A059"
                strokeWidth="0.5"
                className="animate-ping"
                style={{ animationDuration: `${2 + i}s` }}
              />
            </motion.g>
          ))}

          {/* Center Geometry */}
          <motion.path
            d="M200 150 L250 250 L150 250 Z"
            fill="transparent"
            stroke="#C5A059"
            strokeWidth="1"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />
          <motion.path
            d="M200 250 L250 150 L150 150 Z"
            fill="transparent"
            stroke="#C5A059"
            strokeWidth="1"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: "easeInOut", delay: 0.5 }}
          />
        </svg>

        {/* Technical Labels */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 font-mono text-[8px] text-gold/40 uppercase tracking-[0.3em]">
            Frequency Alpha-9
          </div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 font-mono text-[8px] text-gold/40 uppercase tracking-[0.3em]">
            Karmic Resonance Locked
          </div>
        </div>
      </motion.div>
    </div>
  );
}
