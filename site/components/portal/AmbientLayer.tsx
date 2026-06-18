"use client";

import { usePathname } from "next/navigation";
import { AmbientLayer } from "@studyvaults/ui";

// En el home el grafo es el objeto focal → se deshabilita el ambient.
// La capa en sí (gradiente + canvas de partículas) vive en @studyvaults/ui.
export default function AppAmbientLayer() {
  const pathname = usePathname();
  return <AmbientLayer disabled={pathname === "/"} />;
}
