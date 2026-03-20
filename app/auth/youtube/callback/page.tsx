"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

function YouTubeCallbackContent() {
  const searchParams = useSearchParams();

  const code = searchParams.get("code");
  const oauthError = searchParams.get("error");

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    !code || Boolean(oauthError) ? "error" : "loading",
  );

  useEffect(() => {
    if (!code || oauthError) return;

    if (window.opener) {
      window.opener.postMessage(
        { type: "youtube-oauth-code", code },
        window.location.origin,
      );
      window.close();
      return;
    }

    setStatus("success");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (status === "loading") {
    return <p className="text-[16px]">YouTube 연동 처리 중...</p>;
  }

  if (status === "error") {
    return <p className="text-[16px] text-[#ff4343]">연동에 실패했습니다. 다시 시도해 주세요.</p>;
  }

  return <p className="text-[16px]">YouTube 연동 완료! 이 창을 닫아주세요.</p>;
}

export default function YouTubeCallbackPage() {
  return (
    <div className="flex h-screen items-center justify-center bg-[#131316] text-white">
      <Suspense fallback={<p className="text-[16px]">YouTube 연동 처리 중...</p>}>
        <YouTubeCallbackContent />
      </Suspense>
    </div>
  );
}
