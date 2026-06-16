import { NextResponse } from "next/server";
import { verifyJWT } from "@/lib/jwt";
import { updateClient, deleteClient } from "@/lib/db";

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const token = request.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const payload = await verifyJWT(token);
    if (!payload || (payload.role !== "super_admin" && payload.role !== "admin"))
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const allowed = ["name", "company_name", "phone", "address", "gst_number", "tax_details", "notes", "status", "email"];
    const fields = {};
    for (const key of allowed) {
      if (body[key] !== undefined) fields[key] = body[key];
    }

    await updateClient(id, fields);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("PATCH /api/admin/clients/[id] error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const token = request.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const payload = await verifyJWT(token);
    if (!payload || payload.role !== "super_admin")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await deleteClient(id);
    return NextResponse.json({ ok: true, message: "Client deleted successfully" });
  } catch (err) {
    console.error("DELETE /api/admin/clients/[id] error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
