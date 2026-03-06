import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const sans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const mono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Realtime Playground",
  description: "Explore Supabase Realtime features interactively",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark h-full">
      <body
        className={`${sans.variable} ${mono.variable} antialiased h-screen w-screen`}
      >
        <div className="h-full flex flex-col p-4 font-mono text-sm overflow-hidden">
          <nav className="text-2xl font-bold mb-4 shrink-0">
            Realtime-js Interactive Example
          </nav>

          <div className="flex-1 overflow-hidden">{children}</div>
        </div>
        <Toaster position="bottom-left" theme="dark" />
      </body>
    </html>
  );
}
