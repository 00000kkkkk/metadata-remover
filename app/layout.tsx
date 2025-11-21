import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Metadata Remover - Remove Photo Metadata",
  description:
    "Securely remove EXIF metadata from photos online. Processing happens locally in your browser.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full overflow-hidden">
      <body
        className={`${jetbrainsMono.variable} antialiased h-full overflow-hidden`}
        style={{ fontFamily: "var(--font-jetbrains-mono)" }}
      >
        {children}
      </body>
    </html>
  );
}
