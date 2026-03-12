import { cn } from "@/components/ui/utils";

type StepBarState = "default" | "now";

type StepBarItem = {
  label: string;
  state?: StepBarState;
};

type Props = {
  className?: string;
  steps: StepBarItem[];
};

export function StepBar({ className, steps }: Props) {
  return (
    <div className={cn("flex w-full items-start gap-2", className)}>
      {steps.map((step, index) => {
        const current = step.state === "now";

        return (
          <div className="flex flex-1 items-center gap-2" key={`${step.label}-${index}`}>
            <div className="flex flex-1 flex-col gap-1.5">
              <span
                className={cn(
                  "text-label-sm text-center",
                  current ? "text-action-primary" : "text-text-secondary"
                )}
              >
                {step.label}
              </span>
              <span
                className={cn(
                  "h-3 rounded-full",
                  current ? "bg-action-primary" : "bg-text-secondary"
                )}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
