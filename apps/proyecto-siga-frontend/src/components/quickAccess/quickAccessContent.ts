export const QUICK_ACCESS_CONTENT = {
  sectionTitle: "Tus pruebas",
  emptyMessage:
    "No tienes pruebas pendientes por ahora. Cuando tengas una nueva asignación, aparecerá aquí.",
  sectionHeaders: {
    in_progress: "CONTINÚA DONDE QUEDASTE",
    new: "RECIÉN ASIGNADA",
    pending_submit: "PENDIENTE POR ENVIAR",
  },
  statusLabels: {
    in_progress: "EN CURSO",
    new: "NUEVA",
    pending_submit: "PENDIENTE POR ENVIAR",
  },
  ctaLabels: {
    in_progress: "Continuar prueba",
    new: "Comenzar prueba",
    pending_submit: "Enviar prueba",
  },
  subtitles: {
    in_progress: (answered: number, total: number) =>
      `${answered} de ${total} preguntas respondidas`,
    new: (total: number) => `${total} preguntas · sin iniciar`,
    pending_submit: (total: number) => `${total} de ${total} preguntas respondidas`,
  },
} as const;
