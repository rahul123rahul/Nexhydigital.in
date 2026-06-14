import { NextResponse } from "next/server";
import { updateProject, getProjects } from "@/lib/db";
import { verifyJWT } from "@/lib/jwt";

async function checkAdmin(request) {
  const token = request.cookies.get("token")?.value;
  if (!token) return false;
  const payload = await verifyJWT(token);
  return payload && payload.role === "super_admin";
}

export async function PATCH(request, { params }) {
  try {
    const isAdmin = await checkAdmin(request);
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // In Next.js 16/App Router dynamic routes, params must be awaited or resolved
    const resolvedParams = await params;
    const { id } = resolvedParams;

    const body = await request.json();
    const updateFields = {};
    
    if (body.status !== undefined) updateFields.status = body.status;
    if (body.progress !== undefined) updateFields.progress = parseInt(body.progress || "0");
    if (body.assigned_to !== undefined) updateFields.assigned_to = body.assigned_to;
    if (body.requirements !== undefined) updateFields.requirements = body.requirements;

    await updateProject(id, updateFields);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("PATCH admin projects error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
