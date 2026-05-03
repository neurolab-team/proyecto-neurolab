import { format, formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

export function formatDateLabel(value?: string | null, fallback = "Sin fecha") {
  if (!value) return fallback;
  return format(new Date(value), "d 'de' MMM yyyy", { locale: es });
}

export function formatDistanceLabel(value?: string | null, fallback = "Sin actividad") {
  if (!value) return fallback;
  return formatDistanceToNow(new Date(value), {
    addSuffix: true,
    locale: es,
  });
}
