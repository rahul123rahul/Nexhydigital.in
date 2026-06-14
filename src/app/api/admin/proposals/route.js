import { NextResponse } from "next/server";
import { getInvoices, getProposals, getAgreements, addProposal, addAgreement } from "@/lib/db";
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

    const [invoices, proposals, agreements] = await Promise.all([
      getInvoices(),
      getProposals(),
      getAgreements()
    ]);

    return NextResponse.json({
      ok: true,
      invoices,
      proposals,
      agreements
    });
  } catch (error) {
    console.error("GET admin documents error:", error);
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
    const { type, id, customer_email, customer_name, company_name, plan_name, cost, content, status } = body;

    if (!type || !id || !customer_email || !customer_name || !plan_name) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (type === "proposal") {
      await addProposal({
        id,
        customer_email,
        customer_name,
        company_name: company_name || "Individual",
        plan_name,
        cost: parseFloat(cost || 0),
        content,
        status: status || "draft"
      });
    } else if (type === "agreement") {
      await addAgreement({
        id,
        customer_email,
        customer_name,
        plan_name,
        content,
        status: status || "draft"
      });
    } else {
      return NextResponse.json({ error: "Invalid document type" }, { status: 400 });
    }

    return NextResponse.json({ ok: true, message: `${type} generated successfully.` });
  } catch (err) {
    console.error("POST admin documents error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
