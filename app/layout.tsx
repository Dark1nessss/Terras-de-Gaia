import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";

// get nurom font from .ttf file in public/fonts
const nuromFont = localFont({
  src: '../public/fonts/Nurom-Bold.ttf',
  variable: '--font-nurom',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Jornal Diário - Terras de Gaia",
  description: "Desporto, Notícias, Politica, Cultura e muito mais. Fique informado sobre tudo o que acontece em Terras de Gaia.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${nuromFont.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
