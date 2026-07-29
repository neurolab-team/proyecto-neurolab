import { randomInt } from "crypto";

/**
 * Generación de contraseñas temporales para cuentas de staff.
 * El alfabeto excluye caracteres ambiguos (I, l, O, 0, 1) porque estas
 * contraseñas se envían por correo y se transcriben a mano.
 */
const PASSWORD_ALPHABET =
  "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%&*";

const DEFAULT_LENGTH = 12;

export const generateSecurePassword = async (
  length: number = DEFAULT_LENGTH
): Promise<string> => {
  let password = "";
  for (let i = 0; i < length; i++) {
    password += PASSWORD_ALPHABET.charAt(
      randomInt(0, PASSWORD_ALPHABET.length)
    );
  }
  return password;
};
