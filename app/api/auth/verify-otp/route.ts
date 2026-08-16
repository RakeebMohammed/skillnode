import { NextRequest, NextResponse } from "next/server";
import { verifyOtp } from "@/lib/otp";
import { encodeSession } from "@/lib/session";
import { getDb } from "@/lib/db";

const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

function getVisitorIp(req: NextRequest) {
  if (process.env.TRUST_PROXY !== "true") {
    return { ip: "unknown", source: "proxy_headers_disabled" };
  }

  const candidates: Array<[string, string | null]> = [
    ["cloudflare", req.headers.get("cf-connecting-ip")],
    ["vercel", req.headers.get("x-vercel-forwarded-for")],
    ["forwarded", req.headers.get("x-forwarded-for")],
    ["nginx", req.headers.get("x-real-ip")],
  ];
  const [source, value] = candidates.find(([, header]) => header?.trim()) ?? ["none", null];
  const ip = value?.split(",")[0].trim().replace(/^::ffff:/, "") || "unknown";
  return { ip, source };
}

export async function POST(req: NextRequest) {
  try {
    const { email, otp } = await req.json();

    if (typeof email !== "string" || typeof otp !== "string") {
      return NextResponse.json({ error: "Missing email or code." }, { status: 400 });
    }
    const normalizedEmail = email.trim().toLowerCase();

    const result = await verifyOtp(normalizedEmail, otp.trim());
    if (!result.ok) {
      return NextResponse.json({ error: result.reason }, { status: 400 });
    }

    const session = encodeSession({ email: normalizedEmail }, SESSION_TTL_SECONDS);
    const res = NextResponse.json({ ok: true });
    res.cookies.set("session", session, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_TTL_SECONDS,
    });

    // Store an OTP-verified landing-page visit separately from lead forms.
    // This is first-party server analytics, not Google Analytics: do not send
    // email addresses or IP addresses to GA.
    try {
      const { ip, source } = getVisitorIp(req);
      const db = await getDb();
      const visit = await db.collection("visits").insertOne({
        email: normalizedEmail,
        ip,
        ip_source: source,
        city: null,
        region: null,
        country: null,
        geo_status: "pending",
        user_agent: req.headers.get("user-agent") || null,
        event: "otp_verified",
        verified_at: new Date(),
        created_at: new Date(),
      });

      // Geo lookup may be unavailable in development; the visit itself is
      // already stored even if this optional enrichment fails.
      try {
        const { lookupGeo } = await import("@/lib/geo");
        const geo = lookupGeo(ip);
        await db.collection("visits").updateOne(
          { _id: visit.insertedId },
          { $set: { city: geo.city, region: geo.region, country: geo.country, geo_status: geo.country ? "resolved" : "not_available" } }
        );
      } catch (err) {
        console.error("visit geolocation error", err);
        await db.collection("visits").updateOne(
          { _id: visit.insertedId },
          { $set: { geo_status: "failed" } }
        );
      }
    } catch (err) {
      console.error("visit logging error", err);
    }

    return res;
  } catch (err) {
    console.error("verify-otp error", err);
    return NextResponse.json({ error: "Something went wrong. Try again." }, { status: 500 });
  }
}
