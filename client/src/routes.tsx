import { Switch, Route, useLocation } from "wouter";
import Home from "@/pages/Home";
import Dashboard from "@/pages/Dashboard";
import FamilyTree from "@/pages/FamilyTree";
import FindBandhu from "@/pages/FindBandhu";
import ConnectFamilies from "@/pages/ConnectFamilies";
import NotFound from "@/pages/not-found";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";

export default function Routes() {
  const { isAuthenticated } = useAuth();
  const [location, setLocation] = useLocation();
  
  // Redirect to dashboard if authenticated and trying to access home page
  useEffect(() => {
    if (isAuthenticated && location === "/") {
      setLocation("/dashboard");
    }
    // If trying to access protected routes without auth, redirect to home
    if (!isAuthenticated && 
        (location.startsWith("/dashboard") || 
         location.startsWith("/family-tree") || 
         location.startsWith("/find-bandhu") || 
         location.startsWith("/connect-families"))) {
      setLocation("/");
    }
  }, [isAuthenticated, location, setLocation]);

  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/family-tree" component={FamilyTree} />
      <Route path="/find-bandhu" component={FindBandhu} />
      <Route path="/connect-families" component={ConnectFamilies} />
      <Route component={NotFound} />
    </Switch>
  );
}
