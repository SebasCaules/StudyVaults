import type { Metadata } from "next";
import { Newsreader, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import AmbientLayer from "@/components/portal/AmbientLayer";
import Navbar from "@/components/portal/Navbar";
import Footer from "@/components/portal/Footer";

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
  title: {
    default: "StudyVaults ITBA",
    template: "%s · StudyVaults ITBA",
  },
  description:
    "Bases de conocimiento de materias del ITBA: teoría, guías y parciales destilados en un wiki navegable. Más un planificador de electivas.",
};

// Anti-flash: fija data-theme antes de pintar (default dark de marca;
// honra el preferido del sistema solo si no hay elección guardada).
const THEME_INIT = `(function(){try{var s=localStorage.getItem('sv-theme');var t=(s==='light'||s==='dark')?s:(window.matchMedia&&window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark');document.documentElement.setAttribute('data-theme',t);}catch(e){document.documentElement.setAttribute('data-theme','dark');}})();`;

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
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT }} />
        <a className="skip-link" href="#main">
          Saltar al contenido
        </a>
        <AmbientLayer />
        <Navbar />
        <main id="main" className="page flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
