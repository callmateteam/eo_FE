"use client";

import type { DragEvent, HTMLAttributes } from "react";
import { useId, useState } from "react";

import { MediaStackIllustration } from "@/components/ui/MediaStackIllustration";
import { cn } from "@/components/ui/utils";

type DragDropState = "default" | "hovered" | "pressed";

type Props = HTMLAttributes<HTMLDivElement> & {
  accept?: string;
  description?: string;
  helperText?: string;
  maxFiles?: number;
  onFilesChange?: (files: File[]) => void;
  state?: DragDropState;
  title?: string;
};

export function DragDropCard({
  accept = ".mp4,.jpg,.jpeg,.png",
  className,
  description = "생성하고 싶은 캐릭터의 여러 각도 이미지나 영상을 첨부할수록 정확한 캐릭터를 생성할 수 있어요",
  helperText = "MP4, JPG, PNG 등 (최대 10MB)",
  maxFiles = 10,
  onFilesChange,
  state = "default",
  title = "Drag & Drop",
  ...props
}: Props) {
  const inputId = useId();
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const interactiveState =
    state === "pressed" || isPressed
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

  return (
    <label
      {...props}
      htmlFor={inputId}
      className={cn(
        "flex min-h-[640px] w-full cursor-pointer flex-col items-center justify-center rounded-[28px] border p-8 text-center transition-colors",
        interactiveState === "default" &&
          "border-black/10 bg-[linear-gradient(180deg,#121214_0%,#1e1e22_100%)]",
        interactiveState === "hovered" &&
          "border-primary-500 bg-gray-700",
        interactiveState === "pressed" &&
          "border-primary-500 bg-gray-700 shadow-[0_0_0_1px_#ba4eff]",
        className
      )}
      onDragEnter={() => setIsDragging(true)}
      onDragLeave={() => setIsDragging(false)}
      onDragOver={(event) => event.preventDefault()}
      onDrop={handleDrop}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
    >
      <input
        accept={accept}
        className="sr-only"
        id={inputId}
        multiple
        onChange={(event) => updateFiles(Array.from(event.target.files ?? []))}
        type="file"
      />
      <MediaStackIllustration className="mb-10" />
      <h3 className="text-headline-l text-gray-50">{title}</h3>
      <p className="mt-4 text-label-l text-gray-300">{helperText}</p>
      <p className="mt-6 max-w-[520px] text-body-m text-gray-300">
        {description}
      </p>
      <div className="mt-8 flex flex-col items-center gap-3">
        <span className="text-label-l text-primary-500">
          클릭하거나 파일을 여기로 드래그하세요
        </span>
        {files.length > 0 ? (
          <ul className="flex flex-col gap-2 text-body-m text-gray-50">
            {files.map((file) => (
              <li key={`${file.name}-${file.size}`}>{file.name}</li>
            ))}
          </ul>
        ) : null}
      </div>
    </label>
  );
}
