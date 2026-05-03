"use client";

import type { ReactNode } from "react";
import { QueryClientProviderWrapper } from "../providers/queryProvider";
import { AuthProvider } from "../providers/authProvider";
import { ModalProvider } from "../providers/modalProvider";
import ModalRoot from "../components/modal/core/ModalRoot";
import { ToastProvider } from "../providers/toastProvider";

type ProvidersProps = {
  children: ReactNode;
};

export default function Providers({ children }: ProvidersProps) {
  return (
    <QueryClientProviderWrapper>
      <AuthProvider>
        <ModalProvider>
          {children}
          <ModalRoot />
          <ToastProvider />
        </ModalProvider>
      </AuthProvider>
    </QueryClientProviderWrapper>
  );
}
