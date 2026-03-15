"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { Badge } from "@/components/ui/Badge";
import { Menu } from "@/components/ui/Menu";
import { cn } from "@/components/ui/utils";

type CharacterCardProps = {
  badgeLabel?: string | null;
  className?: string;
  imageSrc: string;
  initialMenuOpen?: boolean;
  menuAriaLabel?: string;
  onDelete?: () => void;
  onEdit?: () => void;
  title: string;
};

export function CharacterCard({
  badgeLabel,
  className,
  imageSrc,
  initialMenuOpen = false,
  menuAriaLabel = "캐릭터 메뉴 열기",
  onDelete,
  onEdit,
  title,
}: CharacterCardProps) {
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
        "group relative h-[184px] w-[146px] shrink-0 overflow-hidden rounded-[16px] border border-transparent bg-[#292930]",
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
          sizes="146px"
          src={imageSrc}
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,8,10,0.04)_0%,rgba(8,8,10,0.18)_48%,rgba(20,20,23,0.88)_100%)]" />
      </div>

      <div className="relative flex h-full flex-col justify-between p-[10px]">
        <div className="flex items-start justify-between">
          {onEdit || onDelete ? (
            <div className="relative">
              <button
                aria-expanded={isMenuOpen}
                aria-label={menuAriaLabel}
                className={cn(
                  "flex h-5 w-5 items-center justify-center rounded-md text-[#f5f5f5] opacity-0 transition-opacity group-hover:opacity-100",
                  isMenuOpen && "opacity-100"
                )}
                onClick={() => setIsMenuOpen((current) => !current)}
                type="button"
              >
                <span className="mb-[7px] text-[16px] leading-none">...</span>
              </button>
              {isMenuOpen ? (
                <Menu
                  className="absolute left-0 top-[22px] z-10 shadow-[0_12px_24px_rgba(0,0,0,0.4)]"
                  onDelete={handleDelete}
                  onEdit={handleEdit}
                />
              ) : null}
            </div>
          ) : (
            <div />
          )}

          {badgeLabel ? (
            <Badge
              className={cn(
                "px-[8px] py-[5px] text-[9px] font-semibold leading-none tracking-[-0.02em]",
                badgeLabel === "My" && "bg-[#3c3c45]",
                badgeLabel === "Basic" && "bg-primary-500"
              )}
              color={badgeLabel === "My" ? "gray" : "pink"}
              text={badgeLabel}
            />
          ) : null}
        </div>

        <div className="space-y-[3px]">
          <h3 className="truncate text-[12px] font-semibold leading-none tracking-[-0.02em] text-white">
            {title}
          </h3>
        </div>
      </div>
    </article>
  );
}
