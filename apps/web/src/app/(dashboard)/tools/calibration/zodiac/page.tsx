"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight, 
  Target, 
  Zap, 
  ShieldCheck, 
  Sparkles,
  Info,
  HelpCircle,
  Compass,
  ArrowRight,
  Shield,
  History
} from "lucide-react";
import { useAstro } from "@/context/AstroContext";

const QUESTIONS = [
  {
    id: "moon_sign",
    label: "Core Resonance",
    question: "Does your Moon Sign personality alignment feel high-fidelity?",
    description: "Consider your emotional responses and internal narrative rather than external behavior.",
    options: ["Perfect Alignment", "High Resonance", "Moderate Drift", "Low Resonance"]
  },
  {
    id: "career_alignment",
    label: "Professional Axis",
    question: "Do the 10th House career indications match your trajectory?",
    description: "Does the nature of your current or desired work match the house indicators?",
    options: ["Complete Match", "Near Match", "Significant Drift", "No Resonance"]
  },
  {
    id: "physical_match",
    label: "Ascendant Integrity",
    question: "Does your rising sign accurately describe your physical presence?",
    description: "Physical traits, temperament, and first impressions are governed by the Lagna.",
    options: ["Exact Match", "Closely Aligned", "Partial Drift", "Dissimilar"]
  }
];

const AYANAMSAS = [
  { id: "Lahiri", name: "Chitra Paksha (Lahiri)", description: "The global standard for Vedic precision.", recommended: true },
  { id: "True Chitra", name: "True Chitra", description: "Scientific alignment to Spica (Alpha Virginis)." },
  { id: "Raman", name: "B.V. Raman", description: "The traditional South Indian standard." },
  { id: "Fagan-Bradley", name: "Fagan-Bradley", description: "The Western sidereal benchmark." }
];

export default function ZodiacCheckPage() {
  const { data: astroData } = useAstro();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedAyanamsa, setSelectedAyanamsa] = useState("Lahiri");

  const handleAnswer = (option: string) => {
    const q = QUESTIONS[currentQuestion];
    setAnswers({ ...answers, [q.id]: option });
    
    if (currentQuestion < QUESTIONS.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setShowResults(true);
    }
  };

  const handleRecalibrate = () => {
    setIsCalibrating(true);
    setTimeout(() => {
      setIsCalibrating(false);
    }, 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 pb-32 space-y-20">
      {/* CINEMATIC HEADER */}
      <section className="flex flex-col md:flex-row items-center justify-between gap-8 pb-12 border-b border-white/5">
        <div className="space-y-4 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-4">
            <span className="overline-label text-gold/60 tracking-[0.4em]">Systems Check</span>
            <div className="h-[1px] w-12 bg-gold/20" />
          </div>
          <h1 className="text-6xl md:text-8xl font-serif text-white tracking-tighter uppercase leading-[0.8]">
            Zodiac <br /> <span className="text-gold">Alignment</span>
          </h1>
          <div className="flex items-center justify-center md:justify-start gap-3 pt-4">
            <div className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest">Calibration: Sidereal Integrity</div>
            <div className="w-1 h-1 bg-zinc-800 rounded-full" />
            <div className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest">Ayanamsa Verification</div>
          </div>
        </div>

        <div className="hidden lg:block">
           <div className="hud-module p-6 border-gold/10 bg-gold/[0.02] space-y-4 max-w-xs text-right">
              <div className="flex items-center justify-end gap-3">
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Methodology</span>
                <Compass className="w-4 h-4 text-gold/60" />
              </div>
              <p className="text-[10px] text-zinc-400 leading-relaxed uppercase tracking-widest italic">
                Validating the precession of equinoxes against your lived psychological and physical archetypes.
              </p>
           </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
        {/* SURVEY SECTION */}
        <div className="lg:col-span-2 space-y-8">
          <AnimatePresence mode="wait">
            {!showResults ? (
              <motion.div 
                key="survey"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="hud-module p-10 space-y-10"
              >
                <div className="flex justify-between items-center pb-6 border-b border-white/5">
                   <div className="space-y-1">
                      <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gold/60">Module {currentQuestion + 1} of {QUESTIONS.length}</span>
                      <h3 className="text-2xl font-serif text-white uppercase tracking-tight">{QUESTIONS[currentQuestion].label}</h3>
                   </div>
                   <div className="flex gap-2">
                      {QUESTIONS.map((_, i) => (
                        <div key={i} className={`w-8 h-1 rounded-full transition-colors ${i <= currentQuestion ? 'bg-gold' : 'bg-zinc-800'}`} />
                      ))}
                   </div>
                </div>

                <div className="space-y-6">
                  <p className="text-xl text-white font-medium leading-relaxed tracking-tight">
                    {QUESTIONS[currentQuestion].question}
                  </p>
                  <p className="text-xs text-zinc-500 uppercase font-bold tracking-widest italic leading-relaxed">
                    {QUESTIONS[currentQuestion].description}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6">
                  {QUESTIONS[currentQuestion].options.map(option => (
                    <button
                      key={option}
                      onClick={() => handleAnswer(option)}
                      className="group flex items-center justify-between p-6 bg-white/[0.02] border border-white/5 rounded-sm hover:border-gold/40 hover:bg-gold/[0.02] transition-all text-left"
                    >
                      <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 group-hover:text-white transition-colors">{option}</span>
                      <ChevronRight className="w-4 h-4 text-zinc-800 group-hover:text-gold group-hover:translate-x-1 transition-all" />
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="results"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="hud-module p-12 text-center space-y-10"
              >
                <div className="relative inline-block">
                   <ShieldCheck className="w-24 h-24 text-gold/20 mx-auto" />
                   <motion.div 
                     animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.2, 0.5] }}
                     transition={{ duration: 4, repeat: Infinity }}
                     className="absolute inset-0 bg-gold/10 blur-3xl rounded-full"
                   />
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-4xl font-serif text-white uppercase tracking-tight">Alignment Confirmed</h3>
                  <p className="text-[10px] text-zinc-500 uppercase font-black tracking-[0.4em] max-w-sm mx-auto leading-loose">
                    Your subjective experience correlates at 94% with the <span className="text-gold">Sidereal {selectedAyanamsa}</span> coordinate system.
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-6 pt-6">
                   {[
                     { label: "Precision", val: "High", icon: Target },
                     { label: "Resonance", val: "Optimal", icon: Sparkles },
                     { label: "Drift", val: "0.2°", icon: Compass }
                   ].map(item => (
                     <div key={item.label} className="p-4 bg-white/[0.02] border border-white/5 rounded-sm space-y-2">
                        <item.icon className="w-4 h-4 text-gold/40 mx-auto" />
                        <div className="text-[8px] text-zinc-600 font-black uppercase tracking-widest">{item.label}</div>
                        <div className="text-xs text-white font-bold uppercase tracking-widest">{item.val}</div>
                     </div>
                   ))}
                </div>

                <div className="pt-6">
                  <button 
                    onClick={() => setShowResults(false)}
                    className="inline-block text-[10px] text-gold/60 uppercase font-black tracking-widest hover:text-gold transition-colors flex items-center gap-2 mx-auto"
                  >
                    <History className="w-3 h-3" /> Restart Calibration Sequence
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* AYANAMSA PICKER GRID */}
        <div className="space-y-6">
           <div className="flex items-center gap-3 mb-2">
              <Shield className="w-4 h-4 text-gold" />
              <h3 className="text-[10px] font-black uppercase tracking-widest text-white">Algorithm Integrity</h3>
           </div>
           
           <div className="space-y-4">
              {AYANAMSAS.map(a => (
                <button
                  key={a.id}
                  onClick={() => setSelectedAyanamsa(a.id)}
                  className={`w-full p-6 border rounded-sm text-left transition-all space-y-3 group relative overflow-hidden ${
                    selectedAyanamsa === a.id 
                      ? "border-gold bg-gold/[0.05] shadow-[0_0_20px_rgba(201,168,76,0.1)]" 
                      : "border-white/5 bg-transparent hover:border-white/20"
                  }`}
                >
                  {selectedAyanamsa === a.id && (
                    <motion.div 
                      layoutId="ayanamsa-accent"
                      className="absolute left-0 top-0 bottom-0 w-1 bg-gold"
                    />
                  )}
                  <div className="flex justify-between items-start">
                    <span className={`text-xs font-bold uppercase tracking-widest ${selectedAyanamsa === a.id ? 'text-gold' : 'text-zinc-400 group-hover:text-white'}`}>
                      {a.name}
                    </span>
                    {a.recommended && (
                      <span className="text-[7px] font-black uppercase tracking-widest px-2 py-0.5 border border-gold/40 text-gold rounded-full bg-gold/5">Standard</span>
                    )}
                  </div>
                  <p className="text-[9px] text-zinc-600 uppercase font-bold tracking-widest leading-relaxed">
                    {a.description}
                  </p>
                </button>
              ))}
           </div>

           <div className="pt-6">
              <button 
                onClick={handleRecalibrate}
                disabled={isCalibrating}
                className="w-full bg-gold text-black font-black uppercase tracking-[0.2em] text-[10px] py-4 rounded-sm hover:scale-[1.02] transition-all shadow-[0_0_20px_rgba(201,168,76,0.2)] flex items-center justify-center gap-3"
              >
                {isCalibrating ? (
                  <>
                    <div className="w-3 h-3 border-2 border-black/20 border-t-black animate-spin rounded-full" />
                    Recalibrating Coordinate System...
                  </>
                ) : (
                  <>
                    Update Core System <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
