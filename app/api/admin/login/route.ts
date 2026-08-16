import { NextRequest, NextResponse } from "next/server";
import { verifyAdminCredentials } from "@/lib/adminAuth";
import { encodeSession } from "@/lib/session";

const SESSION_TTL_SECONDS = 60 * 60 * 12; // 12 hours

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();

  if (typeof username !== "string" || typeof password !== "string") {
    return NextResponse.json({ error: "Missing credentials." }, { status: 400 });
  }

  const valid = await verifyAdminCredentials(username, password);
  if (!valid) {
    return NextResponse.json({ error: "Invalid username or password." }, { status: 401 });
  }

  const session = encodeSession({ admin: username }, SESSION_TTL_SECONDS);
  const res = NextResponse.json({ ok: true });
  res.cookies.set("admin_session", session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
  return res;
}
