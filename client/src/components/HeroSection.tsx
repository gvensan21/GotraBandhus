import { useState } from "react";
import { Button } from "@/components/ui/button";
import AuthModal from "./AuthModal";

export default function HeroSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"login" | "register">("login");

  const handleGetStarted = () => {
    setModalMode("register");
    setIsModalOpen(true);
  };

  const handleSignIn = () => {
    setModalMode("login");
    setIsModalOpen(true);
  };

  return (
    <>
      <section className="pt-24 pb-16 md:pt-28 md:pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-primary mb-4">Discover Your Family History</h1>
            <p className="text-lg text-gray-600 mb-8">GotraBandhus helps you build, visualize, and share your family tree. Create connections across generations and preserve your family's unique story.</p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" onClick={handleGetStarted}>Get Started</Button>
              <Button size="lg" variant="outline" onClick={handleSignIn}>Sign In</Button>
            </div>
          </div>
          <div className="flex justify-center">
            <img 
              src="https://images.unsplash.com/photo-1606041011872-596597976b25?w=800&h=600&fit=crop&crop=edges" 
              alt="Family genealogy illustration" 
              className="rounded-lg shadow-lg max-w-full h-auto" 
              width="600" 
              height="400"
            />
          </div>
        </div>
      </section>

      <AuthModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        initialMode={modalMode}
      />
    </>
  );
}
