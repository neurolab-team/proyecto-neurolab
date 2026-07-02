import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getCurrentUserFromSession } from "@/libs/server/authSession";

type TestResultsLayoutProps = {
  children: ReactNode;
};

const ALLOWED_ROLES = ["user", "psychologist"];

export default async function TestResultsLayout({
  children,
}: TestResultsLayoutProps) {
  const user = await getCurrentUserFromSession();

  if (!user || !ALLOWED_ROLES.includes(user.role)) {
    redirect("/");
  }

  return <>{children}</>;
}
