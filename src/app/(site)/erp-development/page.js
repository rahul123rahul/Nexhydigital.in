import { ServiceLandingPage } from "@/components/service-landing-page";

export const metadata = {
  title: "Custom ERP Software Development Company in Hyderabad | Nexhy Digital",
  description: "Looking for an enterprise ERP development company in Hyderabad? Nexhy Digital designs unified ERP systems for HR, inventory, payroll, and business operations.",
  alternates: {
    canonical: "https://nexhydigital.in/erp-development",
  },
};

const highlights = [
  {
    icon: "📊",
    title: "Unified Analytics & Reporting",
    description: "Consolidate data from HR, inventory, finance, and payroll into clear dashboards with visual charts and auto-generated PDF reports.",
  },
  {
    icon: "👥",
    title: "HRM & Attendance Automation",
    description: "Automate check-ins, shift planning, leave requests, performance metrics, and salary computations without manual spreadsheets.",
  },
  {
    icon: "📦",
    title: "Inventory & Warehousing",
    description: "Track stock movements, automate supplier reorders, generate barcodes, and maintain real-time alerts for low stock items.",
  },
  {
    icon: "💳",
    title: "GST Billing & Payroll",
    description: "Automate payroll distribution, tax deductions, PF/ESI reports, and generate custom GST-compliant invoices instantly.",
  },
];

const faqs = [
  {
    q: "Do you build custom ERP or customize open-source platforms?",
    a: "We do both. We build fully custom ERP platforms tailored to your business rules, or we can customize and host platforms like ERPNext or Odoo depending on your budget and timeline.",
  },
  {
    q: "How long does custom ERP development take?",
    a: "A standard customized ERP takes 4 to 8 weeks for scoping, development, testing, and deployment. Larger deployments with complex legacy migrations can take 12+ weeks.",
  },
  {
    q: "Can you migrate our existing Excel sheets or database data?",
    a: "Yes. We design custom migration scripts to sanitize and safely import your legacy spreadsheets, PostgreSQL/MySQL databases, or CSV files into the new ERP database.",
  },
  {
    q: "Do you charge monthly user licensing fees?",
    a: "No. Unlike SaaS ERP providers who charge per user per month, we build custom solutions with a one-time development cost. You retain full database ownership.",
  },
];

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Custom ERP Software Development",
  "serviceType": "Enterprise Software Development",
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
  "description": "Enterprise-grade Custom ERP Software Development in Hyderabad. We build unified portals for HR, inventory, finance, payroll, and reporting."
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

export default function ERPDevelopmentPage() {
  return (
    <ServiceLandingPage
      eyebrow="Solutions for Enterprises"
      title="Custom ERP Development Company in Hyderabad"
      description="Consolidate your operations into one unified system. We design and build secure, custom ERP systems tailored to your exact business workflows—eliminating licensing fees and paper chaos."
      serviceName="ERP Software"
      highlightsTitle="Robust enterprise tools,"
      highlightsSubtitle="custom-tailored to your operations"
      highlights={highlights}
      faqs={faqs}
      schemas={[serviceSchema, faqSchema]}
    />
  );
}
