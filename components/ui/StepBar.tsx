import { cn } from "@/components/ui/utils";

type StepBarState = "default" | "now" | "done";

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
        const done = step.state === "done";

        return (
          <div className="flex flex-1 items-center gap-2" key={`${step.label}-${index}`}>
            <div className="flex flex-1 flex-col gap-1.5">
              <span
                className={cn(
                  "text-caption-md text-center",
                  current ? "text-primary-500" : done ? "text-primary-700" : "text-gray-500"
                )}
              >
                {step.label}
              </span>
              <span
                className={cn(
                  "h-3 rounded-full",
                  current ? "bg-primary-500" : done ? "bg-primary-700" : "bg-gray-500"
                )}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
