"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useQueryClient } from "@tanstack/react-query";

import { CharacterCreateProgressModal } from "@/components/character-create/modals/CharacterCreateProgressModal";
import { CharacterRegisteredModal } from "@/components/character-create/modals/CharacterRegisteredModal";
import { CharacterCreateShell } from "@/components/character-create/CharacterCreateShell";
import { CharacterSetupStep } from "@/components/character-create/steps/CharacterSetupStep";
import { useCreateCustomCharacter } from "@/hooks/useCharacters";
import { useCreateProject } from "@/hooks/useProjects";
import { queryKeys } from "@/hooks/query-keys";
import { getCustomCharacter } from "@/lib/api/characters";
import type { CharacterStyle, CustomCharacterItem, VoiceId } from "@/lib/api/types";
import { compressImage } from "@/lib/compress-image";
import { landingAssets } from "@/lib/assets";
import { clearProjectDraft, updateProjectDraft } from "@/lib/project-draft";

type FlowScreen = "setup" | "preview";

const initialDescription =
  "홍길동은 날렵한 체형과 또렷한 눈매를 가진 인물로, 민첩하고 자신감 있는 인상을 준다. 단정한 한복 차림에 활동하기 편한 복식을 입고 있으며, 전체적으로 깔끔하고 기민한 분위기가 느껴진다.";

export function CharacterCreateFlowPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [screen, setScreen] = useState<FlowScreen>("setup");
  const [showCharacterModal, setShowCharacterModal] = useState(false);
  const [showRegisteredModal, setShowRegisteredModal] = useState(false);
  const [characterName, setCharacterName] = useState("홍길동");
  const [characterDescription, setCharacterDescription] =
    useState(initialDescription);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [progress, setProgress] = useState(10);
  const [progressStep, setProgressStep] = useState(
    "업로드한 이미지를 분석하고 있어요."
  );
  const [createdCharacterId, setCreatedCharacterId] = useState("");
  const [createdCharacter, setCreatedCharacter] = useState<CustomCharacterItem | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [styleValue, setStyleValue] = useState<CharacterStyle>("ANIME");
  const [voiceValue, setVoiceValue] = useState<VoiceId>("alloy");

  const createCharacterMutation = useCreateCustomCharacter();
  const createProjectMutation = useCreateProject();

  // Poll character creation status
  useEffect(() => {
    if (!showCharacterModal || !createdCharacterId) return;

    let cancelled = false;

    const poll = async () => {
      try {
        const character = await getCustomCharacter(createdCharacterId);
        if (cancelled) return;

        const status = character.status?.toUpperCase();

        if (status === "COMPLETED") {
          setCreatedCharacter(character);
          setShowCharacterModal(false);
          setScreen("preview");
          void queryClient.invalidateQueries({ queryKey: queryKeys.characters.custom });
          void queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
          return;
        }

        if (status === "FAILED") {
          setShowCharacterModal(false);
          setErrorMessage(character.error_msg ?? "캐릭터 생성에 실패했습니다.");
          return;
        }

        // Update progress based on status
        if (status === "PROCESSING") {
          setProgress((prev) => Math.min(prev + 5, 85));
          setProgressStep("AI가 사진을 학습하고 있어요.");
        }
      } catch (error) {
        if (!cancelled) {
          setShowCharacterModal(false);
          setErrorMessage(
            error instanceof Error
              ? error.message
              : "캐릭터 생성 상태를 확인하지 못했습니다."
          );
        }
      }
    };

    void poll();
    const intervalId = window.setInterval(() => void poll(), 3000);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
  }, [createdCharacterId, queryClient, showCharacterModal]);

  async function handleCreateCharacter() {
    if (selectedFiles.length !== 2) {
      setErrorMessage("이미지는 정확히 2장 업로드해주세요.");
      return;
    }
    if (!characterName.trim()) {
      setErrorMessage("캐릭터 이름을 입력해주세요.");
      return;
    }
    if (!characterDescription.trim()) {
      setErrorMessage("캐릭터 설명을 입력해주세요.");
      return;
    }

    setErrorMessage(null);
    setCreatedCharacterId("");
    setCreatedCharacter(null);
    setProgress(5);
    setProgressStep("캐릭터 생성 요청을 전송하고 있어요.");
    setShowCharacterModal(true);

    try {
      setProgressStep("이미지를 압축하고 있어요.");

      const [compressed1, compressed2] = await Promise.all([
        compressImage(selectedFiles[0]),
        compressImage(selectedFiles[1]),
      ]);

      setProgress(8);
      setProgressStep("캐릭터 생성 요청을 전송하고 있어요.");

      const formData = new FormData();
      formData.append("name", characterName.trim());
      formData.append("description", characterDescription.trim());
      formData.append("style", styleValue);
      formData.append("voice_id", voiceValue);
      formData.append("image1", compressed1);
      formData.append("image2", compressed2);

      const response = await createCharacterMutation.mutateAsync(formData);
      setCreatedCharacterId(response.id);
      setProgress(10);
      setProgressStep("이미지를 업로드하고 있어요.");
    } catch (error) {
      setShowCharacterModal(false);
      setErrorMessage(
        error instanceof Error ? error.message : "캐릭터 생성에 실패했습니다."
      );
    }
  }

  async function handleCreateProject() {
    if (!createdCharacter) {
      setErrorMessage("등록할 캐릭터 정보를 찾을 수 없습니다.");
      return;
    }

    try {
      const project = await createProjectMutation.mutateAsync({
        custom_character_id: createdCharacter.id,
        title: `${createdCharacter.name} 프로젝트`,
      });

      clearProjectDraft();
      updateProjectDraft({
        characterId: createdCharacter.id,
        characterImage:
          createdCharacter.image_url_1 ||
          createdCharacter.image_url_2 ||
          landingAssets.cards.characterChef,
        characterName: createdCharacter.name,
        characterSource: "custom",
        projectId: project.id,
        title: project.title,
      });

      router.push(`/project/create/idea?projectId=${encodeURIComponent(project.id)}`);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "프로젝트 생성에 실패했습니다."
      );
    }
  }

  return (
    <>
      <CharacterCreateShell currentStep={0} description={getDescription(screen)} title="새 캐릭터 생성">
        {errorMessage ? (
          <p className="mx-auto mb-[18px] max-w-[1162px] rounded-[14px] border border-[#5b2c32] bg-[rgba(91,44,50,0.18)] px-[18px] py-[14px] text-[14px] text-[#ffb8bf]">
            {errorMessage}
          </p>
        ) : null}

        <CharacterSetupStep
          description={characterDescription}
          isSubmitting={createCharacterMutation.isPending}
          isPreviewMode={screen === "preview"}
          name={createdCharacter?.name ?? characterName}
          onDescriptionChange={setCharacterDescription}
          onFilesChange={setSelectedFiles}
          onNameChange={setCharacterName}
          onPrimaryAction={() => {
            setErrorMessage(null);

            if (screen === "preview") {
              setShowRegisteredModal(true);
              return;
            }

            void handleCreateCharacter();
          }}
          onResetPreview={() => {
            setScreen("setup");
            setShowRegisteredModal(false);
            setCreatedCharacter(null);
            setCreatedCharacterId("");
          }}
          onStyleChange={(value) => setStyleValue(value as CharacterStyle)}
          onVoiceChange={(value) => setVoiceValue(value as VoiceId)}
          previewImageSrc={
            createdCharacter?.image_url_1 ||
            createdCharacter?.image_url_2 ||
            landingAssets.cards.characterChef
          }
          style={styleValue}
          voice={voiceValue}
        />
      </CharacterCreateShell>

      {showCharacterModal ? (
        <CharacterCreateProgressModal
          progress={progress}
          step={progressStep}
          onGoDashboard={() => {
            setShowCharacterModal(false);
            router.push("/dashboard");
          }}
          onGoNext={() => {
            setShowCharacterModal(false);
          }}
        />
      ) : null}

      {showRegisteredModal && createdCharacter ? (
        <CharacterRegisteredModal
          imageSrc={
            createdCharacter.image_url_1 ||
            createdCharacter.image_url_2 ||
            landingAssets.cards.characterChef
          }
          isSubmitting={createProjectMutation.isPending}
          onGoDashboard={() => {
            setShowRegisteredModal(false);
            router.push("/dashboard");
          }}
          onGoNext={() => {
            setErrorMessage(null);
            void handleCreateProject();
          }}
        />
      ) : null}
    </>
  );
}

function getDescription(screen: FlowScreen) {
  if (screen === "preview") {
    return "생성된 캐릭터를 확인한 뒤 다음 단계로 진행해주세요";
  }

  return "캐릭터의 이미지나 동영상을 업로드해주세요";
}
