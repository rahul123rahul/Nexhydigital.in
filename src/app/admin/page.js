"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  MessageSquare,
  Users,
  Briefcase,
  LogOut,
  Plus,
  Search,
  Filter,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Clock,
  Trash2,
  Edit,
  X,
  MapPin,
  FileText,
  User,
  Phone,
  Mail,
  HelpCircle,
  Check,
  TrendingUp,
  Megaphone,
  Percent,
  UserCheck,
  Send,
  Building2,
  PhoneCall,
  MessageCircle,
  Download,
  ExternalLink
} from "lucide-react";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [adminUser, setAdminUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Data States
  const [leads, setLeads] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [candidates, setCandidates] = useState([]);

  // NEW: Billing & Pricing CRM Data States
  const [plans, setPlans] = useState([]);
  const [projects, setProjects] = useState([]);
  const [crmNotifications, setCrmNotifications] = useState([]);
  const [adminInvoices, setAdminInvoices] = useState([]);
  const [adminProposals, setAdminProposals] = useState([]);
  const [adminAgreements, setAdminAgreements] = useState([]);
  const [promoCodes, setPromoCodes] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [payments, setPayments] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [billingReport, setBillingReport] = useState({
    metrics: { totalRevenue: 0, mrr: 0, activeSubscribers: 0, activeTrials: 0 },
    promoUses: {},
    planDistribution: {},
    payments: []
  });

  // NEW: Sub-tab under Billing page
  const [billingSubTab, setBillingSubTab] = useState("plans");

  // Support Tickets & Customer Profile States
  const [adminTickets, setAdminTickets] = useState([]);
  const [selectedCustomerEmail, setSelectedCustomerEmail] = useState(null);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [editingTicket, setEditingTicket] = useState(null);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [crmStageFilter, setCrmStageFilter] = useState("All");
  const [leadSearch, setLeadSearch] = useState("");

  // Modal States
  const [showAddLeadModal, setShowAddLeadModal] = useState(false);
  const [showAddJobModal, setShowAddJobModal] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [editingJob, setEditingJob] = useState(null);

  // NEW: Modal States for Pricing & CRM features
  const [showAddPlanModal, setShowAddPlanModal] = useState(false);
  const [showAddPromoModal, setShowAddPromoModal] = useState(false);
  const [showAddSubscriptionModal, setShowAddSubscriptionModal] = useState(false);
  const [showAddPaymentModal, setShowAddPaymentModal] = useState(false);
  const [showAddAnnouncementModal, setShowAddAnnouncementModal] = useState(false);

  const [editingPlan, setEditingPlan] = useState(null);
  const [editingPromo, setEditingPromo] = useState(null);
  const [editingSubscription, setEditingSubscription] = useState(null);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);

  // NEW: Clients CRM state variables
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [showClientModal, setShowClientModal] = useState(false);
  const [showAddClientModal, setShowAddClientModal] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [clientSearch, setClientSearch] = useState("");
  const [clientStatusFilter, setClientStatusFilter] = useState("All");
  const [clientProfileTab, setClientProfileTab] = useState("overview");
  const [clientComms, setClientComms] = useState([]);
  const [clientForm, setClientForm] = useState({ name: "", company_name: "", email: "", phone: "", address: "", gst_number: "", tax_details: "", notes: "", status: "Lead" });
  const [sendCommForm, setSendCommForm] = useState({ type: "email", subject: "", message: "" });

  // New Lead Form State
  const [leadForm, setLeadForm] = useState({
    name: "",
    email: "",
    phone: "",
    service: "Custom Web Development",
    budget: "1L - 3L",
    message: "",
    stage: "New",
    status: "Pending",
    notes: ""
  });

  // New Job Form State
  const [jobForm, setJobForm] = useState({
    title: "",
    dept: "Engineering",
    type: "Full-time",
    loc: "Hyderabad",
    open: "1",
    description: "",
    requirements: "",
    published: true
  });

  // NEW: Pricing Plans Form State
  const [planForm, setPlanForm] = useState({
    id: "",
    name: "",
    price: "",
    billing_cycle: "one-time",
    free_trial_days: "0",
    active: true,
    features: {
      pages: "Up to 5",
      responsive: "✓",
      contactForm: "✓",
      seoSetup: "Basic",
      blogModule: "✗",
      cmsPanel: "✗",
      customDesign: "✗",
      paymentGateway: "✗",
      productMgmt: "✗",
      userLogin: "✗",
      analytics: "✓",
      support: "1 Month"
    }
  });

  // NEW: Promo Code Form State
  const [promoForm, setPromoForm] = useState({
    code: "",
    discount_type: "percentage",
    discount_value: "10",
    active: true,
    expiry_date: ""
  });

  // NEW: Subscription Form State
  const [subscriptionForm, setSubscriptionForm] = useState({
    customer_name: "",
    customer_email: "",
    plan_id: "basic",
    billing_cycle: "one-time",
    status: "active",
    start_date: "",
    trial_end_date: "",
    promo_code: ""
  });

  // NEW: Log Payment Form State
  const [paymentForm, setPaymentForm] = useState({
    subscription_id: "",
    amount: "",
    payment_date: "",
    status: "paid",
    payment_method: "UPI"
  });

  // NEW: Announcement Form State
  const [announcementForm, setAnnouncementForm] = useState({
    message: "",
    active: true
  });

  const router = useRouter();

  // Authentication check
  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("Unauthorized");
      })
      .then((data) => {
        if (data.ok && data.user.role === "super_admin") {
          setAdminUser(data.user);
          fetchDashboardData();
        } else {
          router.push("/login");
        }
      })
      .catch(() => {
        router.push("/login");
      });
  }, [router]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch Leads (Contact Requests)
      const resLeads = await fetch("/api/contact");
      const dataLeads = await resLeads.json();
      if (dataLeads.ok) setLeads(dataLeads.data);

      // Fetch Careers
      const resJobs = await fetch("/api/admin/careers");
      const dataJobs = await resJobs.json();
      if (Array.isArray(dataJobs)) setJobs(dataJobs);

      // Fetch candidates
      setCandidates([
        { id: "CAN-001", name: "Rahul Das", email: "rahul.das@email.com", phone: "+91 91234 56789", experience: "4 years", source: "LinkedIn", stage: "Interview", score: 88, applied: "2026-05-10", job_id: "JOB-001" },
        { id: "CAN-002", name: "Pooja Mishra", email: "pooja.mishra@email.com", phone: "+91 91234 56780", experience: "3 years", source: "Naukri", stage: "Screening", score: 75, applied: "2026-05-12", job_id: "JOB-002" },
        { id: "CAN-003", name: "Amit Jain", email: "amit.jain@email.com", phone: "+91 91234 56781", experience: "6 years", source: "Indeed", stage: "Selection", score: 92, applied: "2026-05-08", job_id: "JOB-003" }
      ]);

      // NEW: Fetch billing, pricing and announcements admin data
      const [resPlans, resPromos, resSubs, resPays, resAnns, resReport, resProjs, resNotifs, resDocs, resTickets, resClients] = await Promise.all([
        fetch("/api/admin/plans"),
        fetch("/api/admin/promo-codes"),
        fetch("/api/admin/subscriptions"),
        fetch("/api/admin/payments"),
        fetch("/api/admin/announcements"),
        fetch("/api/admin/billing-reports"),
        fetch("/api/admin/projects"),
        fetch("/api/admin/notifications"),
        fetch("/api/admin/proposals"),
        fetch("/api/tickets"),
        fetch("/api/admin/clients")
      ]);

      if (resPlans.ok) {
        const plansData = await resPlans.json();
        setPlans(plansData);
      }
      if (resPromos.ok) {
        const promosData = await resPromos.json();
        setPromoCodes(promosData);
      }
      if (resSubs.ok) {
        const subsData = await resSubs.json();
        setSubscriptions(subsData);
      }
      if (resPays.ok) {
        const paysData = await resPays.json();
        setPayments(paysData);
      }
      if (resAnns.ok) {
        const annsData = await resAnns.json();
        setAnnouncements(annsData);
      }
      if (resReport.ok) {
        const reportData = await resReport.json();
        if (reportData.ok) setBillingReport(reportData.data);
      }
      if (resProjs.ok) {
        const projsData = await resProjs.json();
        setProjects(projsData);
      }
      if (resNotifs.ok) {
        const notifsData = await resNotifs.json();
        setCrmNotifications(notifsData);
      }
      if (resDocs.ok) {
        const docsData = await resDocs.json();
        setAdminInvoices(docsData.invoices || []);
        setAdminProposals(docsData.proposals || []);
        setAdminAgreements(docsData.agreements || []);
      }
      if (resTickets && resTickets.ok) {
        const ticketsData = await resTickets.json();
        setAdminTickets(ticketsData);
      }
      if (resClients && resClients.ok) {
        const clientsData = await resClients.json();
        if (clientsData.ok) setClients(clientsData.clients);
      }
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  // Convert budget text to rough numeric values for stats
  const getBudgetVal = (budgetStr) => {
    if (!budgetStr) return 0;
    const str = budgetStr.toLowerCase();
    if (str.includes("10k")) return 10000;
    if (str.includes("20k")) return 20000;
    if (str.includes("30k")) return 30000;
    if (str.includes("50k")) return 50000;
    if (str.includes("70k")) return 70000;
    if (str.includes("90k")) return 90000;
    if (str.includes("1l - 3l")) return 200000;
    if (str.includes("3l - 5l")) return 400000;
    if (str.includes("5l - 10l")) return 750000;
    return 100000; // fallback
  };

  // Stats Calculations
  const totalQueries = leads.length;
  const openQueries = leads.filter((l) => l.status === "Pending" || l.status === "In Progress").length;
  const activeJobs = jobs.filter((j) => j.published).length;
  
  // Sales Pipeline Stats
  const pipelineVal = leads
    .filter((l) => l.stage !== "Closed Lost" && l.stage !== "Closed Won")
    .reduce((acc, curr) => acc + getBudgetVal(curr.budget), 0);

  const wonRevenue = leads
    .filter((l) => l.stage === "Closed Won")
    .reduce((acc, curr) => acc + getBudgetVal(curr.budget), 0);

  const closedWonCount = leads.filter((l) => l.stage === "Closed Won").length;
  const closedLostCount = leads.filter((l) => l.stage === "Closed Lost").length;
  const totalClosed = closedWonCount + closedLostCount;
  const winRate = totalClosed > 0 ? Math.round((closedWonCount / totalClosed) * 100) : 0;

  // Manage Leads / Queries Actions
  const handleUpdateLeadStatus = async (id, updatedFields) => {
    try {
      const res = await fetch(`/api/contact/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedFields),
      });
      if (res.ok) {
        setLeads(leads.map((l) => (String(l.id) === String(id) ? { ...l, ...updatedFields } : l)));
        if (editingLead && String(editingLead.id) === String(id)) {
          setEditingLead({ ...editingLead, ...updatedFields });
        }
      }
    } catch (err) {
      console.error("Failed to update lead status:", err);
    }
  };

  const handleDeleteLead = async (id) => {
    if (!confirm("Are you sure you want to delete this inquiry/lead?")) return;
    try {
      const res = await fetch(`/api/contact/${id}`, { method: "DELETE" });
      if (res.ok) {
        setLeads(leads.filter((l) => String(l.id) !== String(id)));
        setEditingLead(null);
      }
    } catch (err) {
      console.error("Failed to delete lead:", err);
    }
  };

  const handleAddLeadSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(leadForm),
      });
      if (res.ok) {
        setShowAddLeadModal(false);
        setLeadForm({
          name: "",
          email: "",
          phone: "",
          service: "Custom Web Development",
          budget: "1L - 3L",
          message: "",
          stage: "New",
          status: "Pending",
          notes: ""
        });
        fetchDashboardData();
      }
    } catch (err) {
      console.error("Failed to add lead:", err);
    }
  };

  // Manage Jobs Actions
  const handleAddJobSubmit = async (e) => {
    e.preventDefault();
    try {
      const reqsArray = jobForm.requirements
        ? jobForm.requirements.split("\n").map((r) => r.trim()).filter(Boolean)
        : [];
      
      const res = await fetch("/api/admin/careers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...jobForm,
          requirements: reqsArray,
        }),
      });
      if (res.ok) {
        setShowAddJobModal(false);
        setJobForm({
          title: "",
          dept: "Engineering",
          type: "Full-time",
          loc: "Hyderabad",
          open: "1",
          description: "",
          requirements: "",
          published: true
        });
        fetchDashboardData();
      }
    } catch (err) {
      console.error("Failed to post job:", err);
    }
  };

  const handleToggleJobPublish = async (id, currentPublished) => {
    try {
      const res = await fetch(`/api/admin/careers/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !currentPublished }),
      });
      if (res.ok) {
        setJobs(jobs.map((j) => (j.id === id ? { ...j, published: !currentPublished } : j)));
      }
    } catch (err) {
      console.error("Failed to toggle job publication:", err);
    }
  };

  const handleDeleteJob = async (id) => {
    if (!confirm("Are you sure you want to delete/revoke this job listing?")) return;
    try {
      const res = await fetch(`/api/admin/careers/${id}`, { method: "DELETE" });
      if (res.ok) {
        setJobs(jobs.filter((j) => j.id !== id));
      }
    } catch (err) {
      console.error("Failed to delete job:", err);
    }
  };

  // Helpers for filtering lists
  const filteredQueries = leads.filter((lead) => {
    const term = searchQuery.toLowerCase();
    const matchSearch =
      lead.name.toLowerCase().includes(term) ||
      lead.email.toLowerCase().includes(term) ||
      lead.service.toLowerCase().includes(term) ||
      (lead.message && lead.message.toLowerCase().includes(term));
    return matchSearch;
  });

  const filteredLeads = leads.filter((lead) => {
    const term = leadSearch.toLowerCase();
    const matchSearch =
      lead.name.toLowerCase().includes(term) ||
      lead.email.toLowerCase().includes(term) ||
      lead.service.toLowerCase().includes(term);
    const matchStage = crmStageFilter === "All" || lead.stage === crmStageFilter;
    return matchSearch && matchStage;
  });

  // NEW: Pricing CRM Action Handlers
  const handleTogglePlanActive = async (id, currentActive) => {
    try {
      const res = await fetch(`/api/admin/plans/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !currentActive }),
      });
      if (res.ok) {
        setPlans(plans.map(p => p.id === id ? { ...p, active: !currentActive } : p));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeletePlan = async (id) => {
    if (!confirm("Are you sure you want to delete this plan?")) return;
    try {
      const res = await fetch(`/api/admin/plans/${id}`, { method: "DELETE" });
      if (res.ok) {
        setPlans(plans.filter(p => p.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handlePlanFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingPlan) {
        const res = await fetch(`/api/admin/plans/${editingPlan.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(planForm)
        });
        if (res.ok) {
          setShowAddPlanModal(false);
          setEditingPlan(null);
          fetchDashboardData();
        }
      } else {
        const res = await fetch("/api/admin/plans", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(planForm)
        });
        if (res.ok) {
          setShowAddPlanModal(false);
          fetchDashboardData();
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Promo Codes Handlers
  const handleTogglePromoActive = async (id, currentActive) => {
    try {
      const res = await fetch(`/api/admin/promo-codes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !currentActive })
      });
      if (res.ok) {
        setPromoCodes(promoCodes.map(p => p.id === id ? { ...p, active: !currentActive } : p));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeletePromo = async (id) => {
    if (!confirm("Are you sure you want to delete this promo code?")) return;
    try {
      const res = await fetch(`/api/admin/promo-codes/${id}`, { method: "DELETE" });
      if (res.ok) {
        setPromoCodes(promoCodes.filter(p => p.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handlePromoFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingPromo) {
        const res = await fetch(`/api/admin/promo-codes/${editingPromo.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(promoForm)
        });
        if (res.ok) {
          setShowAddPromoModal(false);
          setEditingPromo(null);
          fetchDashboardData();
        }
      } else {
        const res = await fetch("/api/admin/promo-codes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(promoForm)
        });
        if (res.ok) {
          setShowAddPromoModal(false);
          fetchDashboardData();
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Subscriptions Handlers
  const handleUpgradeDowngradePlan = async (id, newPlanId) => {
    try {
      const res = await fetch(`/api/admin/subscriptions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan_id: newPlanId })
      });
      if (res.ok) {
        setSubscriptions(subscriptions.map(s => s.id === id ? { ...s, plan_id: newPlanId } : s));
        const resReport = await fetch("/api/admin/billing-reports");
        if (resReport.ok) {
          const reportData = await resReport.json();
          if (reportData.ok) setBillingReport(reportData.data);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleSubStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "active" ? "cancelled" : "active";
    try {
      const res = await fetch(`/api/admin/subscriptions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setSubscriptions(subscriptions.map(s => s.id === id ? { ...s, status: newStatus } : s));
        const resReport = await fetch("/api/admin/billing-reports");
        if (resReport.ok) {
          const reportData = await resReport.json();
          if (reportData.ok) setBillingReport(reportData.data);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteSubscription = async (id) => {
    if (!confirm("Are you sure you want to delete this subscription?")) return;
    try {
      const res = await fetch(`/api/admin/subscriptions/${id}`, { method: "DELETE" });
      if (res.ok) {
        setSubscriptions(subscriptions.filter(s => s.id !== id));
        const resReport = await fetch("/api/admin/billing-reports");
        if (resReport.ok) {
          const reportData = await resReport.json();
          if (reportData.ok) setBillingReport(reportData.data);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubscriptionFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSubscription) {
        const res = await fetch(`/api/admin/subscriptions/${editingSubscription.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(subscriptionForm)
        });
        if (res.ok) {
          setShowAddSubscriptionModal(false);
          setEditingSubscription(null);
          fetchDashboardData();
        }
      } else {
        const res = await fetch("/api/admin/subscriptions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(subscriptionForm)
        });
        if (res.ok) {
          setShowAddSubscriptionModal(false);
          fetchDashboardData();
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Payments Handlers
  const handlePaymentFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(paymentForm)
      });
      if (res.ok) {
        setShowAddPaymentModal(false);
        fetchDashboardData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Announcements Handlers
  const handleToggleAnnouncementActive = async (id, currentActive) => {
    try {
      const res = await fetch(`/api/admin/announcements/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !currentActive })
      });
      if (res.ok) {
        setAnnouncements(announcements.map(a => a.id === id ? { ...a, active: !currentActive } : a));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteAnnouncement = async (id) => {
    if (!confirm("Are you sure you want to delete this announcement?")) return;
    try {
      const res = await fetch(`/api/admin/announcements/${id}`, { method: "DELETE" });
      if (res.ok) {
        setAnnouncements(announcements.filter(a => a.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAnnouncementFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingAnnouncement) {
        const res = await fetch(`/api/admin/announcements/${editingAnnouncement.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(announcementForm)
        });
        if (res.ok) {
          setShowAddAnnouncementModal(false);
          setEditingAnnouncement(null);
          fetchDashboardData();
        }
      } else {
        const res = await fetch("/api/admin/announcements", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(announcementForm)
        });
        if (res.ok) {
          setShowAddAnnouncementModal(false);
          fetchDashboardData();
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleProjectUpdate = async (id, fields) => {
    try {
      const res = await fetch(`/api/admin/projects/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fields)
      });
      if (res.ok) {
        setProjects(projects.map(p => p.id === id ? { ...p, ...fields } : p));
      }
    } catch (err) {
      console.error("Failed to update project:", err);
    }
  };

  const handleUpdateTicket = async (id, updatedFields) => {
    try {
      const res = await fetch(`/api/tickets/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedFields)
      });
      if (res.ok) {
        setAdminTickets(adminTickets.map(t => t.id === id ? { ...t, ...updatedFields } : t));
        setEditingTicket(null);
        fetchDashboardData();
      }
    } catch (err) {
      console.error("Failed to update ticket:", err);
    }
  };

  const handleDeleteTicket = async (id) => {
    if (!confirm("Are you sure you want to permanently delete this support ticket?")) return;
    try {
      const res = await fetch(`/api/tickets/${id}`, { method: "DELETE" });
      if (res.ok) {
        setAdminTickets(adminTickets.filter(t => t.id !== id));
        if (editingTicket?.id === id) setEditingTicket(null);
      } else {
        alert("Failed to delete ticket. Please try again.");
      }
    } catch (err) {
      console.error("Failed to delete ticket:", err);
    }
  };

  // ─── Clients CRM Action Handlers ────────────────────────────────────
  const handleAddClient = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(clientForm)
      });
      if (res.ok) {
        setShowAddClientModal(false);
        setClientForm({ name: "", company_name: "", email: "", phone: "", address: "", gst_number: "", tax_details: "", notes: "", status: "Lead" });
        fetchDashboardData();
      } else {
        const data = await res.json();
        alert("Failed to add client: " + (data.error || "Unknown error"));
      }
    } catch (err) {
      console.error("Failed to add client:", err);
    }
  };

  const handleUpdateClient = async (id, fields) => {
    try {
      const res = await fetch(`/api/admin/clients/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fields)
      });
      if (res.ok) {
        setClients(clients.map(c => c.id === id ? { ...c, ...fields } : c));
        if (selectedClient && selectedClient.id === id) {
          setSelectedClient({ ...selectedClient, ...fields });
        }
      } else {
        alert("Failed to update client.");
      }
    } catch (err) {
      console.error("Failed to update client:", err);
    }
  };

  const handleDeleteClient = async (id) => {
    if (!confirm("Are you sure you want to permanently delete this client?")) return;
    try {
      const res = await fetch(`/api/admin/clients/${id}`, { method: "DELETE" });
      if (res.ok) {
        setClients(clients.filter(c => c.id !== id));
        if (selectedClient && selectedClient.id === id) {
          setSelectedClient(null);
          setShowClientModal(false);
        }
      } else {
        alert("Failed to delete client.");
      }
    } catch (err) {
      console.error("Failed to delete client:", err);
    }
  };

  const handleSuspendClient = async (id, currentStatus) => {
    const isSuspended = currentStatus === "Suspended";
    const newStatus = isSuspended ? "Lead" : "Suspended";
    await handleUpdateClient(id, { status: newStatus });
  };

  const handleLoadClientComms = async (email) => {
    try {
      const res = await fetch(`/api/admin/clients/all/communications?email=${encodeURIComponent(email)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.ok) setClientComms(data.communications || []);
      }
    } catch (err) {
      console.error("Failed to load communications:", err);
    }
  };

  const handleSendComm = async (clientEmail) => {
    try {
      const res = await fetch("/api/admin/clients/all/communications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client_email: clientEmail,
          type: sendCommForm.type,
          subject: sendCommForm.subject,
          message: sendCommForm.message
        })
      });
      if (res.ok) {
        setSendCommForm({ ...sendCommForm, subject: "", message: "" });
        handleLoadClientComms(clientEmail);
      } else {
        alert("Failed to log communication.");
      }
    } catch (err) {
      console.error("Failed to send/log communication:", err);
    }
  };

  const handleExportCSV = () => {
    const headers = ["ID", "Name", "Company Name", "Email", "Phone", "Status", "Plan", "Total Paid", "Created At"];
    const rows = clients.map(c => [
      c.id,
      c.name,
      c.company_name || "",
      c.email,
      c.phone || "",
      c.status,
      c.plan_name || "None",
      c.totalPaid || 0,
      c.created_at || ""
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.map(val => `"${String(val).replace(/"/g, '""')}"`).join(","))].join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `clients_export_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleClientQuickAction = (type, client) => {
    setSelectedClient(client);
    if (type === "email") setClientProfileTab("communications");
    else if (type === "invoice") setClientProfileTab("payments");
    else if (type === "proposal") setClientProfileTab("documents");
    else if (type === "project") setClientProfileTab("projects");
    else if (type === "payment") setClientProfileTab("payments");
    else if (type === "ticket") setClientProfileTab("tickets");
    else setClientProfileTab("overview");
    setShowClientModal(true);
  };

  useEffect(() => {
    if (selectedClient) {
      handleLoadClientComms(selectedClient.email);
    } else {
      setClientComms([]);
    }
  }, [selectedClient]);

  useEffect(() => {
    if (showCustomerModal && selectedCustomerEmail) {
      const foundClient = clients.find(c => c.email.toLowerCase() === selectedCustomerEmail.toLowerCase());
      if (foundClient) {
        setSelectedClient(foundClient);
        setClientProfileTab("overview");
        setShowClientModal(true);
        setShowCustomerModal(false);
        setSelectedCustomerEmail(null);
      }
    }
  }, [showCustomerModal, selectedCustomerEmail, clients]);

  const handleClearNotifications = async () => {
    try {
      const res = await fetch("/api/admin/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" }
      });
      if (res.ok) {
        setCrmNotifications(crmNotifications.map(n => ({ ...n, is_read: true })));
      }
    } catch (err) {
      console.error("Failed to clear notifications:", err);
    }
  };

  if (loading && !adminUser) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--surface)",
        color: "var(--primary)"
      }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
          <div style={{
            width: "36px",
            height: "36px",
            border: "3px solid var(--line)",
            borderTopColor: "var(--accent)",
            borderRadius: "50%",
            animation: "dashboardSpin 0.8s linear infinite"
          }} />
          <p style={{ fontWeight: 600, fontSize: "0.95rem" }}>Verifying Session...</p>
        </div>
        <style dangerouslySetInnerHTML={{__html: `@keyframes dashboardSpin { to { transform: rotate(360deg); } }`}} />
      </div>
    );
  }

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "260px 1fr",
      minHeight: "100vh",
      background: "#080c14",
      color: "#f8fafc",
      fontFamily: "system-ui, -apple-system, sans-serif"
    }}>
      {/* 1. Sidebar */}
      <aside style={{
        background: "#0f172a",
        borderRight: "1px solid rgba(255, 255, 255, 0.05)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "24px 16px"
      }}>
        <div>
          {/* Logo / Brand */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "8px 12px",
            marginBottom: "36px",
            borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
            paddingBottom: "20px"
          }}>
            <div style={{
              width: "36px",
              height: "36px",
              borderRadius: "8px",
              background: "linear-gradient(135deg, #0f62fe, #00d4ff)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 800,
              fontSize: "1.2rem",
              color: "#fff"
            }}>H</div>
            <div>
              <h2 style={{ fontSize: "1.05rem", fontWeight: 700, margin: 0, letterSpacing: "0.5px" }}>Nexhydigital</h2>
              <span style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: 600 }}>CRM Admin Suite</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <button
              onClick={() => setActiveTab("overview")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                width: "100%",
                padding: "12px 16px",
                borderRadius: "10px",
                border: "none",
                background: activeTab === "overview" ? "rgba(15, 98, 254, 0.15)" : "transparent",
                color: activeTab === "overview" ? "#38bdf8" : "#94a3b8",
                fontWeight: 600,
                fontSize: "0.9rem",
                cursor: "pointer",
                textAlign: "left",
                transition: "all 0.2s ease"
              }}
            >
              <LayoutDashboard size={18} /> Overview
            </button>

            <button
              onClick={() => setActiveTab("queries")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                width: "100%",
                padding: "12px 16px",
                borderRadius: "10px",
                border: "none",
                background: activeTab === "queries" ? "rgba(15, 98, 254, 0.15)" : "transparent",
                color: activeTab === "queries" ? "#38bdf8" : "#94a3b8",
                fontWeight: 600,
                fontSize: "0.9rem",
                cursor: "pointer",
                textAlign: "left",
                transition: "all 0.2s ease"
              }}
            >
              <MessageSquare size={18} /> Queries Raised {openQueries > 0 && <span style={{ marginLeft: "auto", background: "#f43f5e", color: "#fff", fontSize: "0.7rem", fontWeight: 700, padding: "2px 8px", borderRadius: "10px" }}>{openQueries}</span>}
            </button>

            <button
              onClick={() => setActiveTab("crm")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                width: "100%",
                padding: "12px 16px",
                borderRadius: "10px",
                border: "none",
                background: activeTab === "crm" ? "rgba(15, 98, 254, 0.15)" : "transparent",
                color: activeTab === "crm" ? "#38bdf8" : "#94a3b8",
                fontWeight: 600,
                fontSize: "0.9rem",
                cursor: "pointer",
                textAlign: "left",
                transition: "all 0.2s ease"
              }}
            >
              <Users size={18} /> CRM Leads
            </button>

            <button
              onClick={() => setActiveTab("clients")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                width: "100%",
                padding: "12px 16px",
                borderRadius: "10px",
                border: "none",
                background: activeTab === "clients" ? "rgba(15, 98, 254, 0.15)" : "transparent",
                color: activeTab === "clients" ? "#38bdf8" : "#94a3b8",
                fontWeight: 600,
                fontSize: "0.9rem",
                cursor: "pointer",
                textAlign: "left",
                transition: "all 0.2s ease"
              }}
            >
              <UserCheck size={18} /> Clients CRM
            </button>

            <button
              onClick={() => setActiveTab("careers")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                width: "100%",
                padding: "12px 16px",
                borderRadius: "10px",
                border: "none",
                background: activeTab === "careers" ? "rgba(15, 98, 254, 0.15)" : "transparent",
                color: activeTab === "careers" ? "#38bdf8" : "#94a3b8",
                fontWeight: 600,
                fontSize: "0.9rem",
                cursor: "pointer",
                textAlign: "left",
                transition: "all 0.2s ease"
              }}
            >
              <Briefcase size={18} /> Job Postings
            </button>

            <button
              onClick={() => setActiveTab("billing")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                width: "100%",
                padding: "12px 16px",
                borderRadius: "10px",
                border: "none",
                background: activeTab === "billing" ? "rgba(15, 98, 254, 0.15)" : "transparent",
                color: activeTab === "billing" ? "#38bdf8" : "#94a3b8",
                fontWeight: 600,
                fontSize: "0.9rem",
                cursor: "pointer",
                textAlign: "left",
                transition: "all 0.2s ease"
              }}
            >
              <DollarSign size={18} /> Pricing & Subs
            </button>

            <button
              onClick={() => setActiveTab("projects")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                width: "100%",
                padding: "12px 16px",
                borderRadius: "10px",
                border: "none",
                background: activeTab === "projects" ? "rgba(15, 98, 254, 0.15)" : "transparent",
                color: activeTab === "projects" ? "#38bdf8" : "#94a3b8",
                fontWeight: 600,
                fontSize: "0.9rem",
                cursor: "pointer",
                textAlign: "left",
                transition: "all 0.2s ease"
              }}
            >
              <TrendingUp size={18} /> Projects Tracking
            </button>

            <button
              onClick={() => setActiveTab("announcements")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                width: "100%",
                padding: "12px 16px",
                borderRadius: "10px",
                border: "none",
                background: activeTab === "announcements" ? "rgba(15, 98, 254, 0.15)" : "transparent",
                color: activeTab === "announcements" ? "#38bdf8" : "#94a3b8",
                fontWeight: 600,
                fontSize: "0.9rem",
                cursor: "pointer",
                textAlign: "left",
                transition: "all 0.2s ease"
              }}
            >
              <Megaphone size={18} /> Announcements
            </button>
          </nav>
        </div>

        {/* Footer Admin Session Profile */}
        <div>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "12px",
            background: "rgba(255, 255, 255, 0.03)",
            borderRadius: "12px",
            marginBottom: "12px"
          }}>
            <div style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              background: "#0f62fe",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "0.8rem",
              fontWeight: 700
            }}>SA</div>
            <div style={{ overflow: "hidden" }}>
              <p style={{ margin: 0, fontSize: "0.85rem", fontWeight: 600, color: "#fff" }}>Super Admin</p>
              <p style={{ margin: 0, fontSize: "0.75rem", color: "#64748b", textOverflow: "ellipsis", overflow: "hidden" }}>admin@hygenx.in</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              width: "100%",
              padding: "10px 12px",
              background: "transparent",
              border: "1px solid rgba(239, 68, 68, 0.2)",
              color: "#f87171",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "0.85rem",
              fontWeight: 600,
              justifyContent: "center",
              transition: "all 0.2s"
            }}
            onMouseEnter={(e) => e.target.style.background = "rgba(239, 68, 68, 0.1)"}
            onMouseLeave={(e) => e.target.style.background = "transparent"}
          >
            <LogOut size={14} /> Log Out
          </button>
        </div>
      </aside>

      {/* 2. Main Page Content */}
      <main style={{
        padding: "40px",
        overflowY: "auto",
        maxHeight: "100vh",
        boxSizing: "border-box"
      }}>
        {/* TAB 1: OVERVIEW */}
        {activeTab === "overview" && (
          <div>
            <div style={{ marginBottom: "32px" }}>
              <p style={{ margin: 0, fontSize: "0.9rem", color: "#38bdf8", fontWeight: 600 }}>DASHBOARD OVERVIEW</p>
              <h1 style={{ margin: "4px 0 0 0", fontSize: "2rem", fontWeight: 700 }}>Startup IT Solutions Admin Control</h1>
            </div>

            {/* Metric Cards */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "24px",
              marginBottom: "40px"
            }}>
              {/* Stat 1 */}
              <div style={{ background: "#0f172a", border: "1px solid rgba(255, 255, 255, 0.05)", padding: "24px", borderRadius: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", color: "#94a3b8", marginBottom: "12px" }}>
                  <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>TOTAL QUERIES</span>
                  <MessageSquare size={18} style={{ color: "#38bdf8" }} />
                </div>
                <h2 style={{ margin: 0, fontSize: "1.8rem", fontWeight: 700 }}>{totalQueries}</h2>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "12px", fontSize: "0.8rem", color: "#22c55e" }}>
                  <TrendingUp size={14} />
                  <span>{openQueries} active queries pending resolution</span>
                </div>
              </div>

              {/* Stat 2 */}
              <div style={{ background: "#0f172a", border: "1px solid rgba(255, 255, 255, 0.05)", padding: "24px", borderRadius: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", color: "#94a3b8", marginBottom: "12px" }}>
                  <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>CRM PIPELINE VALUE</span>
                  <DollarSign size={18} style={{ color: "#22c55e" }} />
                </div>
                <h2 style={{ margin: 0, fontSize: "1.8rem", fontWeight: 700 }}>₹{(pipelineVal / 100000).toFixed(1)} Lakhs</h2>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "12px", fontSize: "0.8rem", color: "#a4b5cf" }}>
                  <span>From active prospects in sales funnel</span>
                </div>
              </div>

              {/* Stat 3 */}
              <div style={{ background: "#0f172a", border: "1px solid rgba(255, 255, 255, 0.05)", padding: "24px", borderRadius: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", color: "#94a3b8", marginBottom: "12px" }}>
                  <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>REVENUE CLOSED</span>
                  <CheckCircle size={18} style={{ color: "#10b981" }} />
                </div>
                <h2 style={{ margin: 0, fontSize: "1.8rem", fontWeight: 700 }}>₹{(wonRevenue / 100000).toFixed(1)} Lakhs</h2>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "12px", fontSize: "0.8rem", color: "#10b981" }}>
                  <span>{closedWonCount} deals successfully signed</span>
                </div>
              </div>

              {/* Stat 4 */}
              <div style={{ background: "#0f172a", border: "1px solid rgba(255, 255, 255, 0.05)", padding: "24px", borderRadius: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", color: "#94a3b8", marginBottom: "12px" }}>
                  <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>WIN RATE & JOBS</span>
                  <Briefcase size={18} style={{ color: "#eab308" }} />
                </div>
                <h2 style={{ margin: 0, fontSize: "1.8rem", fontWeight: 700 }}>{winRate}%</h2>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "12px", fontSize: "0.8rem", color: "#eab308" }}>
                  <span>{activeJobs} published careers available</span>
                </div>
              </div>
            </div>

            {/* Quick Actions & Recent Queries */}
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "32px" }}>
              {/* Recent Queries Raised */}
              <div style={{ background: "#0f172a", border: "1px solid rgba(255, 255, 255, 0.05)", padding: "28px", borderRadius: "18px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                  <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700 }}>Enquiries Raised (Recent Leads)</h3>
                  <button onClick={() => setActiveTab("queries")} style={{ border: "none", background: "none", color: "#38bdf8", cursor: "pointer", fontSize: "0.85rem", fontWeight: 600 }}>View All</button>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {leads.slice(0, 3).map((lead) => (
                    <div
                      key={lead.id}
                      onClick={() => {
                        setEditingLead(lead);
                        setActiveTab("queries");
                      }}
                      style={{
                        padding: "16px",
                        background: "rgba(255, 255, 255, 0.02)",
                        border: "1px solid rgba(255, 255, 255, 0.04)",
                        borderRadius: "12px",
                        cursor: "pointer",
                        display: "grid",
                        gridTemplateColumns: "1.5fr 1fr 1fr auto",
                        alignItems: "center",
                        gap: "16px",
                        transition: "all 0.2s"
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255, 255, 255, 0.04)"}
                      onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255, 255, 255, 0.02)"}
                    >
                      <div>
                        <p style={{ margin: 0, fontSize: "0.9rem", fontWeight: 700, color: "#fff" }}>{lead.name}</p>
                        <span style={{ fontSize: "0.75rem", color: "#64748b" }}>{lead.email}</span>
                      </div>
                      <div>
                        <span style={{ fontSize: "0.8rem", color: "#38bdf8", fontWeight: 600 }}>{lead.service}</span>
                      </div>
                      <div>
                        <span style={{
                          padding: "4px 10px",
                          borderRadius: "6px",
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          background: lead.status === "Pending" ? "rgba(239, 68, 68, 0.15)" : lead.status === "In Progress" ? "rgba(234, 179, 8, 0.15)" : "rgba(34, 197, 94, 0.15)",
                          color: lead.status === "Pending" ? "#f87171" : lead.status === "In Progress" ? "#facc15" : "#4ade80"
                        }}>{lead.status}</span>
                      </div>
                      <div>
                        <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "#fff" }}>{lead.budget}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column with stacked Careers and Alerts */}
              <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
                {/* Active Recruitment Status */}
                <div style={{ background: "#0f172a", border: "1px solid rgba(255, 255, 255, 0.05)", padding: "28px", borderRadius: "18px" }}>
                  <h3 style={{ margin: "0 0 20px 0", fontSize: "1.1rem", fontWeight: 700 }}>Careers Panel</h3>
                  
                  <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(255, 255, 255, 0.05)", paddingBottom: "12px" }}>
                      <span style={{ fontSize: "0.85rem", color: "#94a3b8" }}>Published Listings</span>
                      <span style={{ fontSize: "0.9rem", fontWeight: 700, color: "#fff" }}>{activeJobs}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(255, 255, 255, 0.05)", paddingBottom: "12px" }}>
                      <span style={{ fontSize: "0.85rem", color: "#94a3b8" }}>Total Job Openings</span>
                      <span style={{ fontSize: "0.9rem", fontWeight: 700, color: "#fff" }}>
                        {jobs.reduce((acc, curr) => acc + parseInt(curr.open || "0"), 0)}
                      </span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "4px" }}>
                      <span style={{ fontSize: "0.85rem", color: "#94a3b8" }}>Applicant Candidates</span>
                      <span style={{ fontSize: "0.9rem", fontWeight: 700, color: "#fff" }}>{candidates.length}</span>
                    </div>

                    <button
                      onClick={() => setActiveTab("careers")}
                      style={{
                        marginTop: "12px",
                        background: "#0f62fe",
                        color: "#fff",
                        border: "none",
                        padding: "12px",
                        borderRadius: "8px",
                        fontWeight: 600,
                        cursor: "pointer",
                        fontSize: "0.85rem",
                        transition: "background 0.2s"
                      }}
                      onMouseEnter={(e) => e.target.style.background = "#0052cc"}
                      onMouseLeave={(e) => e.target.style.background = "#0f62fe"}
                    >
                      Manage Job Listings
                    </button>
                  </div>
                </div>

                {/* CRM Notifications Feed Panel */}
                <div style={{ background: "#0f172a", border: "1px solid rgba(255, 255, 255, 0.05)", padding: "28px", borderRadius: "18px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                    <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700 }}>CRM Alerts Feed</h3>
                    {crmNotifications.some(n => !n.is_read) && (
                      <button
                        onClick={handleClearNotifications}
                        style={{ border: "none", background: "none", color: "#38bdf8", cursor: "pointer", fontSize: "0.78rem", fontWeight: 600 }}
                      >
                        Clear All
                      </button>
                    )}
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxHeight: "280px", overflowY: "auto" }}>
                    {crmNotifications.length === 0 ? (
                      <p style={{ color: "#64748b", fontSize: "0.82rem", margin: 0 }}>No alerts logged yet.</p>
                    ) : (
                      crmNotifications.slice(0, 5).map(n => (
                        <div
                          key={n.id}
                          style={{
                            padding: "10px 12px",
                            background: n.is_read ? "rgba(255,255,255,0.01)" : "rgba(15, 98, 254, 0.05)",
                            border: `1px solid ${n.is_read ? "rgba(255,255,255,0.03)" : "rgba(15, 98, 254, 0.2)"}`,
                            borderRadius: "8px",
                            fontSize: "0.78rem"
                          }}
                        >
                          <p style={{ margin: "0 0 6px 0", color: "#cbd5e1", lineHeight: 1.4 }}>{n.message}</p>
                          <span style={{ fontSize: "0.68rem", color: "#64748b" }}>
                            {new Date(n.created_at || Date.now()).toLocaleString("en-IN")}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: QUERIES RAISED PANEL */}
        {activeTab === "queries" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
              <div>
                <p style={{ margin: 0, fontSize: "0.9rem", color: "#38bdf8", fontWeight: 600 }}>CLIENT & PROJECT QUERIES</p>
                <h1 style={{ margin: "4px 0 0 0", fontSize: "2rem", fontWeight: 700 }}>Inquiries Raised ({filteredQueries.length})</h1>
              </div>
              <button
                onClick={() => setShowAddLeadModal(true)}
                style={{
                  background: "#0f62fe",
                  color: "#fff",
                  border: "none",
                  padding: "12px 20px",
                  borderRadius: "10px",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px"
                }}
              >
                <Plus size={16} /> Add Custom Inquiry
              </button>
            </div>

            {/* Search Bar */}
            <div style={{
              display: "flex",
              gap: "16px",
              background: "#0f172a",
              padding: "16px",
              borderRadius: "12px",
              border: "1px solid rgba(255, 255, 255, 0.05)",
              marginBottom: "28px"
            }}>
              <div style={{ position: "relative", flex: 1 }}>
                <Search size={18} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#64748b" }} />
                <input
                  type="text"
                  placeholder="Search by client name, email, service required..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 12px 10px 40px",
                    borderRadius: "8px",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    background: "rgba(255,255,255,0.02)",
                    color: "#fff",
                    outline: "none",
                    boxSizing: "border-box"
                  }}
                />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "32px", alignItems: "start" }}>
              {/* Queries List */}
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {filteredQueries.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "48px", background: "#0f172a", borderRadius: "16px" }}>
                    <p style={{ color: "#64748b" }}>No queries found matching search</p>
                  </div>
                ) : (
                  filteredQueries.map((lead) => (
                    <div
                      key={lead.id}
                      onClick={() => setEditingLead(lead)}
                      style={{
                        padding: "20px",
                        background: editingLead?.id === lead.id ? "rgba(15, 98, 254, 0.1)" : "#0f172a",
                        border: `1px solid ${editingLead?.id === lead.id ? "#0f62fe" : "rgba(255, 255, 255, 0.05)"}`,
                        borderRadius: "14px",
                        cursor: "pointer",
                        transition: "all 0.2s"
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                        <div>
                          <h4 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 700, color: "#fff" }}>{lead.name}</h4>
                          <span style={{ fontSize: "0.75rem", color: "#64748b" }}>Raised via {lead.source || "Website Form"}</span>
                        </div>
                        <span style={{
                          padding: "4px 10px",
                          borderRadius: "6px",
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          background: lead.status === "Pending" ? "rgba(239, 68, 68, 0.15)" : lead.status === "In Progress" ? "rgba(234, 179, 8, 0.15)" : "rgba(34, 197, 94, 0.15)",
                          color: lead.status === "Pending" ? "#f87171" : lead.status === "In Progress" ? "#facc15" : "#4ade80"
                        }}>{lead.status}</span>
                      </div>

                      <p style={{ margin: "0 0 16px 0", fontSize: "0.88rem", color: "#94a3b8", lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                        {lead.message || "No project description provided."}
                      </p>

                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(255, 255, 255, 0.04)", paddingTop: "12px", fontSize: "0.8rem", color: "#64748b" }}>
                        <span>Service: <strong style={{ color: "#cbd5e1" }}>{lead.service}</strong></span>
                        <span>Budget: <strong style={{ color: "#cbd5e1" }}>{lead.budget}</strong></span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Lead Details Sidebar */}
              <div style={{
                background: "#0f172a",
                border: "1px solid rgba(255, 255, 255, 0.05)",
                borderRadius: "16px",
                padding: "28px",
                position: "sticky",
                top: "20px"
              }}>
                {editingLead ? (
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "24px" }}>
                      <div>
                        <h3 style={{ margin: 0, fontSize: "1.25rem", color: "#fff" }}>Query Details</h3>
                        <span style={{ fontSize: "0.75rem", color: "#64748b" }}>ID: {editingLead.id}</span>
                      </div>
                      <button
                        onClick={() => handleDeleteLead(editingLead.id)}
                        style={{ background: "transparent", border: "none", color: "#ef4444", cursor: "pointer", display: "flex", alignItems: "center" }}
                        title="Delete query"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    {/* Client Info Grid */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "28px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <User size={16} style={{ color: "#38bdf8" }} />
                        <div>
                          <p style={{ margin: 0, fontSize: "0.75rem", color: "#64748b" }}>CLIENT NAME</p>
                          <p style={{ margin: 0, fontSize: "0.9rem", fontWeight: 600 }}>{editingLead.name}</p>
                        </div>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <Mail size={16} style={{ color: "#38bdf8" }} />
                        <div>
                          <p style={{ margin: 0, fontSize: "0.75rem", color: "#64748b" }}>EMAIL ADDRESS</p>
                          <a href={`mailto:${editingLead.email}`} style={{ margin: 0, fontSize: "0.9rem", fontWeight: 600, color: "#38bdf8", textDecoration: "none" }}>{editingLead.email}</a>
                        </div>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <Phone size={16} style={{ color: "#38bdf8" }} />
                        <div>
                          <p style={{ margin: 0, fontSize: "0.75rem", color: "#64748b" }}>PHONE NUMBER</p>
                          <p style={{ margin: 0, fontSize: "0.9rem", fontWeight: 600 }}>{editingLead.phone || "Not provided"}</p>
                        </div>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <Clock size={16} style={{ color: "#38bdf8" }} />
                        <div>
                          <p style={{ margin: 0, fontSize: "0.75rem", color: "#64748b" }}>RECEIVED ON</p>
                          <p style={{ margin: 0, fontSize: "0.9rem", fontWeight: 600 }}>{new Date(editingLead.created_at).toLocaleString("en-IN")}</p>
                        </div>
                      </div>
                    </div>

                    {/* Query Message */}
                    <div style={{ marginBottom: "28px" }}>
                      <p style={{ margin: "0 0 8px 0", fontSize: "0.75rem", color: "#64748b", fontWeight: 700 }}>PROJECT ENQUIRY MESSAGE</p>
                      <div style={{ background: "rgba(255, 255, 255, 0.02)", border: "1px solid rgba(255, 255, 255, 0.04)", borderRadius: "10px", padding: "16px", fontSize: "0.9rem", color: "#cbd5e1", lineHeight: 1.6 }}>
                        {editingLead.message || "No description provided."}
                      </div>
                    </div>

                    {/* CRM Stage & Query Status controls */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "28px" }}>
                      <div>
                        <label style={{ display: "block", fontSize: "0.75rem", color: "#64748b", fontWeight: 700, marginBottom: "8px" }}>QUERY STATUS</label>
                        <select
                          value={editingLead.status}
                          onChange={(e) => handleUpdateLeadStatus(editingLead.id, { status: e.target.value })}
                          style={{ width: "100%", padding: "10px", borderRadius: "8px", background: "#0f172a", border: "1px solid rgba(255,255,255,0.08)", color: "#fff", cursor: "pointer" }}
                        >
                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Resolved">Resolved</option>
                        </select>
                      </div>

                      <div>
                        <label style={{ display: "block", fontSize: "0.75rem", color: "#64748b", fontWeight: 700, marginBottom: "8px" }}>CRM SALES STAGE</label>
                        <select
                          value={editingLead.stage}
                          onChange={(e) => handleUpdateLeadStatus(editingLead.id, { stage: e.target.value })}
                          style={{ width: "100%", padding: "10px", borderRadius: "8px", background: "#0f172a", border: "1px solid rgba(255,255,255,0.08)", color: "#fff", cursor: "pointer" }}
                        >
                          <option value="New">New</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Proposal Sent">Proposal Sent</option>
                          <option value="Closed Won">Closed Won</option>
                          <option value="Closed Lost">Closed Lost</option>
                        </select>
                      </div>
                    </div>

                    {/* Interactive Admin Notes */}
                    <div>
                      <label style={{ display: "block", fontSize: "0.75rem", color: "#64748b", fontWeight: 700, marginBottom: "8px" }}>ADMIN INTERACTION NOTES</label>
                      <textarea
                        rows={4}
                        placeholder="Add client replies, quotation details, negotiation comments..."
                        value={editingLead.notes || ""}
                        onChange={(e) => handleUpdateLeadStatus(editingLead.id, { notes: e.target.value })}
                        style={{
                          width: "100%",
                          padding: "12px",
                          borderRadius: "8px",
                          background: "#0f172a",
                          border: "1px solid rgba(255,255,255,0.08)",
                          color: "#fff",
                          fontSize: "0.88rem",
                          fontFamily: "inherit",
                          resize: "vertical",
                          boxSizing: "border-box"
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <div style={{ textAlign: "center", color: "#64748b", padding: "40px 0" }}>
                    <HelpCircle size={40} style={{ margin: "0 auto 16px auto", opacity: 0.5 }} />
                    <p style={{ margin: 0, fontWeight: 600 }}>Select an enquiry raised by users to view full CRM details, update status, and manage notes.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: CRM PANEL */}
        {activeTab === "crm" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
              <div>
                <p style={{ margin: 0, fontSize: "0.9rem", color: "#38bdf8", fontWeight: 600 }}>SALES CRM PIPELINE</p>
                <h1 style={{ margin: "4px 0 0 0", fontSize: "2rem", fontWeight: 700 }}>Customer Relationship Management</h1>
              </div>
              <button
                onClick={() => setShowAddLeadModal(true)}
                style={{
                  background: "#0f62fe",
                  color: "#fff",
                  border: "none",
                  padding: "12px 20px",
                  borderRadius: "10px",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px"
                }}
              >
                <Plus size={16} /> Add Offline Lead
              </button>
            </div>

            {/* Pipeline Stage Conversions visualizer */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(5, 1fr)",
              gap: "16px",
              background: "#0f172a",
              padding: "24px",
              borderRadius: "16px",
              border: "1px solid rgba(255, 255, 255, 0.05)",
              marginBottom: "36px"
            }}>
              {["New", "Contacted", "Proposal Sent", "Closed Won", "Closed Lost"].map((stage) => {
                const stageLeads = leads.filter((l) => l.stage === stage);
                const stageValue = stageLeads.reduce((acc, curr) => acc + getBudgetVal(curr.budget), 0);
                return (
                  <div key={stage} style={{ borderRight: stage !== "Closed Lost" ? "1px solid rgba(255, 255, 255, 0.05)" : "none", paddingRight: "10px" }}>
                    <p style={{ margin: 0, fontSize: "0.8rem", color: "#64748b", fontWeight: 700, textTransform: "uppercase" }}>{stage}</p>
                    <h3 style={{ margin: "6px 0 2px 0", fontSize: "1.3rem", fontWeight: 700 }}>{stageLeads.length} Lead{stageLeads.length !== 1 ? "s" : ""}</h3>
                    <span style={{ fontSize: "0.8rem", color: "#22c55e", fontWeight: 600 }}>₹{(stageValue / 100000).toFixed(1)} Lakhs</span>
                  </div>
                );
              })}
            </div>

            {/* Interactive Stage board grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: "32px", alignItems: "start" }}>
              {/* Filter bar */}
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "16px",
                  background: "#0f172a",
                  padding: "16px",
                  borderRadius: "12px",
                  border: "1px solid rgba(255,255,255,0.05)"
                }}>
                  <div style={{ position: "relative", flex: 1 }}>
                    <Search size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#64748b" }} />
                    <input
                      type="text"
                      placeholder="Search leads by client name, email..."
                      value={leadSearch}
                      onChange={(e) => setLeadSearch(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "8px 12px 8px 36px",
                        borderRadius: "6px",
                        border: "1px solid rgba(255, 255, 255, 0.08)",
                        background: "rgba(255,255,255,0.02)",
                        color: "#fff",
                        outline: "none"
                      }}
                    />
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <Filter size={16} style={{ color: "#64748b" }} />
                    <select
                      value={crmStageFilter}
                      onChange={(e) => setCrmStageFilter(e.target.value)}
                      style={{ padding: "8px 12px", borderRadius: "6px", background: "#0f172a", border: "1px solid rgba(255,255,255,0.08)", color: "#fff", cursor: "pointer" }}
                    >
                      <option value="All">All Stages</option>
                      <option value="New">New</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Proposal Sent">Proposal Sent</option>
                      <option value="Closed Won">Closed Won</option>
                      <option value="Closed Lost">Closed Lost</option>
                    </select>
                  </div>
                </div>

                {/* Leads pipeline table */}
                <div style={{ background: "#0f172a", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.05)", overflow: "hidden" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                    <thead>
                      <tr style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.05)", background: "rgba(255,255,255,0.02)" }}>
                        <th style={{ padding: "16px 20px", fontSize: "0.8rem", color: "#64748b", fontWeight: 700 }}>LEAD NAME</th>
                        <th style={{ padding: "16px 20px", fontSize: "0.8rem", color: "#64748b", fontWeight: 700 }}>SERVICE INTEREST</th>
                        <th style={{ padding: "16px 20px", fontSize: "0.8rem", color: "#64748b", fontWeight: 700 }}>BUDGET</th>
                        <th style={{ padding: "16px 20px", fontSize: "0.8rem", color: "#64748b", fontWeight: 700 }}>STAGE</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredLeads.length === 0 ? (
                        <tr>
                          <td colSpan={4} style={{ padding: "32px", textAlign: "center", color: "#64748b" }}>No leads in pipeline matching filters.</td>
                        </tr>
                      ) : (
                        filteredLeads.map((lead) => (
                          <tr
                            key={lead.id}
                            onClick={() => {
                              setEditingLead(lead);
                              setActiveTab("queries"); // Redirect details to queries tab
                            }}
                            style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.03)", cursor: "pointer", transition: "background 0.2s" }}
                            onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255, 255, 255, 0.01)"}
                            onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                          >
                            <td style={{ padding: "16px 20px" }}>
                              <p style={{ margin: 0, fontSize: "0.9rem", fontWeight: 700, color: "#fff" }}>{lead.name}</p>
                              <span style={{ fontSize: "0.75rem", color: "#64748b" }}>{lead.email}</span>
                            </td>
                            <td style={{ padding: "16px 20px", fontSize: "0.85rem", color: "#cbd5e1" }}>{lead.service}</td>
                            <td style={{ padding: "16px 20px", fontSize: "0.85rem", fontWeight: 600, color: "#fff" }}>{lead.budget}</td>
                            <td style={{ padding: "16px 20px" }}>
                              <span style={{
                                padding: "4px 10px",
                                borderRadius: "6px",
                                fontSize: "0.75rem",
                                fontWeight: 700,
                                background: lead.stage === "New" ? "rgba(56, 189, 248, 0.15)" : lead.stage === "Contacted" ? "rgba(244, 63, 94, 0.15)" : lead.stage === "Proposal Sent" ? "rgba(234, 179, 8, 0.15)" : lead.stage === "Closed Won" ? "rgba(34, 197, 94, 0.15)" : "rgba(100, 116, 139, 0.15)",
                                color: lead.stage === "New" ? "#38bdf8" : lead.stage === "Contacted" ? "#fb7185" : lead.stage === "Proposal Sent" ? "#facc15" : lead.stage === "Closed Won" ? "#4ade80" : "#94a3b8"
                              }}>{lead.stage}</span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* CRM Pipeline conversion funnel */}
              <div style={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "16px", padding: "28px" }}>
                <h3 style={{ margin: "0 0 24px 0", fontSize: "1.1rem", fontWeight: 700 }}>Conversion Funnel Analysis</h3>

                {/* Funnel Graph */}
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {[
                    { stage: "New", color: "#38bdf8", count: leads.filter(l => l.stage === "New").length },
                    { stage: "Contacted", color: "#fb7185", count: leads.filter(l => l.stage === "Contacted").length },
                    { stage: "Proposal Sent", color: "#facc15", count: leads.filter(l => l.stage === "Proposal Sent").length },
                    { stage: "Closed Won", color: "#4ade80", count: leads.filter(l => l.stage === "Closed Won").length }
                  ].map((item, index) => {
                    const maxCount = Math.max(...[leads.filter(l => l.stage === "New").length, 1]);
                    const widthPercent = Math.max((item.count / maxCount) * 100, 5);
                    return (
                      <div key={item.stage}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", color: "#94a3b8", marginBottom: "6px" }}>
                          <span>{item.stage}</span>
                          <span style={{ fontWeight: 700, color: "#fff" }}>{item.count} leads</span>
                        </div>
                        <div style={{ height: "20px", background: "rgba(255,255,255,0.03)", borderRadius: "6px", overflow: "hidden" }}>
                          <div style={{ height: "100%", width: `${widthPercent}%`, background: item.color, borderRadius: "6px", transition: "width 0.5s ease" }} />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div style={{ marginTop: "32px", borderTop: "1px solid rgba(255, 255, 255, 0.05)", paddingTop: "20px", fontSize: "0.85rem", color: "#94a3b8", lineHeight: 1.6 }}>
                  <p style={{ margin: "0 0 8px 0" }}>💡 Win Rate of signed queries is <strong>{winRate}%</strong>.</p>
                  <p style={{ margin: 0 }}>Average Budget size per query closed successfully is <strong>₹{(wonRevenue / (closedWonCount || 1) / 100000).toFixed(1)}L</strong>.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: CAREERS MANAGEMENT PANEL */}
        {activeTab === "careers" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
              <div>
                <p style={{ margin: 0, fontSize: "0.9rem", color: "#38bdf8", fontWeight: 600 }}>TALENT ACQUISITION</p>
                <h1 style={{ margin: "4px 0 0 0", fontSize: "2rem", fontWeight: 700 }}>Job Postings ({jobs.length})</h1>
              </div>
              <button
                onClick={() => setShowAddJobModal(true)}
                style={{
                  background: "#0f62fe",
                  color: "#fff",
                  border: "none",
                  padding: "12px 20px",
                  borderRadius: "10px",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px"
                }}
              >
                <Plus size={16} /> Create Job Listing
              </button>
            </div>

            {/* Jobs Listing grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "24px" }}>
              {jobs.map((job) => (
                <div
                  key={job.id}
                  style={{
                    background: "#0f172a",
                    border: "1px solid rgba(255,255,255,0.05)",
                    borderRadius: "16px",
                    padding: "24px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between"
                  }}
                >
                  <div>
                    {/* Header */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "16px" }}>
                      <div>
                        <span style={{ fontSize: "0.75rem", background: "rgba(15, 98, 254, 0.15)", color: "#38bdf8", padding: "4px 8px", borderRadius: "4px", fontWeight: 700 }}>{job.type}</span>
                        <h3 style={{ margin: "8px 0 2px 0", fontSize: "1.1rem", fontWeight: 700, color: "#fff" }}>{job.title}</h3>
                        <span style={{ fontSize: "0.8rem", color: "#64748b" }}>{job.dept} • {job.location || job.loc}</span>
                      </div>
                      <div style={{ display: "flex", gap: "6px" }}>
                        <button
                          onClick={() => {
                            setEditingJob(job);
                            setJobForm({
                              title: job.title,
                              dept: job.dept,
                              type: job.type,
                              loc: job.location || job.loc || "Hyderabad",
                              open: job.open,
                              description: job.description || "",
                              requirements: Array.isArray(job.requirements) ? job.requirements.join("\n") : "",
                              published: job.published
                            });
                            setShowAddJobModal(true);
                          }}
                          style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer" }}
                          title="Edit job"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteJob(job.id)}
                          style={{ background: "none", border: "none", color: "#f87171", cursor: "pointer" }}
                          title="Revoke / Delete job"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    <p style={{ margin: "0 0 16px 0", fontSize: "0.85rem", color: "#cbd5e1", lineHeight: 1.5 }}>
                      {job.description || "No description provided."}
                    </p>
                  </div>

                  {/* Footer Stats / Action */}
                  <div style={{ borderTop: "1px solid rgba(255, 255, 255, 0.05)", paddingTop: "16px", marginTop: "12px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", fontSize: "0.8rem", color: "#64748b" }}>
                      <span>Submissions: <strong style={{ color: "#fff" }}>{job.submissions || 0}</strong></span>
                      <span>Clicks/Views: <strong style={{ color: "#fff" }}>{job.applyClicks || 0}</strong></span>
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "0.8rem", color: job.published ? "#4ade80" : "#ef4444", fontWeight: 700 }}>
                        {job.published ? "● Active / Published" : "○ Draft / Revoked"}
                      </span>
                      <button
                        onClick={() => handleToggleJobPublish(job.id, job.published)}
                        style={{
                          background: job.published ? "rgba(239, 68, 68, 0.1)" : "rgba(34, 197, 94, 0.1)",
                          color: job.published ? "#f87171" : "#4ade80",
                          border: `1px solid ${job.published ? "rgba(239, 68, 68, 0.2)" : "rgba(34, 197, 94, 0.2)"}`,
                          padding: "6px 12px",
                          borderRadius: "6px",
                          fontSize: "0.8rem",
                          fontWeight: 600,
                          cursor: "pointer",
                          transition: "all 0.2s"
                        }}
                      >
                        {job.published ? "Revoke Listing" : "Publish Job"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: PROJECTS TRACKING */}
        {activeTab === "projects" && (
          <div>
            <div style={{ marginBottom: "32px" }}>
              <p style={{ margin: 0, fontSize: "0.9rem", color: "#38bdf8", fontWeight: 600 }}>CLIENT PROJECT PIPELINES</p>
              <h1 style={{ margin: "4px 0 0 0", fontSize: "2rem", fontWeight: 700 }}>Projects Progress Tracking ({projects.length})</h1>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              {projects.length === 0 ? (
                <div style={{ textAlign: "center", padding: "48px", background: "#0f172a", borderRadius: "16px" }}>
                  <p style={{ color: "#64748b" }}>No active projects found.</p>
                </div>
              ) : (
                projects.map((proj) => (
                  <div key={proj.id} style={{ background: "#0f172a", border: "1px solid rgba(255, 255, 255, 0.05)", padding: "28px", borderRadius: "16px" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1.5fr 1.3fr", gap: "24px" }}>
                      {/* Client details */}
                      <div>
                        <span style={{ fontSize: "0.72rem", color: "#38bdf8", fontWeight: 700 }}>PROJECT ID: {proj.id}</span>
                        <h3 style={{ margin: "8px 0 4px 0", fontSize: "1.25rem", color: "#fff" }}>{proj.customer_name}</h3>
                        <span style={{ fontSize: "0.82rem", color: "#64748b", display: "block" }}>{proj.customer_email}</span>
                        <span style={{ fontSize: "0.85rem", color: "#94a3b8", display: "block", marginTop: "8px", fontWeight: 600 }}>{proj.company_name}</span>
                        <span style={{ fontSize: "0.75rem", color: "#64748b", display: "block", marginTop: "12px" }}>Created: {new Date(proj.created_at || Date.now()).toLocaleDateString("en-IN")}</span>
                      </div>

                      {/* Plan and specs */}
                      <div>
                        <span style={{ fontSize: "0.72rem", color: "#64748b", fontWeight: 700 }}>PLAN & REQUIREMENTS</span>
                        <h4 style={{ margin: "4px 0 10px 0", color: "#fff", fontSize: "1rem" }}>{proj.plan_name}</h4>
                        <div style={{ background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: "8px", padding: "12px", fontSize: "0.82rem", color: "#cbd5e1", lineHeight: 1.5, maxHeight: "100px", overflowY: "auto" }}>
                          {proj.requirements || "No additional requirements stated."}
                        </div>
                      </div>

                      {/* Management Controls */}
                      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                        <div>
                          <label style={{ display: "block", fontSize: "0.75rem", color: "#64748b", fontWeight: 700, marginBottom: "6px" }}>PIPELINE STATUS</label>
                          <select
                            value={proj.status}
                            onChange={(e) => handleProjectUpdate(proj.id, { status: e.target.value })}
                            style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", background: "#080c14", border: "1px solid rgba(255,255,255,0.08)", color: "#fff", cursor: "pointer", fontSize: "0.85rem" }}
                          >
                            <option value="New Lead">New Lead</option>
                            <option value="Plan Selected">Plan Selected</option>
                            <option value="Payment Completed">Payment Completed</option>
                            <option value="Proposal Sent">Proposal Sent</option>
                            <option value="Agreement Signed">Agreement Signed</option>
                            <option value="Project Assigned">Project Assigned</option>
                            <option value="Development Started">Development Started</option>
                            <option value="Testing">Testing</option>
                            <option value="Delivery">Delivery</option>
                            <option value="Project Completed">Project Completed</option>
                          </select>
                        </div>

                        <div>
                          <label style={{ display: "block", fontSize: "0.75rem", color: "#64748b", fontWeight: 700, marginBottom: "6px" }}>ASSIGNED STAFF</label>
                          <select
                            value={proj.assigned_to || "Unassigned"}
                            onChange={(e) => handleProjectUpdate(proj.id, { assigned_to: e.target.value })}
                            style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", background: "#080c14", border: "1px solid rgba(255,255,255,0.08)", color: "#fff", cursor: "pointer", fontSize: "0.85rem" }}
                          >
                            <option value="Unassigned">Unassigned</option>
                            <option value="Arjun Sharma">Arjun Sharma (Eng)</option>
                            <option value="Priya Sharma">Priya Sharma (HR)</option>
                            <option value="Rohit Verma">Rohit Verma (Eng)</option>
                            <option value="Sneha Gupta">Sneha Gupta (PM)</option>
                          </select>
                        </div>

                        <div>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                            <label style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: 700 }}>PROGRESS</label>
                            <strong style={{ fontSize: "0.8rem", color: "#38bdf8" }}>{proj.progress}%</strong>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={proj.progress || 0}
                            onChange={(e) => handleProjectUpdate(proj.id, { progress: parseInt(e.target.value) })}
                            style={{ width: "100%", cursor: "pointer" }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 5: PRICING & SUBSCRIPTIONS CRM PANEL */}
        {activeTab === "billing" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
              <div>
                <p style={{ margin: 0, fontSize: "0.9rem", color: "#38bdf8", fontWeight: 600 }}>FINANCIAL SUITE</p>
                <h1 style={{ margin: "4px 0 0 0", fontSize: "2rem", fontWeight: 700 }}>Pricing & Subscriptions</h1>
              </div>
              
              {/* Action button changes based on sub-tab */}
              {billingSubTab === "plans" && (
                <button
                  onClick={() => {
                    setEditingPlan(null);
                    setPlanForm({
                      id: "",
                      name: "",
                      price: "",
                      billing_cycle: "one-time",
                      free_trial_days: "0",
                      active: true,
                      features: { pages: "Up to 5", responsive: "✓", contactForm: "✓", seoSetup: "Basic", blogModule: "✗", cmsPanel: "✗", customDesign: "✗", paymentGateway: "✗", productMgmt: "✗", userLogin: "✗", analytics: "✓", support: "1 Month" }
                    });
                    setShowAddPlanModal(true);
                  }}
                  style={{ background: "#0f62fe", color: "#fff", border: "none", padding: "12px 20px", borderRadius: "10px", fontWeight: 600, fontSize: "0.9rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <Plus size={16} /> Create New Plan
                </button>
              )}
              {billingSubTab === "promo" && (
                <button
                  onClick={() => {
                    setEditingPromo(null);
                    setPromoForm({ code: "", discount_type: "percentage", discount_value: "10", active: true, expiry_date: "" });
                    setShowAddPromoModal(true);
                  }}
                  style={{ background: "#0f62fe", color: "#fff", border: "none", padding: "12px 20px", borderRadius: "10px", fontWeight: 600, fontSize: "0.9rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <Plus size={16} /> Create Discount Code
                </button>
              )}
              {billingSubTab === "subs" && (
                <button
                  onClick={() => {
                    setEditingSubscription(null);
                    setSubscriptionForm({ customer_name: "", customer_email: "", plan_id: plans[0]?.id || "basic", billing_cycle: "one-time", status: "active", start_date: new Date().toISOString().slice(0, 10), trial_end_date: "", promo_code: "" });
                    setShowAddSubscriptionModal(true);
                  }}
                  style={{ background: "#0f62fe", color: "#fff", border: "none", padding: "12px 20px", borderRadius: "10px", fontWeight: 600, fontSize: "0.9rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <Plus size={16} /> Add Subscription
                </button>
              )}
              {billingSubTab === "payments" && (
                <button
                  onClick={() => {
                    setPaymentForm({ subscription_id: subscriptions[0]?.id || "", amount: "", payment_date: new Date().toISOString().slice(0, 10), status: "paid", payment_method: "UPI" });
                    setShowAddPaymentModal(true);
                  }}
                  style={{ background: "#0f62fe", color: "#fff", border: "none", padding: "12px 20px", borderRadius: "10px", fontWeight: 600, fontSize: "0.9rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <Plus size={16} /> Log Transaction
                </button>
              )}
            </div>

            {/* Sub-Navigation Tabs */}
            <div style={{
              display: "flex",
              gap: "8px",
              borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
              marginBottom: "32px",
              paddingBottom: "2px"
            }}>
              {[
                { id: "plans", label: "Pricing Plans" },
                { id: "promo", label: "Promo Codes" },
                { id: "subs", label: "Subscriptions" },
                { id: "payments", label: "Revenue Ledger" },
                { id: "reports", label: "Billing Reports" },
                { id: "documents", label: "Client Documents" },
                { id: "tickets", label: "Support Tickets" }
              ].map(subTab => (
                <button
                  key={subTab.id}
                  onClick={() => setBillingSubTab(subTab.id)}
                  style={{
                    background: "transparent",
                    border: "none",
                    borderBottom: billingSubTab === subTab.id ? "2px solid #38bdf8" : "2px solid transparent",
                    color: billingSubTab === subTab.id ? "#38bdf8" : "#94a3b8",
                    padding: "10px 16px",
                    fontWeight: 600,
                    fontSize: "0.9rem",
                    cursor: "pointer",
                    transition: "all 0.2s"
                  }}
                >
                  {subTab.label}
                </button>
              ))}
            </div>

            {/* Sub-Tab Content 1: Plans */}
            {billingSubTab === "plans" && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "24px" }}>
                {plans.map(p => (
                  <div key={p.id} style={{
                    background: "#0f172a",
                    border: "1px solid rgba(255,255,255,0.05)",
                    borderRadius: "16px",
                    padding: "24px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between"
                  }}>
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "12px" }}>
                        <div>
                          <span style={{ fontSize: "0.7rem", background: "rgba(34, 197, 94, 0.15)", color: "#4ade80", padding: "3px 6px", borderRadius: "4px", fontWeight: 700 }}>
                            {p.billing_cycle === "monthly" ? "Monthly" : p.billing_cycle === "yearly" ? "Yearly" : "One-Time"}
                          </span>
                          <h3 style={{ margin: "6px 0 2px 0", fontSize: "1.15rem", fontWeight: 700, color: "#fff" }}>{p.name}</h3>
                          <span style={{ fontSize: "0.75rem", color: "#64748b" }}>ID: {p.id}</span>
                        </div>
                        <div style={{ display: "flex", gap: "6px" }}>
                          <button
                            onClick={() => {
                              setEditingPlan(p);
                              setPlanForm({
                                id: p.id,
                                name: p.name,
                                price: p.price,
                                billing_cycle: p.billing_cycle,
                                free_trial_days: String(p.free_trial_days),
                                active: p.active,
                                features: p.features || {}
                              });
                              setShowAddPlanModal(true);
                            }}
                            style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer" }}
                            title="Edit plan"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeletePlan(p.id)}
                            style={{ background: "none", border: "none", color: "#f87171", cursor: "pointer" }}
                            title="Delete plan"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>

                      <h2 style={{ margin: "12px 0 4px 0", fontSize: "1.5rem", fontWeight: 800, color: "#38bdf8" }}>{p.price}</h2>
                      {p.free_trial_days > 0 && <span style={{ fontSize: "0.75rem", color: "#a855f7", fontWeight: 600 }}>● {p.free_trial_days} Days Trial Period</span>}
                      
                      <div style={{ borderTop: "1px solid rgba(255,255,255,0.04)", marginTop: "16px", paddingTop: "14px" }}>
                        <p style={{ margin: "0 0 8px 0", fontSize: "0.75rem", color: "#64748b", fontWeight: 700 }}>FEATURE MATRIX</p>
                        <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "0.8rem", color: "#cbd5e1" }}>
                          <div style={{ display: "flex", justifyContent: "space-between" }}><span>Pages</span><strong>{p.features?.pages || "N/A"}</strong></div>
                          <div style={{ display: "flex", justifyContent: "space-between" }}><span>Responsive</span><strong>{p.features?.responsive || "✗"}</strong></div>
                          <div style={{ display: "flex", justifyContent: "space-between" }}><span>SEO Setup</span><strong>{p.features?.seoSetup || "✗"}</strong></div>
                          <div style={{ display: "flex", justifyContent: "space-between" }}><span>CMS Panel</span><strong>{p.features?.cmsPanel || "✗"}</strong></div>
                          <div style={{ display: "flex", justifyContent: "space-between" }}><span>Gateway</span><strong>{p.features?.paymentGateway || "✗"}</strong></div>
                          <div style={{ display: "flex", justifyContent: "space-between" }}><span>Support</span><strong>{p.features?.support || "N/A"}</strong></div>
                        </div>
                      </div>
                    </div>

                    <div style={{ borderTop: "1px solid rgba(255, 255, 255, 0.05)", paddingTop: "14px", marginTop: "14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "0.8rem", color: p.active ? "#4ade80" : "#ef4444", fontWeight: 700 }}>
                        {p.active ? "● Active / Available" : "○ Inactive / Hidden"}
                      </span>
                      <button
                        onClick={() => handleTogglePlanActive(p.id, p.active)}
                        style={{
                          background: p.active ? "rgba(239, 68, 68, 0.1)" : "rgba(34, 197, 94, 0.1)",
                          color: p.active ? "#f87171" : "#4ade80",
                          border: `1px solid ${p.active ? "rgba(239, 68, 68, 0.2)" : "rgba(34, 197, 94, 0.2)"}`,
                          padding: "4px 8px",
                          borderRadius: "4px",
                          fontSize: "0.75rem",
                          fontWeight: 600,
                          cursor: "pointer"
                        }}
                      >
                        {p.active ? "Deactivate" : "Activate"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Sub-Tab Content 2: Promo Codes */}
            {billingSubTab === "promo" && (
              <div style={{ background: "#0f172a", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.05)", overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.05)", background: "rgba(255,255,255,0.02)" }}>
                      <th style={{ padding: "16px 20px", fontSize: "0.8rem", color: "#64748b", fontWeight: 700 }}>PROMO CODE</th>
                      <th style={{ padding: "16px 20px", fontSize: "0.8rem", color: "#64748b", fontWeight: 700 }}>DISCOUNT</th>
                      <th style={{ padding: "16px 20px", fontSize: "0.8rem", color: "#64748b", fontWeight: 700 }}>EXPIRY DATE</th>
                      <th style={{ padding: "16px 20px", fontSize: "0.8rem", color: "#64748b", fontWeight: 700 }}>STATUS</th>
                      <th style={{ padding: "16px 20px", fontSize: "0.8rem", color: "#64748b", fontWeight: 700 }}>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {promoCodes.length === 0 ? (
                      <tr>
                        <td colSpan={5} style={{ padding: "32px", textAlign: "center", color: "#64748b" }}>No active promo codes.</td>
                      </tr>
                    ) : (
                      promoCodes.map((promo) => (
                        <tr key={promo.id} style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.03)" }}>
                          <td style={{ padding: "16px 20px" }}>
                            <strong style={{ fontSize: "0.95rem", color: "#fff", background: "rgba(15, 98, 254, 0.15)", color: "#38bdf8", padding: "4px 10px", borderRadius: "6px" }}>{promo.code}</strong>
                          </td>
                          <td style={{ padding: "16px 20px", fontSize: "0.88rem", color: "#fff", fontWeight: 700 }}>
                            {promo.discount_type === "percentage" ? `${promo.discount_value}% Off` : `₹${promo.discount_value.toLocaleString("en-IN")} Off`}
                          </td>
                          <td style={{ padding: "16px 20px", fontSize: "0.85rem", color: "#cbd5e1" }}>{promo.expiry_date || "No Expiry"}</td>
                          <td style={{ padding: "16px 20px" }}>
                            <span style={{
                              padding: "4px 8px",
                              borderRadius: "4px",
                              fontSize: "0.75rem",
                              fontWeight: 700,
                              background: promo.active ? "rgba(34, 197, 94, 0.15)" : "rgba(239, 68, 68, 0.15)",
                              color: promo.active ? "#4ade80" : "#f87171"
                            }}>{promo.active ? "Active" : "Inactive"}</span>
                          </td>
                          <td style={{ padding: "16px 20px", display: "flex", gap: "10px" }}>
                            <button
                              onClick={() => {
                                setEditingPromo(promo);
                                setPromoForm({
                                  code: promo.code,
                                  discount_type: promo.discount_type,
                                  discount_value: String(promo.discount_value),
                                  active: promo.active,
                                  expiry_date: promo.expiry_date || ""
                                });
                                setShowAddPromoModal(true);
                              }}
                              style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer" }}
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => handleTogglePromoActive(promo.id, promo.active)}
                              style={{ background: "none", border: "none", color: promo.active ? "#f87171" : "#4ade80", cursor: "pointer", fontSize: "0.8rem", fontWeight: 600 }}
                            >
                              {promo.active ? "Disable" : "Enable"}
                            </button>
                            <button
                              onClick={() => handleDeletePromo(promo.id)}
                              style={{ background: "none", border: "none", color: "#f87171", cursor: "pointer" }}
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Sub-Tab Content 3: Customer Subscriptions */}
            {billingSubTab === "subs" && (
              <div style={{ background: "#0f172a", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.05)", overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.05)", background: "rgba(255,255,255,0.02)" }}>
                      <th style={{ padding: "16px 20px", fontSize: "0.8rem", color: "#64748b", fontWeight: 700 }}>CUSTOMER</th>
                      <th style={{ padding: "16px 20px", fontSize: "0.8rem", color: "#64748b", fontWeight: 700 }}>PLAN (UPGRADE / DOWNGRADE)</th>
                      <th style={{ padding: "16px 20px", fontSize: "0.8rem", color: "#64748b", fontWeight: 700 }}>BILLING CYCLE</th>
                      <th style={{ padding: "16px 20px", fontSize: "0.8rem", color: "#64748b", fontWeight: 700 }}>STATUS & TIMELINE</th>
                      <th style={{ padding: "16px 20px", fontSize: "0.8rem", color: "#64748b", fontWeight: 700 }}>DISCOUNT</th>
                      <th style={{ padding: "16px 20px", fontSize: "0.8rem", color: "#64748b", fontWeight: 700 }}>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subscriptions.length === 0 ? (
                      <tr>
                        <td colSpan={6} style={{ padding: "32px", textAlign: "center", color: "#64748b" }}>No active customer subscriptions.</td>
                      </tr>
                    ) : (
                      subscriptions.map((sub) => (
                        <tr key={sub.id} style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.03)" }}>
                          <td style={{ padding: "16px 20px" }}>
                            <button
                              onClick={() => {
                                setSelectedCustomerEmail(sub.customer_email);
                                setShowCustomerModal(true);
                              }}
                              style={{
                                background: "none",
                                border: "none",
                                padding: 0,
                                textAlign: "left",
                                cursor: "pointer",
                                outline: "none",
                                display: "block"
                              }}
                            >
                              <p style={{ margin: 0, fontSize: "0.9rem", fontWeight: 700, color: "#38bdf8", textDecoration: "underline" }}>{sub.customer_name}</p>
                            </button>
                            <span style={{ fontSize: "0.75rem", color: "#64748b" }}>{sub.customer_email}</span>
                          </td>
                          <td style={{ padding: "16px 20px" }}>
                            {/* Upgrade/Downgrade Selection */}
                            <select
                              value={sub.plan_id}
                              onChange={(e) => handleUpgradeDowngradePlan(sub.id, e.target.value)}
                              style={{
                                padding: "6px 10px",
                                borderRadius: "6px",
                                background: "#080c14",
                                border: "1px solid rgba(255,255,255,0.1)",
                                color: "#38bdf8",
                                fontSize: "0.8rem",
                                cursor: "pointer",
                                fontWeight: 700
                              }}
                            >
                              {plans.map(p => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                              ))}
                            </select>
                          </td>
                          <td style={{ padding: "16px 20px", fontSize: "0.85rem", color: "#cbd5e1", textTransform: "capitalize" }}>{sub.billing_cycle}</td>
                          <td style={{ padding: "16px 20px" }}>
                            <div style={{ display: "flex", gap: "6px", alignItems: "center", marginBottom: "4px" }}>
                              <span style={{
                                padding: "3px 8px",
                                borderRadius: "4px",
                                fontSize: "0.7rem",
                                fontWeight: 800,
                                textTransform: "uppercase",
                                background: sub.status === "active" ? "rgba(34, 197, 94, 0.15)" : sub.status === "trial" ? "rgba(168, 85, 247, 0.15)" : "rgba(239, 68, 68, 0.15)",
                                color: sub.status === "active" ? "#4ade80" : sub.status === "trial" ? "#c084fc" : "#f87171"
                              }}>{sub.status}</span>
                            </div>
                            <span style={{ fontSize: "0.75rem", color: "#64748b" }}>
                              Since {sub.start_date}
                              {sub.status === "trial" && sub.trial_end_date ? ` (Ends ${sub.trial_end_date})` : ""}
                            </span>
                          </td>
                          <td style={{ padding: "16px 20px", fontSize: "0.85rem", color: sub.promo_code ? "#fb7185" : "#64748b", fontWeight: sub.promo_code ? 700 : 500 }}>
                            {sub.promo_code || "None"}
                          </td>
                          <td style={{ padding: "16px 20px", display: "flex", gap: "10px" }}>
                            <button
                              onClick={() => {
                                setEditingSubscription(sub);
                                setSubscriptionForm({
                                  customer_name: sub.customer_name,
                                  customer_email: sub.customer_email,
                                  plan_id: sub.plan_id,
                                  billing_cycle: sub.billing_cycle,
                                  status: sub.status,
                                  start_date: sub.start_date,
                                  trial_end_date: sub.trial_end_date || "",
                                  promo_code: sub.promo_code || ""
                                });
                                setShowAddSubscriptionModal(true);
                              }}
                              style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer" }}
                              title="Edit subscription details"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => handleToggleSubStatus(sub.id, sub.status)}
                              style={{ background: "none", border: "none", color: sub.status === "active" ? "#f87171" : "#4ade80", cursor: "pointer", fontSize: "0.8rem", fontWeight: 600 }}
                            >
                              {sub.status === "active" ? "Cancel Plan" : "Reactivate"}
                            </button>
                            <button
                              onClick={() => handleDeleteSubscription(sub.id)}
                              style={{ background: "none", border: "none", color: "#f87171", cursor: "pointer" }}
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Sub-Tab Content 4: Revenue Ledger */}
            {billingSubTab === "payments" && (
              <div style={{ background: "#0f172a", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.05)", overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.05)", background: "rgba(255,255,255,0.02)" }}>
                      <th style={{ padding: "16px 20px", fontSize: "0.8rem", color: "#64748b", fontWeight: 700 }}>DATE</th>
                      <th style={{ padding: "16px 20px", fontSize: "0.8rem", color: "#64748b", fontWeight: 700 }}>CUSTOMER ACCOUNT</th>
                      <th style={{ padding: "16px 20px", fontSize: "0.8rem", color: "#64748b", fontWeight: 700 }}>TRANSACTION ID</th>
                      <th style={{ padding: "16px 20px", fontSize: "0.8rem", color: "#64748b", fontWeight: 700 }}>AMOUNT RECEIVED</th>
                      <th style={{ padding: "16px 20px", fontSize: "0.8rem", color: "#64748b", fontWeight: 700 }}>METHOD</th>
                      <th style={{ padding: "16px 20px", fontSize: "0.8rem", color: "#64748b", fontWeight: 700 }}>STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.length === 0 ? (
                      <tr>
                        <td colSpan={6} style={{ padding: "32px", textAlign: "center", color: "#64748b" }}>No payments logged yet.</td>
                      </tr>
                    ) : (
                      payments.map((p) => {
                        const subscriber = subscriptions.find(s => s.id === p.subscription_id);
                        return (
                          <tr key={p.id} style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.03)" }}>
                            <td style={{ padding: "16px 20px", fontSize: "0.85rem", color: "#cbd5e1" }}>{p.payment_date}</td>
                            <td style={{ padding: "16px 20px" }}>
                              <p style={{ margin: 0, fontSize: "0.9rem", fontWeight: 700, color: "#fff" }}>{subscriber?.customer_name || "Offline Payment"}</p>
                              <span style={{ fontSize: "0.75rem", color: "#64748b" }}>{subscriber?.customer_email || "N/A"}</span>
                            </td>
                            <td style={{ padding: "16px 20px", fontSize: "0.78rem", color: "#64748b" }}>{p.id}</td>
                            <td style={{ padding: "16px 20px", fontSize: "0.92rem", color: "#22c55e", fontWeight: 800 }}>
                              ₹{parseFloat(p.amount).toLocaleString("en-IN")}
                            </td>
                            <td style={{ padding: "16px 20px", fontSize: "0.85rem", color: "#cbd5e1" }}>{p.payment_method}</td>
                            <td style={{ padding: "16px 20px" }}>
                              <span style={{
                                padding: "4px 8px",
                                borderRadius: "4px",
                                fontSize: "0.75rem",
                                fontWeight: 700,
                                background: p.status === "paid" ? "rgba(34, 197, 94, 0.15)" : p.status === "refunded" ? "rgba(234, 179, 8, 0.15)" : "rgba(239, 68, 68, 0.15)",
                                color: p.status === "paid" ? "#4ade80" : p.status === "refunded" ? "#facc15" : "#f87171"
                              }}>{p.status.toUpperCase()}</span>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Sub-Tab Content 5: Billing Reports */}
            {billingSubTab === "reports" && (
              <div>
                {/* Metric Summary Grid */}
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: "24px",
                  marginBottom: "36px"
                }}>
                  <div style={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.05)", padding: "20px", borderRadius: "14px" }}>
                    <span style={{ fontSize: "0.8rem", color: "#64748b", fontWeight: 700 }}>TOTAL REVENUE GENERATED</span>
                    <h2 style={{ margin: "8px 0 0 0", fontSize: "1.8rem", fontWeight: 800, color: "#22c55e" }}>
                      ₹{billingReport.metrics?.totalRevenue?.toLocaleString("en-IN") || 0}
                    </h2>
                  </div>

                  <div style={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.05)", padding: "20px", borderRadius: "14px" }}>
                    <span style={{ fontSize: "0.8rem", color: "#64748b", fontWeight: 700 }}>MONTHLY RUN RATE (MRR)</span>
                    <h2 style={{ margin: "8px 0 0 0", fontSize: "1.8rem", fontWeight: 800, color: "#38bdf8" }}>
                      ₹{billingReport.metrics?.mrr?.toLocaleString("en-IN") || 0}
                    </h2>
                  </div>

                  <div style={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.05)", padding: "20px", borderRadius: "14px" }}>
                    <span style={{ fontSize: "0.8rem", color: "#64748b", fontWeight: 700 }}>ACTIVE SUBSCRIBERS</span>
                    <h2 style={{ margin: "8px 0 0 0", fontSize: "1.8rem", fontWeight: 800, color: "#fff" }}>
                      {billingReport.metrics?.activeSubscribers || 0} Accounts
                    </h2>
                  </div>

                  <div style={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.05)", padding: "20px", borderRadius: "14px" }}>
                    <span style={{ fontSize: "0.8rem", color: "#64748b", fontWeight: 700 }}>ACTIVE TRIAL ACCOUNTS</span>
                    <h2 style={{ margin: "8px 0 0 0", fontSize: "1.8rem", fontWeight: 800, color: "#c084fc" }}>
                      {billingReport.metrics?.activeTrials || 0} Signups
                    </h2>
                  </div>
                </div>

                {/* Sub Chart details */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
                  {/* Plan distribution */}
                  <div style={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "16px", padding: "24px" }}>
                    <h3 style={{ margin: "0 0 20px 0", fontSize: "1.05rem", fontWeight: 800, color: "#fff" }}>Plan Distribution Analysis</h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                      {Object.keys(billingReport.planDistribution || {}).map((planName) => {
                        const count = billingReport.planDistribution[planName];
                        const maxCount = Math.max(...Object.values(billingReport.planDistribution), 1);
                        const percent = (count / maxCount) * 100;
                        return (
                          <div key={planName}>
                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.82rem", color: "#cbd5e1", marginBottom: "6px" }}>
                              <span>{planName}</span>
                              <strong style={{ color: "#fff" }}>{count} Subscribers</strong>
                            </div>
                            <div style={{ height: "12px", background: "rgba(255,255,255,0.03)", borderRadius: "4px", overflow: "hidden" }}>
                              <div style={{ height: "100%", width: `${percent}%`, background: "linear-gradient(90deg, #0f62fe, #00d4ff)", borderRadius: "4px" }} />
                            </div>
                          </div>
                        );
                      })}
                      {Object.keys(billingReport.planDistribution || {}).length === 0 && <p style={{ color: "#64748b", margin: 0 }}>No distribution statistics found.</p>}
                    </div>
                  </div>

                  {/* Promo Uses */}
                  <div style={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "16px", padding: "24px" }}>
                    <h3 style={{ margin: "0 0 20px 0", fontSize: "1.05rem", fontWeight: 800, color: "#fff" }}>Promo Codes Usage Ledger</h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                      {Object.keys(billingReport.promoUses || {}).map((code) => {
                        const count = billingReport.promoUses[code];
                        const maxCount = Math.max(...Object.values(billingReport.promoUses), 1);
                        const percent = (count / maxCount) * 100;
                        return (
                          <div key={code}>
                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.82rem", color: "#cbd5e1", marginBottom: "6px" }}>
                              <span style={{ fontWeight: 700, color: "#38bdf8" }}>{code}</span>
                              <strong style={{ color: "#fff" }}>{count} Uses</strong>
                            </div>
                            <div style={{ height: "12px", background: "rgba(255,255,255,0.03)", borderRadius: "4px", overflow: "hidden" }}>
                              <div style={{ height: "100%", width: `${percent}%`, background: "linear-gradient(90deg, #fb7185, #ec4899)", borderRadius: "4px" }} />
                            </div>
                          </div>
                        );
                      })}
                      {Object.keys(billingReport.promoUses || {}).length === 0 && <p style={{ color: "#64748b", margin: 0 }}>No promo codes have been used yet.</p>}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Sub-Tab Content 6: Client Documents */}
            {billingSubTab === "documents" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
                
                {/* 1. Invoices List */}
                <div style={{ background: "#0f172a", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.05)", padding: "24px" }}>
                  <h3 style={{ margin: "0 0 16px 0", fontSize: "1.1rem", fontWeight: 700, color: "#fff" }}>Client Invoices</h3>
                  <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                    <thead>
                      <tr style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.05)", background: "rgba(255,255,255,0.02)" }}>
                        <th style={{ padding: "12px 16px", fontSize: "0.8rem", color: "#64748b", fontWeight: 700 }}>INVOICE ID</th>
                        <th style={{ padding: "12px 16px", fontSize: "0.8rem", color: "#64748b", fontWeight: 700 }}>PLAN NAME</th>
                        <th style={{ padding: "12px 16px", fontSize: "0.8rem", color: "#64748b", fontWeight: 700 }}>COST PAID</th>
                        <th style={{ padding: "12px 16px", fontSize: "0.8rem", color: "#64748b", fontWeight: 700 }}>DATE</th>
                        <th style={{ padding: "12px 16px", fontSize: "0.8rem", color: "#64748b", fontWeight: 700 }}>STATUS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {adminInvoices.length === 0 ? (
                        <tr>
                          <td colSpan={5} style={{ padding: "16px", textAlign: "center", color: "#64748b", fontSize: "0.85rem" }}>No client invoices issued yet.</td>
                        </tr>
                      ) : (
                        adminInvoices.map((inv) => (
                          <tr key={inv.id} style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.03)" }}>
                            <td style={{ padding: "12px 16px", fontSize: "0.85rem", color: "#38bdf8", fontWeight: 600 }}>{inv.id}</td>
                            <td style={{ padding: "12px 16px", fontSize: "0.85rem", color: "#fff" }}>{inv.plan_name}</td>
                            <td style={{ padding: "12px 16px", fontSize: "0.85rem", color: "#22c55e", fontWeight: 700 }}>₹{parseFloat(inv.cost).toLocaleString("en-IN")}</td>
                            <td style={{ padding: "12px 16px", fontSize: "0.85rem", color: "#cbd5e1" }}>{inv.issue_date}</td>
                            <td style={{ padding: "12px 16px" }}>
                              <span style={{ padding: "2px 6px", borderRadius: "4px", fontSize: "0.72rem", fontWeight: 800, background: "rgba(34, 197, 94, 0.15)", color: "#4ade80" }}>{inv.status.toUpperCase()}</span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* 2. Proposals List */}
                <div style={{ background: "#0f172a", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.05)", padding: "24px" }}>
                  <h3 style={{ margin: "0 0 16px 0", fontSize: "1.1rem", fontWeight: 700, color: "#fff" }}>Project Proposals</h3>
                  <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                    <thead>
                      <tr style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.05)", background: "rgba(255,255,255,0.02)" }}>
                        <th style={{ padding: "12px 16px", fontSize: "0.8rem", color: "#64748b", fontWeight: 700 }}>PROPOSAL ID</th>
                        <th style={{ padding: "12px 16px", fontSize: "0.8rem", color: "#64748b", fontWeight: 700 }}>CLIENT INFO</th>
                        <th style={{ padding: "12px 16px", fontSize: "0.8rem", color: "#64748b", fontWeight: 700 }}>TIER & COST</th>
                        <th style={{ padding: "12px 16px", fontSize: "0.8rem", color: "#64748b", fontWeight: 700 }}>STATUS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {adminProposals.length === 0 ? (
                        <tr>
                          <td colSpan={4} style={{ padding: "16px", textAlign: "center", color: "#64748b", fontSize: "0.85rem" }}>No proposals generated yet.</td>
                        </tr>
                      ) : (
                        adminProposals.map((p) => (
                          <tr key={p.id} style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.03)" }}>
                            <td style={{ padding: "12px 16px", fontSize: "0.85rem", color: "#cbd5e1" }}>{p.id}</td>
                            <td style={{ padding: "12px 16px" }}>
                              <p style={{ margin: 0, fontSize: "0.85rem", fontWeight: 700, color: "#fff" }}>{p.customer_name} ({p.company_name})</p>
                              <span style={{ fontSize: "0.75rem", color: "#64748b" }}>{p.customer_email}</span>
                            </td>
                            <td style={{ padding: "12px 16px" }}>
                              <span style={{ fontSize: "0.85rem", color: "#fff", display: "block" }}>{p.plan_name}</span>
                              <strong style={{ fontSize: "0.85rem", color: "#38bdf8" }}>₹{parseFloat(p.cost).toLocaleString("en-IN")}</strong>
                            </td>
                            <td style={{ padding: "12px 16px" }}>
                              <span style={{ padding: "2px 6px", borderRadius: "4px", fontSize: "0.72rem", fontWeight: 800, background: "rgba(15, 98, 254, 0.15)", color: "#38bdf8" }}>{p.status.toUpperCase()}</span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* 3. Agreements List */}
                <div style={{ background: "#0f172a", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.05)", padding: "24px" }}>
                  <h3 style={{ margin: "0 0 16px 0", fontSize: "1.1rem", fontWeight: 700, color: "#fff" }}>Service Agreements</h3>
                  <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                    <thead>
                      <tr style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.05)", background: "rgba(255,255,255,0.02)" }}>
                        <th style={{ padding: "12px 16px", fontSize: "0.8rem", color: "#64748b", fontWeight: 700 }}>CONTRACT ID</th>
                        <th style={{ padding: "12px 16px", fontSize: "0.8rem", color: "#64748b", fontWeight: 700 }}>CLIENT</th>
                        <th style={{ padding: "12px 16px", fontSize: "0.8rem", color: "#64748b", fontWeight: 700 }}>PLAN</th>
                        <th style={{ padding: "12px 16px", fontSize: "0.8rem", color: "#64748b", fontWeight: 700 }}>CONTRACT STATUS</th>
                        <th style={{ padding: "12px 16px", fontSize: "0.8rem", color: "#64748b", fontWeight: 700 }}>SIGN DETAILS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {adminAgreements.length === 0 ? (
                        <tr>
                          <td colSpan={5} style={{ padding: "16px", textAlign: "center", color: "#64748b", fontSize: "0.85rem" }}>No service contracts drafted yet.</td>
                        </tr>
                      ) : (
                        adminAgreements.map((a) => (
                          <tr key={a.id} style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.03)" }}>
                            <td style={{ padding: "12px 16px", fontSize: "0.85rem", color: "#cbd5e1" }}>{a.id}</td>
                            <td style={{ padding: "12px 16px" }}>
                              <p style={{ margin: 0, fontSize: "0.85rem", fontWeight: 700, color: "#fff" }}>{a.customer_name}</p>
                              <span style={{ fontSize: "0.75rem", color: "#64748b" }}>{a.customer_email}</span>
                            </td>
                            <td style={{ padding: "12px 16px", fontSize: "0.85rem", color: "#fff" }}>{a.plan_name}</td>
                            <td style={{ padding: "12px 16px" }}>
                              <span style={{
                                padding: "2px 6px",
                                borderRadius: "4px",
                                fontSize: "0.72rem",
                                fontWeight: 800,
                                background: a.status === "signed" ? "rgba(34, 197, 94, 0.15)" : "rgba(239, 68, 68, 0.15)",
                                color: a.status === "signed" ? "#4ade80" : "#f87171"
                              }}>{a.status.toUpperCase()}</span>
                            </td>
                            <td style={{ padding: "12px 16px", fontSize: "0.82rem", color: "#cbd5e1" }}>
                              {a.status === "signed" ? (
                                <span>Signed by: <strong>{a.signed_name}</strong> ({a.signed_at})</span>
                              ) : (
                                <span style={{ color: "#64748b" }}>Awaiting Client signature</span>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

              </div>
            )}

            {/* Sub-Tab Content 7: Support Tickets */}
            {billingSubTab === "tickets" && (
              <div style={{ background: "#0f172a", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.05)", padding: "24px" }}>
                <h3 style={{ margin: "0 0 20px 0", fontSize: "1.1rem", fontWeight: 700, color: "#fff" }}>Customer Helpdesk Tickets</h3>
                
                <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "24px", alignItems: "start" }}>
                  {/* Left Column: Tickets List */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    {adminTickets.length === 0 ? (
                      <p style={{ color: "#64748b", fontSize: "0.85rem", margin: 0 }}>No support tickets raised by customers.</p>
                    ) : (
                      adminTickets.map((t) => (
                        <div
                          key={t.id}
                          onClick={() => setEditingTicket(t)}
                          style={{
                            padding: "16px",
                            background: editingTicket?.id === t.id ? "rgba(15, 98, 254, 0.08)" : "rgba(255,255,255,0.01)",
                            border: `1px solid ${editingTicket?.id === t.id ? "#0f62fe" : "rgba(255,255,255,0.04)"}`,
                            borderRadius: "12px",
                            cursor: "pointer"
                          }}
                        >
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                            <div>
                              <strong style={{ fontSize: "0.95rem", color: "#fff" }}>{t.sub}</strong>
                              <span style={{ fontSize: "0.72rem", color: "#64748b", marginLeft: "12px" }}>ID: {t.id} • Cat: {t.cat}</span>
                            </div>
                            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                              <span style={{ padding: "3px 6px", borderRadius: "4px", fontSize: "0.68rem", fontWeight: 800, background: t.pri === "High" ? "rgba(239, 68, 68, 0.15)" : "rgba(255,255,255,0.05)", color: t.pri === "High" ? "#f87171" : "#cbd5e1" }}>{t.pri}</span>
                              <span style={{ padding: "3px 8px", borderRadius: "4px", fontSize: "0.7rem", fontWeight: 700, background: t.status === "Open" ? "rgba(234, 179, 8, 0.15)" : "rgba(34, 197, 94, 0.15)", color: t.status === "Open" ? "#facc15" : "#4ade80" }}>{t.status}</span>
                              <button
                                onClick={(e) => { e.stopPropagation(); handleDeleteTicket(t.id); }}
                                style={{ background: "none", border: "none", color: "#f87171", cursor: "pointer", padding: "2px", opacity: 0.7 }}
                                title="Delete this ticket"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                          <p style={{ margin: "0 0 10px 0", fontSize: "0.82rem", color: "#cbd5e1", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{t.desc}</p>
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "#64748b" }}>
                            <span>Raised by: <strong style={{ color: "#38bdf8" }}>{t.by || t.by_user}</strong> ({t.date})</span>
                            <button
                              onClick={(e) => { e.stopPropagation(); setSelectedCustomerEmail(t.by || t.by_user); setShowCustomerModal(true); }}
                              style={{ background: "rgba(15,98,254,0.1)", border: "1px solid rgba(15,98,254,0.2)", color: "#38bdf8", padding: "2px 8px", borderRadius: "4px", fontSize: "0.68rem", cursor: "pointer", fontWeight: 600 }}
                            >
                              View Profile
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Right Column: Ticket Management Form */}
                  <div style={{ background: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: "12px", padding: "20px" }}>
                    {editingTicket ? (
                      <div>
                        <h4 style={{ margin: "0 0 16px 0", fontSize: "1rem", color: "#fff" }}>Manage Support Ticket</h4>
                        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                          <div>
                            <span style={{ fontSize: "0.75rem", color: "#64748b" }}>SUBJECT</span>
                            <p style={{ margin: "4px 0 0 0", fontSize: "0.88rem", fontWeight: 700 }}>{editingTicket.sub}</p>
                          </div>
                          <div>
                            <span style={{ fontSize: "0.75rem", color: "#64748b" }}>RAISED BY</span>
                            <p style={{ margin: "4px 0 0 0", fontSize: "0.88rem", color: "#38bdf8" }}>{editingTicket.by || editingTicket.by_user}</p>
                          </div>
                          <div>
                            <span style={{ fontSize: "0.75rem", color: "#64748b" }}>DESCRIPTION</span>
                            <div style={{ background: "rgba(0,0,0,0.2)", padding: "10px", borderRadius: "6px", fontSize: "0.82rem", color: "#cbd5e1", marginTop: "4px", maxHeight: "100px", overflowY: "auto" }}>
                              {editingTicket.desc}
                            </div>
                          </div>
                          
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                            <div>
                              <label style={{ display: "block", fontSize: "0.75rem", color: "#64748b", fontWeight: 700, marginBottom: "6px" }}>STATUS</label>
                              <select
                                value={editingTicket.status}
                                onChange={(e) => setEditingTicket({ ...editingTicket, status: e.target.value })}
                                style={{ width: "100%", padding: "8px", borderRadius: "6px", background: "#080c14", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", fontSize: "0.82rem" }}
                              >
                                <option value="Open">Open</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Resolved">Resolved</option>
                              </select>
                            </div>
                            <div>
                              <label style={{ display: "block", fontSize: "0.75rem", color: "#64748b", fontWeight: 700, marginBottom: "6px" }}>PRIORITY</label>
                              <select
                                value={editingTicket.pri || editingTicket.priority}
                                onChange={(e) => setEditingTicket({ ...editingTicket, pri: e.target.value, priority: e.target.value })}
                                style={{ width: "100%", padding: "8px", borderRadius: "6px", background: "#080c14", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", fontSize: "0.82rem" }}
                              >
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                              </select>
                            </div>
                          </div>

                          <div>
                            <label style={{ display: "block", fontSize: "0.75rem", color: "#64748b", fontWeight: 700, marginBottom: "6px" }}>ASSIGNED STAFF</label>
                            <select
                              value={editingTicket.assignee}
                              onChange={(e) => setEditingTicket({ ...editingTicket, assignee: e.target.value })}
                              style={{ width: "100%", padding: "8px", borderRadius: "6px", background: "#080c14", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", fontSize: "0.82rem" }}
                            >
                              <option value="Engineering Support">Engineering Support</option>
                              <option value="HR Ops">HR Ops</option>
                              <option value="Arjun Sharma">Arjun Sharma</option>
                              <option value="Rohit Verma">Rohit Verma</option>
                              <option value="Priya Sharma">Priya Sharma</option>
                              <option value="Sneha Gupta">Sneha Gupta</option>
                            </select>
                          </div>

                          <div>
                            <label style={{ display: "block", fontSize: "0.75rem", color: "#64748b", fontWeight: 700, marginBottom: "6px" }}>RESOLUTION MESSAGE</label>
                            <textarea
                              rows={3}
                              placeholder="Type resolution steps..."
                              value={editingTicket.resolution || ""}
                              onChange={(e) => setEditingTicket({ ...editingTicket, resolution: e.target.value })}
                              style={{ width: "100%", padding: "10px", borderRadius: "6px", background: "#080c14", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", fontSize: "0.82rem", fontFamily: "inherit", resize: "none" }}
                            />
                          </div>

                          <div style={{ display: "flex", gap: "10px", marginTop: "4px" }}>
                            <button
                              onClick={() => handleUpdateTicket(editingTicket.id, {
                                status: editingTicket.status,
                                assignee: editingTicket.assignee,
                                priority: editingTicket.pri || editingTicket.priority,
                                resolution: editingTicket.resolution
                              })}
                              style={{ flex: 1, background: "#0f62fe", color: "#fff", border: "none", padding: "10px", borderRadius: "6px", cursor: "pointer", fontWeight: 600, fontSize: "0.82rem" }}
                            >
                              Save Changes
                            </button>
                            <button
                              onClick={() => setEditingTicket(null)}
                              style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "#94a3b8", padding: "10px 14px", borderRadius: "6px", cursor: "pointer", fontSize: "0.82rem" }}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div style={{ textAlign: "center", color: "#64748b", padding: "30px 0" }}>
                        <HelpCircle size={32} style={{ margin: "0 auto 12px auto", opacity: 0.5 }} />
                        <p style={{ margin: 0, fontSize: "0.82rem" }}>Select a ticket from the list to assign staff, update status, or write resolution logs.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 6: SCROLLING ANNOUNCEMENTS PANEL */}
        {activeTab === "announcements" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
              <div>
                <p style={{ margin: 0, fontSize: "0.9rem", color: "#38bdf8", fontWeight: 600 }}>TICKER CONTROL</p>
                <h1 style={{ margin: "4px 0 0 0", fontSize: "2rem", fontWeight: 700 }}>Scrolling Announcements ({announcements.length})</h1>
              </div>
              <button
                onClick={() => {
                  setEditingAnnouncement(null);
                  setAnnouncementForm({ message: "", active: true });
                  setShowAddAnnouncementModal(true);
                }}
                style={{
                  background: "#0f62fe",
                  color: "#fff",
                  border: "none",
                  padding: "12px 20px",
                  borderRadius: "10px",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px"
                }}
              >
                <Plus size={16} /> Publish Announcement
              </button>
            </div>

            {/* Announcements list table */}
            <div style={{ background: "#0f172a", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.05)", overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.05)", background: "rgba(255,255,255,0.02)" }}>
                    <th style={{ padding: "16px 20px", fontSize: "0.8rem", color: "#64748b", fontWeight: 700 }}>ANNOUNCEMENT MESSAGE (TICKER TEXT)</th>
                    <th style={{ padding: "16px 20px", fontSize: "0.8rem", color: "#64748b", fontWeight: 700 }}>STATUS</th>
                    <th style={{ padding: "16px 20px", fontSize: "0.8rem", color: "#64748b", fontWeight: 700 }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {announcements.length === 0 ? (
                    <tr>
                      <td colSpan={3} style={{ padding: "32px", textAlign: "center", color: "#64748b" }}>No announcements published. Scroll ticker will be hidden.</td>
                    </tr>
                  ) : (
                    announcements.map((ann) => (
                      <tr key={ann.id} style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.03)" }}>
                        <td style={{ padding: "20px", fontSize: "0.9rem", color: "#fff", maxWidth: "600px", lineHeight: 1.5 }}>
                          {ann.message}
                        </td>
                        <td style={{ padding: "20px" }}>
                          <span style={{
                            padding: "4px 10px",
                            borderRadius: "6px",
                            fontSize: "0.75rem",
                            fontWeight: 700,
                            background: ann.active ? "rgba(34, 197, 94, 0.15)" : "rgba(239, 68, 68, 0.15)",
                            color: ann.active ? "#4ade80" : "#f87171"
                          }}>{ann.active ? "Active" : "Inactive"}</span>
                        </td>
                        <td style={{ padding: "20px", display: "flex", gap: "12px", alignItems: "center" }}>
                          <button
                            onClick={() => {
                              setEditingAnnouncement(ann);
                              setAnnouncementForm({
                                message: ann.message,
                                active: ann.active
                              });
                              setShowAddAnnouncementModal(true);
                            }}
                            style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer" }}
                            title="Edit message"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleToggleAnnouncementActive(ann.id, ann.active)}
                            style={{
                              background: ann.active ? "rgba(239, 68, 68, 0.1)" : "rgba(34, 197, 94, 0.1)",
                              color: ann.active ? "#f87171" : "#4ade80",
                              border: `1px solid ${ann.active ? "rgba(239, 68, 68, 0.2)" : "rgba(34, 197, 94, 0.2)"}`,
                              padding: "6px 12px",
                              borderRadius: "6px",
                              fontSize: "0.8rem",
                              fontWeight: 600,
                              cursor: "pointer"
                            }}
                          >
                            {ann.active ? "Deactivate" : "Activate"}
                          </button>
                          <button
                            onClick={() => handleDeleteAnnouncement(ann.id)}
                            style={{ background: "none", border: "none", color: "#f87171", cursor: "pointer" }}
                            title="Delete announcement"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 7: CLIENTS CRM PORTFOLIO */}
        {activeTab === "clients" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
              <div>
                <p style={{ margin: 0, fontSize: "0.9rem", color: "#38bdf8", fontWeight: 600 }}>CLIENT MANAGEMENT CRM</p>
                <h1 style={{ margin: "4px 0 0 0", fontSize: "2rem", fontWeight: 700 }}>Clients Portfolio</h1>
              </div>
              <div style={{ display: "flex", gap: "12px" }}>
                <button
                  onClick={handleExportCSV}
                  style={{
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    color: "#fff",
                    padding: "12px 18px",
                    borderRadius: "10px",
                    fontWeight: 600,
                    fontSize: "0.88rem",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    transition: "all 0.2s"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
                >
                  <Download size={16} /> Export CSV
                </button>
                <button
                  onClick={() => {
                    setEditingClient(null);
                    setClientForm({ name: "", company_name: "", email: "", phone: "", address: "", gst_number: "", tax_details: "", notes: "", status: "Lead" });
                    setShowAddClientModal(true);
                  }}
                  style={{
                    background: "#0f62fe",
                    color: "#fff",
                    border: "none",
                    padding: "12px 20px",
                    borderRadius: "10px",
                    fontWeight: 600,
                    fontSize: "0.9rem",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    transition: "background 0.2s"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "#0052cc"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "#0f62fe"}
                >
                  <Plus size={16} /> Add New Client
                </button>
              </div>
            </div>

            {/* Pipeline stages summary counts */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
              gap: "16px",
              background: "#0f172a",
              padding: "20px",
              borderRadius: "16px",
              border: "1px solid rgba(255, 255, 255, 0.05)",
              marginBottom: "32px"
            }}>
              {[
                { label: "Total Clients", count: clients.length, color: "#38bdf8" },
                { label: "Leads / Prospects", count: clients.filter(c => ["Lead", "Interested", "Plan Selected"].includes(c.status)).length, color: "#facc15" },
                { label: "Payment Pending", count: clients.filter(c => c.status === "Payment Pending").length, color: "#f87171" },
                { label: "Onboarding & Active", count: clients.filter(c => ["Payment Received", "Proposal Sent", "Agreement Signed", "Project Active"].includes(c.status)).length, color: "#4ade80" },
                { label: "Completed", count: clients.filter(c => c.status === "Project Completed").length, color: "#a855f7" }
              ].map(item => (
                <div key={item.label} style={{ borderRight: "1px solid rgba(255, 255, 255, 0.05)", paddingRight: "10px" }}>
                  <p style={{ margin: 0, fontSize: "0.75rem", color: "#64748b", fontWeight: 700, textTransform: "uppercase" }}>{item.label}</p>
                  <h3 style={{ margin: "6px 0 0 0", fontSize: "1.5rem", fontWeight: 700, color: item.color }}>{item.count}</h3>
                </div>
              ))}
            </div>

            {/* Filter and Search Bar */}
            <div style={{
              display: "flex",
              gap: "16px",
              background: "#0f172a",
              padding: "16px",
              borderRadius: "12px",
              border: "1px solid rgba(255, 255, 255, 0.05)",
              marginBottom: "24px"
            }}>
              <div style={{ position: "relative", flex: 1 }}>
                <Search size={18} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#64748b" }} />
                <input
                  type="text"
                  placeholder="Search clients by name, email, company or phone..."
                  value={clientSearch}
                  onChange={(e) => setClientSearch(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 12px 10px 40px",
                    borderRadius: "8px",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    background: "rgba(255,255,255,0.02)",
                    color: "#fff",
                    outline: "none",
                    boxSizing: "border-box"
                  }}
                />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Filter size={16} style={{ color: "#64748b" }} />
                <select
                  value={clientStatusFilter}
                  onChange={(e) => setClientStatusFilter(e.target.value)}
                  style={{
                    padding: "10px 14px",
                    borderRadius: "8px",
                    background: "#0f172a",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    color: "#fff",
                    cursor: "pointer",
                    outline: "none"
                  }}
                >
                  <option value="All">All Statuses</option>
                  <option value="Lead">Lead</option>
                  <option value="Interested">Interested</option>
                  <option value="Plan Selected">Plan Selected</option>
                  <option value="Payment Pending">Payment Pending</option>
                  <option value="Payment Received">Payment Received</option>
                  <option value="Proposal Sent">Proposal Sent</option>
                  <option value="Agreement Signed">Agreement Signed</option>
                  <option value="Project Active">Project Active</option>
                  <option value="Project Completed">Project Completed</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </div>
            </div>

            {/* Clients Table */}
            <div style={{ background: "#0f172a", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.05)", overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.05)", background: "rgba(255,255,255,0.02)" }}>
                    <th style={{ padding: "16px 20px", fontSize: "0.8rem", color: "#64748b", fontWeight: 700 }}>CLIENT</th>
                    <th style={{ padding: "16px 20px", fontSize: "0.8rem", color: "#64748b", fontWeight: 700 }}>COMPANY</th>
                    <th style={{ padding: "16px 20px", fontSize: "0.8rem", color: "#64748b", fontWeight: 700 }}>CRM STATUS</th>
                    <th style={{ padding: "16px 20px", fontSize: "0.8rem", color: "#64748b", fontWeight: 700 }}>ACTIVE PLAN</th>
                    <th style={{ padding: "16px 20px", fontSize: "0.8rem", color: "#64748b", fontWeight: 700 }}>TOTAL PAID</th>
                    <th style={{ padding: "16px 20px", fontSize: "0.8rem", color: "#64748b", fontWeight: 700 }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {clients.filter(c => {
                    const term = clientSearch.toLowerCase();
                    const matchesSearch = c.name.toLowerCase().includes(term) ||
                                         (c.company_name && c.company_name.toLowerCase().includes(term)) ||
                                         c.email.toLowerCase().includes(term) ||
                                         (c.phone && c.phone.toLowerCase().includes(term));
                    const matchesFilter = clientStatusFilter === "All" || c.status === clientStatusFilter;
                    return matchesSearch && matchesFilter;
                  }).length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ padding: "32px", textAlign: "center", color: "#64748b" }}>No clients found matching query criteria.</td>
                    </tr>
                  ) : (
                    clients.filter(c => {
                      const term = clientSearch.toLowerCase();
                      const matchesSearch = c.name.toLowerCase().includes(term) ||
                                           (c.company_name && c.company_name.toLowerCase().includes(term)) ||
                                           c.email.toLowerCase().includes(term) ||
                                           (c.phone && c.phone.toLowerCase().includes(term));
                      const matchesFilter = clientStatusFilter === "All" || c.status === clientStatusFilter;
                      return matchesSearch && matchesFilter;
                    }).map((client) => {
                      const statusColor = 
                        client.status === "Project Completed" ? "#c084fc" :
                        ["Payment Received", "Agreement Signed", "Project Active"].includes(client.status) ? "#4ade80" :
                        client.status === "Suspended" ? "#f87171" :
                        ["Interested", "Plan Selected", "Proposal Sent"].includes(client.status) ? "#fb7185" : "#facc15";

                      const statusBg = 
                        client.status === "Project Completed" ? "rgba(168, 85, 247, 0.15)" :
                        ["Payment Received", "Agreement Signed", "Project Active"].includes(client.status) ? "rgba(34, 197, 94, 0.15)" :
                        client.status === "Suspended" ? "rgba(239, 68, 68, 0.15)" :
                        ["Interested", "Plan Selected", "Proposal Sent"].includes(client.status) ? "rgba(244, 63, 94, 0.15)" : "rgba(234, 179, 8, 0.15)";

                      return (
                        <tr key={client.id} style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.03)" }}>
                          <td style={{ padding: "16px 20px" }}>
                            <button
                              onClick={() => {
                                setSelectedClient(client);
                                setClientProfileTab("overview");
                                setShowClientModal(true);
                              }}
                              style={{
                                background: "none",
                                border: "none",
                                padding: 0,
                                textAlign: "left",
                                cursor: "pointer",
                                outline: "none"
                              }}
                            >
                              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                <div style={{
                                  width: "32px",
                                  height: "32px",
                                  borderRadius: "50%",
                                  background: "linear-gradient(135deg, #0f62fe, #38bdf8)",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontSize: "0.8rem",
                                  fontWeight: 700,
                                  color: "#fff"
                                }}>
                                  {client.name.split(" ").map(p=>p[0]).join("").slice(0, 2).toUpperCase()}
                                </div>
                                <div>
                                  <p style={{ margin: 0, fontSize: "0.9rem", fontWeight: 700, color: "#38bdf8", textDecoration: "underline" }}>{client.name}</p>
                                  <span style={{ fontSize: "0.75rem", color: "#64748b" }}>{client.email}</span>
                                </div>
                              </div>
                            </button>
                          </td>
                          <td style={{ padding: "16px 20px", fontSize: "0.88rem", color: "#cbd5e1" }}>
                            {client.company_name || "Individual"}
                          </td>
                          <td style={{ padding: "16px 20px" }}>
                            <span style={{
                              padding: "4px 8px",
                              borderRadius: "4px",
                              fontSize: "0.75rem",
                              fontWeight: 700,
                              background: statusBg,
                              color: statusColor
                            }}>{client.status}</span>
                          </td>
                          <td style={{ padding: "16px 20px", fontSize: "0.85rem", color: client.plan_name ? "#fff" : "#64748b" }}>
                            {client.plan_name || "No Plan Selected"}
                          </td>
                          <td style={{ padding: "16px 20px", fontSize: "0.9rem", color: "#22c55e", fontWeight: 800 }}>
                            ₹{(client.totalPaid || 0).toLocaleString("en-IN")}
                          </td>
                          <td style={{ padding: "16px 20px" }}>
                            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                              <button
                                onClick={() => handleClientQuickAction("overview", client)}
                                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "6px", color: "#cbd5e1", width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.2s" }}
                                title="View Profile"
                                onMouseEnter={(e)=>e.currentTarget.style.background="rgba(255,255,255,0.08)"}
                                onMouseLeave={(e)=>e.currentTarget.style.background="rgba(255,255,255,0.03)"}
                              >
                                <UserCheck size={14} />
                              </button>
                              <button
                                onClick={() => handleClientQuickAction("email", client)}
                                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "6px", color: "#cbd5e1", width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.2s" }}
                                title="Send Email"
                                onMouseEnter={(e)=>e.currentTarget.style.background="rgba(255,255,255,0.08)"}
                                onMouseLeave={(e)=>e.currentTarget.style.background="rgba(255,255,255,0.03)"}
                              >
                                <Send size={14} />
                              </button>
                              <button
                                onClick={() => {
                                  setEditingClient(client);
                                  setClientForm({
                                    name: client.name,
                                    company_name: client.company_name || "",
                                    email: client.email,
                                    phone: client.phone || "",
                                    address: client.address || "",
                                    gst_number: client.gst_number || "",
                                    tax_details: client.tax_details || "",
                                    notes: client.notes || "",
                                    status: client.status
                                  });
                                  setShowAddClientModal(true);
                                }}
                                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "6px", color: "#cbd5e1", width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.2s" }}
                                title="Edit Client"
                                onMouseEnter={(e)=>e.currentTarget.style.background="rgba(255,255,255,0.08)"}
                                onMouseLeave={(e)=>e.currentTarget.style.background="rgba(255,255,255,0.03)"}
                              >
                                <Edit size={14} />
                              </button>
                              <button
                                onClick={() => handleSuspendClient(client.id, client.status)}
                                style={{
                                  background: client.status === "Suspended" ? "rgba(34, 197, 94, 0.1)" : "rgba(239, 68, 68, 0.1)",
                                  border: `1px solid ${client.status === "Suspended" ? "rgba(34, 197, 94, 0.2)" : "rgba(239, 68, 68, 0.2)"}`,
                                  color: client.status === "Suspended" ? "#4ade80" : "#f87171",
                                  padding: "6px 10px",
                                  borderRadius: "6px",
                                  fontSize: "0.75rem",
                                  fontWeight: 600,
                                  cursor: "pointer",
                                  transition: "all 0.2s"
                                }}
                              >
                                {client.status === "Suspended" ? "Activate" : "Suspend"}
                              </button>
                              <button
                                onClick={() => handleDeleteClient(client.id)}
                                style={{ background: "none", border: "none", color: "#f87171", cursor: "pointer" }}
                                title="Delete Client"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* 3. MODAL: ADD LEAD / OFFLINE ENQUIRY */}
      {showAddLeadModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0,0,0,0.6)",
          backdropFilter: "blur(4px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000
        }}>
          <div style={{
            background: "#0f172a",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "16px",
            width: "100%",
            maxWidth: "540px",
            padding: "32px",
            boxShadow: "0 24px 48px rgba(0,0,0,0.5)",
            boxSizing: "border-box"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <h3 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 700, color: "#fff" }}>Add New Inquiry / CRM Lead</h3>
              <button onClick={() => setShowAddLeadModal(false)} style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer" }}><X size={20} /></button>
            </div>

            <form onSubmit={handleAddLeadSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#94a3b8", marginBottom: "6px" }}>Client Name *</label>
                  <input
                    type="text"
                    required
                    value={leadForm.name}
                    onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
                    style={{ width: "100%", padding: "10px", borderRadius: "6px", background: "#080c14", border: "1px solid rgba(255,255,255,0.08)", color: "#fff" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#94a3b8", marginBottom: "6px" }}>Email *</label>
                  <input
                    type="email"
                    required
                    value={leadForm.email}
                    onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })}
                    style={{ width: "100%", padding: "10px", borderRadius: "6px", background: "#080c14", border: "1px solid rgba(255,255,255,0.08)", color: "#fff" }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#94a3b8", marginBottom: "6px" }}>Phone</label>
                  <input
                    type="text"
                    value={leadForm.phone}
                    onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })}
                    style={{ width: "100%", padding: "10px", borderRadius: "6px", background: "#080c14", border: "1px solid rgba(255,255,255,0.08)", color: "#fff" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#94a3b8", marginBottom: "6px" }}>Requested Service</label>
                  <select
                    value={leadForm.service}
                    onChange={(e) => setLeadForm({ ...leadForm, service: e.target.value })}
                    style={{ width: "100%", padding: "10px", borderRadius: "6px", background: "#080c14", border: "1px solid rgba(255,255,255,0.08)", color: "#fff", cursor: "pointer" }}
                  >
                    <option value="Custom App Development">Custom App Development</option>
                    <option value="Custom Web Development">Custom Web Development</option>
                    <option value="ERP Software">ERP Software</option>
                    <option value="Educational Websites & Portals">Educational Websites & Portals</option>
                    <option value="IT Maintenance & Support">IT Maintenance & Support</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#94a3b8", marginBottom: "6px" }}>Estimated Budget</label>
                  <select
                    value={leadForm.budget}
                    onChange={(e) => setLeadForm({ ...leadForm, budget: e.target.value })}
                    style={{ width: "100%", padding: "10px", borderRadius: "6px", background: "#080c14", border: "1px solid rgba(255,255,255,0.08)", color: "#fff", cursor: "pointer" }}
                  >
                    <option value="10k">₹10,000</option>
                    <option value="20k">₹20,000</option>
                    <option value="30k">₹30,000</option>
                    <option value="50k">₹50,000</option>
                    <option value="70k">₹70,000</option>
                    <option value="90k">₹90,000</option>
                    <option value="1L - 3L">₹1 Lakh - 3 Lakhs</option>
                    <option value="3L - 5L">₹3 Lakhs - 5 Lakhs</option>
                    <option value="5L - 10L">₹5 Lakhs - 10 Lakhs</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#94a3b8", marginBottom: "6px" }}>Funnel Stage</label>
                  <select
                    value={leadForm.stage}
                    onChange={(e) => setLeadForm({ ...leadForm, stage: e.target.value })}
                    style={{ width: "100%", padding: "10px", borderRadius: "6px", background: "#080c14", border: "1px solid rgba(255,255,255,0.08)", color: "#fff", cursor: "pointer" }}
                  >
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Proposal Sent">Proposal Sent</option>
                    <option value="Closed Won">Closed Won</option>
                    <option value="Closed Lost">Closed Lost</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#94a3b8", marginBottom: "6px" }}>Inquiry Details / Message</label>
                <textarea
                  rows={3}
                  value={leadForm.message}
                  onChange={(e) => setLeadForm({ ...leadForm, message: e.target.value })}
                  style={{ width: "100%", padding: "10px", borderRadius: "6px", background: "#080c14", border: "1px solid rgba(255,255,255,0.08)", color: "#fff", fontFamily: "inherit" }}
                />
              </div>

              <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", marginTop: "12px" }}>
                <button type="button" onClick={() => setShowAddLeadModal(false)} style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "#cbd5e1", padding: "10px 20px", borderRadius: "6px", cursor: "pointer" }}>Cancel</button>
                <button type="submit" style={{ background: "#0f62fe", border: "none", color: "#fff", padding: "10px 20px", borderRadius: "6px", cursor: "pointer", fontWeight: 600 }}>Save Lead</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. MODAL: ADD / EDIT JOB LISTING */}
      {showAddJobModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0,0,0,0.6)",
          backdropFilter: "blur(4px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000
        }}>
          <div style={{
            background: "#0f172a",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "16px",
            width: "100%",
            maxWidth: "580px",
            padding: "32px",
            boxShadow: "0 24px 48px rgba(0,0,0,0.5)",
            boxSizing: "border-box"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <h3 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 700, color: "#fff" }}>
                {editingJob ? "Edit Job Listing" : "Create Career Listing"}
              </h3>
              <button
                onClick={() => {
                  setShowAddJobModal(false);
                  setEditingJob(null);
                }}
                style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer" }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={async (e) => {
              e.preventDefault();
              if (editingJob) {
                // PATCH update
                const reqsArray = jobForm.requirements
                  ? jobForm.requirements.split("\n").map((r) => r.trim()).filter(Boolean)
                  : [];
                try {
                  const res = await fetch(`/api/admin/careers/${editingJob.id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      ...jobForm,
                      requirements: reqsArray
                    })
                  });
                  if (res.ok) {
                    setShowAddJobModal(false);
                    setEditingJob(null);
                    fetchDashboardData();
                  }
                } catch (err) {
                  console.error(err);
                }
              } else {
                handleAddJobSubmit(e);
              }
            }} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#94a3b8", marginBottom: "6px" }}>Job Title *</label>
                  <input
                    type="text"
                    required
                    value={jobForm.title}
                    onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                    style={{ width: "100%", padding: "10px", borderRadius: "6px", background: "#080c14", border: "1px solid rgba(255,255,255,0.08)", color: "#fff" }}
                  />
                </div>
                
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#94a3b8", marginBottom: "6px" }}>Department *</label>
                  <select
                    value={jobForm.dept}
                    onChange={(e) => setJobForm({ ...jobForm, dept: e.target.value })}
                    style={{ width: "100%", padding: "10px", borderRadius: "6px", background: "#080c14", border: "1px solid rgba(255,255,255,0.08)", color: "#fff", cursor: "pointer" }}
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Design">Design</option>
                    <option value="Product">Product</option>
                    <option value="Sales">Sales</option>
                    <option value="Human Resources">Human Resources</option>
                    <option value="Infrastructure">Infrastructure</option>
                    <option value="Analytics">Analytics</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#94a3b8", marginBottom: "6px" }}>Job Type</label>
                  <select
                    value={jobForm.type}
                    onChange={(e) => setJobForm({ ...jobForm, type: e.target.value })}
                    style={{ width: "100%", padding: "10px", borderRadius: "6px", background: "#080c14", border: "1px solid rgba(255,255,255,0.08)", color: "#fff", cursor: "pointer" }}
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Remote">Remote</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#94a3b8", marginBottom: "6px" }}>Location</label>
                  <input
                    type="text"
                    value={jobForm.loc}
                    onChange={(e) => setJobForm({ ...jobForm, loc: e.target.value })}
                    style={{ width: "100%", padding: "10px", borderRadius: "6px", background: "#080c14", border: "1px solid rgba(255,255,255,0.08)", color: "#fff" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#94a3b8", marginBottom: "6px" }}>Open Positions</label>
                  <input
                    type="number"
                    value={jobForm.open}
                    onChange={(e) => setJobForm({ ...jobForm, open: e.target.value })}
                    style={{ width: "100%", padding: "10px", borderRadius: "6px", background: "#080c14", border: "1px solid rgba(255,255,255,0.08)", color: "#fff" }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#94a3b8", marginBottom: "6px" }}>Job Description</label>
                <textarea
                  rows={3}
                  value={jobForm.description}
                  onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                  style={{ width: "100%", padding: "10px", borderRadius: "6px", background: "#080c14", border: "1px solid rgba(255,255,255,0.08)", color: "#fff", fontFamily: "inherit" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#94a3b8", marginBottom: "6px" }}>Requirements (one per line)</label>
                <textarea
                  rows={3}
                  placeholder="e.g. 5+ years experience&#10;React / NextJS expert&#10;Figma design systems"
                  value={jobForm.requirements}
                  onChange={(e) => setJobForm({ ...jobForm, requirements: e.target.value })}
                  style={{ width: "100%", padding: "10px", borderRadius: "6px", background: "#080c14", border: "1px solid rgba(255,255,255,0.08)", color: "#fff", fontFamily: "inherit" }}
                />
              </div>

              <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", marginTop: "12px" }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddJobModal(false);
                    setEditingJob(null);
                  }}
                  style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "#cbd5e1", padding: "10px 20px", borderRadius: "6px", cursor: "pointer" }}
                >
                  Cancel
                </button>
                <button type="submit" style={{ background: "#0f62fe", border: "none", color: "#fff", padding: "10px 20px", borderRadius: "6px", cursor: "pointer", fontWeight: 600 }}>
                  {editingJob ? "Save Changes" : "Post Job"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. MODAL: ADD / EDIT PRICING PLAN */}
      {showAddPlanModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0,0,0,0.6)",
          backdropFilter: "blur(4px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000
        }}>
          <div style={{
            background: "#0f172a",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "16px",
            width: "100%",
            maxWidth: "580px",
            padding: "32px",
            boxShadow: "0 24px 48px rgba(0,0,0,0.5)",
            boxSizing: "border-box"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <h3 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 700, color: "#fff" }}>
                {editingPlan ? "Edit Pricing Plan" : "Create Pricing Plan"}
              </h3>
              <button
                onClick={() => {
                  setShowAddPlanModal(false);
                  setEditingPlan(null);
                }}
                style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer" }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handlePlanFormSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#94a3b8", marginBottom: "6px" }}>Plan ID (Unique Slug) *</label>
                  <input
                    type="text"
                    required
                    disabled={!!editingPlan}
                    value={planForm.id}
                    onChange={(e) => setPlanForm({ ...planForm, id: e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, "") })}
                    placeholder="e.g. basic, custom-app"
                    style={{ width: "100%", padding: "10px", borderRadius: "6px", background: "#080c14", border: "1px solid rgba(255,255,255,0.08)", color: "#fff" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#94a3b8", marginBottom: "6px" }}>Plan Name *</label>
                  <input
                    type="text"
                    required
                    value={planForm.name}
                    onChange={(e) => setPlanForm({ ...planForm, name: e.target.value })}
                    placeholder="e.g. E-Commerce Website"
                    style={{ width: "100%", padding: "10px", borderRadius: "6px", background: "#080c14", border: "1px solid rgba(255,255,255,0.08)", color: "#fff" }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#94a3b8", marginBottom: "6px" }}>Price Range/Value *</label>
                  <input
                    type="text"
                    required
                    value={planForm.price}
                    onChange={(e) => setPlanForm({ ...planForm, price: e.target.value })}
                    placeholder="e.g. ₹50,000–₹2,00,000+"
                    style={{ width: "100%", padding: "10px", borderRadius: "6px", background: "#080c14", border: "1px solid rgba(255,255,255,0.08)", color: "#fff" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#94a3b8", marginBottom: "6px" }}>Billing Cycle</label>
                  <select
                    value={planForm.billing_cycle}
                    onChange={(e) => setPlanForm({ ...planForm, billing_cycle: e.target.value })}
                    style={{ width: "100%", padding: "10px", borderRadius: "6px", background: "#080c14", border: "1px solid rgba(255,255,255,0.08)", color: "#fff", cursor: "pointer" }}
                  >
                    <option value="one-time">One-Time Billing</option>
                    <option value="monthly">Monthly Cycle</option>
                    <option value="yearly">Yearly Cycle</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#94a3b8", marginBottom: "6px" }}>Free Trial Days</label>
                  <input
                    type="number"
                    value={planForm.free_trial_days}
                    onChange={(e) => setPlanForm({ ...planForm, free_trial_days: e.target.value })}
                    style={{ width: "100%", padding: "10px", borderRadius: "6px", background: "#080c14", border: "1px solid rgba(255,255,255,0.08)", color: "#fff" }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#94a3b8", marginBottom: "8px" }}>Feature Matrix Config</label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", background: "rgba(255,255,255,0.02)", padding: "16px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.04)" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.75rem", color: "#64748b", marginBottom: "4px" }}>Pages Limit</label>
                    <input
                      type="text"
                      value={planForm.features?.pages || ""}
                      onChange={(e) => setPlanForm({ ...planForm, features: { ...planForm.features, pages: e.target.value } })}
                      style={{ width: "100%", padding: "8px", borderRadius: "4px", background: "#080c14", border: "1px solid rgba(255,255,255,0.06)", color: "#fff", fontSize: "0.8rem" }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.75rem", color: "#64748b", marginBottom: "4px" }}>Responsive Design</label>
                    <select
                      value={planForm.features?.responsive || "✓"}
                      onChange={(e) => setPlanForm({ ...planForm, features: { ...planForm.features, responsive: e.target.value } })}
                      style={{ width: "100%", padding: "8px", borderRadius: "4px", background: "#080c14", border: "1px solid rgba(255,255,255,0.06)", color: "#fff", fontSize: "0.8rem" }}
                    >
                      <option value="✓">✓ Yes</option>
                      <option value="✗">✗ No</option>
                      <option value="Optional">Optional</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.75rem", color: "#64748b", marginBottom: "4px" }}>SEO Setup</label>
                    <input
                      type="text"
                      value={planForm.features?.seoSetup || ""}
                      onChange={(e) => setPlanForm({ ...planForm, features: { ...planForm.features, seoSetup: e.target.value } })}
                      style={{ width: "100%", padding: "8px", borderRadius: "4px", background: "#080c14", border: "1px solid rgba(255,255,255,0.06)", color: "#fff", fontSize: "0.8rem" }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.75rem", color: "#64748b", marginBottom: "4px" }}>CMS/Admin Panel</label>
                    <select
                      value={planForm.features?.cmsPanel || "✗"}
                      onChange={(e) => setPlanForm({ ...planForm, features: { ...planForm.features, cmsPanel: e.target.value } })}
                      style={{ width: "100%", padding: "8px", borderRadius: "4px", background: "#080c14", border: "1px solid rgba(255,255,255,0.06)", color: "#fff", fontSize: "0.8rem" }}
                    >
                      <option value="✓">✓ Yes</option>
                      <option value="✗">✗ No</option>
                      <option value="Optional">Optional</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.75rem", color: "#64748b", marginBottom: "4px" }}>Payment Gateway</label>
                    <select
                      value={planForm.features?.paymentGateway || "✗"}
                      onChange={(e) => setPlanForm({ ...planForm, features: { ...planForm.features, paymentGateway: e.target.value } })}
                      style={{ width: "100%", padding: "8px", borderRadius: "4px", background: "#080c14", border: "1px solid rgba(255,255,255,0.06)", color: "#fff", fontSize: "0.8rem" }}
                    >
                      <option value="✓">✓ Yes</option>
                      <option value="✗">✗ No</option>
                      <option value="Optional">Optional</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.75rem", color: "#64748b", marginBottom: "4px" }}>Support Duration</label>
                    <input
                      type="text"
                      value={planForm.features?.support || ""}
                      onChange={(e) => setPlanForm({ ...planForm, features: { ...planForm.features, support: e.target.value } })}
                      style={{ width: "100%", padding: "8px", borderRadius: "4px", background: "#080c14", border: "1px solid rgba(255,255,255,0.06)", color: "#fff", fontSize: "0.8rem" }}
                    />
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", marginTop: "12px" }}>
                <button type="button" onClick={() => { setShowAddPlanModal(false); setEditingPlan(null); }} style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "#cbd5e1", padding: "10px 20px", borderRadius: "6px", cursor: "pointer" }}>Cancel</button>
                <button type="submit" style={{ background: "#0f62fe", border: "none", color: "#fff", padding: "10px 20px", borderRadius: "6px", cursor: "pointer", fontWeight: 600 }}>
                  {editingPlan ? "Save Plan" : "Create Plan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. MODAL: ADD / EDIT PROMO CODE */}
      {showAddPromoModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0,0,0,0.6)",
          backdropFilter: "blur(4px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000
        }}>
          <div style={{
            background: "#0f172a",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "16px",
            width: "100%",
            maxWidth: "480px",
            padding: "32px",
            boxShadow: "0 24px 48px rgba(0,0,0,0.5)",
            boxSizing: "border-box"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <h3 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 700, color: "#fff" }}>
                {editingPromo ? "Edit Promo Code" : "Create Promo Code"}
              </h3>
              <button
                onClick={() => {
                  setShowAddPromoModal(false);
                  setEditingPromo(null);
                }}
                style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer" }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handlePromoFormSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#94a3b8", marginBottom: "6px" }}>Promo Code (UPPERCASE) *</label>
                <input
                  type="text"
                  required
                  value={promoForm.code}
                  onChange={(e) => setPromoForm({ ...promoForm, code: e.target.value.toUpperCase().trim() })}
                  placeholder="e.g. MONSOON30"
                  style={{ width: "100%", padding: "10px", borderRadius: "6px", background: "#080c14", border: "1px solid rgba(255,255,255,0.08)", color: "#fff" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#94a3b8", marginBottom: "6px" }}>Discount Type</label>
                  <select
                    value={promoForm.discount_type}
                    onChange={(e) => setPromoForm({ ...promoForm, discount_type: e.target.value })}
                    style={{ width: "100%", padding: "10px", borderRadius: "6px", background: "#080c14", border: "1px solid rgba(255,255,255,0.08)", color: "#fff", cursor: "pointer" }}
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Flat (₹)</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#94a3b8", marginBottom: "6px" }}>Discount Value *</label>
                  <input
                    type="number"
                    required
                    value={promoForm.discount_value}
                    onChange={(e) => setPromoForm({ ...promoForm, discount_value: e.target.value })}
                    style={{ width: "100%", padding: "10px", borderRadius: "6px", background: "#080c14", border: "1px solid rgba(255,255,255,0.08)", color: "#fff" }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#94a3b8", marginBottom: "6px" }}>Expiry Date</label>
                  <input
                    type="date"
                    value={promoForm.expiry_date}
                    onChange={(e) => setPromoForm({ ...promoForm, expiry_date: e.target.value })}
                    style={{ width: "100%", padding: "10px", borderRadius: "6px", background: "#080c14", border: "1px solid rgba(255,255,255,0.08)", color: "#fff" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#94a3b8", marginBottom: "6px" }}>Status</label>
                  <select
                    value={promoForm.active ? "true" : "false"}
                    onChange={(e) => setPromoForm({ ...promoForm, active: e.target.value === "true" })}
                    style={{ width: "100%", padding: "10px", borderRadius: "6px", background: "#080c14", border: "1px solid rgba(255,255,255,0.08)", color: "#fff", cursor: "pointer" }}
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", marginTop: "12px" }}>
                <button type="button" onClick={() => { setShowAddPromoModal(false); setEditingPromo(null); }} style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "#cbd5e1", padding: "10px 20px", borderRadius: "6px", cursor: "pointer" }}>Cancel</button>
                <button type="submit" style={{ background: "#0f62fe", border: "none", color: "#fff", padding: "10px 20px", borderRadius: "6px", cursor: "pointer", fontWeight: 600 }}>
                  {editingPromo ? "Save Promo" : "Create Promo"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. MODAL: ADD / EDIT SUBSCRIPTION */}
      {showAddSubscriptionModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0,0,0,0.6)",
          backdropFilter: "blur(4px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000
        }}>
          <div style={{
            background: "#0f172a",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "16px",
            width: "100%",
            maxWidth: "540px",
            padding: "32px",
            boxShadow: "0 24px 48px rgba(0,0,0,0.5)",
            boxSizing: "border-box"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <h3 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 700, color: "#fff" }}>
                {editingSubscription ? "Edit Subscription" : "Log New Subscriber Plan"}
              </h3>
              <button
                onClick={() => {
                  setShowAddSubscriptionModal(false);
                  setEditingSubscription(null);
                }}
                style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer" }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubscriptionFormSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#94a3b8", marginBottom: "6px" }}>Customer Name *</label>
                  <input
                    type="text"
                    required
                    value={subscriptionForm.customer_name}
                    onChange={(e) => setSubscriptionForm({ ...subscriptionForm, customer_name: e.target.value })}
                    placeholder="e.g. Vision Academy"
                    style={{ width: "100%", padding: "10px", borderRadius: "6px", background: "#080c14", border: "1px solid rgba(255,255,255,0.08)", color: "#fff" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#94a3b8", marginBottom: "6px" }}>Customer Email *</label>
                  <input
                    type="email"
                    required
                    value={subscriptionForm.customer_email}
                    onChange={(e) => setSubscriptionForm({ ...subscriptionForm, customer_email: e.target.value })}
                    placeholder="e.g. contact@visionacademy.in"
                    style={{ width: "100%", padding: "10px", borderRadius: "6px", background: "#080c14", border: "1px solid rgba(255,255,255,0.08)", color: "#fff" }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#94a3b8", marginBottom: "6px" }}>Select Pricing Plan *</label>
                  <select
                    value={subscriptionForm.plan_id}
                    onChange={(e) => setSubscriptionForm({ ...subscriptionForm, plan_id: e.target.value })}
                    style={{ width: "100%", padding: "10px", borderRadius: "6px", background: "#080c14", border: "1px solid rgba(255,255,255,0.08)", color: "#fff", cursor: "pointer" }}
                  >
                    {plans.map(p => (
                      <option key={p.id} value={p.id}>{p.name} ({p.price})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#94a3b8", marginBottom: "6px" }}>Billing Cycle</label>
                  <select
                    value={subscriptionForm.billing_cycle}
                    onChange={(e) => setSubscriptionForm({ ...subscriptionForm, billing_cycle: e.target.value })}
                    style={{ width: "100%", padding: "10px", borderRadius: "6px", background: "#080c14", border: "1px solid rgba(255,255,255,0.08)", color: "#fff", cursor: "pointer" }}
                  >
                    <option value="one-time">One-Time Project Price</option>
                    <option value="monthly">Monthly Recurring</option>
                    <option value="yearly">Yearly Recurring</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#94a3b8", marginBottom: "6px" }}>Subscription Status</label>
                  <select
                    value={subscriptionForm.status}
                    onChange={(e) => setSubscriptionForm({ ...subscriptionForm, status: e.target.value })}
                    style={{ width: "100%", padding: "10px", borderRadius: "6px", background: "#080c14", border: "1px solid rgba(255,255,255,0.08)", color: "#fff", cursor: "pointer" }}
                  >
                    <option value="active">Active Subscriber</option>
                    <option value="trial">Free Trial Period</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#94a3b8", marginBottom: "6px" }}>Start Date</label>
                  <input
                    type="date"
                    value={subscriptionForm.start_date}
                    onChange={(e) => setSubscriptionForm({ ...subscriptionForm, start_date: e.target.value })}
                    style={{ width: "100%", padding: "10px", borderRadius: "6px", background: "#080c14", border: "1px solid rgba(255,255,255,0.08)", color: "#fff" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#94a3b8", marginBottom: "6px" }}>Trial End Date</label>
                  <input
                    type="date"
                    disabled={subscriptionForm.status !== "trial"}
                    value={subscriptionForm.trial_end_date}
                    onChange={(e) => setSubscriptionForm({ ...subscriptionForm, trial_end_date: e.target.value })}
                    style={{ width: "100%", padding: "10px", borderRadius: "6px", background: "#080c14", border: "1px solid rgba(255,255,255,0.08)", color: "#fff" }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#94a3b8", marginBottom: "6px" }}>Applied Promo Code (Optional)</label>
                <select
                  value={subscriptionForm.promo_code}
                  onChange={(e) => setSubscriptionForm({ ...subscriptionForm, promo_code: e.target.value })}
                  style={{ width: "100%", padding: "10px", borderRadius: "6px", background: "#080c14", border: "1px solid rgba(255,255,255,0.08)", color: "#fff", cursor: "pointer" }}
                >
                  <option value="">No promo code applied</option>
                  {promoCodes.filter(pr => pr.active).map(pr => (
                    <option key={pr.id} value={pr.code}>{pr.code} ({pr.discount_type === "percentage" ? `${pr.discount_value}%` : `₹${pr.discount_value}`})</option>
                  ))}
                </select>
              </div>

              <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", marginTop: "12px" }}>
                <button type="button" onClick={() => { setShowAddSubscriptionModal(false); setEditingSubscription(null); }} style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "#cbd5e1", padding: "10px 20px", borderRadius: "6px", cursor: "pointer" }}>Cancel</button>
                <button type="submit" style={{ background: "#0f62fe", border: "none", color: "#fff", padding: "10px 20px", borderRadius: "6px", cursor: "pointer", fontWeight: 600 }}>
                  {editingSubscription ? "Save Sub" : "Save Subscriber"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 8. MODAL: LOG TRANSACTION PAYMENT */}
      {showAddPaymentModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0,0,0,0.6)",
          backdropFilter: "blur(4px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000
        }}>
          <div style={{
            background: "#0f172a",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "16px",
            width: "100%",
            maxWidth: "480px",
            padding: "32px",
            boxShadow: "0 24px 48px rgba(0,0,0,0.5)",
            boxSizing: "border-box"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <h3 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 700, color: "#fff" }}>Log Received Payment</h3>
              <button onClick={() => setShowAddPaymentModal(false)} style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer" }}><X size={20} /></button>
            </div>

            <form onSubmit={handlePaymentFormSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#94a3b8", marginBottom: "6px" }}>Customer Subscription *</label>
                <select
                  value={paymentForm.subscription_id}
                  onChange={(e) => setPaymentForm({ ...paymentForm, subscription_id: e.target.value })}
                  style={{ width: "100%", padding: "10px", borderRadius: "6px", background: "#080c14", border: "1px solid rgba(255,255,255,0.08)", color: "#fff", cursor: "pointer" }}
                >
                  {subscriptions.map(s => (
                    <option key={s.id} value={s.id}>{s.customer_name} ({s.customer_email})</option>
                  ))}
                </select>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#94a3b8", marginBottom: "6px" }}>Amount Received (₹) *</label>
                  <input
                    type="number"
                    required
                    value={paymentForm.amount}
                    onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                    placeholder="e.g. 25000"
                    style={{ width: "100%", padding: "10px", borderRadius: "6px", background: "#080c14", border: "1px solid rgba(255,255,255,0.08)", color: "#fff" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#94a3b8", marginBottom: "6px" }}>Payment Method</label>
                  <select
                    value={paymentForm.payment_method}
                    onChange={(e) => setPaymentForm({ ...paymentForm, payment_method: e.target.value })}
                    style={{ width: "100%", padding: "10px", borderRadius: "6px", background: "#080c14", border: "1px solid rgba(255,255,255,0.08)", color: "#fff", cursor: "pointer" }}
                  >
                    <option value="UPI">UPI (GooglePay/PhonePe)</option>
                    <option value="Bank Transfer">NEFT / Bank Transfer</option>
                    <option value="Card">Credit / Debit Card</option>
                    <option value="Cash">Cash payment</option>
                    <option value="Free Trial">Free Trial Plan</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#94a3b8", marginBottom: "6px" }}>Payment Date</label>
                  <input
                    type="date"
                    value={paymentForm.payment_date}
                    onChange={(e) => setPaymentForm({ ...paymentForm, payment_date: e.target.value })}
                    style={{ width: "100%", padding: "10px", borderRadius: "6px", background: "#080c14", border: "1px solid rgba(255,255,255,0.08)", color: "#fff" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#94a3b8", marginBottom: "6px" }}>Payment Status</label>
                  <select
                    value={paymentForm.status}
                    onChange={(e) => setPaymentForm({ ...paymentForm, status: e.target.value })}
                    style={{ width: "100%", padding: "10px", borderRadius: "6px", background: "#080c14", border: "1px solid rgba(255,255,255,0.08)", color: "#fff", cursor: "pointer" }}
                  >
                    <option value="paid">Paid successfully</option>
                    <option value="failed">Failed transaction</option>
                    <option value="refunded">Refunded transaction</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", marginTop: "12px" }}>
                <button type="button" onClick={() => setShowAddPaymentModal(false)} style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "#cbd5e1", padding: "10px 20px", borderRadius: "6px", cursor: "pointer" }}>Cancel</button>
                <button type="submit" style={{ background: "#22c55e", border: "none", color: "#fff", padding: "10px 20px", borderRadius: "6px", cursor: "pointer", fontWeight: 600 }}>Log Payment</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 9. MODAL: ADD / EDIT ANNOUNCEMENT */}
      {showAddAnnouncementModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0,0,0,0.6)",
          backdropFilter: "blur(4px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000
        }}>
          <div style={{
            background: "#0f172a",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "16px",
            width: "100%",
            maxWidth: "520px",
            padding: "32px",
            boxShadow: "0 24px 48px rgba(0,0,0,0.5)",
            boxSizing: "border-box"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <h3 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 700, color: "#fff" }}>
                {editingAnnouncement ? "Edit Announcement" : "Publish Announcement Ticker"}
              </h3>
              <button
                onClick={() => {
                  setShowAddAnnouncementModal(false);
                  setEditingAnnouncement(null);
                }}
                style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer" }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAnnouncementFormSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#94a3b8", marginBottom: "6px" }}>Announcement Message *</label>
                <textarea
                  rows={4}
                  required
                  value={announcementForm.message}
                  onChange={(e) => setAnnouncementForm({ ...announcementForm, message: e.target.value })}
                  placeholder="e.g. 📢 Special Launch Offer: Get a professional Business website with custom admin panel at 15% Off!"
                  style={{ width: "100%", padding: "12px", borderRadius: "6px", background: "#080c14", border: "1px solid rgba(255,255,255,0.08)", color: "#fff", fontSize: "0.9rem", fontFamily: "inherit", boxSizing: "border-box" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#94a3b8", marginBottom: "6px" }}>Status</label>
                <select
                  value={announcementForm.active ? "true" : "false"}
                  onChange={(e) => setAnnouncementForm({ ...announcementForm, active: e.target.value === "true" })}
                  style={{ width: "100%", padding: "10px", borderRadius: "6px", background: "#080c14", border: "1px solid rgba(255,255,255,0.08)", color: "#fff", cursor: "pointer" }}
                >
                  <option value="true">Active (Display scrolling after Hero banner)</option>
                  <option value="false">Inactive (Disabled / Hidden)</option>
                </select>
              </div>

              <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", marginTop: "12px" }}>
                <button type="button" onClick={() => { setShowAddAnnouncementModal(false); setEditingAnnouncement(null); }} style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "#cbd5e1", padding: "10px 20px", borderRadius: "6px", cursor: "pointer" }}>Cancel</button>
                <button type="submit" style={{ background: "#0f62fe", border: "none", color: "#fff", padding: "10px 20px", borderRadius: "6px", cursor: "pointer", fontWeight: 600 }}>
                  {editingAnnouncement ? "Save Changes" : "Publish Announcement"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 10. MODAL: CLIENT PROFILE MODAL (7 TABS) */}
      {(() => {
        const currentClient = selectedClient ? (clients.find(c => c.id === selectedClient.id) || selectedClient) : null;
        if (!showClientModal || !currentClient) return null;

        return (
          <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.7)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000
          }}>
            <div style={{
              background: "#0f172a",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "16px",
              width: "90%",
              maxWidth: "1100px",
              height: "85vh",
              padding: "32px",
              boxShadow: "0 24px 48px rgba(0,0,0,0.6)",
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
              gap: "20px"
            }}>
              {/* Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: "16px" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <h3 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 700, color: "#fff" }}>{currentClient.name}</h3>
                    <span style={{ padding: "4px 10px", borderRadius: "6px", fontSize: "0.75rem", fontWeight: 700, background: "rgba(56, 189, 248, 0.15)", color: "#38bdf8" }}>{currentClient.status}</span>
                  </div>
                  <span style={{ fontSize: "0.85rem", color: "#64748b" }}>Company: {currentClient.company_name || "Individual"} • Email: {currentClient.email}</span>
                </div>
                <button
                  onClick={() => {
                    setShowClientModal(false);
                    setSelectedClient(null);
                  }}
                  style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", transition: "color 0.2s" }}
                  onMouseEnter={(e)=>e.currentTarget.style.color="#fff"}
                  onMouseLeave={(e)=>e.currentTarget.style.color="#64748b"}
                >
                  <X size={24} />
                </button>
              </div>

              {/* Profile Tabs */}
              <div style={{ display: "flex", gap: "8px", borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: "10px", overflowX: "auto" }}>
                {[
                  { id: "overview", label: "Overview" },
                  { id: "plan", label: "Plan & Subscription" },
                  { id: "payments", label: "Payments" },
                  { id: "projects", label: "Projects" },
                  { id: "documents", label: "Documents" },
                  { id: "tickets", label: "Tickets" },
                  { id: "communications", label: "Communications" }
                ].map(t => (
                  <button
                    key={t.id}
                    onClick={() => setClientProfileTab(t.id)}
                    style={{
                      padding: "8px 16px",
                      background: clientProfileTab === t.id ? "rgba(15, 98, 254, 0.15)" : "transparent",
                      color: clientProfileTab === t.id ? "#38bdf8" : "#94a3b8",
                      border: "none",
                      borderRadius: "6px",
                      fontWeight: 600,
                      fontSize: "0.85rem",
                      cursor: "pointer",
                      transition: "all 0.2s"
                    }}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Tab Body Content */}
              <div style={{ flex: 1, overflowY: "auto", paddingRight: "8px" }}>
                {/* Tab 1: Overview */}
                {clientProfileTab === "overview" && (
                  <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "32px" }}>
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      const formData = new FormData(e.currentTarget);
                      handleUpdateClient(currentClient.id, {
                        name: formData.get("name"),
                        company_name: formData.get("company_name"),
                        phone: formData.get("phone"),
                        address: formData.get("address"),
                        gst_number: formData.get("gst_number"),
                        tax_details: formData.get("tax_details"),
                        notes: formData.get("notes"),
                        status: formData.get("status")
                      });
                      alert("Client info updated successfully!");
                    }} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                        <div>
                          <label style={{ display: "block", fontSize: "0.78rem", color: "#64748b", fontWeight: 700, marginBottom: "6px" }}>Client Name *</label>
                          <input type="text" name="name" required defaultValue={currentClient.name} style={{ width: "100%", padding: "10px", borderRadius: "6px", background: "#080c14", border: "1px solid rgba(255,255,255,0.08)", color: "#fff", fontSize: "0.85rem" }} />
                        </div>
                        <div>
                          <label style={{ display: "block", fontSize: "0.78rem", color: "#64748b", fontWeight: 700, marginBottom: "6px" }}>Company Name</label>
                          <input type="text" name="company_name" defaultValue={currentClient.company_name} style={{ width: "100%", padding: "10px", borderRadius: "6px", background: "#080c14", border: "1px solid rgba(255,255,255,0.08)", color: "#fff", fontSize: "0.85rem" }} />
                        </div>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                        <div>
                          <label style={{ display: "block", fontSize: "0.78rem", color: "#64748b", fontWeight: 700, marginBottom: "6px" }}>Phone</label>
                          <input type="text" name="phone" defaultValue={currentClient.phone} style={{ width: "100%", padding: "10px", borderRadius: "6px", background: "#080c14", border: "1px solid rgba(255,255,255,0.08)", color: "#fff", fontSize: "0.85rem" }} />
                        </div>
                        <div>
                          <label style={{ display: "block", fontSize: "0.78rem", color: "#64748b", fontWeight: 700, marginBottom: "6px" }}>CRM Status</label>
                          <select name="status" defaultValue={currentClient.status} style={{ width: "100%", padding: "10px", borderRadius: "6px", background: "#080c14", border: "1px solid rgba(255,255,255,0.08)", color: "#fff", fontSize: "0.85rem", cursor: "pointer" }}>
                            {["Lead", "Interested", "Plan Selected", "Payment Pending", "Payment Received", "Proposal Sent", "Agreement Signed", "Project Active", "Project Completed", "Suspended"].map(st => (
                              <option key={st} value={st}>{st}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: "0.78rem", color: "#64748b", fontWeight: 700, marginBottom: "6px" }}>Address</label>
                        <textarea name="address" defaultValue={currentClient.address} rows={2} style={{ width: "100%", padding: "10px", borderRadius: "6px", background: "#080c14", border: "1px solid rgba(255,255,255,0.08)", color: "#fff", fontSize: "0.85rem", resize: "none" }} />
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                        <div>
                          <label style={{ display: "block", fontSize: "0.78rem", color: "#64748b", fontWeight: 700, marginBottom: "6px" }}>GST / Tax Number</label>
                          <input type="text" name="gst_number" defaultValue={currentClient.gst_number} style={{ width: "100%", padding: "10px", borderRadius: "6px", background: "#080c14", border: "1px solid rgba(255,255,255,0.08)", color: "#fff", fontSize: "0.85rem" }} />
                        </div>
                        <div>
                          <label style={{ display: "block", fontSize: "0.78rem", color: "#64748b", fontWeight: 700, marginBottom: "6px" }}>Tax / Billing Details</label>
                          <input type="text" name="tax_details" defaultValue={currentClient.tax_details} style={{ width: "100%", padding: "10px", borderRadius: "6px", background: "#080c14", border: "1px solid rgba(255,255,255,0.08)", color: "#fff", fontSize: "0.85rem" }} />
                        </div>
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: "0.78rem", color: "#64748b", fontWeight: 700, marginBottom: "6px" }}>Client Notes</label>
                        <textarea name="notes" defaultValue={currentClient.notes} rows={3} style={{ width: "100%", padding: "10px", borderRadius: "6px", background: "#080c14", border: "1px solid rgba(255,255,255,0.08)", color: "#fff", fontSize: "0.85rem", resize: "vertical" }} />
                      </div>
                      <button type="submit" style={{ width: "fit-content", background: "#0f62fe", border: "none", color: "#fff", padding: "10px 24px", borderRadius: "6px", cursor: "pointer", fontWeight: 600, fontSize: "0.85rem" }}>Save Client Info</button>
                    </form>

                    <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: "12px", padding: "20px", display: "flex", flexDirection: "column", gap: "16px", height: "fit-content" }}>
                      <h4 style={{ margin: 0, fontSize: "0.95rem", color: "#fff", fontWeight: 700 }}>Client Metadata</h4>
                      <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "0.82rem" }}>
                        <div><span style={{ color: "#64748b" }}>Client ID:</span> <span style={{ color: "#fff", fontFamily: "monospace" }}>{currentClient.id}</span></div>
                        <div><span style={{ color: "#64748b" }}>Registered:</span> <span style={{ color: "#fff" }}>{currentClient.created_at ? new Date(currentClient.created_at).toLocaleString("en-IN") : "N/A"}</span></div>
                        <div><span style={{ color: "#64748b" }}>Last Activity:</span> <span style={{ color: "#fff" }}>{currentClient.updated_at ? new Date(currentClient.updated_at).toLocaleString("en-IN") : "N/A"}</span></div>
                        <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "10px", marginTop: "5px" }}>
                          <span style={{ color: "#64748b" }}>Total Invoiced:</span>
                          <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "#22c55e", marginTop: "4px" }}>₹{(currentClient.totalPaid || 0).toLocaleString("en-IN")}</div>
                        </div>
                        <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "10px" }}>
                          <span style={{ color: "#64748b" }}>Assigned Project:</span>
                          <p style={{ margin: "4px 0 0 0", color: "#38bdf8", fontWeight: 700 }}>{currentClient.project ? currentClient.project.plan_name : "None active"}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab 2: Plan & Subscription */}
                {clientProfileTab === "plan" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                    {currentClient.subscription ? (
                      <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: "12px", padding: "24px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "16px" }}>
                          <div>
                            <span style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: 700 }}>ACTIVE SUBSCRIPTION</span>
                            <h4 style={{ margin: "4px 0 0 0", fontSize: "1.3rem", fontWeight: 700, color: "#fff" }}>{plans.find(p => p.id === currentClient.subscription.plan_id)?.name || currentClient.subscription.plan_id}</h4>
                            <span style={{ fontSize: "0.8rem", color: "#64748b" }}>ID: {currentClient.subscription.id}</span>
                          </div>
                          <span style={{
                            padding: "4px 10px",
                            borderRadius: "6px",
                            fontSize: "0.75rem",
                            fontWeight: 800,
                            textTransform: "uppercase",
                            background: currentClient.subscription.status === "active" ? "rgba(34, 197, 94, 0.15)" : "rgba(239, 68, 68, 0.15)",
                            color: currentClient.subscription.status === "active" ? "#4ade80" : "#f87171"
                          }}>{currentClient.subscription.status}</span>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", fontSize: "0.85rem", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "16px" }}>
                          <div><span style={{ color: "#64748b" }}>Billing Cycle:</span> <strong style={{ color: "#fff", textTransform: "capitalize" }}>{currentClient.subscription.billing_cycle}</strong></div>
                          <div><span style={{ color: "#64748b" }}>Start Date:</span> <strong style={{ color: "#fff" }}>{currentClient.subscription.start_date}</strong></div>
                          <div><span style={{ color: "#64748b" }}>Promo Code:</span> <strong style={{ color: "#fb7185" }}>{currentClient.subscription.promo_code || "None Applied"}</strong></div>
                        </div>
                      </div>
                    ) : (
                      <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: "12px", padding: "24px", textAlign: "center" }}>
                        <p style={{ color: "#64748b", margin: 0 }}>No active subscription plan found for this client.</p>
                      </div>
                    )}

                    {/* Plan Change / Assignment Form */}
                    <div style={{ background: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: "12px", padding: "20px" }}>
                      <h4 style={{ margin: "0 0 16px 0", fontSize: "0.95rem", color: "#fff", fontWeight: 700 }}>
                        {currentClient.subscription ? "Upgrade / Downgrade Subscription" : "Assign Plan & Create Subscription"}
                      </h4>
                      <form onSubmit={async (e) => {
                        e.preventDefault();
                        const targetPlanId = e.currentTarget.plan_id.value;
                        const cycle = e.currentTarget.billing_cycle.value;
                        if (currentClient.subscription) {
                          await handleUpgradeDowngradePlan(currentClient.subscription.id, targetPlanId);
                          alert("Plan updated successfully!");
                        } else {
                          try {
                            const res = await fetch("/api/admin/subscriptions", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({
                                customer_name: currentClient.name,
                                customer_email: currentClient.email,
                                plan_id: targetPlanId,
                                billing_cycle: cycle,
                                status: "active",
                                start_date: new Date().toISOString().slice(0, 10),
                                trial_end_date: "",
                                promo_code: ""
                              })
                            });
                            if (res.ok) {
                              alert("Subscription successfully created!");
                              fetchDashboardData();
                            } else {
                              alert("Failed to create subscription.");
                            }
                          } catch(err) {
                            console.error(err);
                          }
                        }
                      }} style={{ display: "flex", gap: "16px", alignItems: "flex-end" }}>
                        <div style={{ flex: 1 }}>
                          <label style={{ display: "block", fontSize: "0.75rem", color: "#64748b", fontWeight: 700, marginBottom: "6px" }}>SELECT PLAN</label>
                          <select name="plan_id" defaultValue={currentClient.subscription?.plan_id || plans[0]?.id || "basic"} style={{ width: "100%", padding: "10px", borderRadius: "6px", background: "#080c14", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", fontSize: "0.85rem", cursor: "pointer" }}>
                            {plans.map(p => (
                              <option key={p.id} value={p.id}>{p.name} ({p.price})</option>
                            ))}
                          </select>
                        </div>
                        <div style={{ flex: 1 }}>
                          <label style={{ display: "block", fontSize: "0.75rem", color: "#64748b", fontWeight: 700, marginBottom: "6px" }}>BILLING CYCLE</label>
                          <select name="billing_cycle" defaultValue={currentClient.subscription?.billing_cycle || "one-time"} style={{ width: "100%", padding: "10px", borderRadius: "6px", background: "#080c14", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", fontSize: "0.85rem", cursor: "pointer" }}>
                            <option value="one-time">One-time payment</option>
                            <option value="monthly">Monthly Subscription</option>
                            <option value="yearly">Yearly Subscription</option>
                          </select>
                        </div>
                        <button type="submit" style={{ background: "#0f62fe", border: "none", color: "#fff", padding: "11px 24px", borderRadius: "6px", cursor: "pointer", fontWeight: 600, fontSize: "0.85rem" }}>
                          {currentClient.subscription ? "Upgrade/Downgrade Plan" : "Assign Subscription"}
                        </button>
                      </form>
                    </div>
                  </div>
                )}

                {/* Tab 3: Payments */}
                {clientProfileTab === "payments" && (
                  <div style={{ display: "grid", gridTemplateColumns: "1.8fr 1fr", gap: "32px" }}>
                    {/* Left Column: Payments History */}
                    <div style={{ background: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: "12px", padding: "20px" }}>
                      <h4 style={{ margin: "0 0 16px 0", fontSize: "0.95rem", color: "#fff", fontWeight: 700 }}>Invoices & Transactions Ledger</h4>
                      <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.82rem" }}>
                        <thead>
                          <tr style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.05)", background: "rgba(255,255,255,0.02)" }}>
                            <th style={{ padding: "12px 16px", color: "#64748b", fontWeight: 700 }}>DATE</th>
                            <th style={{ padding: "12px 16px", color: "#64748b", fontWeight: 700 }}>REF ID / DESC</th>
                            <th style={{ padding: "12px 16px", color: "#64748b", fontWeight: 700 }}>AMOUNT</th>
                            <th style={{ padding: "12px 16px", color: "#64748b", fontWeight: 700 }}>STATUS</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentClient.invoices?.length === 0 ? (
                            <tr>
                              <td colSpan={4} style={{ padding: "16px", textAlign: "center", color: "#64748b" }}>No payment transactions logged.</td>
                            </tr>
                          ) : (
                            currentClient.invoices?.map(inv => (
                              <tr key={inv.id} style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.03)" }}>
                                <td style={{ padding: "12px 16px", color: "#cbd5e1" }}>{inv.issue_date}</td>
                                <td style={{ padding: "12px 16px", color: "#fff" }}>
                                  <strong>{inv.id}</strong>
                                  <span style={{ display: "block", fontSize: "0.72rem", color: "#64748b" }}>Plan: {inv.plan_name}</span>
                                </td>
                                <td style={{ padding: "12px 16px", color: "#22c55e", fontWeight: 800 }}>₹{parseFloat(inv.cost || 0).toLocaleString("en-IN")}</td>
                                <td style={{ padding: "12px 16px" }}>
                                  <span style={{ padding: "2px 6px", borderRadius: "4px", fontSize: "0.68rem", fontWeight: 800, background: "rgba(34, 197, 94, 0.15)", color: "#4ade80" }}>{inv.status.toUpperCase()}</span>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>

                    {/* Right Column: Record Payment Form */}
                    <form onSubmit={async (e) => {
                      e.preventDefault();
                      const amount = e.currentTarget.amount.value;
                      const method = e.currentTarget.method.value;
                      const date = e.currentTarget.date.value;
                      try {
                        const res = await fetch("/api/admin/payments", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            subscription_id: currentClient.subscription?.id || "offline-client-" + currentClient.id,
                            amount,
                            payment_method: method,
                            payment_date: date,
                            status: "paid"
                          })
                        });
                        if (res.ok) {
                          alert("Offline payment logged successfully!");
                          e.currentTarget.reset();
                          fetchDashboardData();
                        } else {
                          alert("Failed to log payment.");
                        }
                      } catch(err) {
                        console.error(err);
                      }
                    }} style={{ background: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: "12px", padding: "20px", display: "flex", flexDirection: "column", gap: "14px", height: "fit-content" }}>
                      <h4 style={{ margin: 0, fontSize: "0.95rem", color: "#fff", fontWeight: 700 }}>Record Offline Payment</h4>
                      <div>
                        <label style={{ display: "block", fontSize: "0.75rem", color: "#64748b", fontWeight: 700, marginBottom: "6px" }}>AMOUNT RECEIVED (₹) *</label>
                        <input type="number" name="amount" required placeholder="e.g. 25000" style={{ width: "100%", padding: "10px", borderRadius: "6px", background: "#080c14", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", fontSize: "0.85rem" }} />
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: "0.75rem", color: "#64748b", fontWeight: 700, marginBottom: "6px" }}>PAYMENT METHOD *</label>
                        <select name="method" style={{ width: "100%", padding: "10px", borderRadius: "6px", background: "#080c14", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", fontSize: "0.85rem", cursor: "pointer" }}>
                          <option value="UPI">UPI (Google Pay, PhonePe, Paytm)</option>
                          <option value="Bank Transfer">Bank Transfer (IMPS, NEFT)</option>
                          <option value="Credit/Debit Card">Credit/Debit Card</option>
                          <option value="Wallet">Digital Wallet</option>
                          <option value="Cash">Cash payment</option>
                        </select>
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: "0.75rem", color: "#64748b", fontWeight: 700, marginBottom: "6px" }}>PAYMENT DATE *</label>
                        <input type="date" name="date" required defaultValue={new Date().toISOString().slice(0, 10)} style={{ width: "100%", padding: "10px", borderRadius: "6px", background: "#080c14", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", fontSize: "0.85rem" }} />
                      </div>
                      <button type="submit" style={{ background: "#0f62fe", border: "none", color: "#fff", padding: "10px", borderRadius: "6px", cursor: "pointer", fontWeight: 600, fontSize: "0.85rem", marginTop: "4px" }}>Record Transaction</button>
                    </form>
                  </div>
                )}

                {/* Tab 4: Projects */}
                {clientProfileTab === "projects" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                    {currentClient.project ? (
                      <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: "12px", padding: "24px" }}>
                        <form onSubmit={async (e) => {
                          e.preventDefault();
                          const formData = new FormData(e.currentTarget);
                          await handleProjectUpdate(currentClient.project.id, {
                            status: formData.get("status"),
                            progress: parseInt(formData.get("progress")),
                            assigned_to: formData.get("assigned_to"),
                            requirements: formData.get("requirements")
                          });
                          alert("Project updated successfully!");
                          fetchDashboardData();
                        }} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div>
                              <span style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: 700 }}>PROJECT ID: {currentClient.project.id}</span>
                              <h4 style={{ margin: "4px 0 0 0", fontSize: "1.15rem", fontWeight: 700, color: "#fff" }}>{currentClient.project.plan_name}</h4>
                            </div>
                          </div>

                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                            <div>
                              <label style={{ display: "block", fontSize: "0.75rem", color: "#64748b", fontWeight: 700, marginBottom: "6px" }}>PROJECT STATUS</label>
                              <select name="status" defaultValue={currentClient.project.status} style={{ width: "100%", padding: "10px", borderRadius: "6px", background: "#080c14", border: "1px solid rgba(255,255,255,0.08)", color: "#fff", fontSize: "0.85rem", cursor: "pointer" }}>
                                <option value="New Lead">New Lead</option>
                                <option value="Plan Selected">Plan Selected</option>
                                <option value="Payment Completed">Payment Completed</option>
                                <option value="Proposal Sent">Proposal Sent</option>
                                <option value="Agreement Signed">Agreement Signed</option>
                                <option value="Project Assigned">Project Assigned</option>
                                <option value="Development Started">Development Started</option>
                                <option value="Testing">Testing</option>
                                <option value="Delivery">Delivery</option>
                                <option value="Project Completed">Project Completed</option>
                              </select>
                            </div>
                            <div>
                              <label style={{ display: "block", fontSize: "0.75rem", color: "#64748b", fontWeight: 700, marginBottom: "6px" }}>ASSIGNED STAFF</label>
                              <select name="assigned_to" defaultValue={currentClient.project.assigned_to || "Unassigned"} style={{ width: "100%", padding: "10px", borderRadius: "6px", background: "#080c14", border: "1px solid rgba(255,255,255,0.08)", color: "#fff", fontSize: "0.85rem", cursor: "pointer" }}>
                                <option value="Unassigned">Unassigned</option>
                                <option value="Arjun Sharma">Arjun Sharma (Eng)</option>
                                <option value="Priya Sharma">Priya Sharma (HR)</option>
                                <option value="Rohit Verma">Rohit Verma (Eng)</option>
                                <option value="Sneha Gupta">Sneha Gupta (PM)</option>
                              </select>
                            </div>
                          </div>

                          <div>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                              <label style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: 700 }}>DEVELOPMENT PROGRESS</label>
                              <strong style={{ fontSize: "0.85rem", color: "#38bdf8" }}>{currentClient.project.progress}%</strong>
                            </div>
                            <input type="range" name="progress" min="0" max="100" defaultValue={currentClient.project.progress || 0} style={{ width: "100%", cursor: "pointer" }} />
                          </div>

                          <div>
                            <label style={{ display: "block", fontSize: "0.75rem", color: "#64748b", fontWeight: 700, marginBottom: "6px" }}>PROJECT SPECIFIC REQUIREMENTS</label>
                            <textarea name="requirements" defaultValue={currentClient.project.requirements} rows={4} style={{ width: "100%", padding: "12px", borderRadius: "6px", background: "#080c14", border: "1px solid rgba(255,255,255,0.08)", color: "#fff", fontSize: "0.85rem", resize: "vertical" }} />
                          </div>

                          <button type="submit" style={{ width: "fit-content", background: "#0f62fe", border: "none", color: "#fff", padding: "10px 24px", borderRadius: "6px", cursor: "pointer", fontWeight: 600, fontSize: "0.85rem" }}>Update Project Pipeline</button>
                        </form>
                      </div>
                    ) : (
                      <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: "12px", padding: "32px", textAlign: "center" }}>
                        <p style={{ color: "#64748b", marginBottom: "16px" }}>No active project track record exists for this client.</p>
                        <button
                          onClick={async () => {
                            try {
                              const res = await fetch("/api/admin/projects", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                  id: "PROJ-" + Date.now(),
                                  customer_name: currentClient.name,
                                  customer_email: currentClient.email,
                                  company_name: currentClient.company_name || "Individual",
                                  plan_name: currentClient.plan_name || "Custom Project",
                                  status: "Project Assigned",
                                  progress: 10,
                                  assigned_to: "Unassigned",
                                  requirements: "Setup workspace and initiate kickoff."
                                })
                              });
                              if (res.ok) {
                                alert("Project tracking initialized!");
                                fetchDashboardData();
                              } else {
                                alert("Failed to initialize project.");
                              }
                            } catch(err) {
                              console.error(err);
                            }
                          }}
                          style={{ background: "#0f62fe", border: "none", color: "#fff", padding: "10px 20px", borderRadius: "6px", cursor: "pointer", fontWeight: 600, fontSize: "0.85rem" }}
                        >
                          Initialize Project Record
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Tab 5: Documents */}
                {clientProfileTab === "documents" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                    <div style={{ display: "flex", gap: "12px", borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: "16px" }}>
                      <button
                        onClick={async () => {
                          const propId = "PROP-" + Date.now();
                          const cost = currentClient.subscription ? 35000 : 50000;
                          const planName = currentClient.plan_name || "Custom Development Services";
                          const content = `# Project Proposal for ${currentClient.company_name || currentClient.name}\n\n**Proposal ID:** ${propId}\n**Date:** ${new Date().toLocaleDateString("en-IN")}\n\n## Project Plan Scope:\nDeployment & customization of a professional ${planName}.\n\nTotal Estimated Budget: ₹${cost.toLocaleString("en-IN")}.\n\nNext Steps: Review terms and e-sign the service agreement.`;
                          try {
                            const res = await fetch("/api/admin/proposals", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({
                                type: "proposal",
                                id: propId,
                                customer_email: currentClient.email,
                                customer_name: currentClient.name,
                                company_name: currentClient.company_name || "Individual",
                                plan_name: planName,
                                cost,
                                content,
                                status: "sent"
                              })
                            });
                            if (res.ok) {
                              alert("Proposal generated and logged successfully!");
                              fetchDashboardData();
                            } else {
                              alert("Failed to generate proposal.");
                            }
                          } catch(err) {
                            console.error(err);
                          }
                        }}
                        style={{ background: "#0f62fe", border: "none", color: "#fff", padding: "10px 18px", borderRadius: "6px", cursor: "pointer", fontWeight: 600, fontSize: "0.85rem" }}
                      >
                        Generate Proposal Draft
                      </button>
                      <button
                        onClick={async () => {
                          const agrId = "AGR-" + Date.now();
                          const planName = currentClient.plan_name || "Custom Development Services";
                          const content = `# Service Level Agreement\n\n**Contract ID:** ${agrId}\n**Date:** ${new Date().toLocaleDateString("en-IN")}\n\nThis agreement is entered into by Nexhydigital Enterprise and the client ${currentClient.name}.\n\n## Terms:\n1. Standard deployment configurations.\n2. Milestones and scope are governed by the accepted project proposal.\n3. SLA support duration: 1 month.\n\n*Signed electronically by:* Nexhydigital Admin Team`;
                          try {
                            const res = await fetch("/api/admin/proposals", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({
                                type: "agreement",
                                id: agrId,
                                customer_email: currentClient.email,
                                customer_name: currentClient.name,
                                plan_name: planName,
                                content,
                                status: "pending_signature"
                              })
                            });
                            if (res.ok) {
                              alert("Service Agreement generated and sent!");
                              fetchDashboardData();
                            } else {
                              alert("Failed to generate agreement.");
                            }
                          } catch(err) {
                            console.error(err);
                          }
                        }}
                        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", padding: "10px 18px", borderRadius: "6px", cursor: "pointer", fontWeight: 600, fontSize: "0.85rem" }}
                      >
                        Generate Service Agreement
                      </button>
                    </div>

                    {/* List Proposals */}
                    <div style={{ background: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: "12px", padding: "20px" }}>
                      <h4 style={{ margin: "0 0 12px 0", fontSize: "0.95rem", color: "#fff", fontWeight: 700 }}>Proposals History</h4>
                      <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.82rem" }}>
                        <thead>
                          <tr style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.05)", background: "rgba(255,255,255,0.02)" }}>
                            <th style={{ padding: "10px 12px", color: "#64748b", fontWeight: 700 }}>PROPOSAL ID</th>
                            <th style={{ padding: "10px 12px", color: "#64748b", fontWeight: 700 }}>PLAN / SERVICE</th>
                            <th style={{ padding: "10px 12px", color: "#64748b", fontWeight: 700 }}>COST ESTIMATE</th>
                            <th style={{ padding: "10px 12px", color: "#64748b", fontWeight: 700 }}>STATUS</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentClient.proposal ? (
                            <tr style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.03)" }}>
                              <td style={{ padding: "12px", color: "#cbd5e1" }}>{currentClient.proposal.id}</td>
                              <td style={{ padding: "12px", color: "#fff" }}>{currentClient.proposal.plan_name}</td>
                              <td style={{ padding: "12px", color: "#38bdf8", fontWeight: 700 }}>₹{parseFloat(currentClient.proposal.cost || 0).toLocaleString("en-IN")}</td>
                              <td style={{ padding: "12px" }}>
                                <span style={{ padding: "2px 6px", borderRadius: "4px", fontSize: "0.68rem", fontWeight: 800, background: "rgba(15, 98, 254, 0.15)", color: "#38bdf8" }}>{currentClient.proposal.status.toUpperCase()}</span>
                              </td>
                            </tr>
                          ) : (
                            <tr>
                              <td colSpan={4} style={{ padding: "12px", textAlign: "center", color: "#64748b" }}>No proposals generated yet.</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>

                    {/* List Agreements */}
                    <div style={{ background: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: "12px", padding: "20px" }}>
                      <h4 style={{ margin: "0 0 12px 0", fontSize: "0.95rem", color: "#fff", fontWeight: 700 }}>Service Agreements</h4>
                      <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.82rem" }}>
                        <thead>
                          <tr style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.05)", background: "rgba(255,255,255,0.02)" }}>
                            <th style={{ padding: "10px 12px", color: "#64748b", fontWeight: 700 }}>CONTRACT ID</th>
                            <th style={{ padding: "10px 12px", color: "#64748b", fontWeight: 700 }}>PLAN</th>
                            <th style={{ padding: "10px 12px", color: "#64748b", fontWeight: 700 }}>STATUS</th>
                            <th style={{ padding: "10px 12px", color: "#64748b", fontWeight: 700 }}>SIGN DETAILS</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentClient.agreement ? (
                            <tr style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.03)" }}>
                              <td style={{ padding: "12px", color: "#cbd5e1" }}>{currentClient.agreement.id}</td>
                              <td style={{ padding: "12px", color: "#fff" }}>{currentClient.agreement.plan_name}</td>
                              <td style={{ padding: "12px" }}>
                                <span style={{ padding: "2px 6px", borderRadius: "4px", fontSize: "0.68rem", fontWeight: 800, background: currentClient.agreement.status === "signed" ? "rgba(34, 197, 94, 0.15)" : "rgba(239, 68, 68, 0.15)", color: currentClient.agreement.status === "signed" ? "#4ade80" : "#f87171" }}>{currentClient.agreement.status.toUpperCase()}</span>
                              </td>
                              <td style={{ padding: "12px", color: "#cbd5e1" }}>
                                {currentClient.agreement.status === "signed" ? (
                                  <span>Signed by: <strong>{currentClient.agreement.signed_name}</strong> ({currentClient.agreement.signed_at})</span>
                                ) : (
                                  <span style={{ color: "#64748b" }}>Awaiting signature</span>
                                )}
                              </td>
                            </tr>
                          ) : (
                            <tr>
                              <td colSpan={4} style={{ padding: "12px", textAlign: "center", color: "#64748b" }}>No service contracts created yet.</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Tab 6: Tickets */}
                {clientProfileTab === "tickets" && (
                  <div style={{ display: "grid", gridTemplateColumns: "1.8fr 1fr", gap: "32px" }}>
                    {/* Left Column: Tickets List */}
                    <div style={{ background: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: "12px", padding: "20px" }}>
                      <h4 style={{ margin: "0 0 16px 0", fontSize: "0.95rem", color: "#fff", fontWeight: 700 }}>Client Support Tickets</h4>
                      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                        {currentClient.tickets?.length === 0 ? (
                          <p style={{ color: "#64748b", fontSize: "0.85rem", margin: 0 }}>No support tickets raised by this client.</p>
                        ) : (
                          currentClient.tickets?.map(t => (
                            <div key={t.id} style={{ background: "rgba(0,0,0,0.15)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: "8px", padding: "12px", fontSize: "0.8rem" }}>
                              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                                <strong style={{ color: "#fff" }}>{t.sub}</strong>
                                <span style={{ padding: "3px 8px", borderRadius: "4px", fontSize: "0.7rem", fontWeight: 700, background: t.status === "Open" ? "rgba(234, 179, 8, 0.15)" : "rgba(34, 197, 94, 0.15)", color: t.status === "Open" ? "#facc15" : "#4ade80" }}>{t.status}</span>
                              </div>
                              <p style={{ margin: "0 0 6px 0", color: "#cbd5e1", fontSize: "0.78rem" }}>{t.desc || t.desc_text}</p>
                              {t.resolution && (
                                <div style={{ background: "rgba(34, 197, 94, 0.05)", borderLeft: "3px solid #4ade80", padding: "8px", borderRadius: "4px", margin: "6px 0", fontSize: "0.75rem", color: "#cbd5e1" }}>
                                  <strong>Resolution:</strong> {t.resolution}
                                </div>
                              )}
                              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.7rem", color: "#64748b", marginTop: "6px" }}>
                                <span>Date: {t.date} • Cat: {t.cat}</span>
                                <span>Assigned: {t.assignee}</span>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Right Column: Raise Ticket Form */}
                    <form onSubmit={async (e) => {
                      e.preventDefault();
                      const subject = e.currentTarget.subject.value;
                      const category = e.currentTarget.category.value;
                      const priority = e.currentTarget.priority.value;
                      const description = e.currentTarget.description.value;
                      try {
                        const res = await fetch("/api/tickets", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            id: "TKT-" + Date.now(),
                            sub: subject,
                            cat: category,
                            pri: priority,
                            desc_text: description,
                            status: "Open",
                            by_user: currentClient.email,
                            date: new Date().toISOString().slice(0, 10)
                          })
                        });
                        if (res.ok) {
                          alert("Support ticket raised successfully!");
                          e.currentTarget.reset();
                          fetchDashboardData();
                        } else {
                          alert("Failed to raise ticket.");
                        }
                      } catch(err) {
                        console.error(err);
                      }
                    }} style={{ background: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: "12px", padding: "20px", display: "flex", flexDirection: "column", gap: "14px", height: "fit-content" }}>
                      <h4 style={{ margin: 0, fontSize: "0.95rem", color: "#fff", fontWeight: 700 }}>Raise Support Ticket</h4>
                      <div>
                        <label style={{ display: "block", fontSize: "0.75rem", color: "#64748b", fontWeight: 700, marginBottom: "6px" }}>TICKET SUBJECT *</label>
                        <input type="text" name="subject" required placeholder="Brief summary of issue" style={{ width: "100%", padding: "10px", borderRadius: "6px", background: "#080c14", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", fontSize: "0.85rem" }} />
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                        <div>
                          <label style={{ display: "block", fontSize: "0.75rem", color: "#64748b", fontWeight: 700, marginBottom: "6px" }}>CATEGORY</label>
                          <select name="category" style={{ width: "100%", padding: "8px", borderRadius: "6px", background: "#080c14", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", fontSize: "0.82rem" }}>
                            <option value="Technical">Technical</option>
                            <option value="Billing Query">Billing Query</option>
                            <option value="HR Query">HR Query</option>
                            <option value="General Info">General Info</option>
                          </select>
                        </div>
                        <div>
                          <label style={{ display: "block", fontSize: "0.75rem", color: "#64748b", fontWeight: 700, marginBottom: "6px" }}>PRIORITY</label>
                          <select name="priority" style={{ width: "100%", padding: "8px", borderRadius: "6px", background: "#080c14", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", fontSize: "0.82rem" }}>
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: "0.75rem", color: "#64748b", fontWeight: 700, marginBottom: "6px" }}>TICKET DESCRIPTION *</label>
                        <textarea name="description" required rows={3} placeholder="Provide issue details..." style={{ width: "100%", padding: "10px", borderRadius: "6px", background: "#080c14", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", fontSize: "0.85rem", resize: "none", fontFamily: "inherit" }} />
                      </div>
                      <button type="submit" style={{ background: "#0f62fe", border: "none", color: "#fff", padding: "10px", borderRadius: "6px", cursor: "pointer", fontWeight: 600, fontSize: "0.85rem", marginTop: "4px" }}>Submit Ticket</button>
                    </form>
                  </div>
                )}

                {/* Tab 7: Communications */}
                {clientProfileTab === "communications" && (
                  <div style={{ display: "grid", gridTemplateColumns: "1.8fr 1fr", gap: "32px" }}>
                    {/* Left Column: Communications History */}
                    <div style={{ background: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: "12px", padding: "20px" }}>
                      <h4 style={{ margin: "0 0 16px 0", fontSize: "0.95rem", color: "#fff", fontWeight: 700 }}>Communication & Dispatch History</h4>
                      <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxHeight: "400px", overflowY: "auto" }}>
                        {clientComms.length === 0 ? (
                          <p style={{ color: "#64748b", fontSize: "0.85rem", margin: 0 }}>No correspondence logged yet.</p>
                        ) : (
                          clientComms.map(comm => {
                            const typeColor = 
                              comm.type === "email" ? "#38bdf8" :
                              comm.type === "sms" ? "#facc15" :
                              comm.type === "whatsapp" ? "#4ade80" : "#cbd5e1";
                            
                            return (
                              <div key={comm.id} style={{ background: "rgba(0,0,0,0.15)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: "8px", padding: "12px", fontSize: "0.8rem" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                                  <div>
                                    <span style={{ padding: "2px 6px", borderRadius: "4px", fontSize: "0.65rem", fontWeight: 800, textTransform: "uppercase", background: "rgba(255,255,255,0.05)", color: typeColor, marginRight: "8px" }}>{comm.type}</span>
                                    <strong style={{ color: "#fff" }}>{comm.subject || "Interaction Note"}</strong>
                                  </div>
                                  <span style={{ fontSize: "0.7rem", color: "#64748b" }}>{new Date(comm.sent_at).toLocaleString("en-IN")}</span>
                                </div>
                                <p style={{ margin: "0 0 4px 0", color: "#cbd5e1", fontSize: "0.78rem", whiteSpace: "pre-wrap" }}>{comm.message}</p>
                                <div style={{ textAlign: "right", fontSize: "0.7rem", color: "#64748b" }}>
                                  Sent by: <strong>{comm.sent_by}</strong>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>

                    {/* Right Column: Send Message Form */}
                    <form onSubmit={async (e) => {
                      e.preventDefault();
                      await handleSendComm(currentClient.email);
                    }} style={{ background: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: "12px", padding: "20px", display: "flex", flexDirection: "column", gap: "14px", height: "fit-content" }}>
                      <h4 style={{ margin: 0, fontSize: "0.95rem", color: "#fff", fontWeight: 700 }}>Dispatch Correspondence</h4>
                      <div>
                        <label style={{ display: "block", fontSize: "0.75rem", color: "#64748b", fontWeight: 700, marginBottom: "6px" }}>DISPATCH TYPE *</label>
                        <select value={sendCommForm.type} onChange={(e) => setSendCommForm({ ...sendCommForm, type: e.target.value })} style={{ width: "100%", padding: "10px", borderRadius: "6px", background: "#080c14", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", fontSize: "0.85rem", cursor: "pointer" }}>
                          <option value="email">Email Dispatch (Sends via EmailJS)</option>
                          <option value="sms">SMS Log entry (Internal record)</option>
                          <option value="whatsapp">WhatsApp Log entry (Internal record)</option>
                          <option value="note">Internal Account Note</option>
                        </select>
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: "0.75rem", color: "#64748b", fontWeight: 700, marginBottom: "6px" }}>SUBJECT *</label>
                        <input type="text" value={sendCommForm.subject} onChange={(e) => setSendCommForm({ ...sendCommForm, subject: e.target.value })} required placeholder="e.g. Project Update / Onboarding details" style={{ width: "100%", padding: "10px", borderRadius: "6px", background: "#080c14", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", fontSize: "0.85rem" }} />
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: "0.75rem", color: "#64748b", fontWeight: 700, marginBottom: "6px" }}>MESSAGE BODY *</label>
                        <textarea value={sendCommForm.message} onChange={(e) => setSendCommForm({ ...sendCommForm, message: e.target.value })} required rows={4} placeholder="Type message or internal note..." style={{ width: "100%", padding: "10px", borderRadius: "6px", background: "#080c14", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", fontSize: "0.85rem", resize: "none", fontFamily: "inherit" }} />
                      </div>
                      <button type="submit" style={{ background: "#0f62fe", border: "none", color: "#fff", padding: "10px", borderRadius: "6px", cursor: "pointer", fontWeight: 600, fontSize: "0.85rem", marginTop: "4px" }}>Send / Log Message</button>
                    </form>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div style={{ display: "flex", justifyContent: "flex-end", borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "16px", marginTop: "8px" }}>
                <button
                  onClick={() => {
                    setShowClientModal(false);
                    setSelectedClient(null);
                  }}
                  style={{ background: "#0f62fe", border: "none", color: "#fff", padding: "10px 24px", borderRadius: "6px", cursor: "pointer", fontWeight: 600, fontSize: "0.85rem" }}
                >
                  Close Profile
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* 11. MODAL: ADD/EDIT CLIENT MODAL */}
      {showAddClientModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0,0,0,0.6)",
          backdropFilter: "blur(4px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000
        }}>
          <div style={{
            background: "#0f172a",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "16px",
            width: "100%",
            maxWidth: "540px",
            padding: "32px",
            boxShadow: "0 24px 48px rgba(0,0,0,0.5)",
            boxSizing: "border-box"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <h3 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 700, color: "#fff" }}>
                {editingClient ? "Edit Client Profile" : "Add New Client to CRM"}
              </h3>
              <button onClick={() => { setShowAddClientModal(false); setEditingClient(null); }} style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer" }}><X size={20} /></button>
            </div>

            <form onSubmit={async (e) => {
              e.preventDefault();
              if (editingClient) {
                await handleUpdateClient(editingClient.id, clientForm);
                setShowAddClientModal(false);
                setEditingClient(null);
                fetchDashboardData();
              } else {
                await handleAddClient(e);
              }
            }} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#94a3b8", marginBottom: "6px" }}>Client Name *</label>
                  <input
                    type="text"
                    required
                    value={clientForm.name}
                    onChange={(e) => setClientForm({ ...clientForm, name: e.target.value })}
                    style={{ width: "100%", padding: "10px", borderRadius: "6px", background: "#080c14", border: "1px solid rgba(255,255,255,0.08)", color: "#fff" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#94a3b8", marginBottom: "6px" }}>Company Name</label>
                  <input
                    type="text"
                    value={clientForm.company_name}
                    onChange={(e) => setClientForm({ ...clientForm, company_name: e.target.value })}
                    style={{ width: "100%", padding: "10px", borderRadius: "6px", background: "#080c14", border: "1px solid rgba(255,255,255,0.08)", color: "#fff" }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#94a3b8", marginBottom: "6px" }}>Email *</label>
                  <input
                    type="email"
                    required
                    disabled={!!editingClient}
                    value={clientForm.email}
                    onChange={(e) => setClientForm({ ...clientForm, email: e.target.value })}
                    style={{ width: "100%", padding: "10px", borderRadius: "6px", background: "#080c14", border: "1px solid rgba(255,255,255,0.08)", color: "#fff", opacity: editingClient ? 0.6 : 1 }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#94a3b8", marginBottom: "6px" }}>Phone</label>
                  <input
                    type="text"
                    value={clientForm.phone}
                    onChange={(e) => setClientForm({ ...clientForm, phone: e.target.value })}
                    style={{ width: "100%", padding: "10px", borderRadius: "6px", background: "#080c14", border: "1px solid rgba(255,255,255,0.08)", color: "#fff" }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#94a3b8", marginBottom: "6px" }}>Address</label>
                <textarea
                  value={clientForm.address}
                  onChange={(e) => setClientForm({ ...clientForm, address: e.target.value })}
                  rows={2}
                  style={{ width: "100%", padding: "10px", borderRadius: "6px", background: "#080c14", border: "1px solid rgba(255,255,255,0.08)", color: "#fff", resize: "none" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#94a3b8", marginBottom: "6px" }}>GST/Tax Number</label>
                  <input
                    type="text"
                    value={clientForm.gst_number}
                    onChange={(e) => setClientForm({ ...clientForm, gst_number: e.target.value })}
                    style={{ width: "100%", padding: "10px", borderRadius: "6px", background: "#080c14", border: "1px solid rgba(255,255,255,0.08)", color: "#fff" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#94a3b8", marginBottom: "6px" }}>CRM Status</label>
                  <select
                    value={clientForm.status}
                    onChange={(e) => setClientForm({ ...clientForm, status: e.target.value })}
                    style={{ width: "100%", padding: "10px", borderRadius: "6px", background: "#080c14", border: "1px solid rgba(255,255,255,0.08)", color: "#fff", cursor: "pointer" }}
                  >
                    {["Lead", "Interested", "Plan Selected", "Payment Pending", "Payment Received", "Proposal Sent", "Agreement Signed", "Project Active", "Project Completed", "Suspended"].map(st => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#94a3b8", marginBottom: "6px" }}>GST & Tax Billing Details</label>
                <input
                  type="text"
                  value={clientForm.tax_details}
                  onChange={(e) => setClientForm({ ...clientForm, tax_details: e.target.value })}
                  style={{ width: "100%", padding: "10px", borderRadius: "6px", background: "#080c14", border: "1px solid rgba(255,255,255,0.08)", color: "#fff" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#94a3b8", marginBottom: "6px" }}>Client Interaction Notes</label>
                <textarea
                  value={clientForm.notes}
                  onChange={(e) => setClientForm({ ...clientForm, notes: e.target.value })}
                  rows={3}
                  style={{ width: "100%", padding: "10px", borderRadius: "6px", background: "#080c14", border: "1px solid rgba(255,255,255,0.08)", color: "#fff" }}
                />
              </div>

              <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", marginTop: "12px" }}>
                <button type="button" onClick={() => { setShowAddClientModal(false); setEditingClient(null); }} style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "#cbd5e1", padding: "10px 20px", borderRadius: "6px", cursor: "pointer" }}>Cancel</button>
                <button type="submit" style={{ background: "#0f62fe", border: "none", color: "#fff", padding: "10px 20px", borderRadius: "6px", cursor: "pointer", fontWeight: 600 }}>
                  {editingClient ? "Save Changes" : "Create Client"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
