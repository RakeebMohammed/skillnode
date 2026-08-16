# Popin — email-gated landing page + admin dashboard

Flow: visitor enters email → gets a 6-digit OTP via Resend → verifies it →
lands on the gated page (GA4 loaded, lead form) → their email + IP + city/
country get logged to MongoDB → admin logs in separately at `/admin/login`
and sees both the visit log and form submissions at `/admin/dashboard`.

## 1. Install

```bash
npm install
```

## 2. Configure environment

```bash
cp .env.example .env
```

Fill in:
- `MONGODB_URI` — your MongoDB connection string (e.g. `mongodb://localhost:27017`
  for a local/self-hosted instance, or an Atlas SRV string)
- `MONGODB_DB` — database name (defaults to `popin` if unset)
- `SESSION_SECRET` — `openssl rand -hex 32`
- `RESEND_API_KEY` / `OTP_FROM_EMAIL` — from resend.com, with a verified sending domain
- `NEXT_PUBLIC_GA_ID` — your GA4 measurement ID (starts with `G-`)
- `TRUST_PROXY` — `true` only if nginx/traefik sits in front of this app and
  sets `X-Forwarded-For` itself. If you run this box directly exposed to the
  internet with no reverse proxy, leave this `false` — otherwise visitors can
  spoof their logged IP by sending a fake header.

## 3. Database setup

No schema/migration step needed — MongoDB creates collections (`otps`,
`visits`, `leads`, `admin_users`) on first write. Indexes are created
automatically by `lib/db.ts`'s `ensureIndexes()` the first time it's called
(wired into the admin-creation script below), so nothing manual is required.

If you're running MongoDB locally and don't have it installed yet:
```bash
# Debian/Ubuntu example
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
```

## 4. Create your admin account

```bash
npm run create-admin -- admin "a-strong-password"
```

## 5. Run

```bash
npm run dev      # local dev
npm run build && npm start   # production
```

Visit `/` (redirects to `/gate` until you verify), and `/admin/login` for
the dashboard.

## Notes / things to revisit before going live

- **IP → geo accuracy**: uses `geoip-lite`'s bundled GeoLite2 data (city-level,
  not exact address). Its data snapshot ages — update the package periodically
  (`npm update geoip-lite`) for better accuracy.
- **Reverse proxy**: if you put nginx in front (recommended — for TLS
  termination at minimum), make sure it sets `X-Forwarded-For` to the real
  client IP and strips/overwrites any client-supplied value, or IP logging
  becomes spoofable.
- **Email deliverability**: verify your sending domain in Resend (SPF/DKIM),
  or OTP emails will land in spam.
- **Rate limiting**: currently DB-based (5 OTP requests per email per 15 min).
  At low traffic this is enough; if you ever open this to bots, add IP-based
  rate limiting too (e.g. a reverse-proxy rule or a small in-memory limiter).
- **GA4 vs the `visits` collection**: GA4 gives you aggregate traffic trends.
  It cannot and will not show you "this exact email came from this exact IP" —
  that's what the `visits` collection in MongoDB is for. Keep using both for
  what they're each good at.
- **Mongo has no unique constraint on `otps.email`** by design (a person can
  request multiple codes) — only `admin_users.username` is enforced unique.
