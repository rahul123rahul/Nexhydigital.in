"use client";

import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";

export default function PrivacyPage() {
  return (
    <main style={{ background: "var(--surface)", minHeight: "100vh" }}>
      <PageHero
        eyebrow="Legal"
        title="Privacy Policy"
        description="Last updated: June 13, 2026. Your privacy is important to us. Learn how Nexhydigital collects, uses, and safeguards your information."
      />

      <section className="section" style={{ background: "var(--surface-alt)", paddingTop: "60px", paddingBottom: "80px" }}>
        <div className="container" style={{ maxWidth: "800px", margin: "0 auto" }}>
          <Reveal>
            <div style={{ display: "flex", flexDirection: "column", gap: "36px", color: "var(--primary)", lineHeight: "1.7", fontSize: "1rem" }}>
              
              <div>
                <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "16px", color: "var(--primary)" }}>1. Information We Collect</h2>
                <p style={{ color: "var(--muted)", margin: "0 0 16px 0" }}>
                  We collect information you provide directly to us when requesting a project quote, contacting us via our form, or submitting an application for a career listing. This includes:
                </p>
                <ul style={{ paddingLeft: "20px", color: "var(--muted)", display: "flex", flexDirection: "column", gap: "8px" }}>
                  <li><strong>Contact Details:</strong> Name, email address, phone number, and organization name.</li>
                  <li><strong>Project Requirements:</strong> Details of the custom web apps, ERP systems, or portals you wish to build, along with budget and timeline estimates.</li>
                  <li><strong>Recruitment Data:</strong> Work history, resume info, and cover letters submitted for careers.</li>
                </ul>
              </div>

              <div>
                <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "16px", color: "var(--primary)" }}>2. How We Use Your Information</h2>
                <p style={{ color: "var(--muted)", margin: "0 0 16px 0" }}>
                  We utilize collected information to deliver enterprise-grade IT services and maintain customer relationships, specifically to:
                </p>
                <ul style={{ paddingLeft: "20px", color: "var(--muted)", display: "flex", flexDirection: "column", gap: "8px" }}>
                  <li>Generate proposals and custom technology quotations.</li>
                  <li>Respond to inquiries, support requests, or partnership questions.</li>
                  <li>Evaluate applications for active employment openings.</li>
                  <li>Send project status updates or service announcements.</li>
                </ul>
              </div>

              <div>
                <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "16px", color: "var(--primary)" }}>3. Cookies & Session Storage</h2>
                <p style={{ color: "var(--muted)", margin: 0 }}>
                  We use cookies and standard web analytics to verify website performance and save UI preferences (such as light/dark mode triggers). You can disable cookies in your browser settings, though some interactive elements may not load optimally.
                </p>
              </div>

              <div>
                <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "16px", color: "var(--primary)" }}>4. Information Security</h2>
                <p style={{ color: "var(--muted)", margin: 0 }}>
                  We restrict access to your private information and utilize secure hosting environments, database encryption, and SSL channels to protect client data. No method of internet transmission is 100% secure, but we apply commercial best practices to keep your data safe.
                </p>
              </div>

              <div>
                <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "16px", color: "var(--primary)" }}>5. Contact Information</h2>
                <p style={{ color: "var(--muted)", margin: 0 }}>
                  If you have questions about our privacy policies or want to request the removal of your personal information from our CRM, please contact us at <a href="mailto:hello@nexhydigital.in" style={{ color: "var(--accent)", textDecoration: "none", fontWeight: 600 }}>hello@nexhydigital.in</a> or visit our office in Hyderabad, India.
                </p>
              </div>

            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
