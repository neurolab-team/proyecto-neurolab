import { IEmailProvider } from "../../../contracts/mail/IemailProvider";
import { ConsoleEmailProvider } from "./consoleEmailProvider";
import { SmtpEmailProvider } from "./smtpEmailProvider";
import {
  SMTP_PRESET_NAMES,
  SmtpPresetName,
  isSmtpPreset,
  resolveSmtpConfig,
} from "./smtpPresets";

/**
 * Único punto de decisión sobre qué proveedor de correo usa la aplicación.
 *
 * Para agregar un proveedor nuevo (Resend, Postmark, la API de SES, etc.):
 *   1. Crear `providers/<nombre>EmailProvider.ts` implementando `IEmailProvider`.
 *   2. Agregar su caso acá.
 *   3. Definir sus variables de entorno.
 * Nada más cambia: los servicios que envían correos dependen del puerto.
 */
export type EmailProviderName = SmtpPresetName | "console";

const DEFAULT_PROVIDER: EmailProviderName = "ses";

const AVAILABLE_PROVIDERS: EmailProviderName[] = [
  ...SMTP_PRESET_NAMES,
  "console",
];

const resolveProviderName = (env: NodeJS.ProcessEnv): EmailProviderName => {
  const requested = env.EMAIL_PROVIDER?.trim().toLowerCase();

  if (!requested) return DEFAULT_PROVIDER;

  if (requested !== "console" && !isSmtpPreset(requested)) {
    // Falla explícita en lugar de degradar en silencio a otro proveedor: con
    // credenciales de un proveedor y el host de otro, el envío falla en
    // runtime y el error es mucho más difícil de diagnosticar.
    throw new Error(
      `[email] EMAIL_PROVIDER="${requested}" no es válido. ` +
        `Valores admitidos: ${AVAILABLE_PROVIDERS.join(" | ")}.`
    );
  }

  return requested as EmailProviderName;
};

export const createEmailProvider = (env: NodeJS.ProcessEnv): IEmailProvider => {
  const provider = resolveProviderName(env);

  if (provider === "console") {
    return new ConsoleEmailProvider();
  }

  return new SmtpEmailProvider(provider, resolveSmtpConfig(provider, env));
};
