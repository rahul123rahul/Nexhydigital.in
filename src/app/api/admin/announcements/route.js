import { NextResponse } from "next/server";
import { getAnnouncements, addAnnouncement } from "@/lib/db";
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
    const announcements = await getAnnouncements();
    return NextResponse.json(announcements);
  } catch (error) {
    console.error("GET admin announcements error:", error);
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
    if (!body.message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const newAnn = {
      id: body.id || `ann-${Date.now()}`,
      message: body.message,
      active: body.active ?? true,
      created_at: new Date().toISOString()
    };

    await addAnnouncement(newAnn);
    return NextResponse.json({ ok: true, data: newAnn });
  } catch (error) {
    console.error("POST admin announcements error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
