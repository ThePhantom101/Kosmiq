"use client";
 
 import React from "react";
 import { motion } from "framer-motion";
 import BirthForm from "@/components/BirthForm";
 import { useAstro } from "@/context/AstroContext";
 import { Sparkles, ArrowRight } from "lucide-react";
 import Link from "next/link";
 
 export default function NewChartPage() {
   const { data, setData, isLoading, setIsLoading } = useAstro();
 
   return (
     <div className="space-y-12">
       {/* Header */}
       <div className="space-y-4">
         <div className="flex items-center gap-2">
           <span className="overline-label">New Chart</span>
           <div className="h-px w-8 bg-gold/30" />
         </div>
         <h1 className="text-5xl font-serif text-white tracking-tight uppercase">
           Your <span className="text-gold">Kundli</span>
         </h1>
         <p className="text-gray-400 font-sans max-w-2xl leading-relaxed">
           Enter your birth details to generate your precise Vedic chart.
         </p>
       </div>
 
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
         {/* Form */}
         <div className="space-y-6">
           <BirthForm
             onResult={(res) => setData(res)}
             isLoading={isLoading}
             setIsLoading={setIsLoading}
           />
         </div>
 
         {/* Status Panel */}
         <div className="space-y-8">
           {data ? (
             <motion.div
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               className="bg-gold/5 border border-gold/20 p-8 rounded-sm space-y-6"
             >
               <div className="flex justify-center">
                 <div className="p-4 rounded-full bg-gold/10 border border-gold/20">
                   <Sparkles className="w-8 h-8 text-gold" />
                 </div>
               </div>
               <div className="text-center space-y-2">
                 <h3 className="text-gold font-serif text-2xl tracking-tight uppercase">
                   Kundli Ready
                 </h3>
                 <p className="text-gray-400 text-sm leading-relaxed max-w-sm mx-auto">
                   Your birth data has been successfully mapped to the current ephemeris. Your Kundli is now active.
                 </p>
               </div>
               <Link
                 href="/chart/me/divisional"
                 className="w-full bg-gold text-black font-bold py-4 rounded-sm hover:bg-gold/90 transition-all flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(197,160,89,0.3)] uppercase tracking-widest text-xs"
               >
                 <span>View Your Kundli</span>
                 <ArrowRight className="w-4 h-4" />
               </Link>
             </motion.div>
           ) : (
             <div className="hud-module p-8 border border-gold/10 bg-gold/5 space-y-6">
               <h4 className="text-gold uppercase tracking-[0.2em] font-bold text-sm">How It Works</h4>
               <ul className="space-y-4 font-mono text-[10px] uppercase tracking-wider text-gray-500">
                 {[
                   "Enter your precise date and time of birth",
                   "Search your birth city — coordinates auto-fill",
                   "Your timezone is set automatically",
                   "Generate your complete Shodashvarga Kundli",
                 ].map((step, i) => (
                   <li key={i} className="flex items-start gap-3">
                     <span className="text-gold shrink-0">0{i + 1}</span>
                     <span>{step}</span>
                   </li>
                 ))}
               </ul>
             </div>
           )}
         </div>
       </div>
     </div>
   );
 }
