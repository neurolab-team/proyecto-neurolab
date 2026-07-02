"use client";

import { AdminDashboardClient } from "@/app/(protected)/panel/admin/_components/AdminDashboardClient";

/**
 * Renders the admin dashboard directly on the home page (/).
 * Reuses the existing AdminDashboardClient which already includes Navbar + Footer.
 */
export default function AdminHome() {
  return <AdminDashboardClient />;
}
