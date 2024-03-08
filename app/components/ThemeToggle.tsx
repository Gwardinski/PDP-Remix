import { Moon, Sun } from "lucide-react";
import { Theme, useTheme } from "remix-themes";
import { Button } from "./ui/button";

export const ThemeToggle: React.FC = () => {
  const [theme, setTheme] = useTheme();
  const isDark = theme === Theme.DARK;
  return (
    <Button
      size="icon"
      variant="outline"
      onClick={() => setTheme(isDark ? Theme.LIGHT : Theme.DARK)}
    >
      {isDark && <Sun className="size-3" />}
      {!isDark && <Moon className="size-3" />}
    </Button>
  );
};
