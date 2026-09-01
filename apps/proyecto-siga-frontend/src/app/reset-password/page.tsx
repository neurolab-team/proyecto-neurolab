"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FormErrorBanner from "@/components/FormErrorBanner";
import { authService } from "@/services/auth/auth";
import { getApiErrorMessage } from "@/libs/getApiErrorMessage";

type ResetPasswordFormData = {
  newPassword: string;
  confirmPassword: string;
};

const MISSING_TOKEN_MESSAGE =
  "El enlace de restablecimiento es inválido. Solicita uno nuevo desde el inicio de sesión.";

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const token = useMemo(() => searchParams?.get("token") ?? "", [searchParams]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordFormData>();

  // A diferencia de la verificación de correo, el enlace NO se comprueba al
  // montar la página: cada comprobación fallida consume cuota del contador de
  // enlaces inválidos del backend, y abrir el enlace no debería gastarla. La
  // validez se descubre al enviar el formulario.
  const resetPasswordMutation = useMutation({
    mutationFn: async (newPassword: string) => {
      return authService.resetPassword({ token, newPassword });
    },
  });

  const onSubmit = (data: ResetPasswordFormData) => {
    resetPasswordMutation.mutate(data.newPassword);
  };

  const hasToken = token.length > 0;

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F7FB]">
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-xl px-4 py-12 sm:px-6 lg:px-8">
          <section className="rounded-[2rem] bg-white p-8 shadow-sm">
            <h1 className="text-3xl font-bold text-[#102D69] text-center">
              Nueva contraseña
            </h1>

            {!hasToken && (
              <>
                <p className="mt-4 text-center text-slate-600">
                  {MISSING_TOKEN_MESSAGE}
                </p>
                <div className="mt-8 text-center">
                  <Link
                    href="/"
                    className="inline-flex rounded-xl bg-gradient-to-r from-[#102D69] to-[#00A0B7] px-5 py-3 text-sm font-semibold text-white"
                  >
                    Volver al inicio
                  </Link>
                </div>
              </>
            )}

            {hasToken && resetPasswordMutation.isSuccess && (
              <>
                <p
                  className="mt-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800"
                  role="status"
                >
                  {resetPasswordMutation.data?.message ||
                    "Contraseña restablecida. Ya puedes iniciar sesión."}
                </p>
                <p className="mt-4 text-sm text-slate-600">
                  Por seguridad cerramos todas las sesiones que tenías abiertas
                  en otros dispositivos.
                </p>
                <div className="mt-8 text-center">
                  <Link
                    href="/"
                    className="inline-flex rounded-xl bg-gradient-to-r from-[#102D69] to-[#00A0B7] px-5 py-3 text-sm font-semibold text-white"
                  >
                    Ir a iniciar sesión
                  </Link>
                </div>
              </>
            )}

            {hasToken && !resetPasswordMutation.isSuccess && (
              <>
                <p className="mt-4 text-center text-slate-600">
                  Elige una contraseña nueva para tu cuenta.
                </p>

                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="mt-8 space-y-4"
                >
                  <div>
                    <label
                      htmlFor="newPassword"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Nueva Contraseña
                    </label>
                    <input
                      id="newPassword"
                      type="password"
                      autoComplete="new-password"
                      {...register("newPassword", {
                        required: "Contraseña requerida",
                        minLength: {
                          value: 6,
                          message:
                            "La contraseña debe tener al menos 6 caracteres",
                        },
                      })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-opacity-50 focus:ring-[#2a4d8f] focus:border-[#2a4d8f] transition-all appearance-none bg-white text-gray-700 font-medium"
                    />
                    {errors.newPassword && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.newPassword.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Confirmar Nueva Contraseña
                    </label>
                    <input
                      id="confirmPassword"
                      type="password"
                      autoComplete="new-password"
                      {...register("confirmPassword", {
                        required: "Confirmar contraseña requerida",
                        validate: (value) =>
                          value === watch("newPassword") ||
                          "Las contraseñas no coinciden",
                      })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-opacity-50 focus:ring-[#2a4d8f] focus:border-[#2a4d8f] transition-all appearance-none bg-white text-gray-700 font-medium"
                    />
                    {errors.confirmPassword && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.confirmPassword.message}
                      </p>
                    )}
                  </div>

                  <FormErrorBanner
                    message={
                      resetPasswordMutation.isError
                        ? getApiErrorMessage(
                            resetPasswordMutation.error,
                            "No fue posible restablecer la contraseña.",
                          )
                        : null
                    }
                  />

                  <button
                    type="submit"
                    disabled={resetPasswordMutation.isPending}
                    className="w-full bg-gradient-to-r from-[#001d4e] via-[#102D69] to-[#2a4d8f] text-white py-3 rounded-lg font-bold hover:shadow-lg transition-all disabled:opacity-50"
                  >
                    {resetPasswordMutation.isPending
                      ? "Guardando..."
                      : "Restablecer Contraseña"}
                  </button>

                  {resetPasswordMutation.isError && (
                    <Link
                      href="/"
                      className="block text-center text-sm font-semibold text-[#102D69] hover:text-[#00A0B7] transition-colors"
                    >
                      Solicitar un enlace nuevo
                    </Link>
                  )}
                </form>
              </>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F4F7FB]" />}>
      <ResetPasswordContent />
    </Suspense>
  );
}
