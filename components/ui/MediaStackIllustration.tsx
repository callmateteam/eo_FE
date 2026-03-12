import { Icon } from "@/components/ui/Icon";
import { cn } from "@/components/ui/utils";

type Props = {
  className?: string;
  variant?: "video" | "image";
};

export function MediaStackIllustration({
  className,
  variant = "video",
}: Props) {
  const iconName = variant === "video" ? "play-line" : "avatar";

  return (
    <div className={cn("relative h-[160px] w-[255px]", className)}>
      <div className="absolute left-7 top-7 flex h-[116px] w-[84px] rotate-[-10deg] items-center justify-center rounded-[14px] border-[4px] border-[var(--color-gray-900)] bg-transparent text-action-secondary">
        <Icon name={iconName} size={44} />
      </div>
      <div className="absolute right-7 top-5 flex h-[116px] w-[84px] rotate-[12deg] items-center justify-center rounded-[14px] border-[4px] border-[var(--color-gray-900)] bg-transparent text-action-primary">
        <Icon name={variant === "video" ? "avatar" : "play-line"} size={44} />
      </div>
    </div>
  );
}
