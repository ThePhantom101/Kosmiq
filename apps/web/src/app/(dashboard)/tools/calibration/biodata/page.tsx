"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Heart, Briefcase, MapPin, Calendar, Clock, CheckCircle, ChevronRight, Info } from "lucide-react";
import { useAstro } from "@/context/AstroContext";

export default function PersonalDetailsPage() {
  const { data: astroData } = useAstro();
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    full_name: "Raj Kumar", // Pre-filled mock
    gender: "Male",
    dob: "1995-03-14",
    tob: "14:30:00",
    location: "New Delhi, India",
    current_city: "Mumbai, India",
    marital_status: "Single",
    occupation: "Technology",
    knows_exact_time: true
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // if (!astroData?.profile?.id) throw new Error("No profile found");

      const res = await fetch("/api/user/biodata", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          profile_id: astroData?.profile?.id || "me"
        }),
      });
      
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      console.error("Save failed", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col space-y-2">
        <span className="overline-label text-gold/60">Calibration Tool</span>
        <h1 className="text-4xl font-serif text-white tracking-tight">Personal Details</h1>
        <p className="text-gray-400 max-w-2xl">
          Enrich your profile with precise contextual data. This helps our AI engine refine your predictions and resonance scores.
        </p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="hud-module p-8 max-w-3xl"
      >
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Full Name */}
            <div className="space-y-1">
              <label className="input-label">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gold/40" />
                <input 
                  type="text"
                  className="kosmiq-input pl-10"
                  value={formData.full_name}
                  onChange={e => setFormData({...formData, full_name: e.target.value})}
                  required
                />
              </div>
            </div>

            {/* Gender */}
            <div className="space-y-1">
              <label className="input-label">Gender</label>
              <select 
                className="kosmiq-input appearance-none"
                value={formData.gender}
                onChange={e => setFormData({...formData, gender: e.target.value})}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Non-binary">Non-binary</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>

            {/* DOB */}
            <div className="space-y-1">
              <label className="input-label">Birth Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gold/40" />
                <input 
                  type="date"
                  className="kosmiq-input pl-10"
                  value={formData.dob}
                  onChange={e => setFormData({...formData, dob: e.target.value})}
                />
              </div>
            </div>

            {/* TOB */}
            <div className="space-y-1">
              <label className="input-label">Birth Time</label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gold/40" />
                <input 
                  type="time"
                  className="kosmiq-input pl-10"
                  value={formData.tob}
                  onChange={e => setFormData({...formData, tob: e.target.value})}
                />
              </div>
            </div>

            {/* Location */}
            <div className="space-y-1">
              <label className="input-label">Birth Location</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gold/40" />
                <input 
                  type="text"
                  className="kosmiq-input pl-10"
                  value={formData.location}
                  onChange={e => setFormData({...formData, location: e.target.value})}
                />
              </div>
            </div>

            {/* Current City */}
            <div className="space-y-1">
              <label className="input-label">Current City of Residence</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gold/40" />
                <input 
                  type="text"
                  className="kosmiq-input pl-10"
                  value={formData.current_city}
                  onChange={e => setFormData({...formData, current_city: e.target.value})}
                />
              </div>
            </div>

            {/* Marital Status */}
            <div className="space-y-1">
              <label className="input-label">Marital Status</label>
              <div className="relative">
                <Heart className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gold/40" />
                <select 
                  className="kosmiq-input pl-10 appearance-none"
                  value={formData.marital_status}
                  onChange={e => setFormData({...formData, marital_status: e.target.value})}
                >
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Divorced">Divorced</option>
                  <option value="Widowed">Widowed</option>
                </select>
              </div>
            </div>

            {/* Occupation */}
            <div className="space-y-1">
              <label className="input-label">Occupation Category</label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gold/40" />
                <select 
                  className="kosmiq-input pl-10 appearance-none"
                  value={formData.occupation}
                  onChange={e => setFormData({...formData, occupation: e.target.value})}
                >
                  <option value="Business">Business</option>
                  <option value="Service">Service</option>
                  <option value="Creative">Creative</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Education">Education</option>
                  <option value="Technology">Technology</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Exact Birth Time Toggle */}
          <div className="pt-4 border-t border-gold/10">
            <div className="flex items-center justify-between p-4 bg-gold/5 border border-gold/10 rounded-sm">
              <div className="space-y-1">
                <h4 className="text-sm font-semibold text-white">I know my exact birth time</h4>
                <p className="text-xs text-gray-500">Uncertain birth times reduce chart precision.</p>
              </div>
              <button 
                type="button"
                onClick={() => setFormData({...formData, knows_exact_time: !formData.knows_exact_time})}
                className={`w-12 h-6 rounded-full transition-colors relative ${formData.knows_exact_time ? 'bg-gold' : 'bg-gray-800'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.knows_exact_time ? 'left-7' : 'left-1'}`} />
              </button>
            </div>
            
            {!formData.knows_exact_time && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-4 p-4 border border-gold/30 bg-gold/5 rounded-sm flex gap-3 items-start"
              >
                <Info className="w-4 h-4 text-gold mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="text-gold/80">Consider <span className="font-bold">Chart Rectification</span> to find your precise birth time based on past life events.</p>
                  <a href="/tools/rectification" className="text-gold underline flex items-center mt-2 group">
                    Start Rectification <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </motion.div>
            )}
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="kosmiq-btn-primary w-full py-4 flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-black/20 border-t-black animate-spin rounded-full" />
            ) : (
              "Save Details"
            )}
          </button>
        </form>
      </motion.div>

      {/* Success Toast */}
      <AnimatePresence>
        {success && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 bg-gold text-black px-6 py-3 rounded-full flex items-center space-x-3 shadow-2xl font-bold"
          >
            <CheckCircle className="w-5 h-5" />
            <span>Profile Updated Successfully</span>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .input-label {
          @apply text-[10px] uppercase tracking-[0.2em] text-gold/60 font-semibold block ml-1;
        }
        .kosmiq-input {
          @apply w-full bg-black/60 border border-gold/20 rounded-sm px-4 py-3 focus:outline-none focus:border-gold/50 transition-all text-white font-mono text-sm;
        }
        .kosmiq-btn-primary {
          @apply bg-gold text-black font-bold uppercase tracking-widest text-xs hover:bg-gold/90 transition-colors rounded-sm;
        }
      `}</style>
    </div>
  );
}
