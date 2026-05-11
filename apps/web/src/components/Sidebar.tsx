"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  BookOpen,
  Grid3x3,
  GitBranch,
  BarChart3,
  Zap,
  Moon,
  CalendarDays,
  History,
  HeartPulse,
  Globe,
  Sun,
  Clock,
  Crosshair,
  CalendarCheck,
  CircleDot,
  User,
  Users,
  Sparkles,
  UserCircle,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useAstro } from "@/context/AstroContext";

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const PLACEHOLDER_CHART_ID = "me";

const mainItems: NavItem[] = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { name: "My Charts", icon: BookOpen, href: "/charts" },
];

const kundaliItems: NavItem[] = [
  { name: "Overview", icon: LayoutDashboard, href: `/chart/${PLACEHOLDER_CHART_ID}` },
  { name: "Divisional Charts (Shodashvarga)", icon: Grid3x3, href: `/chart/${PLACEHOLDER_CHART_ID}/divisional` },
  { name: "Dasha Timeline (Vimshottari)", icon: GitBranch, href: `/chart/${PLACEHOLDER_CHART_ID}/timeline` },
  { name: "Strengths (Shadbala + AV)", icon: BarChart3, href: `/chart/${PLACEHOLDER_CHART_ID}/strengths` },
  { name: "Shadow Planets (Upagrahas)", icon: Moon, href: `/chart/${PLACEHOLDER_CHART_ID}/shadows` },
  { name: "Yogas", icon: Zap, href: `/chart/${PLACEHOLDER_CHART_ID}/yogas` },
];

const predictionItems: NavItem[] = [
  { name: "Monthly Forecast", icon: CalendarDays, href: "/predictions/monthly" },
  { name: "Historical Matches", icon: History, href: "/predictions/samhita" },
  { name: "Personalities Archive", icon: Users, href: "/tools/personalities" },
  { name: "Compatibility (Gun Milan)", icon: HeartPulse, href: "/compatibility" },
];

const skyItems: NavItem[] = [
  { name: "Current Transits", icon: Globe, href: "/sky/transits" },
  { name: "Panchang", icon: Sun, href: "/sky/panchang" },
  { name: "Auspicious Times (coming soon)", icon: Clock, href: "/sky/muhurta" },
  { name: "Learning Center", icon: BookOpen, href: "/tools/learning" },
];

const refineItems: NavItem[] = [
  { name: "Chart Rectification", icon: Crosshair, href: "/tools/rectification" },
  { name: "Important Dates", icon: CalendarCheck, href: "/tools/calibration/events" },
  { name: "Zodiac Check", icon: CircleDot, href: "/tools/calibration/zodiac" },
  { name: "Personal Details", icon: User, href: "/tools/calibration/biodata" },
];

const sections: NavSection[] = [
  { title: "Your Kundali", items: kundaliItems },
  { title: "Predictions", items: predictionItems },
  { title: "Today's Sky", items: skyItems },
  { title: "Refine Your Chart", items: refineItems },
];

function NavLink({ item, isActive }: { item: NavItem; isActive: boolean }) {
  return (
    <Link
      href={item.href}
      className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-sm transition-all overflow-hidden ${
        isActive
          ? "text-white bg-gold/10 border border-gold/20 shadow-[inset_0_0_20px_rgba(197,160,89,0.05)]"
          : "text-zinc-500 hover:text-white border border-transparent hover:bg-white/5"
      }`}
    >
      {isActive && (
        <motion.div
          layoutId="activeGlow"
          className="absolute inset-0 bg-gold/5 opacity-50"
          initial={false}
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        />
      )}

      <item.icon
        className={`w-4 h-4 shrink-0 transition-all duration-300 ${
          isActive ? "text-gold drop-shadow-[0_0_8px_rgba(197,160,89,0.5)]" : "group-hover:text-gold/60"
        }`}
      />

      <span
        className={`text-[10px] uppercase tracking-[0.15em] font-bold leading-tight transition-all duration-300 ${
          isActive ? "text-white" : "group-hover:translate-x-0.5"
        }`}
      >
        {item.name}
      </span>

      {isActive && (
        <motion.div
          layoutId="activeAccent"
          className="absolute right-0 top-1/2 -translate-y-1/2 w-[2px] h-4 bg-gold"
        />
      )}
    </Link>
  );
}

function CollapsibleSection({
  section,
  pathname,
  hasChart,
}: {
  section: NavSection;
  pathname: string;
  hasChart: boolean;
}) {
  const isKundali = section.title === "Your Kundali";
  const hasActiveChild = section.items.some((i) => pathname.startsWith(i.href));
  const [open, setOpen] = useState(hasActiveChild || !isKundali);

  return (
    <div className="space-y-0.5">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-3 py-2 group"
      >
        <span className="text-[9px] font-black uppercase tracking-[0.25em] text-zinc-600 group-hover:text-zinc-400 transition-colors">
          {section.title}
        </span>
        <ChevronDown
          className={`w-3 h-3 text-zinc-600 group-hover:text-zinc-400 transition-all duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden space-y-0.5"
          >
            {isKundali && !hasChart ? (
              <div className="px-3 py-2">
                <p className="text-[9px] text-zinc-600 uppercase tracking-widest leading-relaxed">
                  Generate a chart to unlock Kundali views
                </p>
                <Link
                  href="/new-chart"
                  className="mt-2 inline-flex text-[9px] uppercase tracking-widest text-gold/60 hover:text-gold transition-colors"
                >
                  + New Chart →
                </Link>
              </div>
            ) : (
              section.items.map((item) => (
                <NavLink
                  key={item.href}
                  item={item}
                  isActive={pathname.startsWith(item.href)}
                />
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const supabase = createClient();
  const { data } = useAstro();
  const hasChart = data !== null;
  const [lang, setLang] = useState<"EN" | "HI">("EN");
  const [mounted, setMounted] = useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

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

      {/* Logo */}
      <div className="p-6 pb-8 shrink-0">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="p-2 border border-gold/20 rounded-sm bg-gold/5 group-hover:border-gold/50 transition-colors">
            <Sparkles className="w-4 h-4 text-gold" />
          </div>
          <span className="font-serif text-xl tracking-tighter text-white">KOSMIQ</span>
        </Link>
      </div>

      {/* Scrollable Nav */}
      <nav className="flex-grow px-3 pb-4 space-y-1 overflow-y-auto scrollbar-none">
        {/* Main items */}
        {mainItems.map((item) => (
          <NavLink
            key={item.href}
            item={item}
            isActive={pathname === item.href}
          />
        ))}

        <div className="py-2">
          <div className="h-px bg-gold/10" />
        </div>

        {/* Grouped sections */}
        {sections.map((section) => (
          <CollapsibleSection
            key={section.title}
            section={section}
            pathname={pathname}
            hasChart={hasChart}
          />
        ))}

        <div className="py-2">
          <div className="h-px bg-gold/10" />
        </div>

        {/* Ask AI */}
        <NavLink
          item={{ name: "Ask (Raj Jyotishi)", icon: Sparkles, href: "/ask" }}
          isActive={pathname === "/ask"}
        />
      </nav>

      {/* Footer */}
      <div className="shrink-0 p-3 border-t border-gold/10 space-y-2">
        {/* Language Toggle */}
        <div className="flex items-center justify-between px-3 py-1 bg-white/5 rounded-full border border-white/5">
           <button 
             onClick={() => setLang("EN")}
             className={`flex-1 text-[8px] font-black uppercase tracking-widest py-1.5 rounded-full transition-all ${lang === "EN" ? "bg-gold text-black shadow-lg" : "text-zinc-500 hover:text-zinc-300"}`}
           >
             {mounted ? "English" : "EN"}
           </button>
           <button 
             onClick={() => setLang("HI")}
             className={`flex-1 text-[8px] font-black uppercase tracking-widest py-1.5 rounded-full transition-all ${lang === "HI" ? "bg-gold text-black shadow-lg" : "text-zinc-500 hover:text-zinc-300"}`}
           >
             {mounted ? "हिन्दी" : "HI"}
           </button>
        </div>

        <div className="space-y-1">
          <NavLink
            item={{ name: "Account", icon: UserCircle, href: "/settings/account" }}
            isActive={pathname === "/settings/account"}
          />
          <button
            onClick={handleSignOut}
            className="w-full group flex items-center gap-3 px-3 py-2.5 text-zinc-600 hover:text-red-400 transition-all rounded-sm border border-transparent hover:border-red-400/20 hover:bg-red-400/5"
          >
            <LogOut className="w-4 h-4 shrink-0 transition-transform group-hover:-translate-x-0.5" />
            <span className="text-[10px] uppercase tracking-[0.15em] font-bold">
              {mounted ? "Sign Out" : "Logout"}
            </span>
          </button>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
