import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getCurrentUserFromSession } from "@/libs/server/authSession";
import PasswordChangeGate from "@/components/auth/PasswordChangeGate";
import UsabilitySurveyPrompt from "@/components/auth/UsabilitySurveyPrompt";

type ProtectedLayoutProps = {
  children: ReactNode;
};

export default async function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const user = await getCurrentUserFromSession();

  if (!user) {
    redirect("/");
  }

  if (user.mustChangePassword) {
    return <PasswordChangeGate />;
  }

  return (
    <>
      <UsabilitySurveyPrompt pending={user.usabilitySurveyPending ?? false} />
      {children}
    </>
  );
}
