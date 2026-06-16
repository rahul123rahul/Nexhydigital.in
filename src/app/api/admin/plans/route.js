import { NextResponse } from "next/server";
import { getPlans, addPlan } from "@/lib/db";
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
    const plans = await getPlans();
    return NextResponse.json(plans);
  } catch (error) {
    console.error("GET admin plans error:", error);
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
    if (!body.id || !body.name || !body.price) {
      return NextResponse.json({ error: "ID, Name, and Price are required" }, { status: 400 });
    }

    const newPlan = {
      id: body.id,
      name: body.name,
      price: body.price,
      billing_cycle: body.billing_cycle || 'one-time',
      free_trial_days: parseInt(body.free_trial_days || "0"),
      active: body.active ?? true,
      features: body.features || {}
    };

    await addPlan(newPlan);
    return NextResponse.json({ ok: true, data: newPlan });
  } catch (error) {
    console.error("POST admin plans error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
