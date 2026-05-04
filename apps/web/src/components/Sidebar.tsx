"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  Compass, 
  Sparkles, 
  Library, 
  Beaker, 
  HeartPulse, 
  UserCircle,
  LogOut
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";

const navItems = [
  { name: "Nexus", icon: LayoutDashboard, href: "/dashboard" },
  { name: "Astrolabe", icon: Compass, href: "/astrolabe" },
  { name: "Oracle", icon: Sparkles, href: "/oracle" },
  { name: "Chronicles", icon: Library, href: "/chronicles" },
  { name: "Laboratory", icon: Beaker, href: "/laboratory" },
  { name: "Synergy", icon: HeartPulse, href: "/compatibility" },
  { name: "Identity", icon: UserCircle, href: "/signature" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <aside className="w-64 h-full border-r border-gold/10 bg-[#050505] flex flex-col relative z-40 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
        <div className="absolute top-1/4 -left-1/2 w-full h-1/2 bg-gold/5 blur-[120px] rounded-full" />
      </div>

      {/* Header */}
      <div className="p-8 pb-12">
        <Link href="/dashboard" className="flex items-center space-x-3 group">
          <div className="p-2 border border-gold/20 rounded-sm bg-gold/5 group-hover:border-gold/50 transition-colors">
            <Sparkles className="w-5 h-5 text-gold" />
          </div>
          <span className="font-serif text-2xl tracking-tighter text-white">KOSMIQ</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-grow px-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`group relative flex items-center space-x-4 px-4 py-4 rounded-sm transition-all overflow-hidden ${
                isActive 
                  ? "text-white bg-gold/10 border border-gold/20 shadow-[inset_0_0_20px_rgba(197,160,89,0.05)]" 
                  : "text-gray-500 hover:text-white border border-transparent"
              }`}
            >
              {/* Active Indicator Glow */}
              {isActive && (
                <motion.div
                  layoutId="activeGlow"
                  className="absolute inset-0 bg-gold/5 opacity-50"
                  initial={false}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              
              <item.icon className={`w-5 h-5 transition-all duration-500 ${
                isActive ? "text-gold drop-shadow-[0_0_8px_rgba(197,160,89,0.5)]" : "group-hover:text-gold/60"
              }`} />
              
              <span className={`uppercase tracking-[0.2em] text-[10px] font-bold transition-all duration-300 ${
                isActive ? "text-white" : "group-hover:translate-x-1"
              }`}>
                {item.name}
              </span>

              {/* Decorative accent for active state */}
              {isActive && (
                <motion.div
                  layoutId="activeAccent"
                  className="absolute right-0 top-1/2 -translate-y-1/2 w-[2px] h-4 bg-gold"
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer / Sign Out */}
      <div className="p-4 mt-auto">
        <button
          onClick={handleSignOut}
          className="w-full group flex items-center space-x-4 px-4 py-4 text-gray-500 hover:text-red-400 transition-all rounded-sm border border-transparent hover:border-red-400/20 hover:bg-red-400/5"
        >
          <LogOut className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
          <span className="uppercase tracking-[0.2em] text-[10px] font-bold">Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
