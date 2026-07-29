/**
 * Resolución y reenvío de la IP real del cliente hacia el backend.
 *
 * Los route handlers de Next actúan como BFF: hablan con el backend por HTTP
 * desde el contenedor del frontend. Si no reenviamos la IP del cliente, Express
 * ve siempre la misma dirección (la del contenedor) y cualquier limitador de
 * peticiones basado en IP se convierte en un limitador global compartido por
 * todos los usuarios.
 *
 * El backend corre con `trust proxy: 1`, así que toma la última entrada de
 * X-Forwarded-For. Por eso enviamos una sola dirección: la del cliente.
 */

const UNKNOWN_IP = "unknown";

const isUsableIp = (value: string | undefined | null): value is string =>
  typeof value === "string" &&
  value.trim().length > 0 &&
  value.trim().toLowerCase() !== UNKNOWN_IP;

/**
 * Obtiene la IP del cliente a partir de las cabeceras que inyecta el proxy
 * inverso situado delante de Next. Se toma la entrada más a la izquierda de
 * X-Forwarded-For, que es el cliente original.
 */
export const getClientIp = (request: Request): string | null => {
  const forwardedFor = request.headers.get("x-forwarded-for");

  if (isUsableIp(forwardedFor)) {
    const [clientIp] = forwardedFor.split(",");
    if (isUsableIp(clientIp)) {
      return clientIp.trim();
    }
  }

  const realIp = request.headers.get("x-real-ip");
  return isUsableIp(realIp) ? realIp.trim() : null;
};

/**
 * Cabeceras a añadir en las llamadas al backend para que los limitadores por IP
 * vean al cliente y no al contenedor del frontend. Si no se puede resolver la
 * IP se devuelve un objeto vacío: es mejor que el backend caiga a la IP del
 * socket que enviar un valor inventado.
 */
export const buildForwardedForHeaders = (
  request: Request,
): Record<string, string> => {
  const clientIp = getClientIp(request);
  return clientIp ? { "x-forwarded-for": clientIp } : {};
};
