import { NextRequest, NextResponse } from "next/server";
import { createOtp, isRateLimited } from "@/lib/otp";
import { sendOtpEmail } from "@/lib/mailer";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
console.log(email);

    if (typeof email !== "string" || !EMAIL_RE.test(email)) {
      return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
    }
    const normalizedEmail = email.trim().toLowerCase();

    if (await isRateLimited(normalizedEmail)) {
      return NextResponse.json(
        { error: "Too many requests for this email. Try again later." },
        { status: 429 }
      );
    }

    const otp = await createOtp(normalizedEmail);
    await sendOtpEmail(normalizedEmail, otp);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("request-otp error", err);
    return NextResponse.json({ error: "Something went wrong. Try again." }, { status: 500 });
  }
}
