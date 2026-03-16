/* eslint-disable @next/next/no-img-element */

"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/Button";

import { ProjectCreateShell } from "@/components/project-create/ProjectCreateShell";

type ProjectStoryboardPageProps = {
  characterId?: string;
};

type StoryboardScene = {
  content: string;
  id: string;
  imageUrl: string;
  title: string;
};

const mockScenes: StoryboardScene[] = Array.from({ length: 8 }, (_, index) => ({
  content:
    "콘티 내용입니다. 콘티 내용입니다. 콘티 내용입니다. 콘티 내용입니다. 콘티 내용입니다.",
  id: `scene-${index + 1}`,
  imageUrl: "/assets/landing/cards/storyboard-cover-1.png",
  title: `#${index + 1} 씬 제목`,
}));

export function ProjectStoryboardPage({
  characterId,
}: ProjectStoryboardPageProps) {
  const router = useRouter();
  const [scenes, setScenes] = useState(mockScenes);
  const [selectedSceneId, setSelectedSceneId] = useState(mockScenes[0]?.id ?? "");
  const [draftContent, setDraftContent] = useState(mockScenes[0]?.content ?? "");

  const selectedScene = useMemo(
    () => scenes.find((scene) => scene.id === selectedSceneId) ?? scenes[0],
    [scenes, selectedSceneId]
  );

  const handleSelectScene = (sceneId: string) => {
    const nextScene = scenes.find((scene) => scene.id === sceneId);

    if (!nextScene) {
      return;
    }

    setSelectedSceneId(sceneId);
    setDraftContent(nextScene.content);
  };

  const handleSaveChanges = () => {
    if (!selectedScene) {
      return;
    }

    setScenes((currentScenes) =>
      currentScenes.map((scene) =>
        scene.id === selectedScene.id ? { ...scene, content: draftContent } : scene
      )
    );
  };

  return (
    <ProjectCreateShell
      currentStep={2}
      description="AI가 생성한 스토리보드를 검토하고 편집하세요"
      title="스토리보드 생성"
      actions={
        <>
          <Button
            className="min-w-[108px]"
            size="tiny"
            variant="outlined"
            onClick={() =>
              router.push(
                characterId
                  ? `/project/create/idea?characterId=${encodeURIComponent(characterId)}`
                  : "/project/create/idea"
              )
            }
          >
            이전
          </Button>
          <Button className="min-w-[112px]" size="tiny">
            영상 생성
          </Button>
        </>
      }
    >
      <div className="mx-auto grid w-full max-w-[1162px] grid-cols-1 gap-[18px] xl:grid-cols-[minmax(0,1fr)_320px]">
        <section className="min-w-0">
          <div className="grid grid-cols-1 gap-[12px] pr-[10px] sm:grid-cols-2 xl:grid-cols-3">
            {scenes.map((scene) => {
              const selected = scene.id === selectedScene?.id;

              return (
                <button
                  key={scene.id}
                  className={`overflow-hidden rounded-[18px] border bg-[#202026] text-left transition-colors ${
                    selected
                      ? "border-[#b347ff] shadow-[0_0_0_1px_rgba(179,71,255,0.22)]"
                      : "border-[#60606e]"
                  }`}
                  onClick={() => handleSelectScene(scene.id)}
                  type="button"
                >
                  <div className="h-[130px] overflow-hidden bg-white">
                    <img
                      alt={scene.title}
                      className="h-full w-full object-cover"
                      src={scene.imageUrl}
                    />
                  </div>
                  <div className="bg-[linear-gradient(180deg,#313137_0%,#2a2a31_100%)] px-[12px] py-[14px]">
                    <p className="text-heading-md truncate text-white">{scene.title}</p>
                    <p className="mt-[8px] text-[13px] font-medium leading-[1.45] tracking-[-0.02em] text-[#8f8f98]">
                      {scene.content}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        <aside className="top-[124px] flex min-h-[490px] flex-col rounded-[24px] border border-[#60606e] bg-[#202026] px-[16px] py-[18px] xl:sticky">
          <p className="text-heading-md text-white">
            {selectedScene?.title ?? "#1 씬 제목"}
          </p>

          <div className="mt-[18px] h-[164px] overflow-hidden rounded-[18px] bg-white">
            {selectedScene ? (
              <img
                alt={selectedScene.title}
                className="h-full w-full object-cover"
                src={selectedScene.imageUrl}
              />
            ) : null}
          </div>

          <Button
            className="mt-[14px] w-full"
            size="tiny"
            variant="outlined"
          >
            이미지 재생성
          </Button>

          <div className="pt-[22px]">
            <p className="text-heading-md text-white">내용</p>
            <div className="mt-[12px] rounded-[12px] border border-[#2d2d34] bg-[#121214] px-[16px] py-[14px]">
              <textarea
                className="text-body-lg h-[122px] w-full resize-none border-0 bg-transparent text-[#f1f1f4] outline-none placeholder:text-[#6d6d76]"
                onChange={(event) => setDraftContent(event.target.value)}
                value={draftContent}
              />
            </div>
          </div>

          <Button className="mt-auto w-full" size="tiny" onClick={handleSaveChanges}>
            변경사항 저장
          </Button>
        </aside>
      </div>
    </ProjectCreateShell>
  );
}
