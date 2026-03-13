import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "storybook/test";

import { Chip } from "@/components/ui/Chip";

const meta = {
  title: "Components/Chip",
  component: Chip,
  tags: ["autodocs"],
  args: {
    children: "text",
    onClick: fn(),
  },
  parameters: {
    backgrounds: {
      default: "app-dark",
    },
  },
} satisfies Meta<typeof Chip>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const States: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4 rounded-3xl bg-gray-900 p-6">
      <Chip state="default">기본</Chip>
      <Chip state="hovered">호버</Chip>
      <Chip state="clicked">선택됨</Chip>
    </div>
  ),
};

export const Filters: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4 rounded-3xl bg-gray-900 p-6">
      <Chip state="clicked">전체</Chip>
      <Chip state="default">영상</Chip>
      <Chip state="default">이미지</Chip>
      <Chip state="default">쇼츠</Chip>
    </div>
  ),
};
