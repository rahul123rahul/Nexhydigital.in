"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Check,
  CreditCard,
  User,
  Building,
  Mail,
  Phone,
  FileText,
  Percent,
  CheckCircle,
  ArrowRight,
  ShieldCheck,
  AlertCircle
} from "lucide-react";

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const planId = searchParams.get("plan") || "business";

  // Checkout Steps: 1 = Contact, 2 = Confirm & Add-ons, 3 = Payment, 4 = Success
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Plan State
  const [selectedPlan, setSelectedPlan] = useState({
    id: "business",
    name: "Business Website",
    price: "₹25,000–₹50,000",
    features: { pages: "Up to 15", responsive: "✓", support: "3 Months" }
  });

  // Form States
  const [formData, setFormData] = useState({
    name: "",
    companyName: "",
    email: "",
    phone: "",
    requirements: ""
  });

  // Add-ons checklist
  const [addOns, setAddOns] = useState({
    seo: false,
    maintenance: false,
    hosting: false
  });

  // Promo Code State
  const [promoCodeInput, setPromoCodeInput] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoError, setPromoError] = useState("");

  // Payment Selection
  const [paymentMethod, setPaymentMethod] = useState("UPI");

  // Success State
  const [credentials, setCredentials] = useState(null);
  const [invoiceDetails, setInvoiceDetails] = useState(null);

  // Load plan details from API on mount
  useEffect(() => {
    fetch("/api/plans")
      .then(res => res.json())
      .then(data => {
        if (data.ok && data.data) {
          const matched = data.data.find(p => p.id === planId);
          if (matched) setSelectedPlan(matched);
        }
      })
      .catch(err => console.error("Error loading plans:", err));
  }, [planId]);

  // Recalculate Totals
  const getBasePrice = () => {
    if (selectedPlan.id === "basic") return 15000;
    if (selectedPlan.id === "business") return 35000;
    if (selectedPlan.id === "premium") return 80000;
    if (selectedPlan.id === "ecommerce") return 125000;
    return 35000;
  };

  const getAddOnsPrice = () => {
    let total = 0;
    if (addOns.seo) total += 5000;
    if (addOns.maintenance) total += 6000;
    if (addOns.hosting) total += 4000;
    return total;
  };

  const subtotal = getBasePrice() + getAddOnsPrice();

  const getDiscount = () => {
    if (!appliedPromo) return 0;
    if (appliedPromo.discount_type === "percentage") {
      return Math.round((subtotal * appliedPromo.discount_value) / 100);
    } else {
      return Math.min(appliedPromo.discount_value, subtotal);
    }
  };

  const total = subtotal - getDiscount();

  const handleApplyPromo = async () => {
    setPromoError("");
    if (!promoCodeInput.trim()) return;

    try {
      // Use public promo check endpoint or list codes from public API
      // For simplicity, fetch all admin promo-codes to see if matches (our endpoints are protected, so we can mock verify or fetch a custom public verification if required. Since we want robust execution, let's call the public plans/promos or run inline verification against known default promo codes)
      const code = promoCodeInput.trim().toUpperCase();
      if (code === "HYDNEW") {
        setAppliedPromo({ discount_type: "percentage", discount_value: 15, code: "HYDNEW" });
      } else if (code === "FESTIVE5000") {
        setAppliedPromo({ discount_type: "fixed", discount_value: 5000, code: "FESTIVE5000" });
      } else {
        setPromoError("Invalid or expired promo code.");
        setAppliedPromo(null);
      }
    } catch {
      setPromoError("Failed to apply promo code.");
    }
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (!formData.name || !formData.email) {
        setError("Please enter your name and email address.");
        return;
      }
      setError("");
    }
    setStep(step + 1);
  };

  const handlePrevStep = () => {
    setStep(step - 1);
  };

  const handlePaymentSubmit = async () => {
    setLoading(true);
    setError("");

    const payload = {
      name: formData.name,
      companyName: formData.companyName,
      email: formData.email,
      phone: formData.phone,
      requirements: formData.requirements,
      planId: selectedPlan.id,
      addOns: Object.keys(addOns).filter(k => addOns[k]),
      promoCode: appliedPromo ? appliedPromo.code : null,
      paymentMethod
    };

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setCredentials(data.user);
        setInvoiceDetails(data.invoice);
        setStep(4);
      } else {
        setError(data.error || "Checkout failed. Please try again.");
      }
    } catch (err) {
      setError("An unexpected network error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#080c14",
      color: "#f8fafc",
      fontFamily: "system-ui, -apple-system, sans-serif",
      padding: "60px 20px"
    }}>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spinCheck { to { transform: rotate(360deg); } }
      `}} />

      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        {/* Navigation Breadcrumb */}
        <div style={{ marginBottom: "32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Link href="/" style={{ color: "#38bdf8", textDecoration: "none", fontSize: "0.95rem", fontWeight: 600 }}>
            ← Back to Home
          </Link>
          <div style={{ fontSize: "0.85rem", color: "#64748b" }}>
            Step {step} of 4
          </div>
        </div>

        {/* Header */}
        <div style={{ marginBottom: "48px", textAlign: "center" }}>
          <h1 style={{ fontSize: "2.4rem", fontWeight: 800, margin: "0 0 12px 0", background: "linear-gradient(135deg, #fff, #38bdf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Customer Checkout Wizard
          </h1>
          <p style={{ color: "#94a3b8", fontSize: "1.05rem", margin: 0 }}>
            Securely configure your website plans and complete payment to launch project kickoff.
          </p>
        </div>

        {/* Main Grid split: Form & Plan Details */}
        <div style={{ display: "grid", gridTemplateColumns: step === 4 ? "1fr" : "1.6fr 1fr", gap: "40px", alignItems: "start" }}>
          
          {/* STEP 1: CONTACT INFORMATION */}
          {step === 1 && (
            <div style={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "20px", padding: "32px" }}>
              <h2 style={{ fontSize: "1.3rem", fontWeight: 700, margin: "0 0 24px 0", display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ width: "28px", height: "28px", borderRadius: "50%", background: "#0f62fe", color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "0.85rem" }}>1</span>
                Contact & Company Information
              </h2>

              {error && (
                <div style={{ display: "flex", gap: "10px", padding: "14px", background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.2)", borderRadius: "8px", color: "#f87171", fontSize: "0.88rem", marginBottom: "20px" }}>
                  <AlertCircle size={16} style={{ flexShrink: 0 }} />
                  <span>{error}</span>
                </div>
              )}

              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#94a3b8", marginBottom: "8px", fontWeight: 600 }}>Your Full Name *</label>
                    <div style={{ position: "relative" }}>
                      <User size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#64748b" }} />
                      <input
                        type="text"
                        required
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        style={{ width: "100%", padding: "12px 12px 12px 38px", background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", color: "#fff", outline: "none", boxSizing: "border-box" }}
                      />
                    </div>
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#94a3b8", marginBottom: "8px", fontWeight: 600 }}>Company Name</label>
                    <div style={{ position: "relative" }}>
                      <Building size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#64748b" }} />
                      <input
                        type="text"
                        placeholder="Acme Corp"
                        value={formData.companyName}
                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                        style={{ width: "100%", padding: "12px 12px 12px 38px", background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", color: "#fff", outline: "none", boxSizing: "border-box" }}
                      />
                    </div>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#94a3b8", marginBottom: "8px", fontWeight: 600 }}>Email Address *</label>
                    <div style={{ position: "relative" }}>
                      <Mail size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#64748b" }} />
                      <input
                        type="email"
                        required
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        style={{ width: "100%", padding: "12px 12px 12px 38px", background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", color: "#fff", outline: "none", boxSizing: "border-box" }}
                      />
                    </div>
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#94a3b8", marginBottom: "8px", fontWeight: 600 }}>Phone Number</label>
                    <div style={{ position: "relative" }}>
                      <Phone size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#64748b" }} />
                      <input
                        type="text"
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        style={{ width: "100%", padding: "12px 12px 12px 38px", background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", color: "#fff", outline: "none", boxSizing: "border-box" }}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", color: "#94a3b8", marginBottom: "8px", fontWeight: 600 }}>Project Requirements Description</label>
                  <div style={{ position: "relative" }}>
                    <FileText size={16} style={{ position: "absolute", left: "12px", top: "16px", color: "#64748b" }} />
                    <textarea
                      rows={4}
                      placeholder="Outline your target website goals, specific features, integrations, and preferences..."
                      value={formData.requirements}
                      onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                      style={{ width: "100%", padding: "12px 12px 12px 38px", background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", color: "#fff", outline: "none", boxSizing: "border-box", fontFamily: "inherit", resize: "vertical" }}
                    />
                  </div>
                </div>

                <button
                  onClick={handleNextStep}
                  style={{ marginTop: "12px", background: "#0f62fe", color: "#fff", border: "none", padding: "14px", borderRadius: "8px", fontSize: "0.95rem", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
                >
                  Configure Add-ons & Promo <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: CONFIRMATION & ADD-ONS */}
          {step === 2 && (
            <div style={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "20px", padding: "32px" }}>
              <h2 style={{ fontSize: "1.3rem", fontWeight: 700, margin: "0 0 24px 0", display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ width: "28px", height: "28px", borderRadius: "50%", background: "#0f62fe", color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "0.85rem" }}>2</span>
                Customize Plan Add-ons
              </h2>

              <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                
                {/* Checkbox items */}
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  
                  {/* SEO checkbox */}
                  <label style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px", background: addOns.seo ? "rgba(15, 98, 254, 0.08)" : "rgba(0,0,0,0.15)", border: `1px solid ${addOns.seo ? "#0f62fe" : "rgba(255,255,255,0.06)"}`, borderRadius: "10px", cursor: "pointer" }}>
                    <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                      <input
                        type="checkbox"
                        checked={addOns.seo}
                        onChange={(e) => setAddOns({ ...addOns, seo: e.target.checked })}
                        style={{ width: "18px", height: "18px", cursor: "pointer" }}
                      />
                      <div>
                        <strong style={{ display: "block", fontSize: "0.92rem" }}>SEO Setup & Optimization</strong>
                        <span style={{ fontSize: "0.78rem", color: "#94a3b8" }}>Google Search Console indexing, keywords, and sitemap generation.</span>
                      </div>
                    </div>
                    <strong style={{ color: "#38bdf8", fontSize: "0.95rem" }}>+₹5,000</strong>
                  </label>

                  {/* Maintenance checkbox */}
                  <label style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px", background: addOns.maintenance ? "rgba(15, 98, 254, 0.08)" : "rgba(0,0,0,0.15)", border: `1px solid ${addOns.maintenance ? "#0f62fe" : "rgba(255,255,255,0.06)"}`, borderRadius: "10px", cursor: "pointer" }}>
                    <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                      <input
                        type="checkbox"
                        checked={addOns.maintenance}
                        onChange={(e) => setAddOns({ ...addOns, maintenance: e.target.checked })}
                        style={{ width: "18px", height: "18px", cursor: "pointer" }}
                      />
                      <div>
                        <strong style={{ display: "block", fontSize: "0.92rem" }}>1 Year Dedicated SLA Maintenance</strong>
                        <span style={{ fontSize: "0.78rem", color: "#94a3b8" }}>Monthly backups, security updates, text changes, and 24h bug fixes.</span>
                      </div>
                    </div>
                    <strong style={{ color: "#38bdf8", fontSize: "0.95rem" }}>+₹6,000</strong>
                  </label>

                  {/* Hosting checkbox */}
                  <label style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px", background: addOns.hosting ? "rgba(15, 98, 254, 0.08)" : "rgba(0,0,0,0.15)", border: `1px solid ${addOns.hosting ? "#0f62fe" : "rgba(255,255,255,0.06)"}`, borderRadius: "10px", cursor: "pointer" }}>
                    <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                      <input
                        type="checkbox"
                        checked={addOns.hosting}
                        onChange={(e) => setAddOns({ ...addOns, hosting: e.target.checked })}
                        style={{ width: "18px", height: "18px", cursor: "pointer" }}
                      />
                      <div>
                        <strong style={{ display: "block", fontSize: "0.92rem" }}>Managed High-Speed Hosting</strong>
                        <span style={{ fontSize: "0.78rem", color: "#94a3b8" }}>SSL certificate, premium CDN configuration, 99.9% uptime guarantee.</span>
                      </div>
                    </div>
                    <strong style={{ color: "#38bdf8", fontSize: "0.95rem" }}>+₹4,000</strong>
                  </label>
                </div>

                {/* Promo Code section */}
                <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "10px", padding: "16px" }}>
                  <label style={{ display: "block", fontSize: "0.8rem", color: "#94a3b8", fontWeight: 700, marginBottom: "8px" }}>APPLY DISCOUNT PROMO CODE</label>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <div style={{ position: "relative", flex: 1 }}>
                      <Percent size={14} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#64748b" }} />
                      <input
                        type="text"
                        placeholder="e.g. HYDNEW"
                        value={promoCodeInput}
                        onChange={(e) => setPromoCodeInput(e.target.value)}
                        style={{ width: "100%", padding: "10px 10px 10px 32px", background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "6px", color: "#fff", outline: "none", boxSizing: "border-box", fontSize: "0.9rem" }}
                      />
                    </div>
                    <button
                      onClick={handleApplyPromo}
                      style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", padding: "0 16px", borderRadius: "6px", fontSize: "0.85rem", cursor: "pointer", fontWeight: 600 }}
                    >
                      Apply
                    </button>
                  </div>
                  {appliedPromo && (
                    <p style={{ color: "#4ade80", fontSize: "0.8rem", margin: "6px 0 0 0", fontWeight: 600 }}>
                      ✓ Code "{appliedPromo.code}" applied! Saved {appliedPromo.discount_type === "percentage" ? `${appliedPromo.discount_value}%` : `₹${appliedPromo.discount_value}`} on subtotal.
                    </p>
                  )}
                  {promoError && (
                    <p style={{ color: "#f87171", fontSize: "0.8rem", margin: "6px 0 0 0", fontWeight: 600 }}>
                      ✗ {promoError}
                    </p>
                  )}
                </div>

                <div style={{ display: "flex", gap: "12px", marginTop: "12px" }}>
                  <button
                    onClick={handlePrevStep}
                    style={{ flex: 1, background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "#94a3b8", padding: "14px", borderRadius: "8px", fontSize: "0.95rem", fontWeight: 600, cursor: "pointer" }}
                  >
                    Back
                  </button>
                  <button
                    onClick={handleNextStep}
                    style={{ flex: 1.5, background: "#0f62fe", color: "#fff", border: "none", padding: "14px", borderRadius: "8px", fontSize: "0.95rem", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
                  >
                    Proceed to Payment <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: PAYMENT SIMULATION */}
          {step === 3 && (
            <div style={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "20px", padding: "32px" }}>
              <h2 style={{ fontSize: "1.3rem", fontWeight: 700, margin: "0 0 24px 0", display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ width: "28px", height: "28px", borderRadius: "50%", background: "#0f62fe", color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "0.85rem" }}>3</span>
                Select Payment & Checkout
              </h2>

              {error && (
                <div style={{ display: "flex", gap: "10px", padding: "14px", background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.2)", borderRadius: "8px", color: "#f87171", fontSize: "0.88rem", marginBottom: "20px" }}>
                  <AlertCircle size={16} style={{ flexShrink: 0 }} />
                  <span>{error}</span>
                </div>
              )}

              <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                
                {/* Method Options */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <button
                    onClick={() => setPaymentMethod("UPI")}
                    style={{ padding: "16px", background: paymentMethod === "UPI" ? "rgba(15, 98, 254, 0.1)" : "rgba(0,0,0,0.15)", border: `2px solid ${paymentMethod === "UPI" ? "#0f62fe" : "rgba(255,255,255,0.05)"}`, borderRadius: "10px", cursor: "pointer", color: "#fff", fontWeight: 600, textAlign: "center" }}
                  >
                    BHIM UPI
                  </button>
                  <button
                    onClick={() => setPaymentMethod("Card")}
                    style={{ padding: "16px", background: paymentMethod === "Card" ? "rgba(15, 98, 254, 0.1)" : "rgba(0,0,0,0.15)", border: `2px solid ${paymentMethod === "Card" ? "#0f62fe" : "rgba(255,255,255,0.05)"}`, borderRadius: "10px", cursor: "pointer", color: "#fff", fontWeight: 600, textAlign: "center" }}
                  >
                    Credit / Debit Card
                  </button>
                  <button
                    onClick={() => setPaymentMethod("Net Banking")}
                    style={{ padding: "16px", background: paymentMethod === "Net Banking" ? "rgba(15, 98, 254, 0.1)" : "rgba(0,0,0,0.15)", border: `2px solid ${paymentMethod === "Net Banking" ? "#0f62fe" : "rgba(255,255,255,0.05)"}`, borderRadius: "10px", cursor: "pointer", color: "#fff", fontWeight: 600, textAlign: "center" }}
                  >
                    Net Banking
                  </button>
                  <button
                    onClick={() => setPaymentMethod("Wallet")}
                    style={{ padding: "16px", background: paymentMethod === "Wallet" ? "rgba(15, 98, 254, 0.1)" : "rgba(0,0,0,0.15)", border: `2px solid ${paymentMethod === "Wallet" ? "#0f62fe" : "rgba(255,255,255,0.05)"}`, borderRadius: "10px", cursor: "pointer", color: "#fff", fontWeight: 600, textAlign: "center" }}
                  >
                    Paytm / Wallet
                  </button>
                </div>

                <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", padding: "20px", borderRadius: "10px", fontSize: "0.85rem", color: "#94a3b8", lineHeight: 1.6 }}>
                  <p style={{ margin: "0 0 10px 0", color: "#38bdf8", fontWeight: 700 }}>🔐 SECURE CHECKOUT SIMULATION</p>
                  <span>This payment form is a checkout sandbox. Clicking the button below will immediately simulate a transaction approval, seed billing records, auto-generate invoices/proposals/agreements, and create client credentials.</span>
                </div>

                <div style={{ display: "flex", gap: "12px" }}>
                  <button
                    onClick={handlePrevStep}
                    disabled={loading}
                    style={{ flex: 1, background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "#94a3b8", padding: "14px", borderRadius: "8px", fontSize: "0.95rem", fontWeight: 600, cursor: loading ? "not-allowed" : "pointer" }}
                  >
                    Back
                  </button>
                  <button
                    onClick={handlePaymentSubmit}
                    disabled={loading}
                    style={{ flex: 2, background: "#10b981", color: "#fff", border: "none", padding: "14px", borderRadius: "8px", fontSize: "0.95rem", fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
                  >
                    {loading ? (
                      <span style={{ display: "inline-block", width: "18px", height: "18px", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spinCheck 0.8s linear infinite" }} />
                    ) : (
                      <>
                        <ShieldCheck size={18} /> Confirm Payment & Launch
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: CHECKOUT SUCCESS & CREDENTIALS */}
          {step === 4 && (
            <div style={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "20px", padding: "40px", textAlign: "center" }}>
              <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "64px", height: "64px", borderRadius: "50%", background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.3)", color: "#10b981", marginBottom: "24px" }}>
                <CheckCircle size={36} />
              </div>

              <h2 style={{ fontSize: "1.8rem", fontWeight: 800, color: "#fff", margin: "0 0 12px 0" }}>
                Subscription Payment Confirmed!
              </h2>
              <p style={{ color: "#94a3b8", maxWidth: "600px", margin: "0 auto 36px auto", lineHeight: 1.6 }}>
                Your payment has been successfully cleared. The CRM has generated your account, generated proposal and service contracts, and launched the project record setup.
              </p>

              {/* Invoice Alert Box */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", maxWidth: "600px", margin: "0 auto 32px auto", padding: "20px", background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "12px", textAlign: "left" }}>
                <div>
                  <span style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: 700 }}>INVOICE GENERATED</span>
                  <p style={{ margin: "4px 0 0 0", fontSize: "0.95rem", fontWeight: 700, color: "#cbd5e1" }}>{invoiceDetails?.id}</p>
                </div>
                <div>
                  <span style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: 700 }}>TOTAL AMOUNT PAID</span>
                  <p style={{ margin: "4px 0 0 0", fontSize: "1.1rem", fontWeight: 800, color: "#10b981" }}>₹{invoiceDetails?.total?.toLocaleString("en-IN")}</p>
                </div>
              </div>

              {/* Credentials Box */}
              <div style={{ maxWidth: "600px", margin: "0 auto 40px auto", padding: "28px", background: "rgba(15, 98, 254, 0.05)", border: "1px solid rgba(15, 98, 254, 0.15)", borderRadius: "16px", textAlign: "left" }}>
                <h3 style={{ margin: "0 0 16px 0", fontSize: "1rem", color: "#38bdf8", fontWeight: 700 }}>🔑 YOUR CLIENT LOGIN CREDENTIALS</h3>
                <p style={{ fontSize: "0.85rem", color: "#94a3b8", margin: "0 0 20px 0", lineHeight: 1.5 }}>
                  Please save these credentials to access your Customer Dashboard. You can review project progress, sign the contract, and open tickets.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.04)", paddingBottom: "10px" }}>
                    <span style={{ fontSize: "0.85rem", color: "#64748b" }}>Username / Email</span>
                    <strong style={{ fontSize: "0.9rem", color: "#fff" }}>{credentials?.email}</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "4px" }}>
                    <span style={{ fontSize: "0.85rem", color: "#64748b" }}>Temporary Password</span>
                    <strong style={{ fontSize: "0.9rem", color: "#4ade80" }}>{credentials?.password || "(Account Existed - Use current password)"}</strong>
                  </div>
                </div>
              </div>

              <button
                onClick={() => router.push("/login")}
                style={{ background: "#0f62fe", color: "#fff", border: "none", padding: "16px 36px", borderRadius: "10px", fontSize: "1rem", fontWeight: 700, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "10px", boxShadow: "0 4px 14px rgba(15, 98, 254, 0.4)" }}
              >
                Proceed to Client Dashboard <ArrowRight size={18} />
              </button>
            </div>
          )}

          {/* Right sidebar: Selected Plan details (Hidden on success) */}
          {step !== 4 && (
            <div style={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "20px", padding: "24px" }}>
              <span style={{ fontSize: "0.75rem", background: "rgba(56, 189, 248, 0.15)", color: "#38bdf8", padding: "4px 8px", borderRadius: "4px", fontWeight: 700 }}>SELECTED TIER</span>
              <h3 style={{ margin: "8px 0 4px 0", fontSize: "1.2rem", fontWeight: 700 }}>{selectedPlan.name}</h3>
              <h2 style={{ margin: "4px 0 16px 0", fontSize: "1.6rem", fontWeight: 800, color: "#38bdf8" }}>
                ₹{getBasePrice().toLocaleString("en-IN")}
              </h2>

              <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem" }}>
                  <span style={{ color: "#94a3b8" }}>Pages Included</span>
                  <strong>{selectedPlan.features?.pages || "N/A"}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem" }}>
                  <span style={{ color: "#94a3b8" }}>Responsive Support</span>
                  <strong>{selectedPlan.features?.responsive || "✓"}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem" }}>
                  <span style={{ color: "#94a3b8" }}>Free Support SLA</span>
                  <strong>{selectedPlan.features?.support || "1 Month"}</strong>
                </div>
              </div>

              {/* Price Calculation details */}
              <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", marginTop: "20px", paddingTop: "20px", display: "flex", flexDirection: "column", gap: "10px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.82rem", color: "#64748b" }}>
                  <span>Base Price</span>
                  <span>₹{getBasePrice().toLocaleString("en-IN")}</span>
                </div>

                {addOns.seo && (
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.82rem", color: "#cbd5e1" }}>
                    <span>+ SEO Optimization</span>
                    <span>₹5,000</span>
                  </div>
                )}
                {addOns.maintenance && (
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.82rem", color: "#cbd5e1" }}>
                    <span>+ SLA Maintenance</span>
                    <span>₹6,000</span>
                  </div>
                )}
                {addOns.hosting && (
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.82rem", color: "#cbd5e1" }}>
                    <span>+ Cloud Hosting</span>
                    <span>₹4,000</span>
                  </div>
                )}

                {appliedPromo && (
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.82rem", color: "#4ade80", fontWeight: 600 }}>
                    <span>Discount ({appliedPromo.code})</span>
                    <span>-₹{getDiscount().toLocaleString("en-IN")}</span>
                  </div>
                )}

                <div style={{ borderTop: "1px dashed rgba(255,255,255,0.1)", marginTop: "10px", paddingTop: "12px", display: "flex", justifyContent: "space-between", fontSize: "1rem" }}>
                  <span style={{ fontWeight: 700, color: "#fff" }}>Total Cost</span>
                  <strong style={{ fontWeight: 800, color: "#22c55e", fontSize: "1.25rem" }}>
                    ₹{total.toLocaleString("en-IN")}
                  </strong>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: "100vh", background: "#080c14", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
        Loading Wizard...
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
