import type { Metadata } from "next";
import { Newsreader, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeScript } from "@studyvaults/ui";
import AmbientLayer from "@/components/portal/AmbientLayer";
import Navbar from "@/components/portal/Navbar";
import ConditionalFooter from "@/components/portal/ConditionalFooter";
import SearchModal from "@/components/SearchModal";
import { SITE_URL } from "@/lib/content/slug";

// Display/body serif + mono labels (self-hosted by next/font).
const newsreader = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500", "600"],
  variable: "--font-newsreader",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(`${SITE_URL}/`),
  title: {
    default: "StudyVaults ITBA",
    template: "%s · StudyVaults ITBA",
  },
  description:
    "Bases de conocimiento de materias del ITBA: teoría, guías y parciales destilados en un wiki navegable. Más un planificador de electivas.",
  openGraph: {
    type: "website",
    siteName: "StudyVaults ITBA",
    locale: "es_AR",
    title: "StudyVaults ITBA",
    description:
      "Siete materias del ITBA como wiki navegable: teoría, guías y parciales. Más un planificador de electivas.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      data-theme="dark"
      suppressHydrationWarning
      className={`${newsreader.variable} ${jetbrains.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeScript />
        <a className="skip-link" href="#main">
          Saltar al contenido
        </a>
        <AmbientLayer />
        <Navbar />
        <SearchModal />
        <main id="main" className="page flex-1">
          {children}
        </main>
        <ConditionalFooter />
      </body>
    </html>
  );
}
