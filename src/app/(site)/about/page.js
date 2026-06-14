import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import {
  companyHighlights,
  investorMetrics,
  globalTeamMoments,
  leadershipTeam,
  technologyGroups,
} from "@/data/site-data";

export const metadata = {
  title: "About Us — Nexhydigital",
  description:
    "Nexhydigital is a Hyderabad-based IT company delivering enterprise-grade technology solutions built on trust, transparency, and technical excellence.",
};

export default function AboutPage() {
  return (
    <main>
      {/* ── Hero ── */}
      <PageHero
        eyebrow="About Us"
        title="Hyderabad-based IT company building digital futures."
        description="Nexhydigital delivers enterprise-grade technology solutions — from ERP systems to mobile apps — built on trust, transparency, and technical excellence."
      />

      {/* ── Our Story ── */}
      <section className="section">
        <div className="container">
          <div className="about-story-grid">
            {/* Left: story text */}
            <Reveal>
              <div className="lp-section-header">
                <p className="eyebrow">Our Story</p>
                <h2 className="lp-section-h2">
                  Built in Hyderabad,{" "}
                  <span className="lp-gradient-text">for every business.</span>
                </h2>
                <p className="lp-section-lead">
                  Nexhydigital was founded with a clear belief: local businesses
                  deserve world-class digital solutions at fair, honest prices.
                  We started in Hyderabad, Telangana — a city brimming with
                  entrepreneurial energy — and we&apos;ve stayed rooted here
                  while growing our capabilities nationally.
                </p>
                <p className="lp-section-lead" style={{ marginTop: "14px" }}>
                  Every project we take on is personal. We sit with founders,
                  understand their business deeply, and build exactly what they
                  need — nothing more, nothing less. No bloated agencies, no
                  account-manager layers, no surprises on the invoice.
                </p>
                <p className="lp-section-lead" style={{ marginTop: "14px" }}>
                  From a school ERP that automated 1,200 students, to a billing
                  app that made a trading firm paperless in a week — our work
                  speaks through real outcomes for real people.
                </p>
                <div style={{ marginTop: "32px" }}>
                  <Link href="/contact" className="button">
                    Talk to our team
                  </Link>
                </div>
              </div>
            </Reveal>

            {/* Right: investor metrics on dark bg */}
            <Reveal delay={0.15}>
              <div
                style={{
                  background:
                    "linear-gradient(160deg, #030c1e 0%, #061428 60%, #04102a 100%)",
                  borderRadius: "24px",
                  padding: "40px 32px",
                  border: "1px solid rgba(255,255,255,0.08)",
                  boxShadow: "0 30px 80px rgba(0,0,0,0.32)",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* bg orb */}
                <div
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    width: "300px",
                    height: "300px",
                    top: "-80px",
                    right: "-60px",
                    background:
                      "radial-gradient(circle, rgba(15,98,254,0.22), transparent 70%)",
                    filter: "blur(60px)",
                    pointerEvents: "none",
                  }}
                />
                <p
                  className="eyebrow"
                  style={{ color: "#8cb7ff", marginBottom: "28px" }}
                >
                  By the numbers
                </p>
                <div className="about-metrics-grid">
                  {investorMetrics.map((m) => (
                    <div key={m.label} className="lp-metric-card">
                      <strong>{m.value}</strong>
                      <span>{m.label}</span>
                    </div>
                  ))}
                </div>
                <p
                  style={{
                    marginTop: "28px",
                    fontSize: "0.82rem",
                    color: "rgba(255,255,255,0.38)",
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  All numbers reflect active client projects and delivered
                  solutions.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Our Values ── */}
      <section className="section section-muted">
        <div className="container">
          <Reveal>
            <div className="lp-section-header lp-section-header-center">
              <p className="eyebrow">Our Values</p>
              <h2 className="lp-section-h2">
                How we work, every single day.
              </h2>
              <p className="lp-section-lead lp-section-lead-center">
                These aren&apos;t posters on a wall — they&apos;re the
                principles that every project, call, and invoice is built on.
              </p>
            </div>
          </Reveal>

          <div className="lp-why-grid">
            {companyHighlights.map((item, i) => (
              <Reveal key={item.title} delay={i * 0.1}>
                <article className="lp-why-card">
                  <div className="lp-why-icon-wrap">
                    <span className="lp-why-icon">{item.icon}</span>
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Our Team ── */}
      <section className="section">
        <div className="container">
          <Reveal>
            <div className="lp-section-header lp-section-header-center">
              <p className="eyebrow">Our Team</p>
              <h2 className="lp-section-h2">
                People behind the{" "}
                <span className="lp-gradient-text">pixels.</span>
              </h2>
              <p className="lp-section-lead lp-section-lead-center">
                A small, focused team that works closely with every client —
                no junior hand-offs, no offshore surprises.
              </p>
            </div>
          </Reveal>

          <div className="lp-team-grid">
            {globalTeamMoments.map((item, i) => (
              <Reveal key={item.title} delay={i * 0.1}>
                <article className="lp-team-card">
                  <div className="lp-team-icon-ring">{item.icon}</div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── What We Use ── */}
      <section className="section section-muted">
        <div className="container">
          <Reveal>
            <div className="lp-section-header lp-section-header-center">
              <p className="eyebrow">Our Technology</p>
              <h2 className="lp-section-h2">What we use to build.</h2>
              <p className="lp-section-lead lp-section-lead-center">
                Modern, battle-tested tools across every layer of the stack.
              </p>
            </div>
          </Reveal>

          <div className="about-tech-grid">
            {technologyGroups.map((group, i) => (
              <Reveal key={group.title} delay={i * 0.08}>
                <div
                  style={{
                    background: "var(--surface)",
                    border: "1px solid var(--line)",
                    borderRadius: "18px",
                    padding: "28px 22px",
                    boxShadow: "var(--shadow)",
                    transition: "transform 220ms ease, border-color 220ms ease",
                  }}
                  className="highlight-card"
                >
                  <p
                    className="eyebrow"
                    style={{ marginBottom: "16px", fontSize: "0.72rem" }}
                  >
                    {group.title}
                  </p>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                    }}
                  >
                    {group.items.map((item) => (
                      <span
                        key={item}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "8px",
                          fontSize: "0.88rem",
                          color: "var(--text)",
                          padding: "7px 12px",
                          borderRadius: "8px",
                          background: "var(--surface-alt)",
                          border: "1px solid var(--line)",
                          fontWeight: 500,
                        }}
                      >
                        <span
                          style={{
                            width: "6px",
                            height: "6px",
                            borderRadius: "50%",
                            background: "var(--accent)",
                            flexShrink: 0,
                            opacity: 0.7,
                          }}
                        />
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Leadership ── */}
      <section className="section section-muted">
        <div className="container">
          <Reveal>
            <div className="lp-section-header lp-section-header-center">
              <p className="eyebrow">Leadership</p>
              <h2 className="lp-section-h2">
                The people you&apos;ll work with.
              </h2>
              <p className="lp-section-lead lp-section-lead-center">
                At Nexhydigital, leadership is hands-on. The people who scope your
                project are the same people who build it.
              </p>
            </div>
          </Reveal>

          <div className="about-leader-grid">
            {leadershipTeam.map((person, i) => (
              <Reveal key={person.name} delay={i * 0.1}>
                <article
                  style={{
                    padding: "36px 28px",
                    borderRadius: "22px",
                    border: "1px solid var(--line)",
                    background: "var(--surface)",
                    boxShadow: "var(--shadow)",
                    textAlign: "center",
                    transition:
                      "transform 250ms ease, box-shadow 250ms ease, border-color 250ms ease",
                    position: "relative",
                    overflow: "hidden",
                  }}
                  className="highlight-card"
                >
                  {/* Gradient avatar with initial */}
                  <div
                    style={{
                      width: "84px",
                      height: "84px",
                      borderRadius: "50%",
                      background:
                        "linear-gradient(135deg, #0f62fe 0%, #00d4ff 60%, #00ff88 100%)",
                      display: "grid",
                      placeItems: "center",
                      margin: "0 auto 20px",
                      fontSize: "2rem",
                      fontWeight: 900,
                      color: "#fff",
                      boxShadow:
                        "0 8px 32px rgba(15,98,254,0.35), 0 0 0 4px rgba(15,98,254,0.12)",
                      flexShrink: 0,
                    }}
                  >
                    {person.name.charAt(0)}
                  </div>

                  <h3
                    style={{
                      margin: "0 0 6px",
                      fontSize: "1.1rem",
                      fontWeight: 800,
                      color: "var(--primary)",
                    }}
                  >
                    {person.name}
                  </h3>

                  <p
                    style={{
                      margin: "0 0 14px",
                      fontSize: "0.82rem",
                      fontWeight: 700,
                      color: "var(--accent)",
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                    }}
                  >
                    {person.role}
                  </p>

                  <p
                    style={{
                      margin: 0,
                      fontSize: "0.92rem",
                      color: "var(--muted)",
                      lineHeight: 1.65,
                    }}
                  >
                    {person.description}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section
        style={{
          background: "linear-gradient(160deg, #030c1e, #061428)",
          padding: "100px 0",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* bg orbs */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            width: "500px",
            height: "500px",
            top: "-120px",
            left: "-100px",
            background:
              "radial-gradient(circle, rgba(15,98,254,0.2), transparent 70%)",
            filter: "blur(80px)",
            pointerEvents: "none",
          }}
        />
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            width: "380px",
            height: "380px",
            bottom: "-80px",
            right: "-60px",
            background:
              "radial-gradient(circle, rgba(0,212,255,0.14), transparent 70%)",
            filter: "blur(80px)",
            pointerEvents: "none",
          }}
        />

        <div
          className="container"
          style={{ textAlign: "center", position: "relative", zIndex: 1 }}
        >
          <Reveal>
            <p className="eyebrow" style={{ color: "#8cb7ff" }}>
              Work With Us
            </p>
            <h2
              style={{
                margin: "12px 0 20px",
                fontSize: "clamp(2rem, 4vw, 3.4rem)",
                fontWeight: 900,
                color: "#ffffff",
                letterSpacing: "-0.03em",
                lineHeight: 1.1,
              }}
            >
              Ready to start your{" "}
              <span className="lp-gradient-text">digital transformation?</span>
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
              Talk to our team. Free consultation, honest scope, transparent
              pricing.
            </p>
            <div
              style={{
                display: "flex",
                gap: "14px",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <Link href="/contact" className="button button-glow">
                Get Free Consultation
              </Link>
              <Link href="/services" className="button button-glass">
                Explore Our Services →
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
