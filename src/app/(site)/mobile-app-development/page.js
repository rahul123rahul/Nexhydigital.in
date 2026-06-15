import { ServiceLandingPage } from "@/components/service-landing-page";

export const metadata = {
  title: "Mobile App Development Company in Hyderabad | Android & iOS Apps",
  description: "Turn your ideas into premium mobile apps. Nexhy Digital builds scalable Android and iOS applications using React Native and Flutter for startups & enterprises.",
  alternates: {
    canonical: "https://nexhydigital.in/mobile-app-development",
  },
};

const highlights = [
  {
    icon: "📱",
    title: "Cross-Platform Frameworks",
    description: "Write once, run beautifully. We build React Native and Flutter apps that deploy onto both Android and iOS with native performance.",
  },
  {
    icon: "🎨",
    title: "Interactive UI/UX Prototypes",
    description: "Our design team structures high-fidelity Figma layouts, interactive prototypes, and wireframes before writing code.",
  },
  {
    icon: "⚙️",
    title: "Scalable API & Cloud Backends",
    description: "We deploy secure Node.js or Python backend servers with PostgreSQL/MySQL databases to support millions of mobile requests.",
  },
  {
    icon: "🚀",
    title: "Store Submission & Launch",
    description: "We manage the entire deployment lifecycle, configuring App Store and Google Play console credentials to get your app live.",
  },
];

const faqs = [
  {
    q: "Should I build a native app or a cross-platform (React Native/Flutter) app?",
    a: "For most business applications, React Native or Flutter is highly recommended. They cut development costs by nearly 50% and allow you to launch on both Android and iOS from a single codebase.",
  },
  {
    q: "How much does mobile app development cost in India?",
    a: "A basic mobile app starts at ₹40,000–₹80,000. Complex apps with live GPS tracking, payment gateways, custom APIs, and real-time messaging start from ₹1.5L to ₹4L depending on the scope.",
  },
  {
    q: "Do you publish our mobile app to the Play Store and App Store?",
    a: "Yes. We handle the entire configuration, certificate provisioning, assets creation, and store submission process to successfully launch your app on Google Play and Apple App Store.",
  },
  {
    q: "Do you provide backend systems and database support?",
    a: "Absolutely. We build robust, secure backend REST APIs and admin dashboards using Node.js or Python. This allows you to manage users, transactions, and content inside the app easily.",
  },
];

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Mobile App Development",
  "serviceType": "Mobile Software Engineering",
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
  "description": "Premium Mobile App Development Company in Hyderabad. Build cross-platform Android and iOS applications using React Native, Flutter, and secure cloud databases."
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

export default function MobileAppDevelopmentPage() {
  return (
    <ServiceLandingPage
      eyebrow="Solutions for Mobile"
      title="Mobile App Development Company in Hyderabad"
      description="Turn your ideas into premium, high-performance mobile apps. We design and develop scalable cross-platform Android & iOS applications using React Native & Flutter, completely integrated with secure cloud backends."
      serviceName="App Development"
      highlightsTitle="Cross-platform performance,"
      highlightsSubtitle="designed for modern mobile devices"
      highlights={highlights}
      faqs={faqs}
      schemas={[serviceSchema, faqSchema]}
    />
  );
}
