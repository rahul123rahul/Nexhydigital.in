import { NextResponse } from "next/server";
import { getSubscriptions, addSubscription } from "@/lib/db";
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
    const subs = await getSubscriptions();
    return NextResponse.json(subs);
  } catch (error) {
    console.error("GET admin subscriptions error:", error);
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
    if (!body.customer_name || !body.customer_email || !body.plan_id) {
      return NextResponse.json({ error: "Customer name, email, and plan_id are required" }, { status: 400 });
    }

    const newSub = {
      id: body.id || `sub-${Date.now()}`,
      customer_name: body.customer_name,
      customer_email: body.customer_email,
      plan_id: body.plan_id,
      billing_cycle: body.billing_cycle || 'one-time',
      status: body.status || 'active', // active, trial, cancelled
      start_date: body.start_date || new Date().toISOString().slice(0, 10),
      trial_end_date: body.trial_end_date || null,
      promo_code: body.promo_code || null
    };

    await addSubscription(newSub);
    return NextResponse.json({ ok: true, data: newSub });
  } catch (error) {
    console.error("POST admin subscriptions error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
