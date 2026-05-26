import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
	title: "Sobre Nós - Terras de Gaia",
	description: "Saiba mais sobre a equipe e a missão de Terras de Gaia, e como estamos comprometidos em trazer informações precisas e relevantes para nossa comunidade.",
};

export default function sobreNosLayout({
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
