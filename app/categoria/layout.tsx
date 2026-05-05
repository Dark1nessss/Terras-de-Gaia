import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
	title: "Categoria - Terras de Gaia",
	description: "Categoria, Notícias, Politica, Cultura e muito mais. Fique informado sobre tudo o que acontece em Terras de Gaia.",
};

export default function CategoriaLayout({
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
