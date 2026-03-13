import { AuthShell } from "@/components/auth/AuthShell";
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <AuthShell mode="login">
      <div className="grid w-full grid-cols-[1fr_492px] items-center gap-[72px]">
        <section className="pb-[27px] pl-0 text-white">
          <p className="m-0 text-[32px] leading-[1.16] font-normal tracking-[-0.03em] text-[#f1effc]">
            Every One, Every Output
          </p>
          <h1 className="m-0 pt-[9px] text-[72px] leading-[0.92] font-medium tracking-[-0.05em] text-[#7450ff]">
            Estaid video
          </h1>
        </section>

        <LoginForm />
      </div>
    </AuthShell>
  );
}
