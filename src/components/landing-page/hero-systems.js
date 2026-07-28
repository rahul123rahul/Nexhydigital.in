"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SERVICES = [
  {
    id: "erp",
    icon: "🏢",
    title: "Enterprise ERP",
    subtitle: "Unified HR, Finance & Operations",
    tag: "Payroll, Inventory & GST Billing",
    badge: "100% Automated",
    color: "#00d4ff",
    metric: "65% Admin Time Saved",
    features: ["Attendance & Payroll", "GST Invoice Generator", "Multi-branch Dashboard"]
  },
  {
    id: "school",
    icon: "🎓",
    title: "School Management",
    subtitle: "Complete Digital Campus",
    tag: "Admissions, Fees & Notice Board",
    badge: "1,200+ Students",
    color: "#10b981",
    metric: "Launched in 4 Weeks",
    features: ["Online Fee Collection", "Student & Parent Portal", "Exam & Marks Analytics"]
  },
  {
    id: "apps",
    icon: "📱",
    title: "Web & Mobile Apps",
    subtitle: "High-Performance Platforms",
    tag: "iOS, Android, React Native & Next.js",
    badge: "App Store Ready",
    color: "#d946ef",
    metric: "60 FPS Smooth UI",
    features: ["Cross-Platform Mobile", "Fast Cloud Backend", "Real-time Push Notifications"]
  },
  {
    id: "ecommerce",
    icon: "🛒",
    title: "E-Commerce & Custom Web",
    subtitle: "High-Conversion Stores",
    tag: "UPI/Card Gateway, CMS & SEO",
    badge: "3× Sales Growth",
    color: "#f59e0b",
    metric: "Page-1 Google Rank",
    features: ["Instant Cart Checkout", "Inventory Sync", "Mobile-first Design"]
  },
  {
    id: "maintenance",
    icon: "🔧",
    title: "Support & Maintenance",
    subtitle: "Continuous IT Security",
    tag: "24/7 Monitoring & Speed Optimization",
    badge: "99.9% Uptime",
    color: "#3b82f6",
    metric: "< 1 Hr Response Time",
    features: ["Security & SSL Audits", "Daily Cloud Backups", "Dedicated Tech Engineer"]
  }
];

export function HeroSystems() {
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % SERVICES.length);
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  const activeService = SERVICES[activeIdx];

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "580px",
        background: "rgba(10, 20, 42, 0.75)",
        border: "1px solid rgba(0, 212, 255, 0.25)",
        borderRadius: "24px",
        padding: "24px",
        backdropFilter: "blur(24px)",
        boxShadow: "0 20px 60px rgba(0, 0, 0, 0.4), 0 0 40px rgba(0, 212, 255, 0.15)",
        position: "relative",
        overflow: "hidden"
      }}
    >
      {/* Background Vibrant Glow */}
      <div
        style={{
          position: "absolute",
          top: "-50px",
          right: "-50px",
          width: "250px",
          height: "250px",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${activeService.color}35 0%, transparent 70%)`,
          filter: "blur(50px)",
          pointerEvents: "none",
          transition: "background 0.5s ease"
        }}
      />

      {/* Top Bar Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#ff5f56" }} />
          <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#ffbd2e" }} />
          <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#27c93f" }} />
          <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "rgba(255,255,255,0.6)", marginLeft: "8px", letterSpacing: "0.05em" }}>
            NEXHYDIGITAL SERVICE SUITE
          </span>
        </div>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            background: "rgba(16, 185, 129, 0.15)",
            border: "1px solid rgba(16, 185, 129, 0.3)",
            padding: "4px 10px",
            borderRadius: "999px",
            fontSize: "0.72rem",
            fontWeight: 700,
            color: "#10b981"
          }}
        >
          <span
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: "#10b981",
              animation: "pulseDot 1.5s infinite"
            }}
          />
          LIVE 99.9% UPTIME
        </div>
      </div>

      {/* Service Selector Tabs */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          overflowX: "auto",
          paddingBottom: "12px",
          marginBottom: "16px",
          scrollbarWidth: "none"
        }}
      >
        {SERVICES.map((s, idx) => {
          const isActive = idx === activeIdx;
          return (
            <button
              key={s.id}
              onClick={() => setActiveIdx(idx)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 14px",
                borderRadius: "12px",
                border: isActive ? `1px solid ${s.color}` : "1px solid rgba(255,255,255,0.08)",
                background: isActive ? `${s.color}18` : "rgba(255,255,255,0.03)",
                color: isActive ? "#ffffff" : "rgba(255,255,255,0.6)",
                fontSize: "0.82rem",
                fontWeight: 700,
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "all 0.25s ease",
                boxShadow: isActive ? `0 0 16px ${s.color}30` : "none"
              }}
            >
              <span>{s.icon}</span>
              <span>{s.title}</span>
            </button>
          );
        })}
      </div>

      {/* Active Service Details Showcase Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeService.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.3 }}
          style={{
            background: "rgba(255, 255, 255, 0.03)",
            border: `1px solid ${activeService.color}40`,
            borderRadius: "16px",
            padding: "20px",
            position: "relative"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "12px",
                  background: `${activeService.color}20`,
                  border: `1px solid ${activeService.color}50`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.4rem"
                }}
              >
                {activeService.icon}
              </div>
              <div>
                <h4 style={{ margin: 0, color: "#ffffff", fontSize: "1.1rem", fontWeight: 800 }}>
                  {activeService.title}
                </h4>
                <p style={{ margin: "2px 0 0", color: activeService.color, fontSize: "0.82rem", fontWeight: 600 }}>
                  {activeService.subtitle}
                </p>
              </div>
            </div>

            <span
              style={{
                background: `${activeService.color}22`,
                border: `1px solid ${activeService.color}60`,
                color: activeService.color,
                fontSize: "0.72rem",
                fontWeight: 800,
                padding: "4px 10px",
                borderRadius: "999px",
                letterSpacing: "0.02em"
              }}
            >
              {activeService.badge}
            </span>
          </div>

          <p style={{ margin: "0 0 16px", color: "rgba(255,255,255,0.7)", fontSize: "0.88rem", lineHeight: 1.5 }}>
            {activeService.tag}
          </p>

          {/* Key Feature Bullets */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "16px" }}>
            {activeService.features.map((feat, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.83rem", color: "#e2e8f0" }}>
                <span style={{ color: activeService.color, fontWeight: "bold" }}>✦</span>
                <span>{feat}</span>
              </div>
            ))}
          </div>

          {/* Bottom Highlight Stat & Tech Tag */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              paddingTop: "12px",
              borderTop: "1px solid rgba(255,255,255,0.08)"
            }}
          >
            <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "#00d4ff" }}>
              ⚡ Impact: {activeService.metric}
            </span>
            <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.5)", fontWeight: 600 }}>
              Nexhydigital Certified
            </span>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Floating Trust Badges at Bottom */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px", marginTop: "16px" }}>
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "10px", padding: "10px", textAlign: "center" }}>
          <span style={{ display: "block", fontSize: "1rem", fontWeight: 900, color: "#00d4ff" }}>50+</span>
          <span style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.6)", fontWeight: 600 }}>Projects Delivered</span>
        </div>
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "10px", padding: "10px", textAlign: "center" }}>
          <span style={{ display: "block", fontSize: "1rem", fontWeight: 900, color: "#10b981" }}>98%</span>
          <span style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.6)", fontWeight: 600 }}>On-Time Launch</span>
        </div>
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "10px", padding: "10px", textAlign: "center" }}>
          <span style={{ display: "block", fontSize: "1rem", fontWeight: 900, color: "#f59e0b" }}>24×7</span>
          <span style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.6)", fontWeight: 600 }}>Dedicated Support</span>
        </div>
      </div>
    </div>
  );
}

