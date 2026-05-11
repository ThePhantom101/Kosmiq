import type { Metadata } from "next";
import { Cinzel, Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import BackgroundSystem from "@/components/BackgroundSystem";
import NavHUD from "@/components/NavHUD";
import { AstroProvider } from "@/context/AstroContext";
import { SpeedInsights } from "@vercel/speed-insights/next";
// Triggering fresh Vercel deployment after root directory update

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kosmiq | Modern Vedic Intelligence",
  description: "High-precision Vedic astrology platform blending ancient wisdom with generative AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cinzel.variable} ${inter.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-black text-foreground relative antigravity-scroll-lock" suppressHydrationWarning>
        <BackgroundSystem />
        <AstroProvider>
          {children}
        </AstroProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}


