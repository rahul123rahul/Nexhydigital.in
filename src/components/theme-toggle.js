"use client";

import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle({ floating = false }) {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    // Determine initial theme
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute("data-theme", savedTheme);
    } else {
      // Fallback to system theme mode
      const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const defaultTheme = systemPrefersDark ? "dark" : "light";
      setTheme(defaultTheme);
      document.documentElement.setAttribute("data-theme", defaultTheme);
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
    localStorage.setItem("theme", nextTheme);
  };

  if (floating) {
    return (
      <button
        onClick={toggleTheme}
        aria-label="Toggle light/dark theme"
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px", // sits nicely in the bottom right corner
          width: "56px",
          height: "56px",
          borderRadius: "50%",
          background: theme === "dark" ? "#1e293b" : "#ffffff",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
          color: theme === "dark" ? "#facc15" : "#0f62fe",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          zIndex: 9999,
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.1) rotate(15deg)";
          e.currentTarget.style.boxShadow = "0 8px 30px rgba(15, 98, 254, 0.3)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1) rotate(0deg)";
          e.currentTarget.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.15)";
        }}
      >
        {theme === "dark" ? <Sun size={24} /> : <Moon size={24} />}
      </button>
    );
  }

  // Header Mode
  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      style={{
        background: "none",
        border: "none",
        color: "var(--muted)",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "8px",
        borderRadius: "8px",
        transition: "color 0.2s, background 0.2s"
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "var(--surface-alt)";
        e.currentTarget.style.color = "var(--primary)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "none";
        e.currentTarget.style.color = "var(--muted)";
      }}
    >
      {theme === "dark" ? <Sun size={20} style={{ color: "#facc15" }} /> : <Moon size={20} />}
    </button>
  );
}
