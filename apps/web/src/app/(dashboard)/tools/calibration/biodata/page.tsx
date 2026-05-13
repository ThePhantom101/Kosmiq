"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, 
  Dna, 
  Activity, 
  MapPin, 
  Clock, 
  Save, 
  ChevronRight, 
  Sparkles,
  Zap,
  Shield,
  Target,
  CheckCircle2,
  X
} from "lucide-react";
import { useAstro } from "@/context/AstroContext";

const ARCHETYPES = [
  { id: "Vata", label: "Ethereal / Vata", desc: "Light, active, imaginative, cold." },
  { id: "Pitta", label: "Solar / Pitta", desc: "Sharp, intense, focused, hot." },
  { id: "Kapha", label: "Lunar / Kapha", desc: "Steady, calm, nurturing, cool." }
];

export default function BiodataCalibrationPage() {
  const { data: astroData } = useAstro();
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isExactTime, setIsExactTime] = useState(true);
  const [biodata, setBiodata] = useState({
    height: "",
    weight: "",
    bloodGroup: "",
    archetype: "Pitta",
    temperament: "Intense",
    lifestyle: "Urban/Active"
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate API call and context update
    setTimeout(() => {
      setIsSaving(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 pb-32 space-y-20">
      {/* CINEMATIC HEADER */}
      <section className="flex flex-col md:flex-row items-center justify-between gap-8 pb-12 border-b border-white/5">
        <div className="space-y-4 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-4">
            <span className="overline-label text-gold/60 tracking-[0.4em]">Physical Blueprint</span>
            <div className="h-[1px] w-12 bg-gold/20" />
          </div>
          <h1 className="text-6xl md:text-8xl font-serif text-white tracking-tighter uppercase leading-[0.8]">
            Profile <br /> <span className="text-gold">Settings</span>
          </h1>
          <div className="flex items-center justify-center md:justify-start gap-3 pt-4">
            <div className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest">Somatic: Body Integrity</div>
            <div className="w-1 h-1 bg-zinc-800 rounded-full" />
            <div className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest">Biological Resonance</div>
          </div>
        </div>

        <div className="hidden lg:block">
           <div className="hud-module p-6 border-gold/10 bg-gold/[0.02] space-y-4 max-w-xs text-right">
              <div className="flex items-center justify-end gap-3">
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Integrity Check</span>
                <Shield className="w-4 h-4 text-gold/60" />
              </div>
              <p className="text-[10px] text-zinc-400 leading-relaxed uppercase tracking-widest italic">
                Synchronizing celestial transits with your physical biological signatures for enhanced predictive precision.
              </p>
           </div>
        </div>
      </section>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
        <div className="lg:col-span-2 space-y-12">
          {/* HUD MODULE: IDENTITY & CONTEXT */}
          <div className="hud-module p-8 md:p-12 space-y-12">
            <div className="flex items-center gap-6">
               <div className="p-4 bg-gold/10 border border-gold/20 rounded-sm">
                 <User className="w-8 h-8 text-gold" />
               </div>
               <div>
                 <h3 className="text-3xl font-serif text-white uppercase tracking-tight">Identity Context</h3>
                 <p className="text-xs text-zinc-500 uppercase font-black tracking-widest mt-1">Environmental and Birth Integrity</p>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-4">
                 <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Birth Time Certainty</label>
                 <div className="flex items-center justify-between p-4 bg-black border border-white/5 rounded-sm">
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Exact Time Recorded</span>
                    <button 
                      type="button"
                      onClick={() => setIsExactTime(!isExactTime)}
                      className={`relative w-12 h-6 rounded-full transition-colors duration-500 ${isExactTime ? 'bg-gold' : 'bg-zinc-800'}`}
                    >
                      <motion.div 
                        animate={{ x: isExactTime ? 24 : 4 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        className={`absolute top-1 w-4 h-4 rounded-full ${isExactTime ? 'bg-black' : 'bg-zinc-400'}`}
                      />
                    </button>
                 </div>
               </div>

               <div className="space-y-4">
                 <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Lifestyle Environment</label>
                 <select 
                   className="w-full bg-black border border-white/5 rounded-sm px-6 py-4 text-white focus:outline-none focus:border-gold/40 transition-all appearance-none cursor-pointer text-sm"
                   value={biodata.lifestyle}
                   onChange={e => setBiodata({...biodata, lifestyle: e.target.value})}
                 >
                   <option value="Urban/Active">Urban / Active</option>
                   <option value="Sedentary">Sedentary</option>
                   <option value="Outdoor/Nature">Outdoor / Nature</option>
                   <option value="Extreme/High Stress">Extreme / High Stress</option>
                 </select>
               </div>
            </div>
          </div>

          {/* HUD MODULE: SOMATIC METRICS */}
          <div className="hud-module p-8 md:p-12 space-y-12">
            <div className="flex items-center gap-6">
               <div className="p-4 bg-gold/10 border border-gold/20 rounded-sm">
                 <Activity className="w-8 h-8 text-gold" />
               </div>
               <div>
                 <h3 className="text-3xl font-serif text-white uppercase tracking-tight">Somatic Metrics</h3>
                 <p className="text-xs text-zinc-500 uppercase font-black tracking-widest mt-1">Physical Biological Signatures</p>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               <div className="space-y-2">
                 <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Stature (cm)</label>
                 <input 
                   type="number"
                   placeholder="175"
                   className="w-full bg-black border border-white/5 rounded-sm px-6 py-4 text-white focus:outline-none focus:border-gold/40 transition-all placeholder:text-zinc-800 text-sm"
                   value={biodata.height}
                   onChange={e => setBiodata({...biodata, height: e.target.value})}
                 />
               </div>
               <div className="space-y-2">
                 <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Mass (kg)</label>
                 <input 
                   type="number"
                   placeholder="70"
                   className="w-full bg-black border border-white/5 rounded-sm px-6 py-4 text-white focus:outline-none focus:border-gold/40 transition-all placeholder:text-zinc-800 text-sm"
                   value={biodata.weight}
                   onChange={e => setBiodata({...biodata, weight: e.target.value})}
                 />
               </div>
               <div className="space-y-2">
                 <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Blood Group</label>
                 <select 
                   className="w-full bg-black border border-white/5 rounded-sm px-6 py-4 text-white focus:outline-none focus:border-gold/40 transition-all appearance-none cursor-pointer text-sm"
                   value={biodata.bloodGroup}
                   onChange={e => setBiodata({...biodata, bloodGroup: e.target.value})}
                 >
                   <option value="">Select</option>
                   {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(g => (
                     <option key={g} value={g}>{g}</option>
                   ))}
                 </select>
               </div>
            </div>
          </div>

          {/* HUD MODULE: ARCHETYPES */}
          <div className="hud-module p-8 md:p-12 space-y-12">
            <div className="flex items-center gap-6">
               <div className="p-4 bg-gold/10 border border-gold/20 rounded-sm">
                 <Zap className="w-8 h-8 text-gold" />
               </div>
               <div>
                 <h3 className="text-3xl font-serif text-white uppercase tracking-tight">Archetypal Resonance</h3>
                 <p className="text-xs text-zinc-500 uppercase font-black tracking-widest mt-1">Somatic Archetype Distribution</p>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               {ARCHETYPES.map(a => (
                 <button
                   key={a.id}
                   type="button"
                   onClick={() => setBiodata({...biodata, archetype: a.id})}
                   className={`p-6 border rounded-sm text-left transition-all space-y-3 group ${
                     biodata.archetype === a.id 
                       ? "border-gold bg-gold/[0.05] shadow-[0_0_20px_rgba(201,168,76,0.1)]" 
                       : "border-white/5 bg-transparent hover:border-white/20"
                   }`}
                 >
                   <span className={`text-[10px] font-black uppercase tracking-widest ${biodata.archetype === a.id ? 'text-gold' : 'text-zinc-500 group-hover:text-white'}`}>
                     {a.label}
                   </span>
                   <p className="text-[9px] text-zinc-600 uppercase font-bold tracking-widest leading-relaxed">
                     {a.desc}
                   </p>
                 </button>
               ))}
            </div>
          </div>
        </div>

        {/* SUMMARY & SAVE */}
        <div className="space-y-8">
           <div className="hud-module p-8 space-y-8 sticky top-24">
              <div className="space-y-2">
                 <h4 className="text-[10px] font-black uppercase tracking-widest text-gold/60">System Summary</h4>
                 <div className="h-px w-full bg-white/5" />
              </div>

              <div className="space-y-6">
                 {[
                   { label: "BMI Sync", value: "Optimal", status: "success" },
                   { label: "Dosha Profile", value: biodata.archetype, status: "pending" },
                   { label: "Temporal Lock", value: isExactTime ? "Locked" : "Variable", status: "success" },
                   { label: "Predictive Bias", value: "0.04%", status: "success" }
                 ].map(item => (
                   <div key={item.label} className="flex justify-between items-center">
                     <span className="text-[9px] font-black uppercase tracking-widest text-zinc-600">{item.label}</span>
                     <span className="text-[9px] font-black uppercase tracking-widest text-white">{item.value}</span>
                   </div>
                 ))}
              </div>

              <button 
                type="submit"
                disabled={isSaving}
                className="w-full bg-gold text-black font-black uppercase tracking-[0.2em] text-[10px] py-5 rounded-sm hover:scale-[1.02] transition-all shadow-[0_0_30px_rgba(201,168,76,0.3)] flex items-center justify-center gap-3 mt-4"
              >
                {isSaving ? (
                  <div className="w-4 h-4 border-2 border-black/20 border-t-black animate-spin rounded-full" />
                ) : (
                  <>
                    <Save className="w-4 h-4" /> Finalize Settings
                  </>
                )}
              </button>
           </div>

           <div className="p-8 bg-gold/[0.02] border border-gold/10 rounded-sm space-y-4">
              <div className="flex items-center gap-2">
                 <Target className="w-4 h-4 text-gold/40" />
                 <span className="text-[9px] font-black uppercase tracking-widest text-gold/60">Logic Engine Note</span>
              </div>
              <p className="text-[10px] text-zinc-500 leading-relaxed uppercase font-bold tracking-widest italic">
                Biodata adjustments act as "local modifiers" to global planetary interpretations. Somatic patterns buffer celestial transits.
              </p>
           </div>
        </div>
      </form>

      {/* SUCCESS OVERLAY */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="hud-module p-16 text-center space-y-8 bg-zinc-950 border-gold/40 shadow-[0_0_100px_rgba(201,168,76,0.2)]"
            >
               <div className="relative inline-block">
                  <CheckCircle2 className="w-24 h-24 text-gold mx-auto" />
                  <motion.div 
                    animate={{ scale: [1, 1.5], opacity: [1, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="absolute inset-0 border-2 border-gold rounded-full"
                  />
               </div>
               <div className="space-y-4">
                  <h2 className="text-5xl font-serif text-white uppercase tracking-tighter">Calibration Success</h2>
                  <p className="text-[10px] text-zinc-500 uppercase font-black tracking-[0.4em]">Somatic data synchronized with core engine</p>
               </div>
               <button 
                 onClick={() => setShowSuccess(false)}
                 className="text-[10px] text-gold/60 uppercase font-black tracking-widest hover:text-gold flex items-center gap-2 mx-auto"
               >
                 Dismiss <X className="w-3 h-3" />
               </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .overline-label {
          @apply text-[10px] font-black uppercase tracking-[0.3em] block;
        }
      `}</style>
    </div>
  );
}
