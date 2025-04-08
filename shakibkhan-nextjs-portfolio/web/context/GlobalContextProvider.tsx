"use client";
import { MantineProvider, useMantineColorScheme } from '@mantine/core';
import React, { useEffect, useState } from "react";

interface GlobalProviderProps {
  children?: React.ReactNode;
}

interface GlobalContextProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const GlobalContext = React.createContext<GlobalContextProps | null>(null);

export const useGlobalContext = () => {
  const state = React.useContext(GlobalContext);
  if (!state) throw new Error("State Is Undefined");
  return state;
};

export const GlobalContextProvider: React.FC<GlobalProviderProps> = ({
  children,
}) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { setColorScheme, colorScheme } = useMantineColorScheme();

  useEffect(() => {
    const savedTheme = localStorage.getItem("dark-theme");
    if (savedTheme) {
      const isDark = savedTheme === "true";
      setIsDarkMode(isDark);
      setColorScheme(isDark ? "dark" : "light");
    }
  }, [setColorScheme]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    localStorage.setItem("dark-theme", (!isDarkMode).toString());
    setColorScheme(!isDarkMode ? "dark" : "light");
    
    // Create ripple effect
    const ripple = document.createElement("div");
    ripple.className = "theme-ripple";
    document.body.appendChild(ripple);

    // Set ripple position to theme toggle button position
    const button = document.querySelector('[aria-label="Toggle theme"]');
    const rect = button?.getBoundingClientRect();
    ripple.style.setProperty(
      "--ripple-color",
      !isDarkMode ? "#000" : "#fff"
    );
    if (rect) {
      ripple.style.setProperty(
        "--ripple-top",
        `${rect.top + rect.height / 2}px`
      );
      ripple.style.setProperty(
        "--ripple-left",
        `${rect.left + rect.width / 2}px`
      );
    }

    // Remove ripple after animation
    setTimeout(() => {
      ripple.remove();
    }, 1000);
  };

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      .theme-transition,
      .theme-transition *,
      .theme-transition *:before,
      .theme-transition *:after {
        transition: all 0.7s cubic-bezier(0.4, 0, 0.2, 1) !important;
        transition-delay: 0 !important;
      }

      @keyframes ripple {
        0% { transform: scale(0); opacity: 1; }
        50% { transform: scale(10); opacity: 0.5; }
        100% { transform: scale(35); opacity: 0; }
      }

      .theme-ripple {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        pointer-events: none;
        z-index: 100;
      }

      .theme-ripple::before {
        content: '';
        position: absolute;
        width: 100px;
        height: 100px;
        border-radius: 50%;
        background-color: var(--ripple-color);
        animation: ripple 1s cubic-bezier(0.4, 0, 0.2, 1) forwards;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (

      <GlobalContext.Provider value={{ isDarkMode, toggleTheme }}>
        {children}
      </GlobalContext.Provider>

  );
};
