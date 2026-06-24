import type { ReactNode } from "react";
import { COLORS } from "./landingContent";

type LandingSectionProps = {
  children: ReactNode;
  id?: string;
  /** Fondo de la sección. */
  background?: "white" | "surface";
  className?: string;
};

/**
 * Wrapper estándar de una sección de la landing: aplica el ancho máximo,
 * el padding vertical y el fondo consistentes. Evita repetir
 * `max-w-7xl mx-auto px-6 py-20` en cada sección (DRY).
 */
export default function LandingSection({
  children,
  id,
  background = "white",
  className = "",
}: LandingSectionProps) {
  const bg = background === "surface" ? COLORS.surface : "#FFFFFF";

  return (
    <section id={id} className="w-full px-6 py-20" style={{ backgroundColor: bg }}>
      <div className={`max-w-7xl mx-auto ${className}`}>{children}</div>
    </section>
  );
}
