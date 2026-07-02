"use client";

import { useRouter } from "next/navigation";
import { PublicTestCard } from "@packages/common-types/test.types";
import { useAuth } from "../../hooks/useAuth";
import { useModal } from "../../hooks/useModal";
import { getCardPresentation } from "./landingCardPresentation";

type TestCardProps = {
  test: PublicTestCard;
};

export default function TestCard({ test }: TestCardProps) {
  const presentation = getCardPresentation(test.testCode);
  const { user } = useAuth();
  const { openModal } = useModal();
  const router = useRouter();

  // Gating (US4) + no romper flujo autenticado (US6):
  // - Sin sesión: abrir el modal de login (la previsualización no expone el test).
  // - Con sesión: llevar al área de pruebas del usuario.
  const handleActivate = () => {
    if (user) {
      router.push("/panel/assignmentTest");
      return;
    }
    openModal("login");
  };

  return (
    <button
      type="button"
      onClick={handleActivate}
      className="group flex h-full w-full flex-col rounded-2xl border border-slate-100 bg-white p-6 text-left shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
      style={{ borderTopColor: presentation.bgColor, borderTopWidth: 4 }}
      aria-label={`Previsualización de ${test.title}. Inicia sesión para resolver la prueba.`}
    >
      <span
        className="text-xs font-bold uppercase tracking-wide"
        style={{ color: presentation.accentColor }}
      >
        {presentation.categoryLabel}
      </span>

      <h3 className="mt-3 flex-1 text-lg font-semibold leading-snug text-[#001d4e]">
        {test.title}
      </h3>

      {test.description && (
        <p className="mt-2 line-clamp-3 text-sm text-slate-500">
          {test.description}
        </p>
      )}

      <span className="mt-4 inline-flex items-center text-sm font-medium text-slate-400">
        {presentation.scaleName}
      </span>
    </button>
  );
}
