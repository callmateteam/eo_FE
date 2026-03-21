"use client";

import { Button } from "@/components/ui/Button";
import { DragDropCard } from "@/components/ui/DragDropCard";
import { InputField } from "@/components/ui/InputField";

import { ProjectCreateResultView } from "@/components/project-create/ProjectCreateResultView";
import { ProjectCreateSelectField } from "@/components/project-create/ProjectCreateSelectField";
import { ProjectCreateTextareaField } from "@/components/project-create/ProjectCreateTextareaField";

type CharacterSetupStepProps = {
  description: string;
  isSubmitting?: boolean;
  isPreviewMode: boolean;
  name: string;
  onFilesChange: (files: File[]) => void;
  onDescriptionChange: (value: string) => void;
  onNameChange: (value: string) => void;
  onPrimaryAction: () => void;
  onResetPreview: () => void;
  onStyleChange: (value: string) => void;
  onVoiceChange: (value: string) => void;
  previewImageSrc: string;
  style: string;
  voice: string;
};

const styleOptions = [
  { label: "실사", value: "REALISTIC" },
  { label: "애니메이션", value: "ANIME" },
  { label: "3D 카툰", value: "CARTOON_3D" },
  { label: "2D 일러스트", value: "ILLUSTRATION_2D" },
  { label: "클레이", value: "CLAY" },
  { label: "수채화", value: "WATERCOLOR" },
] as const;

const voiceOptions = [
  { label: "alloy", value: "alloy" },
  { label: "ash", value: "ash" },
  { label: "ballad", value: "ballad" },
  { label: "coral", value: "coral" },
  { label: "echo", value: "echo" },
  { label: "fable", value: "fable" },
  { label: "onyx", value: "onyx" },
  { label: "nova", value: "nova" },
  { label: "sage", value: "sage" },
  { label: "shimmer", value: "shimmer" },
] as const;

export function CharacterSetupStep({
  description,
  isSubmitting = false,
  isPreviewMode,
  name,
  onFilesChange,
  onDescriptionChange,
  onNameChange,
  onPrimaryAction,
  onResetPreview,
  onStyleChange,
  onVoiceChange,
  previewImageSrc,
  style,
  voice,
}: CharacterSetupStepProps) {
  if (isPreviewMode) {
    return (
      <ProjectCreateResultView
        characterName={name}
        description={description}
        isSubmitting={isSubmitting}
        imageUrl={previewImageSrc}
        onCancel={onResetPreview}
        onCharacterNameChange={onNameChange}
        onDescriptionChange={onDescriptionChange}
        onRegister={onPrimaryAction}
        onRegenerate={onResetPreview}
        onVoiceChange={onVoiceChange}
        voice={voice}
        voiceOptions={[...voiceOptions]}
      />
    );
  }

  return (
    <div className="mx-auto grid w-full max-w-[1162px] grid-cols-1 gap-[18px] xl:grid-cols-[minmax(0,572px)_minmax(0,430px)] xl:justify-center">
      <DragDropCard
        className="h-[584px] max-w-none rounded-[24px]"
        maxFiles={2}
        onFilesChange={onFilesChange}
      />

      <section className="flex min-h-[584px] flex-col rounded-[24px] border border-[#60606e] bg-[#1f1f24] px-[18px] py-[26px]">
        <div className="flex flex-col gap-[26px]">
          <InputField
            className="h-[46px] rounded-[8px] border-[#2d2d34] bg-[#121214] px-4"
            label="캐릭터 이름"
            onChange={(event) => onNameChange(event.target.value)}
            placeholder="예시 : 홍길동"
            value={name}
          />

          <ProjectCreateTextareaField
            className="overflow-y-auto"
            label="설명"
            onChange={(event) => onDescriptionChange(event.target.value)}
            value={description}
          />

          <ProjectCreateSelectField
            label="캐릭터 스타일"
            onChange={(event) => onStyleChange(event.target.value)}
            options={[...styleOptions]}
            value={style}
          />

          <ProjectCreateSelectField
            label="음성 선택"
            onChange={(event) => onVoiceChange(event.target.value)}
            options={[...voiceOptions]}
            value={voice}
          />
        </div>

        <div className="mt-auto flex justify-end pt-[28px]">
          <Button
            className="min-w-[124px]"
            size="tiny"
            disabled={isSubmitting}
            onClick={onPrimaryAction}
          >
            {isSubmitting ? "생성 중" : "캐릭터 생성"}
          </Button>
        </div>
      </section>
    </div>
  );
}
