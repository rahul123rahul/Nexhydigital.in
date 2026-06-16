import { NextResponse } from "next/server";
import { verifyJWT } from "@/lib/jwt";
import { addTicket, getTickets } from "@/lib/db";

export async function GET(request) {
  try {
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyJWT(token);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tickets = await getTickets();

    if ((payload.role === "super_admin" || payload.role === "admin") || payload.role === "hr_manager" || payload.role === "hr_staff") {
      return NextResponse.json(tickets);
    } else {
      const email = payload.email.toLowerCase();
      const clientTickets = tickets.filter(
        t => t.by?.toLowerCase() === email || t.by_user?.toLowerCase() === email
      );
      return NextResponse.json(clientTickets);
    }
  } catch (error) {
    console.error("Error fetching tickets:", error);
    return NextResponse.json(
      { error: "Internal server error occurred" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyJWT(token);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { sub, cat, pri, desc, assignee, channel, due, slaHours } = body;

    if (!sub || !desc) {
      return NextResponse.json({ error: "Subject and description are required" }, { status: 400 });
    }

    const newTicket = {
      id: body.id || `TKT-${Date.now()}`,
      sub,
      cat: cat || "Technical Support",
      pri: pri || "Medium",
      desc,
      status: "Open",
      by: payload.email,
      date: new Date().toISOString().slice(0, 10),
      assignee: assignee || "Engineering Support",
      channel: channel || "Portal",
      due: due || new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 10),
      slaHours: slaHours || 48,
      resolution: ""
    };

    const res = await addTicket(newTicket);
    if (res && res.ok) {
      return NextResponse.json({ ok: true, ticket: newTicket });
    } else {
      return NextResponse.json({ error: "Failed to persist ticket" }, { status: 500 });
    }

  } catch (error) {
    console.error("Error creating ticket:", error);
    return NextResponse.json(
      { error: "Internal server error occurred" },
      { status: 500 }
    );
  }
}
