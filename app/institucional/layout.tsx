import type { Metadata } from "next";
import "../globals.css";
import Navbar from "@/components/navbar";

export const metadata: Metadata = {
  title: "Institucional - Terras de Gaia",
  description: "Institucional, Notícias, Politica, Cultura e muito mais. Fique informado sobre tudo o que acontece em Terras de Gaia.",
};

export default function InstitucionalLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
			{children}
    </>
  );
}

