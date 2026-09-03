import "./globals.css";
import "./animations.css";
import "@/components/site-header-footer.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ThemeToggle } from "@/components/theme-toggle";
import { SessionTracker } from "@/components/session-tracker";
import Script from "next/script";

export const metadata = {
  metadataBase: new URL("https://nexhydigital.in"),
  title: {
    default: "Nexhy Digital | ERP Software, School Websites & IT Solutions Hyderabad",
    template: "%s | Nexhy Digital"
  },
  description:
    "Nexhy Digital (Nexhydigital) — Hyderabad's #1 IT & tech solutions company. We build ERP software, school & college websites, mobile apps, e-commerce platforms, CRM systems, and provide 24/7 website maintenance. Find top developers near you in Hyderabad.",
  keywords: [
    // ── Brand Variants ──────────────────────────────────────────
    "Nexhy Digital",
    "Nexhy",
    "Nex",
    "Nexhydigital",
    "Nexhy Digital Hyderabad",
    "Nex Digital",
    "Nex Software",
    "Nex IT",
    "Nexhydigital.in",
    "NexhyDigital",
    // ── ERP Software ────────────────────────────────────────────
    "ERP Software",
    "ERP Software Hyderabad",
    "ERP Software Development",
    "Custom ERP System",
    "Enterprise Resource Planning Software",
    "ERP Solution Company India",
    // ── School & College ─────────────────────────────────────────
    "School Website",
    "School Websites Hyderabad",
    "School Management Software",
    "College Website Development",
    "College Portal Development",
    "School College Websites",
    "Educational Website Development India",
    // ── Web & IT Broad Terms ─────────────────────────────────────
    "Websites",
    "Website Development Company",
    "IT Software Company",
    "IT Softwares Hyderabad",
    "Tech Solutions",
    "Tech Solutions Hyderabad",
    "Technology Solutions India",
    "Digital Solutions",
    "Digital",
    "Solutions",
    "IT Solutions",
    "IT Solutions Hyderabad",
    // ── Near Me / Local SEO ──────────────────────────────────────
    "Software Developers Near Me",
    "Web Developers Near Hyderabad",
    "IT Company Near Me Hyderabad",
    "Developers Nearby Hyderabad",
    "IT Support Near Me",
    "Software Company Near Me",
    // ── Specific Services ────────────────────────────────────────
    "Custom Web Development Hyderabad",
    "ERP Software Development Hyderabad",
    "Online Exam Engine",
    "Mobile App Developers Hyderabad",
    "E-Commerce Web Development",
    "Website Maintenance Support",
    "Hyderabad IT Company",
    "Software Company Hyderabad",
    "IT Company Hitech City",
    // ── Portfolio / Client References ────────────────────────────
    "Lathika Polyclinic",
    "AVNIET College Portal",
    "AVNIET College",
    "CRT Exam Portal"
  ],
  authors: [{ name: "Nexhy Digital", url: "https://nexhydigital.in" }],
  creator: "Nexhy Digital",
  publisher: "Nexhy Digital",
  openGraph: {
    title: "Nexhy Digital | Enterprise IT Solutions & Software Development Hyderabad",
    description: "Nexhy Digital — Hyderabad's trusted IT partner architecting ERP systems, school platforms, mobile apps, and custom web solutions.",
    url: "https://nexhydigital.in",
    siteName: "Nexhy Digital",
    images: [
      {
        url: "/logo.png",
        width: 800,
        height: 600,
        alt: "Nexhy Digital — Enterprise IT Solutions Hyderabad",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nexhy Digital | Enterprise IT Solutions Hyderabad",
    description: "Nexhy Digital — Hyderabad's trusted IT partner architecting ERP systems, school platforms, mobile apps, and custom web solutions.",
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/logo-mark.png",
  },
  verification: {
    google: "wyXRxAERTncHWEdNtZiuWjfcXpTVIh4aO6cWMndDZtU",
  },
  alternates: {
    canonical: "https://nexhydigital.in",
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Nexhy Digital",
  "alternateName": ["Nex", "Nexhy", "Nexhydigital", "Nex Digital", "NexhyDigital", "Nexhydigital Technologies", "Nexhydigital.in"],
  "url": "https://nexhydigital.in",
  "logo": "https://nexhydigital.in/logo.png",
  "description": "Nexhy Digital is a Hyderabad-based enterprise IT company delivering custom ERP software, school management systems, mobile apps, and web development solutions.",
  "foundingDate": "2022",
  "areaServed": "India",
  "email": "nexhydigital@gmail.com",
  "telephone": "+91-9603230138",
  "sameAs": [
    "https://www.linkedin.com/company/144772227",
    "https://www.instagram.com/nexhydigital/?hl=en",
    "https://github.com/rahul123rahul/Nexhydigital.in"
  ]
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Nexhydigital",
  "url": "https://nexhydigital.in",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://nexhydigital.in/services?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Nexhy Digital",
  "alternateName": ["Nex", "Nexhy", "Nexhydigital"],
  "url": "https://nexhydigital.in",
  "logo": "https://nexhydigital.in/logo.png",
  "image": "https://nexhydigital.in/logo.png",
  "description": "Nexhy Digital is a Hyderabad IT company specializing in custom ERP software, school management systems, mobile apps, e-commerce platforms, and 24/7 website maintenance.",
  "priceRange": "₹₹",
  "currenciesAccepted": "INR",
  "paymentAccepted": "Cash, Credit Card, UPI, Bank Transfer",
  "telephone": "+91-9603230138",
  "email": "nexhydigital@gmail.com",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Hitech City",
    "addressLocality": "Hyderabad",
    "addressRegion": "Telangana",
    "postalCode": "500081",
    "addressCountry": "IN"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "17.4483",
    "longitude": "78.3741"
  },
  "areaServed": [
    {
      "@type": "City",
      "name": "Hyderabad"
    },
    {
      "@type": "Country",
      "name": "India"
    }
  ],
  "openingHoursSpecification": {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday"
    ],
    "opens": "09:00",
    "closes": "18:00"
  },
  "sameAs": [
    "https://www.linkedin.com/company/144772227",
    "https://www.instagram.com/nexhydigital/?hl=en"
  ]
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is Nexhy Digital?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Nexhy Digital (also known as Nexhydigital) is a Hyderabad-based IT company that builds custom ERP software, school management systems, mobile apps, e-commerce platforms, and provides 24/7 website maintenance across India."
      }
    },
    {
      "@type": "Question",
      "name": "Where is Nexhy Digital located?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Nexhy Digital is located in Hitech City, Hyderabad, Telangana, India — 500081. You can reach us at +91 9603230138 or nexhydigital@gmail.com."
      }
    },
    {
      "@type": "Question",
      "name": "What services does Nexhy Digital offer?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Nexhy Digital offers custom ERP development, school management software, mobile app development (Android and iOS), e-commerce website development, custom CRM systems, web development, and ongoing website maintenance and IT support."
      }
    },
    {
      "@type": "Question",
      "name": "How do I contact Nexhy Digital?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "You can contact Nexhy Digital by phone at +91 9603230138, +91 91213 91173, or +91 90001 80485, by email at nexhydigital@gmail.com, or by filling the contact form at nexhydigital.in/contact."
      }
    },
    {
      "@type": "Question",
      "name": "Does Nexhy Digital build school management software?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Nexhy Digital specializes in school and college ERP systems including admission management, digital attendance, online fee collection, exam marks, and parent SMS alerts. Our school software has been deployed for institutions like Vision Academy."
      }
    }
  ]
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* CookieYes Banner Verification */}
        <script
          id="cookieyes"
          type="text/javascript"
          src="https://cdn-cookieyes.com/client_data/b8e6eb9657d3534ff32afa33/script.js"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      </head>
      <body suppressHydrationWarning>

        {/* Google Analytics (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-WSLPFWQCYN"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-WSLPFWQCYN');
          `}
        </Script>

        <SessionTracker />
        <SiteHeader />
        {children}
        <ThemeToggle floating={true} />
        <SiteFooter />
      </body>
    </html>
  );
}
