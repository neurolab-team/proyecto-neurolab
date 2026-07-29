import { logger } from "../../../utils/logger";

/**
 * Presets de conexión SMTP por proveedor.
 *
 * Este archivo solo resuelve *parámetros de conexión y credenciales* SMTP.
 * La elección del proveedor (y de si se usa SMTP o cualquier otro mecanismo)
 * vive en `emailProviderFactory.ts`.
 *
 * Resolución de configuración (en orden de prioridad):
 *   1. Overrides explícitos: `SMTP_HOST` / `SMTP_PORT` / `SMTP_SECURE`.
 *   2. Preset del proveedor seleccionado en `EMAIL_PROVIDER`.
 *
 * OJO: si `SMTP_HOST` está definido en el `.env`, anula el host del preset.
 * Para que `EMAIL_PROVIDER` gobierne de verdad, dejá esos overrides sin
 * definir y usalos solo cuando necesites un endpoint distinto al del preset
 * (por ejemplo una región de SES que no sea us-east-1).
 */

export type SmtpPresetName = "gmail" | "ses";

export interface SmtpConnection {
  host: string;
  port: number;
  secure: boolean;
}

export interface SmtpConfig extends SmtpConnection {
  auth: {
    user: string;
    password: string;
  };
  /** Remitente ya formateado, listo para el campo `from`. */
  from: string;
}

/**
 * Presets de conexión por proveedor.
 *
 * `ses.host` asume la región us-east-1. Si el endpoint SES real usa otra
 * región, definí `SMTP_HOST` en el entorno en lugar de editar este archivo.
 *
 * `authUserIsSender` distingue cómo cada proveedor determina el remitente:
 *   - Gmail: `SMTP_USER` *es* la dirección de la cuenta, y el servidor solo
 *     acepta enviar como esa cuenta (o un alias verificado). `SMTP_FROM_EMAIL`
 *     es redundante, así que es opcional.
 *   - SES: `SMTP_USER` es una credencial IAM, no un correo, así que hace falta
 *     un `SMTP_FROM_EMAIL` verificado en la cuenta de SES.
 */
interface SmtpPreset extends SmtpConnection {
  authUserIsSender: boolean;
}

const PRESETS: Record<SmtpPresetName, SmtpPreset> = {
  gmail: {
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Gmail usa STARTTLS en el puerto 587
    authUserIsSender: true,
  },
  ses: {
    host: "email-smtp.us-east-1.amazonaws.com",
    port: 587,
    secure: false, // SES SMTP usa STARTTLS en el puerto 587
    authUserIsSender: false,
  },
};

export const SMTP_PRESET_NAMES = Object.keys(PRESETS) as SmtpPresetName[];

export const isSmtpPreset = (value: string): value is SmtpPresetName =>
  Object.prototype.hasOwnProperty.call(PRESETS, value);

const requireEnv = (env: NodeJS.ProcessEnv, key: string): string => {
  const value = env[key]?.trim();
  if (!value) {
    throw new Error(
      `[email] Falta la variable de entorno ${key}, requerida por el proveedor SMTP. ` +
        `Definila en el entorno o usá EMAIL_PROVIDER=console para desarrollo sin envío real.`
    );
  }
  return value;
};

const resolveConnection = (
  preset: SmtpPresetName,
  env: NodeJS.ProcessEnv
): SmtpConnection => {
  const defaults = PRESETS[preset];

  return {
    host: env.SMTP_HOST?.trim() || defaults.host,
    port: Number(env.SMTP_PORT) || defaults.port,
    secure:
      env.SMTP_SECURE !== undefined
        ? env.SMTP_SECURE.trim() === "true"
        : defaults.secure,
  };
};

/**
 * Resuelve la dirección remitente.
 *
 * Prioridad:
 *   1. `SMTP_FROM_EMAIL` explícito (vale para cualquier proveedor).
 *   2. `SMTP_USER`, solo en proveedores donde la cuenta autenticada es el
 *      remitente (Gmail). Así no hace falta duplicar el correo en dos variables.
 *   3. Error de configuración.
 *
 * `SMTP_FROM_NAME` es siempre opcional; sin él se envía solo la dirección.
 */
const resolveFromAddress = (
  preset: SmtpPresetName,
  env: NodeJS.ProcessEnv
): string => {
  const explicitFrom = env.SMTP_FROM_EMAIL?.trim();
  const authUser = env.SMTP_USER?.trim();
  const { authUserIsSender } = PRESETS[preset];

  if (!explicitFrom && !authUserIsSender) {
    throw new Error(
      `[email] El proveedor "${preset}" requiere SMTP_FROM_EMAIL: su SMTP_USER es una ` +
        `credencial, no una dirección de correo. Usá un remitente verificado en el proveedor.`
    );
  }

  const fromEmail = explicitFrom || authUser;

  if (!fromEmail) {
    throw new Error(
      `[email] No se pudo determinar el remitente para "${preset}": definí SMTP_FROM_EMAIL o SMTP_USER.`
    );
  }

  // Aviso, no error: el remitente explícito puede ser un alias legítimamente
  // verificado. Pero si no lo es, el proveedor rechaza o reescribe el envío, y
  // ese fallo es difícil de diagnosticar sin esta pista. Caso típico: quedó en
  // el .env el SMTP_FROM_EMAIL de otro proveedor tras cambiar EMAIL_PROVIDER.
  if (authUserIsSender && explicitFrom && authUser && explicitFrom !== authUser) {
    logger.warn(
      `[email] SMTP_FROM_EMAIL (${explicitFrom}) no coincide con SMTP_USER (${authUser}). ` +
        `El proveedor "${preset}" solo permite enviar como la cuenta autenticada o un alias verificado.`
    );
  }

  const fromName = env.SMTP_FROM_NAME?.trim();

  return fromName ? `"${fromName}" <${fromEmail}>` : `<${fromEmail}>`;
};

/**
 * Resuelve la configuración SMTP completa. Recibe el entorno explícitamente
 * para no depender de globals y falla de inmediato si falta un secreto, en
 * lugar de descubrirlo al primer envío.
 */
export const resolveSmtpConfig = (
  preset: SmtpPresetName,
  env: NodeJS.ProcessEnv
): SmtpConfig => ({
  ...resolveConnection(preset, env),
  auth: {
    user: requireEnv(env, "SMTP_USER"),
    password: requireEnv(env, "SMTP_PASSWORD"),
  },
  from: resolveFromAddress(preset, env),
});
