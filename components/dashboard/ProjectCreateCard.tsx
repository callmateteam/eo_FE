import { Icon } from "@/components/ui/Icon";

export function ProjectCreateCard() {
  return (
    <button
      className="flex h-[184px] w-[148px] shrink-0 flex-col items-center justify-center gap-[14px] rounded-[16px] border border-[#60606e] bg-[#202026] text-white transition-colors hover:border-[#8b45ff]"
      type="button"
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#8b45ff] text-[#8b45ff]">
        <Icon className="size-4" name="plus" />
      </span>
      <span className="text-[12px] font-semibold leading-none tracking-[-0.02em] text-[#d7d7dc]">
        새 프로젝트 생성
      </span>
    </button>
  );
}
