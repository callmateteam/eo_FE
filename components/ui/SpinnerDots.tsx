import { cn } from "@/components/ui/utils";

type Props = {
  className?: string;
};

export function SpinnerDots({ className }: Props) {
  return (
    <div className={cn("inline-flex items-center justify-center", className)}>
      <span className="relative size-8 animate-spin" style={{ animationDuration: "900ms" }}>
        {Array.from({ length: 8 }).map((_, index) => (
          <span
            className={cn(
              "absolute left-1/2 top-1/2 h-2 w-0.5 -translate-x-1/2 rounded-full",
              index === 0 ? "bg-primary-500" : "bg-gray-700"
            )}
            key={index}
            style={{
              opacity: 1 - index * 0.12,
              transform: `translate(-50%, -50%) rotate(${index * 45}deg) translateY(-11px)`,
              transformOrigin: "center 11px",
            }}
          />
        ))}
      </span>
    </div>
  );
}
