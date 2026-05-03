import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getCurrentUserFromSession } from "@/libs/server/authSession";

type AdminLayoutProps = {
  children: ReactNode;
};

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const user = await getCurrentUserFromSession();

  if (!user) {
    redirect("/");
  }

  if (user.role !== "admin") {
    redirect("/");
  }

  return <>{children}</>;
}
