import { NextResponse } from "next/server";
import { getCareers, updateCareer } from "@/lib/db";

export async function POST(request) {
  try {
    const { jobId } = await request.json();
    if (!jobId) {
      return NextResponse.json({ error: "Missing jobId" }, { status: 400 });
    }

    const jobs = await getCareers();
    const job = jobs.find(j => j.id === jobId);
    if (job) {
      await updateCareer(jobId, { applyClicks: (job.applyClicks || 0) + 1 });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("POST careers click tracking error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
