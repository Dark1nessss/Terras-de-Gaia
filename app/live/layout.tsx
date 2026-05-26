import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "Em Direto - Terras de Gaia",
  description: "Assista à emissão em direto do Jornal Diário, trazendo as notícias mais recentes e relevantes sobre desporto, política, cultura e muito mais em Terras de Gaia.",
};

export default function LiveLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
    	{children}
    </>
  );
}