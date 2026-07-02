import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getCurrentUserFromSession } from "@/libs/server/authSession";

type AssignmentTestLayoutProps = {
  children: ReactNode;
};

export default async function AssignmentTestLayout({
  children,
}: AssignmentTestLayoutProps) {
  const user = await getCurrentUserFromSession();

  if (!user || user.role !== "user") {
    redirect("/");
  }

  return <>{children}</>;
}
