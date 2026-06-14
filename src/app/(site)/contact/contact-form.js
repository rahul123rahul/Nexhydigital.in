"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import emailjs from "@emailjs/browser";

function ContactFormContent() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    budget: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const searchParams = useSearchParams();
  const plan = searchParams ? searchParams.get("plan") : null;

  useEffect(() => {
    if (plan) {
      const planName = plan.charAt(0).toUpperCase() + plan.slice(1);
      let budgetVal = "";
      let serviceVal = "Custom Web Development";
      let detailsVal = `I am interested in the ${planName} Website plan.`;

      if (plan === "basic") {
        budgetVal = "20k";
      } else if (plan === "business") {
        budgetVal = "50k";
      } else if (plan === "premium") {
        budgetVal = "90k";
      } else if (plan === "ecommerce") {
        budgetVal = "1L - 3L";
        serviceVal = "Custom App Development";
        detailsVal = `I am interested in the E-Commerce Website plan.`;
      }

      setForm((prev) => ({
        ...prev,
        service: serviceVal,
        budget: budgetVal,
        message: detailsVal,
      }));
    }
  }, [plan]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    // 1. Save to database backend
    let dbSaved = false;
    try {
      const dbRes = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          service: form.service,
          budget: form.budget,
          message: form.message,
          source: "Website Form"
        })
      });
      const dbData = await dbRes.json();
      if (dbData.ok) {
        dbSaved = true;
      }
    } catch (dbErr) {
      console.error("Failed to save enquiry to database:", dbErr);
    }

    // 2. Send via EmailJS (if credentials available)
    try {
      const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
      const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
      const adminTemplate = process.env.NEXT_PUBLIC_EMAILJS_ADMIN_TEMPLATE;
      const autoReplyTemplate = process.env.NEXT_PUBLIC_EMAILJS_AUTOREPLY_TEMPLATE;

      if (serviceId && publicKey && adminTemplate && autoReplyTemplate) {
        const templateParams = {
          user_name: form.name,
          user_email: form.email,
          user_phone: form.phone,
          service: form.service,
          budget: form.budget,
          message: form.message,
        };

        // Send to Admin
        await emailjs.send(
          serviceId,
          adminTemplate,
          templateParams,
          publicKey
        );

        // Send Auto Reply to Customer
        await emailjs.send(
          serviceId,
          autoReplyTemplate,
          templateParams,
          publicKey
        );
      } else {
        console.warn("EmailJS configuration is missing, skipped email alerts.");
      }

      setSuccess(true);
      setForm({ name: "", email: "", phone: "", service: "", budget: "", message: "" });
    } catch (error) {
      console.error("EmailJS Error Details:", error);
      if (dbSaved) {
        // Safe to proceed since we saved in the DB
        setSuccess(true);
        setForm({ name: "", email: "", phone: "", service: "", budget: "", message: "" });
      } else {
        const errorMessage = error?.text || error?.message || "Unknown error occurred";
        alert(`Failed to send enquiry: ${errorMessage}`);
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div style={{ padding: "40px", background: "var(--surface-alt)", borderRadius: "16px", border: "1px solid var(--line)", textAlign: "center", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
        <div style={{ fontSize: "3.5rem", marginBottom: "16px" }}>🎉</div>
        <h3 style={{ margin: "0 0 12px", color: "var(--primary)", fontSize: "1.5rem" }}>Enquiry Sent!</h3>
        <p style={{ color: "var(--muted)", margin: "0 0 24px", lineHeight: "1.6" }}>
          Thank you for reaching out. Our team will review your project details and get back to you within 24 hours.
        </p>
        <button onClick={() => setSuccess(false)} className="button button-outline">
          Submit Another Enquiry
        </button>
      </div>
    );
  }

  return (
    <form 
      suppressHydrationWarning
      onSubmit={handleSubmit} 
      style={{ 
        display: "flex", 
        flexDirection: "column", 
        gap: "20px", 
        background: "var(--surface)", 
        padding: "32px", 
        borderRadius: "16px", 
        border: "1px solid var(--line)", 
        boxShadow: "var(--shadow)" 
      }}
    >
      <div style={{ marginBottom: "8px" }}>
        <h3 style={{ margin: "0 0 8px", fontSize: "1.4rem", color: "var(--primary)" }}>Project Enquiry</h3>
        <p style={{ margin: 0, color: "var(--muted)", fontSize: "0.9rem" }}>Fill out the details below to get a detailed quote.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <label htmlFor="name" style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--primary)" }}>Full Name *</label>
          <input suppressHydrationWarning id="name" name="name" type="text" required value={form.name} onChange={handleChange} style={{ padding: "12px", borderRadius: "8px", border: "1px solid var(--line)", background: "var(--surface-alt)", color: "var(--primary)", fontFamily: "inherit" }} placeholder="John Doe" />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <label htmlFor="phone" style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--primary)" }}>Phone Number *</label>
          <input suppressHydrationWarning id="phone" name="phone" type="tel" required value={form.phone} onChange={handleChange} style={{ padding: "12px", borderRadius: "8px", border: "1px solid var(--line)", background: "var(--surface-alt)", color: "var(--primary)", fontFamily: "inherit" }} placeholder="+91 99999 99999" />
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <label htmlFor="email" style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--primary)" }}>Email Address *</label>
        <input suppressHydrationWarning id="email" name="email" type="email" required value={form.email} onChange={handleChange} style={{ padding: "12px", borderRadius: "8px", border: "1px solid var(--line)", background: "var(--surface-alt)", color: "var(--primary)", fontFamily: "inherit" }} placeholder="john@example.com" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <label htmlFor="service" style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--primary)" }}>Service Required *</label>
          <select suppressHydrationWarning id="service" name="service" required value={form.service} onChange={handleChange} style={{ padding: "12px", borderRadius: "8px", border: "1px solid var(--line)", background: "var(--surface-alt)", color: "var(--primary)", cursor: "pointer", fontFamily: "inherit" }}>
            <option value="" disabled>Select a service</option>
            <option value="Custom App Development">Custom App Development</option>
            <option value="Custom Web Development">Custom Web Development</option>
            <option value="ERP Software">ERP Software</option>
            <option value="Educational Websites & Portals">Educational Websites & Portals</option>
            <option value="IT Maintenance & Support">IT Maintenance & Support</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <label htmlFor="budget" style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--primary)" }}>Estimated Budget *</label>
          <select suppressHydrationWarning id="budget" name="budget" required value={form.budget} onChange={handleChange} style={{ padding: "12px", borderRadius: "8px", border: "1px solid var(--line)", background: "var(--surface-alt)", color: "var(--primary)", cursor: "pointer", fontFamily: "inherit" }}>
            <option value="" disabled>Select budget</option>
            <option value="10k">₹10,000</option>
            <option value="20k">₹20,000</option>
            <option value="30k">₹30,000</option>
            <option value="50k">₹50,000</option>
            <option value="70k">₹70,000</option>
            <option value="90k">₹90,000</option>
            <option value="1L - 3L">₹1 Lakh - 3 Lakhs</option>
            <option value="3L - 5L">₹3 Lakhs - 5 Lakhs</option>
            <option value="5L - 10L">₹5 Lakhs - 10 Lakhs</option>
          </select>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <label htmlFor="message" style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--primary)" }}>Project Details</label>
        <textarea suppressHydrationWarning id="message" name="message" rows="4" value={form.message} onChange={handleChange} style={{ padding: "12px", borderRadius: "8px", border: "1px solid var(--line)", background: "var(--surface-alt)", color: "var(--primary)", resize: "vertical", fontFamily: "inherit" }} placeholder="Tell us a little bit about what you're looking to build..."></textarea>
      </div>

      <button 
        suppressHydrationWarning
        type="submit" 
        disabled={submitting} 
        className="button button-glow" 
        style={{ width: "100%", padding: "14px", fontSize: "1rem", marginTop: "8px" }}
      >
        {submitting ? "Submitting..." : "Get a Free Quote →"}
      </button>
    </form>
  );
}

export function ContactForm() {
  return (
    <Suspense fallback={
      <div style={{ padding: "32px", background: "var(--surface)", borderRadius: "16px", border: "1px solid var(--line)", textAlign: "center", color: "var(--muted)" }}>
        Loading contact form...
      </div>
    }>
      <ContactFormContent />
    </Suspense>
  );
}