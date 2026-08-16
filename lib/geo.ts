import geoip from "geoip-lite";

export function lookupGeo(ip: string) {
  if (ip === "unknown" || ip === "127.0.0.1" || ip.startsWith("::1")) {
    return { city: null, region: null, country: null };
  }
  const geo = geoip.lookup(ip);
  return {
    city: geo?.city ?? null,
    region: geo?.region ?? null,
    country: geo?.country ?? null,
  };
}
