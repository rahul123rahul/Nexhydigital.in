"use client";

import { useState } from "react";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";

export function ServiceLandingPage({
  eyebrow,
  title,
  description,
  serviceName,
  highlightsTitle,
  highlightsSubtitle,
  highlights = [],
  faqs = [],
  schemas = [],
}) {
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <main suppressHydrationWarning>
      {/* ── JSON-LD Schemas ───────────────────────────────── */}
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      {/* ── Hero ─────────────────────────────────────────── */}
      <PageHero
        eyebrow={eyebrow}
        title={title}
        description={description}
        actions={[
          { href: `/contact?service=${encodeURIComponent(serviceName)}`, label: "Get a Free Quote" },
          { href: "/portfolio", label: "See Our Work" },
        ]}
      />

      {/* ── Highlights / Bento Grid ─────────────────────── */}
      <section className="section" style={{ background: "var(--surface)" }}>
        <div className="container">
          <Reveal className="lp-section-header">
            <p className="eyebrow">{serviceName} Capabilities</p>
            <h2 className="lp-section-h2">
              {highlightsTitle || "Engineered for excellence,"}{" "}
              <span className="lp-gradient-text">{highlightsSubtitle || "built to scale"}</span>
            </h2>
          </Reveal>

          <div className="lp-bento-grid">
            {highlights.map((item, i) => (
              <Reveal delay={i * 0.08} key={item.title}>
                <article className={`lp-bento-card${i === 0 || i === 3 ? " lp-bento-wide" : ""}`}>
                  <div className="lp-bento-icon" style={{ fontSize: "2rem", marginBottom: "16px" }}>{item.icon}</div>
                  <h3 className="lp-bento-title" style={{ fontSize: "1.25rem", fontWeight: 800, margin: "0 0 10px 0" }}>{item.title}</h3>
                  <p className="lp-bento-desc" style={{ color: "var(--muted)", lineHeight: 1.6, fontSize: "0.95rem" }}>{item.description}</p>
                  <Link
                    href={`/contact?service=${encodeURIComponent(serviceName)}`}
                    className="lp-bento-arrow"
                    style={{ opacity: 1, transform: "none", textDecoration: "none", marginTop: "16px", display: "inline-block" }}
                  >
                    Discuss Feature →
                  </Link>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Service Details & Why Choose Us ──────────────── */}
      <section className="section section-muted" style={{ borderTop: "1px solid var(--line)" }}>
        <div className="container">
          <div className="about-story-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "60px", alignItems: "center" }}>
            <Reveal>
              <div className="lp-section-header">
                <p className="eyebrow">Local Expertise</p>
                <h2 className="lp-section-h2">
                  Hyderabad-Based <span className="lp-gradient-text">Engineering Team</span>
                </h2>
                <p className="lp-section-lead" style={{ margin: "14px 0" }}>
                  We don't outsource our development. Nexhy Digital has a dedicated team of frontend, backend, and full-stack engineers based locally in Hyderabad. We work directly with you to ensure your project alignment.
                </p>
                <p className="lp-section-lead" style={{ margin: "14px 0" }}>
                  Every solution includes custom design, clean production-ready code, rigorous manual and automated testing, and complimentary support to guarantee absolute stability.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.15}>
              <div
                style={{
                  background: "linear-gradient(160deg, #030c1e 0%, #061428 60%, #04102a 100%)",
                  borderRadius: "24px",
                  padding: "40px 32px",
                  border: "1px solid rgba(255,255,255,0.08)",
                  boxShadow: "0 30px 80px rgba(0,0,0,0.32)",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    width: "300px",
                    height: "300px",
                    top: "-80px",
                    right: "-60px",
                    background: "radial-gradient(circle, rgba(15,98,254,0.22), transparent 70%)",
                    filter: "blur(60px)",
                    pointerEvents: "none",
                  }}
                />
                <h3 className="eyebrow" style={{ color: "#8cb7ff", marginBottom: "20px" }}>Why Work With Us?</h3>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "20px" }}>
                  <li style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                    <span style={{ fontSize: "1.5rem", color: "#00d4ff", lineHeight: 1 }}>🛡️</span>
                    <div>
                      <h4 style={{ margin: "0 0 4px 0", color: "#fff", fontWeight: 700 }}>Direct Accountability</h4>
                      <p style={{ margin: 0, color: "rgba(255,255,255,0.6)", fontSize: "0.9rem" }}>Work directly with creators — no account manager filters or delays.</p>
                    </div>
                  </li>
                  <li style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                    <span style={{ fontSize: "1.5rem", color: "#00d4ff", lineHeight: 1 }}>⚡</span>
                    <div>
                      <h4 style={{ margin: "0 0 4px 0", color: "#fff", fontWeight: 700 }}>Fast On-time Delivery</h4>
                      <p style={{ margin: 0, color: "rgba(255,255,255,0.6)", fontSize: "0.9rem" }}>Sprints and milestones ensure your project goes live within weeks.</p>
                    </div>
                  </li>
                  <li style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                    <span style={{ fontSize: "1.5rem", color: "#00d4ff", lineHeight: 1 }}>🔧</span>
                    <div>
                      <h4 style={{ margin: "0 0 4px 0", color: "#fff", fontWeight: 700 }}>Lifetime Support Available</h4>
                      <p style={{ margin: 0, color: "rgba(255,255,255,0.6)", fontSize: "0.9rem" }}>Complementary support period + SLA maintenance retainers.</p>
                    </div>
                  </li>
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── FAQ Section ──────────────────────────────────── */}
      {faqs.length > 0 && (
        <section className="section" style={{ background: "var(--surface)", borderTop: "1px solid var(--line)" }}>
          <div className="container" style={{ maxWidth: "800px" }}>
            <Reveal className="lp-section-header lp-section-header-center">
              <p className="eyebrow">Frequently Asked Questions</p>
              <h2 className="lp-section-h2">Got Questions? <span className="lp-gradient-text">We Have Answers</span></h2>
            </Reveal>

            <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginTop: "40px" }}>
              {faqs.map((faq, index) => {
                const isOpen = openFaqIndex === index;
                return (
                  <Reveal key={index} delay={index * 0.05}>
                    <div
                      style={{
                        background: "var(--surface-alt)",
                        border: "1px solid var(--line)",
                        borderRadius: "14px",
                        overflow: "hidden",
                        transition: "all 200ms ease",
                      }}
                    >
                      <button
                        onClick={() => toggleFaq(index)}
                        style={{
                          width: "100%",
                          padding: "20px 24px",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          background: "none",
                          border: "none",
                          textAlign: "left",
                          cursor: "pointer",
                          color: "var(--primary)",
                          fontWeight: 700,
                          fontSize: "1.05rem",
                        }}
                      >
                        <span>{faq.q}</span>
                        <span style={{ fontSize: "1.2rem", color: "var(--accent)", transition: "transform 200ms ease", transform: isOpen ? "rotate(45deg)" : "rotate(0deg)" }}>
                          ＋
                        </span>
                      </button>
                      <div
                        style={{
                          maxHeight: isOpen ? "300px" : "0",
                          opacity: isOpen ? 1 : 0,
                          overflow: "hidden",
                          transition: "all 240ms ease-in-out",
                        }}
                      >
                        <p style={{ padding: "0 24px 24px 24px", margin: 0, color: "var(--muted)", lineHeight: 1.7, fontSize: "0.95rem" }}>
                          {faq.a}
                        </p>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── Bottom CTA ───────────────────────────────────── */}
      <section
        style={{
          background: "linear-gradient(160deg, #030c1e, #061428)",
          padding: "100px 0",
          position: "relative",
          overflow: "hidden",
          borderTop: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            width: "500px",
            height: "500px",
            top: "-120px",
            left: "-100px",
            background: "radial-gradient(circle, rgba(15,98,254,0.2), transparent 70%)",
            filter: "blur(80px)",
            pointerEvents: "none",
          }}
        />
        <div
          className="container"
          style={{ textAlign: "center", position: "relative", zIndex: 1 }}
        >
          <Reveal>
            <p className="eyebrow" style={{ color: "#8cb7ff" }}>Start Your Project</p>
            <h2
              style={{
                margin: "12px 0 20px",
                fontSize: "clamp(2rem, 4vw, 3.2rem)",
                fontWeight: 900,
                color: "#ffffff",
                letterSpacing: "-0.03em",
                lineHeight: 1.1,
              }}
            >
              Get a custom proposal <span className="lp-gradient-text">within 24 hours.</span>
            </h2>
            <p
              style={{
                maxWidth: "52ch",
                margin: "0 auto 36px",
                fontSize: "1.05rem",
                color: "rgba(255,255,255,0.65)",
                lineHeight: 1.7,
              }}
            >
              Contact our Hyderabad team. We'll outline features, timelines, and provide a fixed price quote. No obligations.
            </p>
            <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
              <Link href={`/contact?service=${encodeURIComponent(serviceName)}`} className="button button-glow">
                Request Quote For {serviceName}
              </Link>
              <Link href="/contact" className="button button-glass">
                Ask a Question →
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
