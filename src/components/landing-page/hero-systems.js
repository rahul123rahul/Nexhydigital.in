"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

/* ─── Animated code-editor window shown in hero right column ─── */
const LINES = [
  { w: "70%",  c: "#00d4ff" },
  { w: "50%",  c: "#ff006e" },
  { w: "85%",  c: "#00ff88" },
  { w: "40%",  c: "#ffbe0b" },
  { w: "65%",  c: "#00d4ff" },
  { w: "55%",  c: "#b537f2" },
  { w: "80%",  c: "#00ff88" },
  { w: "35%",  c: "#ff006e" },
];

export function HeroSystems() {
  const rootRef = useRef(null);

  useEffect(() => {
    if (!rootRef.current) return;
    const ctx = gsap.context(() => {
      // Stagger the code-line bars with enhanced animation
      gsap.fromTo(".hv-codeline",
        { scaleX: 0, transformOrigin: "left center", opacity: 0 },
        { 
          scaleX: 1, 
          opacity: 1,
          duration: 0.8, 
          stagger: 0.08, 
          ease: "cubic-bezier(0.34, 1.56, 0.64, 1)", 
          delay: 0.2 
        }
      );
      
      // Animate editor dots
      gsap.fromTo(".hv-dot",
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.5,
          stagger: 0.1,
          ease: "back.out",
          delay: 0.1
        }
      );

      // Animated Curved Border
      gsap.to(rootRef.current, {
        borderRadius: "40% 60% 70% 30% / 40% 50% 60% 50%",
        duration: 4,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1
      });
    }, rootRef);
    
    return () => ctx.revert();
  }, []);

  return (
    <div 
      className="hv-shell" 
      ref={rootRef}
      style={{
        display: "grid",
        placeItems: "center",
        gap: "32px",
        width: "100%",
        padding: "60px 40px",
        background: "rgba(15, 98, 254, 0.03)",
        border: "1px solid rgba(0, 212, 255, 0.2)",
        boxShadow: "0 0 40px rgba(0, 212, 255, 0.05)",
        borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%",
        overflow: "hidden",
        position: "relative"
      }}
    >
      {/* Background glow effects */}
      <div className="hv-glow hv-glow-1" />
      <div className="hv-glow hv-glow-2" />
      <div className="hv-glow hv-glow-3" />

      {/* ── Top: code editor mock ── */}
      <div className="hv-editor">
        <div className="hv-editor-bar">
          <span className="hv-dot" style={{ background: "#ff5f57" }} />
          <span className="hv-dot" style={{ background: "#febc2e" }} />
          <span className="hv-dot" style={{ background: "#28c840" }} />
          <span className="hv-editor-title">
            <span className="editor-icon">{'</>'}</span>
            hygenx_project.js
          </span>
        </div>
        <div className="hv-editor-body">
          <div className="hv-line-nums">
            {LINES.map((_, i) => <span key={i}>{i + 1}</span>)}
          </div>
          <div className="hv-code-lines">
            {LINES.map((l, i) => (
              <div 
                key={i} 
                className="hv-codeline" 
                style={{ 
                  width: l.w, 
                  background: l.c, 
                  boxShadow: `0 0 10px ${l.c}40`
                }} 
              />
            ))}
          </div>
        </div>
        {/* live typing cursor */}
        <div className="hv-cursor-row">
          <span className="hv-line-cur">9</span>
          <span className="hv-typing-cursor" />
        </div>
      </div>

    </div>
  );
}
