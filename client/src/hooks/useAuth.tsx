import { createContext, useContext, useState, ReactNode } from "react";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => boolean;
  register: (firstName: string, lastName: string, email: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();

  // For the MVP, we'll just implement client-side auth simulation
  // This would be replaced with actual API calls in a real implementation
  const login = (email: string, password: string) => {
    // Frontend-only validation for MVP
    try {
      // Simulation for success, in a real app this would call an API
      if (email && password) {
        setUser({
          id: "1",
          name: email.split('@')[0],
          email: email
        });
        toast({
          title: "Login successful",
          description: "Welcome to GotraBandhus!",
        });
        return true;
      }
      return false;
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  const register = (firstName: string, lastName: string, email: string, password: string) => {
    // Frontend-only validation for MVP
    try {
      // Simulation for success, in a real app this would call an API
      if (firstName && lastName && email && password) {
        setUser({
          id: "1",
          name: `${firstName} ${lastName}`,
          email: email
        });
        toast({
          title: "Registration successful",
          description: "Welcome to GotraBandhus!",
        });
        return true;
      }
      return false;
    } catch (error) {
      toast({
        title: "Registration failed",
        description: "Please check your information and try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user,
        user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
