"use client";

import { useEffect } from "react";

type GeoResponse = {
  ip?: string;
  city?: string;
  region?: string;
  country_name?: string;
};

/**
 * Records a live geolocation snapshot for the current (already
 * OTP-verified) visitor. Runs client-side because a browser fetch to a
 * public geo API resolves the visitor's real public IP even when the app
 * itself is running on localhost during development — the server-side
 * capture in /api/auth/verify-otp still runs too and is what production
 * traffic behind a proper reverse proxy should mainly rely on; this is a
 * supplementary, more-precise ping for whenever the gated page is opened.
 */
export default function AnalyticsTracker() {
  useEffect(() => {
    async function recordLocation() {
      try {
        const geoResponse = await fetch("https://ipapi.co/json/", { cache: "no-store" });
        if (!geoResponse.ok) return;
        const geo = (await geoResponse.json()) as GeoResponse;
        if (!geo.ip) return;

        await fetch("/api/analytics/location", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ip: geo.ip,
            city: geo.city,
            region: geo.region,
            country: geo.country_name,
          }),
        });
      } catch {
        // Analytics must never affect the visitor's landing-page experience.
      }
    }

    void recordLocation();
  }, []);

  return null;
}
