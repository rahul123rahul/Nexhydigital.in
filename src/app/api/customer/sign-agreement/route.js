import { NextResponse } from "next/server";
import { verifyJWT } from "@/lib/jwt";
import {
  getAgreements,
  updateAgreement,
  getProjects,
  updateProject,
  addCRMNotification
} from "@/lib/db";

export async function POST(request) {
  try {
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyJWT(token);
    if (!payload || (payload.role !== "client" && (payload.role !== "super_admin" && payload.role !== "admin"))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { agreementId, signedName } = await request.json();
    if (!agreementId || !signedName) {
      return NextResponse.json(
        { error: "Agreement ID and Electronic Signature are required" },
        { status: 400 }
      );
    }

    const agreements = await getAgreements();
    const agreement = agreements.find(a => a.id === agreementId);
    if (!agreement) {
      return NextResponse.json({ error: "Agreement not found" }, { status: 444 });
    }

    // Update agreement
    const dateStr = new Date().toISOString().slice(0, 10);
    await updateAgreement(agreementId, {
      status: "signed",
      signed_name: signedName,
      signed_at: dateStr
    });

    // Find project record to advance
    const projects = await getProjects();
    const project = projects.find(
      p => p.customer_email?.toLowerCase() === agreement.customer_email?.toLowerCase()
    );
    if (project) {
      await updateProject(project.id, {
        status: "Agreement Signed",
        progress: 40
      });
    }

    // Trigger Notification for Admin
    const timestamp = Date.now();
    await addCRMNotification({
      id: `notif-${timestamp}`,
      message: `✍️ Agreement Signed! ${agreement.customer_name} electronically signed the contract for the ${agreement.plan_name}.`,
      type: "agreement_signed",
      is_read: false
    });

    // G. Send "Agreement Signed / Project Kickoff" email to customer
    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
    const autoReplyTemplate = process.env.NEXT_PUBLIC_EMAILJS_AUTOREPLY_TEMPLATE;

    if (serviceId && publicKey && autoReplyTemplate) {
      try {
        const emailRes = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            service_id: serviceId,
            template_id: autoReplyTemplate,
            user_id: publicKey,
            template_params: {
              user_name: agreement.customer_name,
              user_email: agreement.customer_email,
              user_phone: "N/A",
              service: agreement.plan_name,
              budget: "As per Invoice",
              message: `Your Service Agreement for ${agreement.plan_name} has been successfully signed on ${dateStr}. Signed by: ${signedName}. Your project has now been initiated. Our team will assign a dedicated project manager within 24 hours. You can track your project progress in your client portal at http://localhost:3000/customer/dashboard. Contract ID: ${agreementId}`
            }
          })
        });
        if (emailRes.ok) {
          console.log(`🚀 [Sign Agreement] Project kickoff email dispatched to ${agreement.customer_email}`);
        }
      } catch (err) {
        console.warn("⚠️ [Sign Agreement] Email dispatch failed:", err.message);
      }
    }

    return NextResponse.json({ ok: true, message: "Agreement signed successfully" });

  } catch (error) {
    console.error("Sign agreement error:", error);
    return NextResponse.json(
      { error: "Internal server error occurred" },
      { status: 500 }
    );
  }
}
