"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navigationItems } from "@/data/site-data";

export function SiteFooter() {
  const pathname = usePathname();

  if (pathname?.startsWith("/admin") || pathname === "/login") {
    return null;
  }

  return (
    <footer className="site-footer">
      <div 
        className="container footer-grid" 
        style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 250px), 1fr))", 
          gap: "32px", 
          paddingTop: "60px", 
          paddingBottom: "40px" 
        }}>
        <div>
          <div style={{ marginBottom: "16px" }}>
            <img 
              src="/logo.png" 
              alt="Nexhy Digital" 
              style={{ 
                height: "45px", 
                width: "auto", 
                objectFit: "contain",
                filter: "drop-shadow(1px 1px 0px rgba(255, 255, 255, 0.8)) drop-shadow(-1px 1px 0px rgba(255, 255, 255, 0.8)) drop-shadow(1px -1px 0px rgba(255, 255, 255, 0.8)) drop-shadow(-1px -1px 0px rgba(255, 255, 255, 0.8))"
              }} 
            />
          </div>
          <p style={{ color: "var(--muted)", fontSize: "0.9rem", lineHeight: "1.6" }}>
            Enterprise IT solutions for custom websites, ERP systems, education portals, startup platforms, and long-term maintenance support.
          </p>
        </div>

        <div>
          <h4 style={{ marginTop: 0, marginBottom: "16px", fontSize: "0.95rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.02em", color: "var(--primary)" }}>Quick Links</h4>
          <div className="footer-links" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {navigationItems.map((item) => (
              <Link 
                key={item.href} 
                href={item.href} 
                style={{ 
                  color: "var(--muted)", 
                  textDecoration: "none", 
                  fontSize: "0.9rem", 
                  transition: "color 0.2s ease",
                  fontWeight: 500
                }}
                onMouseEnter={(e) => e.target.style.color = "var(--accent)"}
                onMouseLeave={(e) => e.target.style.color = "var(--muted)"}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h4 style={{ marginTop: 0, marginBottom: "16px", fontSize: "0.95rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.02em", color: "var(--primary)" }}>Contact</h4>
          <p style={{ margin: "0 0 12px 0", fontSize: "0.9rem", color: "var(--muted)", fontWeight: 500 }}>📍 Hyderabad, Telangana, India</p>
          <p style={{ margin: "0 0 12px 0", fontSize: "0.9rem", color: "var(--muted)", fontWeight: 500 }}>✉ hello@hygenx.in</p>
          <p style={{ margin: 0, fontSize: "0.9rem", color: "var(--muted)", fontWeight: 500 }}>📱 +91 99999 99999</p>
        </div>

        <div>
          <h4 style={{ marginTop: 0, marginBottom: "16px", fontSize: "0.95rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.02em", color: "var(--primary)" }}>Legal</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <Link 
              href="/privacy" 
              style={{ 
                textDecoration: "none", 
                color: "var(--muted)", 
                fontSize: "0.9rem",
                fontWeight: 500,
                transition: "color 0.2s ease"
              }}
              onMouseEnter={(e) => e.target.style.color = "var(--accent)"}
              onMouseLeave={(e) => e.target.style.color = "var(--muted)"}
            >
              Privacy Policy
            </Link>
            <Link 
              href="/terms" 
              style={{ 
                textDecoration: "none", 
                color: "var(--muted)", 
                fontSize: "0.9rem",
                fontWeight: 500,
                transition: "color 0.2s ease"
              }}
              onMouseEnter={(e) => e.target.style.color = "var(--accent)"}
              onMouseLeave={(e) => e.target.style.color = "var(--muted)"}
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
      
      <div className="container" style={{ borderTop: "1px solid var(--line)", paddingTop: "20px", paddingBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "20px", fontSize: "0.85rem", color: "var(--muted)" }}>
        <p style={{ margin: 0 }}>&copy; 2026 Nexhy Digital. All rights reserved.</p>
        <div style={{ display: "flex", gap: "20px" }}>
          <Link 
            href="/privacy" 
            style={{ textDecoration: "none", color: "var(--muted)", transition: "color 0.2s ease" }}
            onMouseEnter={(e) => e.target.style.color = "var(--accent)"}
            onMouseLeave={(e) => e.target.style.color = "var(--muted)"}
          >
            Privacy
          </Link>
          <Link 
            href="/terms" 
            style={{ textDecoration: "none", color: "var(--muted)", transition: "color 0.2s ease" }}
            onMouseEnter={(e) => e.target.style.color = "var(--accent)"}
            onMouseLeave={(e) => e.target.style.color = "var(--muted)"}
          >
            Terms
          </Link>
          <Link 
            href="/contact" 
            style={{ textDecoration: "none", color: "var(--muted)", transition: "color 0.2s ease" }}
            onMouseEnter={(e) => e.target.style.color = "var(--accent)"}
            onMouseLeave={(e) => e.target.style.color = "var(--muted)"}
          >
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
}
