import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
	title: "Vira Parceiro - Terras de Gaia",
	description: "Saiba como se tornar um parceiro de Terras de Gaia e colaborar conosco para trazer informações precisas e relevantes para nossa comunidade.",
};

export default function viraParceiroLayout({
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
