import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  variant?: "full" | "icon";
  className?: string;
}

export default function Logo({ size = "md", variant = "full", className }: LogoProps) {
  const sizes = {
    sm: {
      icon: "h-6 w-6",
      text: "text-lg"
    },
    md: {
      icon: "h-8 w-8",
      text: "text-xl"
    },
    lg: {
      icon: "h-10 w-10",
      text: "text-2xl"
    }
  };

  return (
    <div className={cn("flex items-center", className)}>
      <div className={cn(
        "flex-shrink-0 bg-secondary rounded-lg flex items-center justify-center text-white font-bold",
        sizes[size].icon
      )}>
        <span>G</span>
      </div>
      {variant === "full" && (
        <div className="ml-2 flex flex-col">
          <span className={cn("font-bold leading-tight text-foreground", sizes[size].text)}>
            Gotra<span className="text-secondary">Bandhus</span>
          </span>
        </div>
      )}
    </div>
  );
}