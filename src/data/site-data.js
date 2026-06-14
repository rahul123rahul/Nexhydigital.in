// ══════════════════════════════════════════════════════════════════════════════
//  site-data.js
//  Public-page content only. All admin data is stored in src/data/*.json and
//  consumed live via /api/admin/* API routes — no demo / hardcoded data here.
// ══════════════════════════════════════════════════════════════════════════════

// ─── Navigation ───────────────────────────────────────────────────────────────
export const navigationItems = [
  { label: "Home", href: "/" },
  { label: "About us", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Careers", href: "/careers" },
  { label: "Contact", href: "/contact" },
];

// ─── Hero & trust counters ─────────────────────────────────────────────────────
export const heroMetrics = [
  { label: "Projects Delivered", value: "50+" },
  { label: "Happy Clients", value: "30+" },
  { label: "Years in Hyderabad", value: "3+" },
  { label: "Support Available", value: "24×7" },
];

export const trustCounters = [
  { label: "Projects Delivered", value: 50, suffix: "+" },
  { label: "Satisfied Clients", value: 30, suffix: "+" },
  { label: "On-time Delivery", value: 98, suffix: "%" },
];

export const investorMetrics = [
  { label: "Projects Delivered", value: "50+" },
  { label: "Satisfied Clients", value: "30+" },
  { label: "Industries Served", value: "8+" },
  { label: "Team Members", value: "15+" },
  { label: "On-time Delivery", value: "98%" },
];

// ─── Services ─────────────────────────────────────────────────────────────────
export const solutions = [
  {
    icon: "🏢", title: "ERP Software",
    description: "Custom Enterprise Resource Planning — HR, inventory, finance, payroll, and reporting in one unified platform."
  },
  {
    icon: "🎓", title: "School & College Websites",
    description: "Professional mobile-friendly websites with admissions portals, notice boards, gallery, and fee management."
  },
  {
    icon: "💼", title: "Portfolio Websites",
    description: "Stunning personal and business portfolio sites that make a strong first impression and showcase your work."
  },
  {
    icon: "📱", title: "App Development",
    description: "Android, iOS, and cross-platform apps built with modern frameworks — from idea to App Store in weeks."
  },
  {
    icon: "🌐", title: "Custom Web Applications",
    description: "Tailor-made web platforms — booking systems, dashboards, CRMs, e-commerce, and any custom business tool."
  },
  {
    icon: "🔧", title: "Website Maintenance & Support",
    description: "Ongoing technical support, bug fixes, content updates, security patches, and performance optimisation."
  },
];

export const clientLogos = ["Apex Systems", "Vision Academy", "NovaMed Clinics", "Prime Traders", "Crest College", "TechOrbit"];
export const trustPartners = ["Google Cloud", "Amazon Web Services", "Vercel", "Hostinger"];
export const trustBadges = ["Hyderabad-Based Team", "On-time Delivery Guarantee", "Transparent Pricing", "Lifetime Support Available"];

export const companyHighlights = [
  { icon: "⚡", title: "Fast Delivery", description: "Most projects are delivered within the agreed timeline without compromising on quality." },
  { icon: "💬", title: "Clear Communication", description: "Regular updates, transparent pricing, and a dedicated point of contact — no surprises, ever." },
  { icon: "🛡️", title: "Reliable Support", description: "We don't disappear after delivery. Every project gets ongoing maintenance and support." },
];

export const caseStudies = [
  { title: "School ERP & Website — Hyderabad", before: "Manual attendance, paper records, no online presence", after: "Full ERP with 1,200 students automated and a professional website launched", metrics: ["60% admin time saved", "Online admissions active", "Launched in 4 weeks"] },
  { title: "Business Portfolio — Secunderabad", before: "No website, losing clients to competitors with online presence", after: "Premium portfolio site with contact forms, gallery, and Google ranking", metrics: ["3× enquiry growth", "Page 1 Google in 60 days", "Mobile-first design"] },
  { title: "Custom Billing App — Hyderabad", before: "Manual invoicing, Excel sheets, payment tracking chaos", after: "Custom billing web app with GST, receipts, and client dashboard", metrics: ["100% paperless billing", "GST-ready reports", "30% faster collections"] },
];

// ─── Testimonials ──────────────────────────────────────────────────────────────
export const landingProjectScreens = [
  { title: "School ERP Dashboard", description: "Attendance, admissions, fees, notices, and student records in one operational view." },
  { title: "Business Billing Workspace", description: "GST-ready invoices, payment tracking, receipts, and customer reporting." },
  { title: "Service Operations Portal", description: "A responsive dashboard for requests, workflows, analytics, and team coordination." },
];

export const testimonials = [
  { quote: "Nexhydigital built our school website and ERP in under a month. The team is professional, responsive, and genuinely cares about the outcome.", name: "Ramesh Reddy", title: "Principal, Vision Academy, Hyderabad" },
  { quote: "Very happy with the portfolio website they made for my architecture firm. Clean design, fast loading, and they explained everything in Telugu and English!", name: "Priya Sharma", title: "Architect, Secunderabad" },
  { quote: "Our billing app saved us hours every week. The Nexhydigital team understood exactly what a small business like ours needed.", name: "Mohammed Farooq", title: "Owner, Prime Traders, Hyderabad" },
];

// ─── Industries ────────────────────────────────────────────────────────────────
export const industries = [
  { icon: "🎓", title: "Education", description: "Schools, colleges, coaching centres — websites, ERPs, and student management systems.", caseStudy: "1,200+ students automated" },
  { icon: "🏥", title: "Healthcare", description: "Clinics, hospitals, and diagnostic centres — appointment systems, patient portals.", caseStudy: "Appointment wait-time cut 40%" },
  { icon: "🏪", title: "Retail & Trading", description: "Billing software, inventory management, and e-commerce stores for local businesses.", caseStudy: "Paperless billing in 2 weeks" },
  { icon: "🏗️", title: "Construction & RE", description: "Project tracking, client portals, and professional marketing websites.", caseStudy: "3× leads from new website" },
  { icon: "💼", title: "Professional Services", description: "CAs, lawyers, consultants — portfolio sites, client dashboards, document portals.", caseStudy: "100% online client onboarding" },
  { icon: "🍽️", title: "Restaurants & Hotels", description: "Menu sites, online ordering, table booking systems, and review management.", caseStudy: "Online orders up 2× in month 1" },
];

// ─── Roadmap ───────────────────────────────────────────────────────────────────
export const roadmapSteps = [
  { step: "01", title: "Free Consultation", description: "Call or WhatsApp us. We understand your requirement, give you an honest scope and price — for free." },
  { step: "02", title: "Proposal & Agreement", description: "We send a clear written proposal with timeline, cost, and deliverables. No hidden charges." },
  { step: "03", title: "Design & Development", description: "We design and build in structured phases, sharing previews at every milestone for your feedback." },
  { step: "04", title: "Testing & Launch", description: "We test thoroughly across devices and browsers, then deploy live with full handover training." },
  { step: "05", title: "Ongoing Support", description: "After launch, we stay available for updates, fixes, and future enhancements." },
];

// ─── Technology groups ─────────────────────────────────────────────────────────
export const technologyGroups = [
  { title: "Frontend", items: ["React.js", "Next.js", "HTML5 / CSS3", "JavaScript", "Responsive Design"] },
  { title: "Backend", items: ["Node.js", "PHP / Laravel", "Python", "REST APIs", "MySQL / PostgreSQL"] },
  { title: "Mobile", items: ["React Native", "Android (Java/Kotlin)", "iOS (Swift)", "Flutter", "PWA"] },
  { title: "Infrastructure", items: ["AWS", "Google Cloud", "Hostinger", "cPanel Hosting", "SSL & Domain Setup"] },
];

// ─── About / leadership ─────────────────────────────────────────────────────────
export const globalTeamMoments = [
  { icon: "🏙️", title: "Based in Hyderabad", description: "Our team works out of Hyderabad, Telangana — available for in-person meetings, site visits, and local support." },
  { icon: "🤝", title: "Founder-to-Founder", description: "We work directly with business owners — fast decisions, real relationships, no account-manager layers." },
  { icon: "🌏", title: "Growing Nationally", description: "Starting strong in Telangana and expanding to serve businesses across India." },
];

export const leadershipTeam = [
  { name: "Founder", role: "Hyderabad-based Tech Entrepreneur", description: "Built Nexhydigital to give local businesses access to world-class digital solutions at fair prices." },
  { name: "Design Lead", role: "UI/UX Designer", description: "Creates beautiful, user-friendly designs that make every business look professional online." },
  { name: "Engineering Lead", role: "Full-Stack Developer", description: "Delivers clean, maintainable code across web and mobile — from ERPs to portfolio sites." },
];

export const insightsArticles = [
  { title: "Why every Hyderabad business needs a professional website in 2025", description: "Your customers Google you before they call. Here's how a good website generates real enquiries." },
  { title: "ERP vs Excel: when it's time to upgrade your business software", description: "Signs that your growing business needs a proper ERP — and how to choose the right one without overspending." },
  { title: "How to get your school or college online in 4 weeks", description: "A step-by-step look at what a great educational institution website needs." },
];

// ─── Careers (public summary tracks) ───────────────────────────────────────────
export const careersItems = [
  "Frontend & full-stack web development",
  "Mobile app development (Android/iOS)",
  "UI/UX design",
  "Digital marketing & SEO",
  "Client success & project coordination",
];

// ─── FAQ ────────────────────────────────────────────────────────────────────────
export const faqs = [
  { q: "Are you based in Hyderabad?", a: "Yes! We are based in Hyderabad, Telangana. We're happy to meet in person or on video call — whatever works best." },
  { q: "How much does a website cost?", a: "A basic website starts at ₹8,000–₹20,000. School websites, ERPs, and custom apps are priced per scope." },
  { q: "How long does a website take?", a: "A standard website takes 1–3 weeks. Custom apps and ERPs typically take 4–8 weeks." },
  { q: "Do you provide hosting and domain?", a: "Yes — we help you choose a domain, set up hosting, configure email, and install SSL." },
  { q: "Will you maintain the website after launch?", a: "Absolutely. Monthly maintenance covers content updates, security patches, and technical support." },
  { q: "Do you work outside Hyderabad?", a: "Yes. While we're Hyderabad-first, we work with clients across Telangana and nationally — everything can be done remotely." },
];

// ─── Pricing plans ─────────────────────────────────────────────────────────────
export const pricingPlans = [
  {
    name: "Starter", badge: null, price: "₹8,000", period: "one-time",
    description: "Perfect for freelancers & small businesses.",
    features: ["Up to 5 pages", "Mobile responsive design", "Contact form", "Basic SEO setup", "1 month free support"],
    cta: "Get Started", href: "/contact",
  },
  {
    name: "Business", badge: "Most Popular", price: "₹20,000", period: "one-time",
    description: "Ideal for schools, clinics & growing businesses.",
    features: ["Up to 15 pages", "Admin panel / CMS", "WhatsApp & enquiry forms", "Google Maps integration", "3 months free support"],
    cta: "Talk to Us", href: "/contact",
  },
  {
    name: "Custom", badge: null, price: "Custom", period: "project-based",
    description: "ERP, apps, and fully custom platforms.",
    features: ["Full custom development", "ERP / App / Web app", "Dedicated project team", "Phased delivery milestones", "6 months support & warranty"],
    cta: "Request a Quote", href: "/contact",
  },
];

// ─── Tech stack ────────────────────────────────────────────────────────────────
export const techStack = [
  { name: "React.js", color: "#61dafb" },
  { name: "Next.js", color: "#ffffff" },
  { name: "Node.js", color: "#84cc16" },
  { name: "PHP / Laravel", color: "#f05340" },
  { name: "MySQL", color: "#4479a1" },
  { name: "React Native", color: "#61dafb" },
  { name: "Flutter", color: "#54c5f8" },
  { name: "AWS", color: "#ff9900" },
  { name: "Google Cloud", color: "#4285f4" },
  { name: "WordPress", color: "#21759b" },
];

// ─── Admin: role & spec options (injected into /api/admin/* route response) ─────
export const roleOptions = ["Admin", "Developer", "Designer", "Marketing", "Sales", "HR", "Accountant", "Project Manager", "Support", "Intern", "Other"];

export const specOptions = [
  "Frontend", "Backend", "Full-Stack", "UI/UX Design", "DevOps / Cloud",
  "Mobile (Android / iOS)", "ERP / Custom Software", "SEO / Digital Marketing",
  "Testing / QA", "Client Success",
];
