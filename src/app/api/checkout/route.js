import { NextResponse } from "next/server";
import { addUser, findUserByIdentifier } from "@/lib/users";
import {
  addSubscription,
  addPayment,
  addInvoice,
  addProposal,
  addAgreement,
  addProject,
  addCRMNotification,
  getPlans,
  getPromoCodes,
  addClient
} from "@/lib/db";

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      name,
      companyName,
      email,
      phone,
      requirements,
      planId,
      addOns = [],
      promoCode,
      paymentMethod = "UPI"
    } = body;

    // 1. Validation
    if (!name || !email || !planId) {
      return NextResponse.json(
        { error: "Name, Email and Plan are required fields" },
        { status: 400 }
      );
    }

    // 2. Resolve Plan Price
    const allPlans = await getPlans();
    const plan = allPlans.find(p => p.id === planId) || {
      id: "business",
      name: "Business Website",
      price: "₹35,000"
    };

    // Calculate base plan cost from string
    let basePrice = 35000;
    if (plan.id === "basic") basePrice = 15000;
    if (plan.id === "business") basePrice = 35000;
    if (plan.id === "premium") basePrice = 80000;
    if (plan.id === "ecommerce") basePrice = 125000;

    // Calculate add-on cost
    let addOnsCost = 0;
    const addOnList = [];
    if (addOns.includes("seo")) {
      addOnsCost += 5000;
      addOnList.push({ name: "SEO Setup & Optimization", cost: 5000 });
    }
    if (addOns.includes("maintenance")) {
      addOnsCost += 6000;
      addOnList.push({ name: "1 Year Dedicated Maintenance", cost: 6000 });
    }
    if (addOns.includes("hosting")) {
      addOnsCost += 4000;
      addOnList.push({ name: "Managed High-Speed Hosting", cost: 4000 });
    }

    let subtotal = basePrice + addOnsCost;

    // Apply Promo Discount
    let discount = 0;
    if (promoCode) {
      const allPromos = await getPromoCodes();
      const activePromo = allPromos.find(
        p => p.code.toUpperCase() === promoCode.toUpperCase() && p.active
      );
      if (activePromo) {
        if (activePromo.discount_type === "percentage") {
          discount = Math.round((subtotal * activePromo.discount_value) / 100);
        } else {
          discount = Math.min(activePromo.discount_value, subtotal);
        }
      }
    }

    const totalAmount = subtotal - discount;

    // 3. User account management
    let user = findUserByIdentifier(email);
    let tempPassword = "";
    if (!user) {
      tempPassword = "Client@" + Math.floor(100000 + Math.random() * 900000);
      try {
        user = addUser({
          name,
          email,
          phone: phone || "",
          password: tempPassword,
          role: "client",
          department: "Client Portal"
        });
      } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 400 });
      }
    } else {
      user = {
        ...user,
        username: user.username,
        role: user.role
      };
    }

    // 4. Generate CRM structures
    const timestamp = Date.now();
    const dateStr = new Date().toISOString().slice(0, 10);
    const subId = `sub-${timestamp}`;
    const payId = `pay-${timestamp}`;
    const invId = `INV-${timestamp}`;
    const propId = `PROP-${timestamp}`;
    const agrId = `AGR-${timestamp}`;
    const projId = `PROJ-${timestamp}`;

    // A. Subscriptions & Payments
    await addSubscription({
      id: subId,
      customer_name: name,
      customer_email: email,
      plan_id: planId,
      billing_cycle: "one-time",
      status: "active",
      start_date: dateStr,
      trial_end_date: null,
      promo_code: promoCode || null
    });

    await addPayment({
      id: payId,
      subscription_id: subId,
      amount: totalAmount,
      payment_date: dateStr,
      status: "paid",
      payment_method: paymentMethod
    });

    // B. Invoice
    await addInvoice({
      id: invId,
      subscription_id: subId,
      plan_name: plan.name,
      cost: totalAmount,
      add_ons: addOnList,
      issue_date: dateStr,
      status: "paid"
    });

    // C. Proposal
    const proposalContent = `
# Project Proposal for ${companyName || name}
**Date:** ${dateStr}
**Proposal ID:** ${propId}

## 1. Project Background
This proposal outlines the deployment and development of a professional ${plan.name} tailored for ${companyName || name}.

## 2. Scope of Deliverables
- Fully custom design configuration matching brand guidelines.
- Responsive design layout optimized for mobile, tablet, and desktop screens.
- Standard functional features: Pages (${plan.features?.pages || "Standard"}), Contact Forms, Analytics Dashboard.
- Optional Add-ons: ${addOnList.map(a => a.name).join(", ") || "None selected"}.

## 3. Financial Summary
- **Base Plan Cost:** ₹${basePrice.toLocaleString("en-IN")}
- **Add-on Cost:** ₹${addOnsCost.toLocaleString("en-IN")}
- **Promo Discount:** -₹${discount.toLocaleString("en-IN")}
- **Total Payable Amount (Paid):** ₹${totalAmount.toLocaleString("en-IN")}

*Next Step:* Please sign the attached Service Agreement in the client portal to initiate kickoff.
`;
    await addProposal({
      id: propId,
      customer_email: email,
      customer_name: name,
      company_name: companyName || "Individual",
      plan_name: plan.name,
      cost: totalAmount,
      content: proposalContent,
      status: "sent"
    });

    // D. Service Agreement
    const agreementContent = `
# Service Level & Development Agreement
**Date:** ${dateStr}
**Contract ID:** ${agrId}

This Agreement is made between Nexhydigital Enterprise and the client ${name} representing ${companyName || "Individual"}.

## Terms of Agreement:
1. **Scope & Milestones:** Work begins immediately upon electronic signing of this agreement. Initial design layout delivery is expected within 10 business days.
2. **Payment:** The client has completed payment of ₹${totalAmount.toLocaleString("en-IN")} for the ${plan.name} and selected features.
3. **Intellectual Property:** Upon final payment and delivery, code copyrights and graphic assets are fully transferred to the Client.
4. **Support SLA:** Support is provided for ${plan.features?.support || "1 Month"} starting on the delivery date.

*Signed Electronically by:* Nexhydigital Admin Team
`;
    await addAgreement({
      id: agrId,
      customer_email: email,
      customer_name: name,
      plan_name: plan.name,
      content: agreementContent,
      status: "pending_signature"
    });

    // E. Project Kickoff Record
    await addProject({
      id: projId,
      customer_name: name,
      customer_email: email,
      company_name: companyName || "Individual",
      plan_name: plan.name,
      status: "Payment Completed",
      progress: 20,
      assigned_to: "Unassigned",
      requirements: requirements || "Standard deployment setup."
    });

    // E2. Register as client in CRM
    await addClient({
      id: `CLT-${timestamp}`,
      name,
      company_name: companyName || "Individual",
      email,
      phone: phone || "",
      status: "Payment Received"
    });

    // F. Alerts Notification for Admin
    await addCRMNotification({
      id: `notif-${timestamp}`,
      message: `📢 Client Checkout! ${name} (${companyName || "Individual"}) subscribed to ${plan.name} for ₹${totalAmount.toLocaleString("en-IN")}. User credentials created.`,
      type: "checkout",
      is_read: false
    });

    // G. Send Confirmation Email via EmailJS REST API
    let emailSent = false;
    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
    const autoReplyTemplate = process.env.NEXT_PUBLIC_EMAILJS_AUTOREPLY_TEMPLATE;

    if (serviceId && publicKey && autoReplyTemplate) {
      try {
        const emailParams = {
          user_name: name,
          user_email: email,
          user_phone: phone || "N/A",
          service: plan.name,
          budget: `₹${totalAmount.toLocaleString("en-IN")}`,
          message: `Thank you for your payment of ₹${totalAmount.toLocaleString("en-IN")} for the ${plan.name}. We have successfully configured your client account. Log in credentials: Email: ${email}, Password: ${tempPassword || 'Use existing password'}. Please access your customer dashboard at http://localhost:3000/login to sign the service agreement contract and initiate project development.`
        };

        const emailRes = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            service_id: serviceId,
            template_id: autoReplyTemplate,
            user_id: publicKey,
            template_params: emailParams
          })
        });

        if (emailRes.ok) {
          emailSent = true;
          console.log(`🚀 [Checkout] Confirmation email dispatched successfully to ${email}`);
        } else {
          const errText = await emailRes.text();
          console.error(`❌ [Checkout] EmailJS REST API returned error: ${errText}`);
        }
      } catch (err) {
        console.error("❌ [Checkout] Failed to dispatch confirmation email:", err);
      }
    } else {
      console.warn("⚠️ [Checkout] EmailJS keys missing in environment variables. Email confirmation skipped.");
    }

    return NextResponse.json({
      ok: true,
      message: "Checkout successful",
      user: {
        username: user.username,
        email: user.email,
        password: tempPassword // Return generated password to show on checkout success screen
      },
      invoice: {
        id: invId,
        total: totalAmount
      }
    });

  } catch (error) {
    console.error("Checkout route error:", error);
    return NextResponse.json(
      { error: "Internal server error occurred" },
      { status: 500 }
    );
  }
}
