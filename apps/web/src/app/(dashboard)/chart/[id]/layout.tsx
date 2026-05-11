import React from "react";
import ChartShell from "@/components/ChartShell";

export default function ChartTabLayout({ children }: { children: React.ReactNode }) {
  return <ChartShell>{children}</ChartShell>;
}
