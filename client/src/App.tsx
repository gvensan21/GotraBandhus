import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "./hooks/useAuth";
import Routes from "./routes";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Routes />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
