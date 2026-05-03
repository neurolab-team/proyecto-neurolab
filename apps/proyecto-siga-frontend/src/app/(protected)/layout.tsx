import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getCurrentUserFromSession } from "@/libs/server/authSession";

type ProtectedLayoutProps = {
  children: ReactNode;
};

export default async function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const user = await getCurrentUserFromSession();

  if (!user) {
    redirect("/");
  }

  return <>{children}</>;
}
