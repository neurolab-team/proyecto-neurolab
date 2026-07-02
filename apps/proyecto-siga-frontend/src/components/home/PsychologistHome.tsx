"use client";

import PsychologistPage from "@/app/(protected)/panel/psychologist/page";

/**
 * Renders the psychologist dashboard directly on the home page (/).
 * Reuses the existing PsychologistPage which already includes
 * PsychologistLayout (Navbar + sidebar + footer).
 */
export default function PsychologistHome() {
  return <PsychologistPage />;
}
