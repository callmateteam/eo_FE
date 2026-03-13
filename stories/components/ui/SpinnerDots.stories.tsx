import type { Meta, StoryObj } from "@storybook/nextjs";

import { SpinnerDots } from "@/components/ui/SpinnerDots";

const meta = {
  title: "Components/SpinnerDots",
  component: SpinnerDots,
  tags: ["autodocs"],
  parameters: {
    backgrounds: {
      default: "app-dark",
    },
  },
} satisfies Meta<typeof SpinnerDots>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithSpacing: Story = {
  render: () => (
    <div className="flex items-center gap-4 rounded-3xl bg-gray-900 p-6 text-gray-50">
      <SpinnerDots />
      <span className="text-body-lg">로딩 중</span>
    </div>
  ),
};
