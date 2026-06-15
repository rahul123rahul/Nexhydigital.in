"use client";

import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";

export default function TermsPage() {
  return (
    <main style={{ background: "var(--surface)", minHeight: "100vh" }}>
      <PageHero
        eyebrow="Legal"
        title="Terms of Service"
        description="Last updated: June 13, 2026. Review the legal guidelines, payment schedules, refund rules, and maintenance SLA conditions for Nexhydigital IT Solutions."
      />

      <section className="section" style={{ background: "var(--surface-alt)", paddingTop: "60px", paddingBottom: "80px" }}>
        <div className="container" style={{ maxWidth: "800px", margin: "0 auto" }}>
          <Reveal>
            <div style={{ display: "flex", flexDirection: "column", gap: "40px", color: "var(--primary)", lineHeight: "1.7", fontSize: "1rem" }}>
              
              <div>
                <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "16px", color: "var(--primary)" }}>1. Services & Engagement Scope</h2>
                <p style={{ color: "var(--muted)", margin: 0 }}>
                  Nexhydigital Technologies Pvt Ltd ("Nexhydigital", "we", "our") provides enterprise-grade custom web development, mobile applications, ERP solutions, and digital portals. By requesting proposals or signing work contracts, you agree to these standard terms.
                </p>
              </div>

              <div>
                <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "16px", color: "var(--primary)" }}>2. Project Proposals & Budget Estimates</h2>
                <p style={{ color: "var(--muted)", margin: 0 }}>
                  Any automated quotes or price estimates generated on our website are non-binding. Official pricing, specific features, delivery timelines, and project requirements are only finalized through a written Service Level Agreement (SLA) or Statement of Work (SOW) signed by both parties.
                </p>
              </div>

              <div>
                <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "16px", color: "var(--primary)" }}>3. Billing & Milestone Payments</h2>
                <p style={{ color: "var(--muted)", margin: "0 0 16px 0" }}>
                  To ensure quality delivery, project billing is structured around specific milestones:
                </p>
                <ul style={{ paddingLeft: "20px", color: "var(--muted)", display: "flex", flexDirection: "column", gap: "8px" }}>
                  <li><strong>Upfront Mobilization Deposit:</strong> A non-refundable 40% payment of the total project value is required to initiate design and architectural sprints.</li>
                  <li><strong>Development Milestone Payments:</strong> 30% is due upon completion and review of the staging alpha model.</li>
                  <li><strong>Final Deployment Balance:</strong> The remaining 30% is due prior to final server deployment, domain migration, and code repository transfer.</li>
                </ul>
              </div>

              <div>
                <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "16px", color: "var(--primary)" }}>4. Approved Payment Methods</h2>
                <p style={{ color: "var(--muted)", margin: "0 0 16px 0" }}>
                  We accept the following legal payment methods for project billing:
                </p>
                <ul style={{ paddingLeft: "20px", color: "var(--muted)", display: "flex", flexDirection: "column", gap: "8px" }}>
                  <li><strong>Bank Transfers:</strong> NEFT, IMPS, RTGS, and Wire Transfers directly to our HDFC Corporate Account.</li>
                  <li><strong>Unified Payments Interface (UPI):</strong> Secure payments via GPAY, PhonePe, or BHIM.</li>
                  <li><strong>Card Payments:</strong> Major Credit & Debit Cards (Visa, Mastercard, RuPay) processed securely via Razorpay or Stripe.</li>
                </ul>
              </div>

              <div>
                <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "16px", color: "var(--primary)" }}>5. Refund & Cancellation Policy</h2>
                <p style={{ color: "var(--muted)", margin: "0 0 16px 0" }}>
                  We dedicate engineering resources and server capacities immediately upon project signup:
                </p>
                <ul style={{ paddingLeft: "20px", color: "var(--muted)", display: "flex", flexDirection: "column", gap: "8px" }}>
                  <li><strong>Deposits:</strong> Upfront deposits (40%) are non-refundable once development or design scoping has commenced.</li>
                  <li><strong>In-Progress Cancellations:</strong> If you cancel during development, you are billed for all milestones completed up to the cancellation date.</li>
                  <li><strong>Final Products:</strong> No refunds are issued after final delivery, deployment, or transfer of the source code.</li>
                </ul>
              </div>

              <div>
                <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "16px", color: "var(--primary)" }}>6. IT Maintenance & SLA Support</h2>
                <p style={{ color: "var(--muted)", margin: "0 0 16px 0" }}>
                  All delivered custom software products include a **30-day complimentary warranty** for bug resolutions. Ongoing IT maintenance contracts are governed by our SLA support packages:
                </p>
                <ul style={{ paddingLeft: "20px", color: "var(--muted)", display: "flex", flexDirection: "column", gap: "8px" }}>
                  <li><strong>Monthly/Annual Retainers:</strong> Covers backup checks, server patches, and priority bug support.</li>
                  <li><strong>Response Times:</strong> Under active SLA, critical issues (site offline) receive a response within **4 hours**. Standard requests are handled within **24 hours**.</li>
                  <li><strong>Out of Scope:</strong> Major structural changes or new modules are treated as new projects and quoted separately.</li>
                </ul>
              </div>

              <div>
                <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "16px", color: "var(--primary)" }}>7. Intellectual Property & Code Ownership</h2>
                <p style={{ color: "var(--muted)", margin: 0 }}>
                  Full ownership, copyright, and publishing rights of custom code, assets, and databases transfer to you only upon successful clearance of all pending invoices. Nexhydigital retains proprietary core classes, architectural libraries, and background framework dependencies.
                </p>
              </div>

              <div>
                <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "16px", color: "var(--primary)" }}>8. Liability & Warranty Disclaimers</h2>
                <p style={{ color: "var(--muted)", margin: 0 }}>
                  We build systems to high standards, but we do not warrant that software will be entirely bug-free or immune to malicious hacks. Nexhydigital is not liable for business interruptions, loss of profits, or data loss caused by hosting providers, third-party APIs, or domain configuration issues.
                </p>
              </div>

              <div>
                <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "16px", color: "var(--primary)" }}>9. Legal Contact & Disputes</h2>
                <p style={{ color: "var(--muted)", margin: "0 0 16px 0" }}>
                  All contracts and terms are subject to the laws of India. Legal disputes are governed under the exclusive jurisdiction of the courts of Hyderabad, Telangana, India.
                </p>
                <div style={{
                  background: "rgba(255, 255, 255, 0.02)",
                  border: "1px solid rgba(255, 255, 255, 0.05)",
                  borderRadius: "12px",
                  padding: "20px",
                  fontSize: "0.9rem",
                  color: "#cbd5e1"
                }}>
                  <p style={{ margin: "0 0 8px 0" }}><strong>🏢 Registered Office:</strong> Nexhydigital Technologies Pvt Ltd, Hitech City, Hyderabad, 500081, India</p>
                   <p style={{ margin: "0 0 8px 0" }}><strong>✉ Legal Support:</strong> <a href="mailto:legal@nexhydigital.in" style={{ color: "var(--accent)", textDecoration: "none", fontWeight: 600 }}>legal@nexhydigital.in</a></p>
                  <p style={{ margin: 0 }}><strong>📱 Corporate Helpdesk:</strong> +91 9603230138</p>
                </div>
              </div>

            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
