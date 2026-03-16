import { cn } from "@/components/ui/utils";

type ProjectCreateHeaderProps = {
  className?: string;
  title?: string;
};

export function ProjectCreateHeader({
  className,
  title = "프로젝트명",
}: ProjectCreateHeaderProps) {
  return (
    <header
      className={cn(
        "flex h-[44px] items-center gap-3 bg-[linear-gradient(90deg,#694cf6_0%,#302b5d_36%,#1f1f24_100%)] px-[28px]",
        className
      )}
    >
      <div className="flex h-7 w-7 items-center justify-center rounded-[8px] bg-[rgba(255,255,255,0.12)] text-[15px] font-semibold leading-none text-white">
        P
      </div>
      <span className="text-[16px] font-semibold leading-none tracking-[-0.02em] text-white">
        {title}
      </span>
    </header>
  );
}
