"use client";

import React from "react";
import { UserCircle, Mail, Lock, LogOut } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

import { AuthGate } from "@/components/auth/AuthGate";

export default function AccountPage() {
  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <AuthGate mode="redirect">
      <div className="space-y-10 max-w-2xl">
        {/* Header */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="overline-label">Settings</span>
            <div className="h-px w-8 bg-gold/30" />
          </div>
          <h1 className="text-5xl font-serif text-white tracking-tight uppercase">
            Account
          </h1>
        </div>

        {/* Profile Card */}
        <div className="hud-module p-8 border border-gold/10 bg-gold/5 space-y-6">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-gold/10 border border-gold/20 rounded-full">
              <UserCircle className="w-8 h-8 text-gold" />
            </div>
            <div>
              <h3 className="text-white font-serif text-xl">Your Profile</h3>
              <p className="text-gold/40 text-xs uppercase tracking-widest font-mono">Kosmiq Member</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 border border-gold/10 rounded-sm bg-black/30">
              <Mail className="w-4 h-4 text-gold/40 shrink-0" />
              <span className="text-[10px] uppercase tracking-widest text-gray-500 font-mono">
                Account management coming soon
              </span>
            </div>
            <div className="flex items-center gap-3 p-4 border border-gold/10 rounded-sm bg-black/30">
              <Lock className="w-4 h-4 text-gold/40 shrink-0" />
              <span className="text-[10px] uppercase tracking-widest text-gray-500 font-mono">
                Password &amp; security settings coming soon
              </span>
            </div>
          </div>
        </div>

        {/* Sign Out */}
        <div className="hud-module p-6 border border-red-400/10 bg-red-400/5 space-y-4">
          <h4 className="text-[10px] uppercase tracking-[0.2em] text-red-400/60 font-bold">Danger Zone</h4>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 px-6 py-3 border border-red-400/30 text-red-400 hover:bg-red-400/10 rounded-sm transition-all text-[10px] uppercase tracking-widest font-bold"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>
    </AuthGate>
  );
}
