// Copia los assets (imágenes + PDFs) de cada vault → site/public/vault-assets/<id>/<relPath>.
// Corre en prebuild/predev. Las rutas se preservan para que el resolver las mapee
// y para que la biblioteca (/[vault]/biblioteca) sirva los PDFs por su relPath.
import fg from "fast-glob";
import { mkdir, copyFile } from "node:fs/promises";
import path from "node:path";

const REPO = path.resolve(process.cwd(), "..");
const OUT = path.join(process.cwd(), "public", "vault-assets");
const EXTS = ["svg", "png", "jpg", "jpeg", "gif", "webp", "pdf"];

// [id, dir] — debe coincidir con los vaults HABILITADOS de lib/content/vaults.ts
const VAULTS = [
  ["mna", "MNA"],
  ["derecho", "Derecho"],
  ["economia", "Economia"],
  ["proba", "Proba"],
  ["paw", "PAW"],
  ["sds", "SDS"],
  ["inge2", "Inge2"],
  ["fisica3", "Fisica3"],
];

let total = 0;
for (const [id, dir] of VAULTS) {
  const cwd = path.join(REPO, dir);
  const files = await fg(
    EXTS.map((e) => `**/*.${e}`),
    { cwd, ignore: ["**/.obsidian/**", "**/node_modules/**"], dot: false },
  );
  for (const rel of files) {
    const dest = path.join(OUT, id, rel);
    await mkdir(path.dirname(dest), { recursive: true });
    await copyFile(path.join(cwd, rel), dest);
    total++;
  }
}
console.log(`[copy-assets] ${total} assets → public/vault-assets/`);
