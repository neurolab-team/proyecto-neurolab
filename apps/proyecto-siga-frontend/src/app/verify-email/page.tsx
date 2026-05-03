"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { usersService } from "@/services/users/users";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const [tokenError, setTokenError] = useState<string | null>(null);
  const lastProcessedToken = useRef<string | null>(null);

  const verifyEmailMutation = useMutation({
    mutationFn: (token: string) => usersService.verifyEmail(token),
  });

  const { mutate, isPending, isIdle, isSuccess, data, error } =
    verifyEmailMutation;

  const verificationErrorMessage = (() => {
    if (!error) return "";
    const apiError = error as { response?: { data?: { message?: string } } };
    return (
      apiError.response?.data?.message ||
      "No se pudo verificar tu correo. Intenta solicitar un nuevo enlace."
    );
  })();

  const message = tokenError
    ? tokenError
    : isSuccess
      ? data?.message || "Correo verificado exitosamente."
      : isPending || isIdle
        ? "Verificando tu correo..."
        : verificationErrorMessage;

  const isValidating = !tokenError && (isPending || isIdle);

  const token = useMemo(() => searchParams?.get("token") ?? "", [searchParams]);

  useEffect(() => {
    if (token === lastProcessedToken.current) {
      return;
    }

    lastProcessedToken.current = token;

    if (!token) {
      setTokenError("El enlace de verificación es inválido.");
      return;
    }

    setTokenError(null);
    mutate(token);
  }, [token, mutate]);

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F7FB]">
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
          <section className="rounded-[2rem] bg-white p-8 shadow-sm text-center">
            <h1 className="text-3xl font-bold text-[#102D69]">Verificación de correo</h1>
            <p className="mt-4 text-slate-600">{message}</p>

            {isValidating && (
              <div className="mt-8 inline-block h-12 w-12 animate-spin rounded-full border-b-2 border-[#00A0B7]" />
            )}

            {!isValidating && (
              <div className="mt-8">
                <Link
                  href="/"
                  className="inline-flex rounded-xl bg-gradient-to-r from-[#102D69] to-[#00A0B7] px-5 py-3 text-sm font-semibold text-white"
                >
                  Volver al inicio
                </Link>
              </div>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F4F7FB]" />}>
      <VerifyEmailContent />
    </Suspense>
  );
}
