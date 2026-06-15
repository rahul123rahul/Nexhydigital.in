import { ServiceLandingPage } from "@/components/service-landing-page";

export const metadata = {
  title: "E-commerce Website Development in Hyderabad | Nexhy Digital",
  description: "Launch your retail store online with a secure, highly-optimized e-commerce portal. Complete billing, payment gateway integration, and stock tracking.",
  alternates: {
    canonical: "https://nexhydigital.in/ecommerce-development",
  },
};

const highlights = [
  {
    icon: "🛒",
    title: "Product Catalog Management",
    description: "Easily upload items, configure variations (size, colors), track inventory volumes, and structure SEO tags for every product.",
  },
  {
    icon: "💳",
    title: "Integrated Payment Gateways",
    description: "Accept payments securely via credit cards, net banking, and UPI by integrating Razorpay, Stripe, or Paytm.",
  },
  {
    icon: "📦",
    title: "Order & Shipping Workflows",
    description: "Track shipments, send automatic order confirmation emails, print packaging slips, and update customers on delivery status.",
  },
  {
    icon: "📊",
    title: "Discount Codes & Analytics",
    description: "Generate promotional coupons, run custom campaigns, track daily cart abandons, and review weekly revenue figures.",
  },
];

const faqs = [
  {
    q: "Do you build e-commerce sites on Shopify or build custom solutions?",
    a: "We offer both. We can build fully custom e-commerce web applications using Next.js/Node.js for unique operations, or we can customize Shopify/WordPress WooCommerce platforms to match your timeline.",
  },
  {
    q: "Are payment gateways secure?",
    a: "Yes. We strictly integrate PCI-DSS compliant payment gateways (Razorpay, Paytm, Stripe) over HTTPS channels. Your server never stores raw credit card numbers or sensitive PIN data.",
  },
  {
    q: "Can this system integrate with our local logistics provider?",
    a: "Yes. We can integrate third-party courier APIs (such as Delhivery, Shiprocket, or Blue Dart) to calculate live shipping costs and sync tracking numbers automatically.",
  },
  {
    q: "Is there a dashboard to track inventory and orders?",
    a: "Yes. Every store includes a complete admin panel. You can easily view daily sales, manage inventory, process refunds, and update order tracking states.",
  },
];

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "E-commerce Website Development",
  "serviceType": "E-commerce Software Engineering",
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
  "description": "Secure and highly-optimized E-commerce Website Development in Hyderabad. Complete product catalogs, UPI/card integrations, and custom order dashboards."
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

export default function EcommerceDevelopmentPage() {
  return (
    <ServiceLandingPage
      eyebrow="Solutions for Commerce"
      title="E-commerce Website Development in Hyderabad"
      description="Launch a fast, secure online retail store. We build responsive e-commerce websites integrated with domestic payment gateways, automated shipping calculation, and real-time inventory tracking."
      serviceName="E-commerce Websites"
      highlightsTitle="Secure cart operations,"
      highlightsSubtitle="optimized for high sales conversion"
      highlights={highlights}
      faqs={faqs}
      schemas={[serviceSchema, faqSchema]}
    />
  );
}
