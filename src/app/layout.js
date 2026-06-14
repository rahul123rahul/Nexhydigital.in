import "./globals.css";
import "./animations.css";
import "@/components/site-header-footer.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ThemeToggle } from "@/components/theme-toggle";

export const metadata = {
  title: "Nexhydigital | Enterprise IT Solutions & Custom Software Development",
  description:
    "Nexhydigital delivers enterprise websites, ERP systems, education portals, startup MVPs, and long-term IT maintenance from Hyderabad. Transform your digital infrastructure today.",
  keywords: ["Enterprise IT", "ERP Systems", "Custom Web Development", "Mobile Apps", "Hyderabad IT Company", "School Management Software", "Digital Transformation", "IT Consulting"],
  authors: [{ name: "Nexhydigital" }],
  creator: "Nexhydigital",
  publisher: "Nexhydigital",
  openGraph: {
    title: "Nexhydigital | Enterprise IT Solutions",
    description: "Move from idea to execution with a structured technology partner based in Hyderabad.",
    url: "https://nexhydigital.in",
    siteName: "Nexhydigital",
    images: [
      {
        url: "/logo.png",
        width: 800,
        height: 600,
        alt: "Nexhydigital Enterprise IT Solutions",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nexhydigital | Enterprise IT Solutions",
    description: "Move from idea to execution with a structured technology partner based in Hyderabad.",
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/logo-mark.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <SiteHeader />
        {children}
        <ThemeToggle floating={true} />
        <SiteFooter />
      </body>
    </html>
  );
}
