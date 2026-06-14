import { NextResponse } from "next/server";
import { getAnnouncements } from "@/lib/db";

export async function GET() {
  try {
    const announcements = await getAnnouncements();
    const activeAnnouncements = announcements.filter(a => a.active);
    return NextResponse.json({ ok: true, data: activeAnnouncements });
  } catch (error) {
    console.error("GET announcements error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
