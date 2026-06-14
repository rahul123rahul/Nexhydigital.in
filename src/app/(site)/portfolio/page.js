import { PageHero } from '@/components/page-hero';
import { Reveal } from '@/components/reveal';
import { caseStudies, landingProjectScreens, investorMetrics } from '@/data/site-data';

export const metadata = {
  title: 'Portfolio | Nexhydigital',
  description: 'Real projects, measurable results, and proven delivery from the Nexhydigital team.',
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

          <div className="card-grid three-columns">
            {landingProjectScreens.map((screen, i) => (
              <Reveal key={screen.title} delay={i * 0.1}>
                <div className="lp-screen-card">
                  {/* Browser mockup */}
                  <div className="lp-mock-browser">
                    <div className="lp-mock-bar">
                      <span className="lp-mock-dot" style={{ background: '#ff5f57' }} />
                      <span className="lp-mock-dot" style={{ background: '#febc2e' }} />
                      <span className="lp-mock-dot" style={{ background: '#28c840' }} />
                      <div className="lp-mock-url">hygenx.in/dashboard</div>
                    </div>
                    <div className="lp-mock-body">
                      <div className="lp-mock-sidebar" />
                      <div className="lp-mock-content">
                        <div className="lp-mock-line lp-mock-line-h" />
                        <div className="lp-mock-line" style={{ width: '90%' }} />
                        <div className="lp-mock-line" style={{ width: '70%' }} />
                        <div className="lp-mock-cards">
                          <div className="lp-mock-mini-card" />
                          <div className="lp-mock-mini-card" />
                          <div className="lp-mock-mini-card" />
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Card info */}
                  <div className="lp-screen-info">
                    <h3>{screen.title}</h3>
                    <p>{screen.description}</p>
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
