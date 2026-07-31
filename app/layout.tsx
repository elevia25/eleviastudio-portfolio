import type { Metadata } from "next";
import { JetBrains_Mono, Syne, Instrument_Serif } from "next/font/google";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  weight: ["400", "500", "700", "800"],
  variable: "--font-syne",
  display: "swap",
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});
const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400", "400"], // Specify weights you need
  variable: "--font-instrument",
  display: "swap",
});
export const metadata: Metadata = {
  title: "ELEVIA STUDIO | Cinematic Excellence Portfolio",
  description:
    "Elevia Studio — an Ahmedabad-based creative studio delivering cinematic storytelling, strategic design, and motion experiences.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${instrumentSerif.variable} ${jetBrainsMono.variable}`}
    >
      <head>
    
      </head>
      <body className="bg-background font-body-md text-on-background antialiased selection:bg-primary selection:text-on-primary">
        {children}
      </body>
    </html>
  );
}
