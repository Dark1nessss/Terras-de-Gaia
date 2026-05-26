import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
	title: "Termos de Utilização - Terras de Gaia",
	description: "Leia os termos de utilização do Terras de Gaia, incluindo nossas políticas de privacidade e diretrizes para o uso do nosso conteúdo.",
};

export default function termosDeUtilizacaoLayout({
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
