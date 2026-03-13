import type { Meta, StoryObj } from "@storybook/nextjs";

const typographyRows = [
  ["text-display-lg", "입문자부터 전문가까지 쉽게 영상을 제작하세요"],
  ["text-display-md", "AI가 만드는 새로운 영상 제작"],
  ["text-display-sm", "Easy & Only"],
  ["text-heading-xl", "지금 시작하고, 첫 영상을 무료로 만들어보세요"],
  ["text-heading-lg", "AI 스토리보드"],
  ["text-heading-md", "아이디어 기획 2-3줄만 입력하면 스토리보드를 생성합니다."],
  ["text-body-lg", "이제 이미지만 넣으면 AI가 쇼츠도 만들어준다?"],
  ["text-body-md", "보조 설명 문구와 카드 설명 텍스트에 사용합니다."],
  ["text-label-md", "회원가입 / 로그인"],
  ["text-caption-md", "Common Components Showcase"],
  ["text-caption-sm", "보조 캡션"],
] as const;

function TypographyShowcase() {
  return (
    <div className="min-w-[960px] space-y-4 bg-gray-900 p-10 text-gray-50">
      {typographyRows.map(([className, text]) => (
        <div
          key={className}
          className="grid grid-cols-[220px_minmax(0,1fr)] gap-6 rounded-3xl border border-white/10 bg-gray-800 px-6 py-5"
        >
          <div className="text-body-md text-gray-300">{className}</div>
          <div className={className}>{text}</div>
        </div>
      ))}
    </div>
  );
}

const meta = {
  title: "Foundation/Typography",
  component: TypographyShowcase,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof TypographyShowcase>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
