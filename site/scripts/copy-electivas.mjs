// Copia la app standalone de Electivas → site/public/electivas/.
// Es autocontenida (window.PLAN baked en data.js; rutas relativas), así que
// funciona tal cual bajo /StudyVaults/electivas/. Corre en prebuild/predev.
import { cp, rm } from "node:fs/promises";
import path from "node:path";

const SRC = path.resolve(process.cwd(), "..", "Electivas");
const DEST = path.join(process.cwd(), "public", "electivas");

await rm(DEST, { recursive: true, force: true });
await cp(SRC, DEST, { recursive: true });
console.log(`[copy-electivas] ${SRC} → public/electivas/`);
