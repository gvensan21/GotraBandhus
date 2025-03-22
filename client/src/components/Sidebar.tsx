import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import Logo from "./Logo";

interface SidebarProps {
  open: boolean;
}

export default function Sidebar({ open }: SidebarProps) {
  const [location] = useLocation();

  const navItems = [
    { 
      path: "/dashboard", 
      label: "Dashboard", 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-home">
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
      ) 
    },
    { 
      path: "/family-tree", 
      label: "My Family Tree", 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-git-branch">
          <line x1="6" x2="6" y1="3" y2="15"></line>
          <circle cx="18" cy="6" r="3"></circle>
          <circle cx="6" cy="18" r="3"></circle>
          <path d="M18 9a9 9 0 0 1-9 9"></path>
        </svg>
      ) 
    },
    { 
      path: "/find-bandhu", 
      label: "Find Your Bandhu", 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" x2="16.65" y1="21" y2="16.65"></line>
        </svg>
      ) 
    },
    { 
      path: "/connect-families", 
      label: "Connect Families", 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-link">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
        </svg>
      ) 
    }
  ];

  return (
    <div className={cn(
      "bg-primary text-white h-screen flex-shrink-0 transition-all duration-300 ease-in-out overflow-y-auto",
      open ? "w-64" : "w-16"
    )}>
      <div className="p-4 border-b border-gray-700">
        <Logo variant={open ? "full" : "icon"} size={open ? "md" : "sm"} className="mx-auto" />
      </div>
      <nav className="mt-4">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link href={item.path}>
                <a className={cn(
                  "flex items-center px-4 py-3",
                  location === item.path 
                    ? "text-primary-foreground bg-white border-l-4 border-secondary" 
                    : "text-gray-300 hover:bg-secondary hover:bg-opacity-10 hover:border-l-4 hover:border-secondary"
                )}>
                  <span className="w-6">{item.icon}</span>
                  <span className={cn("ml-2", !open && "hidden")}>{item.label}</span>
                </a>
              </Link>
            </li>
          ))}
          {/* Removed logout button since it's now in the dropdown menu */}
        </ul>
      </nav>
    </div>
  );
}
