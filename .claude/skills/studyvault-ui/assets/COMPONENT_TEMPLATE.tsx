// ============================================================
// PLANTILLA de componente de @studyvaults/ui.
// Copiala a src/<categoria>/<Componente>.tsx y adaptala.
// Borrá las ramas/comentarios que no apliquen.
//
// Recordá:
//  · "use client" SOLO si usás hooks/refs/DOM/eventos del cliente
//    (presentacionales puros NO lo llevan → borrá la línea de abajo).
//  · cn() desde "../cn" (NO clsx). className SIEMPRE se reenvía.
//  · named export + default export.
//  · cero hex hardcodeado: el estilo va en src/styles/<componente>.css
//    con tokens de rol; agregá su @import a src/styles/index.css.
//  · registrá el componente en src/index.ts y en /interno/ui.
// ============================================================

// "use client"; // ← descomentá SOLO si usás hooks/refs/DOM

import type { ReactNode, HTMLAttributes } from "react";
import { cn } from "../cn";
// Reutilizá tipos del DS cuando apliquen, en vez de redefinir strings:
// import type { ButtonVariant, BadgeVariant, ReadoutTone, VaultId } from "../tokens";

/**
 * Componente — qué es en una frase, y la clase CSS base que usa
 * (`.componente`). Soporta dark/light por tokens de rol y reenvía
 * `className` + props nativas.
 *
 * @example
 *   <Componente>contenido</Componente>
 *   <Componente className="extra" data-foo="bar" />
 */
interface CommonProps {
  /** Contenido del componente. */
  children: ReactNode;
  /** Clase extra; se mergea con la clase base vía cn(). */
  className?: string;
  // variant?: ButtonVariant; // ← ejemplo: variante tipada desde tokens.ts
}

// Props = props propias + props nativas del elemento (spread con ...rest).
type ComponenteProps = CommonProps &
  Omit<HTMLAttributes<HTMLDivElement>, keyof CommonProps>;

export function Componente({ className, children, ...rest }: ComponenteProps) {
  const classes = cn("componente", className);
  return (
    <div className={classes} {...rest}>
      {children}
    </div>
  );
}

export default Componente;

// ============================================================
// VARIANTE: componente link-polimórfico (patrón Button/Card/ToolCard).
// Si tu componente puede ser un link, usá este esqueleto en su lugar:
// ============================================================
//
// import Link from "next/link";
// import type { ReactNode, HTMLAttributes, AnchorHTMLAttributes } from "react";
// import { cn } from "../cn";
//
// interface CommonProps {
//   href?: string;
//   /** Renderiza un <a> externo (target _blank) en vez de next/link. */
//   external?: boolean;
//   children: ReactNode;
//   className?: string;
// }
//
// type LinkishProps = CommonProps &
//   Omit<HTMLAttributes<HTMLDivElement>, keyof CommonProps> &
//   Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof CommonProps>;
//
// export function Linkish({ href, external, className, children, ...rest }: LinkishProps) {
//   const classes = cn("linkish", className);
//
//   if (href && external) {
//     return (
//       <a href={href} target="_blank" rel="noopener noreferrer" className={classes}
//          {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}>
//         {children}
//       </a>
//     );
//   }
//   if (href) {
//     return (
//       <Link href={href} className={classes}
//             {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}>
//         {children}
//       </Link>
//     );
//   }
//   return (
//     <div className={classes} {...(rest as HTMLAttributes<HTMLDivElement>)}>
//       {children}
//     </div>
//   );
// }
//
// export default Linkish;
//
// ============================================================
// VARIANTE: overlay accesible (patrón Modal/Drawer).
// Lleva "use client" y reusa el hook compartido useDismissable
// (focus-trap + scroll-lock + restauración de foco + Escape).
// ============================================================
//
// "use client";
// import { useId, type ReactNode, type HTMLAttributes } from "react";
// import { cn } from "../cn";
// import { useDismissable } from "./useDismissable";
//
// export interface OverlayProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
//   open: boolean;
//   onClose: () => void;
//   title?: ReactNode;
//   children: ReactNode;
//   className?: string;
// }
//
// export function Overlay({ open, onClose, title, children, className, ...rest }: OverlayProps) {
//   const panelRef = useDismissable(open, onClose);
//   const titleId = useId();
//   if (!open) return null;
//   return (
//     <div className="sv-overlay sv-overlay--center" onClick={onClose}>
//       <div
//         ref={panelRef}
//         tabIndex={-1}
//         role="dialog"
//         aria-modal="true"
//         aria-labelledby={title !== undefined ? titleId : undefined}
//         className={cn("sv-overlay-panel", className)}
//         onClick={(e) => e.stopPropagation()}
//         {...rest}
//       >
//         {title !== undefined && <h2 id={titleId}>{title}</h2>}
//         {children}
//       </div>
//     </div>
//   );
// }
//
// export default Overlay;
