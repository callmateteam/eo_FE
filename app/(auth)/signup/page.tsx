import { AuthRouteGate } from "@/components/auth/AuthRouteGate";
import { AuthShell } from "@/components/auth/AuthShell";
import { SignupForm } from "@/components/auth/SignupForm";

export default function SignupPage() {
  return (
    <AuthRouteGate>
      <AuthShell mode="signup">
        <div className="flex w-full justify-center pb-[18px]">
          <SignupForm />
        </div>
      </AuthShell>
    </AuthRouteGate>
  );
}
