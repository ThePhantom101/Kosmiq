"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Activity, 
  Clock, 
  Target, 
  Zap, 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2, 
  AlertCircle,
  Cpu,
  History,
  Timer
} from "lucide-react";
import { useAstro } from "@/context/AstroContext";
import { AuthGate } from "@/components/auth/AuthGate";

const STEPS = ["Time Range", "Life Events", "Method", "Results"];

export default function RectificationPage() {
  const { data: astroData } = useAstro();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [uncertainty, setUncertainty] = useState(30); // minutes
  const [method, setMethod] = useState("AI");
  const [candidates, setCandidates] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("kosmiq_life_events");
    if (saved) {
      try {
        setEvents(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse life events", e);
      }
    }
  }, []);

  const handleNext = () => {
    if (currentStep === 3) {
      runRectification();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const runRectification = async () => {
    setIsLoading(true);
    setCurrentStep(4);
    
    try {
      // if (!astroData?.profile?.id) throw new Error("No profile found");

      const res = await fetch("/api/tools/rectify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          current_birth_data: { 
            time_of_birth: astroData?.birth_data?.time || "12:00:00",
            date_of_birth: astroData?.birth_data?.date || "2000-01-01",
            location: astroData?.birth_data?.location || "Delhi, India"
          },
          uncertainty_minutes: uncertainty,
          life_events: events,
          profile_id: astroData?.profile?.id || "me"
        }),
      });
      
      const data = await res.json();
      setCandidates(data.candidates);
    } catch (err) {
      console.error("Rectification failed", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthGate mode="redirect">
      <div className="space-y-8 pb-20">
      <div className="flex flex-col space-y-2">
        <span className="overline-label text-gold/60">Advanced Tool</span>
        <div className="flex items-baseline space-x-4">
          <h1 className="text-4xl font-serif text-white tracking-tight">Chart Rectification</h1>
          <span className="text-gold/60 text-sm font-serif italic">Birth Time Refinement</span>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="flex items-center justify-between max-w-2xl mx-auto mb-12">
        {STEPS.map((step, idx) => (
          <div key={step} className="flex flex-col items-center space-y-2 relative">
            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold z-10 transition-all ${
              currentStep > idx + 1 ? "bg-gold border-gold text-black" : 
              currentStep === idx + 1 ? "border-gold text-gold shadow-[0_0_15px_rgba(197,160,89,0.3)]" : 
              "border-gray-800 text-gray-600"
            }`}>
              {currentStep > idx + 1 ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
            </div>
            <span className={`text-[10px] uppercase tracking-widest font-bold ${currentStep === idx + 1 ? "text-gold" : "text-gray-600"}`}>
              {step}
            </span>
            {idx < STEPS.length - 1 && (
              <div className={`absolute top-4 left-10 w-24 h-[1px] ${currentStep > idx + 1 ? "bg-gold" : "bg-gray-800"}`} />
            )}
          </div>
        ))}
      </div>

      <div className="max-w-3xl mx-auto min-h-[400px]">
        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="hud-module p-10 space-y-8"
            >
              <div className="flex items-center space-x-4 mb-6">
                <Clock className="w-8 h-8 text-gold" />
                <h3 className="text-2xl font-serif text-white">Birth Time Uncertainty</h3>
              </div>
              
              <div className="space-y-6">
                <div className="p-4 bg-gold/5 border border-gold/10 rounded-sm">
                  <p className="text-sm text-gray-400">Specify how much your birth time might vary. If you truly don't know, select 'Unknown' for a wide search.</p>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between text-sm font-mono">
                    <span className="text-gray-500">Uncertainty Range</span>
                    <span className="text-gold">±{uncertainty === 360 ? "6 Hours (Unknown)" : `${uncertainty} minutes`}</span>
                  </div>
                  <input 
                    type="range"
                    min="15"
                    max="360"
                    step="15"
                    value={uncertainty}
                    onChange={e => setUncertainty(parseInt(e.target.value))}
                    className="w-full accent-gold h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-gray-600 font-bold tracking-widest uppercase">
                    <span>±15m</span>
                    <span>±1hr</span>
                    <span>±2hr</span>
                    <span>Unknown</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="hud-module p-10 space-y-8"
            >
              <div className="flex items-center space-x-4 mb-6">
                <History className="w-8 h-8 text-gold" />
                <h3 className="text-2xl font-serif text-white">Reference Life Events</h3>
              </div>
              
              <div className="space-y-6">
                {events.length > 0 ? (
                  <div className="space-y-3">
                    <p className="text-sm text-gray-400 mb-4">The algorithm will match these events against your Dasha timeline for each candidate birth time.</p>
                    {events.map((e, i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-black/40 border border-gold/10 rounded-sm">
                        <span className="text-white font-medium">{e.type}</span>
                        <span className="text-gold font-mono text-xs">{e.date}</span>
                      </div>
                    ))}
                    <a href="/tools/calibration/events" className="inline-block text-gold text-xs underline mt-2">Edit Events</a>
                  </div>
                ) : (
                  <div className="text-center py-8 space-y-4">
                    <AlertCircle className="w-12 h-12 text-gold/40 mx-auto" />
                    <p className="text-gray-500">No life events logged. Rectification requires at least 3 major life events for accuracy.</p>
                    <a href="/tools/calibration/events" className="inline-block bg-gold text-black font-bold uppercase tracking-widest text-xs px-6 py-3 rounded-sm">
                      Log Events First
                    </a>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div 
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="hud-module p-10 space-y-8"
            >
              <div className="flex items-center space-x-4 mb-6">
                <Zap className="w-8 h-8 text-gold" />
                <h3 className="text-2xl font-serif text-white">Rectification Method</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <button 
                  onClick={() => setMethod("AI")}
                  className={`p-6 border text-left space-y-3 rounded-sm transition-all ${method === "AI" ? "border-gold bg-gold/10" : "border-gold/10 bg-black hover:border-gold/30"}`}
                >
                  <Cpu className={`w-8 h-8 ${method === "AI" ? "text-gold" : "text-gray-600"}`} />
                  <div>
                    <h4 className="text-white font-bold text-sm">Quick Rectification</h4>
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider">AI-Based · 2 Minutes</p>
                  </div>
                  <p className="text-xs text-gray-400">Uses machine learning to cross-reference your Dasha timeline with life events.</p>
                </button>

                <button 
                  onClick={() => setMethod("Classical")}
                  className={`p-6 border text-left space-y-3 rounded-sm transition-all ${method === "Classical" ? "border-gold bg-gold/10" : "border-gold/10 bg-black hover:border-gold/30"}`}
                >
                  <Timer className={`w-8 h-8 ${method === "Classical" ? "text-gold" : "text-gray-600"}`} />
                  <div>
                    <h4 className="text-white font-bold text-sm">Classical Rectification</h4>
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider">Nadi-Based · Sudarshana</p>
                  </div>
                  <p className="text-xs text-gray-400">Tests candidates against Sudarshana Chakra and Shodashvarga cusp changes.</p>
                </button>
              </div>
            </motion.div>
          )}

          {currentStep === 4 && (
            <motion.div 
              key="step4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              {isLoading ? (
                <div className="hud-module p-20 text-center space-y-6">
                  <div className="relative w-20 h-20 mx-auto">
                    <div className="absolute inset-0 border-4 border-gold/20 rounded-full" />
                    <div className="absolute inset-0 border-4 border-t-gold rounded-full animate-spin" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-xl font-serif text-white">Analyzing Karmic Patterns...</p>
                    <p className="text-xs text-gold/60 uppercase tracking-[0.3em]">Testing candidate times against Sudarshana Chakra</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <h3 className="text-2xl font-serif text-white text-center mb-8">Refinement Candidates</h3>
                  {candidates.map((c, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className={`hud-module p-6 flex items-center justify-between ${i === 0 ? "border-gold/60 ring-1 ring-gold/20" : ""}`}
                    >
                      <div className="flex items-center space-x-8">
                        <div className="text-center">
                          <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest block mb-1">Birth Time</span>
                          <span className="text-2xl font-mono text-white">{c.time}</span>
                        </div>
                        <div className="h-10 w-[1px] bg-gold/10" />
                        <div>
                          <span className="text-[10px] text-gold uppercase font-bold tracking-widest block mb-1">Confidence Score</span>
                          <div className="flex items-center space-x-2">
                            <span className="text-lg font-bold text-white">{c.confidence}%</span>
                            <div className="w-24 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                              <div className="h-full bg-gold" style={{ width: `${c.confidence}%` }} />
                            </div>
                          </div>
                        </div>
                        <div className="h-10 w-[1px] bg-gold/10" />
                        <div className="hidden md:block">
                          <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest block mb-1">Key Shifts</span>
                          <div className="flex gap-2">
                            {c.changes.map((ch: string, idx: number) => (
                              <span key={idx} className="text-[9px] bg-gold/5 border border-gold/20 px-2 py-0.5 rounded-full text-gold/80">{ch}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <button className="bg-gold text-black px-6 py-3 rounded-sm text-xs font-bold uppercase tracking-widest hover:bg-gold/90 transition-all">
                        Apply This Time
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Navigation */}
      <div className="flex justify-between items-center max-w-3xl mx-auto pt-8">
        <button 
          onClick={() => setCurrentStep(prev => prev - 1)}
          disabled={currentStep === 1 || currentStep === 4}
          className={`flex items-center space-x-2 text-xs uppercase tracking-widest font-bold transition-all ${
            currentStep === 1 || currentStep === 4 ? "opacity-0 pointer-events-none" : "text-gray-500 hover:text-white"
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        {currentStep < 4 && (
          <button 
            onClick={handleNext}
            className="bg-white/10 hover:bg-white/20 text-white px-10 py-4 rounded-sm flex items-center space-x-3 transition-all group"
          >
            <span className="text-xs font-bold uppercase tracking-[0.2em]">{currentStep === 3 ? "Run Rectification" : "Continue"}</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        )}
      </div>
    </div>
    </AuthGate>
  );
}
