"use client";

import { useState } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { AuthCard } from "@/components/auth/AuthCard";
import { AuthField } from "@/components/auth/AuthField";
import { GoogleLoginButton } from "@/components/auth/GoogleLoginButton";
import { Button } from "@/components/ui/Button";
import { useLogin } from "@/hooks/useAuth";
import { ApiError } from "@/lib/api/client";

const loginSchema = z.object({
  password: z.string().min(1, "비밀번호를 입력해 주세요."),
  username: z.string().min(1, "아이디를 입력해 주세요."),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const { control, handleSubmit, setError } = useForm<LoginFormValues>({
    defaultValues: {
      password: "",
      username: "",
    },
    resolver: zodResolver(loginSchema),
  });
  const loginMutation = useLogin();

  async function onSubmit(values: LoginFormValues) {
    setFormError(null);

    try {
      await loginMutation.mutateAsync(values);
      router.replace("/dashboard");
    } catch (error) {
      if (error instanceof ApiError) {
        for (const item of error.errors) {
          if (item.field === "username" || item.field === "password") {
            setError(item.field, { message: item.message });
          }
        }
        setFormError(error.message);
        return;
      }
      setFormError("로그인 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.");
    }
  }

  return (
    <AuthCard className="w-[651px] px-[40px] py-[60px]">
      <form className="flex flex-col gap-[40px]" onSubmit={handleSubmit(onSubmit)}>
        <Controller
          control={control}
          name="username"
          render={({ field, fieldState }) => (
            <AuthField
              {...field}
              autoComplete="username"
              errorMessage={fieldState.error?.message}
              label="아이디"
              placeholder="아이디를 입력하세요"
            />
          )}
        />
        <Controller
          control={control}
          name="password"
          render={({ field, fieldState }) => (
            <AuthField
              {...field}
              autoComplete="current-password"
              errorMessage={fieldState.error?.message}
              label="비밀번호"
              placeholder="비밀번호를 입력하세요"
              type="password"
            />
          )}
        />

        <div className="flex flex-col gap-[7px] pt-[1px]">
          {formError ? (
            <p className="text-body-sm text-center text-[#ff8f8f]">{formError}</p>
          ) : null}
          <Button
            className="h-[58px] w-full rounded-full bg-[linear-gradient(90deg,#b04bff_0%,#d45bff_100%)] shadow-none"
            disabled={loginMutation.isPending}
            size="md"
            type="submit"
          >
            로그인
          </Button>
          <p className="text-body-md mt-[8px] text-center text-gray-300">
            아직 계정이 없으신가요?{" "}
            <Link className="text-primary-500" href="/signup">
              회원가입
            </Link>
          </p>
        </div>

        <div className="flex items-center gap-[11px] pt-[15px]">
          <span className="h-px flex-1 bg-[rgba(255,255,255,0.24)]" />
          <span className="text-label-md text-gray-300">또는</span>
          <span className="h-px flex-1 bg-[rgba(255,255,255,0.24)]" />
        </div>

        <GoogleLoginButton />
      </form>
    </AuthCard>
  );
}
