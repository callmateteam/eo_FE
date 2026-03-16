"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { ApiError } from "@/lib/api/client";
import { getApiBaseUrl } from "@/lib/api/client";
import {
  createCustomCharacter,
  getCustomCharacter,
  type CharacterStyle,
  type CustomCharacter,
  type VoiceId,
} from "@/lib/api/characters";

import { Button } from "@/components/ui/Button";
import { DragDropCard } from "@/components/ui/DragDropCard";
import { InputField } from "@/components/ui/InputField";

import { ProjectCreateLoadingView } from "@/components/project-create/ProjectCreateLoadingView";
import { ProjectCreateResultView } from "@/components/project-create/ProjectCreateResultView";
import { ProjectCreateSelectField } from "@/components/project-create/ProjectCreateSelectField";
import { ProjectCreateShell } from "@/components/project-create/ProjectCreateShell";
import { ProjectCreateTextareaField } from "@/components/project-create/ProjectCreateTextareaField";

const characterStyleOptions = [
  { label: "리얼", value: "REALISTIC" },
  { label: "애니", value: "ANIME" },
  { label: "3D 카툰", value: "CARTOON_3D" },
  { label: "2D 일러스트", value: "ILLUSTRATION_2D" },
  { label: "클레이", value: "CLAY" },
  { label: "수채화", value: "WATERCOLOR" },
];

const voiceOptions = [
  { label: "alloy", value: "alloy" },
  { label: "ash", value: "ash" },
  { label: "ballad", value: "ballad" },
  { label: "coral", value: "coral" },
  { label: "nova", value: "nova" },
  { label: "echo", value: "echo" },
  { label: "fable", value: "fable" },
  { label: "onyx", value: "onyx" },
  { label: "sage", value: "sage" },
  { label: "shimmer", value: "shimmer" },
];

const USE_MOCK_CHARACTER_CREATION = true;

type ViewMode = "completed" | "creating" | "editing";
type CharacterProgressPayload = {
  character_id: string;
  progress: number;
  status: string;
  step: string;
};

function wait(ms: number) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function getCharacterProgressWebSocketUrl(characterId: string) {
  const apiUrl = new URL(getApiBaseUrl());
  const protocol = apiUrl.protocol === "https:" ? "wss:" : "ws:";

  return `${protocol}//${apiUrl.host}/api/characters/custom/ws/${characterId}`;
}

async function listenToCustomCharacterProgress(
  characterId: string,
  onProgress: (payload: CharacterProgressPayload) => void
) {
  return new Promise<void>((resolve, reject) => {
    const socket = new WebSocket(getCharacterProgressWebSocketUrl(characterId));
    const timeoutId = window.setTimeout(() => {
      socket.close();
      reject(new Error("캐릭터 생성 진행률 수신이 지연되고 있습니다."));
    }, 120000);

    const cleanup = () => {
      window.clearTimeout(timeoutId);
      socket.onclose = null;
      socket.onerror = null;
      socket.onmessage = null;
      socket.onopen = null;
    };

    socket.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data) as CharacterProgressPayload;
        onProgress(payload);

        if (payload.status === "COMPLETED") {
          cleanup();
          socket.close();
          resolve();
        }

        if (payload.status === "FAILED") {
          cleanup();
          socket.close();
          reject(new Error(payload.step || "캐릭터 생성에 실패했습니다."));
        }
      } catch {
        cleanup();
        socket.close();
        reject(new Error("캐릭터 생성 진행률 응답을 해석하지 못했습니다."));
      }
    };

    socket.onerror = () => {
      cleanup();
      socket.close();
      reject(new Error("캐릭터 생성 진행률 연결에 실패했습니다."));
    };

    socket.onclose = () => {
      cleanup();
    };
  });
}

async function pollForCustomCharacter(characterId: string) {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    const character = await getCustomCharacter(characterId);

    if (character.status === "COMPLETED") {
      return character;
    }

    if (character.status === "FAILED") {
      throw new Error(character.error_msg ?? "캐릭터 생성에 실패했습니다.");
    }

    await wait(1800);
  }

  throw new Error("캐릭터 생성이 예상보다 오래 걸리고 있습니다.");
}

export function ProjectCreatePage() {
  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);
  const [characterName, setCharacterName] = useState("");
  const [description, setDescription] = useState(
    "홍길동은 날카한 체형과 또렷한 눈매를 가진 인물로, 민첩하고 자신감 있는 인상을 준다. 단정한 학생 차림에 활동하기 편한 복식을 입고 있으며, 전체적으로 깔끔하고 기민한 분위기가 느껴진다."
  );
  const [characterStyle, setCharacterStyle] =
    useState<CharacterStyle>("ILLUSTRATION_2D");
  const [voice, setVoice] = useState<VoiceId>("alloy");
  const [viewMode, setViewMode] = useState<ViewMode>("editing");
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState(
    "캐릭터를 생성하는 중입니다"
  );
  const [generatedCharacter, setGeneratedCharacter] =
    useState<CustomCharacter | null>(null);
  const [createError, setCreateError] = useState<string | null>(null);
  const previewUrlsRef = useRef<string[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  useEffect(() => {
    return () => {
      previewUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  const selectedPreviewUrl = previewUrls[0] ?? null;
  const canSubmit = files.length >= 2 && characterName.trim().length > 0;

  const buildMockCharacter = () => {
    const createdAt = new Date().toISOString();

    return {
      created_at: createdAt,
      description,
      id: `mock-character-${Date.now()}`,
      image_url_1: previewUrls[0] ?? "",
      image_url_2: previewUrls[1] ?? previewUrls[0] ?? "",
      name: characterName.trim(),
      status: "COMPLETED",
      style: characterStyle,
      style_label:
        characterStyleOptions.find((option) => option.value === characterStyle)
          ?.label ?? "2D 일러스트",
      voice_id: voice,
      voice_style: "",
    } satisfies CustomCharacter;
  };

  const startProgressAnimation = () => {
    setProgress(12);
    setProgressMessage("이미지를 분석하고 있습니다");

    return window.setInterval(() => {
      setProgress((current) => {
        if (current >= 90) {
          return current;
        }

        if (current >= 72) {
          setProgressMessage("캐릭터 디테일을 정리하고 있습니다");
          return Math.min(current + 3, 90);
        }

        if (current >= 36) {
          setProgressMessage("캐릭터를 생성하고 있습니다");
          return Math.min(current + 7, 72);
        }

        return Math.min(current + 9, 36);
      });
    }, 700);
  };

  const applyCompletedCharacter = (character: CustomCharacter) => {
    setGeneratedCharacter(character);
    setCharacterName(character.name);
    setDescription(character.description);
    setVoice(character.voice_id ?? voice);
    setViewMode("completed");
  };

  const handleCreateCharacter = async () => {
    if (!canSubmit) {
      setCreateError("이미지 2장과 캐릭터 이름을 입력해주세요.");
      return;
    }

    const [image1, image2] = files;

    if (!image1 || !image2) {
      setCreateError("이미지 2장을 업로드해주세요.");
      return;
    }

    setCreateError(null);
    setGeneratedCharacter(null);
    setViewMode("creating");

    const progressTimer = startProgressAnimation();

    try {
      if (USE_MOCK_CHARACTER_CREATION) {
        await wait(1600);
        window.clearInterval(progressTimer);
        setProgressMessage("캐릭터 생성이 완료되었습니다");
        setProgress(100);
        await wait(250);
        applyCompletedCharacter(buildMockCharacter());
        return;
      }

      const created = await createCustomCharacter({
        description,
        image1,
        image2,
        name: characterName.trim(),
        style: characterStyle,
        voiceId: voice,
      });

      void listenToCustomCharacterProgress(
        created.id,
        (payload) => {
          setProgress(Math.min(Math.max(payload.progress, 12), 99));
          setProgressMessage(payload.step || "캐릭터를 생성하는 중입니다");
        }
      ).catch((error) => {
        if (error instanceof Error) {
          setProgressMessage(error.message);
        }
      });

      const character = await pollForCustomCharacter(created.id);
      window.clearInterval(progressTimer);
      setProgressMessage("캐릭터 생성이 완료되었습니다");
      setProgress(100);
      await wait(250);
      applyCompletedCharacter(character);
    } catch (error) {
      window.clearInterval(progressTimer);

      if (error instanceof ApiError) {
        setCreateError(error.message);
        setViewMode("editing");
        setProgress(0);
        return;
      }

      setCreateError(
        error instanceof Error
          ? error.message
          : "캐릭터 생성 요청을 완료하지 못했습니다."
      );
      setViewMode("editing");
      setProgress(0);
    }
  };

  const handleRegisterCharacter = () => {
    const characterId =
      generatedCharacter?.id ?? `draft-character-${Date.now()}`;

    window.sessionStorage.setItem(
      "project-create-character",
      JSON.stringify({
        characterId,
        description,
        imageUrl: generatedCharacter?.image_url_1 ?? selectedPreviewUrl,
        name: characterName,
        style: characterStyle,
        voice,
      })
    );

    router.push(`/project/create/idea?characterId=${encodeURIComponent(characterId)}`);
  };

  const handleCancelCompleted = () => {
    setViewMode("editing");
    setCreateError(null);
  };

  const handleFilesChange = (nextFiles: File[]) => {
    previewUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    const nextPreviewUrls = nextFiles.map((file) => URL.createObjectURL(file));
    previewUrlsRef.current = nextPreviewUrls;
    setPreviewUrls(nextPreviewUrls);
    setFiles(nextFiles);
  };

  return (
    <ProjectCreateShell
      actions={
        viewMode === "editing" ? (
          <>
            <Button size="tiny" variant="outlined" onClick={() => router.back()}>
              이전
            </Button>
            <Button size="tiny" onClick={handleCreateCharacter}>
              캐릭터 생성
            </Button>
          </>
        ) : undefined
      }
    >
      {createError ? (
        <p className="mx-auto mb-[20px] w-full max-w-[1162px] rounded-[12px] border border-[#5b2c32] bg-[rgba(91,44,50,0.18)] px-[18px] py-[14px] text-body-lg text-[#ffb8bf]">
          {createError}
        </p>
      ) : null}

      {viewMode === "creating" ? (
        <ProjectCreateLoadingView
          imageUrl={selectedPreviewUrl}
          progress={progress}
          stepMessage={progressMessage}
        />
      ) : null}

      {viewMode === "completed" ? (
        <ProjectCreateResultView
          characterName={characterName}
          description={description}
          imageUrl={generatedCharacter?.image_url_1 ?? selectedPreviewUrl}
          isSubmitting={false}
          onCancel={handleCancelCompleted}
          onCharacterNameChange={setCharacterName}
          onDescriptionChange={setDescription}
          onRegister={handleRegisterCharacter}
          onRegenerate={handleCreateCharacter}
          onVoiceChange={(value) => setVoice(value as VoiceId)}
          voice={voice}
          voiceOptions={voiceOptions}
        />
      ) : null}

      {viewMode === "editing" ? (
        <div className="grid grid-cols-1 justify-center justify-items-center gap-[18px] xl:grid-cols-[minmax(0,572px)_minmax(0,572px)]">
          <DragDropCard
            className="h-[486px] w-full max-w-[572px] rounded-[18px] px-[30px] py-[28px]"
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
            onFilesChange={handleFilesChange}
            subtitle="JPG, PNG, HEIC 등 (최대 10MB)"
            title="이미지 파일 업로드"
          />

          <section className="w-full max-w-[572px] rounded-[18px] border border-[#60606e] bg-[#202026] px-[18px] py-[22px]">
            <div className="flex flex-col gap-[26px]">
              <InputField
                className="h-[60px] rounded-[8px] border-[#2d2d34] bg-[#121214] px-4"
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
                onChange={(event) =>
                  setCharacterStyle(event.target.value as CharacterStyle)
                }
                options={characterStyleOptions}
                value={characterStyle}
              />

              <ProjectCreateSelectField
                label="음성 선택"
                onChange={(event) => setVoice(event.target.value as VoiceId)}
                options={voiceOptions}
                value={voice}
              />

              <div className="hidden" aria-hidden>
                {files.length}
              </div>
            </div>
          </section>
        </div>
      ) : null}
    </ProjectCreateShell>
  );
}
