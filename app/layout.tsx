import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";
import { Navbar } from "@/components/NavBar";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Intégration",
  description: "Intégration dans les FI ICC Toulouse",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(inter.className, "w-screen")}>
        <Navbar />
        <main className=" py-6 pb-24 md:pb-6 flex justify-center w-full p-3">
          {children}
        </main>
        <Toaster />
      </body>
    </html>
  );
}