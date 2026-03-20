"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import { AuthCard } from "@/components/auth/AuthCard";
import { AuthField } from "@/components/auth/AuthField";
import { Button } from "@/components/ui/Button";
import { useLogin, useSignup, useValidateUsername } from "@/hooks/useAuth";
import { ApiError } from "@/lib/api/client";

const usernamePattern = /^(?=.*[A-Za-z])[A-Za-z0-9]{5,20}$/;
const passwordPattern =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

const signupSchema = z
  .object({
    name: z.string().trim().min(1, "이름을 입력해 주세요."),
    password: z
      .string()
      .regex(
        passwordPattern,
        "비밀번호는 영문, 숫자, 특수문자를 포함한 8자 이상이어야 합니다."
      ),
    passwordConfirm: z.string().min(1, "비밀번호 확인을 입력해 주세요."),
    username: z
      .string()
      .regex(
        usernamePattern,
        "아이디는 영문+숫자 조합 5~20자이며 영문을 최소 1자 포함해야 합니다."
      ),
  })
  .refine((value) => value.password === value.passwordConfirm, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["passwordConfirm"],
  });

type SignupFormValues = z.infer<typeof signupSchema>;

type IdCheckRowProps = {
  errorMessage?: string;
  isPending: boolean;
  onBlur: () => void;
  onChange: (value: string) => void;
  onCheck: () => void;
  value: string;
};

function IdCheckRow({
  errorMessage,
  isPending,
  onBlur,
  onChange,
  onCheck,
  value,
}: IdCheckRowProps) {
  return (
    <div className="flex items-center gap-[12px]">
      <div className="min-w-0 flex-1">
        <AuthField
          autoComplete="username"
          errorMessage={errorMessage}
          label="아이디"
          onBlur={onBlur}
          onChange={(event) => onChange(event.target.value)}
          placeholder="아이디 (영문 5자 이상)"
          value={value}
        />
      </div>
      <Button
        className="mt-8 h-[43px] min-w-[74px] rounded-full border-[#b04bff] bg-[rgba(17,18,23,0.46)] px-[16px] py-[12px] shadow-[0_0_10px_rgba(176,75,255,0.22)]"
        disabled={isPending}
        onClick={onCheck}
        size="tiny"
        type="button"
        variant="outlined"
      >
        중복확인
      </Button>
    </div>
  );
}

export function SignupForm() {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const [usernameMessage, setUsernameMessage] = useState<string | null>(null);
  const [verifiedUsername, setVerifiedUsername] = useState<string | null>(null);
  const [verificationToken, setVerificationToken] = useState<string | null>(null);
  const { control, getValues, handleSubmit, setError } =
    useForm<SignupFormValues>({
      defaultValues: {
        name: "",
        password: "",
        passwordConfirm: "",
        username: "",
      },
      resolver: zodResolver(signupSchema),
    });
  const validateUsernameMutation = useValidateUsername();
  const signupMutation = useSignup();
  const loginMutation = useLogin();
  const usernameValue = useWatch({
    control,
    name: "username",
  });
  const isUsernameVerified = Boolean(
    verificationToken && verifiedUsername === usernameValue
  );

  async function handleUsernameCheck() {
    const username = getValues("username");

    if (!usernamePattern.test(username)) {
      setError("username", {
        message:
          "아이디는 영문+숫자 조합 5~20자이며 영문을 최소 1자 포함해야 합니다.",
      });
      return;
    }

    setFormError(null);

    try {
      const response = await validateUsernameMutation.mutateAsync(username);
      setVerificationToken(response.verification_token);
      setVerifiedUsername(response.username);
      setUsernameMessage(response.message);
    } catch (error) {
      setVerificationToken(null);
      setVerifiedUsername(null);

      if (error instanceof ApiError) {
        setError("username", {
          message:
            error.errors.find((item) => item.field === "username")?.message ??
            error.message,
        });
        return;
      }

      setFormError("아이디 확인 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.");
    }
  }

  async function onSubmit(values: SignupFormValues) {
    if (!verificationToken || verifiedUsername !== values.username) {
      setError("username", {
        message: "아이디 중복확인을 완료해 주세요.",
      });
      setUsernameMessage("아이디 중복확인을 완료해야 회원가입할 수 있습니다.");
      return;
    }

    setFormError(null);

    try {
      await signupMutation.mutateAsync({
        name: values.name.trim(),
        password: values.password,
        username: values.username,
        verification_token: verificationToken,
      });
      await loginMutation.mutateAsync({
        password: values.password,
        username: values.username,
      });
      router.replace("/dashboard");
    } catch (error) {
      if (error instanceof ApiError) {
        for (const item of error.errors) {
          if (
            item.field === "name" ||
            item.field === "password" ||
            item.field === "username"
          ) {
            setError(item.field, { message: item.message });
          }
        }
        setFormError(error.message);
        return;
      }

      setFormError("회원가입 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.");
    }
  }

  return (
    <div className="flex w-full flex-col items-center pt-[7px]">
      <h1 className="text-heading-lg mb-[28px] tracking-[-0.03em] text-white">
        회원가입
      </h1>
      <AuthCard className="w-[651px] px-[40px] py-[60px]">
        <form className="flex flex-col gap-[40px]" onSubmit={handleSubmit(onSubmit)}>
          <Controller
            control={control}
            name="name"
            render={({ field, fieldState }) => (
              <AuthField
                {...field}
                autoComplete="name"
                errorMessage={fieldState.error?.message}
                label="이름"
                placeholder="이름"
              />
            )}
          />
          <Controller
            control={control}
            name="username"
            render={({ field, fieldState }) => (
              <div className="flex flex-col gap-[8px]">
                <IdCheckRow
                  errorMessage={fieldState.error?.message}
                  isPending={validateUsernameMutation.isPending}
                  onBlur={field.onBlur}
                  onChange={(value) => {
                    if (verifiedUsername && verifiedUsername !== value) {
                      setVerificationToken(null);
                      setVerifiedUsername(null);
                      setUsernameMessage(
                        "아이디를 수정했습니다. 다시 중복확인을 진행해 주세요."
                      );
                    }
                    field.onChange(value);
                  }}
                  onCheck={handleUsernameCheck}
                  value={field.value}
                />
                {usernameMessage ? (
                  <p
                    className={[
                      "text-body-sm",
                      isUsernameVerified ? "text-[#90f3b3]" : "text-gray-300",
                    ].join(" ")}
                  >
                    {usernameMessage}
                  </p>
                ) : null}
              </div>
            )}
          />
          <Controller
            control={control}
            name="password"
            render={({ field, fieldState }) => (
              <AuthField
                {...field}
                autoComplete="new-password"
                errorMessage={fieldState.error?.message}
                label="비밀번호"
                placeholder="비밀번호 (영문, 특수문자 포함 8자 이상)"
                type="password"
              />
            )}
          />
          <Controller
            control={control}
            name="passwordConfirm"
            render={({ field, fieldState }) => (
              <AuthField
                {...field}
                autoComplete="new-password"
                errorMessage={fieldState.error?.message}
                label="비밀번호 확인"
                placeholder="비밀번호 재입력"
                type="password"
              />
            )}
          />
          {formError ? (
            <p className="text-body-sm text-center text-[#ff8f8f]">{formError}</p>
          ) : null}
          <Button
            className="mt-[3px] h-[58px] w-full rounded-full bg-[linear-gradient(90deg,#b04bff_0%,#d45bff_100%)] shadow-none"
            disabled={signupMutation.isPending || loginMutation.isPending}
            size="sm"
            type="submit"
          >
            회원가입
          </Button>
        </form>
      </AuthCard>
    </div>
  );
}
