import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getCurrentUserFromSession } from "@/libs/server/authSession";

type PsychologistLayoutProps = {
  children: ReactNode;
};

export default async function PsychologistLayout({ children }: PsychologistLayoutProps) {
  const user = await getCurrentUserFromSession();

  if (!user) {
    redirect("/");
  }

  if (user.role !== "psychologist") {
    redirect("/");
  }

  return <>{children}</>;
}
