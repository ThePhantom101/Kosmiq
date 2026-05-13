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

import { IntelligenceCard, StatusType } from "@/components/dashboard/IntelligenceCard";

const STEPS = ["Time Range", "Life Events", "Method", "Results"];

export default function RectificationPage() {
  const { data: astroData } = useAstro();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [uncertainty, setUncertainty] = useState(30);
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
      setCandidates(data.candidates || []);
    } catch (err) {
      console.error("Rectification failed", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthGate mode="redirect">
      <div className="max-w-7xl mx-auto px-4 py-12 pb-32 space-y-20">
        {/* CINEMATIC HEADER */}
        <section className="flex flex-col md:flex-row items-center justify-between gap-8 pb-12 border-b border-white/5">
          <div className="space-y-4 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-4">
              <span className="overline-label text-gold/60 tracking-[0.4em]">Precision Calibration</span>
              <div className="h-[1px] w-12 bg-gold/20" />
            </div>
            <h1 className="text-6xl md:text-8xl font-serif text-white tracking-tighter uppercase leading-[0.8]">
              Birth Time <br /> <span className="text-gold">Correction</span>
            </h1>
            <div className="flex items-center justify-center md:justify-start gap-3 pt-4">
              <div className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest">System: Sudarshana-AI</div>
              <div className="w-1 h-1 bg-zinc-800 rounded-full" />
              <div className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest">Temporal Drift Correction</div>
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="hud-module p-6 border-gold/10 bg-gold/[0.02] space-y-4 max-w-xs">
              <div className="flex items-center gap-3">
                <Target className="w-4 h-4 text-gold/60" />
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Objective</span>
              </div>
              <p className="text-[10px] text-zinc-400 leading-relaxed uppercase tracking-widest italic">
                Validating natal alignment by cross-referencing significant life-events against planetary timeline transitions.
              </p>
            </div>
          </div>
        </section>

        {/* PROGRESS INDICATOR */}
        <div className="max-w-4xl mx-auto">
          <div className="relative flex items-center justify-between">
            {/* Connecting Lines */}
            <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/5 -translate-y-1/2 z-0" />
            <motion.div 
              className="absolute top-1/2 left-0 h-[1px] bg-gold shadow-[0_0_10px_rgba(201,168,76,0.5)] -translate-y-1/2 z-0" 
              animate={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />

            {STEPS.map((step, idx) => {
              const isActive = currentStep === idx + 1;
              const isCompleted = currentStep > idx + 1;
              
              return (
                <div key={step} className="relative z-10 flex flex-col items-center gap-4">
                  <motion.div 
                    initial={false}
                    animate={{ 
                      scale: isActive ? 1.2 : 1,
                      backgroundColor: isCompleted ? "#C9A84C" : isActive ? "rgba(0,0,0,1)" : "rgba(24,24,27,1)",
                      borderColor: isCompleted || isActive ? "#C9A84C" : "rgba(39,39,42,1)"
                    }}
                    className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-300`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-black" />
                    ) : (
                      <span className={`text-[10px] font-black ${isActive ? "text-gold" : "text-zinc-600"}`}>0{idx + 1}</span>
                    )}
                  </motion.div>
                  <span className={`text-[9px] font-black uppercase tracking-[0.2em] transition-colors duration-300 ${isActive ? "text-gold" : "text-zinc-600"}`}>
                    {step}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="max-w-4xl mx-auto min-h-[500px]">
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-12"
              >
                <div className="hud-module p-12 space-y-12">
                  <div className="flex items-center gap-6">
                    <div className="p-4 bg-gold/10 border border-gold/20 rounded-sm">
                      <Clock className="w-8 h-8 text-gold" />
                    </div>
                    <div>
                      <h3 className="text-3xl font-serif text-white uppercase tracking-tight">Temporal Variance</h3>
                      <p className="text-xs text-zinc-500 uppercase font-black tracking-widest mt-1">Specify your birth-time uncertainty window</p>
                    </div>
                  </div>
                  
                  <div className="space-y-12">
                    <div className="p-6 bg-gold/[0.02] border border-gold/10 rounded-sm italic">
                      <p className="text-xs text-zinc-400 leading-relaxed uppercase tracking-widest">
                        High uncertainty requires more computational cycles and a broader set of reference life events for accurate convergence.
                      </p>
                    </div>

                    <div className="space-y-8">
                      <div className="flex justify-between items-end">
                        <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Search Radius</span>
                        <span className="text-4xl font-serif text-gold tracking-tighter uppercase">
                          ±{uncertainty === 360 ? "6 Hours" : `${uncertainty}m`}
                        </span>
                      </div>
                      <input 
                        type="range"
                        min="15"
                        max="360"
                        step="15"
                        value={uncertainty}
                        onChange={e => setUncertainty(parseInt(e.target.value))}
                        className="w-full accent-gold h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="flex justify-between text-[8px] text-zinc-700 font-black tracking-[0.3em] uppercase">
                        <span>±15m (Low)</span>
                        <span>±1hr (Mid)</span>
                        <span>±2hr (High)</span>
                        <span>±6hr (Unknown)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-12"
              >
                <div className="hud-module p-12 space-y-12">
                  <div className="flex items-center gap-6">
                    <div className="p-4 bg-gold/10 border border-gold/20 rounded-sm">
                      <History className="w-8 h-8 text-gold" />
                    </div>
                    <div>
                      <h3 className="text-3xl font-serif text-white uppercase tracking-tight">Pattern Anchors</h3>
                      <p className="text-xs text-zinc-500 uppercase font-black tracking-widest mt-1">Reference events for karmic alignment</p>
                    </div>
                  </div>
                  
                  <div className="space-y-8">
                    {events.length > 0 ? (
                      <div className="space-y-4">
                        <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest mb-6">Algorithm will cross-check these timestamps:</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {events.map((e, i) => (
                            <div key={i} className="flex items-center justify-between p-6 bg-white/[0.02] border border-white/5 rounded-sm group hover:border-gold/20 transition-colors">
                              <div>
                                <div className="text-xs text-white uppercase font-bold tracking-widest mb-1">{e.type}</div>
                                <div className="text-[10px] text-zinc-600 font-mono">{e.date}</div>
                              </div>
                              <Target className="w-4 h-4 text-zinc-800 group-hover:text-gold/40 transition-colors" />
                            </div>
                          ))}
                        </div>
                        <div className="pt-6 border-t border-white/5">
                           <a href="/tools/calibration/events" className="text-[10px] text-gold/60 uppercase font-black tracking-widest hover:text-gold flex items-center gap-2">
                             Update Life Elements <ChevronRight className="w-3 h-3" />
                           </a>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12 space-y-8">
                        <div className="relative inline-block">
                           <AlertCircle className="w-16 h-16 text-gold/10 mx-auto" />
                           <div className="absolute inset-0 blur-2xl bg-gold/5" />
                        </div>
                        <div className="space-y-2">
                           <p className="text-xs text-zinc-500 uppercase font-black tracking-widest">Event Archive Empty</p>
                           <p className="text-[10px] text-zinc-600 leading-relaxed uppercase tracking-widest max-w-xs mx-auto">
                             Rectification requires a minimum of three significant life-pattern anchors to achieve statistical significance.
                           </p>
                        </div>
                        <a href="/tools/calibration/events" className="inline-block bg-gold text-black font-black uppercase tracking-[0.2em] text-[10px] px-8 py-4 rounded-sm hover:scale-105 transition-all">
                          Initialize Event Log
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-12"
              >
                <div className="hud-module p-12 space-y-12">
                  <div className="flex items-center gap-6">
                    <div className="p-4 bg-gold/10 border border-gold/20 rounded-sm">
                      <Zap className="w-8 h-8 text-gold" />
                    </div>
                    <div>
                      <h3 className="text-3xl font-serif text-white uppercase tracking-tight">Execution Engine</h3>
                      <p className="text-xs text-zinc-500 uppercase font-black tracking-widest mt-1">Select the processing methodology</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <button 
                      onClick={() => setMethod("AI")}
                      className={`p-10 border text-left space-y-6 rounded-sm transition-all group ${method === "AI" ? "border-gold bg-gold/[0.05]" : "border-white/5 bg-transparent hover:border-white/20"}`}
                    >
                      <div className="flex justify-between items-start">
                        <Cpu className={`w-10 h-10 ${method === "AI" ? "text-gold" : "text-zinc-700"} group-hover:text-gold transition-colors`} />
                        <div className={`text-[8px] font-black uppercase tracking-[0.3em] px-2 py-1 border ${method === "AI" ? "border-gold/40 text-gold" : "border-zinc-800 text-zinc-600"}`}>High Speed</div>
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-lg font-serif text-white uppercase tracking-tight">Sudarshana-AI</h4>
                        <p className="text-[10px] text-zinc-500 font-bold uppercase leading-relaxed tracking-widest">
                          Utilizes heuristic neural matching to cross-reference Dasha timelines with logged life events.
                        </p>
                      </div>
                    </button>

                    <button 
                      onClick={() => setMethod("Classical")}
                      className={`p-10 border text-left space-y-6 rounded-sm transition-all group ${method === "Classical" ? "border-gold bg-gold/[0.05]" : "border-white/5 bg-transparent hover:border-white/20"}`}
                    >
                      <div className="flex justify-between items-start">
                        <Timer className={`w-10 h-10 ${method === "Classical" ? "text-gold" : "text-zinc-700"} group-hover:text-gold transition-colors`} />
                        <div className={`text-[8px] font-black uppercase tracking-[0.3em] px-2 py-1 border ${method === "Classical" ? "border-gold/40 text-gold" : "border-zinc-800 text-zinc-600"}`}>Deep Scan</div>
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-lg font-serif text-white uppercase tracking-tight">Nadi-Classical</h4>
                        <p className="text-[10px] text-zinc-500 font-bold uppercase leading-relaxed tracking-widest">
                          Tests every candidate against divisional chart cusp changes and classical Bhrigu Nadi principles.
                        </p>
                      </div>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 4 && (
              <motion.div 
                key="step4"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-12"
              >
                {isLoading ? (
                  <div className="hud-module p-24 text-center space-y-12">
                    <div className="relative w-24 h-24 mx-auto">
                      <div className="absolute inset-0 border-[3px] border-gold/10 rounded-full" />
                      <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 border-[3px] border-gold border-t-transparent rounded-full" 
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                         <Target className="w-8 h-8 text-gold/40" />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <p className="text-3xl font-serif text-white uppercase tracking-tight">Synchronizing Frequencies...</p>
                      <div className="flex items-center justify-center gap-4">
                         <div className="h-[1px] w-8 bg-gold/20" />
                         <p className="text-[10px] text-gold/60 uppercase font-black tracking-[0.4em] animate-pulse">Running Monte Carlo Simulations</p>
                         <div className="h-[1px] w-8 bg-gold/20" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-12">
                    <div className="text-center space-y-2">
                       <h3 className="text-4xl font-serif text-white uppercase tracking-tighter">Candidate Convergence</h3>
                       <p className="text-[10px] text-zinc-600 uppercase font-black tracking-widest italic">The following timestamps show the highest statistical correlation</p>
                    </div>

                    <div className="grid grid-cols-1 gap-8">
                      {candidates.map((c, i) => {
                        const confidence = c.confidence || 0;
                        const status: StatusType = confidence > 80 ? "Opportunity" : confidence > 50 ? "Transition" : "Caution";
                        
                        return (
                          <IntelligenceCard 
                            key={i}
                            title={c.time}
                            subtitle={`Drift: ${c.drift_minutes || i * 2}m`}
                            status={status}
                            icon={Target}
                          >
                            <div className="flex flex-col md:flex-row items-center justify-between gap-8 pt-4">
                               <div className="flex-1 space-y-4 w-full">
                                  <div className="flex justify-between items-end">
                                     <span className="text-[9px] font-black uppercase tracking-widest text-zinc-600">Model Confidence</span>
                                     <span className="text-lg font-serif text-white">{confidence}%</span>
                                  </div>
                                  <div className="h-[2px] bg-white/5 w-full rounded-full overflow-hidden">
                                     <motion.div 
                                       initial={{ width: 0 }}
                                       animate={{ width: `${confidence}%` }}
                                       className="h-full bg-gold shadow-[0_0_10px_rgba(201,168,76,0.5)]"
                                     />
                                  </div>
                                  <div className="flex flex-wrap gap-2 pt-2">
                                     {c.changes?.map((ch: string, idx: number) => (
                                       <span key={idx} className="text-[8px] bg-white/5 border border-white/10 px-3 py-1 rounded-sm text-zinc-400 uppercase tracking-widest">
                                         {ch}
                                       </span>
                                     ))}
                                  </div>
                               </div>
                               <div className="h-px md:h-12 w-full md:w-px bg-white/5" />
                               <button className="w-full md:w-auto bg-gold text-black px-10 py-4 rounded-sm text-[10px] font-black uppercase tracking-[0.2em] hover:scale-105 transition-all shadow-[0_0_20px_rgba(201,168,76,0.2)]">
                                 Apply Calibration
                               </button>
                            </div>
                          </IntelligenceCard>
                        );
                      })}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* FOOTER NAVIGATION */}
        <div className="flex justify-between items-center max-w-4xl mx-auto pt-12 border-t border-white/5">
          <button 
            onClick={() => setCurrentStep(prev => prev - 1)}
            disabled={currentStep === 1 || currentStep === 4}
            className={`flex items-center space-x-3 text-[10px] font-black uppercase tracking-[0.3em] transition-all ${
              currentStep === 1 || currentStep === 4 ? "opacity-0 pointer-events-none" : "text-zinc-600 hover:text-gold"
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Regress</span>
          </button>

          {currentStep < 4 && (
            <button 
              onClick={handleNext}
              className="group flex items-center space-x-6"
            >
               <div className="flex flex-col items-end gap-1">
                  <span className="text-[8px] font-black uppercase tracking-widest text-zinc-700 group-hover:text-gold/40 transition-colors">Phase Shift</span>
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white group-hover:text-gold transition-colors">{currentStep === 3 ? "Execute Scans" : "Advance"}</span>
               </div>
               <div className="p-4 bg-white/5 border border-white/10 rounded-sm group-hover:border-gold group-hover:bg-gold group-hover:text-black transition-all">
                  <ChevronRight className="w-5 h-5" />
               </div>
            </button>
          )}
        </div>
      </div>
    </AuthGate>
  );
}
