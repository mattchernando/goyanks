import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Pinstripe Lab | Yankees Pitching Analytics",
  description:
    "Real-time Yankees pitching analytics dashboard with AI-powered insights.",
  keywords: ["Yankees", "MLB", "pitching", "analytics", "baseball"],
  openGraph: {
    title: "Pinstripe Lab",
    description: "Yankees Pitching Analytics Dashboard",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-navy">
          {children}
        </div>
      </body>
    </html>
  );
}
