import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  nickname: string;
  profileCompleted: boolean;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (firstName: string, lastName: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper to manage token in localStorage
const setToken = (token: string) => {
  localStorage.setItem('auth_token', token);
};

const getToken = () => {
  return localStorage.getItem('auth_token');
};

const removeToken = () => {
  localStorage.removeItem('auth_token');
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setAuthToken] = useState<string | null>(getToken());
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  // Check for existing token and load user data on mount
  useEffect(() => {
    const loadUser = async () => {
      const storedToken = getToken();
      if (storedToken) {
        setAuthToken(storedToken);
        try {
          const response = await fetch('/api/auth/me', {
            headers: {
              'Authorization': `Bearer ${storedToken}`
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            setUser(data.user);
          } else {
            // Invalid token, remove it
            removeToken();
            setAuthToken(null);
          }
        } catch (error) {
          console.error('Error loading user:', error);
          removeToken();
          setAuthToken(null);
        }
      }
    };

    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await apiRequest('POST', '/api/auth/login', { email, password });
      const data = await response.json();
      
      if (data.token && data.user) {
        setUser(data.user);
        setAuthToken(data.token);
        setToken(data.token);
        
        toast({
          title: "Login successful",
          description: "Welcome to GotraBandhus!",
        });
        
        // Redirect based on profile completion
        if (data.redirectTo) {
          setLocation(data.redirectTo);
        }
        
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (firstName: string, lastName: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const nickname = firstName.toLowerCase(); // Simple default nickname
      const response = await apiRequest('POST', '/api/auth/register', { 
        firstName, 
        lastName, 
        nickname,
        email, 
        password, 
        phone: "" // Required field, can be updated in profile
      });
      
      const data = await response.json();
      
      if (data.token && data.user) {
        setUser(data.user);
        setAuthToken(data.token);
        setToken(data.token);
        
        toast({
          title: "Registration successful",
          description: "Welcome to GotraBandhus!",
        });
        
        // Redirect to profile completion page
        if (data.redirectTo) {
          setLocation(data.redirectTo);
        }
        
        return true;
      }
      return false;
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Registration failed",
        description: "Please check your information and try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setAuthToken(null);
    removeToken();
    setLocation('/');
    
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user && !!token,
        user,
        token,
        login,
        register,
        logout,
        isLoading
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
