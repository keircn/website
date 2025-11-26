import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "~/app/actions/admin";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAuthenticated = await isAdminAuthenticated();

  if (!isAuthenticated) {
    redirect("/login");
  }

  return <>{children}</>;
}
