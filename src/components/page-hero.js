"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export function PageHero({ eyebrow, title, description, actions }) {
  const sectionRef = useRef(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className="pg-hero" ref={sectionRef}>
      {/* Layered backgrounds */}
      <div className="pg-hero-bg" aria-hidden="true" />
      <div className="pg-hero-mesh" aria-hidden="true" />
      <div className="pg-hero-orb pg-orb-1" aria-hidden="true" style={{ transform: `translateY(${scrollY * 0.08}px)` }} />
      <div className="pg-hero-orb pg-orb-2" aria-hidden="true" style={{ transform: `translateY(${scrollY * -0.05}px)` }} />
      <div className="pg-hero-orb pg-orb-3" aria-hidden="true" />

      <div className="container pg-hero-inner">
        <div className="pg-hero-content">
          {eyebrow && (
            <div className="pg-eyebrow-row">
              <span className="pg-eyebrow-line" />
              <span className="pg-eyebrow">{eyebrow}</span>
              <span className="pg-eyebrow-line" />
            </div>
          )}
          <h1 className="pg-hero-h1">{title}</h1>
          {description && (
            <p className="pg-hero-lead">{description}</p>
          )}
          {actions && (
            <div className="pg-hero-actions">
              {actions.map((a, i) => (
                <Link key={i} href={a.href} className={`button${i === 0 ? " button-glow" : " button-glass"}`}>
                  {a.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom wave */}
      <div className="pg-hero-wave" aria-hidden="true">
        <svg viewBox="0 0 1440 56" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,32 C240,56 480,8 720,32 C960,56 1200,8 1440,32 L1440,56 L0,56 Z" fill="var(--surface)" />
        </svg>
      </div>
    </section>
  );
}
