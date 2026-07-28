"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function SessionTracker() {
  const pathname = usePathname();

  useEffect(() => {
    try {
      // 1. Manage Visitor Session Cookie
      const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
      };

      const setCookie = (name, val, days = 30) => {
        const d = new Date();
        d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
        document.cookie = `${name}=${val};expires=${d.toUTCString()};path=/;SameSite=Lax`;
      };

      let sessionId = getCookie("nexhy_session_id");
      if (!sessionId) {
        sessionId = "sess_" + Math.random().toString(36).substring(2, 11) + "_" + Date.now();
        setCookie("nexhy_session_id", sessionId, 30);
      }

      let visitCount = parseInt(getCookie("nexhy_visit_count") || "0", 10) + 1;
      setCookie("nexhy_visit_count", visitCount.toString(), 30);

      // 2. Cache Session State in sessionStorage & localStorage
      const sessionData = {
        sessionId,
        visitCount,
        currentPage: pathname,
        timestamp: new Date().toISOString(),
        referrer: document.referrer || "Direct",
        userAgent: navigator.userAgent
      };

      sessionStorage.setItem("nexhy_current_session", JSON.stringify(sessionData));
      
      const history = JSON.parse(localStorage.getItem("nexhy_visitor_history") || "[]");
      history.push({ page: pathname, time: new Date().toLocaleTimeString() });
      if (history.length > 50) history.shift();
      localStorage.setItem("nexhy_visitor_history", JSON.stringify(history));

      // 3. Track with Google Analytics gtag if available
      if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", "page_view", {
          page_path: pathname,
          session_id: sessionId,
          visit_count: visitCount
        });
      }
    } catch (err) {
      console.warn("Session tracking muted:", err);
    }
  }, [pathname]);

  return null;
}
