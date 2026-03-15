import type { Meta, StoryObj } from "@storybook/nextjs";

import { PlusButton } from "@/components/ui/PlusButton";

const meta = {
  title: "Components/PlusButton",
  component: PlusButton,
  tags: ["autodocs"],
  parameters: {
    backgrounds: {
      default: "app-dark",
    },
  },
} satisfies Meta<typeof PlusButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const States: Story = {
  render: () => (
    <div className="flex gap-4 rounded-3xl bg-gray-900 p-6">
      <PlusButton state="default" />
      <PlusButton state="hovered" />
      <PlusButton state="pressed" />
    </div>
  ),
};
