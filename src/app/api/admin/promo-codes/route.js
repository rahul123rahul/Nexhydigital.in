import { NextResponse } from "next/server";
import { getPromoCodes, addPromoCode } from "@/lib/db";
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
    const codes = await getPromoCodes();
    return NextResponse.json(codes);
  } catch (error) {
    console.error("GET admin promo codes error:", error);
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
    if (!body.code || !body.discount_type || body.discount_value === undefined) {
      return NextResponse.json({ error: "Code, discount_type, and discount_value are required" }, { status: 400 });
    }

    const newPromo = {
      id: body.id || `promo-${Date.now()}`,
      code: body.code.toUpperCase().trim(),
      discount_type: body.discount_type, // percentage or fixed
      discount_value: parseFloat(body.discount_value),
      active: body.active ?? true,
      expiry_date: body.expiry_date || ""
    };

    await addPromoCode(newPromo);
    return NextResponse.json({ ok: true, data: newPromo });
  } catch (error) {
    console.error("POST admin promo codes error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
