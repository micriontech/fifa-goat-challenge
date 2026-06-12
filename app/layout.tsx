import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "FIFAWCPREDICT - FIFA 2026 GOAT Challenge",
  description: "Vote in the ultimate 1v1 football GOAT showdown. 20 legends vs active stars - who rules football history? Track FIFA 2026 World Cup fixtures.",
  metadataBase: new URL("https://fifawcpredict.com"),
  openGraph: {
    title: "FIFAWCPREDICT - FIFA 2026 GOAT Challenge",
    description: "Who is the football GOAT? Vote now and track FIFA 2026 World Cup fixtures.",
    url: "https://fifawcpredict.com",
    siteName: "FIFAWCPREDICT",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FIFAWCPREDICT - FIFA 2026 GOAT Challenge",
    description: "Who is the football GOAT? Vote now.",
  },
};

export const viewport: Viewport = {
  themeColor: "#0D1B2A",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={poppins.className}>
      <body className="text-white antialiased">
        <Navbar />
        <main className="pt-16 min-h-screen">{children}</main>
      </body>
    </html>
  );
}
