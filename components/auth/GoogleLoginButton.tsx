"use client";

import { useState } from "react";

import { GoogleLogin } from "@react-oauth/google";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { googleLogin } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";

export function GoogleLoginButton() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const googleLoginMutation = useMutation({
    mutationFn: googleLogin,
  });

  async function handleGoogleSuccess(credential: string) {
    setErrorMessage(null);

    try {
      await googleLoginMutation.mutateAsync(credential);
      await queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
      router.replace("/dashboard");
    } catch (error) {
      if (error instanceof ApiError) {
        setErrorMessage(error.message);
        return;
      }

      setErrorMessage("구글 로그인 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.");
    }
  }

  return (
    <div className="flex flex-col gap-[10px]">
      <div className="flex justify-center">
        <GoogleLogin
          onError={() => {
            setErrorMessage("구글 로그인 창을 열지 못했습니다. 다시 시도해 주세요.");
          }}
          onSuccess={(credentialResponse) => {
            if (!credentialResponse.credential) {
              setErrorMessage("구글 인증 토큰을 받지 못했습니다.");
              return;
            }

            void handleGoogleSuccess(credentialResponse.credential);
          }}
          shape="pill"
          size="large"
          text="signin_with"
          theme="outline"
          useOneTap={false}
          width="430"
        />
      </div>
      {errorMessage ? (
        <p className="m-0 text-center text-[13px] leading-[1.4] text-[#ff8f8f]">
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
}
