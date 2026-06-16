import { NextResponse } from "next/server";
import { updateSubscription, deleteSubscription } from "@/lib/db";
import { verifyJWT } from "@/lib/jwt";

async function checkAdmin(request) {
  const token = request.cookies.get("token")?.value;
  if (!token) return false;
  const payload = await verifyJWT(token);
  return payload && (payload.role === "super_admin" || payload.role === "admin");
}

export async function PATCH(request, { params }) {
  try {
    const isAdmin = await checkAdmin(request);
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const { id } = await params;
    const body = await request.json();
    
    await updateSubscription(id, body);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("PATCH admin subscription error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const isAdmin = await checkAdmin(request);
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const { id } = await params;
    await deleteSubscription(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("DELETE admin subscription error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
