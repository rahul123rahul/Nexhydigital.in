import { NextResponse } from "next/server";
import { getCareers, addCareer } from "@/lib/db";
import { verifyJWT } from "@/lib/jwt";

async function checkAdmin(request) {
  const token = request.cookies.get("token")?.value;
  if (!token) return false;
  const payload = await verifyJWT(token);
  return payload && (payload.role === "super_admin" || payload.role === "admin");
}

export async function GET() {
  try {
    const jobs = await getCareers();
    return NextResponse.json(jobs);
  } catch (error) {
    console.error("GET careers error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const isAdmin = await checkAdmin(request);
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const body = await request.json();
    if (!body.title || !body.dept) {
      return NextResponse.json({ error: "Title and Department are required" }, { status: 400 });
    }

    const newJob = {
      id: body.id || `JOB-${Date.now()}`,
      title: body.title,
      dept: body.dept,
      type: body.type || "Full-time",
      loc: body.loc || body.location || "Hyderabad",
      location: body.location || body.loc || "Hyderabad",
      open: body.open || "1",
      description: body.description || "",
      requirements: Array.isArray(body.requirements) ? body.requirements : [],
      published: body.published ?? true,
      posted: body.posted || new Date().toISOString().slice(0, 10),
      formSchema: body.formSchema || {
        title: "Job Application Form",
        fields: [
          { id: "applicant-name", type: "text", label: "Full Name", placeholder: "Enter your full name", required: true },
          { id: "applicant-email", type: "email", label: "Email Address", placeholder: "name@example.com", required: true },
          { id: "applicant-phone", type: "phone", label: "Phone Number", placeholder: "+91 98765 43210", required: true },
          { id: "experience", type: "textarea", label: "Work Experience", placeholder: "Share your relevant experience", required: false }
        ]
      },
      applyLink: body.applyLink || "",
      applyMode: body.applyMode || (body.applyLink ? "external" : "internal"),
      applyButtonText: body.applyButtonText || "Apply Now",
      openInNewTab: body.openInNewTab ?? true,
      applyClicks: 0,
      submissions: 0
    };

    await addCareer(newJob);
    return NextResponse.json({ ok: true, data: newJob });
  } catch (error) {
    console.error("POST careers error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
