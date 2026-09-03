import { PageHero } from "@/components/page-hero";
import { trustBadges, trustPartners } from "@/data/site-data";

export const metadata = {
  title: "Technology Partners & Trust Architecture | Nexhy Digital Hyderabad",
  description:
    "Nexhy Digital partners with leading cloud providers, security platforms, and technology vendors to deliver reliable enterprise IT solutions. Learn about our technology partnerships and trust framework.",
  keywords: [
    "Nexhy Digital Partners",
    "Nexhydigital Technology Partners",
    "Cloud IT Partners Hyderabad",
    "Enterprise IT Trust Architecture",
    "Software Company Partnerships India"
  ],
  openGraph: {
    title: "Technology Partners & Trust Architecture | Nexhy Digital",
    description: "Nexhy Digital's delivery architecture is aligned around cloud-ready systems, security thinking, and durable operational support through trusted technology partnerships.",
    url: "https://nexhydigital.in/partners",
    siteName: "Nexhy Digital",
    type: "website",
  },
  alternates: {
    canonical: "https://nexhydigital.in/partners",
  },
};

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
