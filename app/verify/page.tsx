import { Suspense } from "react";
import { VerifyForm } from "./VerifyForm";

function VerifyLoading() {
  return <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}>Loading...</div>;
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<VerifyLoading />}>
      <VerifyForm />
    </Suspense>
  );
}
