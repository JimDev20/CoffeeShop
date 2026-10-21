import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import AuthProvider from "@/components/AuthProvider";
import RevealController from "@/components/reveal";

export const metadata: Metadata = {
  title: "Brew & Co. — Coffee with a source",
  description: "Single-origin coffee, roasted in small batches and delivered across the Philippines.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font -- App Router layout loads the font for every page. */}
        <link
          href="https://fonts.googleapis.com/css2?family=Stack+Sans+Headline:wght@300&family=Stack+Sans+Text:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans">
        <AuthProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </AuthProvider>
        <RevealController />
      </body>
    </html>
  );
}
