import { PageHero } from "@/components/page-hero";
import { trustBadges, trustPartners } from "@/data/site-data";

export default function PartnersPage() {
  return (
    <main>
      <PageHero
        eyebrow="Partners"
        title="Trusted technology partner for digital transformation."
        description="Our delivery architecture is aligned around cloud-ready systems, security thinking, and durable operational support."
      />

      <section className="section">
        <div className="container card-grid two-columns">
          <article className="info-card">
            <h3>Technology Partnerships</h3>
            <ul className="simple-list">
              {trustPartners.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
          <article className="info-card">
            <h3>Trust Architecture</h3>
            <ul className="simple-list">
              {trustBadges.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </div>
      </section>
    </main>
  );
}
