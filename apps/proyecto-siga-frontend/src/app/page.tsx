import { getCurrentUserFromSession } from "@/libs/server/authSession";
import PublicLanding from "@/components/home/PublicLanding";
import UserHome from "@/components/home/UserHome";
import PsychologistHome from "@/components/home/PsychologistHome";
import AdminHome from "@/components/home/AdminHome";

export default async function HomePage() {
  const user = await getCurrentUserFromSession();

  if (!user) {
    return <PublicLanding />;
  }

  if (user.role === "admin") {
    return <AdminHome />;
  }

  if (user.role === "psychologist") {
    return <PsychologistHome />;
  }

  return <UserHome />;
}
