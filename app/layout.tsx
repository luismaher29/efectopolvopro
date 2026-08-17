import type { Metadata } from "next";
import { Cormorant_Garamond, Montserrat } from "next/font/google";
import "./globals.css";

const display = Cormorant_Garamond({ variable: "--font-display", subsets: ["latin"], weight: ["500", "600", "700"] });
const sans = Montserrat({ variable: "--font-sans", subsets: ["latin"], weight: ["400", "500", "600", "700"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://efecto-polvo-pro.vercel.app"),
  title: "Efecto Polvo PRO | Entrenamiento profesional PMU",
  description: "Evalúa y fortalece tu dominio de la técnica de cejas efecto polvo.",
  openGraph: {
    title: "Efecto Polvo PRO",
    description: "De la técnica a la maestría.",
    images: [{ url: "/og.png", width: 1536, height: 1024, alt: "Efecto Polvo PRO - De la técnica a la maestría" }],
  },
  twitter: { card: "summary_large_image", title: "Efecto Polvo PRO", description: "De la técnica a la maestría.", images: ["/og.png"] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body className={`${display.variable} ${sans.variable}`}>{children}</body></html>;
}
