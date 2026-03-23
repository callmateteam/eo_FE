import { cn } from "@/components/ui/utils";

type SpinnerSize = "sm" | "md" | "lg";

type Props = {
  className?: string;
  size?: SpinnerSize;
};

const sizeConfig: Record<SpinnerSize, { container: string; dotH: string; dotW: string; offset: number }> = {
  sm: { container: "size-5", dotH: "h-1.5", dotW: "w-[3px]", offset: 8 },
  md: { container: "size-6", dotH: "h-1.5", dotW: "w-[3px]", offset: 10 },
  lg: { container: "size-8", dotH: "h-2", dotW: "w-0.5", offset: 11 },
};

export function SpinnerDots({ className, size = "lg" }: Props) {
  const { container, dotH, dotW, offset } = sizeConfig[size];

  return (
    <div className={cn("inline-flex items-center justify-center", className)}>
      <span className={cn("relative animate-spin", container)} style={{ animationDuration: "900ms" }}>
        {Array.from({ length: 8 }).map((_, index) => (
          <span
            className={cn(
              "absolute left-1/2 top-1/2 -translate-x-1/2 rounded-full",
              index === 0 ? "bg-primary-500" : "bg-gray-700",
              dotH,
              dotW
            )}
            key={index}
            style={{
              opacity: 1 - index * 0.12,
              transform: `translate(-50%, -50%) rotate(${index * 45}deg) translateY(-${offset}px)`,
              transformOrigin: `center ${offset}px`,
            }}
          />
        ))}
      </span>
    </div>
  );
}
