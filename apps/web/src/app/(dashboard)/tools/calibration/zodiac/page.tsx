"use client";

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Check, AlertTriangle, Compass, Search, ChevronRight, Info } from "lucide-react";
import { useAstro } from "@/context/AstroContext";
import { useDasha } from "@/hooks/useDasha";
import { useYogas } from "@/hooks/useYogas";

const SIGNS = [
  "Aries", "Taurus", "Gemini", "Cancer", 
  "Leo", "Virgo", "Libra", "Scorpio", 
  "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

function getSign(lon: number) {
  return SIGNS[Math.floor(lon / 30) % 12];
}

export default function ZodiacCheckPage() {
  const { data: astroData } = useAstro();
  const { data: dashaData } = useDasha();
  const { data: yogasData } = useYogas();
  
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const lagna = astroData?.chart ? getSign(astroData.chart.ascendant) : "Your Lagna";
  const dashaLord = dashaData?.current_mahadasha?.lord || "Your Dasha Lord";
  const yogaName = yogasData?.yogas.find(y => y.present)?.name || "Your Dominant Yoga";

  const dynamicQuestions = useMemo(() => [
    {
      id: 1,
      text: `Does the ${lagna} personality description match you well?`,
      description: "Your Rising sign (Lagna) represents your physical self and outlook."
    },
    {
      id: 2,
      text: `Has your ${dashaLord} period brought relevant life themes?`,
      description: "Vimshottari Dasha timing depends heavily on the precise Moon nakshatra."
    },
    {
      id: 3,
      text: "Do significant events align with your Dasha timeline?",
      description: "Check if marriage, job changes, or travel occurred during relevant periods."
    },
    {
      id: 4,
      text: "Do you identify more with your Moon sign or Sun sign?",
      description: "In Vedic astrology, the Moon is usually the more dominant personality driver."
    },
    {
      id: 5,
      text: `Has the ${yogaName} energy manifested in your life?`,
      description: "Specific planetary combinations should produce observable life results."
    }
  ], [lagna, dashaLord, yogaName]);
  
  // Comparison data
  const comparison = useMemo(() => {
    if (!astroData?.chart) return {
      lahiri: { lagna: "N/A", moon: "N/A" },
      kp: { lagna: "N/A", moon: "N/A" },
      raman: { lagna: "N/A", moon: "N/A" }
    };

    const moonLon = astroData.chart.planets.Moon?.longitude || 0;
    const ascLon = astroData.chart.ascendant;

    return {
      lahiri: { 
        lagna: getSign(ascLon), 
        moon: getSign(moonLon) 
      },
      kp: { 
        lagna: getSign(ascLon - 0.1), // Approx shift
        moon: getSign(moonLon - 0.1) 
      },
      raman: { 
        lagna: getSign(ascLon + 1.4), // Approx shift
        moon: getSign(moonLon + 1.4) 
      }
    };
  }, [astroData]);

  const handleAnswer = (questionId: number, value: string) => {
    setAnswers({ ...answers, [questionId]: value });
  };

  const score = Object.values(answers).filter(a => a === "Yes").length;
  const somewhatScore = Object.values(answers).filter(a => a === "Somewhat").length;
  
  const totalYes = score + (somewhatScore * 0.5);

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col space-y-2">
        <span className="overline-label text-gold/60">System Validation</span>
        <h1 className="text-4xl font-serif text-white tracking-tight">Zodiac Accuracy Check</h1>
        <p className="text-gray-400 max-w-2xl">
          Kosmiq uses Lahiri Ayanamsa by default. This tool helps you verify if this is the most accurate system for your unique karmic path.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Comparison Section */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1 space-y-6"
        >
          <div className="hud-module p-6 space-y-6">
            <div className="flex items-center space-x-3 text-gold">
              <Compass className="w-5 h-5" />
              <h3 className="font-serif text-lg">Ayanamsa Comparison</h3>
            </div>
            
            <div className="space-y-4">
              <AyanamsaCard 
                name="Lahiri (Chitra Paksha)" 
                data={comparison.lahiri} 
                isDefault 
                active={true}
              />
              <AyanamsaCard 
                name="KP (Krishnamurti)" 
                data={comparison.kp} 
              />
              <AyanamsaCard 
                name="Raman" 
                data={comparison.raman} 
              />
            </div>
            
            <div className="p-4 bg-gold/5 border border-gold/10 rounded-sm">
              <p className="text-[10px] text-gray-500 leading-relaxed uppercase tracking-wider">
                Ayanamsa is the longitudinal difference between the tropical and sidereal zodiacs. Different systems can shift your planets by ~1 degree.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Survey Section */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2"
        >
          {step === 1 ? (
            <div className="hud-module p-8 space-y-8">
              <div className="space-y-2">
                <h3 className="text-2xl font-serif text-white">Validation Survey</h3>
                <p className="text-sm text-gray-400">Answer these 5 questions based on your life experiences to test chart alignment.</p>
              </div>

              <div className="space-y-10">
                {dynamicQuestions.map((q) => (
                  <div key={q.id} className="space-y-4">
                    <div className="space-y-1">
                      <h4 className="text-white font-medium flex items-center gap-3">
                        <span className="text-gold font-mono text-xs">0{q.id}.</span>
                        {q.text}
                      </h4>
                      <p className="text-xs text-gray-500 ml-7">{q.description}</p>
                    </div>
                    
                    <div className="flex flex-wrap gap-4 ml-7">
                      {["Yes", "Somewhat", "No"].map((val) => (
                        <button
                          key={val}
                          onClick={() => handleAnswer(q.id, val)}
                          className={`px-6 py-2 rounded-full border text-xs font-bold transition-all ${
                            answers[q.id] === val 
                              ? "bg-gold text-black border-gold" 
                              : "border-gold/20 text-gold/60 hover:border-gold/50"
                          }`}
                        >
                          {val.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => setStep(2)}
                disabled={Object.keys(answers).length < 5}
                className={`w-full py-4 rounded-sm font-bold uppercase tracking-widest text-xs transition-all flex items-center justify-center space-x-2 ${
                  Object.keys(answers).length < 5 
                    ? "bg-gray-800 text-gray-500 cursor-not-allowed" 
                    : "bg-gold text-black hover:bg-gold/90"
                }`}
              >
                <span>Calculate Result</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="hud-module p-8 space-y-8 text-center py-16">
              <ResultDisplay totalYes={totalYes} />
              
              <div className="space-y-4 pt-8">
                <button 
                  onClick={() => setStep(1)}
                  className="text-gold/60 text-xs uppercase tracking-widest hover:text-gold transition-colors"
                >
                  Retake Survey
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

function AyanamsaCard({ name, data, isDefault, active }: any) {
  return (
    <div className={`p-4 border rounded-sm transition-all ${active ? 'border-gold/40 bg-gold/5' : 'border-gold/10 bg-black/40'}`}>
      <div className="flex justify-between items-center mb-3">
        <span className="text-[10px] uppercase tracking-widest font-bold text-white/80">{name}</span>
        {isDefault && <span className="text-[8px] bg-gold/20 text-gold px-2 py-0.5 rounded-full border border-gold/30">DEFAULT</span>}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <span className="text-[9px] text-gray-500 uppercase tracking-tighter">Lagna</span>
          <p className="text-sm font-mono text-white">{data.lagna}</p>
        </div>
        <div className="space-y-1">
          <span className="text-[9px] text-gray-500 uppercase tracking-tighter">Moon</span>
          <p className="text-sm font-mono text-white">{data.moon}</p>
        </div>
      </div>
    </div>
  );
}

function ResultDisplay({ totalYes }: { totalYes: number }) {
  if (totalYes >= 4) {
    return (
      <div className="space-y-4 animate-emerge">
        <div className="w-20 h-20 bg-gold/20 rounded-full flex items-center justify-center mx-auto border border-gold/40">
          <Check className="w-10 h-10 text-gold" />
        </div>
        <h3 className="text-3xl font-serif text-gold">Lahiri Ayanamsa Confirmed ✓</h3>
        <p className="text-gray-400 max-w-md mx-auto">
          Your life events and personality align perfectly with the Lahiri system. No further calibration is needed for your primary chart.
        </p>
      </div>
    );
  }
  
  if (totalYes >= 2) {
    return (
      <div className="space-y-4 animate-emerge">
        <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto border border-blue-500/30">
          <Info className="w-10 h-10 text-blue-400" />
        </div>
        <h3 className="text-3xl font-serif text-white">Good Alignment</h3>
        <p className="text-gray-400 max-w-md mx-auto">
          The chart shows good alignment with your life, but some minor refinements or testing other systems (like KP) might offer deeper precision.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-emerge">
      <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto border border-red-500/30">
        <AlertTriangle className="w-10 h-10 text-red-400" />
      </div>
      <h3 className="text-3xl font-serif text-white">Rectification Suggested</h3>
      <p className="text-gray-400 max-w-md mx-auto mb-8">
        Your chart alignment is low. This usually indicates that your recorded birth time is off by several minutes or your birth data is incorrect.
      </p>
      <a href="/tools/rectification" className="inline-block bg-gold text-black font-bold uppercase tracking-widest text-xs px-8 py-4 rounded-sm hover:bg-gold/90 transition-all">
        Start Rectification
      </a>
    </div>
  );
}
