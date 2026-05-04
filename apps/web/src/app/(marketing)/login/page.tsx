"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogIn, LayoutGrid, Mail, Globe, ArrowRight, CheckCircle2 } from "lucide-react";
import SoulSignature from "@/components/SoulSignature";
import { createClient } from "@/utils/supabase/client";

export default function LoginPage() {
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSocialLogin = async (provider: "google" | "github") => {
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setSent(true);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-black overflow-hidden">
      {/* Left Side: Generative Visual */}
      <div className="hidden lg:flex w-1/2 relative bg-[#050505] items-center justify-center border-r border-gold/10">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(197,160,89,0.05)_0,transparent_70%)]" />
        </div>
        <div className="w-full h-full max-w-xl">
          <SoulSignature />
        </div>
        
        {/* Decorative Quote */}
        <div className="absolute bottom-12 left-12 right-12 text-center space-y-2">
          <p className="text-gold/40 font-serif italic text-lg">
            "The stars are the letters of a sacred language, <br /> and you are the story they tell."
          </p>
          <div className="overline-label !text-gold/20">Ancient Vedic Insight</div>
        </div>
      </div>

      {/* Right Side: Auth Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16 relative">
        {/* Subtle grid for the right side too */}
        <div className="absolute inset-0 bg-grid-white/[0.02] -z-10" />

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-md space-y-12"
        >
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <span className="overline-label">Secure Access</span>
              <div className="h-[1px] w-8 bg-gold/30" />
            </div>
            <h1 className="text-5xl font-serif text-white tracking-tight">
              Begin Your <br />
              <span className="text-gold">Eternal Chronicle</span>
            </h1>
            <p className="text-gray-500 font-sans leading-relaxed">
              Sign in to persist your cosmic readings, track planetary transits, and unlock deep architectural insights into your soul's journey.
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => handleSocialLogin("google")}
              className="w-full group relative flex items-center justify-center space-x-4 bg-white hover:bg-white/90 text-black font-bold py-4 rounded-sm transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]"
            >
              <Globe className="w-5 h-5" />
              <span className="uppercase tracking-[0.2em] text-xs">Continue with Google</span>
            </button>

            <button
              onClick={() => handleSocialLogin("github")}
              className="w-full group relative flex items-center justify-center space-x-4 border border-white/20 bg-transparent hover:bg-white/5 text-white font-bold py-4 rounded-sm transition-all"
            >
              <LayoutGrid className="w-5 h-5" />
              <span className="uppercase tracking-[0.2em] text-xs">Continue with GitHub</span>
            </button>

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gold/10" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-[0.3em]">
                <span className="bg-black px-4 text-gold/40">Technical Access</span>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {!sent ? (
                <motion.form
                  key="login-form"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  onSubmit={handleEmailLogin}
                  className="space-y-4"
                >
                  <div className="relative group">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="ENTER YOUR EMAIL"
                      className="w-full bg-white/5 border border-gold/10 focus:border-gold/30 text-white placeholder:text-gold/20 px-4 py-4 rounded-sm outline-none transition-all font-mono text-xs tracking-widest uppercase"
                      required
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gold/20 group-focus-within:text-gold/40 transition-colors">
                      <Mail className="w-4 h-4" />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full group flex items-center justify-center space-x-4 bg-gold/10 hover:bg-gold/20 border border-gold/20 text-gold py-4 rounded-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
                    ) : (
                      <>
                        <span className="uppercase tracking-[0.2em] text-xs font-bold">Transmit Magic Link</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>

                  {error && (
                    <p className="text-[10px] text-red-400 font-mono text-center uppercase tracking-wider">
                      Transmission Error: {error}
                    </p>
                  )}
                </motion.form>
              ) : (
                <motion.div
                  key="success-message"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-gold/5 border border-gold/20 p-6 rounded-sm space-y-4 text-center"
                >
                  <div className="flex justify-center">
                    <CheckCircle2 className="w-10 h-10 text-gold" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-gold font-serif text-lg tracking-tight">Chronicle Access Transmitted</h3>
                    <p className="text-gray-400 text-xs font-sans leading-relaxed">
                      We've sent a magic link to <span className="text-white">{email}</span>. <br />
                      Check your frequency (inbox) to proceed.
                    </p>
                  </div>
                  <button
                    onClick={() => setSent(false)}
                    className="text-[10px] text-gold/40 uppercase tracking-[0.2em] hover:text-gold transition-colors"
                  >
                    Use a different email
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="pt-8 border-t border-gold/10">
            <p className="text-[10px] text-gray-500 font-mono leading-relaxed text-center">
              BY ACCESSING THE KOSMIQ LABORATORY, YOU AGREE TO OUR <br />
              <span className="text-gold/40 cursor-pointer hover:text-gold">TERMS OF TRANSMISSION</span> & <span className="text-gold/40 cursor-pointer hover:text-gold">PRIVACY PROTOCOLS</span>.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
