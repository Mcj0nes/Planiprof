import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SkinProvider from "@/app/components/SkinProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Planiprof",
  description: "Planification pédagogique pour enseignants",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* Restore skin from localStorage before first paint to avoid flash */}
        <script dangerouslySetInnerHTML={{ __html: `(function(){var m={'bleu-profond':['#3B5FA0','#C5D5E8'],'sarcelle':['#0D8C7C','#B2D8D4'],'violet':['#7C3AED','#DDD6FE'],'rose':['#BE4178','#F9C6DC'],'ambre':['#D97706','#FDE7C2'],'foret':['#16A34A','#C6E8D3'],'ardoise':['#475569','#CBD5E1'],'indigo':['#4338CA','#D1D5FE'],'ciel':['#0284C7','#BAE6FD']};var id=localStorage.getItem('planiprof-skin');if(id&&m[id]){var r=document.documentElement.style;r.setProperty('--color-nav',m[id][0]);r.setProperty('--color-body-bg',m[id][1]);}})()` }} />
        <SkinProvider>{children}</SkinProvider>
      </body>
    </html>
  );
}
