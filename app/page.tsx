import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Script from "next/script";
import { decodeSession } from "@/lib/session";
import LandingContent from "./LandingContent";
import AnalyticsTracker from "./AnalyticsTracker";

export default function LandingPage() {
  const token = cookies().get("session")?.value;
  const session = decodeSession<{ email: string }>(token);

  if (!session) {
    redirect("/gate");
  }

  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <>
      {gaId && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
          <Script id="ga4-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${gaId}');`}
          </Script>
        </>
      )}

      <AnalyticsTracker />
      <LandingContent email={session.email} />
    </>
  );
}
