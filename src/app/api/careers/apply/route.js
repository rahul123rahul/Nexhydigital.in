import { NextResponse } from "next/server";
import { addCandidate, getCareers, updateCareer } from "@/lib/db";

export async function POST(request) {
  try {
    const body = await request.json();
    const { jobId, name, email, phone, experience } = body;

    if (!jobId || !name || !email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newCandidate = {
      id: `CAN-${Math.floor(100000 + Math.random() * 900000)}`,
      name,
      email,
      phone: phone || "",
      experience: experience || "",
      source: body.source || "Nexhydigital Career Portal",
      stage: "Applications",
      score: 75,
      applied: new Date().toISOString().slice(0, 10),
      reason: "Applied via careers portal.",
      job_id: jobId,
      attachments: [],
      formData: body
    };

    await addCandidate(newCandidate);

    // Increment submissions count on career
    try {
      const jobs = await getCareers();
      const job = jobs.find(j => j.id === jobId);
      if (job) {
        await updateCareer(jobId, { submissions: (job.submissions || 0) + 1 });
      }
    } catch (err) {
      console.warn("Failed to increment job submission count:", err);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("POST careers apply error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
