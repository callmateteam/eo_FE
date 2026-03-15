import type { Meta, StoryObj } from "@storybook/nextjs";

import { ResetButton } from "@/components/ui/ResetButton";

const meta = {
  title: "Components/ResetButton",
  component: ResetButton,
  tags: ["autodocs"],
  parameters: {
    backgrounds: {
      default: "app-dark",
    },
  },
} satisfies Meta<typeof ResetButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const States: Story = {
  render: () => (
    <div className="flex gap-4 rounded-3xl bg-gray-900 p-6">
      <ResetButton state="default" />
      <ResetButton state="hovered" />
      <ResetButton state="clicked" />
    </div>
  ),
};
