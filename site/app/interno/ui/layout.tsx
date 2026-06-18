import type { Metadata } from "next";
import type { ReactNode } from "react";

// Página interna del sistema de diseño — no se indexa ni se enlaza.
export const metadata: Metadata = {
  title: "Sistema de diseño · interno",
  robots: { index: false, follow: false },
};

export default function InternoLayout({ children }: { children: ReactNode }) {
  return children;
}
