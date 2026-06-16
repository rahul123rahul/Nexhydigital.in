"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldAlert, ArrowRight, Lock, User, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      let data;
      try {
        data = await res.json();
      } catch (jsonErr) {
        throw new Error("Invalid response from server. Please try again.");
      }

      if (res.ok && data && data.ok) {
        if (data.user?.role === "client") {
          router.push("/customer/dashboard");
        } else {
          router.push("/admin");
        }
        router.refresh();
      } else {
        setError(data?.error || "Invalid username or password");
        setLoading(false);
      }
    } catch (err) {
      console.error("Login client error:", err);
      setError(err.message || "An error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <main style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "radial-gradient(circle at 10% 20%, rgb(0, 0, 0) 0%, rgb(8, 15, 30) 90.1%)",
      padding: "20px",
      fontFamily: "system-ui, sans-serif",
    }}>
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes loginSpin {
          to { transform: rotate(360deg); }
        }
      `}} />

      {/* Background ambient glow */}
      <div style={{
        position: "absolute",
        width: "300px",
        height: "300px",
        background: "rgba(15, 98, 254, 0.15)",
        borderRadius: "50%",
        filter: "blur(80px)",
        top: "20%",
        left: "30%",
        zIndex: 0
      }} />
      <div style={{
        position: "absolute",
        width: "250px",
        height: "250px",
        background: "rgba(0, 212, 255, 0.1)",
        borderRadius: "50%",
        filter: "blur(60px)",
        bottom: "20%",
        right: "30%",
        zIndex: 0
      }} />

      <div style={{
        width: "100%",
        maxWidth: "420px",
        background: "rgba(22, 28, 45, 0.65)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        borderRadius: "20px",
        padding: "40px",
        boxShadow: "0 24px 48px rgba(0, 0, 0, 0.4)",
        zIndex: 1,
        position: "relative",
        boxSizing: "border-box"
      }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <img
            src="/logo.png"
            alt="Nexhify Logo"
            style={{
              height: "48px",
              width: "auto",
              objectFit: "contain",
              marginBottom: "16px"
            }}
          />
          <h2 style={{ margin: "0 0 8px 0", color: "#ffffff", fontSize: "1.6rem", fontWeight: 700 }}>Welcome Back</h2>
          <p style={{ margin: 0, color: "#a0aec0", fontSize: "0.9rem", lineHeight: "1.5" }}>
            Log in to access your portal.<br />
            Enter your credentials to securely manage your workspace.
          </p>
        </div>

        {/* Error notification */}
        {error && (
          <div style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "12px",
            background: "rgba(239, 68, 68, 0.1)",
            border: "1px solid rgba(239, 68, 68, 0.25)",
            borderRadius: "10px",
            padding: "12px 16px",
            marginBottom: "24px",
            color: "#f87171",
            fontSize: "0.88rem"
          }}>
            <ShieldAlert size={18} style={{ flexShrink: 0, marginTop: "2px" }} />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Username */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label htmlFor="username" style={{ fontSize: "0.85rem", fontWeight: 600, color: "#e2e8f0" }}>Username or Email</label>
            <div style={{ position: "relative" }}>
              <User size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#718096" }} />
              <input
                id="username"
                type="text"
                required
                disabled={loading}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. username or email"
                style={{
                  width: "100%",
                  padding: "12px 12px 12px 42px",
                  borderRadius: "10px",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  background: "rgba(10, 15, 30, 0.4)",
                  color: "#ffffff",
                  fontSize: "0.95rem",
                  boxSizing: "border-box",
                  outline: "none",
                  transition: "all 0.2s ease"
                }}
                onFocus={(e) => e.target.style.borderColor = "var(--accent, #0f62fe)"}
                onBlur={(e) => e.target.style.borderColor = "rgba(255, 255, 255, 0.12)"}
              />
            </div>
          </div>

          {/* Password */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label htmlFor="password" style={{ fontSize: "0.85rem", fontWeight: 600, color: "#e2e8f0" }}>Password</label>
            <div style={{ position: "relative" }}>
              <Lock size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#718096" }} />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                disabled={loading}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  width: "100%",
                  padding: "12px 42px 12px 42px",
                  borderRadius: "10px",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  background: "rgba(10, 15, 30, 0.4)",
                  color: "#ffffff",
                  fontSize: "0.95rem",
                  boxSizing: "border-box",
                  outline: "none",
                  transition: "all 0.2s ease"
                }}
                onFocus={(e) => e.target.style.borderColor = "var(--accent, #0f62fe)"}
                onBlur={(e) => e.target.style.borderColor = "rgba(255, 255, 255, 0.12)"}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  color: "#718096",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center"
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              background: "var(--accent, #0f62fe)",
              color: "#ffffff",
              border: "none",
              padding: "14px",
              borderRadius: "10px",
              fontSize: "1rem",
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              marginTop: "8px",
              transition: "all 0.2s ease",
              boxShadow: "0 4px 14px rgba(15, 98, 254, 0.4)"
            }}
          >
            {loading ? (
              <span style={{
                display: "inline-block",
                width: "20px",
                height: "20px",
                border: "2px solid rgba(255, 255, 255, 0.3)",
                borderTopColor: "#ffffff",
                borderRadius: "50%",
                animation: "loginSpin 0.8s linear infinite"
              }} />
            ) : (
              <>
                Log In <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Footer Info */}
        <div style={{ textAlign: "center", marginTop: "28px", fontSize: "0.85rem" }}>
          <Link href="/" style={{ color: "#718096", textDecoration: "none", transition: "color 0.2s" }}>
            ← Back to Nexhydigital Home
          </Link>
        </div>
      </div>
    </main>
  );
}
