import { NextResponse } from "next/server";
import { verifyJWT } from "@/lib/jwt";
import {
  getInvoices,
  getProposals,
  getAgreements,
  getProjects,
  getTickets,
  getSubscriptions
} from "@/lib/db";

export async function GET(request) {
  try {
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyJWT(token);
    if (!payload || (payload.role !== "client" && payload.role !== "super_admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const email = payload.email.toLowerCase();

    // Fetch lists
    const [
      invoices,
      proposals,
      agreements,
      projects,
      tickets,
      subscriptions
    ] = await Promise.all([
      getInvoices(),
      getProposals(),
      getAgreements(),
      getProjects(),
      getTickets(),
      getSubscriptions()
    ]);

    // Filter by client identity
    const clientInvoices = invoices.filter(inv => {
      const sub = subscriptions.find(s => s.id === inv.subscription_id);
      return sub && sub.customer_email?.toLowerCase() === email;
    });

    const clientProposals = proposals.filter(
      p => p.customer_email?.toLowerCase() === email
    );

    const clientAgreements = agreements.filter(
      a => a.customer_email?.toLowerCase() === email
    );

    const clientProjects = projects.filter(
      proj => proj.customer_email?.toLowerCase() === email
    );

    const clientTickets = tickets.filter(
      t => t.by?.toLowerCase() === email || t.by_user?.toLowerCase() === email
    );

    return NextResponse.json({
      ok: true,
      invoices: clientInvoices,
      proposals: clientProposals,
      agreements: clientAgreements,
      projects: clientProjects,
      tickets: clientTickets
    });

  } catch (error) {
    console.error("Dashboard data fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error occurred" },
      { status: 500 }
    );
  }
}
