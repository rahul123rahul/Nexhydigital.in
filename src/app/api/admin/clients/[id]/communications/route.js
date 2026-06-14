import { NextResponse } from "next/server";
import { verifyJWT } from "@/lib/jwt";
import { getClientCommunications, addCommunication } from "@/lib/db";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const token = request.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const payload = await verifyJWT(token);
    if (!payload || payload.role !== "super_admin")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // id here is the client id, we need email
    // Accept email as a query param or from client lookup
    const url = new URL(request.url);
    const email = url.searchParams.get("email") || id;

    const comms = await getClientCommunications(email);
    return NextResponse.json({ ok: true, communications: comms });
  } catch (err) {
    console.error("GET /api/admin/clients/[id]/communications error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  try {
    const { id } = await params;
    const token = request.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const payload = await verifyJWT(token);
    if (!payload || payload.role !== "super_admin")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { client_email, type, subject, message } = body;

    if (!client_email || !type || !message) {
      return NextResponse.json({ error: "client_email, type, and message are required" }, { status: 400 });
    }

    const commId = "COMM-" + Date.now();
    await addCommunication({
      id: commId,
      client_email,
      type,
      subject: subject || "",
      message,
      sent_by: payload.name || "Admin"
    });

    // If type is email and EmailJS is configured, dispatch a real email
    if (type === "email") {
      const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
      const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
      const template = process.env.NEXT_PUBLIC_EMAILJS_AUTOREPLY_TEMPLATE;
      if (serviceId && publicKey && template) {
        try {
          await fetch("https://api.emailjs.com/api/v1.0/email/send", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              service_id: serviceId,
              template_id: template,
              user_id: publicKey,
              template_params: {
                user_email: client_email,
                user_name: "Valued Client",
                service: subject || "Message from Nexhydigital",
                budget: "",
                message,
                user_phone: ""
              }
            })
          });
        } catch (e) {
          console.warn("Email dispatch failed:", e.message);
        }
      }
    }

    return NextResponse.json({ ok: true, id: commId });
  } catch (err) {
    console.error("POST /api/admin/clients/[id]/communications error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
