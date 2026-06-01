import type { Metadata } from "next";
import { Playfair_Display } from "next/font/google";
import "./globals.css";
import BackgroundMusic from "@/components/BackgroundMusic";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sip or Slip — The Bronze Age Bar",
  description:
    "Choose the right bronze ritual vessel — or face the consequences of the court.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bronze-gradient">
        {children}
        <BackgroundMusic />
      </body>
    </html>
  );
}
