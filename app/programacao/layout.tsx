import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
	title: "Programação - Terras de Gaia",
	description: "Desporto, Notícias, Politica, Cultura e muito mais. Fique informado sobre tudo o que acontece em Terras de Gaia.",
};

export default function programacaoLayout({
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
