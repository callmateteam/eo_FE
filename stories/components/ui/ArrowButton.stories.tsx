import type { Meta, StoryObj } from "@storybook/nextjs";

import { ArrowButton } from "@/components/ui/ArrowButton";

const meta = {
  title: "Components/ArrowButton",
  component: ArrowButton,
  tags: ["autodocs"],
  parameters: {
    backgrounds: {
      default: "app-dark",
    },
  },
} satisfies Meta<typeof ArrowButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Gallery: Story = {
  render: () => (
    <div className="flex gap-4 rounded-3xl bg-gray-900 p-6">
      <ArrowButton direction="left" state="default" />
      <ArrowButton direction="left" state="hovered" />
      <ArrowButton direction="right" state="pressed" />
    </div>
  ),
};
