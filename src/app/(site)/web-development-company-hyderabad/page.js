import { ServiceLandingPage } from "@/components/service-landing-page";

export const metadata = {
  title: "Custom Web Development Company in Hyderabad | Nexhy Digital",
  description: "Enterprise-grade website development in Hyderabad. We build responsive, fast-loading, and SEO-optimized corporate websites and custom portals.",
  alternates: {
    canonical: "https://nexhydigital.in/web-development-company-hyderabad",
  },
};

const highlights = [
  {
    icon: "🌐",
    title: "Next.js & React Web Portals",
    description: "Build modern, single-page and server-side rendered portals with instant loading speeds, high security, and clean navigation layouts.",
  },
  {
    icon: "📈",
    title: "SEO-Optimized Codebase",
    description: "Every website features clean semantic HTML, schema integrations, fast core web vitals, and structured metadata for high rankings.",
  },
  {
    icon: "📱",
    title: "Fluid Responsive Layouts",
    description: "We design websites that fluidly adjust to match screen dimensions on mobile phones, tablets, laptops, and large screens.",
  },
  {
    icon: "🔐",
    title: "Secure Admin Panels",
    description: "Easily update contents, manage quotes, check candidate files, and review user logs through an intuitive dashboard.",
  },
];

const faqs = [
  {
    q: "How much does website development cost in Hyderabad?",
    a: "Our basic corporate website projects start at ₹8,000–₹20,000. Custom web applications, administrative dashboards, and database portals are priced based on specific functional requirements.",
  },
  {
    q: "How long does a website project take to go live?",
    a: "A standard corporate website takes about 1 to 3 weeks from kickoff to deployment. Complex portals, database tools, and web apps typically take 4 to 8 weeks.",
  },
  {
    q: "Will my website be mobile-friendly and optimized for Google SEO?",
    a: "Absolutely. Mobile responsiveness and clean SEO hierarchy (speed, schemas, structural title tags) are built into our core development process, ensuring your site ranks quickly.",
  },
  {
    q: "Do you provide web domain registration and hosting support?",
    a: "Yes. We set up domains, configure DNS rules (like redirects and custom emails), install SSL security certificates, and host the code on fast environments like AWS or Vercel.",
  },
];

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Custom Web Development",
  "serviceType": "Web Engineering Services",
  "provider": {
    "@type": "LocalBusiness",
    "name": "Nexhy Digital",
    "url": "https://nexhydigital.in",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Hyderabad",
      "addressRegion": "Telangana",
      "addressCountry": "IN"
    }
  },
  "areaServed": [
    {
      "@type": "City",
      "name": "Hyderabad"
    },
    {
      "@type": "State",
      "name": "Telangana"
    }
  ],
  "description": "Premium Web Development Company in Hyderabad. Build fast-loading, responsive, and SEO-optimized corporate websites and custom portals using Next.js & React."
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.map((f) => ({
    "@type": "Question",
    "name": f.q,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": f.a,
    },
  })),
};

export default function WebDevelopmentCompanyHyderabadPage() {
  return (
    <ServiceLandingPage
      eyebrow="Solutions for Web"
      title="Custom Web Development Company in Hyderabad"
      description="Launch a stunning corporate site or web application. We build fast, responsive, and highly secure custom websites and portals engineered to rank on Google and convert visitors into enquiries."
      serviceName="Custom Web Applications"
      highlightsTitle="Stunning interface designs,"
      highlightsSubtitle="backed by robust backend engineering"
      highlights={highlights}
      faqs={faqs}
      schemas={[serviceSchema, faqSchema]}
    />
  );
}
