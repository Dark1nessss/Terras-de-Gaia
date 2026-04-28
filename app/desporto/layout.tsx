import type { Metadata } from "next";
import "../globals.css";
import Navbar from "@/components/navbar";

export const metadata: Metadata = {
	title: "Desporto - Terras de Gaia",
	description: "Desporto, Notícias, Politica, Cultura e muito mais. Fique informado sobre tudo o que acontece em Terras de Gaia.",
};

export default function DesportoLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<>
			<Navbar />
			{children}
		</>
	);
}
