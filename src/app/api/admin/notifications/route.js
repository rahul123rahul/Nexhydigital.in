import { NextResponse } from "next/server";
import { getCRMNotifications, markCRMNotificationsRead } from "@/lib/db";
import { verifyJWT } from "@/lib/jwt";

async function checkAdmin(request) {
  const token = request.cookies.get("token")?.value;
  if (!token) return false;
  const payload = await verifyJWT(token);
  return payload && (payload.role === "super_admin" || payload.role === "admin");
}

export async function GET(request) {
  try {
    const isAdmin = await checkAdmin(request);
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const notifs = await getCRMNotifications();
    return NextResponse.json(notifs);
  } catch (error) {
    console.error("GET admin notifications error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const isAdmin = await checkAdmin(request);
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await markCRMNotificationsRead();
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("PATCH admin notifications error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
