"use client";

import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { solutions, industries, techStack, roadmapSteps } from "@/data/site-data";

export default function ServicesPage() {
  return (
    <main>
      <PageHero
        eyebrow="Our Services"
        title="Enterprise digital solutions built for scale."
        description="From ERP systems and school platforms to mobile apps and ongoing maintenance — every solution is engineered for reliability, speed, and long-term value."
        actions={[
          { href: "/contact", label: "Get a Free Quote" },
          { href: "/portfolio", label: "See Portfolio" },
        ]}
      />

      {/* ── Services Bento Grid ───────────────────────────── */}
      <section className="section">
        <div className="container">
          <Reveal className="lp-section-header">
            <p className="eyebrow">What We Build</p>
            <h2 className="lp-section-h2">
              Every service, <span className="lp-gradient-text">engineered to deliver</span>
            </h2>
          </Reveal>

          <div className="lp-bento-grid">
            {solutions.map((item, i) => (
              <Reveal delay={i * 0.07} key={item.title}>
                <article className={`lp-bento-card${i === 0 || i === 3 ? " lp-bento-wide" : ""}`}>
                  <div className="lp-bento-icon">{item.icon}</div>
                  <h3 className="lp-bento-title">{item.title}</h3>
                  <p className="lp-bento-desc">{item.description}</p>
                  <Link href="/contact" className="lp-bento-arrow" style={{ opacity: 1, transform: "none", textDecoration: "none" }}>
                    Get a Quote →
                  </Link>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Industries ───────────────────────────────────── */}
      <section className="section section-muted">
        <div className="container">
          <Reveal className="lp-section-header">
            <p className="eyebrow">Industries We Serve</p>
            <h2 className="lp-section-h2">
              Vertical solutions for <span className="lp-gradient-text">every sector</span>
            </h2>
          </Reveal>
          <div className="lp-industry-grid">
            {industries.map((item, i) => (
              <Reveal delay={i * 0.07} key={item.title}>
                <article className="lp-industry-card">
                  <span className="lp-industry-icon">{item.icon}</span>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <div className="lp-industry-badge">{item.caseStudy}</div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Tech Stack Dark ──────────────────────────────── */}
      <section style={{ padding: "80px 0", background: "linear-gradient(160deg,#030c1e,#061428)" }}>
        <div className="container">
          <Reveal className="lp-section-header lp-section-header-center">
            <p className="eyebrow" style={{ color: "#8cb7ff" }}>Technology</p>
            <h2 className="lp-section-h2 lp-section-h2-light">
              Modern tools, <span style={{ color: "#00d4ff" }}>proven in production</span>
            </h2>
          </Reveal>
          <div className="lp-tech-grid">
            {techStack.map((t) => (
              <div key={t.name} className="lp-tech-chip" style={{ "--chip-accent": t.color }}>
                <span className="lp-tech-dot" />
                {t.name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How We Work ─────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <Reveal className="lp-section-header">
            <p className="eyebrow">Our Process</p>
            <h2 className="lp-section-h2">How we turn your idea <span className="lp-gradient-text">into reality</span></h2>
          </Reveal>

          <div style={{ display: "flex", flexDirection: "column", gap: "20px", maxWidth: "860px" }}>
            {roadmapSteps.map((step, i) => (
              <Reveal delay={i * 0.08} key={step.step}>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "80px 1fr",
                  gap: "28px",
                  alignItems: "flex-start",
                  padding: "28px",
                  borderRadius: "18px",
                  border: "1px solid var(--line)",
                  background: "var(--surface)",
                  boxShadow: "var(--shadow)",
                  transition: "all 240ms ease"
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = "color-mix(in srgb, var(--accent) 35%, var(--line))"; e.currentTarget.style.transform = "translateX(6px)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--line)"; e.currentTarget.style.transform = ""; }}>
                  <div style={{
                    fontSize: "2.4rem",
                    fontWeight: 900,
                    lineHeight: 1,
                    background: "linear-gradient(135deg,#0f62fe,#00d4ff)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    textAlign: "center",
                    paddingTop: "4px"
                  }}>
                    {step.step}
                  </div>
                  <div>
                    <h3 style={{ margin: "0 0 10px", fontWeight: 800, color: "var(--primary)", fontSize: "1.1rem" }}>{step.title}</h3>
                    <p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.7, fontSize: "0.95rem" }}>{step.description}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────── */}
      <PageHero
        eyebrow="Get Started"
        title="Tell us what you need — we build the rest."
        description="Every project starts with a free consultation and a clear written proposal. No commitment needed."
        actions={[
          { href: "/contact", label: "Free Consultation →" },
          { href: "/portfolio", label: "See Our Work" },
        ]}
      />
    </main>
  );
}
