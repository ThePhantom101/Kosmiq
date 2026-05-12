"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BookOpen, Sun, Moon, Zap, Star, 
  LayoutGrid, Compass, Info, ChevronRight,
  Library, Sparkles, Target, Shield,
  Lightbulb
} from "lucide-react";

const TOPICS = [
  { id: "planets", title: "Planets (Grahas)", icon: Sun, color: "text-gold", label: "Celestial Engines" },
  { id: "signs", title: "Zodiac Signs (Rāshis)", icon: Star, color: "text-gold", label: "Archetypal Fields" },
  { id: "houses", title: "Houses (Bhāvas)", icon: LayoutGrid, color: "text-gold", label: "Lived Domains" },
  { id: "dasha", title: "Time Cycles (Dashas)", icon: Compass, color: "text-gold", label: "Temporal Loops" },
];

const CONTENT: Record<string, any> = {
  planets: [
    { name: "Sun (Surya)", desc: "The Soul, Authority, and Vitality. Represents the father and one's core ego.", tag: "Identity" },
    { name: "Moon (Chandra)", desc: "The Mind, Emotions, and Nurturing. Represents the mother and mental peace.", tag: "Consciousness" },
    { name: "Mars (Mangala)", desc: "Energy, Courage, and Action. The warrior spirit and physical strength.", tag: "Willpower" },
    { name: "Mercury (Budha)", desc: "Intellect, Communication, and Business. The analytical power of the mind.", tag: "Logic" },
    { name: "Jupiter (Guru)", desc: "Wisdom, Expansion, and Fortune. The great teacher and bringer of luck.", tag: "Grace" },
    { name: "Venus (Shukra)", desc: "Love, Beauty, and Luxury. Governs relationships and aesthetic sense.", tag: "Attraction" },
    { name: "Saturn (Shani)", desc: "Discipline, Karma, and Time. The taskmaster who brings lessons through delay.", tag: "Structure" },
  ],
  signs: [
    { name: "Aries (Mesha)", desc: "The Pioneer. High energy, impulsive, and courageous. Ruled by Mars.", tag: "Fire" },
    { name: "Taurus (Vrishabha)", desc: "The Builder. Stable, sensual, and determined. Ruled by Venus.", tag: "Earth" },
    { name: "Gemini (Mithuna)", desc: "The Messenger. Intellectual, adaptable, and social. Ruled by Mercury.", tag: "Air" },
  ],
  houses: [
    { name: "1st House (Lagna)", desc: "Self, Physicality, and General Life Path. The most important house.", tag: "Persona" },
    { name: "2nd House", desc: "Wealth, Family, and Speech. Resources at your disposal.", tag: "Possessions" },
    { name: "7th House", desc: "Partnerships, Marriage, and Others. The mirror to the self.", tag: "Relation" },
    { name: "10th House", desc: "Career, Reputation, and Karma in the World. Your highest point.", tag: "Legacy" },
  ],
  dasha: [
    { name: "Mahadasha", desc: "Major temporal period lasting years. Dictates the primary theme of life.", tag: "Primary" },
    { name: "Antardasha", desc: "Sub-period nested within a Mahadasha. Refines the local experience.", tag: "Secondary" },
    { name: "Pratyantar", desc: "Third-level temporal slice. Governs week-to-month level events.", tag: "Micro" }
  ]
};

export default function LearningPage() {
  const [activeTopic, setActiveTopic] = useState("planets");

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 pb-32 space-y-20">
      {/* CINEMATIC HEADER */}
      <section className="flex flex-col md:flex-row items-center justify-between gap-8 pb-12 border-b border-white/5">
        <div className="space-y-4 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-4">
            <span className="overline-label text-gold/60 tracking-[0.4em]">Vedic Wisdom</span>
            <div className="h-[1px] w-12 bg-gold/20" />
          </div>
          <h1 className="text-6xl md:text-8xl font-serif text-white tracking-tighter uppercase leading-[0.8]">
            Intelligence <br /> <span className="text-gold">Library</span>
          </h1>
          <div className="flex items-center justify-center md:justify-start gap-3 pt-4">
            <div className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest">Shastra: Ancient Frameworks</div>
            <div className="w-1 h-1 bg-zinc-800 rounded-full" />
            <div className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest">Cognitive Mapping</div>
          </div>
        </div>

        <div className="hidden lg:block">
           <div className="hud-module p-6 border-gold/10 bg-gold/[0.02] space-y-4 max-w-xs text-right">
              <div className="flex items-center justify-end gap-3">
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Methodology</span>
                <Library className="w-4 h-4 text-gold/60" />
              </div>
              <p className="text-[10px] text-zinc-400 leading-relaxed uppercase tracking-widest italic">
                Synthesizing thousands of years of observational data into a modern cognitive architecture.
              </p>
           </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 max-w-6xl mx-auto">
        {/* TOPIC SELECTION */}
        <div className="lg:col-span-4 space-y-6">
          <div className="flex items-center gap-3 mb-2">
             <Target className="w-4 h-4 text-gold" />
             <h3 className="text-[10px] font-black uppercase tracking-widest text-white">System Modules</h3>
          </div>

          <div className="space-y-3">
            {TOPICS.map((topic) => (
              <button
                key={topic.id}
                onClick={() => setActiveTopic(topic.id)}
                className={`w-full group flex items-center justify-between p-6 rounded-sm border transition-all ${
                  activeTopic === topic.id 
                    ? "bg-gold/[0.05] border-gold shadow-[0_0_20px_rgba(201,168,76,0.1)]" 
                    : "bg-transparent border-white/5 hover:border-white/20"
                }`}
              >
                <div className="flex items-center gap-5">
                  <div className={`p-3 rounded-sm transition-colors ${activeTopic === topic.id ? 'bg-gold/10' : 'bg-white/5 group-hover:bg-white/10'}`}>
                    <topic.icon className={`w-5 h-5 ${activeTopic === topic.id ? "text-gold" : "text-zinc-600 group-hover:text-zinc-400"}`} />
                  </div>
                  <div className="text-left">
                    <div className={`text-[10px] font-black uppercase tracking-widest ${activeTopic === topic.id ? 'text-white' : 'text-zinc-600 group-hover:text-zinc-400'}`}>
                       {topic.title}
                    </div>
                    <div className="text-[8px] font-black uppercase tracking-widest text-zinc-800 group-hover:text-zinc-700 transition-colors mt-1">
                       {topic.label}
                    </div>
                  </div>
                </div>
                <ChevronRight className={`w-4 h-4 transition-all ${activeTopic === topic.id ? "text-gold translate-x-0" : "text-zinc-900 -translate-x-2 opacity-0"}`} />
              </button>
            ))}
          </div>

          <div className="p-8 hud-module border-gold/10 bg-gold/[0.02] mt-12 space-y-4">
            <div className="flex items-center gap-2">
               <Lightbulb className="w-4 h-4 text-gold/60" />
               <span className="text-[10px] font-black uppercase tracking-widest text-gold/60">Core Principle</span>
            </div>
            <p className="text-[10px] text-zinc-500 leading-relaxed uppercase font-black tracking-widest italic">
              "The observer and the observed are a single system. Your chart is not a map of the world, but a map of your perception of it."
            </p>
          </div>
        </div>

        {/* TOPIC CONTENT */}
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTopic}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4, ease: "circOut" }}
              className="grid grid-cols-1 gap-6"
            >
              {(CONTENT[activeTopic] || []).map((item: any, idx: number) => (
                <motion.div 
                  key={item.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="group relative hud-module p-10 space-y-6 hover:border-gold/30 transition-all duration-500"
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                       <h3 className="text-3xl font-serif text-white tracking-tight group-hover:text-gold transition-colors">{item.name}</h3>
                       <div className="flex items-center gap-2 pt-2">
                          <span className="px-3 py-1 border border-white/10 rounded-full text-[8px] font-black uppercase tracking-widest text-zinc-600 group-hover:text-gold/60 group-hover:border-gold/20 transition-all">
                             {item.tag}
                          </span>
                       </div>
                    </div>
                    <div className="p-2 bg-white/5 border border-white/5 rounded-sm">
                       <Info className="w-4 h-4 text-zinc-800 group-hover:text-gold/40 transition-colors" />
                    </div>
                  </div>
                  
                  <div className="h-px w-full bg-white/5" />

                  <p className="text-sm text-zinc-500 leading-relaxed group-hover:text-zinc-300 transition-colors max-w-2xl">
                    {item.desc}
                  </p>

                  {/* Visual Decoration */}
                  <div className="absolute right-0 bottom-0 p-8 opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0">
                     <Sparkles className="w-8 h-8 text-gold/10" />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <style jsx>{`
        .overline-label {
          @apply text-[10px] font-black uppercase tracking-[0.3em] block;
        }
      `}</style>
    </div>
  );
}
