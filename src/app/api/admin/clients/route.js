import { NextResponse } from "next/server";
import { verifyJWT } from "@/lib/jwt";
import { getClients, addClient, getSubscriptions, getProjects, getInvoices, getAgreements, getProposals, getTickets } from "@/lib/db";

export async function GET(request) {
  try {
    const token = request.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const payload = await verifyJWT(token);
    if (!payload || payload.role !== "super_admin")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const [clients, subscriptions, projects, invoices, agreements, proposals, tickets] = await Promise.all([
      getClients(),
      getSubscriptions(),
      getProjects(),
      getInvoices(),
      getAgreements(),
      getProposals(),
      getTickets()
    ]);

    // Enrich each client with related CRM data
    const enriched = clients.map(client => {
      const email = client.email.toLowerCase();
      const sub = subscriptions.find(s => s.customer_email?.toLowerCase() === email);
      const project = projects.find(p => p.customer_email?.toLowerCase() === email);
      const clientInvoices = invoices.filter(i => {
        const s = subscriptions.find(s2 => s2.id === i.subscription_id);
        return s && s.customer_email?.toLowerCase() === email;
      });
      const agreement = agreements.find(a => a.customer_email?.toLowerCase() === email);
      const proposal = proposals.find(p => p.customer_email?.toLowerCase() === email);
      const clientTickets = tickets.filter(t => t.by?.toLowerCase() === email || t.by_user?.toLowerCase() === email);
      const totalPaid = clientInvoices.reduce((sum, inv) => sum + parseFloat(inv.cost || 0), 0);

      return {
        ...client,
        subscription: sub || null,
        project: project || null,
        invoices: clientInvoices,
        agreement: agreement || null,
        proposal: proposal || null,
        tickets: clientTickets,
        totalPaid,
        plan_name: sub ? sub.plan_id : null,
        subscription_status: sub ? sub.status : null
      };
    });

    return NextResponse.json({ ok: true, clients: enriched });
  } catch (err) {
    console.error("GET /api/admin/clients error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const token = request.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const payload = await verifyJWT(token);
    if (!payload || payload.role !== "super_admin")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { name, company_name, email, phone, address, gst_number, tax_details, notes, status } = body;

    if (!name || !email) {
      return NextResponse.json({ error: "Name and Email are required" }, { status: 400 });
    }

    const id = "CLT-" + Date.now();
    await addClient({ id, name, company_name: company_name || "", email, phone: phone || "", address: address || "", gst_number: gst_number || "", tax_details: tax_details || "", notes: notes || "", status: status || "Lead" });

    return NextResponse.json({ ok: true, id });
  } catch (err) {
    console.error("POST /api/admin/clients error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
