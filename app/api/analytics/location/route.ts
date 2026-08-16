import { NextRequest, NextResponse } from "next/server";
import { isIP } from "node:net";
import { cookies } from "next/headers";
import { decodeSession } from "@/lib/session";
import { getDb } from "@/lib/db";

function cleanText(value: unknown) {
  return typeof value === "string" ? value.trim().slice(0, 120) || null : null;
}

export async function POST(req: NextRequest) {
  const session = decodeSession<{ email: string }>(cookies().get("session")?.value);
  if (!session) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });

  try {
    const { ip, city, region, country } = await req.json();
    if (typeof ip !== "string" || !isIP(ip.trim())) {
      return NextResponse.json({ error: "Invalid IP address." }, { status: 400 });
    }

    const db = await getDb();
    const visit = await db.collection("visits").findOne(
      { email: session.email, event: "otp_verified" },
      { sort: { verified_at: -1, created_at: -1 } }
    );
    if (!visit) return NextResponse.json({ error: "No verified visit found." }, { status: 404 });

    await db.collection("visits").updateOne(
      { _id: visit._id },
      {
        $set: {
          ip: ip.trim(),
          ip_source: "browser_ipapi",
          city: cleanText(city),
          region: cleanText(region),
          country: cleanText(country),
          geo_status: "resolved",
          geo_updated_at: new Date(),
        },
      }
    );

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("location analytics error", err);
    return NextResponse.json({ error: "Unable to record location." }, { status: 500 });
  }
}
