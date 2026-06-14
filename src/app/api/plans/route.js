import { NextResponse } from "next/server";
import { getPlans } from "@/lib/db";

export async function GET() {
  try {
    const plans = await getPlans();
    const activePlans = plans.filter(p => p.active);
    return NextResponse.json({ ok: true, data: activePlans });
  } catch (error) {
    console.error("GET plans error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
