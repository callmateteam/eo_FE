import type { Meta, StoryObj } from "@storybook/nextjs";

import { ProjectCreateCard } from "@/components/ui/ProjectCreateCard";

const meta = {
  title: "Components/ProjectCreateCard",
  component: ProjectCreateCard,
  tags: ["autodocs"],
  parameters: {
    backgrounds: {
      default: "app-dark",
    },
  },
} satisfies Meta<typeof ProjectCreateCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Compact: Story = {
  args: {
    label: "새 캐릭터 생성",
    size: "compact",
  },
};
