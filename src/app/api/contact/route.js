import { NextResponse } from "next/server";
import { addContactRequest, getContactRequests } from "@/lib/db";
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
    const leads = await getContactRequests();
    return NextResponse.json({ ok: true, data: leads });
  } catch (error) {
    console.error("GET contact error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    if (!body.name || !body.email) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
    }
    await addContactRequest(body);

    // Send emails server-side using EmailJS REST API
    const serviceId = process.env.EMAILJS_SERVICE_ID;
    const publicKey = process.env.EMAILJS_PUBLIC_KEY;
    const privateKey = process.env.EMAILJS_PRIVATE_KEY;
    const adminTemplate = process.env.EMAILJS_ADMIN_TEMPLATE;
    const autoReplyTemplate = process.env.EMAILJS_AUTOREPLY_TEMPLATE;

    if (serviceId && publicKey && privateKey && adminTemplate && autoReplyTemplate) {
      const templateParams = {
        user_name: body.name,
        user_email: body.email,
        user_phone: body.phone || "N/A",
        service: body.service || "N/A",
        budget: body.budget || "N/A",
        message: body.message || "",
      };

      const emailPayload = (templateId) => JSON.stringify({
        service_id: serviceId,
        template_id: templateId,
        user_id: publicKey,
        accessToken: privateKey,
        template_params: templateParams,
      });

      try {
        // Send to Admin
        await fetch("https://api.emailjs.com/api/v1.0/email/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: emailPayload(adminTemplate),
        });

        // Send Auto Reply to Customer
        await fetch("https://api.emailjs.com/api/v1.0/email/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: emailPayload(autoReplyTemplate),
        });

        console.log(`✅ [Contact] Emails dispatched to admin and ${body.email}`);
      } catch (emailErr) {
        console.warn("⚠️ [Contact] EmailJS dispatch failed:", emailErr.message);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("POST contact error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
