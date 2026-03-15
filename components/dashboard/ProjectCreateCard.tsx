import { Icon } from "@/components/ui/Icon";

export function ProjectCreateCard() {
  return (
    <button
      className="flex h-[280px] w-[224px] shrink-0 flex-col items-center justify-center gap-2 rounded-[20px] border border-[#8e8e93] bg-[#1e1e22] text-white transition-colors hover:cursor-pointer hover:border-[#8a3ed9] hover:bg-[#121214] active:border-2 active:border-[#ba4eff] active:bg-[#121214]"
      type="button"
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-full border-[1.5px] border-[#ba4eff] text-[#ba4eff]">
        <Icon className="size-6" name="plus" />
      </span>
      <span className="text-center text-[14px] font-medium leading-[14px] tracking-[0.14px] text-[#e5e5ea]">
        새 프로젝트 생성
      </span>
    </button>
  );
}
