import CareersClient from "./careers-client";

export const metadata = {
  title: "Careers at Nexhy Digital | Join Our Hyderabad IT Team",
  description:
    "Explore job openings at Nexhy Digital (Nexhydigital) in Hyderabad. We are hiring React developers, Node.js engineers, UI/UX designers, and IT support specialists. Apply online today.",
  keywords: [
    "Nexhy Digital Careers",
    "Nexhydigital Jobs",
    "Software Developer Jobs Hyderabad",
    "IT Company Jobs Hyderabad",
    "React Developer Hyderabad",
    "Node.js Jobs India",
    "UI UX Designer Jobs Hyderabad",
    "Tech Jobs Hitech City"
  ],
  openGraph: {
    title: "Careers at Nexhy Digital | Join Our Hyderabad IT Team",
    description:
      "Join the Nexhy Digital team in Hyderabad. Explore open roles in web development, mobile apps, ERP engineering, and IT support. Competitive pay, growth-focused culture.",
    url: "https://nexhydigital.in/careers",
    siteName: "Nexhy Digital",
    type: "website",
  },
  alternates: {
    canonical: "https://nexhydigital.in/careers",
  },
};

export default function CareersPage() {
  return <CareersClient />;
}
