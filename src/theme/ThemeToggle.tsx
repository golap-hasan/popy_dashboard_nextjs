"use client";

import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";

const ThemeToggle = () => {
  const { setTheme, resolvedTheme } = useTheme();

  const isDark = resolvedTheme === "dark";

  return (
    <Button
      variant="outline"
      size="icon"
      className="group relative rounded-full"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      <Moon
        className={`absolute h-5 w-5 transition-all ${
          isDark ? "scale-100 opacity-100" : "scale-0 opacity-0"
        }`}
        aria-hidden="true"
      />
      <Sun
        className={`h-5 w-5 transition-all ${
          isDark ? "scale-0 opacity-0" : "scale-100 opacity-100"
        }`}
        aria-hidden="true"
      />
    </Button>
  );
};

export default ThemeToggle;
