"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { navigationItems } from "@/data/site-data";
import { ThemeToggle } from "@/components/theme-toggle";

export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (pathname?.startsWith("/admin") || pathname === "/login") {
    return null;
  }

  return (
    <motion.header 
      className="topbar"
      animate={{
        width: isMobile ? "100%" : (isScrolled ? "90%" : "100%"),
        y: isMobile ? 0 : (isScrolled ? 15 : 0),
        borderRadius: isMobile ? "0px" : (isScrolled ? "24px" : "0px"),
        backgroundColor: isScrolled ? "var(--surface-alt)" : "var(--surface)",
        borderColor: isScrolled ? "var(--line)" : "transparent",
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      style={{ 
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, margin: "0 auto",
        borderWidth: "1px", borderStyle: "solid",
        backdropFilter: isScrolled ? "blur(24px) saturate(150%)" : "none",
        WebkitBackdropFilter: isScrolled ? "blur(24px) saturate(150%)" : "none",
        boxShadow: isScrolled ? "0 8px 32px rgba(15, 98, 254, 0.2)" : "none",
      }}
    >
      <div className="container topbar-inner">
        <Link className="brand" href="/">
          <img 
            src="/logo.png" 
            alt="Nexhy Digital Logo" 
            style={{ 
              height: isMobile ? "40px" : "48px", 
              width: "auto", 
              objectFit: "contain" 
            }} 
          />
        </Link>

        <nav className="nav nav-desktop" aria-label="Primary">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={pathname === item.href ? "nav-link nav-link-active" : "nav-link"}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="header-actions">
          <ThemeToggle />
          <div className="nav-desktop">
            <Link className="button button-outline compact-button" href="/contact">
              Talk to Us
            </Link>
          </div>

          <button
            aria-label="Toggle menu"
            className="mobile-menu-btn"
            onClick={() => setMenuOpen((v) => !v)}
            type="button"
          >
            <span className={`hamburger ${menuOpen ? "hamburger-open" : ""}`}>
              <span />
              <span />
              <span />
            </span>
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="mobile-nav" aria-label="Mobile navigation">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={pathname === item.href ? "mobile-nav-link mobile-nav-link-active" : "mobile-nav-link"}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <div className="mobile-nav-actions" style={{ display: "flex", flexDirection: "column", gap: "10px", padding: "10px 0" }}>
            <Link className="button" href="/contact" onClick={() => setMenuOpen(false)}>
              Talk to Us
            </Link>
          </div>
        </nav>
      )}
    </motion.header>
  );
}
