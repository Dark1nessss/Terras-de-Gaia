import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
	title: "Contacto - Terras de Gaia",
	description: "Entre em contacto connosco para qualquer dúvida, sugestão ou comentário sobre Terras de Gaia.",
};

export default function contactoLayout({
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
