import { useState } from "react";
import { Link } from "wouter";
import AuthModal from "./AuthModal";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"login" | "register">("login");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLoginClick = () => {
    setModalMode("login");
    setIsModalOpen(true);
  };

  const handleRegisterClick = () => {
    setModalMode("register");
    setIsModalOpen(true);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <>
      <nav className="bg-white shadow-sm fixed top-0 w-full z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/">
                  <span className="text-2xl font-bold cursor-pointer">GotraBandhus</span>
                </Link>
              </div>
            </div>
            <div className="hidden md:ml-6 md:flex md:items-center md:space-x-4">
              <Link href="/">
                <span className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-primary cursor-pointer">Home</span>
              </Link>
              <a href="#features" className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-primary">Features</a>
              <a href="#about" className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-primary">About</a>
              <a href="#contact" className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-primary">Contact</a>
            </div>
            <div className="flex items-center">
              <Button variant="outline" className="ml-4" onClick={handleLoginClick}>Sign In</Button>
              <Button className="ml-4" onClick={handleRegisterClick}>Get Started</Button>
            </div>
            <div className="flex items-center md:hidden">
              <button
                onClick={toggleMobileMenu}
                className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
              >
                <span className="sr-only">Open main menu</span>
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        <div className={`${mobileMenuOpen ? 'block' : 'hidden'} md:hidden bg-white border-t border-gray-200`}>
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link href="/">
              <span className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-50 cursor-pointer">Home</span>
            </Link>
            <a href="#features" className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-50">Features</a>
            <a href="#about" className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-50">About</a>
            <a href="#contact" className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-50">Contact</a>
          </div>
        </div>
      </nav>

      <AuthModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        initialMode={modalMode}
      />
    </>
  );
}
