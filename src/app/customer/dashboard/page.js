"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  FileText,
  Clock,
  CheckCircle,
  HelpCircle,
  LogOut,
  Send,
  Plus,
  ArrowRight,
  TrendingUp,
  FileCheck,
  User,
  ShieldCheck,
  AlertCircle
} from "lucide-react";

export default function CustomerDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [clientUser, setClientUser] = useState(null);

  // CRM Data states
  const [invoices, setInvoices] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [agreements, setAgreements] = useState([]);
  const [projects, setProjects] = useState([]);
  const [tickets, setTickets] = useState([]);

  // Agreement Signature States
  const [signedName, setSignedName] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [sigError, setSigError] = useState("");
  const [sigLoading, setSigLoading] = useState(false);
  const [selectedDocType, setSelectedDocType] = useState("agreement"); // 'agreement' or 'proposal'

  // Ticket Form States
  const [showAddTicket, setShowAddTicket] = useState(false);
  const [ticketForm, setTicketForm] = useState({
    sub: "",
    cat: "Technical Support",
    pri: "Medium",
    desc: ""
  });
  const [ticketError, setTicketError] = useState("");
  const [ticketSuccess, setTicketSuccess] = useState("");
  const [ticketLoading, setTicketLoading] = useState(false);

  // Fetch all user session and CRM details on mount
  useEffect(() => {
    fetchSessionAndCRMData();
  }, []);

  const fetchSessionAndCRMData = async () => {
    try {
      const resMe = await fetch("/api/auth/me");
      if (!resMe.ok) {
        router.push("/login");
        return;
      }
      const dataMe = await resMe.json();
      setClientUser(dataMe.user);

      const resCRM = await fetch("/api/customer/dashboard-data");
      if (resCRM.ok) {
        const dataCRM = await resCRM.json();
        setInvoices(dataCRM.invoices || []);
        setProposals(dataCRM.proposals || []);
        setAgreements(dataCRM.agreements || []);
        setProjects(dataCRM.projects || []);
        setTickets(dataCRM.tickets || []);
      } else {
        setError("Failed to retrieve CRM dashboard records.");
      }
    } catch {
      setError("An unexpected error occurred while loading dashboard.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  const handleSignAgreement = async (agreementId) => {
    setSigError("");
    if (!signedName.trim()) {
      setSigError("Please enter your full name as electronic signature.");
      return;
    }
    if (!termsAccepted) {
      setSigError("You must accept the terms of agreement.");
      return;
    }

    setSigLoading(true);
    try {
      const res = await fetch("/api/customer/sign-agreement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agreementId, signedName })
      });
      if (res.ok) {
        // Refresh dashboard statistics
        await fetchSessionAndCRMData();
        setActiveTab("overview");
      } else {
        const data = await res.json();
        setSigError(data.error || "Failed to submit contract signature.");
      }
    } catch {
      setSigError("Failed to communicate signature with server.");
    } finally {
      setSigLoading(false);
    }
  };

  const handleTicketSubmit = async (e) => {
    e.preventDefault();
    setTicketError("");
    setTicketSuccess("");
    if (!ticketForm.sub || !ticketForm.desc) {
      setTicketError("Please complete all ticket fields.");
      return;
    }

    setTicketLoading(true);
    try {
      const newTicket = {
        id: `TKT-${Date.now()}`,
        sub: ticketForm.sub,
        cat: ticketForm.cat,
        pri: ticketForm.pri,
        desc: ticketForm.desc,
        status: "Open",
        by: clientUser.email,
        date: new Date().toISOString().slice(0, 10),
        assignee: "Engineering Support",
        channel: "Portal",
        due: new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 10),
        slaHours: 48,
        resolution: ""
      };

      const res = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTicket)
      });
      if (res.ok) {
        setTicketSuccess("Support ticket raised successfully!");
        setTicketForm({ sub: "", cat: "Technical Support", pri: "Medium", desc: "" });
        setShowAddTicket(false);
        // Refresh ticket list
        fetchSessionAndCRMData();
      } else {
        setTicketError("Failed to post support ticket to helpdesk.");
      }
    } catch {
      setTicketError("Failed to submit ticket request.");
    } finally {
      setTicketLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#080c14", color: "#38bdf8" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: "36px", height: "36px", border: "3px solid rgba(255,255,255,0.05)", borderTopColor: "#38bdf8", borderRadius: "50%", animation: "spinCheck 0.8s linear infinite", margin: "0 auto 16px auto" }} />
          <p style={{ fontWeight: 600 }}>Loading Client Workspace...</p>
        </div>
        <style dangerouslySetInnerHTML={{__html: `@keyframes spinCheck { to { transform: rotate(360deg); } }`}} />
      </div>
    );
  }

  const activeProject = projects[0] || null;
  const activeAgreement = agreements[0] || null;
  const activeProposal = proposals[0] || null;
  const activeInvoice = invoices[0] || null;

  // Pipeline Status list
  const projectPipeline = [
    { status: "New Lead", label: "Lead Setup" },
    { status: "Plan Selected", label: "Plan Configured" },
    { status: "Payment Completed", label: "Subscription Paid" },
    { status: "Proposal Sent", label: "Proposal Ready" },
    { status: "Agreement Signed", label: "Agreement Signed" },
    { status: "Project Assigned", label: "Staff Assigned" },
    { status: "Development Started", label: "Under Development" },
    { status: "Testing", label: "Testing Phase" },
    { status: "Delivery", label: "Delivered Client Review" },
    { status: "Project Completed", label: "Project Completed" }
  ];

  const getPipelineIndex = (status) => {
    return projectPipeline.findIndex(step => step.status.toLowerCase() === status?.toLowerCase());
  };

  const currentPipelineIdx = getPipelineIndex(activeProject?.status || "Payment Completed");

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "250px 1fr",
      minHeight: "100vh",
      background: "#080c14",
      color: "#f8fafc",
      fontFamily: "system-ui, -apple-system, sans-serif"
    }}>
      {/* 1. SIDEBAR PORTAL MENU */}
      <aside style={{ background: "#0f172a", borderRight: "1px solid rgba(255, 255, 255, 0.05)", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "24px 16px" }}>
        <div>
          {/* Brand header */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", paddingBottom: "20px", marginBottom: "36px", borderBottom: "1px solid rgba(255, 255, 255, 0.06)" }}>
            <img 
              src="/logo.png" 
              alt="Nexhify Logo" 
              style={{ 
                height: "32px", 
                width: "auto", 
                objectFit: "contain" 
              }} 
            />
            <div>
              <h2 style={{ fontSize: "0.95rem", fontWeight: 700, margin: 0 }}>Client Workspace</h2>
              <span style={{ fontSize: "0.72rem", color: "#64748b" }}>Nexhydigital CRM</span>
            </div>
          </div>

          {/* Nav Items */}
          <nav style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <button
              onClick={() => setActiveTab("overview")}
              style={{ display: "flex", alignItems: "center", gap: "12px", width: "100%", padding: "12px 16px", borderRadius: "8px", border: "none", background: activeTab === "overview" ? "rgba(15, 98, 254, 0.12)" : "transparent", color: activeTab === "overview" ? "#38bdf8" : "#94a3b8", fontWeight: 600, fontSize: "0.88rem", cursor: "pointer", textAlign: "left" }}
            >
              <TrendingUp size={16} /> Overview & Tracker
            </button>
            <button
              onClick={() => setActiveTab("documents")}
              style={{ display: "flex", alignItems: "center", gap: "12px", width: "100%", padding: "12px 16px", borderRadius: "8px", border: "none", background: activeTab === "documents" ? "rgba(15, 98, 254, 0.12)" : "transparent", color: activeTab === "documents" ? "#38bdf8" : "#94a3b8", fontWeight: 600, fontSize: "0.88rem", cursor: "pointer", textAlign: "left" }}
            >
              <FileCheck size={16} /> Contracts & Invoices {activeAgreement?.status === "pending_signature" && <span style={{ marginLeft: "auto", background: "#f43f5e", color: "#fff", fontSize: "0.68rem", fontWeight: 700, padding: "2px 6px", borderRadius: "4px" }}>Action</span>}
            </button>
            <button
              onClick={() => setActiveTab("tickets")}
              style={{ display: "flex", alignItems: "center", gap: "12px", width: "100%", padding: "12px 16px", borderRadius: "8px", border: "none", background: activeTab === "tickets" ? "rgba(15, 98, 254, 0.12)" : "transparent", color: activeTab === "tickets" ? "#38bdf8" : "#94a3b8", fontWeight: 600, fontSize: "0.88rem", cursor: "pointer", textAlign: "left" }}
            >
              <HelpCircle size={16} /> Helpdesk Tickets
            </button>
          </nav>
        </div>

        {/* User Footer Session */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px", background: "rgba(255, 255, 255, 0.02)", borderRadius: "10px", marginBottom: "12px" }}>
            <div style={{ width: "30px", height: "30px", borderRadius: "50%", background: "#38bdf8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.78rem", fontWeight: 700, color: "#000" }}>
              {clientUser?.name?.substring(0, 2).toUpperCase() || "CL"}
            </div>
            <div style={{ overflow: "hidden" }}>
              <p style={{ margin: 0, fontSize: "0.8rem", fontWeight: 600, color: "#fff" }}>{clientUser?.name}</p>
              <p style={{ margin: 0, fontSize: "0.7rem", color: "#64748b", textOverflow: "ellipsis", overflow: "hidden" }}>{clientUser?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            style={{ display: "flex", alignItems: "center", gap: "8px", width: "100%", padding: "10px", background: "transparent", border: "1px solid rgba(239, 68, 68, 0.2)", color: "#f87171", borderRadius: "8px", cursor: "pointer", fontSize: "0.82rem", fontWeight: 600, justifyContent: "center" }}
          >
            <LogOut size={14} /> Log Out
          </button>
        </div>
      </aside>

      {/* 2. MAIN CLIENT WORKSPACE VIEW */}
      <main style={{ padding: "40px", overflowY: "auto", maxHeight: "100vh", boxSizing: "border-box" }}>
        
        {error && (
          <div style={{ display: "flex", gap: "10px", padding: "14px", background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.2)", borderRadius: "10px", color: "#f87171", fontSize: "0.88rem", marginBottom: "24px" }}>
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {/* TAB 1: OVERVIEW & PIPELINE TRACKER */}
        {activeTab === "overview" && (
          <div>
            <div style={{ marginBottom: "36px" }}>
              <p style={{ margin: 0, fontSize: "0.85rem", color: "#38bdf8", fontWeight: 600 }}>CLIENT ACCOUNT CONTROL</p>
              <h1 style={{ margin: "4px 0 0 0", fontSize: "1.8rem", fontWeight: 700 }}>Your Website Project Workspace</h1>
            </div>

            {/* Plan Info Card */}
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "28px", marginBottom: "40px", alignItems: "start" }}>
              <div style={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "16px", padding: "28px" }}>
                <span style={{ fontSize: "0.75rem", background: "rgba(34, 197, 94, 0.15)", color: "#4ade80", padding: "3px 8px", borderRadius: "4px", fontWeight: 800 }}>ACTIVE SUBSCRIPTION</span>
                <h2 style={{ fontSize: "1.4rem", fontWeight: 700, margin: "10px 0 6px 0" }}>{activeProject?.plan_name || "Enterprise Development Plan"}</h2>
                <p style={{ color: "#cbd5e1", fontSize: "0.88rem", margin: "0 0 20px 0", lineHeight: 1.5 }}>
                  Deploying corporate functional scope. Project specifications are loaded and development setup initialized.
                </p>
                <div style={{ display: "flex", gap: "16px", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "20px", fontSize: "0.82rem" }}>
                  <div>
                    <span style={{ color: "#64748b", display: "block" }}>LATEST INVOICE</span>
                    <strong style={{ color: "#fff" }}>{activeInvoice?.id || "N/A"}</strong>
                  </div>
                  <div style={{ borderLeft: "1px solid rgba(255,255,255,0.05)", paddingLeft: "16px" }}>
                    <span style={{ color: "#64748b", display: "block" }}>PAYMENT STATUS</span>
                    <strong style={{ color: "#10b981" }}>✓ Paid & Confirmed</strong>
                  </div>
                  <div style={{ borderLeft: "1px solid rgba(255,255,255,0.05)", paddingLeft: "16px" }}>
                    <span style={{ color: "#64748b", display: "block" }}>LAUNCH DATE</span>
                    <strong style={{ color: "#fff" }}>{activeProject?.created_at?.slice(0, 10) || "Recent"}</strong>
                  </div>
                </div>
              </div>

              {/* Action alert card */}
              {activeAgreement?.status === "pending_signature" && (
                <div style={{ background: "rgba(168, 85, 247, 0.05)", border: "1px solid rgba(168, 85, 247, 0.2)", borderRadius: "16px", padding: "24px", display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%", boxSizing: "border-box" }}>
                  <div>
                    <h4 style={{ margin: "0 0 8px 0", color: "#c084fc", fontSize: "0.95rem", fontWeight: 700 }}>Contract Awaiting Signature</h4>
                    <p style={{ margin: 0, fontSize: "0.8rem", color: "#94a3b8", lineHeight: 1.5 }}>
                      Please review your proposal details and sign the service contract agreement to proceed development assignment.
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab("documents")}
                    style={{ background: "#a855f7", color: "#fff", border: "none", borderRadius: "8px", padding: "10px", fontSize: "0.8rem", fontWeight: 700, cursor: "pointer", marginTop: "20px", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}
                  >
                    View & Sign Contract <ArrowRight size={14} />
                  </button>
                </div>
              )}
            </div>

            {/* Development pipeline progress tracker */}
            <div style={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "16px", padding: "32px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700 }}>Development Progress Pipeline</h3>
                <span style={{ fontSize: "0.85rem", background: "rgba(56, 189, 248, 0.15)", color: "#38bdf8", padding: "3px 8px", borderRadius: "4px", fontWeight: 700 }}>
                  Stage: {activeProject?.status || "Payment Completed"}
                </span>
              </div>

              {/* Progress Bar */}
              <div style={{ height: "10px", background: "rgba(255,255,255,0.03)", borderRadius: "999px", overflow: "hidden", marginBottom: "32px" }}>
                <div style={{ height: "100%", width: `${activeProject?.progress || 20}%`, background: "linear-gradient(90deg, #0f62fe, #00d4ff)", borderRadius: "999px" }} />
              </div>

              {/* Flow Steps Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "16px" }}>
                {projectPipeline.slice(2).map((stepItem, idx) => {
                  // projectPipeline.slice(2) filters from Payment Completed downwards
                  const stepIndexInFull = idx + 2;
                  const isCompleted = stepIndexInFull < currentPipelineIdx;
                  const isActive = stepIndexInFull === currentPipelineIdx;

                  return (
                    <div key={stepItem.status} style={{ textAlign: "center" }}>
                      <div style={{
                        width: "30px",
                        height: "30px",
                        borderRadius: "50%",
                        background: isCompleted ? "#22c55e" : isActive ? "#0f62fe" : "rgba(255,255,255,0.02)",
                        border: `2px solid ${isCompleted ? "#22c55e" : isActive ? "#38bdf8" : "rgba(255,255,255,0.08)"}`,
                        color: isCompleted || isActive ? "#fff" : "#64748b",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.8rem",
                        fontWeight: 700,
                        marginBottom: "10px"
                      }}>
                        {isCompleted ? "✓" : idx + 1}
                      </div>
                      <h4 style={{ margin: 0, fontSize: "0.8rem", color: isActive ? "#38bdf8" : isCompleted ? "#cbd5e1" : "#64748b", fontWeight: isActive ? 700 : 500 }}>
                        {stepItem.label}
                      </h4>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: DOCUMENTS, PROPOSALS & CONTRACT AGREEMENT */}
        {activeTab === "documents" && (
          <div>
            <div style={{ marginBottom: "36px" }}>
              <p style={{ margin: 0, fontSize: "0.85rem", color: "#38bdf8", fontWeight: 600 }}>PROJECT DOCUMENTS</p>
              <h1 style={{ margin: "4px 0 0 0", fontSize: "1.8rem", fontWeight: 700 }}>Generated Contracts & Invoices</h1>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "36px", alignItems: "start" }}>
              
              {/* Proposal and Agreement Content panel */}
              <div style={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "16px", padding: "28px" }}>
                <div style={{ display: "flex", gap: "12px", borderBottom: "1px solid rgba(255,255,255,0.08)", marginBottom: "20px", paddingBottom: "8px" }}>
                  <button
                    onClick={() => setSelectedDocType("agreement")}
                    style={{
                      background: "transparent",
                      border: "none",
                      borderBottom: selectedDocType === "agreement" ? "2px solid #38bdf8" : "2px solid transparent",
                      color: selectedDocType === "agreement" ? "#38bdf8" : "#94a3b8",
                      padding: "8px 16px",
                      fontWeight: 600,
                      fontSize: "0.95rem",
                      cursor: "pointer",
                      transition: "all 0.2s"
                    }}
                  >
                    Service Agreement
                  </button>
                  <button
                    onClick={() => setSelectedDocType("proposal")}
                    style={{
                      background: "transparent",
                      border: "none",
                      borderBottom: selectedDocType === "proposal" ? "2px solid #38bdf8" : "2px solid transparent",
                      color: selectedDocType === "proposal" ? "#38bdf8" : "#94a3b8",
                      padding: "8px 16px",
                      fontWeight: 600,
                      fontSize: "0.95rem",
                      cursor: "pointer",
                      transition: "all 0.2s"
                    }}
                  >
                    Project Proposal
                  </button>
                </div>
                
                <div style={{ background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: "8px", padding: "20px", fontSize: "0.88rem", lineHeight: 1.6, color: "#cbd5e1", maxHeight: "500px", overflowY: "auto", fontFamily: "monospace", whiteSpace: "pre-wrap" }}>
                  {selectedDocType === "agreement" 
                    ? (activeAgreement?.content || "No Service Agreement contract generated yet.")
                    : (activeProposal?.content || "No Project Proposal generated yet.")
                  }
                </div>
              </div>

              {/* Electronic Signature widget */}
              <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
                
                {/* Contract Status / Signing form */}
                <div style={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "16px", padding: "24px" }}>
                  <h4 style={{ margin: "0 0 16px 0", fontSize: "1rem", fontWeight: 700 }}>Contract Signature</h4>

                  {activeAgreement?.status === "signed" ? (
                    <div style={{ textAlign: "center", padding: "20px 0" }}>
                      <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "rgba(34, 197, 94, 0.1)", color: "#22c55e", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: "16px", border: "1px solid rgba(34,197,94,0.2)" }}>
                        <ShieldCheck size={24} />
                      </div>
                      <h4 style={{ margin: "0 0 4px 0", color: "#4ade80", fontWeight: 700 }}>Agreement Signed</h4>
                      <p style={{ margin: 0, fontSize: "0.78rem", color: "#94a3b8" }}>
                        Electronically signed by <strong>{activeAgreement.signed_name}</strong> on {activeAgreement.signed_at}.
                      </p>
                    </div>
                  ) : (
                    <div>
                      {sigError && (
                        <div style={{ display: "flex", gap: "8px", padding: "10px", background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.2)", borderRadius: "6px", color: "#f87171", fontSize: "0.8rem", marginBottom: "16px" }}>
                          <AlertCircle size={14} style={{ flexShrink: 0 }} />
                          <span>{sigError}</span>
                        </div>
                      )}
                      
                      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                        <div>
                          <label style={{ display: "block", fontSize: "0.8rem", color: "#94a3b8", marginBottom: "8px", fontWeight: 600 }}>Type Full Name *</label>
                          <input
                            type="text"
                            placeholder="Johnathan Doe"
                            value={signedName}
                            onChange={(e) => setSignedName(e.target.value)}
                            style={{ width: "100%", padding: "10px", background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "6px", color: "#fff", outline: "none", boxSizing: "border-box", fontSize: "0.88rem" }}
                          />
                        </div>

                        <label style={{ display: "flex", gap: "10px", alignItems: "flex-start", cursor: "pointer", fontSize: "0.78rem", color: "#94a3b8", lineHeight: 1.4 }}>
                          <input
                            type="checkbox"
                            checked={termsAccepted}
                            onChange={(e) => setTermsAccepted(e.target.checked)}
                            style={{ marginTop: "2px" }}
                          />
                          <span>I accept the terms of the service agreement and consent to electronically signing this legal contract.</span>
                        </label>

                        <button
                          onClick={() => handleSignAgreement(activeAgreement?.id)}
                          disabled={sigLoading}
                          style={{ width: "100%", background: "#0f62fe", color: "#fff", border: "none", borderRadius: "8px", padding: "12px", fontSize: "0.85rem", fontWeight: 700, cursor: sigLoading ? "not-allowed" : "pointer" }}
                        >
                          {sigLoading ? "Submitting Signature..." : "Sign Agreement Electronically"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Project Proposal reference details */}
                <div style={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "16px", padding: "24px" }}>
                  <h4 style={{ margin: "0 0 12px 0", fontSize: "1rem", fontWeight: 700 }}>Project Invoice Summary</h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "0.8rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: "#64748b" }}>Invoice ID</span>
                      <strong>{activeInvoice?.id || "N/A"}</strong>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: "#64748b" }}>Base Scope</span>
                      <strong>{activeInvoice?.plan_name || "N/A"}</strong>
                    </div>
                    {activeInvoice?.add_ons?.map((add, idx) => (
                      <div key={idx} style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ color: "#64748b" }}>+ {add.name}</span>
                        <strong>₹{parseFloat(add.cost).toLocaleString("en-IN")}</strong>
                      </div>
                    ))}
                    <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "10px", fontSize: "0.88rem" }}>
                      <span style={{ fontWeight: 700, color: "#fff" }}>Total Cost Paid</span>
                      <strong style={{ color: "#10b981", fontWeight: 800 }}>₹{activeInvoice?.cost?.toLocaleString("en-IN")}</strong>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* TAB 3: HELPDESK TICKETS */}
        {activeTab === "tickets" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "36px" }}>
              <div>
                <p style={{ margin: 0, fontSize: "0.85rem", color: "#38bdf8", fontWeight: 600 }}>HELPDESK SUPPORT</p>
                <h1 style={{ margin: "4px 0 0 0", fontSize: "1.8rem", fontWeight: 700 }}>Support Tickets Raised</h1>
              </div>
              <button
                onClick={() => setShowAddTicket(!showAddTicket)}
                style={{ background: "#0f62fe", color: "#fff", border: "none", padding: "10px 18px", borderRadius: "8px", fontWeight: 600, fontSize: "0.85rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}
              >
                <Plus size={14} /> Open Support Ticket
              </button>
            </div>

            {/* Support Ticket Creation Form */}
            {showAddTicket && (
              <div style={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "16px", padding: "28px", marginBottom: "32px" }}>
                <h3 style={{ margin: "0 0 20px 0", fontSize: "1.1rem", fontWeight: 700 }}>Open Support Request</h3>

                {ticketError && (
                  <div style={{ display: "flex", gap: "8px", padding: "10px", background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.2)", borderRadius: "6px", color: "#f87171", fontSize: "0.8rem", marginBottom: "16px" }}>
                    <AlertCircle size={14} style={{ flexShrink: 0 }} />
                    <span>{ticketError}</span>
                  </div>
                )}
                {ticketSuccess && (
                  <div style={{ display: "flex", gap: "8px", padding: "10px", background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.2)", borderRadius: "6px", color: "#4ade80", fontSize: "0.8rem", marginBottom: "16px" }}>
                    <CheckCircle size={14} style={{ flexShrink: 0 }} />
                    <span>{ticketSuccess}</span>
                  </div>
                )}

                <form onSubmit={handleTicketSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr", gap: "16px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.8rem", color: "#94a3b8", marginBottom: "6px", fontWeight: 600 }}>Ticket Subject *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Email account configuration issue"
                        value={ticketForm.sub}
                        onChange={(e) => setTicketForm({ ...ticketForm, sub: e.target.value })}
                        style={{ width: "100%", padding: "10px", background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "6px", color: "#fff", outline: "none", boxSizing: "border-box", fontSize: "0.88rem" }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "0.8rem", color: "#94a3b8", marginBottom: "6px", fontWeight: 600 }}>Category</label>
                      <select
                        value={ticketForm.cat}
                        onChange={(e) => setTicketForm({ ...ticketForm, cat: e.target.value })}
                        style={{ width: "100%", padding: "10px", background: "#080c14", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "6px", color: "#fff", outline: "none", cursor: "pointer", fontSize: "0.88rem" }}
                      >
                        <option value="Technical Support">Technical Support</option>
                        <option value="Billing & Pricing">Billing & Pricing</option>
                        <option value="Change Request">Change Request</option>
                        <option value="General Query">General Query</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "0.8rem", color: "#94a3b8", marginBottom: "6px", fontWeight: 600 }}>Priority</label>
                      <select
                        value={ticketForm.pri}
                        onChange={(e) => setTicketForm({ ...ticketForm, pri: e.target.value })}
                        style={{ width: "100%", padding: "10px", background: "#080c14", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "6px", color: "#fff", outline: "none", cursor: "pointer", fontSize: "0.88rem" }}
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.8rem", color: "#94a3b8", marginBottom: "6px", fontWeight: 600 }}>Detailed Description *</label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Outline technical symptoms, steps to reproduce, or requested changes..."
                      value={ticketForm.desc}
                      onChange={(e) => setTicketForm({ ...ticketForm, desc: e.target.value })}
                      style={{ width: "100%", padding: "12px", background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "6px", color: "#fff", outline: "none", boxSizing: "border-box", fontFamily: "inherit", resize: "vertical", fontSize: "0.88rem" }}
                    />
                  </div>

                  <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                    <button
                      type="button"
                      onClick={() => setShowAddTicket(false)}
                      style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "#94a3b8", padding: "10px 16px", borderRadius: "6px", cursor: "pointer", fontSize: "0.85rem" }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={ticketLoading}
                      style={{ background: "#0f62fe", color: "#fff", border: "none", padding: "10px 20px", borderRadius: "6px", fontWeight: 600, cursor: ticketLoading ? "not-allowed" : "pointer", fontSize: "0.85rem" }}
                    >
                      {ticketLoading ? "Submitting..." : "Raise Ticket"}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Ticket Lists */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {tickets.length === 0 ? (
                <div style={{ textAlign: "center", padding: "48px", background: "#0f172a", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <HelpCircle size={32} style={{ margin: "0 auto 12px auto", color: "#64748b" }} />
                  <p style={{ margin: 0, color: "#64748b", fontWeight: 600 }}>No helpdesk tickets raised.</p>
                </div>
              ) : (
                tickets.map(t => (
                  <div key={t.id} style={{ padding: "20px", background: "#0f172a", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "12px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                      <div>
                        <strong style={{ fontSize: "1rem", color: "#fff" }}>{t.sub}</strong>
                        <span style={{ fontSize: "0.72rem", color: "#64748b", marginLeft: "12px" }}>ID: {t.id} • Category: {t.cat}</span>
                      </div>
                      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                        <span style={{ padding: "3px 6px", borderRadius: "4px", fontSize: "0.68rem", fontWeight: 800, background: t.pri === "High" ? "rgba(239, 68, 68, 0.15)" : "rgba(255,255,255,0.05)", color: t.pri === "High" ? "#f87171" : "#94a3b8" }}>
                          {t.pri} Priority
                        </span>
                        <span style={{ padding: "3px 8px", borderRadius: "4px", fontSize: "0.7rem", fontWeight: 700, background: t.status === "Open" ? "rgba(234, 179, 8, 0.15)" : "rgba(34, 197, 94, 0.15)", color: t.status === "Open" ? "#facc15" : "#4ade80" }}>
                          {t.status}
                        </span>
                      </div>
                    </div>
                    <p style={{ margin: "0 0 12px 0", fontSize: "0.85rem", color: "#cbd5e1", lineHeight: 1.5 }}>{t.desc}</p>
                    <div style={{ borderTop: "1px solid rgba(255,255,255,0.04)", paddingTop: "10px", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.78rem", color: "#64748b" }}>
                      <span>Raised on {t.date} • Assigned to: <strong style={{ color: "#cbd5e1" }}>{t.assignee}</strong></span>
                      {t.resolution && <span style={{ color: "#4ade80" }}><strong>Resolution:</strong> {t.resolution}</span>}
                    </div>
                  </div>
                ))
              )}
            </div>

          </div>
        )}

      </main>
    </div>
  );
}
