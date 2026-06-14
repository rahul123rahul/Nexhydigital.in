import { NextResponse } from "next/server";
import { getProjects, addProject } from "@/lib/db";
import { verifyJWT } from "@/lib/jwt";

async function checkAdmin(request) {
  const token = request.cookies.get("token")?.value;
  if (!token) return false;
  const payload = await verifyJWT(token);
  return payload && payload.role === "super_admin";
}

export async function GET(request) {
  try {
    const isAdmin = await checkAdmin(request);
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const projects = await getProjects();
    return NextResponse.json(projects);
  } catch (error) {
    console.error("GET admin projects error:", error);
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
    if (!body.customer_name || !body.customer_email || !body.plan_name) {
      return NextResponse.json({ error: "Name, Email, and Plan are required" }, { status: 400 });
    }

    const projId = `PROJ-${Date.now()}`;
    const newProj = {
      id: projId,
      customer_name: body.customer_name,
      customer_email: body.customer_email,
      company_name: body.company_name || "Individual",
      plan_name: body.plan_name,
      status: body.status || "New Lead",
      progress: parseInt(body.progress || "0"),
      assigned_to: body.assigned_to || "Unassigned",
      requirements: body.requirements || ""
    };

    await addProject(newProj);
    return NextResponse.json({ ok: true, data: newProj });
  } catch (error) {
    console.error("POST admin projects error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
