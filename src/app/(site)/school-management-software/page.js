import { ServiceLandingPage } from "@/components/service-landing-page";

export const metadata = {
  title: "School ERP & Management Software in Hyderabad | Nexhy Digital",
  description: "Automate admissions, fees, exams, and attendance with our customizable School Management Software. Hyderabad-first deployment with dedicated support.",
  alternates: {
    canonical: "https://nexhydigital.in/school-management-software",
  },
};

const highlights = [
  {
    icon: "🎒",
    title: "Admissions & Student Registry",
    description: "Manage digital application forms, record online documents, allocate student classes, and track historical data seamlessly.",
  },
  {
    icon: "💵",
    title: "Fee Collection & Reminders",
    description: "Accept card or UPI payments online, track installments, automatically calculate late fees, and auto-dispatch receipt notifications.",
  },
  {
    icon: "📅",
    title: "Attendance & Notifications",
    description: "Enable teachers to record attendance in clicks. Dispatch automated SMS or WhatsApp notifications to parents for absentees.",
  },
  {
    icon: "📝",
    title: "Exams & Digital Report Cards",
    description: "Grade student assessments, automatically compute class percentiles, publish digital report cards, and notify parents.",
  },
];

const faqs = [
  {
    q: "Can this system support both schools and colleges?",
    a: "Yes. Our School & College ERP software is highly modular. It is configurable to accommodate school formats (grades, parent messaging) and college patterns (semesters, credit hours, department-level logs).",
  },
  {
    q: "Is parent and student communication automated?",
    a: "Yes. We integrate secure SMS API gateways (e.g., Twilio or local Indian bulk SMS gateways) and official WhatsApp Business APIs to trigger automatic alerts for fees, attendance, and emergency notices.",
  },
  {
    q: "Is there a portal where parents can pay fees online?",
    a: "Yes. We incorporate secure payment gateway integrations (Razorpay, Paytm, or Stripe) directly into the school portal, letting parents securely pay fees via UPI, credit/debit cards, or net banking.",
  },
  {
    q: "How secure is student and staff database data?",
    a: "We deploy school ERPs on isolated cloud environments (AWS or Google Cloud) with full SSL encryption, automatic daily database backups, and strictly defined user access roles (Admin, Teacher, Student, Parent).",
  },
];

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "School Management Software",
  "serviceType": "Educational Software Development",
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
  "description": "Premium School ERP & Management Software in Hyderabad. Automate fee collections, student databases, exam report cards, and parent communications."
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

export default function SchoolManagementSoftwarePage() {
  return (
    <ServiceLandingPage
      eyebrow="Solutions for Education"
      title="School ERP & Management Software in Hyderabad"
      description="Modernize your educational institution. Automate student registrations, track fee collections, grade exams, and sync parent communications in a single, robust platform built for schools and colleges."
      serviceName="School & College Websites"
      highlightsTitle="Streamline administration,"
      highlightsSubtitle="enhance educational outreach"
      highlights={highlights}
      faqs={faqs}
      schemas={[serviceSchema, faqSchema]}
    />
  );
}
