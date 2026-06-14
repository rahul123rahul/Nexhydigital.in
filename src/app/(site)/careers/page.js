"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { ChevronRight, Briefcase, MapPin, Clock, Grid3x3, List, Search, X } from "lucide-react";

export default function CareersPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", experience: "", coverNote: "" });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  
  // Filter and view state
  const [viewMode, setViewMode] = useState("grid"); // "grid" or "list"
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    department: "",
    jobType: "",
    location: ""
  });
  const [showFilters, setShowFilters] = useState(false);

  const createInitialForm = (job) => {
    if (job?.formSchema?.fields?.length) {
      return job.formSchema.fields.reduce((acc, field) => {
        if (field.type === "checkbox") acc[field.id] = [];
        else if (field.type === "toggle") acc[field.id] = false;
        else acc[field.id] = "";
        return acc;
      }, {});
    }
    return { name: "", email: "", phone: "", experience: "", coverNote: "" };
  };

  // Get unique filter values from jobs
  const getDepartments = () => [...new Set(jobs.map(j => j.dept).filter(Boolean))].sort();
  const getJobTypes = () => [...new Set(jobs.map(j => j.type).filter(Boolean))].sort();
  const getLocations = () => [...new Set(jobs.map(j => j.location || j.loc).filter(Boolean))].sort();

  // Filter jobs based on search and filters
  const getFilteredJobs = () => {
    return jobs.filter(job => {
      const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          job.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          job.dept?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDept = !filters.department || job.dept === filters.department;
      const matchesType = !filters.jobType || job.type === filters.jobType;
      const matchesLocation = !filters.location || (job.location || job.loc) === filters.location;
      
      return matchesSearch && matchesDept && matchesType && matchesLocation;
    });
  };

  const activeFilterCount = Object.values(filters).filter(v => v).length;

  const renderApplyField = (field) => {
    const value = form[field.id] ?? "";
    const handleChange = (nextValue) => setForm((prev) => ({ ...prev, [field.id]: nextValue }));

    switch (field.type) {
      case "email":
        return (
          <div key={field.id}>
            <label style={{ display: "block", fontSize: "0.9rem", fontWeight: 600, marginBottom: "8px" }}>{field.label}{field.required ? " *" : ""}</label>
            <input
              type="email"
              required={field.required}
              value={value}
              onChange={(e) => handleChange(e.target.value)}
              placeholder={field.placeholder}
              style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid var(--line)", background: "var(--surface-alt)", color: "var(--primary)", fontSize: "0.95rem", boxSizing: "border-box" }}
            />
          </div>
        );
      case "phone":
        return (
          <div key={field.id}>
            <label style={{ display: "block", fontSize: "0.9rem", fontWeight: 600, marginBottom: "8px" }}>{field.label}{field.required ? " *" : ""}</label>
            <input
              type="tel"
              required={field.required}
              value={value}
              onChange={(e) => handleChange(e.target.value)}
              placeholder={field.placeholder}
              style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid var(--line)", background: "var(--surface-alt)", color: "var(--primary)", fontSize: "0.95rem", boxSizing: "border-box" }}
            />
          </div>
        );
      case "number":
        return (
          <div key={field.id}>
            <label style={{ display: "block", fontSize: "0.9rem", fontWeight: 600, marginBottom: "8px" }}>{field.label}{field.required ? " *" : ""}</label>
            <input
              type="number"
              required={field.required}
              value={value}
              onChange={(e) => handleChange(e.target.value)}
              placeholder={field.placeholder}
              style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid var(--line)", background: "var(--surface-alt)", color: "var(--primary)", fontSize: "0.95rem", boxSizing: "border-box" }}
            />
          </div>
        );
      case "textarea":
        return (
          <div key={field.id}>
            <label style={{ display: "block", fontSize: "0.9rem", fontWeight: 600, marginBottom: "8px" }}>{field.label}{field.required ? " *" : ""}</label>
            <textarea
              rows={4}
              required={field.required}
              value={value}
              onChange={(e) => handleChange(e.target.value)}
              placeholder={field.placeholder}
              style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid var(--line)", background: "var(--surface-alt)", color: "var(--primary)", fontSize: "0.95rem", fontFamily: "inherit", resize: "vertical", boxSizing: "border-box" }}
            />
          </div>
        );
      case "date":
        return (
          <div key={field.id}>
            <label style={{ display: "block", fontSize: "0.9rem", fontWeight: 600, marginBottom: "8px" }}>{field.label}{field.required ? " *" : ""}</label>
            <input
              type="date"
              required={field.required}
              value={value}
              onChange={(e) => handleChange(e.target.value)}
              style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid var(--line)", background: "var(--surface-alt)", color: "var(--primary)", fontSize: "0.95rem", boxSizing: "border-box" }}
            />
          </div>
        );
      case "time":
        return (
          <div key={field.id}>
            <label style={{ display: "block", fontSize: "0.9rem", fontWeight: 600, marginBottom: "8px" }}>{field.label}{field.required ? " *" : ""}</label>
            <input
              type="time"
              required={field.required}
              value={value}
              onChange={(e) => handleChange(e.target.value)}
              style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid var(--line)", background: "var(--surface-alt)", color: "var(--primary)", fontSize: "0.95rem", boxSizing: "border-box" }}
            />
          </div>
        );
      case "dropdown":
        return (
          <div key={field.id}>
            <label style={{ display: "block", fontSize: "0.9rem", fontWeight: 600, marginBottom: "8px" }}>{field.label}{field.required ? " *" : ""}</label>
            <select
              required={field.required}
              value={value}
              onChange={(e) => handleChange(e.target.value)}
              style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid var(--line)", background: "var(--surface-alt)", color: "var(--primary)", fontSize: "0.95rem", boxSizing: "border-box" }}
            >
              <option value="" hidden>{field.placeholder || "Select an option"}</option>
              {field.options?.map((option) => <option key={option} value={option}>{option}</option>)}
            </select>
          </div>
        );
      case "radio":
        return (
          <div key={field.id}>
            <label style={{ display: "block", fontSize: "0.9rem", fontWeight: 600, marginBottom: "8px" }}>{field.label}{field.required ? " *" : ""}</label>
            <div style={{ display: "grid", gap: "8px" }}>
              {field.options?.map((option) => (
                <label key={option} style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: ".92rem", color: "var(--primary)" }}>
                  <input type="radio" name={field.id} value={option} checked={value === option} onChange={() => handleChange(option)} />
                  {option}
                </label>
              ))}
            </div>
          </div>
        );
      case "checkbox":
        return (
          <div key={field.id}>
            <label style={{ display: "block", fontSize: "0.9rem", fontWeight: 600, marginBottom: "8px" }}>{field.label}{field.required ? " *" : ""}</label>
            <div style={{ display: "grid", gap: "8px" }}>
              {field.options?.map((option) => (
                <label key={option} style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: ".92rem", color: "var(--primary)" }}>
                  <input type="checkbox" checked={(value || []).includes(option)} onChange={(e) => {
                    const next = e.target.checked ? [...(value || []), option] : (value || []).filter((item) => item !== option);
                    handleChange(next);
                  }} />
                  {option}
                </label>
              ))}
            </div>
          </div>
        );
      case "toggle":
        return (
          <div key={field.id} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: ".9rem", color: "var(--primary)" }}>
              <input type="checkbox" checked={!!value} onChange={(e) => handleChange(e.target.checked)} />
              {field.label}
            </label>
          </div>
        );
      case "file":
        return (
          <div key={field.id}>
            <label style={{ display: "block", fontSize: "0.9rem", fontWeight: 600, marginBottom: "8px" }}>{field.label}{field.required ? " *" : ""}</label>
            <input
              type="file"
              required={field.required}
              onChange={(e) => handleChange(e.target.files?.[0]?.name || "")}
              style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--line)", background: "var(--surface-alt)", color: "var(--primary)", fontSize: "0.95rem", boxSizing: "border-box" }}
            />
            {value && <div style={{ marginTop: "8px", color: "var(--muted)", fontSize: ".85rem" }}>Selected file: {value}</div>}
          </div>
        );
      case "rating":
        return (
          <div key={field.id}>
            <label style={{ display: "block", fontSize: "0.9rem", fontWeight: 600, marginBottom: "8px" }}>{field.label}{field.required ? " *" : ""}</label>
            <select
              required={field.required}
              value={value}
              onChange={(e) => handleChange(e.target.value)}
              style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid var(--line)", background: "var(--surface-alt)", color: "var(--primary)", fontSize: "0.95rem", boxSizing: "border-box" }}
            >
              <option value="" hidden>{field.placeholder || "Choose rating"}</option>
              {[1, 2, 3, 4, 5].map((score) => <option key={score} value={score}>{score} Stars</option>)}
            </select>
          </div>
        );
      default:
        return (
          <div key={field.id}>
            <label style={{ display: "block", fontSize: "0.9rem", fontWeight: 600, marginBottom: "8px" }}>{field.label}{field.required ? " *" : ""}</label>
            <input
              type="text"
              required={field.required}
              value={value}
              onChange={(e) => handleChange(e.target.value)}
              placeholder={field.placeholder}
              style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid var(--line)", background: "var(--surface-alt)", color: "var(--primary)", fontSize: "0.95rem", boxSizing: "border-box" }}
            />
          </div>
        );
    }
  };

  useEffect(() => {
    fetch("/api/admin/careers")
      .then((r) => r.json())
      .then((res) => {
        const list = Array.isArray(res) ? res : (res.data || []);
        // Safely parse requirements if they are JSON strings
        const parsedList = list.map(j => ({
          ...j,
          requirements: typeof j.requirements === "string" ? JSON.parse(j.requirements) : j.requirements
        }));
        setJobs(parsedList.filter((j) => j.published));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const getApplyMode = (job) => {
    if (!job) return "internal";
    return job.applyMode || (job.applyLink ? "external" : "internal");
  };

  const trackApplyClick = (jobId) => {
    fetch("/api/careers/click", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobId, action: "external" }),
    }).catch(() => {});
  };

  const openExternalApply = (job) => {
    if (!job?.applyLink) return;
    const target = job.openInNewTab ? "_blank" : "_self";
    window.open(job.applyLink, target);
    trackApplyClick(job.id);
  };

  const handleOpenApply = (job) => {
    const applyMode = getApplyMode(job);
    if (applyMode === "external" && job.applyLink) {
      openExternalApply(job);
      return;
    }

    setSelectedJob(job);
    setForm(createInitialForm(job));
    setSuccess(false);
    setError("");
  };

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const payload = {
        ...form,
        jobId: selectedJob.id,
        source: "Nexhydigital Career Portal",
      };
      const res = await fetch("/api/careers/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.ok) {
        setSuccess(true);
        setTimeout(() => setSelectedJob(null), 2500); // Close after 2.5s
      } else {
        setError(data.error || "Failed to submit application.");
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main style={{ background: "var(--surface)" }}>
      <PageHero
        eyebrow="Careers"
        title="Join the Nexhydigital team in Hyderabad."
        description="We're building real systems for real businesses. If you're passionate about technology and want to make an impact, we'd love to hear from you."
      />

      <section className="section" style={{ background: "var(--surface-alt)" }}>
        <div className="container">
          <Reveal className="section-heading" style={{ marginBottom: "40px" }}>
            <p className="eyebrow">Open Positions</p>
            <h2>{jobs.length > 0 ? `${jobs.length} Role${jobs.length !== 1 ? "s" : ""} Available` : "No Open Positions"}</h2>
            <p className="section-lead">Find your next opportunity with Nexhydigital. All roles are based in Hyderabad unless noted otherwise.</p>
          </Reveal>

          {!loading && jobs.length > 0 && (
            <>
              {/* Search and Filters Bar */}
              <div style={{ marginBottom: "32px" }}>
                {/* Search Box */}
                <div style={{ marginBottom: "20px" }}>
                  <div style={{ position: "relative" }}>
                    <Search size={18} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--muted)", pointerEvents: "none" }} />
                    <input 
                      type="text"
                      placeholder="Search by job title, department, skills..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{ 
                        width: "100%", 
                        padding: "12px 40px",
                        border: "1px solid var(--line)",
                        borderRadius: "10px",
                        background: "var(--surface)",
                        color: "var(--primary)",
                        fontSize: "0.95rem",
                        boxSizing: "border-box",
                        transition: "all 0.3s ease"
                      }}
                      onFocus={(e) => e.target.style.borderColor = "var(--accent)"}
                      onBlur={(e) => e.target.style.borderColor = "var(--line)"}
                    />
                  </div>
                </div>

                {/* Filter Chips and Toggle */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
                    {/* Filter Button */}
                    <button 
                      onClick={() => setShowFilters(!showFilters)}
                      style={{
                        padding: "10px 16px",
                        borderRadius: "8px",
                        border: `2px solid ${showFilters ? "var(--accent)" : "var(--line)"}`,
                        background: showFilters ? "var(--accent-soft)" : "transparent",
                        color: showFilters ? "var(--accent)" : "var(--muted)",
                        fontWeight: 600,
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                        fontSize: "0.9rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px"
                      }}
                    >
                      🔽 Filters {activeFilterCount > 0 && <span style={{ background: "var(--accent)", color: "#fff", borderRadius: "50%", width: "20px", height: "20px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: 700 }}>{activeFilterCount}</span>}
                    </button>

                    {/* Active filter badges */}
                    {activeFilterCount > 0 && (
                      <button
                        onClick={() => setFilters({ department: "", jobType: "", location: "" })}
                        style={{
                          padding: "8px 12px",
                          borderRadius: "6px",
                          border: "none",
                          background: "var(--error)",
                          color: "#fff",
                          cursor: "pointer",
                          fontSize: "0.85rem",
                          fontWeight: 500,
                          opacity: 0.8,
                          transition: "opacity 0.3s"
                        }}
                        onMouseEnter={(e) => e.target.style.opacity = "1"}
                        onMouseLeave={(e) => e.target.style.opacity = "0.8"}
                      >
                        Clear All
                      </button>
                    )}
                  </div>

                  {/* View Mode Toggle */}
                  <div style={{ display: "flex", gap: "4px", background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "8px", padding: "4px" }}>
                    <button
                      onClick={() => setViewMode("grid")}
                      style={{
                        padding: "8px 12px",
                        background: viewMode === "grid" ? "var(--accent)" : "transparent",
                        color: viewMode === "grid" ? "#fff" : "var(--muted)",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                        fontWeight: 500
                      }}
                      title="Grid view"
                    >
                      <Grid3x3 size={16} />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      style={{
                        padding: "8px 12px",
                        background: viewMode === "list" ? "var(--accent)" : "transparent",
                        color: viewMode === "list" ? "#fff" : "var(--muted)",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                        fontWeight: 500
                      }}
                      title="List view"
                    >
                      <List size={16} />
                    </button>
                  </div>
                </div>

                {/* Expandable Filter Panel */}
                {showFilters && (
                  <div style={{
                    marginTop: "16px",
                    padding: "20px",
                    background: "var(--surface)",
                    border: "1px solid var(--line)",
                    borderRadius: "10px",
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                    gap: "20px"
                  }}>
                    {/* Department Filter */}
                    <div>
                      <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", marginBottom: "10px" }}>Department</label>
                      <select
                        value={filters.department}
                        onChange={(e) => setFilters({...filters, department: e.target.value})}
                        style={{
                          width: "100%",
                          padding: "10px",
                          border: "1px solid var(--line)",
                          borderRadius: "8px",
                          background: "var(--surface-alt)",
                          color: "var(--primary)",
                          fontSize: "0.9rem",
                          cursor: "pointer",
                          fontWeight: 500
                        }}
                      >
                        <option value="">All Departments</option>
                        {getDepartments().map((dept, i) => (
                          <option key={i} value={dept}>{dept}</option>
                        ))}
                      </select>
                    </div>

                    {/* Job Type Filter */}
                    <div>
                      <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", marginBottom: "10px" }}>Job Type</label>
                      <select
                        value={filters.jobType}
                        onChange={(e) => setFilters({...filters, jobType: e.target.value})}
                        style={{
                          width: "100%",
                          padding: "10px",
                          border: "1px solid var(--line)",
                          borderRadius: "8px",
                          background: "var(--surface-alt)",
                          color: "var(--primary)",
                          fontSize: "0.9rem",
                          cursor: "pointer",
                          fontWeight: 500
                        }}
                      >
                        <option value="">All Types</option>
                        {getJobTypes().map((type, i) => (
                          <option key={i} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>

                    {/* Location Filter */}
                    <div>
                      <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", marginBottom: "10px" }}>Location</label>
                      <select
                        value={filters.location}
                        onChange={(e) => setFilters({...filters, location: e.target.value})}
                        style={{
                          width: "100%",
                          padding: "10px",
                          border: "1px solid var(--line)",
                          borderRadius: "8px",
                          background: "var(--surface-alt)",
                          color: "var(--primary)",
                          fontSize: "0.9rem",
                          cursor: "pointer",
                          fontWeight: 500
                        }}
                      >
                        <option value="">All Locations</option>
                        {getLocations().map((loc, i) => (
                          <option key={i} value={loc}>{loc}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {/* Results Count */}
              <div style={{ marginBottom: "24px", paddingBottom: "16px", borderBottom: "1px solid var(--line)" }}>
                <p style={{ margin: 0, color: "var(--muted)", fontSize: "0.9rem" }}>
                  Showing <strong style={{ color: "var(--primary)", fontWeight: 700 }}>{getFilteredJobs().length}</strong> of <strong style={{ color: "var(--primary)", fontWeight: 700 }}>{jobs.length}</strong> positions
                </p>
              </div>
            </>
          )}

          {loading ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
              {[1, 2, 3].map((n) => (
                <div key={n} style={{ padding: "24px", background: "var(--surface)", borderRadius: "12px", opacity: 0.5, border: "1px solid var(--line)" }}>
                  Loading job...
                </div>
              ))}
            </div>
          ) : getFilteredJobs().length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 20px", borderRadius: "12px", border: "2px dashed var(--line)", background: "var(--surface)" }}>
              <div style={{ fontSize: "2.4rem", marginBottom: "16px" }}>📭</div>
              <h3>No positions match your search</h3>
              <p style={{ color: "var(--muted)", marginBottom: "20px" }}>Try adjusting your filters or search terms</p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setFilters({ department: "", jobType: "", location: "" });
                }}
                style={{
                  padding: "10px 20px",
                  borderRadius: "8px",
                  border: "1px solid var(--accent)",
                  background: "var(--accent-soft)",
                  color: "var(--accent)",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.3s ease"
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "var(--accent)";
                  e.target.style.color = "#fff";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "var(--accent-soft)";
                  e.target.style.color = "var(--accent)";
                }}
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              {/* Grid View */}
              {viewMode === "grid" && (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "24px" }}>
                  {getFilteredJobs().map((job, i) => (
                    <Reveal key={`${job.id || "job"}-${i}`} delay={i * 0.05}>
                      <div 
                        style={{ 
                          padding: "28px", 
                          background: "var(--surface)", 
                          border: "1px solid var(--line)", 
                          borderRadius: "12px", 
                          display: "flex", 
                          flexDirection: "column", 
                          height: "100%",
                          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                          cursor: "pointer",
                          position: "relative",
                          overflow: "hidden"
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.boxShadow = "0 12px 32px rgba(15, 98, 254, 0.12)";
                          e.currentTarget.style.transform = "translateY(-4px)";
                          e.currentTarget.style.borderColor = "var(--accent)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.boxShadow = "none";
                          e.currentTarget.style.transform = "translateY(0)";
                          e.currentTarget.style.borderColor = "var(--line)";
                        }}
                      >
                        {/* Header */}
                        <div style={{ marginBottom: "16px" }}>
                          <div style={{ display: "flex", gap: "8px", marginBottom: "12px", flexWrap: "wrap" }}>
                            <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", background: "var(--accent-soft)", color: "var(--accent)", padding: "6px 12px", borderRadius: "6px", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase" }}>
                              {job.type || "Full-time"}
                            </span>
                            <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", background: "rgba(107, 168, 255, 0.12)", color: "#4a90e2", padding: "6px 12px", borderRadius: "6px", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase" }}>
                              <MapPin size={12} /> {job.location || job.loc || "Hyderabad"}
                            </span>
                          </div>
                          <h3 style={{ margin: "0 0 8px 0", fontSize: "1.2rem", fontWeight: 700, color: "var(--primary)" }}>{job.title}</h3>
                          <p style={{ margin: 0, color: "var(--accent)", fontSize: "0.9rem", fontWeight: 600 }}>{job.dept}</p>
                        </div>
                        
                        {/* Description */}
                        <p style={{ color: "var(--muted)", fontSize: "0.95rem", lineHeight: "1.6", marginBottom: "16px", flex: 1, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                          {job.description || "Exciting opportunity to make an impact with our team."}
                        </p>

                        {/* Requirements */}
                        {job.requirements?.length > 0 && (
                          <div style={{ marginBottom: "20px" }}>
                            <p style={{ margin: "0 0 10px 0", fontSize: "0.8rem", fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Key Requirements</p>
                            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                              {job.requirements.slice(0, 2).map((req, idx) => (
                                <span key={idx} style={{ fontSize: "0.8rem", background: "var(--surface-alt)", color: "var(--muted)", padding: "4px 10px", borderRadius: "4px", fontWeight: 500 }}>{req}</span>
                              ))}
                              {job.requirements.length > 2 && <span style={{ fontSize: "0.8rem", background: "var(--surface-alt)", color: "var(--muted)", padding: "4px 10px", borderRadius: "4px", fontWeight: 500 }}>+{job.requirements.length - 2}</span>}
                            </div>
                          </div>
                        )}

                        {/* Meta Info */}
                        <div style={{ display: "flex", gap: "16px", fontSize: "0.8rem", color: "var(--muted)", marginBottom: "16px", paddingBottom: "16px", borderBottom: "1px solid var(--line)" }}>
                          <span>Posted {new Date(job.posted).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" })}</span>
                          <span>•</span>
                          <span style={{ color: "var(--success)" }}>Open: {job.open || 1}</span>
                        </div>

                        {/* Apply Button */}
                        <button 
                          onClick={() => handleOpenApply(job)}
                          style={{ 
                            background: "var(--accent)", 
                            color: "#fff", 
                            border: "none", 
                            padding: "12px 20px", 
                            borderRadius: "8px", 
                            fontWeight: 600, 
                            cursor: "pointer", 
                            display: "flex", 
                            alignItems: "center", 
                            justifyContent: "center", 
                            gap: "8px", 
                            width: "100%", 
                            transition: "all 0.3s ease",
                            fontSize: "0.95rem"
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = "#0052cc"}
                          onMouseLeave={(e) => e.currentTarget.style.background = "var(--accent)"}
                        >
                          Apply Now <ChevronRight size={16} />
                        </button>
                      </div>
                    </Reveal>
                  ))}
                </div>
              )}

              {/* List View */}
              {viewMode === "list" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {getFilteredJobs().map((job, i) => (
                    <Reveal key={`${job.id || "job"}-${i}`} delay={i * 0.05}>
                      <div 
                        style={{
                          padding: "20px",
                          background: "var(--surface)",
                          border: "1px solid var(--line)",
                          borderRadius: "10px",
                          display: "grid",
                          gridTemplateColumns: "1fr auto",
                          gap: "20px",
                          alignItems: "center",
                          transition: "all 0.3s ease",
                          cursor: "pointer"
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.boxShadow = "0 8px 24px rgba(15, 98, 254, 0.1)";
                          e.currentTarget.style.borderColor = "var(--accent)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.boxShadow = "none";
                          e.currentTarget.style.borderColor = "var(--line)";
                        }}
                      >
                        <div>
                          <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "12px", flexWrap: "wrap" }}>
                            <h3 style={{ margin: 0, fontSize: "1.15rem", fontWeight: 700, color: "var(--primary)" }}>{job.title}</h3>
                            <span style={{ fontSize: "0.85rem", background: "var(--accent-soft)", color: "var(--accent)", padding: "4px 10px", borderRadius: "4px", fontWeight: 600 }}>
                              {job.type || "Full-time"}
                            </span>
                          </div>
                          <div style={{ display: "flex", gap: "24px", flexWrap: "wrap", marginBottom: "12px", color: "var(--muted)", fontSize: "0.9rem" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                              <Briefcase size={14} />
                              <span style={{ fontWeight: 500 }}>{job.dept}</span>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                              <MapPin size={14} />
                              <span style={{ fontWeight: 500 }}>{job.location || job.loc || "Hyderabad"}</span>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                              <Clock size={14} />
                              <span style={{ fontWeight: 500 }}>Posted {new Date(job.posted).toLocaleDateString("en-IN", { year: "numeric", month: "short" })}</span>
                            </div>
                          </div>
                          <p style={{ margin: 0, color: "var(--muted)", fontSize: "0.9rem", lineHeight: "1.5" }}>
                            {job.description || "Exciting opportunity to make an impact."}
                          </p>
                        </div>
                        <button 
                          onClick={() => handleOpenApply(job)}
                          style={{ 
                            background: "var(--accent)", 
                            color: "#fff", 
                            border: "none", 
                            padding: "12px 24px", 
                            borderRadius: "8px", 
                            fontWeight: 600, 
                            cursor: "pointer", 
                            transition: "all 0.3s ease",
                            fontSize: "0.9rem",
                            whiteSpace: "nowrap",
                            display: "flex",
                            alignItems: "center",
                            gap: "6px"
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = "#0052cc"}
                          onMouseLeave={(e) => e.currentTarget.style.background = "var(--accent)"}
                        >
                          Apply <ChevronRight size={16} />
                        </button>
                      </div>
                    </Reveal>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Application Modal */}
      {selectedJob && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          backdropFilter: "blur(4px)",
          padding: "20px"
        }} onClick={() => setSelectedJob(null)}>
          <div style={{
            background: "var(--surface)",
            padding: "40px",
            borderRadius: "16px",
            width: "100%",
            maxWidth: "600px",
            border: "1px solid var(--line)",
            boxShadow: "0 20px 50px rgba(0, 0, 0, 0.3)",
            maxHeight: "90vh",
            overflow: "auto"
          }} onClick={(e) => e.stopPropagation()}>
            
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "24px" }}>
              <div>
                <p style={{ margin: "0 0 8px 0", fontSize: "0.85rem", color: "var(--muted)", textTransform: "uppercase", fontWeight: 600 }}>Apply for Position</p>
                <h2 style={{ margin: 0, fontSize: "1.6rem" }}>{selectedJob.title}</h2>
              </div>
              <button 
                onClick={() => setSelectedJob(null)}
                style={{ background: "none", border: "none", color: "var(--muted)", fontSize: "24px", cursor: "pointer", padding: 0 }}
              >
                ✕
              </button>
            </div>

            {success ? (
              <div style={{ textAlign: "center", padding: "40px 20px" }}>
                <div style={{ fontSize: "3rem", marginBottom: "16px" }}>✓</div>
                <h3 style={{ margin: "0 0 12px 0", color: "var(--ok)" }}>Application Sent!</h3>
                <p style={{ color: "var(--muted)", margin: 0 }}>Thank you for your interest. Our talent team will review your application and get back to you within 3-5 business days.</p>
              </div>
            ) : (
              <form onSubmit={handleApplySubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                {error && <div style={{ color: "#fff", background: "var(--err)", padding: "12px 16px", borderRadius: "8px", fontSize: "0.9rem" }}>{error}</div>}

                {selectedJob?.applyLink && getApplyMode(selectedJob) === "both" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "20px", padding: "20px", borderRadius: "14px", border: "1px solid var(--line)", background: "var(--surface-alt)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                      <div>
                        <p style={{ margin: 0, fontSize: "0.9rem", color: "var(--muted)" }}>This role supports both external application and internal form submission.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => openExternalApply(selectedJob)}
                        style={{ padding: "12px 18px", borderRadius: "8px", border: "none", background: "var(--accent)", color: "#fff", cursor: "pointer", fontWeight: 600 }}
                      >
                        {selectedJob.applyButtonText || "Apply Now"}
                      </button>
                    </div>
                    <p style={{ margin: 0, color: "var(--muted)", fontSize: "0.88rem" }}>Or complete the internal application below and let our team review your submission directly.</p>
                  </div>
                )}

                {selectedJob?.formSchema?.fields?.length ? (
                  selectedJob.formSchema.fields.map((field) => renderApplyField(field))
                ) : (
                  <>
                    <div>
                      <label style={{ display: "block", fontSize: "0.9rem", fontWeight: 600, marginBottom: "8px" }}>Full Name *</label>
                      <input 
                        type="text" 
                        required 
                        value={form.name} 
                        onChange={e => setForm((prev) => ({ ...prev, name: e.target.value }))}
                        placeholder="Your full name"
                        style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid var(--line)", background: "var(--surface-alt)", color: "var(--primary)", fontSize: "0.95rem", boxSizing: "border-box" }}
                      />
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                      <div>
                        <label style={{ display: "block", fontSize: "0.9rem", fontWeight: 600, marginBottom: "8px" }}>Email *</label>
                        <input 
                          type="email" 
                          required 
                          value={form.email} 
                          onChange={e => setForm((prev) => ({ ...prev, email: e.target.value }))}
                          placeholder="your@email.com"
                          style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid var(--line)", background: "var(--surface-alt)", color: "var(--primary)", fontSize: "0.95rem", boxSizing: "border-box" }}
                        />
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: "0.9rem", fontWeight: 600, marginBottom: "8px" }}>Phone *</label>
                        <input 
                          type="tel" 
                          required 
                          value={form.phone} 
                          onChange={e => setForm((prev) => ({ ...prev, phone: e.target.value }))}
                          placeholder="+91 98765 43210"
                          style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid var(--line)", background: "var(--surface-alt)", color: "var(--primary)", fontSize: "0.95rem", boxSizing: "border-box" }}
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "0.9rem", fontWeight: 600, marginBottom: "8px" }}>Years of Experience</label>
                      <input 
                        type="text" 
                        value={form.experience} 
                        onChange={e => setForm((prev) => ({ ...prev, experience: e.target.value }))}
                        placeholder="e.g. 3.5 years"
                        style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid var(--line)", background: "var(--surface-alt)", color: "var(--primary)", fontSize: "0.95rem", boxSizing: "border-box" }}
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "0.9rem", fontWeight: 600, marginBottom: "8px" }}>Cover Note / Why Nexhydigital?</label>
                      <textarea 
                        rows={4}
                        value={form.coverNote} 
                        onChange={e => setForm((prev) => ({ ...prev, coverNote: e.target.value }))}
                        placeholder="Briefly tell us why you're a great fit for this role..."
                        style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid var(--line)", background: "var(--surface-alt)", color: "var(--primary)", fontSize: "0.95rem", fontFamily: "inherit", resize: "none", boxSizing: "border-box" }}
                      />
                    </div>
                  </>
                )}

                <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "20px", paddingTop: "20px", borderTop: "1px solid var(--line)" }}>
                  <button 
                    type="button" 
                    onClick={() => setSelectedJob(null)}
                    style={{ padding: "12px 24px", borderRadius: "8px", border: "1px solid var(--line)", background: "var(--surface-alt)", color: "var(--primary)", fontWeight: 600, cursor: "pointer" }}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={submitting}
                    style={{ padding: "12px 32px", borderRadius: "8px", border: "none", background: "var(--accent)", color: "#fff", fontWeight: 600, cursor: submitting ? "not-allowed" : "pointer", opacity: submitting ? 0.7 : 1 }}
                  >
                    {submitting ? "Submitting..." : "Submit Application"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
