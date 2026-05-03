import type { ReactNode } from "react";

type TestLayoutProps = {
  children: ReactNode;
};

export default async function TestLayout({ children }: TestLayoutProps) {
  return <>{children}</>;
}
