"use client";

import { useRef, useState } from "react";

import { cn } from "@/components/ui/utils";

type ProjectCreateHeaderProps = {
  className?: string;
  onTitleSave?: (title: string) => void;
  projectTitle?: string;
};

export function ProjectCreateHeader({
  className,
  onTitleSave,
  projectTitle = "프로젝트명",
}: ProjectCreateHeaderProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(projectTitle);
  const inputRef = useRef<HTMLInputElement>(null);

  function startEditing() {
    if (!onTitleSave) return;
    setDraft(projectTitle);
    setEditing(true);
    setTimeout(() => inputRef.current?.select(), 0);
  }

  function commitEdit() {
    const trimmed = draft.trim();
    if (trimmed && trimmed !== projectTitle) {
      onTitleSave?.(trimmed);
    }
    setEditing(false);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") commitEdit();
    if (e.key === "Escape") setEditing(false);
  }

  return (
    <header
      className={cn(
        "flex h-[58px] items-center gap-3 bg-[linear-gradient(90deg,#694cf6_0%,#302b5d_36%,#0b0b0f_100%)] px-[28px]",
        className
      )}
    >
      <div className="flex h-7 w-7 items-center justify-center rounded-[8px] bg-[rgba(255,255,255,0.12)] text-[15px] font-semibold leading-none text-white">
        P
      </div>

      {editing ? (
        <input
          ref={inputRef}
          className="min-w-0 flex-1 max-w-[320px] rounded-[6px] border border-[rgba(255,255,255,0.2)] bg-[rgba(255,255,255,0.08)] px-[10px] py-[4px] text-[16px] font-semibold leading-none tracking-[-0.02em] text-white outline-none"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commitEdit}
          onKeyDown={handleKeyDown}
          autoFocus
        />
      ) : (
        <button
          type="button"
          className={cn(
            "text-[16px] font-semibold leading-none tracking-[-0.02em] text-white",
            onTitleSave
              ? "cursor-pointer rounded-[6px] px-[6px] py-[3px] transition-colors hover:bg-[rgba(255,255,255,0.1)]"
              : "cursor-default"
          )}
          onClick={onTitleSave ? startEditing : undefined}
        >
          {projectTitle}
        </button>
      )}
    </header>
  );
}
