"use client";

import type { DragEvent, LabelHTMLAttributes } from "react";
import { useId, useState } from "react";

import { MediaStackIllustration } from "@/components/ui/MediaStackIllustration";
import { cn } from "@/components/ui/utils";

export type DragDropState =
  | "default"
  | "hovered"
  | "pressed"
  | "file-size-error"
  | "min-image-error";

type GuideItem =
  | {
      accent: string;
      prefix: string;
      suffix: string;
    }
  | {
      accent: string;
      accentAfter: string;
      prefix: string;
      suffix: string;
      suffixAfter: string;
    };

type Props = LabelHTMLAttributes<HTMLLabelElement> & {
  accept?: string;
  guideItems?: GuideItem[];
  guideLabel?: string;
  maxFiles?: number;
  maxFileSizeMb?: number;
  minFiles?: number;
  onFilesChange?: (files: File[]) => void;
  state?: DragDropState;
  subtitle?: string;
  title?: string;
};

const DEFAULT_GUIDE_ITEMS: GuideItem[] = [
  {
    accent: "2장 이상",
    prefix: "최소 ",
    suffix: "의 이미지를 올려주세요",
  },
  {
    accent: "다양한 각도",
    accentAfter: "여러 자세가 포함",
    prefix: "정면, 측면 등 ",
    suffix: "와 전신/상반신 등 ",
    suffixAfter: "되면 정확도가 올라가요.",
  },
  {
    accent: "배경이 복잡하지 않은 사진",
    prefix: "",
    suffix: "일수록 캐릭터 생성이 깔끔해집니다.",
  },
];

function resolveTitle(
  state: DragDropState,
  title: string,
  maxFileSizeMb: number,
  minFiles: number
) {
  if (state === "file-size-error") {
    return `파일당 최대 용량이 ${maxFileSizeMb}MB를 초과했습니다.`;
  }

  if (state === "min-image-error") {
    return `최소 ${minFiles}장의 이미지가 필요합니다.`;
  }

  return title;
}

export function DragDropCard({
  accept = ".jpg,.jpeg,.png,.heic",
  className,
  guideItems = DEFAULT_GUIDE_ITEMS,
  guideLabel = "권장 업로드 가이드",
  maxFiles = 10,
  maxFileSizeMb = 10,
  minFiles = 2,
  onFilesChange,
  state = "default",
  subtitle = "JPG, PNG, HEIC 등 (최대 10MB)",
  title = "이미지 파일 업로드",
  ...props
}: Props) {
  const inputId = useId();
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const isErrorState = state === "file-size-error" || state === "min-image-error";
  const interactiveState: DragDropState = isErrorState
    ? state
    : state === "pressed" || isPressed
      ? "pressed"
      : state === "hovered" || isDragging
        ? "hovered"
        : "default";

  const updateFiles = (nextFiles: File[]) => {
    const limitedFiles = nextFiles.slice(0, maxFiles);
    setFiles(limitedFiles);
    onFilesChange?.(limitedFiles);
  };

  const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDragging(false);
    updateFiles(Array.from(event.dataTransfer.files));
  };

  const resolvedTitle = resolveTitle(
    interactiveState,
    title,
    maxFileSizeMb,
    minFiles
  );

  return (
    <label
      {...props}
      className={cn(
        "flex h-[688px] w-full max-w-[572px] cursor-pointer flex-col items-center justify-center rounded-[20px] border border-dashed px-12 py-10 text-center transition-colors",
        interactiveState === "default" && "border-gray-300 bg-gray-800",
        interactiveState === "hovered" && "border-primary-500 bg-gray-700",
        interactiveState === "pressed" && "border-primary-500 bg-gray-700",
        isErrorState && "border-gray-300 bg-gray-800",
        className
      )}
      htmlFor={inputId}
      onDragEnter={() => !isErrorState && setIsDragging(true)}
      onDragLeave={() => !isErrorState && setIsDragging(false)}
      onDragOver={(event) => event.preventDefault()}
      onDrop={handleDrop}
      onMouseDown={() => !isErrorState && setIsPressed(true)}
      onMouseUp={() => !isErrorState && setIsPressed(false)}
    >
      <input
        accept={accept}
        className="sr-only"
        id={inputId}
        multiple
        onChange={(event) => updateFiles(Array.from(event.target.files ?? []))}
        type="file"
      />
      <div className="flex max-w-[332px] flex-col items-center gap-4">
        <MediaStackIllustration className="mb-0" />
        <div className="flex w-full flex-col items-center gap-2">
          <h3
            className={cn(
              "text-center text-[24px] font-bold leading-9 tracking-[-0.24px]",
              isErrorState ? "text-error-500" : "text-gray-50"
            )}
          >
            {resolvedTitle}
          </h3>
          <p className="text-center text-[16px] font-medium leading-7 text-gray-300">
            {subtitle}
          </p>
        </div>
        <div className="w-full rounded-lg border border-gray-700 px-2 py-3 text-left">
          <div className="mb-2 flex items-center gap-1 pl-[5px] text-[12px] leading-4 tracking-[0.12px] text-gray-300">
            <span className="inline-flex size-4 items-center justify-center rounded-full border border-gray-300 text-[10px] font-medium leading-none">
              i
            </span>
            <span>{guideLabel}</span>
          </div>
          <ul className="flex flex-col gap-1 text-[12px] leading-4 tracking-[0.12px] text-gray-300">
            {guideItems.map((item) => (
              <li key={item.accent} className="ml-[18px] list-disc">
                {item.prefix}
                <span className="text-secondary-500">{item.accent}</span>
                {item.suffix}
                {"accentAfter" in item ? (
                  <>
                    <span className="text-secondary-500">{item.accentAfter}</span>
                    {item.suffixAfter}
                  </>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
        {files.length > 0 ? (
          <ul className="flex max-w-full flex-col gap-1 text-[12px] leading-4 tracking-[0.12px] text-gray-50">
            {files.map((file) => (
              <li key={`${file.name}-${file.size}`} className="truncate">
                {file.name}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </label>
  );
}
