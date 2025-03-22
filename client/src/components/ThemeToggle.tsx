import { useTheme } from "@/hooks/useTheme";
import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
}

export default function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "p-2 rounded-md transition-colors",
        theme === "dark" 
          ? "text-yellow-400 hover:bg-gray-700" 
          : "text-gray-700 hover:bg-gray-200",
        className
      )}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      {theme === "dark" ? (
        <Sun size={20} className="animate-in fade-in duration-200" />
      ) : (
        <Moon size={20} className="animate-in fade-in duration-200" />
      )}
    </button>
  );
}