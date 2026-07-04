// UseWithClaude — panel "Descargá esta materia y estudiala con IA" que va al pie
// de la landing de cada vault. Cada materia es una carpeta de notas .md (un vault
// de Obsidian): este bloque le da al estudiante los comandos exactos para bajarse
// SOLO esa carpeta (degit) o el repo entero (git) y abrirla con Claude Code (o
// cualquier agente / Obsidian / Cursor) para estudiar CON este material.
// Server component: no usa hooks ni APIs de cliente — Tabs y CopyButton ya son
// islas client por su cuenta. El CSS vive afuera; acá sólo se emiten las clases
// del contrato `.vl-claude` / `.vl-cmd`.

import { Tabs, CopyButton, Note } from "@studyvaults/ui";

const REPO = "SebasCaules/StudyVaults"; // repo público real

// Un comando con su botón de copiar. `cmd` puede ser multilínea (git: clone + cd).
function CmdBlock({
  cmd,
  copyLabel,
  copiedLabel,
}: {
  cmd: string;
  copyLabel: string;
  copiedLabel: string;
}) {
  return (
    <div className="vl-cmd">
      <pre className="vl-cmd__code">{cmd}</pre>
      <CopyButton
        text={cmd}
        label={copyLabel}
        copiedLabel={copiedLabel}
        className="vl-cmd__copy"
      />
    </div>
  );
}

export default function UseWithClaude({
  vault,
  dir,
  name,
  short,
  lang,
}: {
  vault: string; // id del vault, ej "mna"
  dir: string; // carpeta en el repo, ej "MNA"
  name: string; // nombre completo, ej "Métodos Numéricos Avanzados"
  short: string; // etiqueta corta, ej "MNA"
  lang: "es" | "en";
}) {
  const en = lang === "en";
  const folder = `studyvaults-${vault}`; // carpeta destino

  // degit baja SOLO la subcarpeta de la materia, sin historial git.
  const degitCmd = `npx degit ${REPO}/${dir} ${folder}`;
  // git clona el repo entero (shallow) y entra a la carpeta de la materia.
  const gitCmd = `git clone --depth 1 https://github.com/${REPO}.git\ncd StudyVaults/${dir}`;
  // Parado en la carpeta que bajaste con degit, abrís Claude Code.
  const claudeCmd = `cd ${folder}\nclaude`;

  const t = en
    ? {
        kicker: "guide // take it with you",
        title: "Download it and study with AI",
        lead: `Every subject is a folder of plain ${".md"} notes — an Obsidian vault. Download it and point Claude Code (or any agent, or Obsidian itself) at the folder so it studies with you using exactly this material.`,
        step1: "Download the subject",
        step2: "Open it with Claude Code",
        step3: "Ask it for whatever you need",
        degitTab: "degit · fast",
        copy: "copy",
        copied: "copied",
        note: `You get a folder of ${".md"} notes — an Obsidian vault. No account, no build step.`,
        prompts: [
          `Read index.md and build me a 1-week study plan from this material.`,
          `Explain the hardest topic in ${short} using only the notes in this vault, with a worked example.`,
          `Quiz me on ${name} from these notes and grade my answers step by step.`,
        ],
        foot: "Works the same with Obsidian (open the folder as a vault), Cursor or any other agent.",
      }
    : {
        kicker: "guía // llevátela",
        title: "Descargala y estudiala con IA",
        lead: `Cada materia es una carpeta de notas ${".md"} — un vault de Obsidian. Bajala y apuntá Claude Code (o cualquier agente, o el propio Obsidian) a la carpeta para que estudie CON vos usando exactamente este material.`,
        step1: "Bajá la materia",
        step2: "Abrila con Claude Code",
        step3: "Pedile lo que necesites",
        degitTab: "degit · rápido",
        copy: "copiar",
        copied: "copiado",
        note: `Te bajás una carpeta de notas ${".md"} — un vault de Obsidian. Sin cuenta ni build.`,
        prompts: [
          `Leé el index.md y armame un plan de estudio de 1 semana con este material.`,
          `Explicame el tema más difícil de ${short} usando solo las notas de este vault, con un ejemplo resuelto.`,
          `Tomame un parcial de ${name} a partir de estas notas y corregímelo paso a paso.`,
        ],
        foot: "Funciona igual con Obsidian (abrí la carpeta como vault), Cursor u otros agentes.",
      };

  return (
    <section className="vl-claude" id="usar-con-ia" data-vault={vault}>
      <header className="vl-sec__head">
        <span className="vl-sec__kicker">{t.kicker}</span>
        <h2 className="vl-sec__title">{t.title}</h2>
        <p className="vl-sec__lead">{t.lead}</p>
      </header>

      <div className="vl-claude__grid">
        {/* COLUMNA IZQUIERDA: paso 1, descargar */}
        <div className="vl-claude__col">
          <div className="vl-claude__step-head">
            <span className="vl-claude__step-n">1</span>
            <h3 className="vl-claude__step-title">{t.step1}</h3>
          </div>
          <Tabs
            tabs={[
              { id: "degit", label: t.degitTab },
              { id: "git", label: "git" },
            ]}
            defaultValue="degit"
            panels={{
              degit: (
                <CmdBlock cmd={degitCmd} copyLabel={t.copy} copiedLabel={t.copied} />
              ),
              git: (
                <CmdBlock cmd={gitCmd} copyLabel={t.copy} copiedLabel={t.copied} />
              ),
            }}
          />
          <Note>{t.note}</Note>
        </div>

        {/* COLUMNA DERECHA: pasos 2 y 3, usar */}
        <div className="vl-claude__col">
          <div className="vl-claude__step-head">
            <span className="vl-claude__step-n">2</span>
            <h3 className="vl-claude__step-title">{t.step2}</h3>
          </div>
          <CmdBlock cmd={claudeCmd} copyLabel={t.copy} copiedLabel={t.copied} />

          <div className="vl-claude__step-head">
            <span className="vl-claude__step-n">3</span>
            <h3 className="vl-claude__step-title">{t.step3}</h3>
          </div>
          <ul className="vl-claude__prompts">
            {t.prompts.map((p) => (
              <li key={p} className="vl-claude__prompt">
                {p}
              </li>
            ))}
          </ul>
          <p className="vl-claude__foot">{t.foot}</p>
        </div>
      </div>
    </section>
  );
}
