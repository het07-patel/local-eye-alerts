
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import { useToast } from "@/components/ui/use-toast";
import { useEffect } from "react";

const Layout = () => {
  const { toast } = useToast();

  useEffect(() => {
    // Welcome toast for first-time visitors
    if (!localStorage.getItem("welcomed")) {
      toast({
        title: "Welcome to StreetSense",
        description: "Report and track local problems in your community.",
        duration: 5000,
      });
      localStorage.setItem("welcomed", "true");
    }
  }, [toast]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-6">
        <Outlet />
      </main>
      <footer className="bg-muted py-6">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2025 StreetSense. Making communities better together.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
