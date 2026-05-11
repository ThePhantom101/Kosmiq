"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BookOpen, Sun, Moon, Zap, Star, 
  LayoutGrid, Compass, Info, ChevronRight 
} from "lucide-react";

const TOPICS = [
  { id: "planets", title: "Planets (Grahas)", icon: Sun, color: "text-gold" },
  { id: "signs", title: "Zodiac Signs (Rāshis)", icon: Star, color: "text-gold" },
  { id: "houses", title: "Houses (Bhāvas)", icon: LayoutGrid, color: "text-gold" },
  { id: "dasha", title: "Time Cycles (Dashas)", icon: Compass, color: "text-gold" },
];

const CONTENT: Record<string, any> = {
  planets: [
    { name: "Sun (Surya)", desc: "The Soul, Authority, and Vitality. Represents the father and one's core ego." },
    { name: "Moon (Chandra)", desc: "The Mind, Emotions, and Nurturing. Represents the mother and mental peace." },
    { name: "Mars (Mangala)", desc: "Energy, Courage, and Action. The warrior spirit and physical strength." },
    { name: "Mercury (Budha)", desc: "Intellect, Communication, and Business. The analytical power of the mind." },
    { name: "Jupiter (Guru)", desc: "Wisdom, Expansion, and Fortune. The great teacher and bringer of luck." },
    { name: "Venus (Shukra)", desc: "Love, Beauty, and Luxury. Governs relationships and aesthetic sense." },
    { name: "Saturn (Shani)", desc: "Discipline, Karma, and Time. The taskmaster who brings lessons through delay." },
  ],
  signs: [
    { name: "Aries (Mesha)", desc: "The Pioneer. High energy, impulsive, and courageous. Ruled by Mars." },
    { name: "Taurus (Vrishabha)", desc: "The Builder. Stable, sensual, and determined. Ruled by Venus." },
    { name: "Gemini (Mithuna)", desc: "The Messenger. Intellectual, adaptable, and social. Ruled by Mercury." },
    // ... adding more as needed or keeping it concise
  ],
  houses: [
    { name: "1st House (Lagna)", desc: "Self, Physicality, and General Life Path. The most important house." },
    { name: "2nd House", desc: "Wealth, Family, and Speech. Resources at your disposal." },
    { name: "7th House", desc: "Partnerships, Marriage, and Others. The mirror to the self." },
    { name: "10th House", desc: "Career, Reputation, and Karma in the World. Your highest point." },
  ]
};

export default function LearningPage() {
  const [activeTopic, setActiveTopic] = useState("planets");

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 pb-32">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 space-y-4 md:space-y-0 border-b border-white/5 pb-8">
        <div>
          <h1 className="text-4xl font-light tracking-tight text-white mb-1">
            Learning Center
          </h1>
          <p className="text-gold text-xs uppercase tracking-[0.4em] font-medium opacity-80">
            Vedic Wisdom (Jyotisha Shastra)
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-4 space-y-3">
          {TOPICS.map((topic) => (
            <button
              key={topic.id}
              onClick={() => setActiveTopic(topic.id)}
              className={`w-full flex items-center justify-between p-6 rounded-2xl border transition-all ${
                activeTopic === topic.id 
                  ? "bg-gold/10 border-gold/40 text-white shadow-[0_0_20px_rgba(197,160,89,0.1)]" 
                  : "bg-white/5 border-white/10 text-white/40 hover:bg-white/[0.08] hover:border-white/20"
              }`}
            >
              <div className="flex items-center gap-4">
                <topic.icon className={`w-6 h-6 ${activeTopic === topic.id ? "text-gold" : "text-white/20"}`} />
                <span className="text-sm font-bold uppercase tracking-widest">{topic.title}</span>
              </div>
              <ChevronRight className={`w-4 h-4 transition-transform ${activeTopic === topic.id ? "translate-x-0" : "-translate-x-2 opacity-0"}`} />
            </button>
          ))}

          <div className="p-8 bg-black/40 border border-gold/10 rounded-3xl mt-8">
            <h4 className="text-xs font-bold text-gold uppercase tracking-widest mb-4">Quick Tip</h4>
            <p className="text-xs text-white/40 leading-relaxed italic">
              "Vedic Astrology is not about prediction alone, but about understanding the seasonal rhythms of your own soul's journey."
            </p>
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTopic}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 gap-6">
                {(CONTENT[activeTopic] || []).map((item: any, idx: number) => (
                  <div 
                    key={item.name}
                    className="group bg-white/[0.03] border border-white/5 hover:border-gold/30 rounded-3xl p-8 transition-all duration-500"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-2xl font-light text-white group-hover:text-gold transition-colors">{item.name}</h3>
                      <div className="p-2 bg-gold/5 border border-gold/10 rounded-lg">
                        <Info className="w-4 h-4 text-gold/40" />
                      </div>
                    </div>
                    <p className="text-white/40 leading-relaxed group-hover:text-white/60 transition-colors">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
