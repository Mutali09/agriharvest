"use client";

import { useState, useEffect } from "react";

export default function ThemeToggle() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDarkMode(true);
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    
    if (newMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <button 
      onClick={toggleDarkMode}
      className="p-2 rounded-lg bg-[#fdf6e3] border border-[#d2b48c] hover:bg-[#d2b48c] transition-colors duration-200"
      title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      <span className="text-lg">{isDarkMode ? "☀️" : "🌙"}</span>
    </button>
  );
}
