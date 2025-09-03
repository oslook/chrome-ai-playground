'use client';

import React from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';

export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else if (theme === 'dark') {
    //   setTheme('system');
    // } else {
      setTheme('light');
    }
  };

  const getIcon = () => {
    if (theme === 'light') {
      return <Sun className="h-[1.2rem] w-[1.2rem]" />;
    } else if (theme === 'dark') {
      return <Moon className="h-[1.2rem] w-[1.2rem]" />;
    // } else {
    //   return <Monitor className="h-[1.2rem] w-[1.2rem]" />;
    }
  };

  return (
    <Button variant="ghost" size="icon" onClick={toggleTheme}>
      {getIcon()}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}