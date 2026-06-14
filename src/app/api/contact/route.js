import { NextResponse } from "next/server";
import { addContactRequest, getContactRequests } from "@/lib/db";
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
    const leads = await getContactRequests();
    return NextResponse.json({ ok: true, data: leads });
  } catch (error) {
    console.error("GET contact error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    if (!body.name || !body.email) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
    }
    await addContactRequest(body);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("POST contact error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
