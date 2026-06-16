import { NextResponse } from "next/server";
import { verifyJWT } from "@/lib/jwt";
import { updateTicket, deleteTicket } from "@/lib/db";

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyJWT(token);
    if (!payload || ((payload.role !== "super_admin" && payload.role !== "admin") && payload.role !== "hr_manager" && payload.role !== "hr_staff")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    
    // Whitelist allowed fields for update
    const allowedFields = ["status", "assignee", "priority", "pri", "resolution", "cat", "sub", "desc"];
    const fieldsToUpdate = {};
    
    for (const key of allowedFields) {
      if (body[key] !== undefined) {
        fieldsToUpdate[key] = body[key];
      }
    }

    const res = await updateTicket(id, fieldsToUpdate);
    if (res && res.ok) {
      return NextResponse.json({ ok: true });
    } else {
      return NextResponse.json({ error: "Failed to update ticket" }, { status: 500 });
    }

  } catch (error) {
    console.error("Error updating ticket:", error);
    return NextResponse.json(
      { error: "Internal server error occurred" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyJWT(token);
    if (!payload || payload.role !== "super_admin") {
      return NextResponse.json({ error: "Unauthorized - Admin only" }, { status: 401 });
    }

    const res = await deleteTicket(id);
    if (res && res.ok) {
      return NextResponse.json({ ok: true, message: "Ticket deleted successfully" });
    } else {
      return NextResponse.json({ error: "Failed to delete ticket" }, { status: 500 });
    }

  } catch (error) {
    console.error("Error deleting ticket:", error);
    return NextResponse.json(
      { error: "Internal server error occurred" },
      { status: 500 }
    );
  }
}
