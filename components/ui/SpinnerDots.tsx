import { cn } from "@/components/ui/utils";

type Props = {
  className?: string;
  count?: number;
};

export function SpinnerDots({ className, count = 9 }: Props) {
  return (
    <div className={cn("inline-flex items-center gap-10", className)}>
      {Array.from({ length: count }).map((_, index) => (
        <span
          className="relative size-8 animate-spin"
          key={index}
          style={{
            animationDelay: `${index * 100}ms`,
            animationDuration: "1s",
          }}
        >
          {Array.from({ length: 8 }).map((_, segmentIndex) => {
            const active = segmentIndex === index % 8;

            return (
              <span
                className={cn(
                  "absolute left-1/2 top-1/2 h-2 w-0.5 -translate-x-1/2 rounded-full",
                  active ? "bg-action-primary" : "bg-[var(--color-gray-700)]"
                )}
                key={segmentIndex}
                style={{
                  transform: `translate(-50%, -50%) rotate(${segmentIndex * 45}deg) translateY(-11px)`,
                  transformOrigin: "center 11px",
                }}
              />
            );
          })}
        </span>
      ))}
    </div>
  );
}
