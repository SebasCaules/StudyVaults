// Copia las "páginas personales" sueltas de las vaults (HTML autocontenido,
// restilizado a la estética §12 del portal) → site/public/apps/<vault>/.
// El pipeline de contenido solo renderiza .md y copy-assets solo copia imágenes,
// así que estos .html quedarían huérfanos: este script los publica como assets
// estáticos. Se enlazan desde las landings vía cfg.apps (lib/content/vaults.ts),
// siempre con withBase(). Corre en prebuild/predev.
import { cp, rm, mkdir } from "node:fs/promises";
import path from "node:path";

const REPO = path.resolve(process.cwd(), "..");
const DEST_ROOT = path.join(process.cwd(), "public", "apps");

// [vaultId, [archivos fuente relativos al dir del vault]]
// Debe coincidir con los cfg.apps de lib/content/vaults.ts.
// Derecho consolidó sus tres apps HTML en el toolkit React
// (components/vault-tools/DerechoTools.tsx), así que ya no se copian sueltas.
const APPS = [["sds", "SDS", ["wiki/tps/TP4_previsualizacion.html"]]];

await rm(DEST_ROOT, { recursive: true, force: true });

let total = 0;
for (const [id, dir, files] of APPS) {
  const destDir = path.join(DEST_ROOT, id);
  await mkdir(destDir, { recursive: true });
  for (const rel of files) {
    const src = path.join(REPO, dir, rel);
    const dest = path.join(destDir, path.basename(rel));
    await cp(src, dest);
    total++;
  }
}
console.log(`[copy-vault-apps] ${total} apps → public/apps/`);
