"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { AnimatedCounter } from "@/components/landing-page/animated-counter";
import { HeroSystems } from "@/components/landing-page/hero-systems";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import {
  clientLogos,
  faqs,
  solutions,
  techStack,
  testimonials,
  trustCounters,
  trustPartners,
} from "@/data/site-data";

/* ─── Floating particle background ─── */
function ParticleBg() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let w = (canvas.width = canvas.offsetWidth);
    let h = (canvas.height = canvas.offsetHeight);
    const particles = Array.from({ length: 55 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.6 + 0.4,
      dx: (Math.random() - 0.5) * 0.35,
      dy: (Math.random() - 0.5) * 0.35,
      o: Math.random() * 0.5 + 0.12,
    }));
    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(111,168,255,${p.o})`;
        ctx.fill();
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0 || p.x > w) p.dx *= -1;
        if (p.y < 0 || p.y > h) p.dy *= -1;
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    const onResize = () => {
      w = canvas.width = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener("resize", onResize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", onResize); };
  }, []);
  return <canvas ref={canvasRef} className="lp-particle-canvas" aria-hidden="true" />;
}

/* ─── FAQ Accordion ─── */
function FaqAccordion({ items }) {
  const [open, setOpen] = useState(null);
  return (
    <div className="lp-faq-list">
      {items.map((item, i) => (
        <div key={i} className={`lp-faq-item${open === i ? " lp-faq-open" : ""}`}>
          <button className="lp-faq-q" onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i}>
            <span>{item.q}</span>
            <span className="lp-faq-icon">{open === i ? "−" : "+"}</span>
          </button>
          {open === i && <div className="lp-faq-a"><p>{item.a}</p></div>}
        </div>
      ))}
    </div>
  );
}



/* ─── Vision & Mission Card with Silver Shine Crosshair ─── */
function VisionMissionCard({ title, subtitle, description, icon, points }) {
  const cardRef = useRef(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <motion.div
      ref={cardRef}
      className="vm-card"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
    >
      {/* Silver Shine Cross */}
      {hovered && (
        <>
          <div className="vm-crosshair-v" style={{ left: `${coords.x}px` }} />
          <div className="vm-crosshair-h" style={{ top: `${coords.y}px` }} />
          <div className="vm-shine-glow" style={{ left: `${coords.x}px`, top: `${coords.y}px` }} />
        </>
      )}

      <div className="vm-card-inner">
        <div className="vm-card-icon">{icon}</div>
        <h3 className="vm-card-title">{title}</h3>
        <p className="vm-card-subtitle">{subtitle}</p>
        <p className="vm-card-desc">{description}</p>
        {points && (
          <ul className="vm-card-points">
            {points.map((pt, index) => (
              <li key={index}>
                <span className="vm-bullet">✦</span>
                <span>{pt}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </motion.div>
  );
}

const defaultPlansFallback = [
  {
    id: "basic",
    name: "Basic Website",
    price: "₹10,000–₹20,000",
    billing_cycle: "one-time",
    free_trial_days: 0,
    active: true,
    features: {
      pages: "Up to 5",
      responsive: "✓",
      contactForm: "✓",
      seoSetup: "Basic",
      blogModule: "✗",
      cmsPanel: "✗",
      customDesign: "✗",
      paymentGateway: "✗",
      productMgmt: "✗",
      userLogin: "✗",
      analytics: "✓",
      support: "1 Month"
    }
  },
  {
    id: "business",
    name: "Business Website",
    price: "₹25,000–₹50,000",
    billing_cycle: "one-time",
    free_trial_days: 0,
    active: true,
    features: {
      pages: "Up to 15",
      responsive: "✓",
      contactForm: "✓",
      seoSetup: "Advanced",
      blogModule: "✓",
      cmsPanel: "✓",
      customDesign: "✓",
      paymentGateway: "✗",
      productMgmt: "✗",
      userLogin: "Optional",
      analytics: "✓",
      support: "3 Months"
    }
  },
  {
    id: "premium",
    name: "Premium Website",
    price: "₹60,000–₹1,00,000+",
    billing_cycle: "one-time",
    free_trial_days: 0,
    active: true,
    features: {
      pages: "Unlimited",
      responsive: "✓",
      contactForm: "✓",
      seoSetup: "Advanced",
      blogModule: "✓",
      cmsPanel: "✓",
      customDesign: "✓",
      paymentGateway: "Optional",
      productMgmt: "Optional",
      userLogin: "✓",
      analytics: "✓",
      support: "6 Months"
    }
  },
  {
    id: "ecommerce",
    name: "E-Commerce Website",
    price: "₹50,000–₹2,00,000+",
    billing_cycle: "one-time",
    free_trial_days: 0,
    active: true,
    features: {
      pages: "Unlimited",
      responsive: "✓",
      contactForm: "✓",
      seoSetup: "Advanced",
      blogModule: "✓",
      cmsPanel: "✓",
      customDesign: "✓",
      paymentGateway: "✓",
      productMgmt: "✓",
      userLogin: "✓",
      analytics: "✓",
      support: "12 Months"
    }
  }
];

export default function HomePage() {
  const [announcements, setAnnouncements] = useState([]);
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    fetch("/api/announcements")
      .then(res => res.json())
      .then(data => {
        if (data.ok) setAnnouncements(data.data);
      })
      .catch(err => console.error("Error fetching announcements:", err));

    fetch("/api/plans")
      .then(res => res.json())
      .then(data => {
        if (data.ok) setPlans(data.data);
      })
      .catch(err => console.error("Error fetching plans:", err));
  }, []);

  const renderFeatureValue = (val) => {
    const cleanVal = val || "✗";
    if (cleanVal === "✓") {
      return <span style={{ color: "#10b981", fontWeight: "bold", fontSize: "1.2rem" }}>✓</span>;
    }
    if (cleanVal === "✗") {
      return <span style={{ color: "#ef4444", fontWeight: "bold", fontSize: "1.1rem", opacity: 0.5 }}>✗</span>;
    }
    if (cleanVal === "Optional") {
      return <span style={{
        background: "rgba(14, 165, 233, 0.15)",
        color: "#38bdf8",
        padding: "2px 8px",
        borderRadius: "4px",
        fontSize: "0.75rem",
        fontWeight: 700
      }}>Optional</span>;
    }
    return <span style={{ color: "rgba(255, 255, 255, 0.7)", fontSize: "0.9rem" }}>{cleanVal}</span>;
  };

  // 3D Mouse Tracking Setup for Hero Banner
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / rect.width - 0.5);
    y.set(mouseY / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <main className="lp-main">

      {/* ═══════════════════════════════ HERO ═══════════════════════════════ */}
      <section className="lp-hero" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} style={{ perspective: "3000px", position: "relative" }}>
        <ParticleBg />
        <div className="lp-hero-bg-mesh" aria-hidden="true" />
        <div className="lp-hero-orb lp-hero-orb-1" aria-hidden="true" />
        <div className="lp-hero-orb lp-hero-orb-2" aria-hidden="true" />
        <div className="lp-hero-orb lp-hero-orb-3" aria-hidden="true" />
        <div className="lp-hero-grid-lines" aria-hidden="true" />

        <motion.div 
          className="container lp-hero-inner"
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        >
          <Reveal>
            <motion.div className="lp-hero-content" style={{ translateZ: "50px" }}>
              <div className="lp-hero-pill">
                <span className="lp-hero-pill-dot" />
                🚀 Hyderabad-Based Enterprise IT Partner
              </div>
              <h1 className="lp-hero-h1">
                We Build Digital
                <span className="lp-gradient-text"> Ecosystems</span>
                <br />
                That Drive Growth
              </h1>
              <p className="lp-hero-lead">
                Nexhydigital delivers world-class ERP systems, school management platforms, mobile apps,
                and custom web solutions — engineered for reliability, built for scale.
              </p>
              <div className="lp-hero-actions">
                <Link className="button button-glow lp-hero-btn-primary" href="/services">
                  <span>Explore Solutions</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </Link>
                <Link className="button button-glass" href="/contact">
                  💬 Free Consultation
                </Link>
              </div>
              <div className="lp-hero-trust">
                <span className="lp-hero-trust-label">Trusted by:</span>
                {clientLogos.slice(0, 4).map((l) => (
                  <span key={l} className="lp-hero-trust-tag">{l}</span>
                ))}
              </div>
            </motion.div>
          </Reveal>

          <Reveal delay={0.1}>
            <motion.div 
              className="lp-hero-visual" 
              style={{ 
                translateZ: "80px", 
                border: "none", 
                display: "flex", 
                flexWrap: "wrap", 
                width: "100%", 
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <HeroSystems />
            </motion.div>
          </Reveal>
        </motion.div>

        {/* ── Wave Form Border ── */}
        <div style={{ position: "absolute", bottom: -3, left: 0, width: "100%", overflow: "hidden", lineHeight: 0, zIndex: 20 }}>
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" style={{ display: "block", width: "100%", height: "60px" }}>
            <motion.path 
              d="M0,60 C300,120 300,0 600,60 C900,120 900,0 1200,60 L1200,120 L0,120 Z"
              fill="var(--background, var(--surface, #fffefe))"
              style={{ opacity: 0.4 }}
              animate={{ d: [
                "M0,60 C300,120 300,0 600,60 C900,120 900,0 1200,60 L1200,120 L0,120 Z", 
                "M0,60 C300,0 300,120 600,60 C900,0 900,120 1200,60 L1200,120 L0,120 Z", 
                "M0,60 C300,120 300,0 600,60 C900,120 900,0 1200,60 L1200,120 L0,120 Z"
              ] }}
              transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.path 
              d="M0,60 C300,0 300,120 600,60 C900,0 900,120 1200,60 L1200,120 L0,120 Z"
              fill="var(--background, var(--surface, #ece9e9))"
              animate={{ d: [
                "M0,60 C300,0 300,120 600,60 C900,0 900,120 1200,60 L1200,120 L0,120 Z", 
                "M0,60 C300,120 300,0 600,60 C900,120 900,0 1200,60 L1200,120 L0,120 Z", 
                "M0,60 C300,0 300,120 600,60 C900,0 900,120 1200,60 L1200,120 L0,120 Z"
              ] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            />
          </svg>
        </div>
      </section>

      {/* ── Scrolling Announcement Ticker ── */}
      {announcements && announcements.length > 0 && (
        <div style={{
          background: "linear-gradient(90deg, #020617 0%, #0f172a 50%, #020617 100%)",
          borderTop: "1px solid rgba(15, 98, 254, 0.25)",
          borderBottom: "1px solid rgba(15, 98, 254, 0.25)",
          padding: "14px 0",
          overflow: "hidden",
          position: "relative",
          zIndex: 25,
          boxShadow: "0 4px 30px rgba(0, 0, 0, 0.4)"
        }}>
          <div style={{
            display: "flex",
            width: "max-content",
            animation: "marqueeScroll 35s linear infinite",
            gap: "80px"
          }}>
            {[...announcements, ...announcements, ...announcements].map((ann, i) => (
              <div key={i} style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                color: "#fff",
                fontSize: "0.92rem",
                fontWeight: 600,
                letterSpacing: "0.5px",
                whiteSpace: "nowrap"
              }}>
                <span style={{
                  background: "linear-gradient(135deg, #0f62fe, #00d4ff)",
                  color: "#fff",
                  padding: "4px 10px",
                  borderRadius: "6px",
                  fontSize: "0.75rem",
                  fontWeight: 800,
                  textTransform: "uppercase",
                  boxShadow: "0 0 10px rgba(15, 98, 254, 0.5)",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px"
                }}>
                  <span style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    background: "#fff",
                    animation: "pulseFlash 1.5s infinite"
                  }} />
                  Live Announcement
                </span>
                <span style={{ color: "#e2e8f0" }}>{ann.message}</span>
              </div>
            ))}
          </div>
          <style dangerouslySetInnerHTML={{__html: `
            @keyframes marqueeScroll {
              0% { transform: translate3d(0, 0, 0); }
              100% { transform: translate3d(-33.3333%, 0, 0); }
            }
            @keyframes pulseFlash {
              0% { opacity: 0.3; }
              50% { opacity: 1; }
              100% { opacity: 0.3; }
            }
          `}} />
        </div>
      )}

      {/* ════════════════════════ VISION & MISSION ════════════════════════ */}
      <section className="vm-section">
        <div className="container">
          <Reveal className="vm-section-header">
            <p className="eyebrow">Our Core Values</p>
            <h2 className="lp-section-h2">
              Empowering the future with <br />
              <span className="lp-gradient-text">vision and purpose</span>
            </h2>
            <p className="lp-section-lead" style={{ margin: "0 auto", maxWidth: "600px", textAlign: "center" }}>
              How we approach technology, architecture, and engineering to deliver long-term value.
            </p>
          </Reveal>

          <div className="vm-grid">
            <Reveal delay={0.05}>
              <VisionMissionCard
                title="Our Vision"
                subtitle="Next-Gen Architecture"
                description="To be India's premier boutique technology solutions agency, pioneering high-performance web ecosystems, state-of-the-art ERP systems, and cloud architecture that empowers businesses to scale dynamically and lead in the digital era."
                icon={
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                }
                points={[
                  "AI-integrated enterprise web platforms",
                  "Ultra-scalable microservices backend design",
                  "Intuitive, barrier-free user interfaces"
                ]}
              />
            </Reveal>

            <Reveal delay={0.15}>
              <VisionMissionCard
                title="Our Mission"
                subtitle="Engineering Excellence"
                description="To engineer robust, highly available custom software applications with absolute transparency, exceptional performance, and comprehensive post-launch maintenance, transforming complex processes into automated growth engines."
                icon={
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <path d="m4.93 4.93 4.24 4.24" />
                    <path d="m14.83 9.17 4.24-4.24" />
                    <path d="m14.83 14.83 4.24 4.24" />
                    <path d="m9.17 14.83-4.24 4.24" />
                    <circle cx="12" cy="12" r="4" />
                  </svg>
                }
                points={[
                  "Uncompromising 99.9% uptime SLA contracts",
                  "Iterative agile development cycles",
                  "Robust customer-focused data security"
                ]}
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ══════════════════════════ SERVICES BENTO ══════════════════════════ */}
      <section className="section lp-services">
        <div className="container">
          <Reveal className="lp-section-header">
            <p className="eyebrow">What We Build</p>
            <h2 className="lp-section-h2">
              End-to-end digital solutions <br />
              <span className="lp-gradient-text">tailored for your business</span>
            </h2>
            <p className="lp-section-lead">
              From ERP systems to mobile apps — we bring enterprise-grade engineering to businesses of all sizes.
            </p>
          </Reveal>

          <div className="lp-bento-grid">
            {solutions.map((item, i) => (
              <Reveal delay={i * 0.07} key={item.title}>
                <motion.article 
                  className={`lp-bento-card${i === 0 || i === 3 ? " lp-bento-wide" : ""}`}
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="lp-bento-icon">{item.icon}</div>
                  <h3 className="lp-bento-title">{item.title}</h3>
                  <p className="lp-bento-desc">{item.description}</p>
                  <div className="lp-bento-arrow">→</div>
                </motion.article>
              </Reveal>
            ))}
          </div>

          <div className="lp-services-cta">
            <Link className="button" href="/services">View All Services →</Link>
          </div>
        </div>
      </section>

      {/* ════════════════════════════ COUNTERS ══════════════════════════════ */}
      <section className="lp-counters">
        <div className="container lp-counters-grid">
          {trustCounters.map((item) => (
            <AnimatedCounter key={item.label} label={item.label} suffix={item.suffix} value={item.value} />
          ))}
        </div>
      </section>

      {/* ═══════════════════════ TECH STACK ══════════════════════════════════ */}
      <section className="lp-tech-section">
        <div className="container">
          <Reveal className="lp-section-header lp-section-header-center">
            <p className="eyebrow">Technology Stack</p>
            <h2 className="lp-section-h2">Modern tools, <span className="lp-gradient-text">proven in production</span></h2>
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

      {/* ═══════════════════════ TESTIMONIALS ════════════════════════════════ */}
      <section className="section lp-testimonials-section">
        <div className="lp-testimonials-glow" aria-hidden="true" />
        <div className="container">
          <Reveal className="lp-section-header lp-section-header-center">
            <p className="eyebrow" style={{ color: "#8cb7ff" }}>Client Testimonials</p>
            <h2 className="lp-section-h2 lp-section-h2-light">Trusted by businesses <span style={{ color: "#00d4ff" }}>across Hyderabad</span></h2>
          </Reveal>

          <div className="lp-testimonials-grid">
            {testimonials.map((item, i) => (
              <Reveal delay={i * 0.1} key={item.name}>
                <motion.article 
                  className="lp-testimonial-card"
                  whileHover={{ y: -5, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="lp-testimonial-stars">★★★★★</div>
                  <p className="lp-testimonial-quote">"{item.quote}"</p>
                  <div className="lp-testimonial-author">
                    <div className="lp-testimonial-avatar">
                      {item.name[0]}
                    </div>
                    <div>
                      <strong>{item.name}</strong>
                      <span>{item.title}</span>
                    </div>
                  </div>
                </motion.article>
              </Reveal>
            ))}
          </div>

          <div className="lp-trust-partners">
            {trustPartners.map((p) => (
              <span key={p} className="lp-trust-partner-chip">{p}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Careers section removed as requested */}

      {/* ═══════════════════════ PRICING PLANS ═══════════════════════════════ */}
      <section id="pricing" className="section" style={{ background: "linear-gradient(180deg, rgba(15, 23, 42, 0.3) 0%, rgba(15, 23, 42, 0) 100%)", borderTop: "1px solid rgba(255, 255, 255, 0.05)" }}>
        <div className="container">
          <Reveal className="lp-section-header lp-section-header-center">
            <p className="eyebrow" style={{ color: "#38bdf8" }}>Pricing Matrix</p>
            <h2 className="lp-section-h2">Find the perfect plan for <span className="lp-gradient-text">your business scope</span></h2>
            <p className="lp-section-lead" style={{ margin: "0 auto 40px auto", maxWidth: "600px" }}>
              Transparent pricing models with absolute clarity on deliverables. Choose a template or custom scope.
            </p>
          </Reveal>

          {/* Pricing Cards Grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "24px",
            marginBottom: "56px"
          }}>
            {(plans.length > 0 ? plans : defaultPlansFallback).map((plan) => (
              <motion.div
                key={plan.id}
                style={{
                  background: "#0b1329",
                  border: plan.id === "business" || plan.id === "premium" ? "2px solid #0f62fe" : "1px solid rgba(255, 255, 255, 0.08)",
                  borderRadius: "24px",
                  padding: "32px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  position: "relative",
                  boxShadow: plan.id === "business" || plan.id === "premium" ? "0 16px 40px rgba(15, 98, 254, 0.2)" : "0 10px 30px rgba(0,0,0,0.2)"
                }}
                whileHover={{ y: -8 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                {plan.id === "business" && (
                  <span style={{
                    position: "absolute",
                    top: "-12px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: "linear-gradient(135deg, #0f62fe, #00d4ff)",
                    color: "#fff",
                    fontSize: "0.72rem",
                    fontWeight: 900,
                    padding: "4px 14px",
                    borderRadius: "999px",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    boxShadow: "0 0 15px rgba(15, 98, 254, 0.4)"
                  }}>
                    Popular Selection
                  </span>
                )}
                {plan.id === "premium" && (
                  <span style={{
                    position: "absolute",
                    top: "-12px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: "linear-gradient(135deg, #a855f7, #ec4899)",
                    color: "#fff",
                    fontSize: "0.72rem",
                    fontWeight: 900,
                    padding: "4px 14px",
                    borderRadius: "999px",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    boxShadow: "0 0 15px rgba(168, 85, 247, 0.4)"
                  }}>
                    Premium Choice
                  </span>
                )}
                <div>
                  <h3 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 800, color: "#fff" }}>{plan.name}</h3>
                  
                  <div style={{ display: "flex", alignItems: "baseline", gap: "6px", margin: "20px 0 6px 0" }}>
                    <strong style={{ fontSize: "2rem", fontWeight: 900, color: "#fff" }}>
                      {plan.price}
                    </strong>
                  </div>
                  
                  <p style={{ margin: "0 0 20px 0", fontSize: "0.8rem", color: "#64748b", fontWeight: 600 }}>
                    {plan.billing_cycle === "monthly" ? "Per Month Plan" : plan.billing_cycle === "yearly" ? "Per Year Plan" : "One-Time Billing"} 
                    {plan.free_trial_days > 0 ? ` • ${plan.free_trial_days} Days Trial` : ""}
                  </p>
                  
                  <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "20px", marginTop: "10px" }}>
                    <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "12px" }}>
                      <li style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "0.85rem", color: "#cbd5e1" }}>
                        <span style={{ color: "#10b981", fontWeight: "bold" }}>✓</span>
                        <span>{plan.features.pages || "Pages config"} Pages</span>
                      </li>
                      <li style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "0.85rem", color: "#cbd5e1" }}>
                        <span style={{ color: "#10b981", fontWeight: "bold" }}>✓</span>
                        <span>SEO Setup: <strong>{plan.features.seoSetup || "Basic"}</strong></span>
                      </li>
                      <li style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "0.85rem", color: "#cbd5e1" }}>
                        <span style={{ color: "#10b981", fontWeight: "bold" }}>✓</span>
                        <span>Support: <strong>{plan.features.support || "1 Month"}</strong></span>
                      </li>
                      <li style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "0.85rem", color: "#cbd5e1" }}>
                        <span style={{ color: plan.features.cmsPanel === "✓" ? "#10b981" : "#ef4444", fontWeight: "bold" }}>
                          {plan.features.cmsPanel === "✓" ? "✓" : "✗"}
                        </span>
                        <span style={{ opacity: plan.features.cmsPanel === "✓" ? 1 : 0.4 }}>CMS/Admin Panel Access</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <Link href={`/contact?plan=${plan.id}`} className="button button-glow" style={{ width: "100%", justifyContent: "center", textAlign: "center", marginTop: "24px", padding: "10px 0", boxSizing: "border-box" }}>
                  <span>Choose Plan</span>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Comparison Matrix Table */}
          <Reveal>
            <div style={{
              background: "#0b1329",
              borderRadius: "24px",
              border: "1px solid rgba(255,255,255,0.08)",
              padding: "32px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
              overflowX: "auto"
            }}>
              <h3 style={{ margin: "0 0 20px 0", fontSize: "1.15rem", fontWeight: 800, color: "#fff" }}>Features Comparison Matrix</h3>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", minWidth: "750px" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid rgba(255,255,255,0.1)" }}>
                    <th style={{ padding: "16px 20px", color: "#fff", fontWeight: 800, fontSize: "0.9rem" }}>Feature</th>
                    {(plans.length > 0 ? plans : defaultPlansFallback).map(p => (
                      <th key={p.id} style={{ padding: "16px 20px", color: "#fff", fontWeight: 800, fontSize: "0.9rem" }}>{p.name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { key: "price", label: "Estimated Cost" },
                    { key: "pages", label: "Pages" },
                    { key: "responsive", label: "Responsive Design" },
                    { key: "contactForm", label: "Contact Form" },
                    { key: "seoSetup", label: "SEO Setup" },
                    { key: "blogModule", label: "Blog Module" },
                    { key: "cmsPanel", label: "CMS/Admin Panel" },
                    { key: "customDesign", label: "Custom Design" },
                    { key: "paymentGateway", label: "Payment Gateway" },
                    { key: "productMgmt", label: "Product Management" },
                    { key: "userLogin", label: "User Login/Register" },
                    { key: "analytics", label: "Analytics Integration" },
                    { key: "support", label: "Free Support Period" }
                  ].map((row, idx) => (
                    <tr key={row.key} style={{
                      borderBottom: "1px solid rgba(255,255,255,0.06)",
                      background: idx % 2 === 0 ? "rgba(255, 255, 255, 0.01)" : "transparent"
                    }}>
                      <td style={{ padding: "16px 20px", fontWeight: 700, color: "#fff", fontSize: "0.88rem" }}>{row.label}</td>
                      {(plans.length > 0 ? plans : defaultPlansFallback).map(p => (
                        <td key={p.id} style={{ padding: "16px 20px" }}>
                          {row.key === "price" ? (
                            <strong style={{ color: "#38bdf8", fontSize: "0.9rem" }}>{p.price}</strong>
                          ) : (
                            renderFeatureValue(p.features[row.key])
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════ FAQ ═════════════════════════════════════════ */}
      <section className="section">
        <div className="container lp-faq-container">
          <Reveal className="lp-section-header">
            <p className="eyebrow">Frequently Asked</p>
            <h2 className="lp-section-h2">Got questions? <span className="lp-gradient-text">We have answers.</span></h2>
          </Reveal>
          <Reveal delay={0.1}>
            <FaqAccordion items={faqs} />
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════ CTA BANNER ══════════════════════════════════ */}
      <PageHero
        description="Move from idea to execution with a structured technology partner based in Hyderabad."
        eyebrow="Ready to Start?"
        title="Need enterprise digital infrastructure, automation, or managed technology operations?"
      />
    </main>
  );
}
