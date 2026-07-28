import { PageHero } from '@/components/page-hero';
import { Reveal } from '@/components/reveal';
import { caseStudies, landingProjectScreens, investorMetrics } from '@/data/site-data';

export const metadata = {
  title: 'Portfolio & Case Studies | Real Projects by Nexhydigital',
  description: 'Explore live enterprise projects by Nexhydigital including Lathika Polyclinic (lathika.in), AVNIET College (avniet.ac.in), CRT Exam Portal (crtexam.in), and Vision Academy ERP.',
  keywords: [
    'Nexhydigital Portfolio',
    'Lathika Polyclinic',
    'AVNIET College Portal',
    'CRT Exam Portal',
    'School ERP Case Study',
    'Hyderabad IT Projects',
    'Custom Software Demos'
  ],
  openGraph: {
    title: 'Portfolio & Case Studies | Real Projects by Nexhydigital',
    description: 'Explore live enterprise projects by Nexhydigital including Lathika Polyclinic, AVNIET College, CRT Exam Portal, and Vision Academy ERP.',
    url: 'https://nexhydigital.in/portfolio',
    siteName: 'Nexhydigital',
    images: [{ url: '/projects/lathika-clinic.png', width: 1200, height: 630, alt: 'Nexhydigital Portfolio Showcase' }],
    type: 'website',
  },
  alternates: {
    canonical: 'https://nexhydigital.in/portfolio',
  },
};

export default function PortfolioPage() {
  return (
    <main>
      {/* ── Hero ────────────────────────────────────────────── */}
      <PageHero
        eyebrow="Portfolio"
        title="Real projects. Measurable results. Proven delivery."
        description="Every case study shows the before-state, our engineered intervention, and the outcomes that followed."
      />

      {/* ── Project Showcase ────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <Reveal>
            <div className="lp-section-header">
              <span className="eyebrow">Project Showcase</span>
              <h2 className="lp-section-h2">
                Built to perform,{' '}
                <span className="lp-gradient-text">designed to impress</span>
              </h2>
              <p className="lp-section-lead">
                A look at the interfaces and dashboards we engineer for our clients — clean,
                functional, and built for real business workflows.
              </p>
            </div>
          </Reveal>

          <div className="card-grid two-columns" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 480px), 1fr))', gap: '32px' }}>
            {landingProjectScreens.map((screen, i) => (
              <Reveal key={screen.id || screen.title} delay={i * 0.1}>
                <div
                  className="lp-screen-card"
                  style={{
                    background: 'var(--surface-alt)',
                    border: '1px solid var(--line)',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.06)'
                  }}
                >
                  {/* Browser Frame Header */}
                  <div
                    className="lp-mock-bar"
                    style={{
                      background: 'rgba(15, 23, 42, 0.95)',
                      padding: '12px 16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderBottom: '1px solid rgba(255,255,255,0.08)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span className="lp-mock-dot" style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ff5f57' }} />
                      <span className="lp-mock-dot" style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#febc2e' }} />
                      <span className="lp-mock-dot" style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#28c840' }} />
                    </div>

                    <a
                      href={screen.href}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        color: '#38bdf8',
                        background: 'rgba(56, 189, 248, 0.12)',
                        padding: '4px 12px',
                        borderRadius: '6px',
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <span>🌐 {screen.url}</span>
                      <span style={{ fontSize: '0.7rem' }}>↗</span>
                    </a>

                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        color: screen.status?.includes('Ongoing') ? '#f59e0b' : '#10b981',
                        background: screen.status?.includes('Ongoing') ? 'rgba(245, 158, 11, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                        padding: '4px 10px',
                        borderRadius: '999px'
                      }}
                    >
                      {screen.status}
                    </span>
                  </div>

                  {/* Relevant UI Image Showcase */}
                  <div style={{ width: '100%', height: '250px', overflow: 'hidden', background: '#091322', position: 'relative' }}>
                    <img
                      src={screen.image}
                      alt={screen.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        objectPosition: 'top center',
                        transition: 'transform 0.4s ease'
                      }}
                    />
                  </div>

                  {/* Card Info & Meta */}
                  <div className="lp-screen-info" style={{ padding: '24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
                      {screen.category}
                    </div>

                    <h3 style={{ margin: '0 0 10px', fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)' }}>
                      {screen.title}
                    </h3>

                    <p style={{ margin: '0 0 18px', color: 'var(--muted)', fontSize: '0.92rem', lineHeight: 1.6, flex: 1 }}>
                      {screen.description}
                    </p>

                    {/* Tech Tags */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
                      {screen.tags?.map((tag) => (
                        <span
                          key={tag}
                          style={{
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            color: 'var(--muted)',
                            background: 'var(--surface)',
                            border: '1px solid var(--line)',
                            padding: '4px 10px',
                            borderRadius: '6px'
                          }}
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    {/* Action Link Button */}
                    <a
                      href={screen.href}
                      target="_blank"
                      rel="noreferrer"
                      className="button button-outline"
                      style={{ width: '100%', justifyContent: 'center', textDecoration: 'none', gap: '8px' }}
                    >
                      <span>Visit Live Platform ({screen.url})</span>
                      <span>↗</span>
                    </a>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Case Studies ────────────────────────────────────── */}
      <section className="section section-muted">
        <div className="container">
          <Reveal>
            <div className="lp-section-header">
              <span className="eyebrow">Case Studies</span>
              <h2 className="lp-section-h2">
                Problems solved.{' '}
                <span className="lp-gradient-text">Outcomes delivered.</span>
              </h2>
              <p className="lp-section-lead">
                We don't just ship software — we fix the operational problems that were costing
                our clients time and money.
              </p>
            </div>
          </Reveal>

          <div className="lp-case-grid">
            {caseStudies.map((cs, i) => (
              <Reveal key={cs.title} delay={i * 0.12}>
                <div className="lp-case-card">
                  {/* Before / Arrow / After */}
                  <div className="lp-case-top">
                    <div className="lp-case-before">
                      <span className="lp-case-label lp-case-label-before">Before</span>
                      <p>{cs.before}</p>
                    </div>
                    <div className="lp-case-arrow-wrap">
                      <div className="lp-case-arrow">→</div>
                    </div>
                    <div className="lp-case-after">
                      <span className="lp-case-label lp-case-label-after">After</span>
                      <p>{cs.after}</p>
                    </div>
                  </div>

                  <h3 className="lp-case-title">{cs.title}</h3>

                  <ul className="lp-case-metrics">
                    {cs.metrics.map((metric) => (
                      <li key={metric}>
                        <span style={{ color: 'var(--success)', fontWeight: 800 }}>✓</span>
                        {metric}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Delivery Metrics ────────────────────────────────── */}
      <section
        className="section"
        style={{ background: 'linear-gradient(160deg,#030c1e,#061428)', position: 'relative', overflow: 'hidden' }}
      >
        {/* Background glow */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(ellipse 60% 80% at 10% 50%, rgba(15,98,254,0.12), transparent),' +
              'radial-gradient(ellipse 50% 60% at 90% 30%, rgba(0,212,255,0.09), transparent)',
            pointerEvents: 'none',
          }}
        />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <Reveal>
            <div className="lp-section-header lp-section-header-center" style={{ textAlign: 'center', margin: '0 auto 52px' }}>
              <span className="eyebrow">Delivery Metrics</span>
              <h2 className="lp-section-h2 lp-section-h2-light">
                Numbers that tell the story
              </h2>
              <p className="lp-section-lead" style={{ color: 'rgba(255,255,255,0.55)', margin: '16px auto 0' }}>
                Across every project, we track the metrics that matter most — delivery speed,
                client satisfaction, and real business outcomes.
              </p>
            </div>
          </Reveal>

          <div className="lp-metrics-grid">
            {investorMetrics.map((metric, i) => (
              <Reveal key={metric.label} delay={i * 0.1}>
                <div className="lp-metric-card">
                  <strong>{metric.value}</strong>
                  <span>{metric.label}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Hero ────────────────────────────────────────── */}
      <PageHero
        eyebrow="Your Project Next"
        title="Ready to build something that works?"
        description="Start with a free scoping call. No commitment required."
        actions={[
          { href: '/contact', label: 'Start a Free Call' },
          { href: '/services', label: 'View Services' },
        ]}
      />
    </main>
  );
}
