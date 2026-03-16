/* eslint-disable @next/next/no-img-element */

"use client";

import { Button } from "@/components/ui/Button";
import { InputField } from "@/components/ui/InputField";

import { ProjectCreateSelectField } from "@/components/project-create/ProjectCreateSelectField";
import { ProjectCreateTextareaField } from "@/components/project-create/ProjectCreateTextareaField";

type VoiceOption = {
  label: string;
  value: string;
};

type ProjectCreateResultViewProps = {
  characterName: string;
  description: string;
  imageUrl?: string | null;
  isSubmitting?: boolean;
  onCancel: () => void;
  onCharacterNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onRegister: () => void;
  onVoiceChange: (value: string) => void;
  onRegenerate: () => void;
  voice: string;
  voiceOptions: VoiceOption[];
};

export function ProjectCreateResultView({
  characterName,
  description,
  imageUrl,
  isSubmitting = false,
  onCancel,
  onCharacterNameChange,
  onDescriptionChange,
  onRegister,
  onVoiceChange,
  onRegenerate,
  voice,
  voiceOptions,
}: ProjectCreateResultViewProps) {
  return (
    <div className="grid grid-cols-1 justify-center justify-items-center gap-[18px] xl:grid-cols-[minmax(0,572px)_minmax(0,572px)]">
      <section className="flex h-[518px] w-full max-w-[572px] items-center justify-center overflow-hidden rounded-[18px] border border-[#60606e] bg-[#202026]">
        {imageUrl ? (
          <img
            alt="생성된 캐릭터 결과 이미지"
            className="h-full w-full object-cover"
            src={imageUrl}
          />
        ) : (
          <div className="text-body-lg text-[#d7d7dc]">
            생성된 이미지가 아직 없습니다.
          </div>
        )}
      </section>

      <section className="flex w-full max-w-[572px] flex-col rounded-[18px] border border-[#60606e] bg-[#202026] px-[18px] py-[22px]">
        <div className="flex flex-col gap-[26px]">
          <InputField
            className="h-[60px] rounded-[8px] border-[#2d2d34] bg-[#121214] px-4"
            label="캐릭터 이름"
            onChange={(event) => onCharacterNameChange(event.target.value)}
            value={characterName}
          />

          <ProjectCreateTextareaField
            label="설명"
            onChange={(event) => onDescriptionChange(event.target.value)}
            value={description}
          />

          <ProjectCreateSelectField
            label="음성 선택"
            onChange={(event) => onVoiceChange(event.target.value)}
            options={voiceOptions}
            value={voice}
          />
        </div>

        <div className="mt-auto flex items-center justify-end gap-[12px] pt-[34px]">
          <Button
            className="min-w-[96px]"
            size="tiny"
            state="error"
            variant="outlined"
            onClick={onCancel}
          >
            취소
          </Button>
          <Button
            className="min-w-[110px]"
            size="tiny"
            variant="outlined"
            disabled={isSubmitting}
            onClick={onRegenerate}
          >
            다시 생성
          </Button>
          <Button
            className="min-w-[126px]"
            size="tiny"
            disabled={isSubmitting}
            onClick={onRegister}
          >
            캐릭터 등록
          </Button>
        </div>
      </section>
    </div>
  );
}
