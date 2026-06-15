"use client";

import { usePathname } from "next/navigation";
import Footer from "./Footer";

// El planner (/electivas) es una app full-height: ocultamos el Footer del portal.
export default function ConditionalFooter() {
  const pathname = usePathname();
  if (pathname?.startsWith("/electivas")) return null;
  return <Footer />;
}
