'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

export function ThemeToggle({ scrolled }: { scrolled: boolean }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`p-2 rounded-full border transition-all duration-200 hover:scale-105 ${
        scrolled
          ? 'border-gray-200 text-text-dark hover:bg-gray-100'
          : 'border-white/20 text-white hover:bg-white/10'
      }`}
      aria-label="Toggle Theme"
    >
      {theme === 'light' ? (
        <Moon className="w-4 h-4" />
      ) : (
        <Sun className="w-4 h-4" />
      )}
    </button>
  );
}
