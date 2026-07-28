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
          <div style={{ marginTop: "16px", display: "flex", gap: "12px", alignItems: "center" }}>
            <a
              href="https://www.linkedin.com/in/nexhy-digital-191093424/"
              target="_blank"
              rel="noreferrer"
              aria-label="Nexhydigital LinkedIn Profile"
              title="LinkedIn Profile"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: "38px",
                height: "38px",
                borderRadius: "10px",
                background: "var(--surface-alt)",
                border: "1px solid var(--line)",
                color: "#0a66c2",
                textDecoration: "none",
                transition: "all 0.2s ease"
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.72a1.49 1.49 0 1 0 0 2.98 1.49 1.49 0 0 0 0-2.98z"/></svg>
            </a>
            <a
              href="https://www.instagram.com/nexhydigital/?hl=en"
              target="_blank"
              rel="noreferrer"
              aria-label="Nexhydigital Instagram Profile"
              title="Instagram Profile"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: "38px",
                height: "38px",
                borderRadius: "10px",
                background: "var(--surface-alt)",
                border: "1px solid var(--line)",
                color: "#e4405f",
                textDecoration: "none",
                transition: "all 0.2s ease"
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
            </a>
          </div>
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
          <p style={{ margin: "0 0 12px 0", fontSize: "0.9rem", color: "var(--muted)", fontWeight: 500 }}>
            ✉{" "}
            <a href="mailto:nexhydigital@gmail.com" className="contact-redirect-link">
              nexhydigital@gmail.com
            </a>
          </p>
          <p style={{ margin: 0, fontSize: "0.9rem", color: "var(--muted)", fontWeight: 500 }}>
            📱{" "}
            <a href="tel:+919603230138" className="contact-redirect-link">+91 9603230138</a>,{" "}
            <a href="tel:+919121391173" className="contact-redirect-link">+91 91213 91173</a>,{" "}
            <a href="tel:+919000180485" className="contact-redirect-link">+91 90001 80485</a>
          </p>
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
