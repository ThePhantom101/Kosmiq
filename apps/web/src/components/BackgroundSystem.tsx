"use client";

import { motion } from "framer-motion";

export default function BackgroundSystem() {
  const orbits = [
    { size: "1200px", duration: 180, reverse: false, dash: "1, 10" },
    { size: "1000px", duration: 120, reverse: true, dash: "4, 8" },
    { size: "800px", duration: 90, reverse: false, dash: "none" },
    { size: "600px", duration: 60, reverse: true, dash: "2, 4" },
  ];

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none bg-black">
      {/* Absolute Black Base */}
      <div className="absolute inset-0 bg-[#000000]" />
      
      {/* Grid Pattern handled in globals.css body */}
      
      {/* Orbital System */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full flex items-center justify-center opacity-20">
        {orbits.map((orbit, i) => (
          <motion.div
            key={i}
            className="absolute border-[0.5px] border-gold rounded-full"
            style={{ 
              width: orbit.size, 
              height: orbit.size,
              borderStyle: orbit.dash === "none" ? "solid" : "dashed",
              strokeDasharray: orbit.dash !== "none" ? orbit.dash : undefined,
            }}
            animate={{ rotate: orbit.reverse ? -360 : 360 }}
            transition={{ duration: orbit.duration, repeat: Infinity, ease: "linear" }}
          >
            {/* Subtle "Planets" or technical nodes on the rings */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-gold rounded-full shadow-[0_0_8px_rgba(197,160,89,0.8)]" />
            {i % 2 === 0 && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-1.5 h-1.5 border border-gold rounded-full" />
            )}
          </motion.div>
        ))}
      </div>

      {/* Decorative Radial Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_80%)]" />

      {/* Subtle Glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-gold/5 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-gold/5 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: "2s" }} />
    </div>
  );
}

