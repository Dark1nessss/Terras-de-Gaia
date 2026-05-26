import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
	title: "Política de Privacidade - Terras de Gaia",
	description: "Leia a nossa política de privacidade para entender como coletamos, usamos e protegemos suas informações pessoais.",
};

export default function politicaDePrivacidadeLayout({
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
