"use client";

import ChangePasswordModal from "../modal/auth/ChangePasswordModal";
import { useAuth } from "../../hooks/useAuth";

/**
 * Pantalla que sustituye a todo el contenido privado cuando la cuenta arrastra
 * una contraseña temporal.
 *
 * El backend rechaza cualquier petición de estos usuarios salvo consultar su
 * perfil, cambiar la contraseña y cerrar sesión. Sin esta pantalla el usuario
 * vería el panel de siempre lleno de errores 403 si cerrara el modal que
 * aparece tras el login, así que aquí el cambio es la única salida además de
 * cerrar sesión.
 */
export default function PasswordChangeGate() {
  const auth = useAuth();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-2xl font-bold text-[#102D69]">
        Debes actualizar tu contraseña
      </h1>
      <p className="mt-2 max-w-md text-sm text-gray-600">
        Por seguridad institucional, tienes que reemplazar la contraseña temporal
        que recibiste por correo antes de usar la plataforma.
      </p>

      <ChangePasswordModal isOpen onClose={() => void auth.logout()} />
    </main>
  );
}
