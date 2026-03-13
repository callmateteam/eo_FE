import type { Meta, StoryObj } from "@storybook/nextjs";

import { StepBar } from "@/components/ui/StepBar";

const meta = {
  title: "Components/StepBar",
  component: StepBar,
  tags: ["autodocs"],
  args: {
    steps: [
      { label: "입력", state: "now" },
      { label: "생성", state: "default" },
      { label: "완료", state: "default" },
    ],
  },
  parameters: {
    backgrounds: {
      default: "app-dark",
    },
  },
} satisfies Meta<typeof StepBar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const ThreeSteps: Story = {};

export const CurrentAtSecond: Story = {
  args: {
    steps: [
      { label: "입력", state: "default" },
      { label: "생성", state: "now" },
      { label: "완료", state: "default" },
    ],
  },
};
