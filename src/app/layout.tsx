import type { Metadata, Viewport } from "next";
import { Inter, Fraunces } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { hasClerk } from "@/lib/config";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "AgroKos — Bujqësia e Kosovës, E Dixhitalizuar",
  description:
    "Platformë agroteknologjike për fermerët e Kosovës. Menaxho fushat, monitoro mbjelljet, dhe rrit fitimet me AgroKos.",
  applicationName: "AgroKos",
  manifest: "/manifest.webmanifest",
  icons: { icon: "/icon.svg" },
};

export const viewport: Viewport = {
  themeColor: "#2D6A4F",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const tree = (
    <html lang="sq" className={`${inter.variable} ${fraunces.variable}`}>
      <body>{children}</body>
    </html>
  );
  // Only mount Clerk when keys are configured, so the app runs without them.
  return hasClerk ? <ClerkProvider>{tree}</ClerkProvider> : tree;
}
