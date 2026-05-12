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
  Lock,
  LogIn,
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useAstro } from "@/context/AstroContext";
import { useSession } from "@/hooks/useSession";
import { useRouter } from "next/navigation";

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
}

interface NavSection {
  title: string;
  items: NavItem[];
  isLockedForGuest?: boolean;
}

const PLACEHOLDER_CHART_ID = "me";

const mainItems: NavItem[] = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { name: "My Library", icon: BookOpen, href: "/charts" },
  { name: "Ask AI", icon: Sparkles, href: "/ask" },
];

const activeChartItems: NavItem[] = [
  { name: "Chart Overview", icon: LayoutDashboard, href: `/chart/${PLACEHOLDER_CHART_ID}` },
  { name: "16 Divisional Charts", icon: Grid3x3, href: `/chart/${PLACEHOLDER_CHART_ID}/divisional` },
  { name: "Vimshottari Dasha", icon: GitBranch, href: `/chart/${PLACEHOLDER_CHART_ID}/timeline` },
  { name: "Shadbala Energy", icon: Zap, href: `/chart/${PLACEHOLDER_CHART_ID}/strengths` },
  { name: "Ashtakvarga Strength", icon: BarChart3, href: `/chart/${PLACEHOLDER_CHART_ID}/ashtakvarga` },
  { name: "Shadow Planets", icon: Moon, href: `/chart/${PLACEHOLDER_CHART_ID}/shadows` },
];

const predictionItems: NavItem[] = [
  { name: "Monthly Predictions", icon: CalendarDays, href: "/predictions/monthly" },
  { name: "Relationship Matching", icon: HeartPulse, href: "/compatibility" },
  { name: "Historical Comparisons", icon: History, href: "/predictions/samhita" },
];

const skyItems: NavItem[] = [
  { name: "Current Transits", icon: Globe, href: "/sky/transits" },
  { name: "Daily Almanac", icon: Sun, href: "/sky/panchang" },
  { name: "Auspicious Windows", icon: Clock, href: "/sky/muhurta" },
];

const refineItems: NavItem[] = [
  { name: "Time Correction", icon: Crosshair, href: "/tools/rectification" },
  { name: "Event Sync", icon: CalendarCheck, href: "/tools/calibration/events" },
  { name: "Identity Check", icon: CircleDot, href: "/tools/calibration/zodiac" },
  { name: "Profile Settings", icon: User, href: "/tools/calibration/biodata" },
];

const sections: NavSection[] = [
  { title: "Main", items: mainItems },
  { title: "Active Chart", items: activeChartItems },
  { title: "Predictions", items: predictionItems },
  { title: "Today's Sky", items: skyItems },
  { title: "Refine", items: refineItems, isLockedForGuest: true },
];

function NavLink({
  item,
  isActive,
  isLocked,
}: {
  item: NavItem;
  isActive: boolean;
  isLocked?: boolean;
}) {
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
          isActive
            ? "text-gold drop-shadow-[0_0_8px_rgba(197,160,89,0.5)]"
            : isLocked
            ? "text-zinc-700"
            : "group-hover:text-gold/60"
        }`}
      />

      <span
        className={`text-[10px] uppercase tracking-[0.15em] font-bold leading-tight transition-all duration-300 flex items-center gap-2 ${
          isActive ? "text-white" : isLocked ? "text-zinc-700" : "group-hover:translate-x-0.5"
        }`}
      >
        {item.name}
        {isLocked && <Lock className="w-2.5 h-2.5 opacity-50" />}
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
  isGuest,
}: {
  section: NavSection;
  pathname: string;
  hasChart: boolean;
  isGuest: boolean;
}) {
  const isActiveChart = section.title === "Active Chart";
  const hasActiveChild = section.items.some((i) => pathname.startsWith(i.href));
  const [open, setOpen] = useState(hasActiveChild || section.title === "Main");

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
            {isActiveChart && !hasChart ? (
              <div className="px-3 py-2">
                <p className="text-[9px] text-zinc-600 uppercase tracking-widest leading-relaxed">
                  Generate a chart to unlock analysis
                </p>
                <Link
                  href="/charts"
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
                  isLocked={isGuest && section.isLockedForGuest}
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
  const router = useRouter();
  const supabase = createClient();
  const { isAuthenticated, loading: authLoading } = useSession();
  const { data } = useAstro();
  const hasChart = data !== null;
  const [mounted, setMounted] = useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handleAuthAction = async () => {
    if (isAuthenticated) {
      await supabase.auth.signOut();
      window.location.href = "/";
    } else {
      router.push(`/login?next=${encodeURIComponent(pathname)}`);
    }
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
        {/* Grouped sections */}
        {sections.map((section) => (
          <CollapsibleSection
            key={section.title}
            section={section}
            pathname={pathname}
            hasChart={hasChart}
            isGuest={!isAuthenticated}
          />
        ))}
      </nav>

      {/* Footer */}
      <div className="shrink-0 p-3 border-t border-gold/10 space-y-2">

        <div className="space-y-1">
          <NavLink
            item={{ name: "Account", icon: UserCircle, href: "/settings/account" }}
            isActive={pathname === "/settings/account"}
            isLocked={!isAuthenticated}
          />
          <button
            onClick={handleAuthAction}
            className={`w-full group flex items-center gap-3 px-3 py-2.5 transition-all rounded-sm border border-transparent ${
              isAuthenticated
                ? "text-zinc-600 hover:text-red-400 hover:border-red-400/20 hover:bg-red-400/5"
                : "text-gold/60 hover:text-gold hover:border-gold/20 hover:bg-gold/5"
            }`}
          >
            {isAuthenticated ? (
              <LogOut className="w-4 h-4 shrink-0 transition-transform group-hover:-translate-x-0.5" />
            ) : (
              <LogIn className="w-4 h-4 shrink-0 transition-transform group-hover:translate-x-0.5" />
            )}
            <span className="text-[10px] uppercase tracking-[0.15em] font-bold">
              {mounted
                ? isAuthenticated
                  ? "Sign Out"
                  : "Sign In"
                : "..."}
            </span>
          </button>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
