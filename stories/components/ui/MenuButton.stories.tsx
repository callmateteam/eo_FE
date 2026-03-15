import type { Meta, StoryObj } from "@storybook/nextjs";

import { MenuButton } from "@/components/ui/MenuButton";

const meta = {
  title: "Components/MenuButton",
  component: MenuButton,
  tags: ["autodocs"],
  parameters: {
    backgrounds: {
      default: "app-dark",
    },
  },
} satisfies Meta<typeof MenuButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const States: Story = {
  render: () => (
    <div className="flex gap-4 rounded-3xl bg-gray-900 p-6">
      <MenuButton state="default">text</MenuButton>
      <MenuButton state="hovered">text</MenuButton>
      <MenuButton state="pressed">text</MenuButton>
    </div>
  ),
};
