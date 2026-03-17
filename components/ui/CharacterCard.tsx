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
  size?: "compact" | "large";
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
  size = "compact",
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
        "group relative shrink-0 overflow-hidden border border-transparent bg-[#292930]",
        size === "compact" && "h-[184px] w-[146px] rounded-[16px]",
        size === "large" && "h-[280px] w-[225px] rounded-[20px]",
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
          sizes={size === "large" ? "225px" : "146px"}
          src={imageSrc}
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,8,10,0.04)_0%,rgba(8,8,10,0.18)_48%,rgba(20,20,23,0.88)_100%)]" />
      </div>

      <div
        className={cn(
          "relative flex h-full flex-col justify-between",
          size === "compact" && "p-[10px]",
          size === "large" && "p-3"
        )}
      >
        <div className="flex items-start justify-between">
          {onEdit || onDelete ? (
            <div className="relative">
              <button
                aria-expanded={isMenuOpen}
                aria-label={menuAriaLabel}
                className={cn(
                  "flex cursor-pointer items-center justify-center rounded-md text-[#f5f5f5] opacity-0 transition-opacity group-hover:opacity-100",
                  size === "compact" && "h-5 w-5",
                  size === "large" && "h-6 w-6",
                  isMenuOpen && "opacity-100"
                )}
                onClick={() => setIsMenuOpen((current) => !current)}
                type="button"
              >
                <span
                  className={cn(
                    "leading-none",
                    size === "compact" && "mb-[7px] text-[16px]",
                    size === "large" && "mb-[7px] text-[18px]"
                  )}
                >
                  ...
                </span>
              </button>
              {isMenuOpen ? (
                <Menu
                  className={cn(
                    "absolute left-0 z-10 shadow-[0_12px_24px_rgba(0,0,0,0.4)]",
                    size === "compact" && "top-[22px]",
                    size === "large" && "top-[26px]"
                  )}
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
                "font-semibold leading-none tracking-[-0.02em]",
                size === "compact" && "px-[8px] py-[5px] text-[9px]",
                size === "large" && "px-[10px] py-[7px] text-[12px]",
                badgeLabel === "My" && "bg-[#3c3c45]",
                badgeLabel === "Basic" && "bg-primary-500"
              )}
              color={badgeLabel === "My" ? "gray" : "pink"}
              text={badgeLabel}
            />
          ) : null}
        </div>

        <div className={cn(size === "compact" && "space-y-[3px]")}>
          <h3
            className={cn(
              "truncate font-semibold tracking-[-0.02em] text-white",
              size === "compact" && "text-[12px] leading-none",
              size === "large" && "text-[18px] leading-[28px] tracking-[-0.18px]"
            )}
          >
            {title}
          </h3>
        </div>
      </div>
    </article>
  );
}
