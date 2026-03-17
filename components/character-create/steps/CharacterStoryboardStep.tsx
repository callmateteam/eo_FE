/* eslint-disable @next/next/no-img-element */

import { Icon } from "@/components/ui/Icon";

type StoryboardScene = {
  content: string;
  id: string;
  imageSrc: string;
  title: string;
};

type CharacterStoryboardStepProps = {
  onBack: () => void;
  onGenerateVideo: () => void;
  onSceneContentChange: (value: string) => void;
  onSelectScene: (sceneId: string) => void;
  scenes: StoryboardScene[];
  selectedSceneId: string;
  showToast: boolean;
};

export function CharacterStoryboardStep({
  onBack,
  onGenerateVideo,
  onSceneContentChange,
  onSelectScene,
  scenes,
  selectedSceneId,
  showToast,
}: CharacterStoryboardStepProps) {
  const selectedScene =
    scenes.find((scene) => scene.id === selectedSceneId) ?? scenes[0];

  return (
    <div className="relative mx-auto w-full max-w-[1162px]">
      <div className="grid grid-cols-1 gap-[18px] xl:grid-cols-[minmax(0,1fr)_320px]">
        <section className="min-w-0">
          <div className="grid grid-cols-1 gap-[12px] pr-[10px] sm:grid-cols-2 xl:grid-cols-3">
            {scenes.map((scene) => {
              const isSelected = scene.id === selectedScene?.id;

              return (
                <button
                  key={scene.id}
                  className={`overflow-hidden rounded-[18px] border bg-[#202026] text-left transition-colors ${
                    isSelected
                      ? "border-[#b347ff] shadow-[0_0_0_1px_rgba(179,71,255,0.22)]"
                      : "border-[#60606e]"
                  }`}
                  onClick={() => onSelectScene(scene.id)}
                  type="button"
                >
                  <div className="h-[130px] overflow-hidden bg-white">
                    <img
                      alt={scene.title}
                      className="h-full w-full object-cover"
                      src={scene.imageSrc}
                    />
                  </div>
                  <div className="bg-[linear-gradient(180deg,#313137_0%,#2a2a31_100%)] px-[12px] py-[14px]">
                    <p className="truncate text-[18px] font-semibold text-white">
                      {scene.title}
                    </p>
                    <p className="mt-[8px] line-clamp-3 text-[13px] font-medium leading-[1.45] tracking-[-0.02em] text-[#8f8f98]">
                      {scene.content}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        <aside className="flex min-h-[490px] flex-col rounded-[24px] border border-[#60606e] bg-[#202026] px-[16px] py-[18px]">
          <p className="text-[20px] font-semibold text-white">
            {selectedScene?.title ?? "#1 씬 제목"}
          </p>

          <div className="mt-[18px] h-[164px] overflow-hidden rounded-[18px] bg-white">
            {selectedScene ? (
              <img
                alt={selectedScene.title}
                className="h-full w-full object-cover"
                src={selectedScene.imageSrc}
              />
            ) : null}
          </div>

          <button
            className="mt-[14px] flex h-[48px] w-full items-center justify-center gap-2 rounded-full border border-[#8b45ff] text-[14px] font-semibold text-white transition-opacity hover:opacity-90"
            type="button"
          >
            <Icon className="size-5" name="redo" />
            이미지 재생성
          </button>

          <div className="pt-[22px]">
            <p className="text-[20px] font-semibold text-white">내용</p>

            <div className="mt-[12px] rounded-[12px] border border-[#2d2d34] bg-[#121214] px-[16px] py-[14px]">
              <textarea
                className="h-[122px] w-full resize-none border-0 bg-transparent text-[15px] leading-[1.6] text-[#f1f1f4] outline-none placeholder:text-[#6d6d76]"
                onChange={(event) => onSceneContentChange(event.target.value)}
                value={selectedScene?.content ?? ""}
              />
            </div>
          </div>

          <button
            className="mt-auto h-[48px] w-full rounded-full bg-[linear-gradient(90deg,#8b45ff_0%,#ba4eff_100%)] text-[14px] font-semibold text-white shadow-[0_0_18px_rgba(186,78,255,0.28)] transition-opacity hover:opacity-90"
            type="button"
          >
            변경사항 저장
          </button>
        </aside>
      </div>

      <div className="flex items-center justify-end gap-[10px] pt-[12px]">
        <button
          className="h-[48px] min-w-[108px] rounded-full border border-[#8b45ff] px-[24px] text-[14px] font-semibold text-white transition-opacity hover:opacity-90"
          onClick={onBack}
          type="button"
        >
          이전
        </button>
        <button
          className="h-[48px] min-w-[124px] rounded-full bg-[linear-gradient(90deg,#8b45ff_0%,#ba4eff_100%)] px-[24px] text-[14px] font-semibold text-white shadow-[0_0_18px_rgba(186,78,255,0.28)] transition-opacity hover:opacity-90"
          onClick={onGenerateVideo}
          type="button"
        >
          영상 생성
        </button>
      </div>

      {showToast ? (
        <div className="pointer-events-none absolute bottom-[22px] left-0 flex h-[64px] w-[292px] items-center gap-[12px] rounded-[18px] bg-[linear-gradient(90deg,#8b45ff_0%,#ba4eff_100%)] px-[18px] shadow-[0_20px_50px_rgba(136,60,255,0.35)]">
          <span className="flex size-[26px] items-center justify-center rounded-full bg-[#2c2c31] text-white">
            <Icon className="size-4" name="check" />
          </span>
          <span className="text-[14px] font-semibold text-white">
            스토리보드 생성이 완료되었어요
          </span>
        </div>
      ) : null}
    </div>
  );
}
