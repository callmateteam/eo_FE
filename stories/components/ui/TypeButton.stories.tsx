import type { Meta, StoryObj } from "@storybook/nextjs";

import { TypeButton } from "@/components/ui/TypeButton";

const meta = {
  title: "Components/TypeButton",
  component: TypeButton,
  tags: ["autodocs"],
  parameters: {
    backgrounds: {
      default: "app-dark",
    },
  },
} satisfies Meta<typeof TypeButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const States: Story = {
  render: () => (
    <div className="flex gap-5 rounded-3xl bg-gray-900 p-6">
      <TypeButton state="default" />
      <TypeButton state="hovered" />
      <TypeButton state="clicked" />
    </div>
  ),
};
