import type { HTMLAttributes } from "react";
import { cn } from "../cn";

/**
 * CodeBlock — bloque de código `.vtool-code` (un `<pre>` con tipografía
 * mono, fondo oscuro fijo y `white-space: pre`). Recibe el código como
 * `children` (string); la indentación se respeta tal cual.
 *
 * @example
 *   <CodeBlock>{`SELECT * FROM alumnos\nWHERE promedio >= 8;`}</CodeBlock>
 */
interface CommonProps {
  /** Código a mostrar (string crudo, sin escapar). */
  children: string;
  className?: string;
}

export type CodeBlockProps = CommonProps &
  Omit<HTMLAttributes<HTMLPreElement>, keyof CommonProps>;

export function CodeBlock({ children, className, ...rest }: CodeBlockProps) {
  return (
    <pre className={cn("vtool-code", className)} {...rest}>
      {children}
    </pre>
  );
}

export default CodeBlock;
