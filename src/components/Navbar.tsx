
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MapPin, Bell, FileText, Home } from "lucide-react";

const Navbar = () => {
  return (
    <header className="bg-primary text-primary-foreground shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <MapPin className="h-6 w-6" />
            <span className="font-bold text-xl">Local Eye</span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-4">
            <Button asChild variant="ghost">
              <Link to="/" className="flex items-center space-x-2">
                <Home className="h-4 w-4" />
                <span>Home</span>
              </Link>
            </Button>
            <Button asChild variant="ghost">
              <Link to="/report" className="flex items-center space-x-2">
                <FileText className="h-4 w-4" />
                <span>Report Problem</span>
              </Link>
            </Button>
            <Button asChild variant="ghost">
              <Link to="/alerts" className="flex items-center space-x-2">
                <Bell className="h-4 w-4" />
                <span>Local Alerts</span>
              </Link>
            </Button>
          </nav>
          
          <div className="md:hidden flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                const menu = document.getElementById("mobile-menu");
                menu?.classList.toggle("hidden");
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div id="mobile-menu" className="hidden md:hidden bg-primary">
        <div className="px-2 pt-2 pb-3 space-y-1">
          <Button asChild variant="ghost" className="w-full justify-start">
            <Link to="/" className="flex items-center space-x-2">
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Link>
          </Button>
          <Button asChild variant="ghost" className="w-full justify-start">
            <Link to="/report" className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Report Problem</span>
            </Link>
          </Button>
          <Button asChild variant="ghost" className="w-full justify-start">
            <Link to="/alerts" className="flex items-center space-x-2">
              <Bell className="h-4 w-4" />
              <span>Local Alerts</span>
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
