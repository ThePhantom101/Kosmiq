"use client";

import { ReactNode, useEffect } from "react";
import { useSession } from "@/hooks/useSession";
import { useRouter, usePathname } from "next/navigation";

interface AuthGateProps {
  children: ReactNode;
  mode?: "redirect" | "inline";
  fallback?: ReactNode;
}

export function AuthGate({
  children,
  mode = "redirect",
  fallback,
}: AuthGateProps) {
  const { isAuthenticated, loading } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !isAuthenticated && mode === "redirect") {
      router.push(`/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [loading, isAuthenticated, mode, router, pathname]);

  if (loading) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated) {
    if (mode === "redirect") {
      return null;
    }

    return (
      fallback ?? (
        <div className="hud-module flex flex-col items-center gap-6 p-12 text-center">
          <div className="flex flex-col gap-2">
            <h2 className="overline-label text-2xl text-gold">
              Chronicles Locked
            </h2>
            <p className="max-w-md text-muted-foreground">
              This technical insight is part of your permanent Chronicles. Sign
              in to preserve your life timeline and access saved charts.
            </p>
          </div>
          <button
            onClick={() =>
              router.push(`/login?next=${encodeURIComponent(pathname)}`)
            }
            className="gold-button px-8"
          >
            Sign In to Unlock
          </button>
        </div>
      )
    );
  }

  return <>{children}</>;
}
