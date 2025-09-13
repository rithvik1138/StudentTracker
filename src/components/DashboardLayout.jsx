import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar.jsx";
import { useAuth } from '@/context/AuthContext.jsx';

const DashboardLayout = ({ children }) => {
  const { user } = useAuth();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-surface">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-16 border-b border-border bg-card flex items-center px-6 shadow-sm">
            <SidebarTrigger className="mr-4" />
            <div className="flex-1">
              <h1 className="text-xl font-semibold text-foreground">
                Welcome back, {user?.name}!
              </h1>
              <p className="text-sm text-muted-foreground capitalize">
                {user?.role} Dashboard
              </p>
            </div>
          </header>
          <main className="flex-1 p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;