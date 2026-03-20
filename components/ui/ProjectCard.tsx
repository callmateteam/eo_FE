"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { Badge, BadgeColor } from "@/components/ui/Badge";
import { Menu } from "@/components/ui/Menu";
import { cn } from "@/components/ui/utils";

type ProjectCardProps = {
  characterName?: string;
  className?: string;
  editLabel?: string;
  imageSrc: string;
  initialMenuOpen?: boolean;
  menuAriaLabel?: string;
  onDelete?: () => void;
  onEdit?: () => void;
  statusColor?: BadgeColor;
  statusLabel?: string | null;
  title: string;
};

export function ProjectCard({
  characterName,
  className,
  editLabel = "수정",
  imageSrc,
  initialMenuOpen = false,
  menuAriaLabel = "프로젝트 메뉴 열기",
  onDelete,
  onEdit,
  statusColor = "blue",
  statusLabel,
  title,
}: ProjectCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(initialMenuOpen);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMenuOpen(initialMenuOpen);
  }, [initialMenuOpen]);

  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    function handlePointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, [isMenuOpen]);

  function handleMenuToggle() {
    setIsMenuOpen((current) => !current);
  }

  function handleEdit() {
    setIsMenuOpen(false);
    onEdit?.();
  }

  function handleDelete() {
    setIsMenuOpen(false);
    onDelete?.();
  }

  return (
    <article
      ref={rootRef}
      className={cn(
        "group relative h-[280px] w-[225px] shrink-0 overflow-hidden rounded-[20px] border border-transparent bg-[#2c2c31]",
        (isMenuOpen || onEdit || onDelete) && "hover:border-[#ba4eff]",
        isMenuOpen && "border-[#ba4eff]",
        className
      )}
    >
      <div className="absolute inset-0">
        <Image
          alt={title}
          className="h-full w-full object-cover"
          fill
          sizes="225px"
          src={imageSrc}
        />
        <div className="absolute inset-0 bg-[rgba(0,0,0,0.2)]" />
      </div>

      <div className="relative flex items-start justify-between p-3">
        {onEdit || onDelete ? (
          <div className="relative">
            <button
              aria-expanded={isMenuOpen}
              aria-label={menuAriaLabel}
              className={cn(
                "flex h-6 w-6 cursor-pointer items-center justify-center rounded-md text-[#f5f5f5] opacity-0 transition-opacity group-hover:opacity-100",
                isMenuOpen && "opacity-100"
              )}
              onClick={handleMenuToggle}
              type="button"
            >
              <span className="mb-[7px] text-[18px] leading-none">...</span>
            </button>

            {isMenuOpen ? (
              <Menu
                className="absolute left-0 top-[26px] z-10 shadow-[0_12px_24px_rgba(0,0,0,0.4)]"
                deleteLabel="삭제"
                editLabel={editLabel}
                onDelete={handleDelete}
                onEdit={handleEdit}
              />
            ) : null}
          </div>
        ) : (
          <div />
        )}

        <div className="flex items-center gap-1">
          {statusLabel ? <Badge color={statusColor} text={statusLabel} /> : null}
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-14 rounded-b-[20px] bg-[#2c2c31] px-3 py-[14px]">
        <div className="flex items-center justify-between gap-3">
          <h3 className="truncate text-[18px] font-semibold leading-[28px] tracking-[-0.18px] text-[#f5f5f5]">
            {title}
          </h3>
          {characterName ? (
            <span className="shrink-0 truncate text-[14px] font-normal leading-6 text-[#e5e5ea]">
              {characterName}
            </span>
          ) : null}
        </div>
      </div>
    </article>
  );
}
