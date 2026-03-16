"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/Button";
import { DragDropCard } from "@/components/ui/DragDropCard";
import { InputField } from "@/components/ui/InputField";

import { ProjectCreateSelectField } from "@/components/project-create/ProjectCreateSelectField";
import { ProjectCreateShell } from "@/components/project-create/ProjectCreateShell";
import { ProjectCreateTextareaField } from "@/components/project-create/ProjectCreateTextareaField";

const characterStyleOptions = [
  { label: "만화", value: "comic" },
  { label: "애니", value: "anime" },
  { label: "리얼", value: "realistic" },
];

const voiceOptions = [
  { label: "성우 선택", value: "default" },
  { label: "alloy", value: "alloy" },
  { label: "nova", value: "nova" },
  { label: "echo", value: "echo" },
];

export function ProjectCreatePage() {
  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);
  const [characterName, setCharacterName] = useState("");
  const [description, setDescription] = useState(
    "홍길동은 날카한 체형과 또렷한 눈매를 가진 인물로, 민첩하고 자신감 있는 인상을 준다. 단정한 학생 차림에 활동하기 편한 복식을 입고 있으며, 전체적으로 깔끔하고 기민한 분위기가 느껴진다."
  );
  const [characterStyle, setCharacterStyle] = useState("comic");
  const [voice, setVoice] = useState("default");

  return (
    <ProjectCreateShell
      actions={
        <>
          <Button size="tiny" variant="outlined" onClick={() => router.back()}>
            이전
          </Button>
          <Button size="tiny">캐릭터 생성</Button>
        </>
      }
    >
      <div className="grid grid-cols-[minmax(0,572px)_minmax(0,432px)] justify-center gap-[18px]">
        <DragDropCard
          className="h-[486px] w-[432px] rounded-[18px] px-[30px] py-[28px]"
          guideLabel="권장 업로드 가이드"
          guideItems={[
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
          ]}
          minFiles={2}
          onFilesChange={setFiles}
          subtitle="JPG, PNG, HEIC 등 (최대 10MB)"
          title="이미지 파일 업로드"
        />

        <section className="rounded-[18px] border border-[#60606e] bg-[#202026] px-[18px] py-[22px]">
          <div className="flex flex-col gap-[26px]">
            <InputField
              className="h-[44px] rounded-[8px] border-[#2d2d34] bg-[#121214] px-4"
              label="캐릭터 이름"
              onChange={(event) => setCharacterName(event.target.value)}
              placeholder="예시: 홍길동"
              value={characterName}
            />

            <ProjectCreateTextareaField
              label="설명"
              onChange={(event) => setDescription(event.target.value)}
              value={description}
            />

            <ProjectCreateSelectField
              label="캐릭터 스타일"
              onChange={(event) => setCharacterStyle(event.target.value)}
              options={characterStyleOptions}
              value={characterStyle}
            />

            <ProjectCreateSelectField
              label="음성 선택"
              onChange={(event) => setVoice(event.target.value)}
              options={voiceOptions}
              value={voice}
            />

            <div className="hidden" aria-hidden>
              {files.length}
            </div>
          </div>
        </section>
      </div>
    </ProjectCreateShell>
  );
}
