"use client";

import React from "react";
import { PlanetaryPosition, Nakshatra } from "@/types/astro";

interface PlanetaryTableProps {
  planets: Record<string, PlanetaryPosition>;
  ascendant: number;
  ascendant_nakshatra: Nakshatra;
}

const ZODIAC_SIGNS = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

const PLANET_ORDER = [
  "Lagna", "Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"
];

export default function PlanetaryTable({ planets, ascendant, ascendant_nakshatra }: PlanetaryTableProps) {
  const getPositionDetails = (longitude: number) => {
    const signIdx = Math.floor(longitude / 30);
    const signName = ZODIAC_SIGNS[signIdx];
    const degrees = longitude % 30;
    const deg = Math.floor(degrees);
    const min = Math.floor((degrees - deg) * 60);
    return { signName, deg, min };
  };

  const rows = PLANET_ORDER.map(name => {
    const isLagna = name === "Lagna";
    const lon = isLagna ? ascendant : planets[name]?.longitude;
    if (lon === undefined) return null;
    
    const { signName, deg, min } = getPositionDetails(lon);
    const nak = isLagna ? ascendant_nakshatra : planets[name]?.nakshatra;
    const isRetro = !isLagna && planets[name]?.is_retrograde;

    if (!nak) {
      console.warn(`No nakshatra data for ${name}`);
    }

    return (
      <tr key={name} className="border-b border-gold/5 hover:bg-gold/5 transition-colors group">
        <td className="py-4 pl-4 text-sm font-bold text-white group-hover:text-gold transition-colors">{name}</td>
        <td className="py-4 text-sm text-gray-400">{signName}</td>
        <td className="py-4 text-sm text-gray-300 font-mono">
          {deg}° {min}' {isRetro ? <span className="text-red-400 text-[10px] ml-1 tracking-tighter uppercase">(Retro)</span> : ""}
        </td>
        <td className="py-4">
          <div className="flex flex-col">
            <span className="text-sm text-gold font-medium">{nak?.name || "Initializing..."}</span>
            <span className="text-[10px] text-gray-500 uppercase tracking-widest">
              {nak ? `Pada ${nak.pada}` : "---"}
            </span>
          </div>
        </td>
      </tr>
    );
  }).filter(Boolean);

  return (
    <div className="w-full overflow-hidden rounded-sm border border-gold/10 bg-gold/5 backdrop-blur-sm">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gold/10">
            <th className="py-4 pl-4 text-[10px] uppercase tracking-[0.2em] text-gold/60 font-bold">Planet</th>
            <th className="py-4 text-[10px] uppercase tracking-[0.2em] text-gold/60 font-bold">Sign</th>
            <th className="py-4 text-[10px] uppercase tracking-[0.2em] text-gold/60 font-bold">Position</th>
            <th className="py-4 text-[10px] uppercase tracking-[0.2em] text-gold/60 font-bold">Nakshatra</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gold/5">
          {rows}
        </tbody>
      </table>
    </div>
  );
}
