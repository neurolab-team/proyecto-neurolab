import ejs from "ejs";
import { existsSync } from "fs";
import path from "path";

/**
 * Renderizado de plantillas de correo (EJS).
 *
 * La ubicación de `templates/` cambia según cómo se ejecute el backend:
 *   - Producción: esbuild bundlea todo a `dist/main.js` y copia las plantillas
 *     a `dist/templates` (ver "assets" en el package.json del backend), así que
 *     quedan al lado del bundle.
 *   - Desarrollo: tsx ejecuta este archivo desde `src/services/mail/`, con las
 *     plantillas dos niveles arriba en `src/templates`.
 *
 * En lugar de decidir por `NODE_ENV` (que acopla el layout de archivos a una
 * variable de entorno y se rompe al mover el archivo de carpeta), se prueban
 * los candidatos y se usa el primero que exista. El resultado se cachea.
 */
const CANDIDATE_TEMPLATE_DIRS = [
  path.resolve(__dirname, "templates"),
  path.resolve(__dirname, "..", "..", "templates"),
];

let cachedTemplatesDir: string | null = null;

const resolveTemplatesDir = (): string => {
  if (cachedTemplatesDir) return cachedTemplatesDir;

  const found = CANDIDATE_TEMPLATE_DIRS.find((dir) =>
    existsSync(path.join(dir, "email"))
  );

  if (!found) {
    throw new Error(
      `[email] No se encontró el directorio de plantillas. Rutas probadas: ${CANDIDATE_TEMPLATE_DIRS.join(
        ", "
      )}`
    );
  }

  cachedTemplatesDir = found;
  return found;
};

export const renderEmailTemplate = async (
  templateName: string,
  data: Record<string, unknown>
): Promise<string> => {
  const templatePath = path.join(
    resolveTemplatesDir(),
    "email",
    `${templateName}.ejs`
  );

  return ejs.renderFile(templatePath, data);
};
