import type { MetadataRoute } from "next";
import { getManifest } from "@/lib/content/manifest";
import { VAULTS } from "@/lib/content/vaults";
import { SITE_URL } from "@/lib/content/slug";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const m = await getManifest();
  const urls = [
    `${SITE_URL}/`,
    `${SITE_URL}/electivas/`,
    `${SITE_URL}/electivas/planificar/`,
    ...VAULTS.map((v) => `${SITE_URL}/${v.id}/`),
    // Rutas dedicadas por materia, derivadas de los flags de VAULTS.
    ...VAULTS.flatMap((v) => [
      ...(v.toolkit ? [`${SITE_URL}/${v.id}/herramientas/`] : []),
      ...(v.sheets ? [`${SITE_URL}/${v.id}/hojas/`] : []),
      ...(v.library ? [`${SITE_URL}/${v.id}/biblioteca/`] : []),
    ]),
    ...m.notes.filter((n) => !n.isIndex).map((n) => `${SITE_URL}${n.href}`),
  ];
  return urls.map((url) => ({ url }));
}
