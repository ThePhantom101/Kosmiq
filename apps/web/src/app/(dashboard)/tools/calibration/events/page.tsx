"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Briefcase, 
  Heart, 
  Stethoscope, 
  Coins, 
  Users, 
  Plane, 
  BookOpen, 
  Calendar, 
  X, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Trash2,
  CheckCircle,
  Info
} from "lucide-react";
import { useAstro } from "@/context/AstroContext";

const CATEGORIES = [
  { id: "Career", icon: Briefcase, color: "text-gold" },
  { id: "Relationships", icon: Heart, color: "text-gold/90" },
  { id: "Health", icon: Stethoscope, color: "text-white" },
  { id: "Finance", icon: Coins, color: "text-gold" },
  { id: "Family", icon: Users, color: "text-gold/70" },
  { id: "Travel", icon: Plane, color: "text-white/80" },
  { id: "Education", icon: BookOpen, color: "text-gold/80" },
];

const EVENT_TYPES: Record<string, string[]> = {
  Career: ["Job Change", "Promotion", "Business Start", "Loss of Job", "Recognition"],
  Relationships: ["Marriage", "Divorce", "New Relationship", "Breakup", "Engagement"],
  Health: ["Major Illness", "Surgery", "Accident", "Recovery", "Vitality Peak"],
  Finance: ["Major Gain", "Major Loss", "Investment", "Property Purchase", "Inheritance"],
  Family: ["Birth of Child", "Death of Family Member", "Parent's Illness", "Family Reunion"],
  Travel: ["Major Relocation", "Long Foreign Travel", "Pilgrimage", "Expedition"],
  Education: ["Degree Completion", "Major Exam", "New Course", "Scholarship"],
};

export default function ImportantDatesPage() {
  const { data: astroData } = useAstro();
  const [events, setEvents] = useState<any[]>([]);
  
  React.useEffect(() => {
    const saved = localStorage.getItem("kosmiq_life_events");
    if (saved) {
      try {
        setEvents(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse life events", e);
      }
    }
  }, []);

  const saveEvents = (newEvents: any[]) => {
    setEvents(newEvents);
    localStorage.setItem("kosmiq_life_events", JSON.stringify(newEvents));
  };
  
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [newEvent, setNewEvent] = useState({
    category: "Career",
    event_type: "Job Change",
    date: "",
    note: "",
    impact: "Positive"
  });

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // if (!astroData?.profile?.id) throw new Error("No profile found");

      const res = await fetch("/api/user/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newEvent,
          profile_id: astroData?.profile?.id || "me"
        }),
      });
      
      if (res.ok) {
        const result = await res.json();
        saveEvents([...events, { ...result.data, id: Date.now() }]);
        setIsAdding(false);
        setNewEvent({
          category: "Career",
          event_type: "Job Change",
          date: "",
          note: "",
          impact: "Positive"
        });
      }
    } catch (err) {
      console.error("Failed to save event", err);
    } finally {
      setIsLoading(false);
    }
  };

  const removeEvent = (id: number) => {
    saveEvents(events.filter(e => e.id !== id));
  };

  return (
    <div className="space-y-8 pb-32">
      <div className="flex flex-col space-y-2">
        <span className="overline-label text-gold/60">Calibration Tool</span>
        <h1 className="text-4xl font-serif text-white tracking-tight">Important Dates</h1>
        <p className="text-gray-400 max-w-2xl">
          Log significant life events to help our AI validate your chart against reality. {events.length} life events logged — helping Raj Jyotishi know you better.
        </p>
      </div>

      {/* Events List */}
      <div className="space-y-4">
        {events.length === 0 ? (
          <div className="hud-module p-12 text-center space-y-4">
            <Calendar className="w-12 h-12 text-gold/20 mx-auto" />
            <p className="text-gray-500 italic">No events logged yet. Start building your life timeline.</p>
            <button 
              onClick={() => setIsAdding(true)}
              className="text-gold border border-gold/40 px-6 py-2 rounded-sm hover:bg-gold/10 transition-all text-sm font-bold uppercase tracking-widest"
            >
              Log First Event
            </button>
          </div>
        ) : (
          events.sort((a, b) => b.date.localeCompare(a.date)).map((event, idx) => {
            const cat = CATEGORIES.find(c => c.id === event.category) || CATEGORIES[0];
            return (
              <motion.div 
                key={event.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="hud-module p-5 flex items-center justify-between group"
              >
                <div className="flex items-center space-x-6">
                  <div className={`p-3 bg-black border border-gold/10 rounded-sm ${cat.color}`}>
                    <cat.icon className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-3">
                      <span className="text-white font-semibold">{event.type}</span>
                      <span className="text-xs text-gray-500 font-mono">{event.date}</span>
                      <ImpactBadge impact={event.impact} />
                    </div>
                    <p className="text-xs text-gray-400 italic">{event.note || "No additional notes"}</p>
                  </div>
                </div>
                <button 
                  onClick={() => removeEvent(event.id)}
                  className="opacity-0 group-hover:opacity-100 p-2 text-gray-500 hover:text-red-400 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Floating Add Button */}
      <button 
        onClick={() => setIsAdding(true)}
        className="fixed bottom-10 right-10 w-14 h-14 bg-gold rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all z-40 text-black"
      >
        <Plus className="w-8 h-8" />
      </button>

      {/* Add Modal */}
      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAdding(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative hud-module p-8 w-full max-w-xl bg-black"
            >
              <button 
                onClick={() => setIsAdding(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
              
              <h3 className="text-2xl font-serif text-white mb-6">Log Life Event</h3>
              
              <form onSubmit={handleAddEvent} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest text-gold/60 font-bold">Category</label>
                    <select 
                      className="w-full bg-black border border-gold/20 rounded-sm p-3 text-sm text-white"
                      value={newEvent.category}
                      onChange={e => setNewEvent({...newEvent, category: e.target.value, event_type: EVENT_TYPES[e.target.value][0]})}
                    >
                      {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.id}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest text-gold/60 font-bold">Event Type</label>
                    <select 
                      className="w-full bg-black border border-gold/20 rounded-sm p-3 text-sm text-white"
                      value={newEvent.event_type}
                      onChange={e => setNewEvent({...newEvent, event_type: e.target.value})}
                    >
                      {EVENT_TYPES[newEvent.category].map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest text-gold/60 font-bold">Date (YYYY-MM)</label>
                    <input 
                      type="month"
                      className="w-full bg-black border border-gold/20 rounded-sm p-3 text-sm text-white"
                      value={newEvent.date}
                      onChange={e => setNewEvent({...newEvent, date: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest text-gold/60 font-bold">Impact</label>
                    <select 
                      className="w-full bg-black border border-gold/20 rounded-sm p-3 text-sm text-white"
                      value={newEvent.impact}
                      onChange={e => setNewEvent({...newEvent, impact: e.target.value})}
                    >
                      <option value="Positive">Positive</option>
                      <option value="Negative">Negative</option>
                      <option value="Mixed">Mixed</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest text-gold/60 font-bold">Note (Optional)</label>
                  <input 
                    type="text"
                    maxLength={100}
                    placeholder="Brief detail..."
                    className="w-full bg-black border border-gold/20 rounded-sm p-3 text-sm text-white"
                    value={newEvent.note}
                    onChange={e => setNewEvent({...newEvent, note: e.target.value})}
                  />
                </div>

                <button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gold text-black font-bold uppercase tracking-[0.2em] text-xs py-4 rounded-sm hover:bg-gold/90 transition-all mt-4"
                >
                  {isLoading ? "Saving..." : "Log Event"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ImpactBadge({ impact }: { impact: string }) {
  if (impact === "Positive") {
    return (
      <span className="flex items-center space-x-1 text-[10px] font-bold text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full">
        <TrendingUp className="w-3 h-3" />
        <span>POSITIVE</span>
      </span>
    );
  }
  if (impact === "Negative") {
    return (
      <span className="flex items-center space-x-1 text-[10px] font-bold text-red-400 bg-red-400/10 px-2 py-0.5 rounded-full">
        <TrendingDown className="w-3 h-3" />
        <span>NEGATIVE</span>
      </span>
    );
  }
  return (
    <span className="flex items-center space-x-1 text-[10px] font-bold text-gray-400 bg-gray-400/10 px-2 py-0.5 rounded-full">
      <Minus className="w-3 h-3" />
      <span>MIXED</span>
    </span>
  );
}
