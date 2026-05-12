"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar, 
  Plus, 
  Trash2, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  ChevronRight, 
  Zap, 
  Heart, 
  Briefcase, 
  Home, 
  GraduationCap,
  History,
  Target
} from "lucide-react";
import { useAstro } from "@/context/AstroContext";

const EVENT_TYPES = [
  { id: "Career", icon: Briefcase, color: "text-gold", label: "Professional Shift" },
  { id: "Relationship", icon: Heart, color: "text-red-500", label: "Karmic Bond" },
  { id: "Health", icon: Zap, color: "text-zinc-400", label: "Vitality Shift" },
  { id: "Travel", icon: MapPin, color: "text-zinc-500", label: "Relocation" },
  { id: "Financial", icon: Target, color: "text-gold", label: "Abundance Event" },
  { id: "Family", icon: Home, color: "text-zinc-400", label: "Domestic Pivot" },
  { id: "Education", icon: GraduationCap, color: "text-zinc-500", label: "Intellectual Peak" },
  { id: "Other", icon: Calendar, color: "text-zinc-600", label: "Life Anchor" }
];

export default function EventsCalibrationPage() {
  const { data: astroData } = useAstro();
  const [events, setEvents] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newEvent, setNewEvent] = useState({
    type: "Career",
    date: "",
    description: "",
    impact: "Moderate"
  });

  useEffect(() => {
    const saved = localStorage.getItem("kosmiq_life_events");
    if (saved) {
      try {
        setEvents(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse events", e);
      }
    }
  }, []);

  const saveEvents = (updated: any[]) => {
    setEvents(updated);
    localStorage.setItem("kosmiq_life_events", JSON.stringify(updated));
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = [...events, newEvent].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    saveEvents(updated);
    setIsAdding(false);
    setNewEvent({ type: "Career", date: "", description: "", impact: "Moderate" });
  };

  const removeEvent = (idx: number) => {
    const updated = events.filter((_, i) => i !== idx);
    saveEvents(updated);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 pb-32 space-y-20">
      {/* CINEMATIC HEADER */}
      <section className="flex flex-col md:flex-row items-center justify-between gap-8 pb-12 border-b border-white/5">
        <div className="space-y-4 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-4">
            <span className="overline-label text-gold/60 tracking-[0.4em]">Historical Mapping</span>
            <div className="h-[1px] w-12 bg-gold/20" />
          </div>
          <h1 className="text-6xl md:text-8xl font-serif text-white tracking-tighter uppercase leading-[0.8]">
            Important <br /> <span className="text-gold">Life Dates</span>
          </h1>
          <div className="flex items-center justify-center md:justify-start gap-3 pt-4">
            <div className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest">Chronicle: Patterns of Time</div>
            <div className="w-1 h-1 bg-zinc-800 rounded-full" />
            <div className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest">Karmic Anchor Logging</div>
          </div>
        </div>

        <div className="flex flex-col items-center md:items-end gap-6">
           <div className="hud-module p-6 border-gold/10 bg-gold/[0.02] space-y-2 max-w-xs text-right hidden lg:block">
              <p className="text-[10px] text-zinc-400 leading-relaxed uppercase tracking-widest italic">
                Each anchor point helps the engine synchronize your natal chart with your actual lived experience.
              </p>
           </div>
           <button 
             onClick={() => setIsAdding(true)}
             className="bg-gold text-black px-10 py-4 rounded-sm text-[10px] font-black uppercase tracking-[0.2em] hover:scale-105 transition-all shadow-[0_0_20px_rgba(201,168,76,0.2)] flex items-center gap-3"
           >
             <Plus className="w-4 h-4" /> Initialize Anchor
           </button>
        </div>
      </section>

      {/* CHRONICLE TIMELINE */}
      <div className="max-w-4xl mx-auto">
        {events.length > 0 ? (
          <div className="relative space-y-12">
            {/* Timeline Line */}
            <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-white/5 md:-translate-x-1/2 z-0">
               <div className="absolute inset-0 bg-gradient-to-b from-gold/20 via-transparent to-transparent" />
            </div>

            {events.map((event, idx) => {
              const config = EVENT_TYPES.find(t => t.id === event.type) || EVENT_TYPES[7];
              const isEven = idx % 2 === 0;

              return (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="relative z-10 flex flex-col md:flex-row items-center gap-8 md:gap-0"
                >
                  {/* Content Alignment Logic */}
                  <div className={`flex-1 w-full md:pr-12 text-left md:text-right ${isEven ? 'md:block' : 'md:hidden'}`}>
                    <div className="space-y-1">
                      <span className="text-[9px] font-black uppercase tracking-widest text-gold/40">{event.date}</span>
                      <h3 className="text-xl font-serif text-white uppercase tracking-tight">{config.label}</h3>
                      <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{event.description}</p>
                    </div>
                  </div>

                  {/* Center Node */}
                  <div className="relative flex items-center justify-center w-12 shrink-0">
                     <div className="w-12 h-12 rounded-full bg-black border border-white/10 flex items-center justify-center relative z-10 group hover:border-gold transition-colors">
                        <config.icon className={`w-5 h-5 ${config.color}`} />
                        <div className="absolute inset-0 rounded-full bg-gold/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                     </div>
                     <button 
                       onClick={() => removeEvent(idx)}
                       className="absolute -right-12 top-1/2 -translate-y-1/2 p-2 text-zinc-800 hover:text-red-400 transition-colors"
                     >
                       <Trash2 className="w-3 h-3" />
                     </button>
                  </div>

                  {/* Right Side */}
                  <div className={`flex-1 w-full md:pl-12 text-left ${!isEven ? 'md:block' : 'md:hidden'}`}>
                    <div className="space-y-1">
                      <span className="text-[9px] font-black uppercase tracking-widest text-gold/40">{event.date}</span>
                      <h3 className="text-xl font-serif text-white uppercase tracking-tight">{config.label}</h3>
                      <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{event.description}</p>
                    </div>
                  </div>

                  {/* Mobile Mobile Layout (force visible) */}
                  <div className="md:hidden w-full text-left mt-2">
                    <div className="space-y-1 pl-12">
                      <span className="text-[9px] font-black uppercase tracking-widest text-gold/40">{event.date}</span>
                      <h3 className="text-lg font-serif text-white uppercase tracking-tight">{config.label}</h3>
                      <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{event.description}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-24 space-y-8">
            <div className="relative inline-block">
               <History className="w-24 h-24 text-gold/5 mx-auto" />
               <div className="absolute inset-0 blur-3xl bg-gold/5" />
            </div>
            <div className="space-y-4">
               <p className="text-2xl font-serif text-white uppercase tracking-tight">Timeline Empty</p>
               <p className="text-[10px] text-zinc-500 leading-relaxed uppercase tracking-[0.3em] max-w-sm mx-auto">
                 The intelligence engine requires major life anchor points to calibrate your planetary resonance scores.
               </p>
            </div>
            <button 
              onClick={() => setIsAdding(true)}
              className="inline-block bg-white/5 border border-white/10 text-white font-black uppercase tracking-[0.2em] text-[10px] px-10 py-5 rounded-sm hover:bg-white/10 hover:border-white/20 transition-all"
            >
              Log First Anchor
            </button>
          </div>
        )}
      </div>

      {/* ADD EVENT MODAL */}
      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAdding(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-xl hud-module p-10 bg-zinc-950 border-gold/20 shadow-[0_0_50px_rgba(0,0,0,0.5)]"
            >
              <div className="space-y-8">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gold/60">New Calibration Point</span>
                    <h2 className="text-3xl font-serif text-white uppercase tracking-tight">Initialize Anchor</h2>
                  </div>
                  <button onClick={() => setIsAdding(false)} className="text-zinc-600 hover:text-white transition-colors p-2">
                    <AlertCircle className="w-6 h-6 rotate-45" />
                  </button>
                </div>

                <form onSubmit={handleAddEvent} className="space-y-8">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Classification</label>
                      <select 
                        className="w-full bg-black/60 border border-white/10 rounded-sm px-4 py-3 text-sm text-white focus:outline-none focus:border-gold transition-all"
                        value={newEvent.type}
                        onChange={e => setNewEvent({...newEvent, type: e.target.value})}
                      >
                        {EVENT_TYPES.map(t => (
                          <option key={t.id} value={t.id}>{t.label}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Temporal Stamp</label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gold/40" />
                        <input 
                          type="date"
                          required
                          className="w-full bg-black/60 border border-white/10 rounded-sm pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-gold transition-all"
                          value={newEvent.date}
                          onChange={e => setNewEvent({...newEvent, date: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Event Context</label>
                    <textarea 
                      required
                      placeholder="e.g. Major career promotion, Significant relocation, etc."
                      className="w-full bg-black/60 border border-white/10 rounded-sm px-4 py-4 text-sm text-white focus:outline-none focus:border-gold transition-all min-h-[120px] resize-none"
                      value={newEvent.description}
                      onChange={e => setNewEvent({...newEvent, description: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Impact Intensity</label>
                    <div className="grid grid-cols-3 gap-4">
                      {["Subtle", "Moderate", "Pivotal"].map(level => (
                        <button
                          key={level}
                          type="button"
                          onClick={() => setNewEvent({...newEvent, impact: level})}
                          className={`py-3 rounded-sm text-[10px] font-black uppercase tracking-widest border transition-all ${
                            newEvent.impact === level 
                              ? "bg-gold border-gold text-black shadow-[0_0_15px_rgba(201,168,76,0.3)]" 
                              : "border-white/5 bg-white/[0.02] text-zinc-600 hover:border-white/20"
                          }`}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-gold text-black font-black uppercase tracking-[0.2em] text-[11px] py-5 rounded-sm hover:scale-[1.02] transition-all shadow-[0_0_30px_rgba(201,168,76,0.2)] mt-4"
                  >
                    Commit to Timeline
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
