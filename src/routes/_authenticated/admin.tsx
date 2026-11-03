import { createFileRoute, Outlet, redirect, Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { BookOpen, Map, Upload, LogOut, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { staffIdentity } from "@/lib/admin/auth";
export const Route = createFileRoute("/_authenticated/admin")({
  beforeLoad: async () => {
    const staff = await staffIdentity();
    if (!staff) throw redirect({ to: "/admin/login" });
    return { staff };
  },
  component: AdminShell,
});
function AdminShell() {
  const { staff } = Route.useRouteContext();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  async function logout() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    await navigate({ to: "/admin/login", replace: true });
  }
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-screen-2xl flex-wrap items-center justify-between gap-4 px-5 py-4">
          <Link to="/admin/hadits" className="text-xl font-display">
            akhirzaman.id <span className="ml-2 font-sans text-xs text-primary">ADMIN</span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground">{staff.role}</span>
            <Button asChild variant="ghost" size="icon" title="Lihat situs">
              <Link to="/">
                <ArrowUpRight />
              </Link>
            </Button>
            <Button variant="outline" onClick={logout}>
              <LogOut />
              Keluar
            </Button>
          </div>
        </div>
      </header>
      <div className="mx-auto grid max-w-screen-2xl md:grid-cols-[200px_minmax(0,1fr)]">
        <nav
          aria-label="Navigasi admin"
          className="flex gap-2 border-b border-border p-4 md:min-h-[calc(100vh-74px)] md:flex-col md:border-r md:border-b-0"
        >
          <Button asChild variant="ghost" className="justify-start">
            <Link to="/admin/hadits" activeProps={{ className: "bg-accent text-primary" }}>
              <BookOpen />
              Hadits
            </Link>
          </Button>
          {staff.role === "admin" && (
            <>
              <Button asChild variant="ghost" className="justify-start">
                <Link to="/admin/signs" activeProps={{ className: "bg-accent text-primary" }}>
                  <Map />
                  Tanda
                </Link>
              </Button>
              <Button asChild variant="ghost" className="justify-start">
                <Link to="/admin/import" activeProps={{ className: "bg-accent text-primary" }}>
                  <Upload />
                  Impor
                </Link>
              </Button>
            </>
          )}
        </nav>
        <main className="min-w-0 px-5 py-8 md:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
