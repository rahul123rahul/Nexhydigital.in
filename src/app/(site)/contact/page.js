import Link from 'next/link';
import { PageHero } from '@/components/page-hero';
import { ContactForm } from '@/app/(site)/contact/contact-form';
import { Reveal } from '@/components/reveal';
import { companyHighlights } from '@/data/site-data';

export const metadata = {
  title: 'Contact | Nexhydigital',
  description: "Let's build something great together. Get in touch with Nexhydigital — we respond within 24 hours.",
};

const contactInfo = [
  { icon: '📍', label: 'Location', value: 'Hyderabad, Telangana, India' },
  { icon: '📧', label: 'Email', value: 'asr082239@gmail.com' },
  { icon: '📞', label: 'Phone', value: '+91 9603230138' },
  { icon: '⏰', label: 'Response Time', value: 'Within 24 hours' },
];

const trustBadges = ['✓ Free Consultation', '✓ No Hidden Costs', '✓ Transparent Pricing'];

export default function ContactPage() {
  return (
    <main>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <PageHero
        eyebrow="Contact"
        title="Let's build something great together."
        description="Tell us what you need. We'll get back within 24 hours with an honest scope and clear pricing."
      />

      {/* ── Contact Layout ───────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <div className="contact-layout">
            {/* LEFT — Info Card */}
            <Reveal>
              <div className="info-card" style={{ display: 'flex', flexDirection: 'column', gap: '28px', height: '100%' }}>
                <div>
                  <h2 style={{ margin: '0 0 8px', color: 'var(--primary)', fontSize: 'clamp(1.6rem, 2.5vw, 2.2rem)', fontWeight: 900, lineHeight: 1.15 }}>
                    Get in Touch
                  </h2>
                  <p style={{ margin: 0, color: 'var(--muted)', fontSize: '0.97rem', lineHeight: 1.7 }}>
                    Reach out via any channel below, or fill in the form to the right. We're a
                    Hyderabad-based team — always happy to hop on a call or meet in person.
                  </p>
                </div>

                {/* Contact info rows */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {contactInfo.map(({ icon, label, value }) => (
                    <div
                      key={label}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '14px',
                        padding: '14px 16px',
                        borderRadius: '12px',
                        background: 'var(--surface-alt)',
                        border: '1px solid var(--line)',
                      }}
                    >
                      <span style={{ fontSize: '1.4rem', flexShrink: 0 }}>{icon}</span>
                      <div>
                        <span style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '2px' }}>
                          {label}
                        </span>
                        <span style={{ display: 'block', fontWeight: 600, color: 'var(--primary)', fontSize: '0.95rem' }}>
                          {value}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* WhatsApp CTA */}
                <Link
                  className="button button-glow"
                  href="https://wa.me/919603230138?text=Hello%20Nexhydigital%2C%20I%20need%20help%20with%20a%20project."
                  target="_blank"
                  rel="noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', justifyContent: 'center' }}
                >
                  <span style={{ fontSize: '1.2rem' }}>💬</span>
                  WhatsApp Us Now
                </Link>

                {/* Trust badges */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: 'auto', paddingTop: '8px' }}>
                  {trustBadges.map((badge) => (
                    <span
                      key={badge}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        padding: '7px 14px',
                        borderRadius: '999px',
                        background: 'rgba(16,124,65,0.08)',
                        border: '1px solid rgba(16,124,65,0.2)',
                        color: 'var(--success)',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        letterSpacing: '0.02em',
                      }}
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* RIGHT — Contact Form */}
            <Reveal delay={0.12}>
              <ContactForm />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Why Teams Choose Nexhydigital ──────────────────────────── */}
      <section className="section section-muted">
        <div className="container">
          <Reveal>
            <div className="lp-section-header lp-section-header-center" style={{ textAlign: 'center', margin: '0 auto 52px' }}>
              <span className="eyebrow">Why Work With Us</span>
              <h2 className="lp-section-h2">
                Why teams choose{' '}
                <span className="lp-gradient-text">Nexhydigital</span>
              </h2>
              <p className="lp-section-lead" style={{ margin: '16px auto 0' }}>
                We're not just another agency. We're a Hyderabad team that treats every project
                like it's our own business on the line.
              </p>
            </div>
          </Reveal>

          <div className="lp-why-grid">
            {companyHighlights.map((item, i) => (
              <Reveal key={item.title} delay={i * 0.1}>
                <div className="lp-why-card">
                  <div className="lp-why-icon-wrap">
                    <span className="lp-why-icon">{item.icon}</span>
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
