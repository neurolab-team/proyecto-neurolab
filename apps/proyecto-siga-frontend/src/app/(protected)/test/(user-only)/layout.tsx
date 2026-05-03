import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getCurrentUserFromSession } from "@/libs/server/authSession";

type UserOnlyTestLayoutProps = {
  children: ReactNode;
};

export default async function UserOnlyTestLayout({
  children,
}: UserOnlyTestLayoutProps) {
  const user = await getCurrentUserFromSession();

  if (!user || user.role !== "user") {
    redirect("/");
  }

  return <>{children}</>;
}
