import { ServiceLandingPage } from "@/components/service-landing-page";

export const metadata = {
  title: "Website Maintenance & Technical Support in Hyderabad | Nexhy Digital",
  description: "Keep your site secure, fast, and up-to-date. Regular backups, security checks, and rapid updates with Nexhy Digital's professional maintenance packages.",
  alternates: {
    canonical: "https://nexhydigital.in/website-maintenance",
  },
};

const highlights = [
  {
    icon: "🛡️",
    title: "Security Auditing & Patches",
    description: "Keep plugins, frameworks, and packages up-to-date. We execute recurring malware scans and security audits to avoid code hacks.",
  },
  {
    icon: "💾",
    title: "Cloud Backups & Restoration",
    description: "We set up automated daily and weekly database and assets backups in secure offsite cloud environments for quick recovery.",
  },
  {
    icon: "⚡",
    title: "Performance Optimization",
    description: "Audit page load speeds, clean up databases, compress heavy assets, and optimize server caching rules to maintain high performance.",
  },
  {
    icon: "✍️",
    title: "Rapid Content Updates",
    description: "Need to update team files, modify pricing figures, publish news, or adjust descriptions? Submit updates and get them live in hours.",
  },
];

const faqs = [
  {
    q: "What does website maintenance cover?",
    a: "Our packages cover daily cloud backups, framework security patches, package updates, speed optimization audits, uptime monitoring, and active technical hours for content changes and bug fixes.",
  },
  {
    q: "How fast do you handle emergencies like a site going offline?",
    a: "Under an active SLA contract, critical emergency responses (such as server crash or site down) are initiated within 4 hours. Regular updates are scheduled and handled within 24 hours.",
  },
  {
    q: "Can you maintain a website that was built by another agency?",
    a: "Yes. We conduct a preliminary audit of the existing codebase, server setup, and configuration. If the code is clean, we can onboard your project into our support plans.",
  },
  {
    q: "Do you offer custom SLA support retainers for large platforms?",
    a: "Yes. For complex enterprise portals, ERPs, and custom mobile apps, we design custom monthly or quarterly SLA contracts matching your specific support requirements.",
  },
];

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Website Maintenance & Technical Support",
  "serviceType": "Technical Maintenance Services",
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
  "description": "Website Maintenance & Technical Support in Hyderabad. Complete security patching, automated backups, speed tuning, and rapid content updates."
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

export default function WebsiteMaintenancePage() {
  return (
    <ServiceLandingPage
      eyebrow="Solutions for Maintenance"
      title="Website Maintenance & Support in Hyderabad"
      description="Keep your digital platforms secure, fast, and optimized. We offer proactive website maintenance, automated cloud backups, security patching, and rapid content updates to protect your online operations."
      serviceName="Website Maintenance & Support"
      highlightsTitle="Proactive security checks,"
      highlightsSubtitle="designed to ensure maximum uptime"
      highlights={highlights}
      faqs={faqs}
      schemas={[serviceSchema, faqSchema]}
    />
  );
}
