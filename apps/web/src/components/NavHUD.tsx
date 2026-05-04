"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function NavHUD() {
  return (
    <nav className="fixed top-0 left-0 right-0 h-16 z-50 flex items-center justify-between px-8 border-b border-gold/10 backdrop-blur-md bg-black/20">
      <Link href="/" className="flex items-center space-x-2 group">
        <Sparkles className="w-5 h-5 text-gold group-hover:scale-110 transition-transform" />
        <span className="font-serif text-xl tracking-wider text-white">KOSMIQ</span>
      </Link>

      <div className="flex items-center space-x-10">
        <NavLink href="/features">Features</NavLink>
        <NavLink href="/methodology">Methodology</NavLink>
        <NavLink href="/pricing">Pricing</NavLink>
        <Link 
          href="/login" 
          className="px-6 py-2 border border-gold/40 hover:border-gold hover:bg-gold/5 transition-all rounded-sm text-xs uppercase tracking-widest text-gold"
        >
          Sign In
        </Link>
      </div>
    </nav>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link 
      href={href} 
      className="text-xs uppercase tracking-[0.2em] text-gray-400 hover:text-gold transition-colors relative group"
    >
      <span className="absolute -top-4 left-0 right-0 h-[1px] bg-gold scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
      {children}
    </Link>
  );
}
