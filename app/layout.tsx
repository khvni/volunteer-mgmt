import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { Navigation } from "@/components/navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MyFundAction Volunteer Management",
  description: "Volunteer management and project matching platform for MyFundAction with gamification features",
  keywords: ["volunteer", "charity", "MyFundAction", "Malaysia", "NGO"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navigation />
        <main className="min-h-screen">
          {children}
        </main>
        <footer className="border-t py-8 mt-20">
          <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} MyFundAction (Yayasan Kebajikan Muslim). All rights reserved.</p>
            <p className="mt-2">Empowering 18,000+ volunteers across 5 countries</p>
          </div>
        </footer>
        <Analytics />
      </body>
    </html>
  );
}
