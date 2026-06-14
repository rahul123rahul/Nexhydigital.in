import { NextResponse } from "next/server";
import { getSubscriptions, getPayments, getPlans } from "@/lib/db";
import { verifyJWT } from "@/lib/jwt";

async function checkAdmin(request) {
  const token = request.cookies.get("token")?.value;
  if (!token) return false;
  const payload = await verifyJWT(token);
  return payload && payload.role === "super_admin";
}

export async function GET(request) {
  try {
    const isAdmin = await checkAdmin(request);
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const [subs, payments, plans] = await Promise.all([
      getSubscriptions(),
      getPayments(),
      getPlans()
    ]);

    const planMap = plans.reduce((acc, curr) => {
      acc[curr.id] = curr;
      return acc;
    }, {});

    // Calculations
    const totalRevenue = payments
      .filter(p => p.status === 'paid')
      .reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);

    const activeSubscribers = subs.filter(s => s.status === 'active').length;
    const activeTrials = subs.filter(s => s.status === 'trial').length;

    // Calculate MRR: For demo, active subscriptions that are monthly, plus yearly divided by 12, plus one-time divided by 12
    let mrr = 0;
    subs.forEach(s => {
      if (s.status !== 'active') return;
      const plan = planMap[s.plan_id];
      if (!plan) return;
      
      // parse approximate price (e.g. ₹20,000 -> 20000)
      const numericPrice = parseFloat(plan.price.replace(/[^\d]/g, '')) || 0;
      if (s.billing_cycle === 'monthly') {
        mrr += numericPrice;
      } else if (s.billing_cycle === 'yearly') {
        mrr += numericPrice / 12;
      } else {
        // One-time plans, let's treat as one-twelfth for monthly run-rate representation, or count 0.
        // For demo run-rate purposes, let's divide one-time projects over 12 months.
        mrr += numericPrice / 12;
      }
    });

    // Promo code usage
    const promoUses = {};
    subs.forEach(s => {
      if (s.promo_code) {
        promoUses[s.promo_code] = (promoUses[s.promo_code] || 0) + 1;
      }
    });

    // Plan distributions
    const planDistribution = {};
    subs.forEach(s => {
      const plan = planMap[s.plan_id];
      const planName = plan ? plan.name : s.plan_id;
      planDistribution[planName] = (planDistribution[planName] || 0) + 1;
    });

    // Enhanced lists
    const enrichedPayments = payments.map(p => {
      const sub = subs.find(s => s.id === p.subscription_id);
      return {
        ...p,
        customer_name: sub ? sub.customer_name : 'Unknown Customer',
        customer_email: sub ? sub.customer_email : 'N/A',
        plan_name: sub && planMap[sub.plan_id] ? planMap[sub.plan_id].name : 'N/A'
      };
    });

    return NextResponse.json({
      ok: true,
      data: {
        metrics: {
          totalRevenue,
          mrr: Math.round(mrr),
          activeSubscribers,
          activeTrials
        },
        promoUses,
        planDistribution,
        payments: enrichedPayments
      }
    });
  } catch (error) {
    console.error("GET billing reports error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
