import { ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Sidebar from "./Sidebar";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { isAuthenticated } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="flex flex-1">
          <Sidebar open={sidebarOpen} />
          <div className="flex-1 flex flex-col">
            <div className="bg-white shadow-sm p-4 flex justify-between items-center">
              <button 
                onClick={toggleSidebar}
                className="text-text-medium hover:text-secondary p-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-menu">
                  <line x1="4" x2="20" y1="12" y2="12"></line>
                  <line x1="4" x2="20" y1="6" y2="6"></line>
                  <line x1="4" x2="20" y1="18" y2="18"></line>
                </svg>
              </button>
              <div className="flex items-center space-x-4">
                <button className="text-text-medium hover:text-secondary p-2 relative">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bell">
                    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path>
                    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path>
                  </svg>
                  <span className="absolute top-0 right-0 h-4 w-4 bg-orange-500 rounded-full text-xs flex items-center justify-center text-white">3</span>
                </button>
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600">
                    {useAuth().user?.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="ml-2 text-text-medium">{useAuth().user?.name}</span>
                </div>
              </div>
            </div>
            <main className="flex-1 overflow-y-auto p-6">
              {children}
            </main>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
