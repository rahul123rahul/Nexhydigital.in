import { ServiceLandingPage } from "@/components/service-landing-page";

export const metadata = {
  title: "Custom CRM Software Development Company in Hyderabad | Nexhy Digital",
  description: "Streamline customer relationships and sales pipelines with a custom CRM. Built specifically for your sales workflows and customer tracking needs.",
  alternates: {
    canonical: "https://nexhydigital.in/custom-crm-development",
  },
};

const highlights = [
  {
    icon: "🎯",
    title: "Lead Pipeline Tracking",
    description: "Manage visual sales funnels, track candidate conversions, assign leads to representatives, and monitor deal closure pipelines.",
  },
  {
    icon: "💬",
    title: "Client Communications Log",
    description: "Record emails, SMS history, WhatsApp pings, call notes, and task reminders directly in individual client profile timelines.",
  },
  {
    icon: "📅",
    title: "Automated Follow-ups",
    description: "Schedule auto-triggered reminder tasks and customer emails to nurture inquiries and improve team response times.",
  },
  {
    icon: "📊",
    title: "Performance Reports",
    description: "Evaluate team productivity, track closing ratios, measure lead response durations, and check revenue forecasts in real time.",
  },
];

const faqs = [
  {
    q: "Why should we choose custom CRM over Salesforce or HubSpot?",
    a: "Salesforce and HubSpot charge recurring monthly fees per seat, which can get extremely expensive as your team grows. A custom CRM is a one-time build cost with no per-user licensing fees, designed specifically for your exact business process.",
  },
  {
    q: "Can this CRM integrate with our website and WhatsApp?",
    a: "Yes. We can link the CRM to capture web form submissions automatically, and configure official WhatsApp APIs to allow your sales reps to message clients directly from their dashboards.",
  },
  {
    q: "Do you build role-based permissions for sales staff?",
    a: "Absolutely. We build granular user access hierarchies so that agents only see their own assigned leads, while managers and super admins retain access to all logs, data, and performance analytics.",
  },
  {
    q: "Can we export reports and client lists?",
    a: "Yes. Your CRM will include data tools to export logs, clients databases, and transaction reports into Excel, CSV, or formatted PDF documents in a single click.",
  },
];

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Custom CRM Development",
  "serviceType": "Customer Relationship Software",
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
  "description": "Custom CRM Software Development in Hyderabad. Build tailored systems for sales tracking, lead pipelines, client communications, and automated reminders."
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

export default function CustomCRMDevelopmentPage() {
  return (
    <ServiceLandingPage
      eyebrow="Solutions for Sales"
      title="Custom CRM Development Company in Hyderabad"
      description="Streamline customer management and accelerate sales. We build custom CRM platforms designed to track leads, automate follow-ups, organize client communications, and boost performance—all with zero recurring license fees."
      serviceName="Custom CRM Platforms"
      highlightsTitle="Organize customer data,"
      highlightsSubtitle="boost sales team productivity"
      highlights={highlights}
      faqs={faqs}
      schemas={[serviceSchema, faqSchema]}
    />
  );
}
