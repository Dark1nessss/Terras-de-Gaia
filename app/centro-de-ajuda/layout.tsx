import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
	title: "Centro de Ajuda - Terras de Gaia",
	description: "Encontre respostas para suas dúvidas e obtenha suporte sobre Terras de Gaia.",
};

export default function centroDeAjudaLayout({
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
