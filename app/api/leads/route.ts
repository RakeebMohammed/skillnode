import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { decodeSession } from "@/lib/session";
import { getDb } from "@/lib/db";

export async function POST(req: NextRequest) {
  const token = cookies().get("session")?.value;
  const session = decodeSession<{ email: string }>(token);

  if (!session) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  try {
    const { name, phone, message } = await req.json();

    if (typeof name !== "string" || !name.trim()) {
      return NextResponse.json({ error: "Name is required." }, { status: 400 });
    }

    if (typeof phone !== "string" || phone.trim().length < 7) {
      return NextResponse.json({ error: "Please enter a valid phone number." }, { status: 400 });
    }

    const db = await getDb();
    await db.collection("leads").insertOne({
      email: session.email,
      name: name.trim(),
      phone: phone.trim(),
      message: message ?? null,
      created_at: new Date(),
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("leads error", err);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
