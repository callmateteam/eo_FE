type CharacterIdeaStepProps = {
  idea: string;
  onBack: () => void;
  onChange: (value: string) => void;
  onNext: () => void;
};

export function CharacterIdeaStep({
  idea,
  onBack,
  onChange,
  onNext,
}: CharacterIdeaStepProps) {
  return (
    <section className="mx-auto w-full max-w-[1162px] rounded-[24px] border border-[#60606e] bg-[#1f1f24] px-[16px] py-[28px]">
      <div className="rounded-[18px] border border-[#42424c] bg-[#313137] px-[18px] py-[16px] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03)]">
        <textarea
          className="h-[148px] w-full resize-none border-0 bg-transparent text-[15px] font-medium leading-[1.65] text-[#f1f1f4] outline-none placeholder:text-[#8f8f98]"
          onChange={(event) => onChange(event.target.value)}
          placeholder="아이디어를 입력해주세요"
          value={idea}
        />
      </div>

      <div className="flex justify-end gap-[12px] pt-[28px]">
        <button
          className="h-[48px] min-w-[108px] rounded-full border border-[#8b45ff] px-[24px] text-[14px] font-semibold text-white transition-opacity hover:opacity-90"
          onClick={onBack}
          type="button"
        >
          이전
        </button>
        <button
          className="h-[48px] min-w-[124px] rounded-full bg-[#3b3b42] px-[24px] text-[14px] font-semibold text-[#7f7f87] transition-opacity hover:opacity-90"
          onClick={onNext}
          type="button"
        >
          스토리보드 생성
        </button>
      </div>
    </section>
  );
}
