import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";

export const metadata: Metadata = {
  title: "VCScout — VC Intelligence Platform",
  description: "A lightweight VC analyst sourcing tool for discovering, enriching, and tracking startups.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Sidebar />
        <Topbar />
        <main className="md:ml-60 mt-16 min-h-[calc(100vh-4rem)] bg-background">
          <div className="p-6">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
