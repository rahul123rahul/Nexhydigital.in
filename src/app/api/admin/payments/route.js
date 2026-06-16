import { NextResponse } from "next/server";
import { getPayments, addPayment } from "@/lib/db";
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
    const payments = await getPayments();
    return NextResponse.json(payments);
  } catch (error) {
    console.error("GET admin payments error:", error);
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
    if (!body.subscription_id || body.amount === undefined) {
      return NextResponse.json({ error: "subscription_id and amount are required" }, { status: 400 });
    }

    const newPayment = {
      id: body.id || `pay-${Date.now()}`,
      subscription_id: body.subscription_id,
      amount: parseFloat(body.amount),
      payment_date: body.payment_date || new Date().toISOString().slice(0, 10),
      status: body.status || 'paid', // paid, failed, refunded
      payment_method: body.payment_method || 'UPI'
    };

    await addPayment(newPayment);
    return NextResponse.json({ ok: true, data: newPayment });
  } catch (error) {
    console.error("POST admin payments error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
