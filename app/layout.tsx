import type { Metadata } from "next";
import { Syne, DM_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://smartcampus.example"),
  title: {
    default: "SmartCampus — Plateforme de gestion académique",
    template: "%s | SmartCampus",
  },
  description:
    "SmartCampus centralise la gestion des étudiants, professeurs, cours, notes et finances pour les établissements d'Afrique francophone, avec IA pédagogique et gamification.",
  openGraph: {
    title: "SmartCampus — Plateforme de gestion académique",
    description:
      "La plateforme SaaS multi-établissements pensée pour les universités et écoles d'Afrique francophone.",
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SmartCampus — Plateforme de gestion académique",
    description:
      "La plateforme SaaS multi-établissements pensée pour les universités et écoles d'Afrique francophone.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${syne.variable} ${dmSans.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}